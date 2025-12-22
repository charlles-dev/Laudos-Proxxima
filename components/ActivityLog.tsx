import React, { useEffect, useState } from 'react';
import { ActivityLog as LogType, getRecentLogs } from '../services/supabaseService';
import { Loader2, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const ActivityLog: React.FC = () => {
    const [logs, setLogs] = useState<LogType[]>([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    useEffect(() => {
        fetchLogs();
    }, [currentUser]);

    const fetchLogs = async () => {
        try {
            const data = await getRecentLogs();
            setLogs(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-4 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;

    return (
        <div className="bg-surface rounded-lg border border-line p-4">
            <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary">Log de Atividades</h3>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin pr-2">
                {logs.length === 0 ? (
                    <p className="text-sm text-secondary italic">Nenhuma atividade recente.</p>
                ) : (
                    logs.map((log) => (
                        <div key={log.id} className="flex flex-col text-sm border-b border-line pb-2 last:border-0 hover:bg-paper p-2 rounded transition">
                            <div className="flex justify-between items-start">
                                <span className="font-medium text-text">{log.action}</span>
                                <span className="text-[10px] text-gray-400">
                                    {log.timestamp ? new Date(log.timestamp).toLocaleString() : ''}
                                </span>
                            </div>
                            <span className="text-secondary text-xs mt-1">{log.details}</span>
                            <span className="text-[10px] text-gray-400 mt-1">Usuário ID: {log.userId.slice(0, 5)}...</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
