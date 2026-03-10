import React, { useState, useEffect } from 'react';
import { X, Save, AlertTriangle, MessageSquare, Eye } from 'lucide-react';
import { SavedReport, updateReport } from '../services/supabaseService';

interface QuickEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    report: SavedReport | null;
    onUpdated: () => void;
    onViewFull: (report: SavedReport) => void;
}

export const QuickEditModal: React.FC<QuickEditModalProps> = ({ isOpen, onClose, report, onUpdated, onViewFull }) => {
    const [status, setStatus] = useState<"open" | "in_progress" | "awaiting_parts" | "closed">(report?.status || 'open');
    const [priority, setPriority] = useState<"low" | "normal" | "high" | "critical">(report?.priority || 'medium' as any);
    const [recommendation, setRecommendation] = useState(report?.recommendation || '');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (report) {
            setStatus(report.status || 'open');
            setPriority((report.priority as any) || 'normal');
            setRecommendation(report.recommendation || '');
        }
    }, [report]);

    if (!isOpen || !report) return null;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateReport(report.id, {
                status,
                priority,
                recommendation
            });
            onUpdated();
            onClose();
        } catch (error) {
            console.error(error);
            alert("Erro ao salvar edições rápidas.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-surface border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-fade-in-up">

                <div className="flex justify-between items-center p-4 border-b border-white/10 bg-white/5">
                    <h3 className="text-lg font-bold text-text">Edição Rápida</h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-secondary hover:text-red-400 hover:bg-white/5 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    <div>
                        <span className="text-secondary text-xs uppercase font-bold tracking-wider mb-2 block">Laudo {report.refId || report.id.slice(0, 8)}</span>
                        <h4 className="text-md font-bold text-text mb-1">{report.model}</h4>
                        <p className="text-sm text-secondary">{report.requesterName}</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-bold text-secondary flex items-center gap-2 mb-2">
                                <AlertTriangle className="w-4 h-4" />
                                Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as any)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-text focus:ring-2 focus:ring-primary outline-none transition-all"
                            >
                                <option value="open">Aberto</option>
                                <option value="in_progress">Em Análise</option>
                                <option value="awaiting_parts">Aguardando Peça</option>
                                <option value="closed">Fechado</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-bold text-secondary flex items-center gap-2 mb-2">
                                <AlertTriangle className="w-4 h-4 text-orange-400" />
                                Prioridade
                            </label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as any)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-text focus:ring-2 focus:ring-primary outline-none transition-all"
                            >
                                <option value="low">Baixa</option>
                                <option value="normal">Normal</option>
                                <option value="high">Alta</option>
                                <option value="critical">Crítica</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-bold text-secondary flex items-center gap-2 mb-2">
                                <MessageSquare className="w-4 h-4 text-blue-400" />
                                Resumo Técnico / Recomendação
                            </label>
                            <textarea
                                value={recommendation}
                                onChange={(e) => setRecommendation(e.target.value)}
                                rows={4}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-text focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                                placeholder="Descreva a recomendação técnica..."
                            />
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-white/10 bg-white/5 flex gap-3 justify-between items-center">
                    <button
                        onClick={() => {
                            onClose();
                            onViewFull(report);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-primary hover:bg-primary/10 rounded-xl transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                        Ver Completo
                    </button>

                    <div className="flex gap-2 items-center">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-bold text-secondary hover:text-text transition-colors"
                            disabled={isSaving}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
