import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, Zap, ChevronRight, Globe, Mail } from 'lucide-react';

interface LandingPageProps {
    onEnter: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
    return (
        <div className="min-h-screen bg-surface overflow-hidden relative font-sans text-text">
            {/* Animated Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-primary/20 rounded-full blur-3xl opacity-30"
                />
                <motion.div
                    animate={{
                        x: [0, -100, 0],
                        y: [0, 100, 0],
                        scale: [1, 1.3, 1],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-accent/20 rounded-full blur-3xl opacity-30"
                />
            </div>

            {/* Header */}
            <nav className="relative z-50 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    {/* Logo Placeholder - using img if available or text */}
                    <img src="https://www.proxxima.net/storage/app/uploads/public/5ea/1f7/af7/5ea1f7af72b2c773156463.svg" alt="Proxxima" className="h-8 md:h-10" />
                </div>
                <div className="hidden md:flex gap-6 text-sm font-medium text-secondary">
                    <a href="#" className="hover:text-primary transition">Sobre</a>
                    <a href="#" className="hover:text-primary transition">Soluções</a>
                    <a href="#" className="hover:text-primary transition">Contato</a>
                </div>
                <button
                    onClick={onEnter}
                    className="px-5 py-2 rounded-full border border-primary/30 text-primary font-semibold hover:bg-primary hover:text-white transition-all text-sm"
                >
                    Área do Colaborador
                </button>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center mt-12 md:mt-24">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold tracking-wider mb-6">
                        SISTEMA INTERNO v2.0
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-300% animate-gradient">
                        Gestão Inteligente <br className="hidden md:block" /> de Laudos Técnicos
                    </h1>
                    <p className="text-lg md:text-xl text-secondary max-w-2xl mx-auto leading-relaxed mb-10">
                        Automação completa para a equipe técnica da Proxxima Telecom.
                        Gere, valide e compartilhe diagnósticos com segurança e precisão.
                    </p>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onEnter}
                        className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gradient-to-r from-primary to-accent rounded-full shadow-lg hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        Acessar Plataforma
                        <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full">
                    <FeatureCard
                        icon={<Sparkles className="w-8 h-8 text-accent" />}
                        title="Diagnóstico via IA"
                        description="Inteligência Artificial que auxilia na redação técnica e sugestão de soluções precisas."
                    />
                    <FeatureCard
                        icon={<ShieldCheck className="w-8 h-8 text-green-500" />}
                        title="Validação Segura"
                        description="Cada documento possui um QR Code único para verificação pública de autenticidade."
                    />
                    <FeatureCard
                        icon={<Zap className="w-8 h-8 text-yellow-500" />}
                        title="Alta Performance"
                        description="Geração instantânea de PDFs e sincronização em tempo real com base de dados segura."
                    />
                </div>

            </main>

            {/* Footer */}
            <footer className="relative z-10 mt-24 border-t border-line/50 bg-paper/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col gap-2">
                        <img src="https://www.proxxima.net/storage/app/uploads/public/5ea/1f7/af7/5ea1f7af72b2c773156463.svg" alt="Proxxima" className="h-6 w-auto opacity-70" />
                        <p className="text-xs text-secondary">© {new Date().getFullYear()} Proxxima Telecomunicações.</p>
                    </div>
                    <div className="flex gap-6 text-2xl text-secondary/50">
                        {/* Socialplaceholders can go here */}
                    </div>
                    <div className="flex flex-col items-end gap-1 text-xs text-secondary">
                        <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> www.proxxima.net</span>
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> suporte@proxxima.net</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-paper/80 backdrop-blur border border-line p-8 rounded-2xl shadow-sm hover:shadow-xl hover:border-primary/20 transition-all text-left"
    >
        <div className="mb-4 p-3 bg-surface rounded-xl inline-block shadow-inner">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-text mb-2">{title}</h3>
        <p className="text-secondary leading-relaxed">{description}</p>
    </motion.div>
);
