'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, LogOut, User, Clock } from 'lucide-react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
}

export function LogoutModal({ isOpen, onClose, onConfirm, userName = 'Usuário' }: LogoutModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentTime = new Date().toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop com blur e gradiente */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-black/60 via-gray-900/70 to-black/60 backdrop-blur-md transition-all duration-500"
        style={{ animation: 'fadeIn 0.4s ease-out' }}
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div 
        className="relative bg-white rounded-3xl shadow-2xl shadow-black/25 max-w-md w-full mx-4 overflow-hidden border border-gray-100"
        style={{ 
          animation: 'modalEntry 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          willChange: 'transform, opacity'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Gradient - Editorial Style */}
        <div className="relative bg-gradient-to-br from-red-500 via-red-600 to-red-700 p-8 text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/20 to-transparent" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 border border-white/30 hover:border-white/40 transition-all duration-200 group cursor-pointer"
          >
            <X className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
          </button>
          
          <div className="relative z-10">
            {/* Icon - Editorial */}
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center border border-white/30 shadow-inner">
                <LogOut className="w-9 h-9 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-white/30 rounded-full flex items-center justify-center border border-white/40">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
            
            {/* Title */}
            <h2 className="text-3xl font-extralight tracking-[-0.02em] mb-1 leading-tight">
              Finalizar Sessão
            </h2>
            <div className="flex items-center space-x-2 text-red-100/90">
              <div className="w-px h-4 bg-red-200/50" />
              <p className="text-xs font-mono uppercase tracking-[0.2em] font-medium">
                V8 Automotive System
              </p>
              <div className="w-px h-4 bg-red-200/50" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* User Info - Editorial Style */}
          <div className="relative p-6 bg-gradient-to-br from-gray-50 via-white to-gray-50/50 rounded-3xl border border-gray-100/60 shadow-inner">
            <div className="absolute top-3 left-6 w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            
            <div className="flex items-center space-x-5">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-violet-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <User className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="font-medium text-lg text-gray-900 tracking-tight">{userName}</div>
                <div className="flex items-center space-x-3 text-sm text-gray-500">
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="font-mono">{currentTime}</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-gray-300" />
                  <span className="text-xs uppercase tracking-wider font-medium">Sessão Ativa</span>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-3 right-6 w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          </div>

          {/* Message - Editorial Layout */}
          <div className="text-center space-y-4 px-4">
            <div className="space-y-3">
              <h3 className="text-xl font-light text-gray-900 tracking-tight leading-relaxed">
                Tem certeza que deseja encerrar sua sessão?
              </h3>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto" />
              <p className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
                Todos os dados não salvos serão preservados no sistema. Sua sessão será finalizada com segurança.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Continuar Sessão
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl hover:shadow-red-200/25 cursor-pointer"
            >
              Sair do Sistema
            </button>
          </div>
        </div>

        {/* Footer - Magazine Style */}
        <div className="px-6 pb-6 pt-2">
          <div className="relative">
            <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            <div className="pt-4 flex items-center justify-center space-x-3 text-xs text-gray-400">
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="font-mono tracking-[0.15em] uppercase font-medium">Secure</span>
              </div>
              <div className="w-px h-3 bg-gray-300" />
              <span className="font-mono tracking-[0.1em] uppercase">V8 System</span>
              <div className="w-px h-3 bg-gray-300" />
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span className="font-mono tracking-[0.15em] uppercase font-medium">Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animações */}
      <style jsx global>{`
        @keyframes modalEntry {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
            filter: blur(4px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0);
          }
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );

  return createPortal(modalContent, document.body);
}