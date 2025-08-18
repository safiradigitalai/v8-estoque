'use client';

import { BarChart3, Users, MessageCircle } from 'lucide-react';
import { OverviewTab } from './TabsNavigation';

interface OverviewAccessKeysProps {
  activeTheme: OverviewTab;
  onThemeChange: (theme: OverviewTab) => void;
}

const accessKeys = [
  {
    id: 'inventory' as OverviewTab,
    label: 'Inventário',
    shortLabel: 'INV',
    icon: BarChart3,
    color: 'blue',
    keyboardShortcut: 'I'
  },
  {
    id: 'team' as OverviewTab,
    label: 'Equipe',
    shortLabel: 'EQP',
    icon: Users,
    color: 'purple',
    keyboardShortcut: 'T'
  },
  {
    id: 'leads' as OverviewTab,
    label: 'Leads',
    shortLabel: 'LDS',
    icon: MessageCircle,
    color: 'green',
    keyboardShortcut: 'L'
  }
];

const colorMap = {
  blue: {
    bg: 'bg-blue-500',
    bgHover: 'hover:bg-blue-600',
    bgActive: 'bg-blue-600',
    text: 'text-blue-600',
    textActive: 'text-white',
    border: 'border-blue-500',
    shadow: 'shadow-blue-500/20'
  },
  purple: {
    bg: 'bg-purple-500',
    bgHover: 'hover:bg-purple-600',
    bgActive: 'bg-purple-600',
    text: 'text-purple-600',
    textActive: 'text-white',
    border: 'border-purple-500',
    shadow: 'shadow-purple-500/20'
  },
  green: {
    bg: 'bg-green-500',
    bgHover: 'hover:bg-green-600',
    bgActive: 'bg-green-600',
    text: 'text-green-600',
    textActive: 'text-white',
    border: 'border-green-500',
    shadow: 'shadow-green-500/20'
  }
};

export function OverviewAccessKeys({ activeTheme, onThemeChange }: OverviewAccessKeysProps) {
  return (
    <>
      {/* Layout Mobile-First: Editorial e elegante */}
      <div className="block md:hidden w-full">
        <div className="flex w-full">
          {accessKeys.map((key, index) => {
            const Icon = key.icon;
            const isActive = activeTheme === key.id;
            const colors = colorMap[key.color as keyof typeof colorMap];
            
            return (
              <button
                key={key.id}
                onClick={() => onThemeChange(key.id)}
                className={`
                  relative group flex-1 flex flex-col items-center justify-center py-3 px-1 transition-all duration-500 cursor-pointer touch-manipulation
                  ${isActive 
                    ? 'bg-gradient-to-br from-white via-white to-gray-50/50 shadow-lg shadow-gray-900/8' 
                    : 'bg-white/40 backdrop-blur-sm hover:bg-white/60 active:bg-white/80'
                  }
                  border-r border-white/30 last:border-r-0
                `}
                style={{ 
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation'
                }}
              >
                {/* Linha superior de status - elegante */}
                <div className={`
                  w-full h-0.5 absolute top-0 left-0 transition-all duration-500
                  ${isActive 
                    ? `${colors.bg} opacity-100` 
                    : 'bg-gray-200 opacity-30'
                  }
                `} />
                
                {/* Ícone com estilo editorial */}
                <Icon className={`
                  w-4 h-4 mb-1.5 transition-all duration-500
                  ${isActive 
                    ? colors.text 
                    : 'text-gray-500 group-hover:text-gray-700'
                  }
                `} />
                
                {/* Label com tipografia elegante */}
                <span className={`
                  text-xs font-light tracking-wide text-center transition-all duration-500
                  ${isActive 
                    ? 'text-gray-900 font-medium' 
                    : 'text-gray-600 group-hover:text-gray-800'
                  }
                `}>
                  {key.shortLabel}
                </span>
                
                {/* Efeito shimmer elegante */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 transition-all duration-700 group-hover:translate-x-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Layout Desktop: Editorial elegante */}
      <div className="hidden md:flex items-center space-x-2">
        {/* Label editorial */}
        <span className="text-xs font-light text-gray-400 uppercase tracking-[0.2em] mr-1">
          Visão
        </span>
        
        {/* Chaves elegantes para desktop */}
        {accessKeys.map((key) => {
          const Icon = key.icon;
          const isActive = activeTheme === key.id;
          const colors = colorMap[key.color as keyof typeof colorMap];
          
          return (
            <button
              key={key.id}
              onClick={() => onThemeChange(key.id)}
              className={`
                relative group flex items-center space-x-2 px-3 py-2 transition-all duration-500 cursor-pointer
                ${isActive 
                  ? 'bg-gradient-to-br from-white via-white to-gray-50/50 shadow-lg shadow-gray-900/8' 
                  : 'bg-white/60 backdrop-blur-sm hover:bg-white/80 hover:shadow-md hover:shadow-gray-900/5'
                }
                border border-white/40 hover:border-white/60
              `}
              title={`${key.label} (${key.keyboardShortcut})`}
            >
              {/* Linha de status superior */}
              <div className={`
                absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 transition-all duration-500
                ${isActive ? colors.bg : 'bg-gray-200/50'}
              `} />
              
              {/* Ícone */}
              <Icon className={`
                w-4 h-4 transition-all duration-500
                ${isActive ? colors.text : 'text-gray-500 group-hover:text-gray-700'}
              `} />
              
              {/* Label elegante */}
              <span className={`
                text-sm font-light tracking-wide transition-all duration-500
                ${isActive ? 'text-gray-900 font-medium' : 'text-gray-600 group-hover:text-gray-800'}
              `}>
                {key.shortLabel}
              </span>
              
              {/* Keyboard shortcut elegante */}
              <span className={`
                text-xs font-mono opacity-50 hidden lg:block tracking-wider
                ${isActive ? 'text-gray-700' : 'text-gray-500'}
              `}>
                {key.keyboardShortcut}
              </span>
              
              {/* Efeito shimmer elegante */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 transition-all duration-700 group-hover:translate-x-full" />
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}