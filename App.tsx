import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { INITIAL_DATA, ReportData, generateRefId } from './types';
import { ReportForm } from './components/ReportForm';
import { ReportPreview } from './components/ReportPreview';
import { PreviewModal } from './components/PreviewModal';
import { generateTechnicalReport } from './services/aiService';
import { themes } from './themes';
import { Download, Mail, Share2, CheckCircle2, Loader2, Moon, Sun, Save, LogOut, User as UserIcon, Eye, EyeOff, ChevronLeft } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginScreen } from './components/LoginScreen';
import { saveReport, getUserProfile, updateUserProfile, UserProfile } from './services/supabaseService';
import { Dashboard } from './components/Dashboard';
import { OnboardingScreen } from './components/OnboardingScreen';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import confetti from 'canvas-confetti';
import { ProfileModal } from './components/ProfileModal';
import { LandingPage } from './components/LandingPage';
import { WelcomeBackScreen } from './components/WelcomeBackScreen';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { PublicReportViewer } from './components/PublicReportViewer';
import { useAutoSave } from './hooks/useAutoSave';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import html2canvas from 'html2canvas';

const AppContent: React.FC = () => {
  const { currentUser, logout } = useAuth();

  // Check for Public Link (Verification)
  const urlParams = new URLSearchParams(window.location.search);
  const refId = urlParams.get('ref');



  // View Mode
  const [viewMode, setViewMode] = useState<'dashboard' | 'editor'>('dashboard');

  // Data State
  const [data, setData] = useState<ReportData>(INITIAL_DATA);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // UI State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [showLanding, setShowLanding] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);



  // Tutorial State
  const [runTour, setRunTour] = useState(false);

  // Theme State
  const [currentThemeId, setCurrentThemeId] = useState('light');

  // Preview Modal State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Auto Save Hook
  const { checkDraft, clearDraft } = useAutoSave(data, setData);

  // Mobile Tabs State
  const [activeMobileTab, setActiveMobileTab] = useState<'edit' | 'preview'>('edit');

  // Check for saved draft on mount (only log for now, or could restore)
  useEffect(() => {
    // Logic for checking draft can go here
  }, [checkDraft]);

  // Shortcuts
  useKeyboardShortcuts([
    {
      key: 's',
      ctrl: true,
      action: () => {
        if (viewMode === 'editor') handleSaveFirestore();
      },
      preventDefault: true
    },
    {
      key: 'enter',
      ctrl: true,
      action: () => {
        if (viewMode === 'editor' && !isGenerating) handleGenerateAI();
      },
      preventDefault: true
    },
    {
      key: 'escape',
      action: () => {
        if (showProfileModal) setShowProfileModal(false);
        if (showToast) setShowToast(false);
      }
    }
  ]);

  // 1. System Theme Detection
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setCurrentThemeId(mediaQuery.matches ? 'dark' : 'light');

    const handler = (e: MediaQueryListEvent) => setCurrentThemeId(e.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Apply Theme Colors
  useEffect(() => {
    const theme = themes.find(t => t.id === currentThemeId) || themes[0];
    const root = document.documentElement;

    // Toggle 'dark' class for Tailwind
    if (currentThemeId === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-surface', theme.colors.surface);
    root.style.setProperty('--color-paper', theme.colors.paper);
    root.style.setProperty('--color-text', theme.colors.text);
    root.style.setProperty('--color-border', theme.colors.border);
  }, [currentThemeId]);

  // 2. Fetch User Profile
  useEffect(() => {
    if (currentUser) {
      getUserProfile(currentUser.id).then((profile) => {
        if (profile) {
          setUserProfile(profile);
          if (!profile.hasCompletedOnboarding) {
            // First time login flow
            // 1. Show Welcome (First Login version)
            // 2. Then Change Password
            // 3. Then Onboarding
            setShowWelcome(true);
            // Note: Onboarding and Change Password triggers are handled after welcome completes or in sequence
          } else {
            const isJustLoggedIn = sessionStorage.getItem('just_logged_in');
            if (isJustLoggedIn) {
              setShowWelcome(true);
              sessionStorage.removeItem('just_logged_in');
            }
          }
        } else {
          setUserProfile({
            uid: currentUser.id,
            displayName: currentUser.displayName || '',
            email: currentUser.email || '',
            hasCompletedOnboarding: false
          });
          // Also trigger welcome if profile is missing (brand new user)
          setShowWelcome(true);
        }
      });
    }
  }, [currentUser]);

  // 3. Auto-fill technician Name
  useEffect(() => {
    if (userProfile && viewMode === 'editor') {
      if (data.technicianName === 'Técnico Responsável' || data.technicianName === '') {
        setData(prev => ({
          ...prev,
          technicianName: `${userProfile.displayName}${userProfile.jobTitle ? ' - ' + userProfile.jobTitle : ''}`
        }));
      }
    }
  }, [userProfile, viewMode, data.technicianName]);



  if (refId) {
    return <PublicReportViewer reportId={refId} />;
  }

  if (!currentUser) {
    if (showLanding) {
      return <LandingPage onEnter={() => setShowLanding(false)} />;
    }
    return <LoginScreen />;
  }

  const toggleTheme = () => {
    setCurrentThemeId(prev => prev === 'light' ? 'dark' : 'light');
  };

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleOnboardingComplete = async (profileData: Partial<UserProfile>) => {
    if (!currentUser) return;
    const newProfile = {
      uid: currentUser.id,
      email: currentUser.email || '',
      displayName: profileData.displayName || '',
      jobTitle: profileData.jobTitle || '',
      hasCompletedOnboarding: true
    };
    await updateUserProfile(currentUser.id, newProfile);
    setUserProfile(newProfile);
    setShowOnboarding(false);
    setTimeout(() => setRunTour(true), 500);
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    showNotification("Perfil atualizado com sucesso!");
  };

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      setRunTour(false);
    }
  };

  const tourSteps: Step[] = [
    {
      target: '.tour-dashboard-header',
      content: 'Bem-vindo ao seu novo Painel de Controle! Aqui você gerencia tudo.',
      disableBeacon: true,
    },
    {
      target: '.tour-new-report',
      content: 'Clique aqui para criar um novo laudo técnico do zero.',
    },
    {
      target: '.tour-tabs',
      content: 'Navegue entre seus laudos, histórico geral e análises de BI por aqui.',
    },
    {
      target: '.tour-search',
      content: 'Precisa achar um laudo antigo? Busque pelo ID aqui.',
    }
  ];

  const handleGoToDashboard = () => {
    setViewMode('dashboard');
  };

  const handleCreateNew = () => {
    setData({ ...INITIAL_DATA, refId: generateRefId() });
    setViewMode('editor');
    // Check for draft restoration could go here
  };

  const handleViewReport = (report: any) => {
    const { id, userId, createdAt, ...formData } = report;
    setData(formData);
    setViewMode('editor');
  };

  const handleCloneReport = (report: any) => {
    const { id, userId, createdAt, ...formData } = report;
    setData({ ...formData, refId: generateRefId() });
    setViewMode('editor');
    showNotification("Laudo clonado! Agora é só salvar.");
  };

  const handleDataChange = (key: keyof ReportData, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };



  const handleGenerateAI = async () => {
    const hasContent = data.fullDescription.trim();
    if (!hasContent) return;

    setActiveMobileTab('preview');
    setIsGenerating(true);
    try {
      const notes = data.fullDescription;
      const context = `Dispositivo: ${data.deviceType} ${data.model}. Empresa: Proxxima Telecom.`;

      // Passa fotos para a IA (Visão Computacional)
      const result = await generateTechnicalReport(notes, context, data.photos, 'técnico'); // Default 'técnico' for now

      setData(prev => ({
        ...prev,
        reportedDefect: result.defect,
        technicalAnalysis: result.analysis,
        recommendation: result.recommendation
      }));
    } catch (e) {
      alert("Erro ao conectar com a IA. Verifique sua chave de API.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    // Target the hidden element instead of the modal one
    const element = document.getElementById('report-preview-hidden');
    if (!element) {
      console.error("Elemento de preview não encontrado");
      return;
    }

    const footerElement = element.querySelector('#report-footer') as HTMLElement;
    if (!footerElement) {
      console.error("Footer não encontrado");
      return;
    }

    setIsDownloading(true);
    const filename = `LAUDO_PROXXIMA_${data.model.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}_${new Date().toISOString().split('T')[0]}.pdf`;

    try {
      // 1. Capture the footer as an image
      const canvas = await html2canvas(footerElement, { scale: 2, useCORS: true });
      const footerImgData = canvas.toDataURL('image/png');

      // 2. Hide footer in the DOM content to avoid duplication (we will re-add it manually)
      const originalDisplay = footerElement.style.display;
      footerElement.style.display = 'none';

      // 3. Generate PDF with bottom margin for footer
      const opt = {
        margin: [0, 0, 40, 0], // Top, Right, Bottom, Left (mm). Added 40mm bottom for footer
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        enableLinks: true,
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // @ts-ignore
      await window.html2pdf().set(opt).from(element).toPdf().get('pdf').then((pdf) => {
        const totalPages = pdf.internal.getNumberOfPages();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Desired footer height in mm
        // Desired footer height in mm
        const drawnFooterHeight = 45; // slightly less than margin (increased for better QR scan)
        const barHeight = 2.5; // ~8px

        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);

          // Draw Top Bar (Pink Proxxima: #E32085)
          pdf.setFillColor(227, 32, 133);
          pdf.rect(0, 0, pageWidth, barHeight, 'F');

          // Draw Bottom Bar (Blue Proxxima: #2B388C)
          pdf.setFillColor(43, 56, 140);
          pdf.rect(0, pageHeight - barHeight, pageWidth, barHeight, 'F');

          // Add footer image at the bottom, just above the bottom bar
          pdf.addImage(footerImgData, 'PNG', 0, pageHeight - drawnFooterHeight - barHeight, pageWidth, drawnFooterHeight);

          // Add Clickable Link over the QR Code / Validation Text area
          const linkUrl = `${window.location.origin}/?ref=${data.refId || data.id}`;
          pdf.link(10, pageHeight - drawnFooterHeight - barHeight + 5, 80, 40, { url: linkUrl });
        }
      }).save();

      // 4. Restore footer visibility
      footerElement.style.display = originalDisplay;

    } catch (error) {
      console.error("Erro PDF:", error);
      alert("Erro ao gerar PDF: " + error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSaveFirestore = async () => {
    if (!currentUser) return;
    setIsSaving(true);
    try {
      await saveReport(currentUser.id, data);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      showNotification("Laudo salvo com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar laudo.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEmail = () => {
    const subject = `Laudo Técnico [PROXXIMA]: ${data.deviceType} - ${data.requesterName}`;
    const body = `
Prezados,

Segue laudo técnico do equipamento analisado.

EQUIPAMENTO: ${data.deviceType} ${data.model}
SOLICITANTE: ${data.requesterName}
PATRIMÔNIO: ${data.patrimonyId}

RESUMO TÉCNICO:
${data.recommendation}

Atenciosamente,

${data.technicianName}
Proxxima Telecom
    `.trim();
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleCopy = () => {
    const text = `PROXXIMA - LAUDO TÉCNICO\n\nEquipamento: ${data.model}\nDiag: ${data.technicalAnalysis}\nSolução: ${data.recommendation}`;
    navigator.clipboard.writeText(text);
    showNotification("Copiado para a área de transferência!");
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col h-screen overflow-hidden bg-surface transition-colors duration-300">

      <Joyride
        steps={tourSteps}
        run={runTour && viewMode === 'dashboard'}
        continuous
        showSkipButton
        showProgress
        styles={{
          options: {
            primaryColor: '#8B5CF6',
            zIndex: 10000,
          }
        }}
        callback={handleJoyrideCallback}
      />

      {userProfile && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          currentUser={userProfile}
          onUpdate={handleUpdateProfile}
        />
      )}

      <AnimatePresence>
        {showChangePassword && (
          <ChangePasswordModal onComplete={() => {
            setShowChangePassword(false);
            setShowOnboarding(true);
          }} />
        )}
        {showOnboarding && !showChangePassword && (
          <OnboardingScreen onComplete={handleOnboardingComplete} />
        )}
        {showWelcome && userProfile && (
          <WelcomeBackScreen
            name={userProfile.displayName}
            isFirstLogin={!userProfile.hasCompletedOnboarding}
            onComplete={() => {
              setShowWelcome(false);
              if (!userProfile.hasCompletedOnboarding) {
                setShowChangePassword(true);
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="tour-dashboard-header glass-strong border-b border-white/5 h-16 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm relative transition-all duration-300 sticky top-0">
        <div className="flex items-center gap-4">
          <div className="p-1 px-2 cursor-pointer" onClick={handleGoToDashboard}>
            <img
              src="https://www.proxxima.net/storage/app/uploads/public/5ea/1f7/af7/5ea1f7af72b2c773156463.svg"
              alt="Proxxima Logo"
              className="h-8 md:h-10 w-auto object-contain transition-all duration-300"
            />
          </div>
          <div className="hidden md:block h-6 w-px bg-white/10"></div>
          <h1 className="hidden md:block text-[10px] text-primary font-bold uppercase tracking-widest mt-1">
            {viewMode === 'dashboard' ? 'Painel de Controle' : 'Gerador de Laudos'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-white/10 rounded-full transition text-secondary border border-transparent hover:border-white/10"
            title={currentThemeId === 'light' ? "Mudar para Modo Escuro" : "Mudar para Modo Claro"}
          >
            {currentThemeId === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-yellow-400" />}
          </button>

          {viewMode === 'editor' && (
            <>
              <div className="h-6 w-px bg-white/10 mx-1"></div>

              <button
                onClick={handleCopy}
                className="p-2 hover:bg-white/10 rounded-md transition text-secondary hover:text-primary border border-transparent hover:border-white/10"
                title="Copiar Resumo"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </>
          )}

          <div className="h-6 w-px bg-white/10 mx-1"></div>

          {viewMode === 'editor' && (
            <button
              onClick={handleGoToDashboard}
              className="p-2 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-md transition border border-transparent text-xs font-semibold px-3"
            >
              Voltar
            </button>
          )}

          <button
            onClick={() => setShowProfileModal(true)}
            className="p-2 hover:bg-white/10 text-secondary hover:text-primary rounded-md transition border border-transparent"
            title="Meu Perfil"
          >
            <UserIcon className="w-5 h-5" />
          </button>

          <button
            onClick={handleLogout}
            className="p-2 hover:bg-red-500/10 text-secondary hover:text-red-500 rounded-md transition border border-transparent"
            title="Sair"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>


      {/* Mobile Tabs */}
      {viewMode === 'editor' && (
        <div className="md:hidden flex border-b border-white/5 bg-paper shrink-0">
          <button
            onClick={() => setActiveMobileTab('edit')}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${activeMobileTab === 'edit' ? 'text-primary' : 'text-secondary'}`}
          >
            Editar
            {activeMobileTab === 'edit' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-fade-in" />}
          </button>
          <button
            onClick={() => setActiveMobileTab('preview')}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${activeMobileTab === 'preview' ? 'text-primary' : 'text-secondary'}`}
          >
            Visualizar
            {activeMobileTab === 'preview' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-fade-in" />}
          </button>
        </div>
      )}

      {/* Main Content Areas */}
      {viewMode === 'dashboard' ? (
        <Dashboard
          onCreateNew={handleCreateNew}
          onViewReport={handleViewReport}
          onCloneReport={handleCloneReport}
        />
      ) : (
        <main className="flex-1 flex overflow-hidden relative justify-center bg-surface">

          <div className="w-full max-w-5xl p-4 md:p-8 h-full flex flex-col">

            <ReportForm
              data={data}
              onChange={handleDataChange}
              onGenerateAI={handleGenerateAI}
              isGenerating={isGenerating}
              onSave={handleSaveFirestore}
              onPrint={handleDownloadPDF}
              onEmail={handleEmail}
              onPreview={() => setIsPreviewOpen(true)}
            />
          </div>

          <PreviewModal
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            data={data}
          />

        </main>
      )}

      {/* Hidden Report Preview for PDF Generation */}
      {viewMode === 'editor' && (
        <div style={{ position: 'fixed', left: '-9999px', top: 0 }}>
          <ReportPreview
            data={data}
            isGenerating={false}
            elementId="report-preview-hidden"
          />
        </div>
      )}
      {/* 
        Wait, I can't easily change ReportPreview props without checking usage.
        It is used in PreviewModal as well.
        
        Let's modify ReportPreview to accept an optional `elementId` prop.
        Default it to 'report-preview-content'.
      */}

      {showToast && (
        <div className="fixed bottom-6 right-6 glass-strong text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-fade-in-up z-50 border border-white/10">
          <CheckCircle2 className="w-5 h-5 text-accent" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;