'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3,
  Package,
  MessageCircle,
  Users,
  LogOut,
  Zap
} from 'lucide-react';
import { LogoutModal } from '@/components/ui/LogoutModal';

export type ModuleId = 'overview' | 'estoque' | 'whatsleads' | 'vendedores' | 'micromode';

interface ModularMenuItem {
  id: ModuleId | 'logout';
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
  type: 'module' | 'action';
}

interface FloatingModularMenuProps {
  currentModule?: ModuleId;
  onModuleChange?: (module: ModuleId) => void;
  onLogout?: () => void;
}

const menuItems: ModularMenuItem[] = [
  // Módulos principais
  { id: 'overview', icon: BarChart3, label: 'Overview', color: 'text-cyan-400', type: 'module' },
  { id: 'estoque', icon: Package, label: 'Estoque', color: 'text-amber-400', type: 'module' },
  { id: 'whatsleads', icon: MessageCircle, label: 'WhatsLeads', color: 'text-green-400', type: 'module' },
  { id: 'vendedores', icon: Users, label: 'Vendedores', color: 'text-purple-400', type: 'module' },
  
  // Ações globais
  { id: 'logout', icon: LogOut, label: 'Sair', color: 'text-red-400', type: 'action' }
];

export function FloatingModularMenu({ 
  currentModule = 'overview',
  onModuleChange,
  onLogout
}: FloatingModularMenuProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Cores sutis por módulo estilo micromode
  const moduleAccents = {
    overview: {
      bg: 'bg-cyan-50/50',
      hover: 'hover:bg-cyan-50/30',
      active: 'text-cyan-600',
      indicator: 'via-cyan-400'
    },
    estoque: {
      bg: 'bg-amber-50/50',
      hover: 'hover:bg-amber-50/30', 
      active: 'text-amber-600',
      indicator: 'via-amber-400'
    },
    whatsleads: {
      bg: 'bg-green-50/50',
      hover: 'hover:bg-green-50/30',
      active: 'text-green-600', 
      indicator: 'via-green-400'
    },
    vendedores: {
      bg: 'bg-purple-50/50',
      hover: 'hover:bg-purple-50/30',
      active: 'text-purple-600',
      indicator: 'via-purple-400'
    }
  };

  const currentAccent = moduleAccents[currentModule] || moduleAccents.overview;

  const handleItemClick = (item: ModularMenuItem) => {
    if (item.type === 'module' && onModuleChange) {
      onModuleChange(item.id as ModuleId);
    } else if (item.id === 'logout') {
      setShowLogoutModal(true);
    }
  };

  // Mobile menu for modules
  const moduleItemsMobile = menuItems.filter(item => item.type === 'module');
  const actionItems = menuItems.filter(item => item.type === 'action');

  return (
    <>
      {/* Bottom Navigation Menu */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50">
        {/* Menu Grid */}
        <div className="grid grid-cols-5 h-16 lg:h-20">
          {/* Module buttons */}
          {moduleItemsMobile.map((item) => {
            const Icon = item.icon;
            const isActive = currentModule === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`flex flex-col items-center justify-center space-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden group ${
                  isActive
                    ? currentAccent.bg
                    : currentAccent.hover
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent ${currentAccent.indicator} to-transparent`} />
                )}
                
                {/* Icon */}
                <div className={`relative transition-colors duration-300 ${
                  isActive ? currentAccent.active : `${item.color} group-hover:${currentAccent.active}`
                }`}>
                  <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
                </div>
                
                {/* Label */}
                <span className={`text-xs font-light tracking-wider transition-colors duration-300 ${
                  isActive ? currentAccent.active : `text-gray-500 group-hover:${currentAccent.active}`
                }`}>
                  {item.label.toUpperCase()}
                </span>
              </button>
            );
          })}
          
          {/* Action button (Logout) */}
          {actionItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="flex flex-col items-center justify-center space-y-1 transition-all duration-300 cursor-pointer hover:bg-red-50/50 group"
              >
                <div className={`${item.color} group-hover:text-red-500 transition-colors duration-300`}>
                  <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
                </div>
                <span className="text-xs font-light tracking-wider text-gray-500 group-hover:text-red-500 transition-colors duration-300">
                  {item.label.toUpperCase()}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer with V8 indicator */}
        <div className="px-4 py-2 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full" />
              <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">V8 System</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <div className="w-1 h-1 rounded-full bg-emerald-400" />
              <div className="w-1 h-1 rounded-full bg-amber-400" />
              <div className="w-1 h-1 rounded-full bg-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false);
          onLogout?.();
        }}
        userName="Administrador"
      />

      {/* Animações CSS */}
      <style jsx global>{`
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </>
  );
}