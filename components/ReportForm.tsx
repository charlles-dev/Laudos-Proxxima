

import React, { useState, useEffect } from 'react';
import { DeviceType, ReportData } from '../types';
import { Sparkles, Loader2, Mic, MicOff, ArrowRight, ArrowLeft, Save, Download, Mail, Eye, Camera, CheckCircle } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import imageCompression from 'browser-image-compression';
import { uploadEvidenceImage } from '../services/supabaseService';

import { ClientAutocomplete } from './ClientAutocomplete';

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
  const [showEvidences, setShowEvidences] = useState((data.photos?.length || 0) > 0);
  const [isUploading, setIsUploading] = useState(false);
  const { isListening, transcript, toggleListening, hasSupport } = useSpeechRecognition();

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

  // Classes comuns
  const inputClass = "w-full px-4 py-2 bg-surface border border-line rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition text-txt placeholder-gray-400";
  const labelClass = "block text-sm font-medium text-secondary mb-1.5";

  // Step 1: Dados do Chamado
  const renderStep1 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
        <div>
          <h2 className="text-xl font-bold text-txt">Dados do Chamado</h2>
          <p className="text-sm text-secondary">Identificação do cliente e equipamento.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Tipo de Equipamento</label>
          <select
            name="deviceType"
            value={data.deviceType}
            onChange={handleChange}
            className={inputClass}
          >
            {Object.values(DeviceType).map((type) => (
              <option key={type} value={type} className="bg-paper text-txt">{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Data do Atendimento</label>
          <input
            type="date"
            name="date"
            value={data.date}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Modelo / Fabricante</label>
          <input
            type="text"
            name="model"
            value={data.model}
            onChange={handleChange}
            className={inputClass}
            placeholder="Ex: Dell Latitude 5420"
          />
        </div>
        <div>
          <label className={labelClass}>Nº Série (S/N)</label>
          <input
            type="text"
            name="serialNumber"
            value={data.serialNumber}
            onChange={handleChange}
            className={inputClass}
            placeholder="S/N..."
          />
        </div>
        <div>
          <label className={labelClass}>Patrimônio</label>
          <input
            type="text"
            name="patrimonyId"
            value={data.patrimonyId}
            onChange={handleChange}
            className={inputClass}
            placeholder="ID..."
          />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Técnico Responsável</label>
          <input
            type="text"
            name="technicianName"
            value={data.technicianName}
            onChange={handleChange}
            className={inputClass}
            placeholder="Seu nome"
          />
        </div>
      </div>
    </div>
  );

  // Step 2: Diagnóstico & Evidências
  const renderStep2 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">2</div>
        <div>
          <h2 className="text-xl font-bold text-txt">Diagnóstico & Análise</h2>
          <p className="text-sm text-secondary">Descreva o problema e anexe fotos se necessário.</p>
        </div>
      </div>

      <div className="bg-primary/5 p-4 rounded-lg border border-line">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-bold text-primary">Descrição Detalhada</label>
          <div className="flex gap-2">
            {hasSupport && (
              <button
                onClick={toggleListening}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all ${isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-white text-secondary border border-gray-200 hover:bg-gray-50'
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

      <div className="flex items-center gap-3 p-4 bg-paper border border-line rounded-lg shadow-sm">
        <div className={`p-2 rounded-full ${showEvidences ? 'bg-primary text-white' : 'bg-surface border border-line text-secondary'}`}>
          <Camera className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-txt">Adicionar Evidências?</h3>
          <p className="text-xs text-secondary">Incluir fotos do equipamento (Máx 5).</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={showEvidences} onChange={(e) => setShowEvidences(e.target.checked)} className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>

      {showEvidences && (
        <div className="animate-fade-in-up border border-dashed border-line rounded-lg p-6 text-center bg-surface relative">
          <p className="text-sm text-secondary mb-4">Cole imagens (Ctrl+V) ou arraste aqui</p>
          {/* Simple invisible paste interceptor for the whole div area */}
          <div
            className="grid grid-cols-2 md:grid-cols-5 gap-2"
            onPaste={async (e) => {
              const items = e.clipboardData.items;
              for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf("image") !== -1) {
                  const blob = items[i].getAsFile();
                  if (blob) {
                    setIsUploading(true);
                    try {
                      const options = {
                        maxSizeMB: 1,
                        maxWidthOrHeight: 1920,
                        useWebWorker: true
                      };
                      const compressedFile = await imageCompression(blob, options);
                      const publicUrl = await uploadEvidenceImage(compressedFile);

                      if (publicUrl) {
                        // Use functional update to avoid stale closure if multiple uploads happen fast (though paste is usually one batch)
                        // Actually, accessing data.photos directly is fine if re-render happens, but let's be safe
                        // Since onChange is from parent, we might not get immediate update. 
                        // But for simplicity let's stick to current pattern:
                        if ((data.photos || []).length < 5) {
                          onChange('photos', [...(data.photos || []), publicUrl]);
                        }
                      }
                    } catch (error) {
                      console.error("Erro ao processar imagem:", error);
                      alert("Erro ao enviar imagem. Tente novamente.");
                    } finally {
                      setIsUploading(false);
                    }
                  }
                }
              }
            }}
          >
            {(data.photos || []).map((photo, index) => (
              <div key={index} className="relative aspect-square rounded-md overflow-hidden group">
                <img src={photo} className="w-full h-full object-cover" alt="Evidence" />
                <button
                  onClick={() => onChange('photos', (data.photos || []).filter((_, i) => i !== index))}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
            {(data.photos || []).length < 5 && (
              <div className="aspect-square rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition cursor-pointer"
                onClick={() => {/* Trigger file input if implemented, currently mostly drag/paste */ }}
              >
                <span className="text-2xl">+</span>
              </div>
            )}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
        <button
          onClick={onPreview}
          className="group flex flex-col items-center justify-center p-6 bg-paper border border-line rounded-xl hover:border-accent hover:shadow-lg transition-all"
        >
          <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Eye className="w-6 h-6" />
          </div>
          <span className="font-semibold text-txt">Visualizar Preview</span>
          <span className="text-xs text-secondary mt-1">Ver como ficou</span>
        </button>

        <button
          onClick={onPrint}
          className="group flex flex-col items-center justify-center p-6 bg-paper border border-line rounded-xl hover:border-primary hover:shadow-lg transition-all"
        >
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Download className="w-6 h-6" />
          </div>
          <span className="font-semibold text-txt">Baixar PDF</span>
          <span className="text-xs text-secondary mt-1">Download e Impressão</span>
        </button>

        <button
          onClick={onSave}
          className="group flex flex-col items-center justify-center p-6 bg-paper border border-line rounded-xl hover:border-green-500 hover:shadow-lg transition-all"
        >
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Save className="w-6 h-6" />
          </div>
          <span className="font-semibold text-txt">Salvar Sistema</span>
          <span className="text-xs text-secondary mt-1">Guardar no Banco</span>
        </button>

        <button
          onClick={onEmail}
          className="group flex flex-col items-center justify-center p-6 bg-paper border border-line rounded-xl hover:border-blue-500 hover:shadow-lg transition-all"
        >
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Mail className="w-6 h-6" />
          </div>
          <span className="font-semibold text-txt">Enviar Email</span>
          <span className="text-xs text-secondary mt-1">Compartilhar link</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-paper p-6 rounded-lg shadow-sm border border-line h-full flex flex-col">
      {/* Wizard Progress */}
      <div className="flex items-center justify-between mb-8 px-2 md:px-8">
        {[1, 2, 3].map(step => (
          <div key={step} className={`flex items-center ${step < 3 ? 'flex-1' : ''}`}>
            <div
              className={`
                     w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2
                     ${currentStep >= step ? 'bg-primary text-white border-primary scale-110' : 'bg-surface text-secondary border-line'}
                   `}
            >
              {step}
            </div>
            {step < 3 && (
              <div className={`h-1 flex-1 mx-2 rounded-full transition-all duration-300 ${currentStep > step ? 'bg-primary' : 'bg-line'}`}></div>
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto min-h-[400px]">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6 pt-4 border-t border-line">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${currentStep === 1
            ? 'text-line cursor-not-allowed hidden'
            : 'text-secondary hover:bg-surface border border-transparent hover:border-line'
            }`}
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>

        {currentStep < 3 ? (
          <button
            onClick={nextStep}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg font-bold shadow-md hover:bg-opacity-90 transition-all ml-auto"
          >
            Próximo <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => window.location.reload()} // Reset or similar action for "New"
            className="flex items-center gap-2 px-6 py-2 bg-surface text-secondary hover:bg-paper border border-line rounded-lg font-medium transition-all ml-auto"
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