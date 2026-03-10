import React, { useState } from 'react';
import { Mail, Copy, Check, X } from 'lucide-react';
import { ReportData } from '../types';

interface EmailModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: ReportData;
}

export const EmailModal: React.FC<EmailModalProps> = ({ isOpen, onClose, data }) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const getEmailSubject = () => {
        if (data.outcomeType === 'parts_request') return `Solicitação de Peça — ${data.model}`;
        if (data.outcomeType === 'external_assistance') return `Encaminhamento para Assistência Técnica — ${data.model}`;
        return `Registro de Atendimento Técnico — ${data.model}`;
    };

    const subject = getEmailSubject();
    const body = `Prezados,

Segue laudo técnico do equipamento analisado.

EQUIPAMENTO: ${data.deviceType} ${data.model}
COLABORADOR: ${data.requesterName}
PATRIMÔNIO: ${data.patrimonyId}

RESUMO TÉCNICO:
${data.recommendation}

... conforme laudo técnico em anexo ...

Atenciosamente,

${data.technicianName}
Proxxima Telecom`.trim();

    const fullText = `Assunto: ${subject}\n\n${body}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(fullText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div
                className="glass-strong border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl">
                            <Mail className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-text">Modelo de E-mail</h2>
                            <p className="text-xs text-secondary mt-0.5">Copie o texto sugerido para enviar ao cliente</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-secondary hover:text-text hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-black/20">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-1.5 ml-1">Assunto</label>
                            <div className="w-full pl-4 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-sm font-medium text-text select-all">
                                {subject}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-1.5 ml-1">Corpo do E-mail</label>
                            <div className="w-full pl-4 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-sm text-text whitespace-pre-wrap font-mono relative select-all">
                                {body}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-white/5 bg-white/5 flex justify-end items-center gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl font-bold text-secondary hover:text-text hover:bg-white/10 transition-colors"
                    >
                        Fechar
                    </button>
                    <button
                        onClick={handleCopy}
                        className={`flex items-center gap-2 px-8 py-2.5 rounded-xl font-bold transition-all shadow-lg ${copied
                                ? 'bg-green-500 text-white hover:bg-green-600 shadow-green-500/20'
                                : 'bg-primary text-white hover:bg-primary-hover shadow-primary/20 hover:scale-[1.02] active:scale-95'
                            }`}
                    >
                        {copied ? (
                            <>
                                <Check className="w-5 h-5" />
                                Copiado!
                            </>
                        ) : (
                            <>
                                <Copy className="w-5 h-5" />
                                Copiar Texto
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div >
    );
};
