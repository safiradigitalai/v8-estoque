'use client';

import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  className = '' 
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 ${className}`}>
      {/* Ícone com estilo elegante */}
      <div className="relative mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <Icon className="w-8 h-8 text-gray-400" />
        </div>
        
        {/* Efeito de profundidade */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-200/50 to-transparent" />
      </div>
      
      {/* Conteúdo textual */}
      <div className="text-center space-y-2 max-w-sm">
        <h3 className="text-lg font-medium text-gray-900 tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          {description}
        </p>
      </div>
      
      {/* Ação opcional */}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-6 px-4 py-2 bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 cursor-pointer"
        >
          {action.label}
        </button>
      )}
      
      {/* Indicadores discretos */}
      <div className="mt-8 flex items-center space-x-2 text-xs text-gray-400">
        <div className="w-1 h-1 bg-gray-300 rounded-full" />
        <span className="font-mono">Sistema ativo</span>
        <div className="w-1 h-1 bg-gray-300 rounded-full" />
        <span className="font-mono">
          {new Date().toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
        <div className="w-1 h-1 bg-gray-300 rounded-full" />
      </div>
    </div>
  );
}