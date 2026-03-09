

import React, { useState, useEffect } from 'react';
import { DeviceType, ReportData } from '../types';
import { Sparkles, Loader2, Mic, MicOff, ArrowRight, ArrowLeft, Save, Download, Mail, Eye, Camera, CheckCircle } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import imageCompression from 'browser-image-compression';
import { uploadEvidenceImage } from '../services/supabaseService';

import { ClientAutocomplete } from './ClientAutocomplete';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { DatePicker } from './ui/date-picker';
import { parseDate } from '@internationalized/date';
import { cn } from '../lib/utils';

interface ReportFormProps {
  data: ReportData;
  onChange: (key: keyof ReportData, value: any) => void;
  onGenerateAI: () => Promise<void>;
  isGenerating: boolean;
  onSave: () => void;
  onPrint: () => void;
  onEmail: () => void;
  onPreview: () => void;
}

export const ReportForm: React.FC<ReportFormProps> = ({
  data,
  onChange,
  onGenerateAI,
  isGenerating,
  onSave,
  onPrint,
  onEmail,
  onPreview
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, title: "Dados do Chamado", desc: "Identificação do cliente e equipamento" },
    { id: 2, title: "Diagnóstico & Análise", desc: "Descreva o problema e anexe fotos" },
    { id: 3, title: "Conclusão", desc: "Finalização e exportação" }
  ];

  const [showEvidences, setShowEvidences] = useState((data.photos?.length || 0) > 0);
  const [isUploading, setIsUploading] = useState(false);
  const { isListening, transcript, toggleListening, hasSupport } = useSpeechRecognition();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Efeito para adicionar o texto ditado à descrição
  useEffect(() => {
    if (transcript) {
      onChange('fullDescription', (data.fullDescription + ' ' + transcript).trim());
    }
  }, [transcript]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange(e.target.name as keyof ReportData, e.target.value);
  };

  const handleAutocompleteChange = (field: keyof ReportData) => (value: string) => {
    onChange(field, value);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const processFiles = async (files: File[]) => {
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      };

      const newPhotos: string[] = [];
      const currentPhotosCount = (data.photos || []).length;
      const remainingSlots = 5 - currentPhotosCount;

      const filesToProcess = files.slice(0, remainingSlots);

      if (filesToProcess.length < files.length) {
        alert(`Apenas ${remainingSlots} fotos podem ser adicionadas.`);
      }

      for (const file of filesToProcess) {
        const compressedFile = await imageCompression(file, options);
        const publicUrl = await uploadEvidenceImage(compressedFile);
        if (publicUrl) {
          newPhotos.push(publicUrl);
        }
      }

      if (newPhotos.length > 0) {
        onChange('photos', [...(data.photos || []), ...newPhotos]);
      }
    } catch (error) {
      console.error("Erro ao processar imagem:", error);
      alert("Erro ao enviar imagem. Tente novamente.");
    } finally {
      setIsUploading(false);
      // Reset input value to allow selecting same file again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCreateFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  // Classes comuns
  const inputClass = "w-full pl-4 pr-4 py-3 bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium text-text placeholder-gray-500/70 dark:placeholder-gray-400/70";
  const labelClass = "block text-xs font-bold text-secondary uppercase tracking-widest mb-1.5 ml-1";

  // Step 1: Dados do Chamado
  const renderStep1 = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Solicitante</label>
          <ClientAutocomplete
            name="requesterName"
            value={data.requesterName}
            onChange={handleAutocompleteChange('requesterName')}
            placeholder="Nome do usuário"
          />
        </div>
        <div>
          <label className={labelClass}>Setor / Departamento</label>
          <ClientAutocomplete
            name="requesterSector"
            value={data.requesterSector}
            onChange={handleAutocompleteChange('requesterSector')}
            placeholder="Ex: RH, Financeiro"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Tipo de Equipamento</label>
          <div onClick={(e) => e.stopPropagation()}>
            <Select value={data.deviceType} onValueChange={(val) => onChange('deviceType', val)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(DeviceType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <label className={labelClass}>Data do Atendimento</label>
          <div onClick={(e) => e.stopPropagation()}>
            <DatePicker
              value={data.date ? parseDate(data.date) : null}
              onChange={(date) => onChange('date', date ? date.toString() : '')}
              aria-label="Data do Atendimento"
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Modelo / Fabricante</label>
          <Input
            type="text"
            name="model"
            value={data.model}
            onChange={handleChange}
            placeholder="Ex: Dell Latitude 5420"
          />
        </div>
        <div>
          <label className={labelClass}>Nº Série (S/N)</label>
          <Input
            type="text"
            name="serialNumber"
            value={data.serialNumber}
            onChange={handleChange}
            placeholder="S/N..."
          />
        </div>
        <div>
          <label className={labelClass}>Patrimônio</label>
          <Input
            type="text"
            name="patrimonyId"
            value={data.patrimonyId}
            onChange={handleChange}
            placeholder="ID..."
          />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Técnico Responsável</label>
          <Input
            type="text"
            name="technicianName"
            value={data.technicianName}
            onChange={handleChange}
            placeholder="Seu nome"
          />
        </div>
      </div>
    </div>
  );

  // Step 2: Diagnóstico & Evidências
  const renderStep2 = () => (
    <div className="space-y-6 animate-fade-in relative z-10">
      <div className="bg-primary/5 p-5 rounded-2xl border border-primary/20 shadow-inner">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-bold text-primary">Descrição Detalhada</label>
          <div className="flex gap-2">
            {hasSupport && (
              <button
                onClick={toggleListening}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all ${isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-surface text-secondary border border-line hover:bg-white/5'
                  }`}
                title="Ditar descrição"
              >
                {isListening ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
              </button>
            )}
            <button
              onClick={onGenerateAI}
              disabled={isGenerating || !data.fullDescription.trim()}
              className="flex items-center gap-2 bg-accent hover:opacity-90 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              Gerar com IA
            </button>
          </div>
        </div>
        <textarea
          name="fullDescription"
          value={data.fullDescription}
          onChange={handleChange}
          rows={8}
          className={`${inputClass} mb-1`}
          placeholder="Descreva o problema, testes e solução..."
        />
      </div>

      <div className="flex items-center gap-4 p-5 glass-strong border border-white/10 rounded-2xl shadow-lg transition-all">
        <div className={`p-3 rounded-2xl ${showEvidences ? 'bg-gradient-to-br from-primary to-accent text-white shadow-lg' : 'bg-white/5 border border-white/10 text-secondary'}`}>
          <Camera className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-text">Adicionar Evidências?</h3>
          <p className="text-xs text-secondary mt-0.5 font-medium">Incluir fotos do equipamento (Máx 5).</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={showEvidences}
          onClick={() => setShowEvidences(!showEvidences)}
          className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 ${showEvidences ? 'bg-primary' : 'bg-white/20 dark:bg-white/15'}`}
        >
          <span className={`block w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 absolute top-0.5 ${showEvidences ? 'left-[22px]' : 'left-0.5'}`} />
        </button>
      </div>

      {showEvidences && (
        <div className="animate-fade-in-up border-2 border-dashed border-white/10 rounded-2xl p-8 text-center bg-white/5 dark:bg-slate-900/30 relative">
          <p className="text-sm text-secondary font-medium mb-5 tracking-wide">Cole imagens (Ctrl+V) ou arraste aqui</p>
          {/* Simple invisible paste interceptor for the whole div area */}
          <div className="flex flex-wrap gap-4"
            onPaste={async (e) => {
              const items = e.clipboardData.items;
              const files: File[] = [];
              for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf("image") !== -1) {
                  const blob = items[i].getAsFile();
                  if (blob) files.push(blob);
                }
              }
              if (files.length > 0) {
                processFiles(files);
              }
            }}
          >
            {(data.photos || []).map((photo, index) => (
              <div key={index} className="relative w-24 h-24 rounded-md overflow-hidden group shrink-0 shadow-sm border border-line">
                <img src={photo} className="w-full h-full object-cover" alt="Evidence" />
                <button
                  onClick={() => onChange('photos', (data.photos || []).filter((_, i) => i !== index))}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform scale-75"
                >
                  ×
                </button>
              </div>
            ))}
            {(data.photos || []).length < 5 && (
              <div className="w-24 h-24 rounded-md border-2 border-dashed border-line flex items-center justify-center text-secondary hover:text-primary hover:border-primary transition cursor-pointer bg-surface hover:bg-paper shrink-0"
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="text-2xl font-light">+</span>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleCreateFileInput}
            />
          </div>
          {isUploading && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg backdrop-blur-sm">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
              <span className="ml-2 text-primary font-medium">Enviando imagem...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Step 3: Conclusão & Ações
  const renderStep3 = () => (
    <div className="space-y-8 animate-fade-in text-center py-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4 mx-auto">
        <CheckCircleCircle className="w-8 h-8" />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-txt mb-2">Laudo Pronto!</h2>
        <p className="text-secondary max-w-md mx-auto">
          Verifique os dados abaixo e escolha uma ação.
          Lembre-se que as evidências aparecerão na segunda página do PDF.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto relative z-10">
        <button
          onClick={onPreview}
          className="group flex flex-col items-center justify-center p-4 sm:p-6 glass-strong border border-white/10 rounded-2xl hover:border-accent hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] transition-all hover:-translate-y-1"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform shadow-inner">
            <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="font-bold text-text text-sm sm:text-base text-center">Visualizar</span>
          <span className="text-[10px] sm:text-xs text-secondary mt-1 font-medium text-center">Ver Preview</span>
        </button>

        <button
          onClick={onPrint}
          className="group flex flex-col items-center justify-center p-4 sm:p-6 glass-strong border border-white/10 rounded-2xl hover:border-primary hover:shadow-[0_0_30px_rgba(205,39,132,0.15)] transition-all hover:-translate-y-1"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform shadow-inner">
            <Download className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="font-bold text-text text-sm sm:text-base text-center">Exportar</span>
          <span className="text-[10px] sm:text-xs text-secondary mt-1 font-medium text-center">Baixar PDF</span>
        </button>

        <button
          onClick={onSave}
          className="group flex flex-col items-center justify-center p-4 sm:p-6 glass-strong border border-white/10 rounded-2xl hover:border-green-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] transition-all hover:-translate-y-1"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform shadow-inner">
            <Save className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="font-bold text-text text-sm sm:text-base text-center">Salvar</span>
          <span className="text-[10px] sm:text-xs text-secondary mt-1 font-medium text-center">Guardar no BD</span>
        </button>

        <button
          onClick={onEmail}
          className="group flex flex-col items-center justify-center p-4 sm:p-6 glass-strong border border-white/10 rounded-2xl hover:border-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all hover:-translate-y-1"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform shadow-inner">
            <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="font-bold text-text text-sm sm:text-base text-center">Email</span>
          <span className="text-[10px] sm:text-xs text-secondary mt-1 font-medium text-center">Compartilhar</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="glass-strong p-6 md:p-8 rounded-3xl shadow-2xl border border-white/10 h-full flex flex-col relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Wizard Progress */}
      {/* Modern Progress Bar */}
      <div className="mb-8 px-2 md:px-4 relative z-10">
        <div className="flex justify-between items-end mb-3">
          <div className="animate-fade-in">
            <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-1 block">Passo {currentStep} de 3</span>
            <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-text to-secondary leading-none">{steps[currentStep - 1].title}</h2>
          </div>
          <span className="text-xs text-secondary hidden sm:block animate-fade-in text-right max-w-[200px] leading-tight font-medium">
            {steps[currentStep - 1].desc}
          </span>
        </div>

        <div className="h-2.5 bg-black/5 dark:bg-slate-900/50 border border-white/5 rounded-full overflow-hidden relative shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent shadow-[0_0_15px_rgba(205,39,132,0.6)] transition-all duration-700 ease-out relative overflow-hidden"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-2 custom-scrollbar relative z-10">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-auto pt-6 border-t border-white/10 relative z-10 shrink-0">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${currentStep === 1
            ? 'opacity-0 cursor-default pointer-events-none'
            : 'text-secondary hover:bg-white/5 border border-transparent hover:border-white/10 hover:text-text'
            }`}
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>

        {currentStep < 3 ? (
          <button
            onClick={nextStep}
            className="flex items-center gap-2 px-8 py-2.5 bg-primary text-white rounded-xl font-bold shadow-[0_4px_14px_0_rgba(205,39,132,0.39)] hover:shadow-[0_6px_20px_rgba(205,39,132,0.23)] hover:scale-[1.02] active:scale-95 transition-all ml-auto"
          >
            Próximo <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => window.location.reload()} // Reset or similar action for "New"
            className="flex items-center gap-2 px-8 py-2.5 glass-strong text-text border border-white/10 rounded-xl font-bold hover:bg-white/5 transition-all ml-auto"
          >
            Novo Laudo
          </button>
        )}
      </div>
    </div>
  );
};

const CheckCircleCircle = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);