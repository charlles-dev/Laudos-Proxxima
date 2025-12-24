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
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-[var(--darkslateblue)] animate-spin" />
                    <p className="text-gray-500 font-medium">Verificando autenticidade...</p>
                </div>
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-gray-100">
                    <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-10 h-10 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Documento Não Encontrado</h1>
                    <p className="text-gray-500 mb-6">
                        Não foi possível validar este laudo. Verifique se o link está correto ou se o documento foi removido.
                    </p>
                    <div className="text-xs text-gray-400 border-t pt-4">
                        Ref: {reportId}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 font-sans relative overflow-hidden">

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #000 1px, transparent 0)', backgroundSize: '40px 40px' }}>
            </div>

            {/* Verification Header */}
            <div className="max-w-[210mm] mx-auto mb-8 relative z-10">
                <div className="bg-white border-l-4 border-green-500 rounded-r-lg shadow-sm p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-100 p-3 rounded-full animate-pulse-slow">
                            <ShieldCheck className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-gray-900 font-bold text-xl flex items-center gap-2">
                                Laudo Técnico Autêntico
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full border border-green-200 uppercase tracking-wide">Verificado</span>
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">
                                Emitido por <strong className="text-gray-700">Proxxima Telecom</strong> • {new Date(report.date).toLocaleDateString('pt-BR')}
                            </p>
                        </div>
                    </div>

                    <div className="text-right hidden md:block">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Hash de Validação</p>
                        <code className="bg-gray-50 px-3 py-1.5 rounded text-sm font-mono text-gray-600 border border-gray-200 select-all">
                            {(report as any).id || reportId}
                        </code>
                    </div>
                </div>
            </div>

            {/* The Report Preview */}
            <div className="flex justify-center relative z-10 pb-20">
                <div className="shadow-2xl rounded-sm overflow-hidden transform transition-all hover:scale-[1.005] duration-500">
                    <ReportPreview data={report} />
                </div>
            </div>

            {/* Float Action Button equivalent for downloading? Maybe later. */}

            <div className="text-center text-gray-400 text-xs fixed bottom-6 left-0 w-full pointer-events-none">
                © {new Date().getFullYear()} Proxxima Telecom. Validação Digital.
            </div>
        </div>
    );
};
