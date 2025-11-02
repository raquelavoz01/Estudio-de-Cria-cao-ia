import React, { useState } from 'react';
import { LogoIcon, UserIcon, EmailIcon, LockIcon } from './Icons';
import { Plan } from '../types';
import Loader from './Loader';

interface AuthProps {
  onAuthSuccess: (plan: Plan | null) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);

    // Simula uma chamada de API
    setTimeout(() => {
      onAuthSuccess(null);
      // Não é necessário definir setIsLoading(false) pois o componente será desmontado
    }, 1500);
  };

  const buttonText = () => {
    if (mode === 'login') {
      return isLoading ? 'Verificando...' : 'Entrar';
    }
    return isLoading ? 'Criando conta...' : 'Criar Conta';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 p-4 font-sans">
      <div className="w-full max-w-md bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl shadow-purple-500/10 p-8">
        <div className="flex flex-col items-center mb-6">
          <LogoIcon />
          <h1 className="text-2xl font-bold text-white mt-3">Estúdio de Criação IA</h1>
          <p className="text-slate-400 mt-1">{mode === 'login' ? 'Bem-vindo de volta!' : 'Crie sua conta para começar'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <UserIcon />
              </span>
              <input
                type="text"
                placeholder="Nome"
                aria-label="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 pl-10 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition text-white"
                required
                disabled={isLoading}
              />
            </div>
          )}
          <div className="relative">
             <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <EmailIcon />
              </span>
            <input
              type="email"
              placeholder="E-mail"
              aria-label="Endereço de e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 pl-10 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition text-white"
              required
              disabled={isLoading}
            />
          </div>
          <div className="relative">
             <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <LockIcon />
              </span>
            <input
              type="password"
              placeholder="Senha"
              aria-label="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pl-10 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition text-white"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 flex items-center justify-center font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg hover:opacity-90 transition-opacity shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader /> : buttonText()}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-sm text-cyan-400 hover:underline disabled:text-slate-500 disabled:no-underline"
            disabled={isLoading}
          >
            {mode === 'login'
              ? 'Não tem uma conta? Cadastre-se'
              : 'Já tem uma conta? Faça login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;