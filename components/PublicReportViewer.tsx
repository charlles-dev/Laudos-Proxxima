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
                <Loader2 className="w-10 h-10 text-[var(--darkslateblue)] animate-spin" />
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
                <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold text-gray-800">Laudo não encontrado</h1>
                <p className="text-gray-500 mt-2">Verifique o link ou o QR Code utilizado.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 font-sans">
            {/* Verification Banner */}
            <div className="max-w-[210mm] mx-auto mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 shadow-sm">
                <ShieldCheck className="w-8 h-8 text-green-600" />
                <div>
                    <h2 className="text-green-800 font-bold text-lg">Documento Autêntico</h2>
                    <p className="text-green-700 text-sm">Validado digitalmente por sistema Proxxima Telecom.</p>
                </div>
            </div>

            {/* The Report */}
            <div className="flex justify-center scale-90 md:scale-100 origin-top">
                <ReportPreview data={report} />
            </div>

            <p className="text-center text-gray-400 text-xs mt-8 pb-8">
                © {new Date().getFullYear()} Proxxima Telecom. Todos os direitos reservados.
            </p>
        </div>
    );
};
