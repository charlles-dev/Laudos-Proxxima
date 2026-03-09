import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ArrowRight, User, Briefcase, Sparkles } from 'lucide-react';
import { UserProfile } from '../services/supabaseService';

interface OnboardingProps {
    onComplete: (data: Partial<UserProfile>) => Promise<void>;
}

export const OnboardingScreen: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            await onComplete({
                displayName: name,
                jobTitle: role || 'Técnico',
                hasCompletedOnboarding: true
            });
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            y: -20,
            transition: { duration: 0.3 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-surface/80 backdrop-blur-xl overflow-hidden px-4"
        >
            {/* Animated Background Blobs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                    x: [0, 50, 0],
                    y: [0, 30, 0]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
            />
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, -60, 0],
                    x: [0, -40, 0],
                    y: [0, -50, 0]
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-40 -left-20 w-[30rem] h-[30rem] bg-accent/20 rounded-full blur-3xl"
            />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative z-10 w-full max-w-md p-8 md:p-10 glass-strong border border-white/10 rounded-3xl shadow-2xl"
            >
                <div className="text-center mb-8">
                    <motion.div
                        variants={itemVariants}
                        className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-primary/30"
                    >
                        <User className="w-10 h-10 text-white" />
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="text-3xl font-bold text-text mb-2 flex items-center justify-center gap-2">
                        Bem-vindo(a)! <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
                    </motion.h1>
                    <motion.p variants={itemVariants} className="text-secondary">
                        Vamos personalizar sua experiência para gerar laudos incríveis.
                    </motion.p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <motion.div variants={containerVariants} className="space-y-4">
                        <motion.div variants={itemVariants} className="space-y-1">
                            <label className="text-xs font-bold text-secondary uppercase tracking-wider ml-1">Como devemos te chamar?</label>
                            <div className="relative group">
                                <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Seu Nome Completo"
                                    className="w-full pl-10 pr-4 py-3 bg-surface border border-line rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    autoFocus
                                    required
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-1">
                            <label className="text-xs font-bold text-secondary uppercase tracking-wider ml-1">Qual seu cargo técnico?</label>
                            <div className="relative group">
                                <Briefcase className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Ex: Técnico N1, Analista de Suporte..."
                                    className="w-full pl-10 pr-4 py-3 bg-surface border border-line rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                    value={role}
                                    onChange={e => setRole(e.target.value)}
                                />
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="pt-2">
                        <motion.button
                            whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(var(--color-primary), 0.4)" }}
                            whileTap={{ scale: 0.98 }}
                            disabled={loading || !name.trim()}
                            className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>
                                    <span>Começar Agora</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </motion.button>
                    </motion.div>
                </form>
            </motion.div>
        </motion.div>
    );
};
