import React, { useEffect, useState } from 'react';
import { getPublicReport } from '../services/supabaseService';
import { ReportData } from '../types';
import { ReportPreview } from './ReportPreview';
import { ShieldCheck, Loader2, AlertTriangle } from 'lucide-react';

interface PublicReportViewerProps {
    reportId: string;
}

export const PublicReportViewer: React.FC<PublicReportViewerProps> = ({ reportId }) => {
    const [report, setReport] = useState<ReportData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        getPublicReport(reportId).then((data) => {
            if (data) {
                setReport(data);
            } else {
                setError(true);
            }
        }).catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [reportId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />
                <div className="flex flex-col items-center gap-4 relative z-10 glass-strong p-8 rounded-3xl border border-white/10 shadow-2xl">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    <p className="text-text font-bold tracking-wide uppercase text-sm">Verificando autenticidade...</p>
                </div>
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-surface p-4 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />
                
                <div className="glass-strong p-10 rounded-3xl shadow-2xl text-center max-w-md w-full border border-red-500/20 relative z-10">
                    <div className="bg-red-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-red-500/20">
                        <AlertTriangle className="w-12 h-12 text-red-500 animate-pulse" />
                    </div>
                    <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-3">Documento Não Encontrado</h1>
                    <p className="text-secondary text-sm mb-8 leading-relaxed font-medium">
                        Não foi possível validar este laudo ou encontrar suas informações. Verifique se o link fornecido está correto ou se o documento foi removido do sistema.
                    </p>
                    <div className="text-[10px] text-secondary border-t border-white/10 pt-6 font-mono tracking-widest uppercase">
                        Ref: {reportId}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface py-8 px-4 font-sans relative overflow-x-hidden transition-colors">

            {/* Background Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-surface to-surface" />
            <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, var(--tw-colors-primary) 1px, transparent 0)', backgroundSize: '30px 30px' }} />

            {/* Verification Header */}
            <div className="max-w-4xl mx-auto mb-8 relative z-10 w-full">
                <div className="glass-strong border border-green-500/30 rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:justify-between gap-6 text-center md:text-left relative overflow-hidden transition-all">
                    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-green-400 to-green-600" />
                    
                    <div className="flex flex-col md:flex-row items-center gap-5 ml-2">
                        <div className="bg-green-500/10 p-4 rounded-2xl border border-green-500/20 shadow-inner flex shrink-0 items-center justify-center">
                            <ShieldCheck className="w-10 h-10 text-green-500" />
                        </div>
                        <div>
                            <h2 className="text-text font-black text-xl md:text-2xl flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start">
                                Laudo Técnico Autêntico
                                <span className="bg-green-500/10 text-green-500 text-[10px] px-3 py-1 rounded-full border border-green-500/20 shadow-inner uppercase tracking-widest font-bold">Verificado Oficialmente</span>
                            </h2>
                            <p className="text-secondary text-sm mt-2 font-medium">
                                Emitido por <strong className="text-text font-bold">{report.technicianName}</strong><br className="md:hidden" />
                                <span className="hidden md:inline text-white/20 mx-2">|</span>
                                {new Date(report.date).toLocaleDateString('pt-BR')}
                            </p>
                        </div>
                    </div>

                    <div className="w-full md:w-auto text-center md:text-right border-t border-white/10 md:border-0 pt-6 md:pt-0 mt-2 md:mt-0">
                        <p className="text-[10px] text-secondary uppercase tracking-widest font-bold mb-2 ml-1">Hash de Validação</p>
                        <code className="bg-black/5 dark:bg-slate-900/50 px-4 py-2 rounded-xl text-xs font-mono text-text border border-white/5 select-all block md:inline-block shadow-inner tracking-wider">
                            {(report as any).refId || report.id}
                        </code>
                    </div>
                </div>
            </div>

            {/* The Report Preview - Responsive Wrapper */}
            <div className="flex justify-center relative z-10 pb-20 w-full overflow-x-auto md:overflow-visible">
                {/* 
                   We use a trick here: scale down on mobile, but keep layout valid. 
                   Since 210mm is approx 794px.
                */}
                <div className="origin-top transform scale-[0.45] sm:scale-[0.6] md:scale-[0.8] lg:scale-100 transition-transform duration-300 shadow-2xl rounded-sm">
                    <ReportPreview data={report} />
                </div>
            </div>

            <div className="text-center text-secondary font-medium text-xs fixed bottom-6 left-0 w-full pointer-events-none">
                © {new Date().getFullYear()} Proxxima Telecom. Validação Digital.
            </div>
        </div>
    );
};
