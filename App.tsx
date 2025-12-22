import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { INITIAL_DATA, ReportData } from './types';
import { ReportForm } from './components/ReportForm';
import { ReportPreview } from './components/ReportPreview';
import { generateTechnicalReport } from './services/aiService';
import { themes } from './themes';
import { Download, Mail, Share2, CheckCircle2, Loader2, Moon, Sun, Save, LogOut, User as UserIcon } from 'lucide-react';
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
import { PublicReportViewer } from './components/PublicReportViewer';

const AppContent: React.FC = () => {
  const { currentUser, logout } = useAuth();

  // Check for Public Link (Verification)
  const urlParams = new URLSearchParams(window.location.search);
  const refId = urlParams.get('ref');

  if (refId) {
    return <PublicReportViewer reportId={refId} />;
  }

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

  // Tutorial State
  const [runTour, setRunTour] = useState(false);

  // Theme State
  const [currentThemeId, setCurrentThemeId] = useState('light');

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
            setShowOnboarding(true);
          } else {
            // Check if user just logged in (and not just refreshed)
            const isJustLoggedIn = sessionStorage.getItem('just_logged_in');
            if (isJustLoggedIn) {
              setShowWelcome(true);
              sessionStorage.removeItem('just_logged_in');
            }
          }
        } else {
          // New user: Create ephemeral profile so UI works
          setUserProfile({
            uid: currentUser.id,
            displayName: currentUser.displayName || '',
            email: currentUser.email || '',
            hasCompletedOnboarding: false
          });
          setShowOnboarding(true);
        }
      });
    }
  }, [currentUser]);

  // 3. Auto-fill technician Name
  useEffect(() => {
    if (userProfile && viewMode === 'editor') {
      // Only auto-fill if the name is generic or empty to avoid overwriting edits
      if (data.technicianName === 'Técnico Responsável' || data.technicianName === '') {
        setData(prev => ({
          ...prev,
          technicianName: `${userProfile.displayName}${userProfile.jobTitle ? ' - ' + userProfile.jobTitle : ''}`
        }));
      }
    }
  }, [userProfile, viewMode, data.technicianName]);


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

  // Onboarding Handler
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

    // Start Tutorial
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

  // Joyride Steps
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

  // Navigation Actions
  const handleGoToDashboard = () => {
    setViewMode('dashboard');
  };

  const handleCreateNew = () => {
    setData(INITIAL_DATA);
    setViewMode('editor');
  };

  const handleViewReport = (report: any) => {
    const { id, userId, createdAt, ...formData } = report;
    setData(formData);
    setViewMode('editor');
  };

  const handleCloneReport = (report: any) => {
    const { id, userId, createdAt, ...formData } = report;
    setData(formData);
    setViewMode('editor');
    showNotification("Laudo clonado! Agora é só salvar.");
  };

  const handleDataChange = (key: keyof ReportData, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenerateAI = async () => {
    const hasContent = data.fullDescription.trim();
    if (!hasContent) return;

    setIsGenerating(true);
    try {
      const notes = data.fullDescription;
      const context = `Dispositivo: ${data.deviceType} ${data.model}. Empresa: Proxxima Telecom.`;
      const result = await generateTechnicalReport(notes, context);

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
    const element = document.getElementById('report-preview-content');
    if (!element) return;

    setIsDownloading(true);

    const filename = `LAUDO_PROXXIMA_${data.model.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}_${new Date().toISOString().split('T')[0]}.pdf`;

    const opt = {
      margin: 0,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      // @ts-ignore
      await window.html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("Erro PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSaveFirestore = async () => {
    if (!currentUser) return;
    setIsSaving(true);
    try {
      await saveReport(currentUser.id, data);

      // Celebration!
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

      {/* Tutorial Joyride */}
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

      {/* Profile Modal */}
      {userProfile && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          currentUser={userProfile}
          onUpdate={handleUpdateProfile}
        />
      )}

      {/* Onboarding & Welcome Overlay */}
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingScreen onComplete={handleOnboardingComplete} />
        )}
        {showWelcome && userProfile && (
          <WelcomeBackScreen
            name={userProfile.displayName}
            onComplete={() => setShowWelcome(false)}
          />
        )}
      </AnimatePresence>

      {/* Header Corporativo - Adaptação Dark Mode */}
      <header className="tour-dashboard-header bg-paper border-b border-line h-16 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm relative transition-colors duration-300">
        <div className="flex items-center gap-4">
          <div className="p-1 px-2 cursor-pointer" onClick={handleGoToDashboard}>
            <img
              src="https://www.proxxima.net/storage/app/uploads/public/5ea/1f7/af7/5ea1f7af72b2c773156463.svg"
              alt="Proxxima Logo"
              className="h-8 md:h-10 w-auto object-contain transition-all duration-300"
            />
          </div>
          <div className="hidden md:block h-6 w-px bg-line"></div>
          <h1 className="hidden md:block text-[10px] text-primary font-bold uppercase tracking-widest mt-1">
            {viewMode === 'dashboard' ? 'Painel de Controle' : 'Gerador de Laudos'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-surface rounded-full transition text-secondary border border-transparent hover:border-line"
            title={currentThemeId === 'light' ? "Mudar para Modo Escuro" : "Mudar para Modo Claro"}
          >
            {currentThemeId === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-yellow-400" />}
          </button>

          {viewMode === 'editor' && (
            <>
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-surface rounded-md transition text-secondary hover:text-primary border border-transparent hover:border-line"
                title={currentThemeId === 'light' ? 'Alternar para Modo Escuro' : 'Alternar para Modo Claro'}
              >
                {currentThemeId === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              <button
                onClick={handleSaveFirestore}
                disabled={isSaving}
                className="p-2 hover:bg-surface rounded-md transition text-secondary hover:text-primary border border-transparent hover:border-line"
                title="Salvar Laudo"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              </button>

              <button
                onClick={handleCopy}
                className="p-2 hover:bg-surface rounded-md transition text-secondary hover:text-primary border border-transparent hover:border-line"
                title="Copiar Resumo"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleEmail}
                className="p-2 hover:bg-surface rounded-md transition text-secondary hover:text-primary border border-transparent hover:border-line"
                title="Enviar por Email"
              >
                <Mail className="w-5 h-5" />
              </button>

              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:opacity-90 text-white rounded shadow-sm transition text-sm font-semibold disabled:opacity-50"
              >
                {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>Gerar PDF</span>
              </button>
            </>
          )}

          <div className="h-6 w-px bg-line mx-1"></div>

          {/* Back Button (Only in Editor) */}
          {viewMode === 'editor' && (
            <button
              onClick={handleGoToDashboard}
              className="p-2 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-md transition border border-transparent text-xs font-semibold px-3"
            >
              Voltar
            </button>
          )}

          {/* User Profile Button */}
          <button
            onClick={() => setShowProfileModal(true)}
            className="p-2 hover:bg-surface text-secondary hover:text-primary rounded-md transition border border-transparent"
            title="Meu Perfil"
          >
            <UserIcon className="w-5 h-5" />
          </button>

          {/* Logout (Visible in Dashboard mostly, but kept in header) */}
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-red-50 text-secondary hover:text-red-500 rounded-md transition border border-transparent"
            title="Sair"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Areas */}

      {viewMode === 'dashboard' ? (
        <Dashboard
          onCreateNew={handleCreateNew}
          onViewReport={handleViewReport}
          onCloneReport={handleCloneReport}
        />
      ) : (
        <main className="flex-1 flex overflow-hidden relative">

          {/* Sidebar Esquerda: Formulário */}
          <div className="w-full md:w-[450px] lg:w-[480px] shrink-0 p-0 overflow-hidden border-r border-line bg-paper z-10 flex flex-col shadow-xl transition-colors duration-300">
            <div className="p-6 overflow-y-auto h-full scrollbar-thin">
              <ReportForm
                data={data}
                onChange={handleDataChange}
                onGenerateAI={handleGenerateAI}
                isGenerating={isGenerating}
              />
            </div>
          </div>

          {/* Área Principal: Preview */}
          <div className="flex-1 overflow-auto p-8 flex justify-center items-start">
            <div className="origin-top scale-[0.75] lg:scale-[0.85] xl:scale-100 transition-all shadow-2xl mt-4">
              <ReportPreview data={data} />
            </div>
          </div>

        </main>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-primary text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-fade-in-up z-50 border border-white/10">
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