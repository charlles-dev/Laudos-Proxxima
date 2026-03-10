import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionTemplate, useMotionValue } from 'framer-motion';
import { ShieldCheck, Sparkles, Zap, ChevronRight, Globe, Mail, Lock, Cpu, BarChart3, Activity, FileText, Bot, CheckCircle, ArrowRight } from 'lucide-react';

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
                <WorkflowSection />
                <FeaturesSection />
                <StatsSection />
                <CTASection onEnter={onEnter} />
            </main>

            <Footer />
        </div>
    );
};

// --- Sub-components ---

const Navbar: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#030712]/40 backdrop-blur-xl transition-all">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <img src="https://www.proxxima.net/storage/app/uploads/public/5ea/1f7/af7/5ea1f7af72b2c773156463.svg" alt="Proxxima" className="h-8 md:h-10 opacity-90 hover:opacity-100 transition-opacity" />
                </div>
                <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
                    {['Funcionalidades', 'Segurança', 'Integração'].map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            onClick={(e) => handleNavClick(e, item.toLowerCase())}
                            className="hover:text-white transition-colors relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-4 focus-visible:ring-offset-[#030712] rounded-md px-1 py-0.5"
                        >
                            {item}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                        </a>
                    ))}
                </div>
                <button
                    onClick={onEnter}
                    className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-semibold transition-all hover:scale-105 active:scale-95 ring-1 ring-white/10 active:ring-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                    Acessar Sistema
                </button>
            </div>
        </nav>
    );
}

const HeroSection: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 150]);
    const y2 = useTransform(scrollY, [0, 500], [0, -100]);

    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden min-h-screen flex flex-col justify-center">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">

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
                            className="group relative px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg overflow-hidden shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-primary/40 active:scale-95 focus-visible:ring-4 focus-visible:ring-primary/50"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-shine" />
                            Começar Agora
                            <ChevronRight className="inline ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                            className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all backdrop-blur-sm focus-visible:ring-4 focus-visible:ring-white/20"
                            onClick={() => {
                                document.getElementById('comofunciona')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            Ver Demonstração
                        </button>
                    </div>
                </motion.div>

                {/* 3D Visual Mockup */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotateX: 20, rotateY: -20 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 10, rotateY: -10 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    style={{ y: y1 }}
                    className="relative z-10 perspective-1000 hidden lg:block"
                >
                    {/* Floating Eelements */}
                    <motion.div style={{ y: y2, x: 50 }} className="absolute -top-16 -right-16 z-30 bg-black/60 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl skew-y-3">
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

                    <div className="relative rounded-2xl border border-white/10 bg-[#0f111a] shadow-[0_0_80px_rgba(43,56,140,0.3)] transform rotate-y-12 rotate-x-6 hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700 ease-out preserve-3d group flex flex-col h-[500px]">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

                        {/* Fake Browser Header */}
                        <div className="h-10 bg-[#1a1d2d] rounded-t-2xl flex items-center px-4 gap-4 border-b border-white/5 z-20">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                            </div>
                            <div className="flex-1 text-center text-[10px] text-slate-500 font-mono tracking-wider bg-black/20 rounded-md py-1 px-2 border border-white/5 w-1/2 mx-auto truncate">
                                <Lock className="inline w-3 h-3 mr-1 text-green-400/80" />
                                https://app.proxxima.net/editor
                            </div>
                        </div>

                        {/* Fake UI Content - Split View */}
                        <div className="flex-1 bg-[#0A0D14] rounded-b-2xl p-0 relative overflow-hidden flex z-10">

                            {/* Left Side: Form Input Mockup */}
                            <div className="w-[45%] h-full bg-[#121622] border-r border-white/5 p-6 space-y-6">
                                <div className="space-y-3">
                                    <div className="w-24 h-2.5 bg-slate-600/50 rounded-full" />
                                    <div className="h-10 rounded-lg bg-[#1a1f30] border border-white/5 flex items-center px-3">
                                        <div className="w-32 h-2 bg-slate-500/50 rounded-full" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="w-32 h-2.5 bg-slate-600/50 rounded-full" />
                                    <div className="h-28 rounded-lg bg-[#1a1f30] border border-white/5 p-3">
                                        <div className="space-y-2">
                                            <div className="w-full h-2 bg-slate-500/50 rounded-full" />
                                            <div className="w-5/6 h-2 bg-slate-500/50 rounded-full" />
                                            <div className="w-4/6 h-2 bg-slate-500/50 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                                <div className="h-12 rounded-lg bg-primary/20 border border-primary/30 mt-4 flex items-center justify-center relative overflow-hidden group-hover:bg-primary/30 transition-colors">
                                    <div className="absolute inset-0 bg-primary/10 animate-pulse" />
                                    <div className="w-32 h-2.5 bg-primary/60 rounded-full relative z-10" />
                                </div>
                            </div>

                            {/* Right Side: AI Output Mockup */}
                            <div className="flex-1 h-full p-6 relative bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat opacity-95">
                                <div className="absolute inset-0 bg-[#0B0D14]/80 backdrop-blur-[2px]" />
                                <div className="relative z-10 h-full flex flex-col">

                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center border border-accent/20">
                                            <Sparkles className="w-4 h-4 text-accent" />
                                        </div>
                                        <div className="h-4 w-40 bg-accent/40 rounded-full" />
                                    </div>

                                    <div className="space-y-6 flex-1">
                                        {/* AI Block 1 */}
                                        <div className="space-y-3">
                                            <div className="w-20 h-2 bg-white/20 rounded-full mb-4" />
                                            <div className="h-2 w-full bg-white/10 rounded-full" />
                                            <div className="h-2 w-[90%] bg-white/10 rounded-full" />
                                            <div className="h-2 w-[60%] bg-white/10 rounded-full" />
                                        </div>

                                        {/* Special Action Block */}
                                        <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10 mt-6 backdrop-blur-md">
                                            <div className="flex items-center gap-2 mb-3">
                                                <CheckCircle className="w-4 h-4 text-green-400" />
                                                <div className="w-32 h-2 bg-green-500/40 rounded-full" />
                                            </div>
                                            <div className="space-y-2 pl-6">
                                                <div className="h-2 w-full bg-green-500/20 rounded-full" />
                                                <div className="h-2 w-4/5 bg-green-500/20 rounded-full" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons Mock */}
                                    <div className="flex gap-3 justify-end mt-4">
                                        <div className="w-24 h-8 rounded-md bg-white/5 border border-white/5" />
                                        <div className="w-28 h-8 rounded-md bg-primary/80 border border-primary/50 flex items-center justify-center gap-2">
                                            <FileText className="w-3 h-3 text-white/80" />
                                            <div className="w-12 h-1.5 bg-white/50 rounded-full" />
                                        </div>
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

const WorkflowSection: React.FC = () => {
    return (
        <section id="comofunciona" className="py-24 px-6 relative z-20 bg-black/20 border-y border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Como Funciona</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        Três passos simples para transformar apontamentos técnicos crus em laudos profissionais, validados e estruturados.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Linha conectora desktop */}
                    <div className="hidden md:block absolute top-12 left-[18%] right-[18%] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

                    {[
                        {
                            icon: FileText,
                            color: "text-blue-400",
                            bg: "bg-blue-400/10",
                            borderColor: "border-blue-400/50",
                            title: "1. Colete os Dados",
                            desc: "O técnico insere as informações básicas e o relato do problema encontrado em campo, de forma rápida."
                        },
                        {
                            icon: Bot,
                            color: "text-primary",
                            bg: "bg-primary/10",
                            borderColor: "border-primary/50",
                            title: "2. Análise com IA",
                            desc: "Nossa inteligência artificial processa o texto, corrige termos técnicos e estrutura um diagnóstico oficial."
                        },
                        {
                            icon: ShieldCheck,
                            color: "text-green-400",
                            bg: "bg-green-400/10",
                            borderColor: "border-green-400/50",
                            title: "3. Laudo Validado",
                            desc: "O documento é gerado em PDF ou Link criptografado, garantindo segurança e autenticidade da Proxxima."
                        }
                    ].map((step, i) => (
                        <div key={i} className="relative flex flex-col items-center text-center group">
                            <div className={`w-24 h-24 rounded-full ${step.bg} border border-white/10 flex items-center justify-center mb-6 relative z-10 transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_0_30px_rgba(43,56,140,0.2)] group-hover:${step.borderColor}`}>
                                <step.icon className={`w-10 h-10 ${step.color}`} />
                                <div className="absolute inset-0 rounded-full bg-inherit blur-xl opacity-20" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{step.title}</h3>
                            <p className="text-slate-400 leading-relaxed max-w-[280px]">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const FeaturesSection: React.FC = () => {
    return (
        <section id="funcionalidades" className="py-24 px-6 relative z-20">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Poderoso. Seguro. <span className="text-primary">Inteligente.</span></h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg pt-2 leading-relaxed">
                        Cada ferramenta foi desenhada para eliminar gargalos, reduzir o tempo gasto em escritórios e transformar a forma como as equipes de telecom operam.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SpotlightCard>
                        <Zap className="w-10 h-10 text-yellow-400 mb-6 drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]" />
                        <h3 className="text-xl font-bold text-white mb-3 tracking-wide">Diagnóstico com IA</h3>
                        <p className="text-slate-400 leading-relaxed font-light">
                            A inteligência artificial analisa os sintomas relatados, sugere diagnósticos coerentes, padroniza jargões e constrói o laudo técnico por você em segundos.
                        </p>
                    </SpotlightCard>

                    <SpotlightCard>
                        <ShieldCheck id="segurança" className="w-10 h-10 text-green-400 mb-6 drop-shadow-[0_0_15px_rgba(74,222,128,0.3)]" />
                        <h3 className="text-xl font-bold text-white mb-3 tracking-wide">Validação Criptográfica</h3>
                        <p className="text-slate-400 leading-relaxed font-light">
                            Cada laudo final emitido possui um hash único, verificável publicamente através de links seguros (HTTPS), garantindo integridade contra fraudes.
                        </p>
                    </SpotlightCard>

                    <SpotlightCard>
                        <Activity className="w-10 h-10 text-blue-400 mb-6 drop-shadow-[0_0_15px_rgba(96,165,250,0.3)]" />
                        <h3 className="text-xl font-bold text-white mb-3 tracking-wide">Monitoramento Real-time</h3>
                        <p className="text-slate-400 leading-relaxed font-light">
                            Acompanhe análises gerais, histórico e o desempenho técnico em tempo real no dashboard avançado, facilitando auditorias e a gestão do setor de provisão.
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
            className="group relative border border-white/5 bg-[#0D1018] overflow-hidden rounded-3xl px-8 py-10 transition-colors hover:border-white/10 shadow-lg"
            onMouseMove={handleMouseMove}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                          400px circle at ${mouseX}px ${mouseY}px,
                          rgba(43, 56, 140, 0.15),
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
    <section id="integração" className="border-y border-white/5 bg-white/[0.02] backdrop-blur-sm relative z-20">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/10">
            {[
                { label: 'Laudos Gerados/Mês', value: '1,420+' },
                { label: 'Tempo Médio Economizado', value: '25 min' },
                { label: 'Precisão da IA', value: '98.5%' },
                { label: 'Criptografia', value: 'SHA-256' },
            ].map((stat, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-center p-6 text-center hover:bg-white/[0.01] transition-colors">
                    <div className="text-3xl md:text-4xl font-black text-white mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{stat.value}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">{stat.label}</div>
                </div>
            ))}
        </div>
    </section>
)

const CTASection: React.FC<{ onEnter: () => void }> = ({ onEnter }) => (
    <section className="py-24 px-6 relative z-20 overflow-hidden">
        {/* Decorative elements behind CTA */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/20 rounded-full blur-[100px] opacity-30 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 p-12 rounded-3xl border border-white/10 bg-[#0B0D14]/50 backdrop-blur-xl shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Pronto para acelerar a sua gestão técnica?
            </h2>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                Pire na produtividade. Deixe a formatação, digitação repetitiva e auditoria por conta do nosso sistema inteligente.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <button
                    onClick={onEnter}
                    className="group w-full sm:w-auto px-10 py-5 bg-white text-[#030712] rounded-xl font-bold text-lg shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] active:scale-95 flex items-center justify-center focus-visible:ring-4 focus-visible:ring-primary/50"
                >
                    Acessar o Editor Agora
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
            <p className="mt-8 text-sm text-slate-500 flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" /> Acesso restrito a técnicos autorizados da Proxxima Telecom.
            </p>
        </div>
    </section>
);

const Footer: React.FC = () => (
    <footer className="pt-20 pb-8 bg-[#02040a] border-t border-white/5 relative z-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

            {/* Brand Column */}
            <div className="col-span-1 md:col-span-5 flex flex-col items-start">
                <img src="https://www.proxxima.net/storage/app/uploads/public/5ea/1f7/af7/5ea1f7af72b2c773156463.svg" alt="Proxxima" className="h-10 mb-6 opacity-90" />
                <p className="text-slate-400 max-w-sm leading-relaxed mb-8">
                    Revolucionando as operações de campo em telecomunicações. Laudos automatizados com IA, seguros e integrados ao seu fluxo de trabalho.
                </p>
                <div className="flex gap-4">
                    {/* Placeholder for social links, currently text as links */}
                    <a href="#" className="p-2 rounded-full border border-white/10 hover:border-white/30 text-slate-400 hover:text-white transition-all hover:bg-white/5">
                        <Globe className="w-5 h-5" />
                    </a>
                    <a href="#" className="p-2 rounded-full border border-white/10 hover:border-white/30 text-slate-400 hover:text-white transition-all hover:bg-white/5">
                        <Mail className="w-5 h-5" />
                    </a>
                </div>
            </div>

            {/* Links Columns */}
            <div className="col-span-1 md:col-span-7 flex flex-wrap justify-between md:justify-end gap-12 md:gap-24">
                <div>
                    <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">Produto</h4>
                    <ul className="space-y-4 text-slate-400">
                        <li><a onClick={(e) => { e.preventDefault(); document.getElementById('comofunciona')?.scrollIntoView({ behavior: 'smooth' }) }} href="#comofunciona" className="hover:text-primary hover:translate-x-1 transition-all inline-block">Workflow</a></li>
                        <li><a onClick={(e) => { e.preventDefault(); document.getElementById('funcionalidades')?.scrollIntoView({ behavior: 'smooth' }) }} href="#funcionalidades" className="hover:text-primary hover:translate-x-1 transition-all inline-block">Funcionalidades</a></li>
                        <li><a onClick={(e) => { e.preventDefault(); document.getElementById('segurança')?.scrollIntoView({ behavior: 'smooth' }) }} href="#segurança" className="hover:text-primary hover:translate-x-1 transition-all inline-block">Segurança Criptográfica</a></li>
                        <li><a onClick={(e) => { e.preventDefault(); document.getElementById('integração')?.scrollIntoView({ behavior: 'smooth' }) }} href="#integração" className="hover:text-primary hover:translate-x-1 transition-all inline-block">Métricas & Integração</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">Legal & Suporte</h4>
                    <ul className="space-y-4 text-slate-400">
                        <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">Termos de Uso</a></li>
                        <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">Política de Privacidade</a></li>
                        <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">Central de Ajuda</a></li>
                        <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">Contatar DPO</a></li>
                    </ul>
                </div>
            </div>

        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
            <p className="flex items-center gap-1">© {new Date().getFullYear()} Proxxima Telecom.<span className="hidden md:inline"> Todos os direitos reservados.</span></p>
            <div className="flex gap-6 items-center">
                <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-green-500/80" /> TLS v1.3</span>
                <span className="flex items-center gap-1"><Cpu className="w-4 h-4 text-primary/80" /> IA Powered</span>
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
            className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 bg-repeat mix-blend-overlay"
        />
        <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
                backgroundImage: 'linear-gradient(to right, #808080 1px, transparent 1px), linear-gradient(to bottom, #808080 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#030712]/50 to-[#030712] rounded-[100px]" />
    </div>
);
