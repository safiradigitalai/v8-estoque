'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Users, Zap, Trophy, Target, Crown, Star } from 'lucide-react';

interface MicroModeLoginScreenProps {
  onLoginSuccess: (username: string) => void;
}

export function MicroModeLoginScreen({ onLoginSuccess }: MicroModeLoginScreenProps) {
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
      // Chamar callback que irá atualizar o estado via useAuth
      onLoginSuccess(credentials.username);
    } else {
      setError('Credenciais incorretas para acesso ao sistema');
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-8 animate-pulse">
          <div className="text-4xl font-extralight text-gray-300 tracking-[0.2em]">
            V<span className="text-3xl">8</span>
          </div>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 relative overflow-hidden">
      {/* Premium Neon Accent Lines */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 shadow-[0_2px_8px_rgba(6,182,212,0.3)]"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 shadow-[0_-2px_8px_rgba(6,182,212,0.3)]"></div>
      
      {/* Subtle Corner Accents with Cyan Glow */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-cyan-300/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]"></div>
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-cyan-300/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]"></div>
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-cyan-300/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]"></div>
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-cyan-300/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]"></div>

      {/* Floating Team Elements */}
      <div className="absolute top-1/4 left-12 opacity-10 animate-float-slow">
        <Trophy className="w-12 h-12 text-cyan-400" />
      </div>
      <div className="absolute top-1/3 right-16 opacity-10 animate-float-slower">
        <Target className="w-10 h-10 text-cyan-500" />
      </div>
      <div className="absolute bottom-1/3 left-20 opacity-10 animate-float-fast">
        <Crown className="w-8 h-8 text-cyan-300" />
      </div>
      <div className="absolute bottom-1/4 right-12 opacity-10 animate-float-medium">
        <Star className="w-14 h-14 text-cyan-400" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Premium Team Logo/Brand */}
          <div className="text-center mb-16 animate-fade-in">
            {/* MicroMode Typography Logo */}
            <div className="mb-8 relative">
              <div className="inline-block relative">
                <h1 className="text-6xl font-extralight text-gray-900 tracking-[0.2em] mb-1">
                  V<span className="text-5xl">8</span>
                </h1>
                <div className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_2px_8px_rgba(6,182,212,0.4)]"></div>
              </div>
            </div>
            
            {/* Team-focused Subtitle */}
            <div className="space-y-3">
              <p className="text-sm font-light text-gray-500 tracking-[0.3em] uppercase">
                Excelência Automotiva
              </p>
              <p className="text-lg font-light text-gray-700 tracking-wide">
                Portal da Equipe de Vendas
              </p>
              <p className="text-sm font-light text-cyan-600 tracking-wide">
                Competição • Performance • Resultados
              </p>
            </div>
            
            {/* Premium Team separator */}
            <div className="flex items-center justify-center mt-8 space-x-4">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-cyan-400"></div>
              <div className="w-3 h-3 border-2 border-cyan-400 rotate-45 bg-cyan-50 shadow-[0_0_8px_rgba(6,182,212,0.3)]"></div>
              <div className="w-8 h-px bg-gradient-to-r from-cyan-400 to-transparent"></div>
            </div>
          </div>

          {/* Premium Team Login Form */}
          <div className="bg-white/90 backdrop-blur-sm border border-cyan-200/50 shadow-2xl shadow-cyan-900/10 px-12 py-14 animate-slide-up relative overflow-hidden" style={{ borderRadius: '2px' }}>
            {/* Subtle team background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/30 via-transparent to-cyan-50/20"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-400 opacity-60"></div>
            
            <div className="text-center mb-12 relative z-10">
              <div className="inline-flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-extralight text-gray-900 tracking-[0.1em]">
                  ACESSO DE EQUIPE
                </h2>
              </div>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mb-6 shadow-[0_2px_4px_rgba(6,182,212,0.2)]"></div>
              <p className="text-cyan-700 font-light text-sm tracking-wide">
                Vendedores • Competições • Rankings
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              {/* Username Field */}
              <div className="space-y-4">
                <label className="text-xs font-light text-gray-500 block tracking-[0.2em] uppercase flex items-center space-x-2">
                  <Users className="w-3 h-3 text-cyan-500" />
                  <span>Vendedor</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={credentials.username}
                    onChange={handleInputChange('username')}
                    className="w-full px-0 py-5 bg-transparent border-0 border-b border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-all duration-300 text-lg font-light tracking-wide"
                    placeholder="Digite seu usuário"
                    required
                  />
                  <div className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-cyan-500 to-cyan-600 transform scale-x-0 transition-transform duration-300 focus-within:scale-x-100 shadow-[0_2px_8px_rgba(6,182,212,0.3)]"></div>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-4">
                <label className="text-xs font-light text-gray-500 block tracking-[0.2em] uppercase flex items-center space-x-2">
                  <Target className="w-3 h-3 text-cyan-500" />
                  <span>Senha</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={credentials.password}
                    onChange={handleInputChange('password')}
                    className="w-full px-0 py-5 bg-transparent border-0 border-b border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-all duration-300 text-lg font-light tracking-wide pr-12"
                    placeholder="Digite sua senha"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-600 transition-colors p-2"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <div className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-cyan-500 to-cyan-600 transform scale-x-0 transition-transform duration-300 focus-within:scale-x-100 shadow-[0_2px_8px_rgba(6,182,212,0.3)]"></div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="border-l-2 border-red-500 pl-4 py-2 bg-red-50/50 animate-shake">
                  <p className="text-red-600 text-sm font-light">{error}</p>
                </div>
              )}

              {/* Premium Team Submit Button */}
              <div className="pt-10">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-6 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-light text-sm tracking-[0.2em] uppercase transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] disabled:scale-100 disabled:cursor-not-allowed border-0 shadow-[0_4px_20px_rgba(6,182,212,0.3)] hover:shadow-[0_6px_25px_rgba(6,182,212,0.4)]"
                  style={{ borderRadius: '1px' }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-4 h-4 border border-white/30 border-t-white animate-spin" style={{ borderRadius: '1px' }}></div>
                      <span>Conectando ao Sistema</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Zap className="w-4 h-4" />
                      <span>Entrar no Sistema</span>
                    </div>
                  )}
                </button>
              </div>
            </form>

            {/* Premium Team Footer Info */}
            <div className="mt-14 pt-8 border-t border-cyan-200/50 relative z-10">
              <div className="text-center">
                <p className="text-xs font-light text-gray-400 tracking-[0.2em] uppercase mb-4 flex items-center justify-center space-x-2">
                  <Trophy className="w-3 h-3 text-cyan-500" />
                  <span>Acesso de Demonstração</span>
                  <Trophy className="w-3 h-3 text-cyan-500" />
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-light text-gray-500 tracking-wide">Vendedor:</span>
                    <span className="font-mono text-sm text-cyan-700 tracking-wider">adminv8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-light text-gray-500 tracking-wide">Senha:</span>
                    <span className="font-mono text-sm text-cyan-700 tracking-wider">adminv8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Team Version Info */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center space-x-4">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-cyan-400"></div>
              <div className="flex items-center space-x-2">
                <Crown className="w-4 h-4 text-cyan-500" />
                <p className="text-xs font-light text-gray-400 tracking-[0.3em] uppercase">
                  Versão 1.0
                </p>
                <Crown className="w-4 h-4 text-cyan-500" />
              </div>
              <div className="w-8 h-px bg-gradient-to-r from-cyan-400 to-transparent"></div>
            </div>
            <p className="text-xs font-light text-cyan-600 tracking-wide mt-2">
              V8 Automotive Inventory
            </p>
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

        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }

        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }

        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
        }

        @keyframes float-slower {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(-3deg); }
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

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }

        .animate-float-fast {
          animation: float-fast 4s ease-in-out infinite;
        }

        .animate-float-medium {
          animation: float-medium 5s ease-in-out infinite;
        }

        .animate-float-slower {
          animation: float-slower 7s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}