import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, Loader2 } from 'lucide-react';

export const LoginScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await login(email, password);
            sessionStorage.setItem('just_logged_in', 'true');
        } catch (err) {
            setError('Falha no login. Verifique suas credenciais.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface p-4 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] opacity-50 pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] opacity-50 pointer-events-none" />

            <div className="glass-strong p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/10 relative z-10 animate-slideUpFade">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <img
                            src="https://www.proxxima.net/storage/app/uploads/public/5ea/1f7/af7/5ea1f7af72b2c773156463.svg"
                            alt="Proxxima Logo"
                            className="h-10 md:h-12 w-auto object-contain drop-shadow-md"
                        />
                    </div>
                    <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Acesso Restrito</h2>
                    <p className="text-secondary text-sm mt-2 font-medium">Faça login para gerenciar laudos.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-sm mb-6 text-center animate-fadeIn font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-1.5 ml-1">Email</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="email"
                                required
                                className="block w-full pl-11 pr-4 py-3 bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-text placeholder-gray-500/70 dark:placeholder-gray-400/70 transition-all font-medium"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-1.5 ml-1">Senha</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="password"
                                required
                                className="block w-full pl-11 pr-4 py-3 bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-text placeholder-gray-500/70 dark:placeholder-gray-400/70 transition-all font-medium"
                                placeholder="••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/25 text-sm font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-surface disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-8 hover:scale-[1.02] active:scale-95"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
};
