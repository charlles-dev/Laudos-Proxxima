import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SavedReport, getReports, getAllReports, getReportById, getUserProfile, deleteReports, updateReport } from '../services/supabaseService';
import { Plus, Search, FileText, BarChart2, List, Copy, Download, Loader2, Eye, LayoutGrid, Table as TableIcon, Trash2, CheckSquare, XSquare } from 'lucide-react';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { ActivityLog } from './ActivityLog';
import { KanbanBoard } from './KanbanBoard';


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
    const [userRole, setUserRole] = useState<'admin' | 'user' | 'tech'>('tech');

    // Advanced Filters State
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    // View State
    const [viewType, setViewType] = useState<'list' | 'kanban'>('list');

    // Bulk Actions State
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isBulkActionLoading, setIsBulkActionLoading] = useState(false);

    useEffect(() => {
        if (currentUser) {
            getUserProfile(currentUser.id).then(profile => {
                if (profile && profile.role) {
                    setUserRole(profile.role);
                }
            });
        }
    }, [currentUser]);

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

    // --- Memoized Filtering Logic ---
    const filteredReports = React.useMemo(() => {
        let result = activeTab === 'my' ? reports : allReports;

        // 1. Text Search (ID, Model, Client, Defect)
        if (searchTerm.trim()) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(r =>
                r.id.toLowerCase().includes(lower) ||
                r.model.toLowerCase().includes(lower) ||
                r.requesterName.toLowerCase().includes(lower) ||
                (r.reportedDefect && r.reportedDefect.toLowerCase().includes(lower))
            );
        }

        // 2. Status Filter
        if (statusFilter !== 'all') {
            result = result.filter(r => r.status === statusFilter);
        }

        // 3. Priority Filter
        if (priorityFilter !== 'all') {
            result = result.filter(r => r.priority === priorityFilter);
        }

        // 4. Date Filter
        if (dateFilter !== 'all') {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Midnight today

            result = result.filter(r => {
                const rDate = new Date(r.createdAt);
                if (dateFilter === 'today') {
                    return rDate >= today;
                } else if (dateFilter === 'week') {
                    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return rDate >= weekAgo;
                } else if (dateFilter === 'month') {
                    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                    return rDate >= monthAgo;
                }
                return true;
            });
        }

        return result;
    }, [reports, allReports, activeTab, searchTerm, statusFilter, priorityFilter, dateFilter]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Search is now real-time via useMemo, but we keep this to prevent form submit reload
    };

    const handleUpdateStatus = async (reportId: string, newStatus: 'open' | 'in_progress' | 'closed') => {
        try {
            // Optimistic Update
            const updater = (prev: SavedReport[]) => prev.map(r => r.id === reportId ? { ...r, status: newStatus } : r);
            setReports(updater);
            setAllReports(updater);

            await updateReport(reportId, { status: newStatus });
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Erro ao atualizar status.");
            fetchData(); // Revert
        }
    };



    // --- Bulk Action Handlers ---
    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedIds(newSet);
    };

    const toggleAll = () => {
        if (selectedIds.size === filteredReports.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredReports.map(r => r.id)));
        }
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Tem certeza que deseja excluir ${selectedIds.size} laudos?`)) return;

        setIsBulkActionLoading(true);
        try {
            await deleteReports(Array.from(selectedIds));

            // Remove from UI
            const remaining = allReports.filter(r => !selectedIds.has(r.id));
            setReports(remaining); // Simplification: assume allReports includes myReports for now or reload
            setAllReports(remaining);
            setSelectedIds(new Set());

            // Or just refetch to be safe
            fetchData();
        } catch (error) {
            alert("Erro ao excluir laudos.");
        } finally {
            setIsBulkActionLoading(false);
        }
    };

    const handleBulkStatusChange = async (newStatus: 'open' | 'in_progress' | 'closed') => {
        setIsBulkActionLoading(true);
        try {
            const promises = Array.from(selectedIds).map((id: string) => updateReport(id, { status: newStatus }));
            await Promise.all(promises);

            // Optimistic / Reload
            setSelectedIds(new Set());
            fetchData();
        } catch (error) {
            alert("Erro ao atualizar status em massa.");
        } finally {
            setIsBulkActionLoading(false);
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setPriorityFilter('all');
        setDateFilter('all');
    };

    const activeFilterCount = (statusFilter !== 'all' ? 1 : 0) + (priorityFilter !== 'all' ? 1 : 0) + (dateFilter !== 'all' ? 1 : 0);

    // Render Table Row
    const renderRow = (report: SavedReport) => (
        <tr key={report.id} className={`hover:bg-surface/50 transition-colors border-b border-line last:border-0 group ${selectedIds.has(report.id) ? 'bg-primary/5' : ''}`}>
            <td className="px-6 py-4 whitespace-nowrap">
                <input
                    type="checkbox"
                    checked={selectedIds.has(report.id)}
                    onChange={() => toggleSelection(report.id)}
                    className="w-4 h-4 text-primary border-line rounded focus:ring-primary cursor-pointer"
                />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : '-'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                {report.id.slice(0, 8)}...
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                <div className="flex flex-col">
                    <span className="font-medium">{report.model}</span>
                    <span className="text-xs text-secondary">{report.requesterName}</span>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                {report.reportedDefect && report.reportedDefect.length > 20 ? report.reportedDefect.slice(0, 20) + '...' : report.reportedDefect}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-xs">
                <span className={`px-2 py-1 rounded-full font-semibold ${report.status === 'open' ? 'bg-blue-100/10 text-blue-500 border border-blue-500/20' :
                    report.status === 'in_progress' ? 'bg-yellow-100/10 text-yellow-500 border border-yellow-500/20' :
                        'bg-green-100/10 text-green-500 border border-green-500/20'
                    }`}>
                    {report.status === 'open' ? 'Aberto' : report.status === 'in_progress' ? 'Em Análise' : 'Fechado'}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-xs">
                {report.priority === 'high' || report.priority === 'critical' ? (
                    <span className="px-2 py-1 rounded-full font-semibold bg-red-100/10 text-red-500 border border-red-500/20">Urgente</span>
                ) : (
                    <span className="text-secondary">-</span>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onViewReport(report)} className="p-1.5 hover:bg-primary/10 rounded text-primary" title="Visualizar">
                    <Eye className="w-4 h-4" />
                </button>
                <button onClick={() => onCloneReport(report)} className="p-1.5 hover:bg-accent/10 rounded text-accent" title="Clonar">
                    <Copy className="w-4 h-4" />
                </button>
            </td>
        </tr>
    );

    const isAdmin = userRole === 'admin';

    return (
        <div className="flex-1 flex flex-col items-center p-6 bg-surface overflow-hidden h-full">
            <div className="w-full max-w-6xl h-full flex flex-col">

                {/* Top Controls */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-text">Painel de Controle</h2>
                        <p className="text-secondary text-sm">
                            {isAdmin ? 'Acesso Administrativo' : 'Área Técnica'} • {currentUser?.email}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button
                            onClick={onCreateNew}
                            className="flex items-center gap-2 px-4 py-2 bg-primary hover:opacity-90 text-white rounded-lg shadow-sm transition text-sm font-semibold whitespace-nowrap"
                        >
                            <Plus className="w-4 h-4" />
                            Novo Laudo
                        </button>
                    </div>
                </div>

                {/* Tabs & Search Bar Row */}
                <div className="flex flex-col md:flex-row justify-between items-end border-b border-line mb-6 gap-4">

                    {/* Tabs */}
                    <div className="flex items-center gap-4 overflow-x-auto w-full md:w-auto">
                        <button
                            onClick={() => setActiveTab('my')}
                            className={`flex items-center gap-2 pb-3 px-2 border-b-2 transition text-sm font-medium whitespace-nowrap ${activeTab === 'my' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-text'}`}
                        >
                            <FileText className="w-4 h-4" />
                            Meus Laudos
                        </button>

                        {/* BI Tab - Always Visible, Second Position */}
                        <button
                            onClick={() => setActiveTab('bi')}
                            className={`flex items-center gap-2 pb-3 px-2 border-b-2 transition text-sm font-medium whitespace-nowrap ${activeTab === 'bi' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-text'}`}
                        >
                            <BarChart2 className="w-4 h-4" />
                            BI / Analítico
                        </button>

                        <button
                            onClick={() => setActiveTab('all')}
                            className={`flex items-center gap-2 pb-3 px-2 border-b-2 transition text-sm font-medium whitespace-nowrap ${activeTab === 'all' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-text'}`}
                        >
                            <List className="w-4 h-4" />
                            Todos os Laudos
                        </button>

                        {isAdmin && (
                            <button
                                onClick={() => setActiveTab('logs')}
                                className={`flex items-center gap-2 pb-3 px-2 border-b-2 transition text-sm font-medium whitespace-nowrap ${activeTab === 'logs' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-text'}`}
                            >
                                <ActivityLogIcon className="w-4 h-4" />
                                Logs
                            </button>
                        )}
                    </div>

                    {/* Search & Filter & View Toggle Trigger */}
                    {(activeTab === 'my' || activeTab === 'all') && (
                        <div className="flex items-center gap-2 w-full md:w-auto pb-2">
                            <div className="relative flex-1 md:w-64">
                                <input
                                    type="text"
                                    placeholder="Buscar por ID, Cliente, Modelo..."
                                    className="w-full pl-10 pr-4 py-2 bg-paper border border-line rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            </div>

                            <div className="flex items-center gap-1 bg-paper border border-line rounded-lg p-1">
                                <button
                                    onClick={() => setViewType('list')}
                                    className={`p-1.5 rounded transition-all ${viewType === 'list' ? 'bg-surface shadow-sm text-primary' : 'text-secondary hover:text-text'}`}
                                    title="Lista"
                                >
                                    <TableIcon className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewType('kanban')}
                                    className={`p-1.5 rounded transition-all ${viewType === 'kanban' ? 'bg-surface shadow-sm text-primary' : 'text-secondary hover:text-text'}`}
                                    title="Kanban"
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                            </div>

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`p-2 rounded-lg border transition-colors flex items-center gap-2 ${showFilters || activeFilterCount > 0 ? 'bg-primary/10 border-primary text-primary' : 'bg-paper border-line text-secondary hover:border-primary/50'}`}
                                title="Filtros"
                            >
                                <List className="w-4 h-4" />
                                {activeFilterCount > 0 && (
                                    <span className="bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">{activeFilterCount}</span>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* Advanced Filters Panel */}
                {(showFilters && (activeTab === 'my' || activeTab === 'all')) && (
                    <div className="bg-paper border border-line p-4 rounded-xl mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in-down shadow-sm">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-secondary uppercase">Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-surface border border-line rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                            >
                                <option value="all">Todos</option>
                                <option value="open">Em Aberto</option>
                                <option value="in_progress">Em Análise</option>
                                <option value="closed">Fechado</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-secondary uppercase">Prioridade</label>
                            <select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                                className="bg-surface border border-line rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                            >
                                <option value="all">Todas</option>
                                <option value="normal">Normal</option>
                                <option value="high">Alta</option>
                                <option value="critical">Crítica</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-secondary uppercase">Período</label>
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="bg-surface border border-line rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                            >
                                <option value="all">Todo o período</option>
                                <option value="today">Hoje</option>
                                <option value="week">Últimos 7 dias</option>
                                <option value="month">Últimos 30 dias</option>
                            </select>
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={clearFilters}
                                className="text-sm text-secondary hover:text-red-500 underline ml-auto pb-2 transition-colors"
                            >
                                Limpar Filtros
                            </button>
                        </div>
                    </div>
                )}


                {/* Floating Bulk Action Bar */}
                {/* Floating Bulk Action Bar */}
                {selectedIds.size > 0 && (
                    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-paper/95 backdrop-blur-sm text-text px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-6 animate-fade-in-up border border-line">
                        <span className="font-semibold text-sm">{selectedIds.size} selecionado(s)</span>

                        <div className="h-4 w-px bg-line"></div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleBulkStatusChange('closed')}
                                disabled={isBulkActionLoading}
                                className="flex items-center gap-2 px-3 py-1.5 hover:bg-secondary/10 rounded-md transition text-sm font-medium text-text"
                            >
                                <CheckSquare className="w-4 h-4" />
                                Concluir
                            </button>
                            <button
                                onClick={handleBulkDelete}
                                disabled={isBulkActionLoading}
                                className="flex items-center gap-2 px-3 py-1.5 hover:bg-red-500/10 text-red-500 hover:text-red-600 rounded-md transition text-sm font-medium"
                            >
                                {isBulkActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                Excluir
                            </button>
                        </div>

                        <button onClick={() => setSelectedIds(new Set())} className="ml-2 p-1 hover:bg-secondary/10 rounded-full text-secondary hover:text-text transition-colors">
                            <XSquare className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Content Area */}
                <div className="flex-1 overflow-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-40">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <>
                            {(activeTab === 'my' || activeTab === 'all') && (
                                <>
                                    {viewType === 'list' ? (
                                        <div className="bg-paper rounded-xl shadow-sm border border-line overflow-hidden">
                                            <table className="min-w-full divide-y divide-line">
                                                <thead className="bg-surface/50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left">
                                                            <input
                                                                type="checkbox"
                                                                checked={filteredReports.length > 0 && selectedIds.size === filteredReports.length}
                                                                onChange={toggleAll}
                                                                className="w-4 h-4 text-primary border-line rounded focus:ring-primary cursor-pointer"
                                                            />
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Data</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">ID</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Modelo / Cliente</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Defeito</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Status</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Prioridade</th>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-secondary uppercase tracking-wider">Ações</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-paper divide-y divide-line">
                                                    {filteredReports.length > 0 ? (
                                                        filteredReports.map(renderRow)
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={8} className="px-6 py-12 text-center text-secondary">
                                                                <div className="flex flex-col items-center gap-2">
                                                                    <div className="bg-surface p-4 rounded-full">
                                                                        <Search className="w-6 h-6 text-gray-400" />
                                                                    </div>
                                                                    <p className="font-medium">Nenhum laudo encontrado.</p>
                                                                    <p className="text-sm text-gray-500">Tente ajustar seus filtros de busca.</p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <KanbanBoard
                                            reports={filteredReports}
                                            onUpdateStatus={handleUpdateStatus}
                                            onViewReport={onViewReport}
                                        />
                                    )}
                                </>
                            )}

                            {activeTab === 'bi' && (
                                <AnalyticsDashboard reports={allReports} />
                            )}

                            {activeTab === 'logs' && isAdmin && (
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
