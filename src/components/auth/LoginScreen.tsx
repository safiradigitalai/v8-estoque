'use client';

import { useState, useEffect } from 'react';
import { Car, Eye, EyeOff, Lock, User, Zap } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (credentials.username === 'adminv8' && credentials.password === 'adminv8') {
      // Salvar sessão no localStorage
      localStorage.setItem('v8_auth_session', JSON.stringify({
        user: credentials.username,
        timestamp: Date.now(),
        expires: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
      }));
      
      onLoginSuccess();
    } else {
      setError('Usuário ou senha incorretos');
    }
    
    setIsLoading(false);
  };

  const handleInputChange = (field: 'username' | 'password') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    if (error) setError(''); // Limpar erro ao digitar
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-8 animate-pulse">
          <div className="text-4xl font-extralight text-gray-300 tracking-[0.2em]">
            V<span className="text-3xl">8</span>
          </div>
          <div className="w-16 h-px bg-gray-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Premium Accent Lines */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-900 to-transparent opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-900 to-transparent opacity-20"></div>
      
      {/* Subtle Corner Accents */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-gray-200"></div>
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-gray-200"></div>
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-gray-200"></div>
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-gray-200"></div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Premium Logo/Brand */}
          <div className="text-center mb-16 animate-fade-in">
            {/* V8 Typography Logo */}
            <div className="mb-8">
              <div className="inline-block relative">
                <h1 className="text-6xl font-extralight text-gray-900 tracking-[0.2em] mb-1">
                  V<span className="text-5xl">8</span>
                </h1>
                <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
              </div>
            </div>
            
            {/* Subtitle */}
            <div className="space-y-3">
              <p className="text-sm font-light text-gray-500 tracking-[0.3em] uppercase">
                Excelência Automotiva
              </p>
              <p className="text-lg font-light text-gray-700 tracking-wide">
                Sistema de Gestão de Inventário
              </p>
            </div>
            
            {/* Premium separator */}
            <div className="flex items-center justify-center mt-8 space-x-4">
              <div className="w-8 h-px bg-gray-300"></div>
              <div className="w-2 h-2 border border-gray-300 rotate-45"></div>
              <div className="w-8 h-px bg-gray-300"></div>
            </div>
          </div>

          {/* Premium Login Form */}
          <div className="bg-white border border-gray-200 shadow-2xl shadow-gray-900/5 px-12 py-14 animate-slide-up" style={{ borderRadius: '2px' }}>
            <div className="text-center mb-12">
              <h2 className="text-2xl font-extralight text-gray-900 mb-4 tracking-[0.1em]">
                ACESSO
              </h2>
              <div className="w-12 h-px bg-gray-400 mx-auto mb-6"></div>
              <p className="text-gray-600 font-light text-sm tracking-wide">
                Apenas Pessoal Autorizado
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Username Field */}
              <div className="space-y-4">
                <label className="text-xs font-light text-gray-500 block tracking-[0.2em] uppercase">
                  Usuário
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={credentials.username}
                    onChange={handleInputChange('username')}
                    className="w-full px-0 py-5 bg-transparent border-0 border-b border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-all duration-300 text-lg font-light tracking-wide"
                    placeholder="Digite seu usuário"
                    required
                  />
                  <div className="absolute bottom-0 left-0 h-px bg-gray-900 transform scale-x-0 transition-transform duration-300 focus-within:scale-x-100"></div>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-4">
                <label className="text-xs font-light text-gray-500 block tracking-[0.2em] uppercase">
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={credentials.password}
                    onChange={handleInputChange('password')}
                    className="w-full px-0 py-5 bg-transparent border-0 border-b border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-all duration-300 text-lg font-light tracking-wide pr-12"
                    placeholder="Digite sua senha"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-2"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <div className="absolute bottom-0 left-0 h-px bg-gray-900 transform scale-x-0 transition-transform duration-300 focus-within:scale-x-100"></div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="border-l-2 border-red-500 pl-4 py-2 animate-shake">
                  <p className="text-red-600 text-sm font-light">{error}</p>
                </div>
              )}

              {/* Premium Submit Button */}
              <div className="pt-10">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-6 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-light text-sm tracking-[0.2em] uppercase transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] disabled:scale-100 disabled:cursor-not-allowed border-0"
                  style={{ borderRadius: '1px' }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-4 h-4 border border-white/30 border-t-white animate-spin" style={{ borderRadius: '1px' }}></div>
                      <span>Autenticando</span>
                    </div>
                  ) : (
                    'Entrar no Sistema'
                  )}
                </button>
              </div>
            </form>

            {/* Premium Footer Info */}
            <div className="mt-14 pt-8 border-t border-gray-200">
              <div className="text-center">
                <p className="text-xs font-light text-gray-400 tracking-[0.2em] uppercase mb-4">
                  Acesso Demonstração
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-light text-gray-500 tracking-wide">Usuário:</span>
                    <span className="font-mono text-sm text-gray-700 tracking-wider">adminv8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-light text-gray-500 tracking-wide">Senha:</span>
                    <span className="font-mono text-sm text-gray-700 tracking-wider">adminv8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Version Info */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center space-x-4">
              <div className="w-8 h-px bg-gray-300"></div>
              <p className="text-xs font-light text-gray-400 tracking-[0.3em] uppercase">
                Versão 1.0
              </p>
              <div className="w-8 h-px bg-gray-300"></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out 0.2s both;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}