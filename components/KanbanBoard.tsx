import React from 'react';
import { SavedReport } from '../services/supabaseService';
import { MoreHorizontal, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface KanbanBoardProps {
    reports: SavedReport[];
    onUpdateStatus: (reportId: string, newStatus: 'open' | 'in_progress' | 'closed') => void;
    onViewReport: (report: SavedReport) => void;
}

const COLUMN_CONFIG = [
    { id: 'open', title: 'Aberto', color: 'bg-blue-500', bg: 'bg-blue-50', icon: AlertCircle },
    { id: 'in_progress', title: 'Em Análise', color: 'bg-yellow-500', bg: 'bg-yellow-50', icon: Clock },
    { id: 'closed', title: 'Concluído', color: 'bg-green-500', bg: 'bg-green-50', icon: CheckCircle2 }
] as const;

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ reports, onUpdateStatus, onViewReport }) => {

    const [activeDragColumn, setActiveDragColumn] = React.useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent, reportId: string) => {
        e.dataTransfer.setData('reportId', reportId);
        e.dataTransfer.effectAllowed = 'move';
        // Add a small delay/timeout to add a class if we want to change the drag source appearance
        // e.currentTarget.classList.add('opacity-50'); (This is handled by browser mostly, but we can do custom)
    };

    const handleDragOver = (e: React.DragEvent, colId: string) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (activeDragColumn !== colId) {
            setActiveDragColumn(colId);
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        setActiveDragColumn(null);
    }

    const handleDrop = (e: React.DragEvent, status: 'open' | 'in_progress' | 'closed') => {
        e.preventDefault();
        setActiveDragColumn(null);
        const reportId = e.dataTransfer.getData('reportId');
        if (reportId) {
            onUpdateStatus(reportId, status);
        }
    };

    return (
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
            <div className="flex h-full gap-6 min-w-[1000px] p-2">
                {COLUMN_CONFIG.map(col => {
                    const colReports = reports.filter(r => r.status === col.id);
                    const Icon = col.icon;
                    const isDragOver = activeDragColumn === col.id;

                    return (
                        <div
                            key={col.id}
                            className={`flex-1 flex flex-col rounded-2xl border border-white/10 transition-all duration-200 h-full max-h-full
                                ${isDragOver ? 'bg-primary/5 border-primary shadow-[0_0_30px_rgba(205,39,132,0.15)] scale-[1.01]' : 'glass-strong'}
                            `}
                            onDragOver={(e) => handleDragOver(e, col.id)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, col.id)}
                        >
                            {/* Header */}
                            <div className={`p-4 border-b border-white/10 flex items-center justify-between sticky top-0 rounded-t-2xl z-10 transition-colors
                                ${isDragOver ? 'bg-primary/10' : 'bg-transparent'}
                            `}>
                                <div className="flex items-center gap-2">
                                    <div className={`p-1.5 rounded-lg ${col.bg}`}>
                                        <Icon className={`w-4 h-4 ${col.id === 'open' ? 'text-blue-600 dark:text-blue-500' : col.id === 'in_progress' ? 'text-yellow-600 dark:text-yellow-500' : 'text-green-600 dark:text-green-500'}`} />
                                    </div>
                                    <span className="font-bold text-text drop-shadow-sm">{col.title}</span>
                                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-text text-xs font-semibold border border-white/20 shadow-inner">
                                        {colReports.length}
                                    </span>
                                </div>
                            </div>

                            {/* Cards Area */}
                            <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                                {colReports.map(report => (
                                    <div
                                        key={report.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, report.id)}
                                        onClick={() => onViewReport(report)}
                                        className="glass p-4 rounded-xl border border-white/5 hover:shadow-lg hover:border-primary/50 cursor-pointer transition-all group active:cursor-grabbing active:scale-95 active:shadow-xl"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-bold font-mono text-secondary px-2 py-1 bg-white/5 rounded-md border border-white/10 tracking-widest uppercase">
                                                {report.id.slice(0, 8)}
                                            </span>
                                            {report.priority === 'high' || report.priority === 'critical' ? (
                                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Urgente" />
                                            ) : null}
                                        </div>

                                        <h4 className="font-bold text-text mb-1 line-clamp-1">{report.model}</h4>
                                        <p className="text-secondary text-xs mb-3 line-clamp-2 leading-relaxed">{report.reportedDefect}</p>

                                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                                    {report.technicianName ? report.technicianName.charAt(0).toUpperCase() : 'T'}
                                                </div>
                                                <span className="text-xs text-secondary truncate max-w-[80px]">
                                                    {report.requesterName.split(' ')[0]}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-secondary">
                                                {new Date(report.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
