import React, { useState, useEffect } from 'react';
import { INITIAL_DATA, ReportData } from './types';
import { ReportForm } from './components/ReportForm';
import { ReportPreview } from './components/ReportPreview';
import { generateTechnicalReport } from './services/aiService';
import { themes } from './themes';
import { Download, Mail, Share2, CheckCircle2, Loader2, Moon, Sun } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<ReportData>(INITIAL_DATA);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Theme State (Default to Light)
  const [currentThemeId, setCurrentThemeId] = useState('light');

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

  const toggleTheme = () => {
    setCurrentThemeId(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleDataChange = (key: keyof ReportData, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenerateAI = async () => {
    // Use fullDescription as the source for AI generation
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

    // Nome do arquivo padronizado Proxxima
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
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col h-screen overflow-hidden bg-surface transition-colors duration-300">

      {/* Header Corporativo - Adaptação Dark Mode */}
      <header className="bg-paper border-b border-line h-16 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm relative transition-colors duration-300">
        <div className="flex items-center gap-4">
          {/* Logo Image - Sempre visível, fundo branco adicionado para garantir contraste no modo escuro se necessário, mas aqui a barra muda de cor.
               Se a barra for escura, o logo (roxo/azul) pode não aparecer bem. 
               Para Proxxima, o logo tem texto escuro. Em Dark Mode, precisamos de um fundo claro atrás do logo ou uma versão branca.
               Vou colocar um bg-white arredondado sutil atrás do logo apenas no dark mode, ou manter o header sempre claro?
               O pedido foi tema da aplicação. Vou deixar o header seguir o tema (dark) e adicionar um container branco no logo.
           */}
          <div className="p-1 px-2">
            <img
              src="https://www.proxxima.net/storage/app/uploads/public/5ea/1f7/af7/5ea1f7af72b2c773156463.svg"
              alt="Proxxima Logo"
              className="h-8 md:h-10 w-auto object-contain transition-all duration-300"
            />
          </div>
          <div className="hidden md:block h-6 w-px bg-line"></div>
          <p className="hidden md:block text-[10px] text-primary font-bold uppercase tracking-widest mt-1">Gerador de Laudos</p>
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

          <div className="h-6 w-px bg-line mx-1"></div>

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
        </div>
      </header>

      {/* Main Content */}
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

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-primary text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-fade-in-up z-50 border border-white/10">
          <CheckCircle2 className="w-5 h-5 text-accent" />
          <span className="text-sm font-medium">Copiado para a área de transferência!</span>
        </div>
      )}
    </div>
  );
};

export default App;