'use client';

import { useState, useEffect } from 'react';
import { 
  X,
  BarChart3,
  Package,
  MessageCircle,
  Users,
  RotateCcw,
  LogOut,
  Search
} from 'lucide-react';

// Hook para feedback tátil reutilizado
function useTouchFeedback() {
  const handleTouchFeedback = (element: HTMLElement, type: 'light' | 'medium' | 'heavy' = 'light') => {
    // Add haptic feedback on supported devices
    if ('vibrate' in navigator) {
      const vibrationPatterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      };
      navigator.vibrate(vibrationPatterns[type]);
    }
    
    // Add ripple effect
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%) scale(0);
      border-radius: 50%;
      background: rgba(139, 92, 246, 0.3);
      pointer-events: none;
      animation: ripple 0.4s ease-out;
      z-index: 10;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 400);
  };

  return { handleTouchFeedback };
}

export type ModuleId = 'overview' | 'estoque' | 'whatsleads' | 'vendedores';

interface ModularMenuItem {
  id: ModuleId | 'refresh' | 'search' | 'logout';
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  shortcut: string;
  color: string;
  type: 'module' | 'action';
}

interface FloatingModularMenuProps {
  currentModule?: ModuleId;
  onModuleChange?: (module: ModuleId) => void;
  onAction?: (action: string) => void;
  onRefresh?: () => void;
  onLogout?: () => void;
  setShowMobileSearch?: (show: boolean) => void;
}

const menuItems: ModularMenuItem[] = [
  // Módulos principais
  { id: 'overview', icon: BarChart3, label: 'Overview', shortcut: 'O', color: 'text-blue-400', type: 'module' },
  { id: 'estoque', icon: Package, label: 'Estoque', shortcut: 'E', color: 'text-amber-400', type: 'module' },
  { id: 'whatsleads', icon: MessageCircle, label: 'WhatsLeads', shortcut: 'W', color: 'text-green-400', type: 'module' },
  { id: 'vendedores', icon: Users, label: 'Vendedores', shortcut: 'V', color: 'text-purple-400', type: 'module' },
  
  // Ações globais
  { id: 'search', icon: Search, label: 'Buscar', shortcut: 'S', color: 'text-amber-400', type: 'action' },
  { id: 'refresh', icon: RotateCcw, label: 'Atualizar', shortcut: 'R', color: 'text-cyan-400', type: 'action' },
  { id: 'logout', icon: LogOut, label: 'Sair', shortcut: 'Q', color: 'text-red-400', type: 'action' }
];

export function FloatingModularMenu({ 
  currentModule = 'overview',
  onModuleChange,
  onAction,
  onRefresh,
  onLogout,
  setShowMobileSearch 
}: FloatingModularMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isClient, setIsClient] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isPressed, setIsPressed] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);

  // Cores de fundo do ícone V8 por módulo
  const moduleColors = {
    overview: 'from-blue-600 via-indigo-700 to-blue-800',
    estoque: 'from-amber-600 via-yellow-700 to-amber-800', 
    whatsleads: 'from-green-600 via-emerald-700 to-green-800',
    vendedores: 'from-purple-600 via-violet-700 to-purple-800'
  };

  // Cores de destaque por módulo
  const accentColors = {
    overview: 'blue-400',
    estoque: 'amber-400',
    whatsleads: 'green-400', 
    vendedores: 'purple-400'
  };
  
  // Cor atual baseada no módulo ativo
  const currentBgColor = moduleColors[currentModule] || moduleColors.overview;
  const currentAccentColor = accentColors[currentModule] || accentColors.overview;
  const { handleTouchFeedback } = useTouchFeedback();

  // Save position to localStorage
  const savePositionToStorage = (newPosition: { x: number; y: number }) => {
    try {
      localStorage.setItem('floatingMenuPosition', JSON.stringify(newPosition));
    } catch (error) {
      console.warn('Failed to save menu position to localStorage:', error);
    }
  };

  // Calculate intelligent menu positioning
  const getMenuPosition = () => {
    const menuHeight = 380; // Maior para acomodar mais itens
    const menuWidth = 200;
    const buttonSize = 56;
    const margin = 20;
    
    let menuX = position.x;
    let menuY = position.y - menuHeight - 10;
    
    if (menuY < margin) {
      menuY = position.y + buttonSize + 10;
    }
    
    if (menuX + menuWidth > window.innerWidth - margin) {
      menuX = position.x - menuWidth + buttonSize;
    }
    
    menuX = Math.max(margin, Math.min(menuX, window.innerWidth - menuWidth - margin));
    menuY = Math.max(margin, Math.min(menuY, window.innerHeight - menuHeight - margin));
    
    return { x: menuX, y: menuY };
  };

  // Drag handlers (mantém a lógica do original)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isOpen) return;
    e.preventDefault();
    e.stopPropagation();
    
    setIsPressed(true);
    setIsDragging(false);
    setHasDragged(false);
    
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    handleTouchFeedback(e.currentTarget as HTMLElement, 'light');
    
    if (e.currentTarget.hasPointerCapture(e.pointerId) === false) {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPressed) return;
    
    const dragDistance = Math.sqrt(
      Math.pow(e.clientX - (position.x + dragOffset.x), 2) +
      Math.pow(e.clientY - (position.y + dragOffset.y), 2)
    );
    
    if (dragDistance > 4 && !isDragging) {
      e.preventDefault();
      e.stopPropagation();
      
      setIsDragging(true);
      setHasDragged(true);
      handleTouchFeedback(e.currentTarget as HTMLElement, 'medium');
    }
    
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
      
      const newX = Math.max(10, Math.min(window.innerWidth - 70, e.clientX - dragOffset.x));
      const newY = Math.max(10, Math.min(window.innerHeight - 70, e.clientY - dragOffset.y));
      setPosition({ x: newX, y: newY });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isPressed) return;
    
    setIsPressed(false);
    
    if (hasDragged) {
      savePositionToStorage(position);
    }
    
    setTimeout(() => {
      setIsDragging(false);
      setHasDragged(false);
    }, 100);
    
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!hasDragged && !isDragging && !isPressed) {
      handleTouchFeedback(e.currentTarget as HTMLElement, 'medium');
      setIsOpen(!isOpen);
    }
  };

  const handleItemClick = (item: ModularMenuItem, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    handleTouchFeedback(e.currentTarget as HTMLElement, 'medium');
    
    setIsOpen(false);
    
    setTimeout(() => {
      if (item.type === 'module' && onModuleChange) {
        onModuleChange(item.id as ModuleId);
      } else {
        switch (item.id) {
          case 'search':
            setShowMobileSearch?.(true);
            break;
          case 'refresh':
            onRefresh?.();
            break;
          case 'logout':
            if (window.confirm('Tem certeza que deseja sair do sistema?')) {
              onLogout?.();
            }
            break;
          default:
            onAction?.(item.id);
        }
      }
    }, 150);
  };

  // Initialize position
  useEffect(() => {
    setIsClient(true);
    const updatePosition = () => {
      const savedPosition = localStorage.getItem('floatingMenuPosition');
      
      if (savedPosition) {
        try {
          const parsed = JSON.parse(savedPosition);
          const maxX = window.innerWidth - 80;
          const maxY = window.innerHeight - 130;
          
          setPosition({
            x: Math.min(Math.max(20, parsed.x), maxX),
            y: Math.min(Math.max(20, parsed.y), maxY)
          });
        } catch (error) {
          setPosition({
            x: window.innerWidth - 80,
            y: window.innerHeight - 130
          });
        }
      } else {
        setPosition({
          x: window.innerWidth - 80,
          y: window.innerHeight - 130
        });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = () => setIsOpen(false);
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  if (!isClient) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-md transition-all duration-300"
          style={{ animation: 'fadeIn 0.2s ease-out' }}
        />
      )}

      {/* Menu Container */}
      <div
        className="fixed z-50 select-none"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `scale(${isPressed ? 0.95 : 1}) ${isDragging ? 'rotate(2deg)' : 'rotate(0deg)'}`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out',
          cursor: isDragging ? 'grabbing' : 'pointer'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Menu principal */}
        {isOpen && (() => {
          const menuPos = getMenuPosition();
          
          return (
            <div 
              className="absolute bg-black/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden"
              style={{
                left: `${menuPos.x - position.x}px`,
                top: `${menuPos.y - position.y}px`,
                width: '200px',
                animation: `modularMenuEntry 0.4s cubic-bezier(0.16, 1, 0.3, 1) both`
              }}
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-white/10 bg-gradient-to-r from-gray-900/50 to-black/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full bg-${currentAccentColor} animate-pulse`} />
                    <span className="text-xs font-mono text-gray-300 uppercase tracking-wider">V8 Modules</span>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTouchFeedback(e.currentTarget as HTMLElement, 'light');
                      setIsOpen(false);
                    }}
                    className="w-6 h-6 rounded-full bg-white/10 hover:bg-red-500/20 border border-white/20 hover:border-red-400/40 flex items-center justify-center transition-all duration-200 group active:scale-95"
                  >
                    <X className="w-3 h-3 text-gray-300 group-hover:text-red-400 transition-colors duration-200" />
                  </button>
                </div>
              </div>
              
              {/* Módulos */}
              <div className="py-2">
                <div className="px-3 py-2">
                  <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">Módulos</span>
                </div>
                
                {menuItems.filter(item => item.type === 'module').map((item, index) => {
                  const isCurrentModule = currentModule === item.id;
                  const Icon = item.icon;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={(e) => handleItemClick(item, e)}
                      className={`
                        w-full px-4 py-3 flex items-center space-x-3 transition-all duration-200 group relative overflow-hidden
                        ${isCurrentModule 
                          ? `bg-white/10 border-l-2 border-${currentAccentColor}` 
                          : 'hover:bg-white/5 active:bg-white/10'
                        }
                      `}
                      style={{
                        animation: `modularItemEntry 0.3s ease-out ${index * 0.05}s both`,
                        minHeight: '48px'
                      }}
                    >
                      {/* Indicador ativo */}
                      {isCurrentModule && (
                        <div className={`absolute left-0 top-0 bottom-0 w-0.5 bg-${currentAccentColor}`} />
                      )}
                      
                      <div className={`relative flex items-center justify-center w-8 h-8 ${item.color} transition-colors duration-200`}>
                        <Icon className="w-4 h-4" />
                        {isCurrentModule && (
                          <div className={`absolute inset-0 bg-${currentAccentColor}/20 rounded-lg animate-pulse`} />
                        )}
                      </div>
                      
                      <div className="flex-1 flex items-center justify-between">
                        <span className={`text-sm font-medium transition-colors duration-200 ${
                          isCurrentModule ? 'text-emerald-100' : 'text-white group-hover:text-gray-100'
                        }`}>
                          {item.label}
                        </span>
                        <span className="text-xs font-mono text-gray-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                          {item.shortcut}
                        </span>
                      </div>
                    </button>
                  );
                })}
                
                {/* Separador */}
                <div className="mx-4 my-2 h-px bg-white/10" />
                
                {/* Ações */}
                <div className="px-3 py-2">
                  <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">Ações</span>
                </div>
                
                {menuItems.filter(item => item.type === 'action').map((item, index) => {
                  const Icon = item.icon;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={(e) => handleItemClick(item, e)}
                      className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-white/5 transition-all duration-200 group relative overflow-hidden active:bg-white/10"
                      style={{
                        animation: `modularItemEntry 0.3s ease-out ${(index + 4) * 0.05}s both`,
                        minHeight: '48px'
                      }}
                    >
                      <div className={`relative flex items-center justify-center w-8 h-8 ${item.color} transition-colors duration-200`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm font-medium text-white group-hover:text-gray-100 transition-colors duration-200">
                          {item.label}
                        </span>
                        <span className="text-xs font-mono text-gray-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                          {item.shortcut}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {/* Footer */}
              <div className="px-4 py-2 border-t border-white/10 bg-gradient-to-r from-black/50 to-gray-900/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-mono">
                    {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-1 rounded-full bg-emerald-400" />
                    <div className="w-1 h-1 rounded-full bg-amber-400" />
                    <div className="w-1 h-1 rounded-full bg-red-400" />
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Botão principal */}
        {!isOpen && (
          <button
            className={`relative w-14 h-14 bg-gradient-to-br ${currentBgColor} rounded-full flex items-center justify-center shadow-xl transition-all duration-500 transform border-2 border-white/20 group hover:scale-105 hover:shadow-2xl hover:border-white/30 ${
              isDragging ? 'shadow-2xl border-white/40 brightness-110' : ''
            }`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onClick={handleClick}
            style={{ 
              minHeight: '56px', 
              minWidth: '56px',
              filter: isDragging ? 'brightness(1.1)' : 'brightness(1)',
              cursor: isDragging ? 'grabbing' : 'pointer',
              animation: 'fadeIn 0.3s ease-out',
              touchAction: 'none',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none'
            }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Ícone V8 */}
            <div className="relative z-10 transition-transform duration-300">
              <span className="text-white font-bold text-lg">V8</span>
            </div>

            {/* Efeitos de ripple */}
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
              {isDragging && (
                <>
                  <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                  <div className="absolute inset-2 bg-white/30 animate-ping rounded-full" />
                </>
              )}
              
              {isPressed && !isDragging && (
                <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse" />
              )}
            </div>
          </button>
        )}
      </div>

      {/* Animações */}
      <style jsx global>{`
        @keyframes modularMenuEntry {
          0% {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
            filter: blur(4px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0);
          }
        }
        
        @keyframes modularItemEntry {
          0% {
            opacity: 0;
            transform: translateX(-10px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </>
  );
}