import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, UserCheck } from 'lucide-react';

interface WelcomeBackOnlyProps {
    name: string;
    onComplete: () => void;
    isFirstLogin?: boolean;
}

export const WelcomeBackScreen: React.FC<WelcomeBackOnlyProps> = ({ name, onComplete, isFirstLogin }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 3500); // Show for 3.5 seconds
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-surface/90 backdrop-blur-md overflow-hidden"
        >
            {/* Background Effects */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 45, 0],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
            />
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, -45, 0],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
            />

            <div className="relative z-10 text-center">
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="w-24 h-24 bg-gradient-to-tr from-primary to-accent rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-primary/30"
                >
                    <UserCheck className="w-12 h-12 text-white" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-5xl font-bold text-text mb-4"
                >
                    {isFirstLogin ? 'Bem-vindo à' : 'Bem-vindo de volta,'}
                </motion.h1>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
                >
                    {isFirstLogin ? 'Proxxima Telecom' : name.split(' ')[0]}
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-8 flex items-center justify-center gap-2 text-secondary"
                >
                    <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                    <span className="text-sm">Preparando seu painel...</span>
                </motion.div>
            </div>
        </motion.div>
    );
};
