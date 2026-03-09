import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Briefcase, Save, Loader2, Mail } from 'lucide-react';
import { UserProfile, updateUserProfile } from '../services/supabaseService';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: UserProfile;
    onUpdate: (updatedProfile: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, currentUser, onUpdate }) => {
    const [name, setName] = useState(currentUser.displayName || '');
    const [role, setRole] = useState(currentUser.jobTitle || '');
    const [loading, setLoading] = useState(false);

    // Reset state when modal opens with new user data
    useEffect(() => {
        if (isOpen) {
            setName(currentUser.displayName || '');
            setRole(currentUser.jobTitle || '');
        }
    }, [isOpen, currentUser]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const updatedData = {
                displayName: name,
                jobTitle: role
            };

            await updateUserProfile(currentUser.uid, updatedData);

            // Update local state in App
            onUpdate({ ...currentUser, ...updatedData });
            onClose();
        } catch (error) {
            console.error("Failed to update profile", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 backdrop-blur-sm p-4 md:p-0">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative w-full max-w-md bg-paper rounded-2xl shadow-2xl border border-line overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-line bg-white/50 dark:bg-slate-900/50">
                            <h2 className="text-xl font-bold text-text flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" />
                                Meu Perfil
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-surface rounded-full text-secondary transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Read Only Email */}
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-secondary uppercase tracking-wider">Email (Conta Google)</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={currentUser.email}
                                        disabled
                                        className="w-full pl-10 pr-4 py-3 bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-xl text-secondary cursor-not-allowed outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-secondary uppercase tracking-wider">Nome de Exibição</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Seu Nome"
                                        className="w-full pl-10 pr-4 py-3 bg-surface border border-line rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-secondary uppercase tracking-wider">Cargo / Função</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Ex: Técnico de Instalação"
                                        className="w-full pl-10 pr-4 py-3 bg-surface border border-line rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                        value={role}
                                        onChange={e => setRole(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    <span>Salvar Alterações</span>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
