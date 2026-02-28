import React, { useState } from 'react';
import { supabase } from './supabaseClient';

interface AuthFormProps {
    onLogin: () => void;
}

export default function AuthForm({ onLogin }: AuthFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isForgotPassword, setIsForgotPassword] = useState(false);

    const validateInputs = (requirePassword = true) => {
        setErrorMessage('');
        setSuccessMessage('');
        if (!email) {
            setErrorMessage('Por favor, ingresa tu email.');
            return false;
        }
        if (requirePassword && !password) {
            setErrorMessage('Por favor, ingresa tu contraseña.');
            return false;
        }
        return true;
    };

    // Registro
    const handleSignUp = async () => {
        if (!validateInputs()) return;
        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                // Redirige a la URL actual (pantalla de login) luego de confirmar email
                emailRedirectTo: window.location.origin
            }
        });
        setLoading(false);
        if (error) {
            setErrorMessage('Error al registrarse: ' + error.message);
        } else {
            if (data.user?.identities?.length === 0) {
                setErrorMessage('Este correo ya está registrado.');
            } else {
                setSuccessMessage('¡Usuario registrado exitosamente! Revisa tu email para confirmar tu cuenta y luego inicia sesión.');
                // Limpiamos los campos para dejar lista la pantalla de login
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
            setErrorMessage('Usuario o contraseña incorrectos. Por favor, verifica tus datos.');
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
            redirectTo: window.location.origin,
        });
        setLoading(false);

        if (error) {
            setErrorMessage('Error al enviar el correo: ' + error.message);
        } else {
            setSuccessMessage('Se ha enviado un enlace de recuperación a tu correo electrónico.');
            setIsForgotPassword(false);
            setPassword('');
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-8 rounded-2xl shadow-2xl" style={{ backgroundColor: '#1d1510', border: '1px solid #31251c' }}>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">SixPackCreator</h2>
                <p className="text-gray-400 text-sm">{isForgotPassword ? 'Recupera tu contraseña' : 'Inicia sesión para continuar'}</p>
            </div>

            {errorMessage && (
                <div className="mb-4 p-3 bg-red-900/30 text-red-400 rounded-md border border-red-800/50 text-sm text-center">
                    {errorMessage}
                </div>
            )}

            {successMessage && (
                <div className="mb-4 p-3 bg-green-900/30 text-green-400 rounded-md border border-green-800/50 text-sm text-center">
                    {successMessage}
                </div>
            )}

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Usuario
                </label>
                <input
                    type="email"
                    placeholder="testuser@example.com"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setErrorMessage('');
                    }}
                    className="w-full p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-gray-200 transition-colors"
                    style={{ backgroundColor: '#140f0c', border: '1px solid #31251c' }}
                />
            </div>

            {!isForgotPassword && (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setErrorMessage('');
                        }}
                        className="w-full p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-gray-200 transition-colors"
                        style={{ backgroundColor: '#140f0c', border: '1px solid #31251c' }}
                    />
                </div>
            )}

            {isForgotPassword ? (
                <>
                    <button
                        onClick={handleResetPassword}
                        disabled={loading}
                        className="w-full py-3 rounded-lg font-bold text-gray-900 mb-4 transition-opacity disabled:opacity-50"
                        style={{ backgroundColor: '#ee7b03' }}
                    >
                        {loading ? 'Enviando...' : 'Enviar enlace'}
                    </button>
                    <div className="text-center mt-4">
                        <button
                            onClick={() => {
                                setIsForgotPassword(false);
                                setErrorMessage('');
                                setSuccessMessage('');
                            }}
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            Volver a iniciar sesión
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full py-3 rounded-lg font-bold text-gray-900 mb-4 transition-opacity disabled:opacity-50"
                        style={{ backgroundColor: '#ee7b03' }}
                    >
                        {loading ? 'Cargando...' : 'Entrar'}
                    </button>

                    <div className="text-center mb-6">
                        <button
                            onClick={handleSignUp}
                            disabled={loading}
                            className="text-sm font-medium hover:underline transition-colors focus:outline-none text-primary"
                        >
                            ¿No tienes cuenta? Regístrate
                        </button>
                    </div>

                    <div className="text-center">
                        <button
                            onClick={() => {
                                setIsForgotPassword(true);
                                setErrorMessage('');
                                setSuccessMessage('');
                            }}
                            className="text-xs text-gray-500 hover:text-gray-300 transition-colors focus:outline-none"
                        >
                            ¿Olvidaste tu contraseña?
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}