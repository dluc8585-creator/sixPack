import { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'testuser' && password === 'password123') {
      onLogin();
    } else {
      setError('Credenciales incorrectas. Intenta con testuser / password123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background-dark">
      <div className="w-full max-w-md bg-card-dark border border-border-dark rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-2">SixPackCreator</h1>
          <p className="text-slate-400">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="testuser"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="password123"
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-black font-bold py-3 rounded-lg transition-colors"
          >
            Entrar
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          <p>Credenciales de prueba:</p>
          <p>Usuario: <span className="text-slate-300">testuser</span></p>
          <p>Contraseña: <span className="text-slate-300">password123</span></p>
        </div>
      </div>
    </div>
  );
}
