import React, { useMemo } from 'react';
import { SavedReport } from '../services/supabaseService';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, CartesianGrid
} from 'recharts';
import { BarChart3, PieChart as PieIcon, TrendingUp, Download } from 'lucide-react';

interface AnalyticsProps {
    reports: SavedReport[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const AnalyticsDashboard: React.FC<AnalyticsProps> = ({ reports }) => {

    // 1. Defeitos Distribution
    const defectsData = useMemo(() => {
        const counts: Record<string, number> = {};
        reports.forEach(r => {
            const defect = r.reportedDefect || "Não Informado";
            counts[defect] = (counts[defect] || 0) + 1;
        });
        return Object.keys(counts).map(key => ({ name: key, value: counts[key] })).slice(0, 6);
    }, [reports]);

    // 2. Top Models
    const modelsData = useMemo(() => {
        const counts: Record<string, number> = {};
        reports.forEach(r => {
            const model = r.model || "Desconhecido";
            counts[model] = (counts[model] || 0) + 1;
        });

        return Object.entries(counts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, value]) => ({ name: name.length > 10 ? name.slice(0, 10) + '...' : name, value, fullName: name }));
    }, [reports]);

    // 3. Reports per Day (Simple mockup based on createdAt)
    const timelineData = useMemo(() => {
        if (!reports.length) return [];
        const counts: Record<string, number> = {};

        reports.forEach(r => {
            if (r.createdAt) {
                const date = new Date(r.createdAt).toLocaleDateString('pt-BR');
                counts[date] = (counts[date] || 0) + 1;
            }
        });

        return Object.keys(counts).map(date => ({ date, count: counts[date] })).reverse();
    }, [reports]);

    // 4. Technician Leaderboard
    const leaderboardData = useMemo(() => {
        const counts: Record<string, number> = {};
        reports.forEach(r => {
            const tech = r.technicianName || "Não Atribuído";
            counts[tech] = (counts[tech] || 0) + 1;
        });
        return Object.entries(counts)
            .sort(([, a], [, b]) => b - a)
            .map(([name, value], index) => ({ name, value, rank: index + 1 }));
    }, [reports]);

    // 5. Productivity Goal (Monthly)
    const productivityGoal = 50; // Hardcoded goal
    const currentMonthCount = useMemo(() => {
        const now = new Date();
        return reports.filter(r => {
            if (!r.createdAt) return false;
            const d = new Date(r.createdAt);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).length;
    }, [reports]);
    const goalProgress = Math.min((currentMonthCount / productivityGoal) * 100, 100);

    // 6. Average Resolution Time
    const efficiencyStats = useMemo(() => {
        const closed = reports.filter(r => r.status === 'closed');
        const total = reports.length || 1;
        const closureRate = (closed.length / total) * 100;

        let totalHours = 0;
        let validClosedCount = 0;

        closed.forEach(r => {
            if (r.createdAt && r.closedAt) {
                const created = new Date(r.createdAt).getTime();
                const closedTime = new Date(r.closedAt).getTime();
                const diffHours = (closedTime - created) / (1000 * 60 * 60);
                if (diffHours >= 0) {
                    totalHours += diffHours;
                    validClosedCount++;
                }
            }
        });

        const avgResolutionHours = validClosedCount > 0 ? (totalHours / validClosedCount) : 0;
        const avgText = avgResolutionHours > 24
            ? `${(avgResolutionHours / 24).toFixed(1)} dias`
            : `${avgResolutionHours.toFixed(1)} hrs`;

        const topTech = leaderboardData[0]?.name || "-";

        return { closureRate, topTech, avgText };
    }, [reports, leaderboardData]);

    // 7. Outcome Distribution
    const outcomeData = useMemo(() => {
        const counts: Record<string, number> = {};
        reports.forEach(r => {
            const outcome = r.outcomeType || "Não Definido";
            counts[outcome] = (counts[outcome] || 0) + 1;
        });

        const labels: Record<string, string> = {
            'internal_fix': 'Reparo Interno',
            'parts_request': 'Peça Solicitada',
            'external_assistance': 'Assist. Externa',
            'Não Definido': 'Não Definido'
        };

        return Object.keys(counts)
            .filter(key => counts[key] > 0)
            .map(key => ({ name: labels[key] || key, value: counts[key] }));
    }, [reports]);

    // 8. Most Requested Parts
    const requestedPartsData = useMemo(() => {
        const partsCount: Record<string, number> = {};
        reports.forEach(r => {
            if (r.partsRequested && Array.isArray(r.partsRequested)) {
                r.partsRequested.forEach(part => {
                    if (part.name) {
                        const nameLower = part.name.trim().toLowerCase();
                        partsCount[nameLower] = (partsCount[nameLower] || 0) + (part.quantity || 1);
                    }
                });
            }
        });

        return Object.entries(partsCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, value]) => {
                // Capitalize first letter
                const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
                return { name: formattedName.length > 15 ? formattedName.slice(0, 15) + '...' : formattedName, value, fullName: formattedName };
            });
    }, [reports]);

    // 9. Recidivism by Model
    const recidivismData = useMemo(() => {
        const serials: Record<string, { count: number, model: string }> = {};

        // Count reports per S/N or Patrimony
        reports.forEach(r => {
            const identifier = r.serialNumber || r.patrimonyId;
            if (identifier && identifier.trim().length > 3) {
                const idStr = identifier.trim().toLowerCase();
                if (!serials[idStr]) {
                    serials[idStr] = { count: 0, model: r.model || "Desconhecido" };
                }
                serials[idStr].count += 1;
            }
        });

        // Group by model where count > 1 (recurrent)
        const modelRecidivism: Record<string, number> = {};
        Object.values(serials).forEach(item => {
            if (item.count > 1) {
                modelRecidivism[item.model] = (modelRecidivism[item.model] || 0) + 1;
            }
        });

        return Object.entries(modelRecidivism)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, value]) => ({ name: name.length > 15 ? name.slice(0, 15) + '...' : name, value, fullName: name }));
    }, [reports]);

    const handleExportCSV = () => {
        if (!reports.length) return;

        const headers = ["ID", "Status", "Prioridade", "Criado Em", "Fechado Em", "Colaborador", "Setor", "Equipamento", "Modelo", "S/N", "Patrimonio", "Desfecho"];
        const rows = reports.map(r => [
            r.id || "",
            r.status || "",
            r.priority || "",
            r.createdAt ? new Date(r.createdAt).toLocaleString('pt-BR') : "",
            r.closedAt ? new Date(r.closedAt).toLocaleString('pt-BR') : "",
            r.requesterName || "",
            r.requesterSector || "",
            r.deviceType || "",
            r.model || "",
            r.serialNumber || "",
            r.patrimonyId || "",
            r.outcomeType || ""
        ]);

        const csvContent = [
            headers.join(";"),
            ...rows.map(e => e.map(String).map(s => `"${s.replace(/"/g, '""')}"`).join(";"))
        ].join("\n");

        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `relatorio_laudos_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 p-4 rounded-2xl border border-black/10 dark:border-white/10">
                <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                    Inteligência e Dados
                </h2>
                <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded-xl transition-colors text-sm"
                >
                    <Download className="w-4 h-4" />
                    Exportar CSV
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass-strong border border-white/10 p-5 rounded-2xl shadow-lg flex items-center justify-between hover:shadow-[0_0_30px_rgba(205,39,132,0.15)] transition-shadow">
                    <div>
                        <p className="text-secondary text-xs uppercase font-bold tracking-wider mb-1">Total de Laudos</p>
                        <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">{reports.length}</h3>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                        <BarChart3 className="w-6 h-6 text-primary" />
                    </div>
                </div>
                <div className="glass-strong border border-white/10 p-5 rounded-2xl shadow-lg flex items-center justify-between hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] transition-shadow">
                    <div>
                        <p className="text-secondary text-xs uppercase font-bold tracking-wider mb-1">Modelos Únicos</p>
                        <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400">{modelsData.length}</h3>
                    </div>
                    <div className="p-3 bg-accent/10 rounded-2xl border border-accent/20">
                        <PieIcon className="w-6 h-6 text-accent" />
                    </div>
                </div>
                <div className="glass-strong border border-white/10 p-5 rounded-2xl shadow-lg flex items-center justify-between hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] transition-shadow">
                    <div>
                        <p className="text-secondary text-xs uppercase font-bold tracking-wider mb-1">Laudos (Mês Atual)</p>
                        <h3 className="text-3xl font-black text-green-400">
                            {currentMonthCount}
                        </h3>
                    </div>
                    <div className="p-3 bg-green-500/10 rounded-2xl border border-green-500/20">
                        <TrendingUp className="w-6 h-6 text-green-400" />
                    </div>
                </div>
                <div className="glass-strong border border-white/10 p-5 rounded-2xl shadow-lg flex items-center justify-between hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-shadow">
                    <div>
                        <p className="text-secondary text-xs uppercase font-bold tracking-wider mb-1">Resolução (TMA)</p>
                        <h3 className="text-3xl font-black text-blue-400">
                            {efficiencyStats.avgText}
                        </h3>
                        <p className="text-[10px] text-secondary mt-1 tracking-wide font-medium">
                            {efficiencyStats.closureRate.toFixed(0)}% Taxa de Conclusão
                        </p>
                    </div>
                    <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                        <BarChart3 className="w-6 h-6 text-blue-400" />
                    </div>
                </div>
            </div>

            {/* Productivity & Goals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Monthly Goal */}
                <div className="md:col-span-1 glass-strong border border-white/10 p-6 rounded-3xl shadow-lg flex flex-col justify-center">
                    <h4 className="text-md font-bold text-text mb-2">Meta Mensal</h4>
                    <div className="flex items-end justify-between mb-2">
                        <span className="text-3xl font-bold text-primary">{currentMonthCount}</span>
                        <span className="text-sm text-secondary mb-1">/ {productivityGoal} laudos</span>
                    </div>
                    <div className="w-full bg-surface rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-primary to-blue-400 h-full rounded-full transition-all duration-1000"
                            style={{ width: `${goalProgress}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-secondary mt-3">
                        {goalProgress >= 100 ? "Meta atingida! 🚀" : `Faltam ${productivityGoal - currentMonthCount} laudos para a meta.`}
                    </p>
                </div>

                {/* Technician Leaderboard */}
                <div className="md:col-span-2 glass-strong border border-white/10 p-6 rounded-3xl shadow-lg">
                    <h4 className="text-md font-bold text-text mb-4">Ranking Técnico</h4>
                    <div className="space-y-3">
                        {leaderboardData.slice(0, 3).map((tech, idx) => (
                            <div key={tech.name} className="flex items-center gap-4">
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${idx === 0 ? 'bg-yellow-100 text-yellow-600' : idx === 1 ? 'bg-gray-100 text-gray-600' : 'bg-orange-100 text-orange-600'}`}>
                                    {tech.rank}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-medium text-text">{tech.name}</span>
                                        <span className="text-sm font-semibold text-primary">{tech.value} laudos</span>
                                    </div>
                                    <div className="w-full bg-surface rounded-full h-2">
                                        <div
                                            className={`h-full rounded-full ${idx === 0 ? 'bg-yellow-400' : idx === 1 ? 'bg-gray-400' : 'bg-orange-400'}`}
                                            style={{ width: `${(tech.value / (leaderboardData[0].value || 1)) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {leaderboardData.length === 0 && <p className="text-secondary text-sm">Sem dados de técnicos.</p>}
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Timeline Chart */}
                <div className="glass-strong border border-white/10 p-6 rounded-3xl shadow-lg lg:col-span-3 min-h-[300px] flex flex-col">
                    <h4 className="text-md font-bold text-text mb-4">Volume de Laudos por Dia</h4>
                    <div className="flex-1 w-full h-[250px]">
                        {timelineData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={timelineData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis dataKey="date" stroke="#ffffff50" fontSize={12} tickMargin={10} />
                                    <YAxis stroke="#ffffff50" fontSize={12} allowDecimals={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-secondary">Sem dados suficientes</div>
                        )}
                    </div>
                </div>

                {/* Pie Chart: Defeitos */}
                <div className="glass-strong border border-white/10 p-6 rounded-3xl shadow-lg min-h-[300px] flex flex-col">
                    <h4 className="text-md font-bold text-text mb-4">Principais Defeitos Relatados</h4>
                    <div className="flex-1 w-full h-[250px]">
                        {defectsData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={defectsData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                    >
                                        {defectsData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-secondary">Sem dados suficientes</div>
                        )}
                    </div>
                </div>

                {/* Bar Chart: Modelos */}
                <div className="glass-strong border border-white/10 p-6 rounded-3xl shadow-lg min-h-[300px] flex flex-col">
                    <h4 className="text-md font-bold text-text mb-4">Top 5 Modelos</h4>
                    <div className="flex-1 w-full h-[250px]">
                        {modelsData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={modelsData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]}>
                                        {modelsData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-secondary">Sem dados suficientes</div>
                        )}
                    </div>
                </div>

                {/* Pie Chart: Desfechos */}
                <div className="glass-strong border border-white/10 p-6 rounded-3xl shadow-lg min-h-[300px] flex flex-col">
                    <h4 className="text-md font-bold text-text mb-4">Divisão por Tipo de Desfecho</h4>
                    <div className="flex-1 w-full h-[250px]">
                        {outcomeData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={outcomeData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#82ca9d"
                                        dataKey="value"
                                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                    >
                                        {outcomeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-secondary">Sem dados suficientes</div>
                        )}
                    </div>
                </div>

                {/* Bar Chart: Peças Mais Solicitadas */}
                <div className="glass-strong border border-white/10 p-6 rounded-3xl shadow-lg lg:col-span-2 min-h-[300px] flex flex-col">
                    <h4 className="text-md font-bold text-text mb-4">Peças Mais Solicitadas</h4>
                    <div className="flex-1 w-full h-[250px]">
                        {requestedPartsData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={requestedPartsData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                                        {requestedPartsData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-secondary">Nenhuma peça solicitada ainda</div>
                        )}
                    </div>
                </div>

                {/* Pie Chart: Reincidência por Modelo */}
                <div className="glass-strong border border-white/10 p-6 rounded-3xl shadow-lg min-h-[300px] flex flex-col">
                    <h4 className="text-md font-bold text-text mb-4">Reincidência por Modelo</h4>
                    <div className="flex-1 w-full h-[250px]">
                        {recidivismData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={recidivismData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#f59e0b"
                                        dataKey="value"
                                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                    >
                                        {recidivismData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[(index + 4) % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-secondary">Sem equipamentos reincidentes</div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};
