import React from 'react';
import { DeviceType, ReportData } from '../types';
import { Sparkles, Loader2 } from 'lucide-react';

interface ReportFormProps {
  data: ReportData;
  onChange: (key: keyof ReportData, value: string) => void;
  onGenerateAI: () => Promise<void>;
  isGenerating: boolean;
}

export const ReportForm: React.FC<ReportFormProps> = ({
  data,
  onChange,
  onGenerateAI,
  isGenerating
}) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange(e.target.name as keyof ReportData, e.target.value);
  };

  const hasContent = data.reportedDefect.trim().length > 0 || data.technicalAnalysis.trim().length > 0;

  // Classes comuns para inputs que funcionam em Light e Dark
  const inputClass = "w-full px-3 py-2 bg-surface border border-line rounded-md focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition text-txt placeholder-gray-400";
  const labelClass = "block text-sm font-medium text-secondary mb-1";

  return (
    <div className="bg-paper p-6 rounded-lg shadow-sm border border-line space-y-6 transition-colors duration-300">
      <div className="border-b border-line pb-4">
        <h2 className="text-xl font-bold text-txt">Dados do Chamado</h2>
        <p className="text-sm text-secondary">Preencha as informações básicas para o laudo.</p>
      </div>

      {/* Requester Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Solicitante</label>
          <input
            type="text"
            name="requesterName"
            value={data.requesterName}
            onChange={handleChange}
            className={inputClass}
            placeholder="Nome do usuário"
          />
        </div>
        <div>
          <label className={labelClass}>Setor / Departamento</label>
          <input
            type="text"
            name="requesterSector"
            value={data.requesterSector}
            onChange={handleChange}
            className={inputClass}
            placeholder="Ex: RH, Financeiro"
          />
        </div>
      </div>

      {/* Device Info */}
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
          <label className={labelClass}>Data</label>
          <input
            type="date"
            name="date"
            value={data.date}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
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
        <div className="grid grid-cols-2 gap-2">
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
        </div>
      </div>

      {/* Unified Description Area */}
      <div className="bg-primary/5 p-4 rounded-lg border border-line">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-bold text-primary">Descrição do Problema & Solução</label>
          <button
            onClick={onGenerateAI}
            disabled={isGenerating || !data.fullDescription.trim()}
            className="flex items-center gap-2 bg-accent hover:opacity-90 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Gera os campos do laudo (Defeito, Análise e Solução) a partir desta descrição"
          >
            {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            Gerar Laudo Completo
          </button>
        </div>
        <textarea
          name="fullDescription"
          value={data.fullDescription}
          onChange={handleChange}
          rows={10}
          className={`${inputClass} mb-1`}
          placeholder="Descreva o problema, os testes realizados e a solução aplicada aqui. A IA irá formatar o laudo técnico automaticamente."
        />
        <p className="text-xs text-primary/70 italic text-right">
          Preencha este campo e clique em gerar para criar o laudo.
        </p>
      </div>

      <div>
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
  );
};