import React, { useState } from 'react';
import { supabase } from './supabaseClient';

interface AuthFormProps {
    onLogin: () => void;
}

type AuthMode = 'login' | 'signup' | 'forgot';

export default function AuthForm({ onLogin }: AuthFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [mode, setMode] = useState<AuthMode>('login');

    const validateInputs = (requirePassword = true) => {
        setErrorMessage('');
        setSuccessMessage('');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            setErrorMessage('Por favor, ingresa tu email.');
            return false;
        }
        if (!emailRegex.test(email)) {
            setErrorMessage('Por favor, ingresa un email válido.');
            return false;
        }
        if (requirePassword && password.length < 6) {
            setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
            return false;
        }
        return true;
    };

    // Registro
    const handleSignUp = async () => {
        if (!validateInputs()) return;
        setLoading(true);

        // La URL de redirección debe incluir la ruta del repositorio en GitHub Pages
        const redirectTo = window.location.origin + window.location.pathname;

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: redirectTo
            }
        });

        setLoading(false);
        if (error) {
            setErrorMessage('Error al registrarse: ' + error.message);
        } else {
            // En Supabase, si el usuario ya existe pero no está confirmado, data.user puede venir vacío o sin identidades
            if (data.user && data.user.identities && data.user.identities.length === 0) {
                setErrorMessage('Este correo ya está registrado. Intenta iniciar sesión.');
            } else {
                setSuccessMessage('📝 ¡Registro casi completo! Hemos enviado un link de confirmación a tu email. Debes hacer clic en el link para poder entrar.');
                setMode('login');
                setPassword('');
            }
        }
    };

    // Login
    const handleLogin = async () => {
        if (!validateInputs()) return;
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);
        if (error) {
            if (error.message.includes('Email not confirmed')) {
                setErrorMessage('⚠️ Tu email no ha sido confirmado. Busca el correo de SixPackCreator y confirma tu cuenta.');
            } else {
                setErrorMessage('Error: Usuario o contraseña incorrectos.');
            }
        } else {
            setSuccessMessage('¡Ingreso exitoso!');
            onLogin();
        }
    };

    // Recuperar Contraseña
    const handleResetPassword = async () => {
        if (!validateInputs(false)) return;
        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + window.location.pathname,
        });
        setLoading(false);

        if (error) {
            setErrorMessage('Error: ' + error.message);
        } else {
            setSuccessMessage('✅ Se ha enviado un enlace de recuperación a su correo.');
            setMode('login');
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-4 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden"
            style={{ backgroundColor: '#181411', border: '1px solid rgba(238, 123, 3, 0.2)' }}>

            {/* Decoración sutil */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>

            <div className="text-center mb-8 relative z-10">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/30">
                    <span className="material-symbols-outlined text-primary text-4xl">fitness_center</span>
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight">SIX PACK CREATOR</h2>
                <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold">Fuerza y Disciplina</p>
            </div>

            {/* Selector de Modo (Tabs) */}
            {mode !== 'forgot' && (
                <div className="flex bg-[#120e0c] p-1 rounded-xl mb-8 border border-white/5 relative z-10">
                    <button
                        onClick={() => { setMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'login' ? 'bg-primary text-black' : 'text-gray-500 hover:text-white'}`}
                    >
                        Entrar
                    </button>
                    <button
                        onClick={() => { setMode('signup'); setErrorMessage(''); setSuccessMessage(''); }}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'signup' ? 'bg-primary text-black' : 'text-gray-500 hover:text-white'}`}
                    >
                        Registrarse
                    </button>
                </div>
            )}

            {errorMessage && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <span className="material-symbols-outlined text-lg">error</span>
                    {errorMessage}
                </div>
            )}

            {successMessage && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                        <span className="font-bold">Aviso Importante</span>
                    </div>
                    <p className="text-xs leading-relaxed">{successMessage}</p>
                </div>
            )}

            <div className="space-y-5 relative z-10">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                        Email
                    </label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-xl">mail</span>
                        <input
                            type="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#120e0c] border border-white/10 p-3 pl-11 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-white transition-all placeholder:text-gray-700"
                        />
                    </div>
                </div>

                {mode !== 'forgot' && (
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                            Contraseña
                        </label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-xl">lock</span>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#120e0c] border border-white/10 p-3 pl-11 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-white transition-all placeholder:text-gray-700"
                            />
                        </div>
                    </div>
                )}

                {mode === 'login' && (
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-black py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 mt-4 shadow-lg shadow-primary/20"
                    >
                        {loading ? 'Verificando...' : 'Iniciar Sesión'}
                    </button>
                )}

                {mode === 'signup' && (
                    <button
                        onClick={handleSignUp}
                        disabled={loading}
                        className="w-full bg-white hover:bg-gray-100 text-black py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 mt-4 shadow-lg"
                    >
                        {loading ? 'Creando cuenta...' : 'Crear mi Cuenta'}
                    </button>
                )}

                {mode === 'forgot' && (
                    <>
                        <button
                            onClick={handleResetPassword}
                            disabled={loading}
                            className="w-full bg-primary text-black py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 mt-4"
                        >
                            {loading ? 'Enviando...' : 'Enviar Recuperación'}
                        </button>
                        <button
                            onClick={() => setMode('login')}
                            className="w-full text-gray-500 hover:text-white text-xs font-bold uppercase tracking-widest mt-4 transition-colors"
                        >
                            Cancelar
                        </button>
                    </>
                )}

                {mode === 'login' && (
                    <div className="text-center mt-6">
                        <button
                            onClick={() => setMode('forgot')}
                            className="text-[10px] text-gray-600 hover:text-gray-400 uppercase tracking-widest font-bold transition-colors"
                        >
                            ¿Olvidaste tu contraseña?
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 text-center relative z-10">
                <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em] font-medium">
                    Plataforma de entrenamiento de Élite
                </p>
            </div>
        </div>
    );
}
