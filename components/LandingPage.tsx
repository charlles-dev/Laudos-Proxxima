import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionTemplate, useMotionValue } from 'framer-motion';
import { ShieldCheck, Sparkles, Zap, ChevronRight, Globe, Mail, Lock, Cpu, BarChart3, Activity } from 'lucide-react';

interface LandingPageProps {
    onEnter: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
    return (
        <div className="min-h-screen bg-[#030712] overflow-x-hidden text-slate-300 font-sans selection:bg-primary/30 selection:text-primary">
            <BackgroundGrid />

            <Navbar onEnter={onEnter} />

            <main className="relative z-10">
                <HeroSection onEnter={onEnter} />
                <FeaturesSection />
                <StatsSection />
            </main>

            <Footer />
        </div>
    );
};

// --- Sub-components ---

const Navbar: React.FC<{ onEnter: () => void }> = ({ onEnter }) => (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#030712]/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <img src="https://www.proxxima.net/storage/app/uploads/public/5ea/1f7/af7/5ea1f7af72b2c773156463.svg" alt="Proxxima" className="h-8 md:h-10 opacity-90" />
            </div>
            <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
                {['Funcionalidades', 'Segurança', 'Integração'].map((item) => (
                    <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors relative group">
                        {item}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                    </a>
                ))}
            </div>
            <button
                onClick={onEnter}
                className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-semibold transition-all hover:scale-105 active:scale-95 ring-1 ring-white/10 active:ring-primary/50"
            >
                Acessar Sistema
            </button>
        </div>
    </nav>
);

const HeroSection: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative z-20"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide mb-8 animate-pulseSoft">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        NOVA VERSÃO 2.0 DISPONÍVEL
                    </div>

                    <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-tight text-white mb-6">
                        Gestão Técnica <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-primary bg-300% animate-gradient">
                            Simplesmente Foda.
                        </span>
                    </h1>

                    <p className="text-lg text-slate-400 mb-10 max-w-xl leading-relaxed">
                        A plataforma definitiva para técnicos de telecom. Gere laudos precisos, use IA para diagnósticos e valide documentos em segundos.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={onEnter}
                            className="group relative px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg overflow-hidden shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-primary/40 active:scale-95"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-shine" />
                            Começar Agora
                            <ChevronRight className="inline ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all backdrop-blur-sm">
                            Ver Demonstração
                        </button>
                    </div>
                </motion.div>

                {/* 3D Visual */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotateX: 20, rotateY: -20 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 10, rotateY: -10 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    style={{ y: y1 }}
                    className="relative z-10 perspective-1000 hidden lg:block"
                >
                    {/* Floating Eelements */}
                    <motion.div style={{ y: y2, x: 50 }} className="absolute -top-20 -right-20 z-30 bg-black/60 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl skew-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                <ShieldCheck className="text-green-400 w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-xs text-slate-400">Status do Laudo</div>
                                <div className="text-sm font-bold text-white">Validado via Blockchain</div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="relative rounded-2xl border border-white/10 bg-[#0f111a] shadow-[0_0_80px_rgba(205,39,132,0.15)] p-2 transform rotate-y-12 rotate-x-6 hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700 ease-out preserve-3d group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

                        {/* Fake Browser Header */}
                        <div className="h-8 bg-[#1a1d2d] rounded-t-lg flex items-center px-4 gap-2 mb-[-1px]">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            </div>
                            <div className="flex-1 text-center text-[10px] text-slate-500 font-mono">app.proxxima.net/dashboard</div>
                        </div>

                        {/* Fake UI Content */}
                        <div className="bg-[#0B0D14] rounded-b-lg p-6 min-h-[400px] border-t border-white/5 relative overflow-hidden">
                            {/* Abstract UI Representation */}
                            <div className="flex gap-6 mb-8">
                                <div className="w-64 h-full space-y-3">
                                    <div className="h-20 rounded-lg bg-white/5 animate-pulse" />
                                    <div className="h-10 rounded-lg bg-white/5 opacity-50" />
                                    <div className="h-10 rounded-lg bg-white/5 opacity-50" />
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div className="flex gap-4">
                                        <div className="h-32 flex-1 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 p-4">
                                            <BarChart3 className="text-primary w-8 h-8 mb-4" />
                                            <div className="w-16 h-2 bg-primary/20 rounded mb-2" />
                                            <div className="w-24 h-4 bg-primary/40 rounded" />
                                        </div>
                                        <div className="h-32 flex-1 rounded-xl bg-white/5 border border-white/5 p-4" />
                                        <div className="h-32 flex-1 rounded-xl bg-white/5 border border-white/5 p-4" />
                                    </div>
                                    <div className="h-64 rounded-xl bg-white/5 border border-white/5 p-4 space-y-3">
                                        <div className="flex justify-between">
                                            <div className="w-32 h-4 bg-white/10 rounded" />
                                            <div className="w-20 h-4 bg-white/10 rounded" />
                                        </div>
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="h-12 w-full bg-white/5 rounded-lg border border-white/5" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

const FeaturesSection: React.FC = () => {
    return (
        <section className="py-24 px-6 relative z-20">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Poderoso. Seguro. <span className="text-primary">Inteligente.</span></h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Cada ferramenta foi desenhada para eliminar gargalos e transformar a forma como você trabalha.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SpotlightCard>
                        <Zap className="w-10 h-10 text-yellow-400 mb-6" />
                        <h3 className="text-xl font-bold text-white mb-3">Diagnóstico com IA</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Nossa IA analisa os sintomas relatados e sugere o diagnóstico técnico mais provável em segundos.
                        </p>
                    </SpotlightCard>

                    <SpotlightCard>
                        <ShieldCheck className="w-10 h-10 text-green-400 mb-6" />
                        <h3 className="text-xl font-bold text-white mb-3">Validação Criptográfica</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Cada laudo emitido possui um hash único verificável publicamente, garantindo integridade total.
                        </p>
                    </SpotlightCard>

                    <SpotlightCard>
                        <Activity className="w-10 h-10 text-blue-400 mb-6" />
                        <h3 className="text-xl font-bold text-white mb-3">Monitoramento Real-time</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Acompanhe métricas de atendimento e performance técnica em tempo real no nosso dashboard.
                        </p>
                    </SpotlightCard>
                </div>
            </div>
        </section>
    );
};

function SpotlightCard({ children }: { children: React.ReactNode }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <div
            className="group relative border border-white/10 bg-[#0f111a] overflow-hidden rounded-3xl px-8 py-10 transition-colors hover:border-white/20"
            onMouseMove={handleMouseMove}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                          400px circle at ${mouseX}px ${mouseY}px,
                          rgba(205, 39, 132, 0.15),
                          transparent 80%
                        )
                    `,
                }}
            />
            <div className="relative">{children}</div>
        </div>
    );
}

const StatsSection: React.FC = () => (
    <div className="border-y border-white/5 bg-white/[0.02] backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/10">
            {[
                { label: 'Laudos Gerados hoje', value: '142+' },
                { label: 'Tempo Médio Economizado', value: '25 min' },
                { label: 'Precisão da IA', value: '98.5%' },
                { label: 'Técnicos Ativos', value: '450+' },
            ].map((stat, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <div className="text-3xl md:text-4xl font-black text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-500 uppercase tracking-widest font-semibold">{stat.label}</div>
                </div>
            ))}
        </div>
    </div>
)

const Footer: React.FC = () => (
    <footer className="py-12 bg-[#02040a] border-t border-white/5 text-center text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <p>© 2024 Proxxima Telecom. Todos os direitos reservados.</p>
            <div className="flex gap-6">
                <a href="#" className="hover:text-white transition">Termos</a>
                <a href="#" className="hover:text-white transition">Privacidade</a>
                <a href="#" className="hover:text-white transition">Suporte</a>
            </div>
        </div>
    </footer>
);

const BackgroundGrid: React.FC = () => (
    <div className="fixed inset-0 z-0 pointer-events-none">

        {/* Radial Gradient Mesh */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-20 mix-blend-screen" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] opacity-20" />

        {/* Grid Pattern */}
        <div
            className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"
        />
        <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
                backgroundImage: 'linear-gradient(to right, #808080 1px, transparent 1px), linear-gradient(to bottom, #808080 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#030712]/50 to-[#030712]" />
    </div>
);
