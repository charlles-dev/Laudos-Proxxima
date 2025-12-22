import React, { useMemo } from 'react';
import { SavedReport } from '../services/supabaseService';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, CartesianGrid
} from 'recharts';
import { BarChart3, PieChart as PieIcon, TrendingUp } from 'lucide-react';

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

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-paper border border-line p-4 rounded-xl shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-secondary text-xs uppercase font-bold tracking-wider">Total de Laudos</p>
                        <h3 className="text-3xl font-bold text-primary mt-1">{reports.length}</h3>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-full">
                        <BarChart3 className="w-6 h-6 text-primary" />
                    </div>
                </div>
                <div className="bg-paper border border-line p-4 rounded-xl shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-secondary text-xs uppercase font-bold tracking-wider">Modelos Únicos</p>
                        <h3 className="text-3xl font-bold text-accent mt-1">{modelsData.length}</h3>
                    </div>
                    <div className="p-3 bg-accent/10 rounded-full">
                        <PieIcon className="w-6 h-6 text-accent" />
                    </div>
                </div>
                <div className="bg-paper border border-line p-4 rounded-xl shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-secondary text-xs uppercase font-bold tracking-wider">Produtividade (Hoje)</p>
                        <h3 className="text-3xl font-bold text-green-500 mt-1">
                            {timelineData.length > 0 ? timelineData[timelineData.length - 1].count : 0}
                        </h3>
                    </div>
                    <div className="p-3 bg-green-500/10 rounded-full">
                        <TrendingUp className="w-6 h-6 text-green-500" />
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Pie Chart: Defeitos */}
                <div className="bg-paper border border-line p-6 rounded-xl shadow-sm min-h-[300px] flex flex-col">
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
                <div className="bg-paper border border-line p-6 rounded-xl shadow-sm min-h-[300px] flex flex-col">
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

            </div>
        </div>
    );
};
