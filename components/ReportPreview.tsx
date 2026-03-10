import React from 'react';
import { ReportData } from '../types';
import {
  AlertCircle,
  CheckCircle2,
  Calendar,
  Hash,
  User,
  MapPin,
  Wrench,
  Globe,
  Mail,
  Camera,
  ExternalLink,
  ClipboardList
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { SkeletonLoader } from './SkeletonLoader';

interface ReportPreviewProps {
  data: ReportData;
  isGenerating?: boolean;
  elementId?: string;
}

// Cores Oficiais Proxxima (Atualizado)
const COLORS = {
  primary: '#E32085', // Pink Proxxima
  accent: '#2B388C',  // Blue Proxxima (used as accent/secondary here)
  text: '#444444',    // Cinza Escuro Tundora
  border: '#e5e7eb'   // Cinza Claro (Keeping neutral for structure)
};

export const ReportPreview: React.FC<ReportPreviewProps> = ({ data, isGenerating = false, elementId = "report-preview-content" }) => {

  // Gerar um ID visual consistente para este render
  const documentId = React.useMemo(() => Math.random().toString(36).substr(2, 9).toUpperCase(), []);

  const renderList = (text: string) => {
    if (!text) return <p className="text-gray-400 italic text-sm py-2">Conteúdo pendente...</p>;
    const items = text.split(/\n|•|- /).filter(line => line.trim().length > 0);
    return (
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 text-justify">
            {/* Bolinha da lista com cor fixa Primary (Pink) */}
            <span
              className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: COLORS.primary }}
            />
            <span>{item.trim()}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div id={elementId} className="bg-white shadow-2xl mx-auto flex flex-col relative overflow-hidden" style={{ width: '210mm', minHeight: '297mm', padding: '0' }}>

      {/* Watermark for Drafts */}
      {data.status === 'open' && (
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none text-[12rem] font-black uppercase text-black -rotate-45 tracking-widest whitespace-nowrap">
          RASCUNHO
        </div>
      )}

      {/* 1. Faixa de Topo Decorativa */}
      <div className="relative z-10" style={{ height: '8px', backgroundColor: COLORS.primary, width: '100%' }}></div>

      {/* 2. Header Corporativo Estilo "Papel Timbrado" */}
      <div className="px-10 py-8 flex justify-between items-start relative z-10" style={{ pageBreakInside: 'avoid' }}>

        {/* Coluna Esquerda: Marca e Contato */}
        <div className="flex flex-col gap-3">
          <img
            src="/pxx_logo.png"
            alt="Proxxima Telecom"
            className="h-12 w-auto object-contain object-left"
            crossOrigin="anonymous"
          />
          <div className="text-[10px] text-gray-500 space-y-0.5 mt-1 font-medium tracking-wide">
            <p className="flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-gray-400" /> www.proxxima.net
            </p>
            <p className="flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-gray-400" /> ti.proxxima@gmail.com
            </p>
          </div>
        </div>

        {/* Coluna Direita: Título e Metadados */}
        <div className="text-right">
          <h2
            className="text-3xl font-extrabold uppercase tracking-tight leading-none mb-2"
            style={{ color: COLORS.accent }}
          >
            Laudo Técnico
          </h2>

          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded border border-gray-100">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Ref:</span>
              <span className="text-sm font-mono font-bold text-gray-700">{(data as any).refId || (data as any).id || documentId}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500 mt-1">
              <Calendar className="w-3.5 h-3.5" style={{ color: COLORS.primary }} />
              <span>{new Date(data.date).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Separador Sutil */}
      <div className="mx-10 border-b border-gray-100"></div>

      <div className="px-10 py-8 flex-1">

        {/* Identificação do Equipamento */}
        <div className="mb-8 border rounded-lg overflow-hidden" style={{ borderColor: COLORS.border, pageBreakInside: 'avoid' }}>
          <div className="bg-gray-50 px-4 py-2 border-b flex justify-between items-center" style={{ borderColor: COLORS.border }}>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Identificação do Ativo</h3>
            <span className="text-[10px] text-gray-400 uppercase">TI & Infraestrutura</span>
          </div>
          <div className="p-4 grid grid-cols-2 gap-y-4 gap-x-8">
            <div>
              <span className="text-xs text-gray-400 block mb-1">Equipamento / Modelo</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-800 text-lg">{data.deviceType}</span>
                <span className="text-gray-600">{data.model}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-400 block mb-1 flex items-center gap-1"><Hash className="w-3 h-3" /> Serial (S/N)</span>
                <span className="font-mono text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded border border-gray-200 block w-fit">
                  {data.serialNumber || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block mb-1 flex items-center gap-1"><Hash className="w-3 h-3" /> Patrimônio</span>
                <span className="font-mono text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded border border-gray-200 block w-fit">
                  {data.patrimonyId || 'N/A'}
                </span>
              </div>
            </div>

            <div className="col-span-2 border-t border-gray-100 pt-3 mt-1 flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" style={{ color: COLORS.accent }} />
                <span className="font-medium">Colaborador:</span> {data.requesterName}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" style={{ color: COLORS.accent }} />
                <span className="font-medium">Setor:</span> {data.requesterSector}
              </div>
            </div>
          </div>
        </div>

        {/* Corpo do Laudo */}
        <div className="space-y-8">

          {/* Defeito */}
          <div style={{ pageBreakInside: 'avoid' }}>
            <h3
              className="flex items-center gap-2 font-bold uppercase text-sm border-b pb-2 mb-3"
              style={{ color: COLORS.accent, borderColor: COLORS.border }}
            >
              <AlertCircle className="w-5 h-5 text-red-500" />
              1. Defeito Relatado
            </h3>
            <div className="bg-red-50/50 border-l-4 border-red-500 p-4 text-gray-800 text-sm leading-relaxed text-justify rounded-r-md">
              {isGenerating ? <SkeletonLoader /> : (data.reportedDefect || "Aguardando descrição...")}
            </div>
          </div>

          {/* Análise */}
          <div style={{ pageBreakInside: 'avoid' }}>
            <h3
              className="flex items-center gap-2 font-bold uppercase text-sm border-b pb-2 mb-3"
              style={{ color: COLORS.accent, borderColor: COLORS.border }}
            >
              <Wrench className="w-5 h-5" style={{ color: COLORS.primary }} />
              2. Análise Técnica & Diagnóstico
            </h3>
            <div className="px-2">
              {isGenerating ? <SkeletonLoader /> : renderList(data.technicalAnalysis)}
            </div>
          </div>

          {/* Solução */}
          <div style={{ pageBreakInside: 'avoid' }}>
            <h3
              className="flex items-center gap-2 font-bold uppercase text-sm border-b pb-2 mb-3"
              style={{ color: COLORS.accent, borderColor: COLORS.border }}
            >
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              3. Parecer Técnico / Solução
            </h3>
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
              {isGenerating ? <SkeletonLoader /> : (
                <p className="text-gray-800 font-medium text-sm leading-relaxed">
                  {data.recommendation || "Aguardando conclusão..."}
                </p>
              )}
            </div>
          </div>

          {/* Peças Solicitadas */}
          {data.outcomeType === 'parts_request' && data.partsRequested && data.partsRequested.length > 0 && (
            <div style={{ pageBreakInside: 'avoid' }}>
              <h3
                className="flex items-center gap-2 font-bold uppercase text-sm border-b pb-2 mb-3"
                style={{ color: COLORS.accent, borderColor: COLORS.border }}
              >
                <ClipboardList className="w-5 h-5 text-orange-500" />
                Peças Solicitadas
              </h3>
              <div className="border border-orange-200 rounded-lg overflow-hidden shadow-sm">
                <div className="bg-orange-50 px-4 py-2 border-b border-orange-100 text-xs font-bold text-orange-800 uppercase">
                  Lista de Reposição
                </div>
                <table className="w-full text-sm text-left text-gray-700">
                  <thead className="bg-orange-50/50 text-xs uppercase text-gray-500 font-bold border-b border-orange-100">
                    <tr>
                      <th className="px-4 py-2">Qtd</th>
                      <th className="px-4 py-2">Item</th>
                      <th className="px-4 py-2">Part Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.partsRequested.map((part, idx) => (
                      <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                        <td className="px-4 py-2 font-bold text-center w-16">{part.quantity}</td>
                        <td className="px-4 py-2 font-medium">{part.name}</td>
                        <td className="px-4 py-2 font-mono text-gray-500">{part.partNumber || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Encaminhamento Externo / Garantia */}
          {data.outcomeType === 'external_assistance' && (
            <div style={{ pageBreakInside: 'avoid', marginTop: '1.5rem' }}>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-4 shadow-sm">
                <ExternalLink className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-amber-800 font-bold uppercase text-sm mb-1 tracking-wide">Encaminhamento Externo / Garantia</h4>
                  <p className="text-amber-700 text-sm leading-relaxed text-justify">
                    Este equipamento requer atendimento laboratorial especializado ou acionamento de garantia junto ao fabricante/fornecedor. O presente laudo técnico isola e detalha a falha diagnosticada em Nível 1/2 para subsidiar o envio.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Fotos / Evidências */}
          {data.photos && data.photos.length > 0 && data.photos.some(p => p.trim() !== '') && (
            <div style={{ pageBreakInside: 'avoid' }}>
              <h3
                className="flex items-center gap-2 font-bold uppercase text-sm border-b pb-2 mb-3"
                style={{ color: COLORS.accent, borderColor: COLORS.border }}
              >
                <Camera className="w-5 h-5" style={{ color: COLORS.primary }} />
                4. Evidências Fotográficas
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {(() => {
                  const validPhotos = data.photos.filter(p => p.trim() !== '');
                  return (
                    <div className={`col-span-2 grid gap-4 ${validPhotos.length <= 3 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                      {validPhotos.map((url, idx) => (
                        <div key={idx} className="flex flex-col gap-1 break-inside-avoid">
                          <div className={`border border-gray-200 p-1 rounded bg-white relative overflow-hidden group flex items-center justify-center ${validPhotos.length <= 3 ? 'h-64' : 'h-48'}`}>
                            <img
                              src={url}
                              alt={`Evidência ${idx + 1}`}
                              className="max-w-full max-h-full object-contain rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).parentElement!.innerText = 'Imagem indisponível';
                              }}
                            />
                          </div>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-center text-gray-500 hover:text-primary hover:underline flex items-center justify-center gap-1 py-1"
                          >
                            <ExternalLink size={10} /> Ver imagem original
                          </a>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Footer / Assinatura */}
      <div id="report-footer" className="mt-auto px-10 pb-12 pt-6 bg-white" style={{ pageBreakInside: 'avoid' }}>
        <div className="grid grid-cols-2 gap-10 items-end">
          <div className="text-xs text-gray-400 flex gap-4 items-center">
            <div className="bg-white p-1">
              <QRCodeSVG
                value={`${window.location.origin}/?ref=${(data as any).refId || (data as any).id || 'preview'}`}
                size={80}
                style={{ height: "auto", maxWidth: "100%", width: "80px" }}
              />
            </div>
            <div>
              <p className="font-bold text-gray-600 mb-0.5">Verificação de Autenticidade</p>
              <p className="mb-0.5">
                Escaneie o QR Code ou{' '}
                <a
                  href={`${window.location.origin}/?ref=${(data as any).refId || (data as any).id || 'preview'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline hover:text-accent transition-colors cursor-pointer"
                >
                  clique aqui
                </a>
                {' '}para validar.
              </p>
              <p>REF ID: {(data as any).refId || (data as any).id || documentId}</p>
            </div>
          </div>
          <div className="text-center flex flex-col items-center">


            <div className="w-full relative pt-8">
              {/* Nome do técnico */}
              <p className="text-xl text-gray-800 flex items-center justify-center gap-2 mb-1" style={{ fontFamily: '"Dancing Script", "Brush Script MT", cursive' }}>
                {(data.technicianName || "Técnico Responsável").split(' - ')[0]}
              </p>

              {/* Linha da assinatura */}
              <div className="border-t border-gray-400 w-full"></div>

              {/* Depto e Cargo */}
              <div className="flex justify-between items-center mt-1 text-[10px] uppercase tracking-wider font-semibold" style={{ color: COLORS.accent }}>
                <span>Depto. Técnico de TI</span>
                <span>{(data.technicianName || "").split(' - ')[1] || ""}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Faixa decorativa final removida pois será desenhada apenas no PDF */}

    </div>
  );
};