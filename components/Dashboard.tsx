import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SavedReport, getReports, getAllReports, getReportById } from '../services/supabaseService';
import { Plus, Search, FileText, BarChart2, List, Copy, Download, Loader2, Eye } from 'lucide-react';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { ActivityLog } from './ActivityLog';

interface DashboardProps {
    onCreateNew: () => void;
    onViewReport: (report: SavedReport) => void;
    onCloneReport: (report: SavedReport) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onCreateNew, onViewReport, onCloneReport }) => {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState<'my' | 'all' | 'bi' | 'logs'>('my');
    const [reports, setReports] = useState<SavedReport[]>([]);
    const [allReports, setAllReports] = useState<SavedReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, [currentUser, activeTab]);

    const fetchData = async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            if (activeTab === 'my') {
                const data = await getReports(currentUser.id);
                setReports(data);
            } else if (activeTab === 'all' || activeTab === 'bi') {
                // For BI we need all reports too
                const data = await getAllReports();
                setAllReports(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        try {
            setLoading(true);
            // Try to find by ID first
            const report = await getReportById(searchTerm.trim());
            if (report) {
                onViewReport(report);
                setSearchTerm(''); // Clear search after finding
            } else {
                alert("Laudo não encontrado com este ID.");
            }
        } catch (err) {
            console.error(err);
            alert("Erro na busca.");
        } finally {
            setLoading(false);
        }
    };

    const currentList = activeTab === 'my' ? reports : allReports;

    // Render Table Row
    const renderRow = (report: SavedReport) => (
        <tr key={report.id} className="hover:bg-surface/50 transition-colors border-b border-line last:border-0 group">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : '-'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                {report.id.slice(0, 8)}...
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                {report.model}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                {report.reportedDefect && report.reportedDefect.length > 20 ? report.reportedDefect.slice(0, 20) + '...' : report.reportedDefect}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onViewReport(report)} className="p-1.5 hover:bg-primary/10 rounded text-primary" title="Visualizar">
                    <Eye className="w-4 h-4" />
                </button>
                <button onClick={() => onCloneReport(report)} className="p-1.5 hover:bg-accent/10 rounded text-accent" title="Clonar">
                    <Copy className="w-4 h-4" />
                </button>
            </td>
        </tr>
    );

    return (
        <div className="flex-1 flex flex-col items-center p-6 bg-surface overflow-hidden h-full">
            <div className="w-full max-w-6xl h-full flex flex-col">

                {/* Top Controls */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-text">Painel de Controle</h2>
                        <p className="text-secondary text-sm">Gerencie laudos e visualize métricas.</p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <form onSubmit={handleSearch} className="relative flex-1 md:w-64">
                            <input
                                type="text"
                                placeholder="Buscar por ID..."
                                className="w-full pl-10 pr-4 py-2 bg-paper border border-line rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        </form>
                        <button
                            onClick={onCreateNew}
                            className="flex items-center gap-2 px-4 py-2 bg-primary hover:opacity-90 text-white rounded-lg shadow-sm transition text-sm font-semibold whitespace-nowrap"
                        >
                            <Plus className="w-4 h-4" />
                            Novo Laudo
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-4 border-b border-line mb-6 shrink-0 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('my')}
                        className={`flex items-center gap-2 pb-3 px-2 border-b-2 transition text-sm font-medium whitespace-nowrap ${activeTab === 'my' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-text'}`}
                    >
                        <FileText className="w-4 h-4" />
                        Meus Laudos
                    </button>
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`flex items-center gap-2 pb-3 px-2 border-b-2 transition text-sm font-medium whitespace-nowrap ${activeTab === 'all' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-text'}`}
                    >
                        <List className="w-4 h-4" />
                        Todos os Laudos
                    </button>
                    <button
                        onClick={() => setActiveTab('bi')}
                        className={`flex items-center gap-2 pb-3 px-2 border-b-2 transition text-sm font-medium whitespace-nowrap ${activeTab === 'bi' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-text'}`}
                    >
                        <BarChart2 className="w-4 h-4" />
                        BI / Analítico
                    </button>
                    <button
                        onClick={() => setActiveTab('logs')}
                        className={`flex items-center gap-2 pb-3 px-2 border-b-2 transition text-sm font-medium whitespace-nowrap ${activeTab === 'logs' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-text'}`}
                    >
                        <ActivityLogIcon className="w-4 h-4" />
                        Logs
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-40">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <>
                            {(activeTab === 'my' || activeTab === 'all') && (
                                <div className="bg-paper rounded-xl shadow-sm border border-line overflow-hidden">
                                    <table className="min-w-full divide-y divide-line">
                                        <thead className="bg-surface/50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Data</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">ID</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Modelo</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Defeito</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-secondary uppercase tracking-wider">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-paper divide-y divide-line">
                                            {currentList.length > 0 ? (
                                                currentList.map(renderRow)
                                            ) : (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-secondary">
                                                        Nenhum laudo encontrado.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {activeTab === 'bi' && (
                                <AnalyticsDashboard reports={allReports} />
                            )}

                            {activeTab === 'logs' && (
                                <ActivityLog />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// Helper Icon
const ActivityLogIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" /></svg>
)
