'use client';

import { useState, useEffect } from 'react';
import { 
  Minus,
  RotateCcw,
  Home,
  Search,
  BarChart3,
  Settings,
  Download,
  Upload,
  Car,
  X,
  Plus
} from 'lucide-react';
import { NewEditorialList } from './NewEditorialList';
import { useGestures } from '../../hooks/useGestures';
import { AdminDashboard } from '../admin/AdminDashboard';

// Enhanced touch feedback hook for mobile interactions
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

interface DashboardData {
  resumo: {
    total_veiculos: number;
    valor_total: number;
    por_status: {
      disponivel: number;
      reservado: number;
      vendido: number;
    };
  };
  hierarquia?: Array<{
    marca: string;
    total_veiculos: number;
    valor_total: number;
    categorias: Array<{
      nome: string;
      slug: string;
      total_veiculos: number;
      valor_total: number;
      classes: Record<'A' | 'B' | 'C' | 'D', {
        quantidade: number;
        valor: number;
        percentual: number;
      }>;
    }>;
  }>;
}

interface EditorialDashboardProps {
  dashboard?: DashboardData | undefined;
  isLoading?: boolean;
  onRefresh?: () => void;
  onMenuAction?: (action: string) => void;
}

// Status Indicator Component
function StatusIndicator({ status, count }: { status: 'disponivel' | 'reservado' | 'vendido'; count: number }) {
  const statusConfig = {
    disponivel: { color: 'bg-lime-400', label: 'Disponível', textColor: 'text-lime-500' },
    reservado: { color: 'bg-fuchsia-500', label: 'Reservado', textColor: 'text-fuchsia-500' },
    vendido: { color: 'bg-red-500', label: 'Vendido', textColor: 'text-red-500' }
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center space-x-2 whitespace-nowrap">
      <div className={`w-2 h-2 ${config.color} rounded-full animate-pulse-dot`} />
      <span className={`text-xs font-mono ${config.textColor} font-medium`}>
        {count} <span className="hidden sm:inline">{config.label.toLowerCase()}</span>
      </span>
    </div>
  );
}

// Componente de Layout Editorial em Grid com Animações
function EditorialGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-12 lg:space-y-16">
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse-dot {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-pulse-dot {
          animation: pulse-dot 2s ease-in-out infinite;
        }
        
        .shimmer {
          background: linear-gradient(
            90deg,
            #f1f5f9 0px,
            #e2e8f0 40px,
            #f1f5f9 80px
          );
          background-size: 200px 100%;
          animation: shimmer 1.5s infinite;
        }
        
        @keyframes ripple {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
          }
        }
      `}</style>
      {children}
    </div>
  );
}

// Componente de Seção Editorial com Micro-interações
function EditorialSection({ 
  titulo, 
  numero, 
  children,
  color = 'purple'
}: {
  titulo: string;
  numero: string;
  children: React.ReactNode;
  color?: 'purple' | 'cyan' | 'neon' | 'pink' | 'green';
}) {
  const colorClasses = {
    purple: 'group-hover:text-purple-500 group-hover:shadow-purple-200',
    cyan: 'group-hover:text-cyan-400 group-hover:shadow-cyan-200',
    neon: 'group-hover:text-sky-400 group-hover:shadow-sky-200',
    pink: 'group-hover:text-pink-400 group-hover:shadow-pink-200',
    green: 'group-hover:text-emerald-500 group-hover:shadow-emerald-200'
  };

  return (
    <section className="animate-fadeInUp">
      <div className="mb-8 lg:mb-12 group">
        <div className="flex items-baseline space-x-6 mb-4 lg:mb-6">
          <span className={`font-mono text-xs lg:text-sm text-gray-400 tracking-widest transition-all duration-300 cursor-pointer hover:scale-110 ${colorClasses[color]} select-none`}>
            {numero}
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 group-hover:from-purple-200 group-hover:via-cyan-200 group-hover:to-pink-200 transition-all duration-500" />
        </div>
        <h2 className="text-xl lg:text-2xl xl:text-3xl font-light tracking-tight text-gray-900 leading-tight group-hover:text-gray-700 transition-colors duration-300">
          {titulo}
        </h2>
      </div>
      {children}
    </section>
  );
}

// Componente de Métrica Editorial com Animações e Cores (unused but kept for future use)
// function EditorialMetric({ 
//   label, 
//   value, 
//   change, 
//   unit = '',
//   emphasis = false,
//   color = 'purple',
//   animated = true
// }: {
//   label: string;
//   value: string | number;
//   change?: { value: number; direction: 'up' | 'down' };
//   unit?: string;
//   emphasis?: boolean;
//   color?: 'purple' | 'cyan' | 'neon' | 'green' | 'red' | 'pink';
//   animated?: boolean;
// }) {
//   const [displayValue, setDisplayValue] = useState(0);
//   const numericValue = typeof value === 'number' ? value : parseInt(value.toString().replace(/[^0-9]/g, '')) || 0;
//
//   const colorClasses = {
//     purple: 'border-l-violet-500 bg-gradient-to-r from-violet-500/10 to-transparent',
//     cyan: 'border-l-cyan-400 bg-gradient-to-r from-cyan-400/10 to-transparent',
//     neon: 'border-l-sky-400 bg-gradient-to-r from-sky-400/10 to-transparent',
//     green: 'border-l-lime-400 bg-gradient-to-r from-lime-400/10 to-transparent',
//     red: 'border-l-red-500 bg-gradient-to-r from-red-500/10 to-transparent',
//     pink: 'border-l-fuchsia-500 bg-gradient-to-r from-fuchsia-500/10 to-transparent'
//   };
//
//   const changeColors = {
//     up: 'text-lime-400 bg-lime-400/10',
//     down: 'text-red-500 bg-red-500/10'
//   };
//
//   useEffect(() => {
//     if (animated && typeof value === 'number' && numericValue > 0) {
//       const start = 0;
//       const duration = 1000;
//       const startTime = Date.now();
//       
//       const animate = () => {
//         const now = Date.now();
//         const elapsed = now - startTime;
//         const progress = Math.min(elapsed / duration, 1);
//         
//         const easeOut = 1 - Math.pow(1 - progress, 3);
//         const current = Math.floor(start + (numericValue - start) * easeOut);
//         
//         setDisplayValue(current);
//         
//         if (progress < 1) {
//           requestAnimationFrame(animate);
//         }
//       };
//       
//       requestAnimationFrame(animate);
//     } else {
//       setDisplayValue(numericValue);
//     }
//   }, [value, animated, numericValue]);
//
//   return (
//     <div className={`space-y-3 lg:space-y-4 p-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer group active:scale-[0.98] ${
//       emphasis ? `border-l-4 ${colorClasses[color]} pl-6` : 'hover:bg-gray-50/50'
//     }`}
//     style={{ minHeight: '44px' }}>
//       <div className="flex items-baseline justify-between">
//         <span className="font-mono text-xs uppercase tracking-widest text-gray-500 group-hover:text-gray-700 transition-colors">
//           {label}
//         </span>
//         {change && (
//           <div className={`flex items-center space-x-1 text-xs px-2 py-1 rounded-full transition-all duration-300 ${
//             changeColors[change.direction]
//           }`}>
//             {change.direction === 'up' ? (
//               <TrendingUp className="w-3 h-3" />
//             ) : (
//               <TrendingDown className="w-3 h-3" />
//             )}
//             <span className="font-mono font-medium">{Math.abs(change.value)}%</span>
//           </div>
//         )}
//       </div>
//       <div className={`${emphasis ? 'text-3xl lg:text-4xl xl:text-5xl' : 'text-2xl lg:text-3xl'} font-light tracking-tight text-gray-900 group-hover:text-gray-700 transition-colors`}>
//         {animated && typeof value === 'number' ? displayValue : value}
//         <span className="text-base lg:text-lg text-gray-500 ml-1">{unit}</span>
//       </div>
//     </div>
//   );
// }

// Mobile Bottom Navigation Component (unused but kept for future use)
// function BottomNavigation({ 
//   activeSection, 
//   onSectionChange, 
//   onRefresh,
//   isLoading,
//   setShowMobileSearch
// }: { 
//   activeSection: string;
//   onSectionChange: (section: string) => void;
//   onRefresh: () => void;
//   isLoading: boolean;
//   setShowMobileSearch: (show: boolean) => void;
// }) {
//   const { handleTouchFeedback } = useTouchFeedback();
//   
//   const navItems = [
//     { id: 'home', label: 'Início', icon: Home },
//     { id: 'search', label: 'Buscar', icon: Search },
//     { id: 'stats', label: 'Stats', icon: BarChart3 },
//     { id: 'settings', label: 'Config', icon: Settings }
//   ];
//
//   return (
//     <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 safe-area-inset-bottom z-50">
//       <div className="flex items-center justify-around px-2 py-2">
//         {navItems.map((item) => {
//           const Icon = item.icon;
//           const isActive = activeSection === item.id;
//           
//           return (
//             <button
//               key={item.id}
//               onClick={(e) => {
//                 // Add touch feedback
//                 handleTouchFeedback(e.currentTarget);
//                 
//                 if (item.id === 'settings') {
//                   onRefresh();
//                 } else if (item.id === 'search') {
//                   // On mobile, show search overlay
//                   if (window.innerWidth < 768) {
//                     setShowMobileSearch(true);
//                   } else {
//                     // On desktop, scroll to search section
//                     const searchSection = document.querySelector('[data-section="search"]');
//                     if (searchSection) {
//                       searchSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
//                     }
//                   }
//                   onSectionChange(item.id);
//                 } else {
//                   onSectionChange(item.id);
//                 }
//               }}
//               disabled={isLoading && item.id === 'settings'}
//               className={`relative flex flex-col items-center justify-center px-3 py-2 rounded-2xl transition-all duration-300 min-w-[60px] min-h-[60px] group ${
//                 isActive 
//                   ? 'bg-gradient-to-r from-violet-500/10 to-cyan-400/10 text-violet-600' 
//                   : 'text-gray-500 hover:text-violet-600 hover:bg-violet-50/50'
//               }`}
//               style={{ minHeight: '44px', minWidth: '44px' }}
//             >
//               <div className={`flex items-center justify-center w-6 h-6 transition-all duration-300 ${
//                 isActive ? 'scale-110' : 'group-hover:scale-105'
//               } ${isLoading && item.id === 'settings' ? 'animate-spin' : ''}`}>
//                 <Icon className="w-5 h-5" />
//               </div>
//               <span className={`text-xs font-medium mt-1 transition-all duration-300 ${
//                 isActive ? 'opacity-100 scale-100' : 'opacity-70 scale-95 group-hover:opacity-100'
//               }`}>
//                 {item.label}
//               </span>
//               
//               {isActive && (
//                 <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full animate-pulse" />
//               )}
//             </button>
//           );
//         })}
//       </div>
//       
//       {/* Touch feedback indicator */}
//       <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-200 to-transparent animate-pulse" />
//     </nav>
//   );
// }

// Floating Modular Menu Component (Refined AssistiveTouch style)
export function FloatingModularMenu({ 
  onAction, 
  onRefresh,
  setShowMobileSearch 
}: {
  onAction: (action: string) => void;
  onRefresh: () => void;
  setShowMobileSearch: (show: boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ 
    x: 20, 
    y: 20 
  });
  const [isClient, setIsClient] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  // const [dragStartTime, setDragStartTime] = useState(0); // unused
  const [isPressed, setIsPressed] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const { handleTouchFeedback } = useTouchFeedback();

  // Save position to localStorage
  const savePositionToStorage = (newPosition: { x: number; y: number }) => {
    try {
      localStorage.setItem('floatingMenuPosition', JSON.stringify(newPosition));
    } catch (error) {
      console.warn('Failed to save menu position to localStorage:', error);
    }
  };

  const menuActions = [
    { id: 'home', icon: Home, label: 'Dashboard', shortcut: 'H', color: 'text-slate-300' },
    { id: 'vehicles', icon: Car, label: 'Veículos', shortcut: 'V', color: 'text-violet-400' },
    { id: 'add-vehicle', icon: Plus, label: 'Novo Veículo', shortcut: 'N', color: 'text-emerald-400' },
    { id: 'import', icon: Upload, label: 'Importar', shortcut: 'I', color: 'text-cyan-400' },
    { id: 'search', icon: Search, label: 'Buscar', shortcut: 'S', color: 'text-amber-400' },
    { id: 'stats', icon: BarChart3, label: 'Estatísticas', shortcut: 'E', color: 'text-purple-400' },
    { id: 'download', icon: Download, label: 'Exportar', shortcut: 'X', color: 'text-pink-400' },
    { id: 'settings', icon: Settings, label: 'Configurações', shortcut: 'C', color: 'text-gray-400' }
  ];

  // Calculate intelligent menu positioning and button offset
  const getMenuPosition = () => {
    const menuHeight = 320; // Approximate menu height
    const menuWidth = 200;
    const buttonSize = 56; // New smaller button size
    const margin = 20;
    
    let menuX = position.x;
    let menuY = position.y - menuHeight - 10; // Default: above the button
    let direction = 'up';
    let buttonOffsetX = 0;
    let buttonOffsetY = 0;
    
    // Check if menu fits above
    if (menuY < margin) {
      menuY = position.y + buttonSize + 10; // Below the button
      direction = 'down';
    }
    
    // Check if menu fits to the right
    if (menuX + menuWidth > window.innerWidth - margin) {
      menuX = position.x - menuWidth + buttonSize; // Align to right edge of button
    }
    
    // Check if button would overlap with menu and adjust button position
    const buttonCenterX = position.x + (buttonSize / 2);
    const buttonCenterY = position.y + (buttonSize / 2);
    const menuCenterX = menuX + (menuWidth / 2);
    const menuCenterY = menuY + (menuHeight / 2);
    
    // If button is too close to menu center, offset it
    if (Math.abs(buttonCenterX - menuCenterX) < menuWidth / 2 + 30 && 
        Math.abs(buttonCenterY - menuCenterY) < menuHeight / 2 + 30) {
      
      if (direction === 'up') {
        buttonOffsetY = -15; // Move button down when menu is above
      } else {
        buttonOffsetY = 15; // Move button up when menu is below  
      }
      
      // Adjust horizontally if needed
      if (buttonCenterX > menuCenterX) {
        buttonOffsetX = 15; // Move button right
      } else {
        buttonOffsetX = -15; // Move button left
      }
    }
    
    // Final boundary checks
    menuX = Math.max(margin, Math.min(menuX, window.innerWidth - menuWidth - margin));
    menuY = Math.max(margin, Math.min(menuY, window.innerHeight - menuHeight - margin));
    
    return { 
      x: menuX, 
      y: menuY, 
      direction,
      buttonOffsetX,
      buttonOffsetY
    };
  };

  // Unified interaction handling - Desktop optimized like mobile
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
    
    // Immediate haptic feedback like mobile
    handleTouchFeedback(e.currentTarget as HTMLElement, 'light');
    
    // Capture pointer for better tracking
    if (e.currentTarget.hasPointerCapture(e.pointerId) === false) {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  // Touch-specific handlers for better mobile support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isOpen) return;
    e.preventDefault();
    e.stopPropagation();
    
    setIsPressed(true);
    setIsDragging(false);
    setHasDragged(false);
    
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
    
    // Add haptic feedback immediately
    handleTouchFeedback(e.currentTarget as HTMLElement, 'light');
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPressed) return;
    
    const touch = e.touches[0];
    const dragDistance = Math.sqrt(
      Math.pow(touch.clientX - (position.x + dragOffset.x), 2) +
      Math.pow(touch.clientY - (position.y + dragOffset.y), 2)
    );
    
    // Start dragging if moved more than 5px (slightly higher threshold for touch)
    if (dragDistance > 5 && !isDragging) {
      e.preventDefault(); // Only prevent when we start dragging
      e.stopPropagation();
      
      setIsDragging(true);
      setHasDragged(true);
      handleTouchFeedback(e.currentTarget as HTMLElement, 'medium');
      
      // Prevent body scroll during drag
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    }
    
    // Handle actual movement
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
      
      const newX = Math.max(10, Math.min(window.innerWidth - 70, touch.clientX - dragOffset.x));
      const newY = Math.max(10, Math.min(window.innerHeight - 70, touch.clientY - dragOffset.y));
      setPosition({ x: newX, y: newY });
    }
  };

  const handleTouchEnd = () => {
    if (!isPressed) return;
    
    setIsPressed(false);
    
    // Save position if user dragged
    if (hasDragged) {
      savePositionToStorage(position);
    }
    
    // Restore body scroll
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
    
    // Reset dragging after a small delay to allow click handler to work
    setTimeout(() => {
      setIsDragging(false);
      setHasDragged(false);
    }, 100);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPressed) return;
    
    const dragDistance = Math.sqrt(
      Math.pow(e.clientX - (position.x + dragOffset.x), 2) +
      Math.pow(e.clientY - (position.y + dragOffset.y), 2)
    );
    
    // Start dragging if moved more than 4px (desktop optimized threshold)
    if (dragDistance > 4 && !isDragging) {
      e.preventDefault(); // Only prevent when we start dragging
      e.stopPropagation();
      
      setIsDragging(true);
      setHasDragged(true);
      handleTouchFeedback(e.currentTarget as HTMLElement, 'medium');
      
      // Prevent body scroll during drag (same as mobile)
      document.body.style.overflow = 'hidden';
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
    }
    
    // Handle actual movement (same logic as mobile)
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
    
    // Save position if user dragged
    if (hasDragged) {
      savePositionToStorage(position);
    }
    
    // Restore body scroll (same as mobile cleanup)
    document.body.style.overflow = '';
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
    
    // Reset dragging after a small delay to allow click handler to work
    setTimeout(() => {
      setIsDragging(false);
      setHasDragged(false);
    }, 100); // Same timeout as mobile
    
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
    // Don't reset if we're actively dragging
    if (isDragging) return;
    
    setIsPressed(false);
    
    // Restore body styles on leave (safety cleanup)
    document.body.style.overflow = '';
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
    
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  // Improved click handler for menu toggle
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only handle click if we haven't dragged and aren't currently dragging
    if (!hasDragged && !isDragging && !isPressed) {
      handleTouchFeedback(e.currentTarget as HTMLElement, 'medium');
      setIsOpen(!isOpen);
    }
  };

  const handleActionClick = (action: string, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    handleTouchFeedback(e.currentTarget as HTMLElement, 'medium');
    
    // Smooth close animation before action
    setIsOpen(false);
    
    setTimeout(() => {
      switch (action) {
        case 'search':
          setShowMobileSearch(true);
          break;
        case 'settings':
          onRefresh();
          break;
        default:
          onAction(action);
      }
    }, 150); // Small delay for better UX
  };

  // Initialize position from localStorage or default to bottom right corner
  useEffect(() => {
    setIsClient(true);
    const updatePosition = () => {
      // Try to load saved position from localStorage
      const savedPosition = localStorage.getItem('floatingMenuPosition');
      
      if (savedPosition) {
        try {
          const parsed = JSON.parse(savedPosition);
          // Validate position is within screen bounds
          const maxX = window.innerWidth - 80;
          const maxY = window.innerHeight - 130;
          
          setPosition({
            x: Math.min(Math.max(20, parsed.x), maxX),
            y: Math.min(Math.max(20, parsed.y), maxY)
          });
        } catch (error) {
          // If parsing fails, use default position
          setPosition({
            x: window.innerWidth - 80,
            y: window.innerHeight - 130
          });
        }
      } else {
        // Default position if no saved position
        setPosition({
          x: window.innerWidth - 80,
          y: window.innerHeight - 130
        });
      }
    };

    // Set initial position
    updatePosition();

    // Update position on window resize
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  // Simplified global key handler (ESC support)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // ESC key cancels drag (desktop feature)
      if (e.key === 'Escape' && (isDragging || isPressed)) {
        setIsPressed(false);
        setIsDragging(false);
        setHasDragged(false);
        
        // Restore body styles (same as mobile)
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
      }
    };

    // Always listen for ESC key
    document.addEventListener('keydown', handleGlobalKeyDown, { passive: true });
    
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [isDragging, isPressed]);

  // Cleanup effect for touch events
  useEffect(() => {
    return () => {
      // Ensure body styles are restored on component unmount
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = () => {
        setIsOpen(false);
      };
      
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return null;
  }

  return (
    <>
      {/* Enhanced Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-md transition-all duration-300"
          style={{
            animation: 'fadeIn 0.2s ease-out'
          }}
        />
      )}

      {/* Enhanced Floating Menu Container */}
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
        {/* Corporate Vertical Menu (when open) */}
        {isOpen && (() => {
          const menuPos = getMenuPosition();
          
          return (
            <div 
              className="absolute bg-black/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden"
              style={{
                left: `${menuPos.x - position.x}px`,
                top: `${menuPos.y - position.y}px`,
                width: '200px',
                animation: `corporateMenuEntry 0.4s cubic-bezier(0.16, 1, 0.3, 1) both`
              }}
            >
              {/* Menu Header with Close Button */}
              <div className="px-4 py-3 border-b border-white/10 bg-gradient-to-r from-gray-900/50 to-black/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono text-gray-300 uppercase tracking-wider">V8 System</span>
                  </div>
                  
                  {/* Elegant Close Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTouchFeedback(e.currentTarget as HTMLElement, 'light');
                      setIsOpen(false);
                    }}
                    className="w-6 h-6 rounded-full bg-white/10 hover:bg-red-500/20 border border-white/20 hover:border-red-400/40 flex items-center justify-center transition-all duration-200 group active:scale-95"
                    style={{ minHeight: '24px', minWidth: '24px' }}
                  >
                    <X className="w-3 h-3 text-gray-300 group-hover:text-red-400 transition-colors duration-200" />
                  </button>
                </div>
              </div>
              
              {/* Menu Items */}
              <div className="py-2">
                {menuActions.map((action, index) => (
                  <button
                    key={action.id}
                    onClick={(e) => handleActionClick(action.id, e)}
                    className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-white/5 transition-all duration-200 group relative overflow-hidden active:bg-white/10"
                    style={{
                      animation: `corporateItemEntry 0.3s ease-out ${index * 0.05}s both`,
                      minHeight: '48px'
                    }}
                  >
                    {/* Hover line indicator */}
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    
                    {/* Icon */}
                    <div className={`relative flex items-center justify-center w-8 h-8 ${action.color} transition-colors duration-200`}>
                      <action.icon className="w-4 h-4" />
                    </div>
                    
                    {/* Label and shortcut */}
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-sm font-medium text-white group-hover:text-gray-100 transition-colors duration-200">
                        {action.label}
                      </span>
                      <span className="text-xs font-mono text-gray-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/10 group-hover:bg-white/10 transition-colors duration-200">
                        {action.shortcut}
                      </span>
                    </div>
                    
                    {/* Subtle shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 transition-all duration-500 group-hover:translate-x-full" />
                  </button>
                ))}
              </div>
              
              {/* Menu Footer */}
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

        {/* Compact Main Floating Button - Hidden when menu is open */}
        {!isOpen && (
          <button
            className={`relative w-14 h-14 bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 transform border-2 border-white/20 group hover:scale-105 hover:shadow-2xl hover:border-white/30 ${
              isDragging ? 'shadow-2xl border-white/40 bg-gradient-to-br from-gray-800 to-gray-900' : ''
            }`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={handleClick}
            style={{ 
              minHeight: '56px', 
              minWidth: '56px',
              filter: isDragging ? 'brightness(1.1)' : 'brightness(1)',
              cursor: isDragging ? 'grabbing' : 'pointer',
              animation: 'fadeIn 0.3s ease-out',
              touchAction: 'none', // Crítico: Previne scroll durante drag
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none'
            }}
          >
            {/* Sophisticated background glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Geometric Triangle Icon */}
            <div className="relative z-10 transition-transform duration-300">
              <svg className="w-6 h-6 text-white transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M12 3 L21 18 L3 18 Z" />
              </svg>
            </div>

            {/* Enhanced ripple effects */}
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
            
            {/* Sophisticated border glow */}
            <div className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
              isOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
            }`} style={{
              boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.1), 0 0 30px rgba(0, 0, 0, 0.3)'
            }} />
          </button>
        )}

        {/* Subtle Connection Line to Menu */}
        {isOpen && (() => {
          const menuPos = getMenuPosition();
          const lineEndX = menuPos.x - position.x + (menuPos.x > position.x ? 0 : 200);
          const lineEndY = menuPos.y - position.y + 160;
          
          return (
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ width: '300px', height: '400px', left: '-100px', top: '-150px' }}>
              <defs>
                <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: 'rgba(255, 255, 255, 0.3)' }} />
                  <stop offset="50%" style={{ stopColor: 'rgba(255, 255, 255, 0.1)' }} />
                  <stop offset="100%" style={{ stopColor: 'rgba(255, 255, 255, 0)' }} />
                </linearGradient>
              </defs>
              
              <line
                x1={150} // Button center
                y1={150}
                x2={lineEndX + 150}
                y2={lineEndY + 150}
                stroke="url(#connectionGradient)"
                strokeWidth="1"
                strokeDasharray="3,2"
                opacity={0.6}
                style={{
                  animation: 'connectionLine 0.4s ease-out'
                }}
              />
            </svg>
          );
        })()}
      </div>

      {/* Corporate Menu Animations */}
      <style jsx global>{`
        @keyframes corporateMenuEntry {
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
        
        @keyframes corporateItemEntry {
          0% {
            opacity: 0;
            transform: translateX(-10px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes connectionLine {
          0% {
            opacity: 0;
            stroke-dasharray: 0, 100;
          }
          100% {
            opacity: 0.6;
            stroke-dasharray: 20, 5;
          }
        }
        
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

// Mobile Search Overlay Component
function MobileSearchOverlay({ 
  isOpen, 
  onClose, 
  searchTerm, 
  onSearchChange,
  suggestions,
  onSuggestionClick 
}: {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  suggestions: Array<{ marca: string }>;
  onSuggestionClick: (marca: string) => void;
}) {
  const { handleTouchFeedback } = useTouchFeedback();

  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 z-50 bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={(e) => {
              handleTouchFeedback(e.currentTarget, 'light');
              onClose();
            }}
            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors active:scale-95"
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            <Minus className="w-5 h-5 rotate-45" />
          </button>
          
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por marca..."
              className="w-full text-lg bg-transparent border-none outline-none placeholder-gray-400"
              autoFocus
            />
          </div>
          
          {searchTerm && (
            <button
              onClick={(e) => {
                handleTouchFeedback(e.currentTarget, 'light');
                onSearchChange('');
              }}
              className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors active:scale-95"
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              <Minus className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {searchTerm ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-500 mb-4">
              {suggestions.length} resultado{suggestions.length !== 1 ? 's' : ''} encontrado{suggestions.length !== 1 ? 's' : ''}
            </p>
            
            {suggestions.map((item, i) => (
              <button
                key={i}
                onClick={(e) => {
                  handleTouchFeedback(e.currentTarget, 'medium');
                  onSuggestionClick(item.marca);
                  onClose();
                }}
                className="w-full flex items-center p-4 bg-white border border-gray-100 rounded-2xl hover:bg-violet-50 hover:border-violet-200 transition-all duration-200 active:scale-[0.98]"
                style={{ minHeight: '44px' }}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-violet-400 to-cyan-400 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-semibold text-sm">
                    {item.marca.charAt(0)}
                  </span>
                </div>
                
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">{item.marca}</p>
                  <p className="text-sm text-gray-500">Marca</p>
                </div>
                
                <Search className="w-5 h-5 text-gray-300" />
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Marcas Populares</h3>
              <div className="grid grid-cols-2 gap-3">
                {suggestions.slice(0, 6).map((item, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      handleTouchFeedback(e.currentTarget, 'medium');
                      onSuggestionClick(item.marca);
                      onClose();
                    }}
                    className="p-4 bg-gradient-to-r from-violet-50 to-cyan-50 border border-violet-100 rounded-2xl hover:shadow-lg transition-all duration-200 active:scale-95"
                    style={{ minHeight: '44px' }}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-violet-400 to-cyan-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {item.marca.charAt(0)}
                        </span>
                      </div>
                      <p className="font-medium text-gray-800 text-sm">{item.marca}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function EditorialDashboard({ dashboard, isLoading = false, onRefresh, onMenuAction }: EditorialDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  // const [activeSection, setActiveSection] = useState('home'); // unused
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [adminAction, setAdminAction] = useState<string | null>(null);

  // Mobile gesture handling
  const gestureHandlers = useGestures({
    onSwipe: (gesture) => {
      // Swipe down to refresh (mobile pattern)
      if (gesture.direction === 'down' && gesture.distance > 100) {
        onRefresh?.();
      }
    },
    onLongPress: () => {
      // Long press to clear search (mobile UX)
      if (searchTerm) {
        setSearchTerm('');
      }
    },
    onDoubleTap: () => {
      // Double tap to scroll to top (mobile pattern)
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
      maximumFractionDigits: 1 // Permitir 1 casa decimal para melhor precisão
    }).format(value);
  };

  const formatCurrencyFull = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Handler para ações do menu
  const handleMenuAction = (action: string) => {
    // Ações administrativas
    if (['vehicles', 'add-vehicle', 'import', 'stats'].includes(action)) {
      setAdminAction(action);
    } else if (action === 'home') {
      setAdminAction(null);
    }
    
    // Chamar callback externo se fornecido
    if (onMenuAction) {
      onMenuAction(action);
    }
  };

  // Filtrar hierarquia baseado na busca
  const marcasFiltradas = dashboard?.hierarquia?.filter(marca => 
    marca.marca.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading && !dashboard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-cyan-50/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="flex items-center space-x-4 mb-12">
              <div className="h-12 bg-gradient-to-r from-purple-200 to-cyan-200 rounded-lg w-48 shimmer" />
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24 shimmer" />
            </div>
            <div className="space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 bg-gradient-to-br from-purple-100 to-cyan-100 rounded-xl shimmer" />
                ))}
              </div>
              <div className="space-y-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-gradient-to-r from-gray-100 to-purple-100 rounded-xl shimmer" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Se estiver em modo admin, renderizar AdminDashboard
  if (adminAction) {
    return (
      <AdminDashboard 
        initialAction={adminAction} 
        onBackToHome={() => setAdminAction(null)}
      />
    );
  }

  return (
    <div 
      ref={gestureHandlers.ref as React.RefObject<HTMLDivElement>}
      className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-cyan-50/20 text-gray-900"
    >
      {/* Enhanced Mobile-First Header */}
      <header className="bg-gradient-to-br from-white via-violet-50/30 to-cyan-50/20 border-b border-white/20 shadow-lg shadow-violet-100/20">
        
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          {/* Mobile Header */}
          <div className="md:hidden">
            <div className="flex items-center justify-between py-4">
              {/* Brand Section Mobile */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 rounded-2xl flex items-center justify-center shadow-xl shadow-gray-900/20">
                    <span className="text-white font-bold text-sm">V8</span>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
                    V8 System
                  </h1>
                  <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                    Automotive
                  </span>
                </div>
              </div>
              
              {/* Actions Mobile */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={onRefresh}
                  disabled={isLoading}
                  className="w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 hover:bg-white hover:shadow-lg hover:shadow-violet-100/30 transition-all duration-300 disabled:opacity-50 active:scale-95"
                >
                  <RotateCcw className={`w-4 h-4 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
            
            {/* Mobile Stats Bar */}
            <div className="pb-4">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40 shadow-sm">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                      <span className="text-lg font-bold text-gray-800">{dashboard?.resumo.por_status.disponivel || 0}</span>
                    </div>
                    <span className="text-xs font-medium text-gray-600">Disponível</span>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                      <span className="text-lg font-bold text-gray-800">{dashboard?.resumo.por_status.reservado || 0}</span>
                    </div>
                    <span className="text-xs font-medium text-gray-600">Reservado</span>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                      <span className="text-lg font-bold text-gray-800">{dashboard?.resumo.por_status.vendido || 0}</span>
                    </div>
                    <span className="text-xs font-medium text-gray-600">Vendido</span>
                  </div>
                </div>
                
                {/* Total Value Mobile */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Valor Total</p>
                    <p className="text-xl font-bold bg-gradient-to-r from-violet-600 via-cyan-600 to-purple-600 bg-clip-text text-transparent">
                      {formatCurrency(dashboard?.resumo.valor_total || 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:block py-8 lg:py-12">
            <div className="flex items-start justify-between">
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  {/* Enhanced Brand Identity Desktop */}
                  <div className="relative">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 rounded-3xl flex items-center justify-center shadow-xl shadow-gray-900/20">
                      <span className="text-white font-bold text-2xl lg:text-3xl">V8</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h1 className="text-4xl lg:text-5xl xl:text-6xl font-light tracking-tight text-gray-900">
                      V8 System
                    </h1>
                    <div className="flex items-center space-x-4">
                      <span className="font-mono text-sm text-gray-400 uppercase tracking-widest">
                        Automotive
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm font-medium text-gray-600">
                        {dashboard?.resumo.total_veiculos || 0} veículos
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm font-semibold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
                        {formatCurrency(dashboard?.resumo.valor_total || 0)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Status Indicators Desktop */}
                <div className="flex items-center space-x-8">
                  <StatusIndicator status="disponivel" count={dashboard?.resumo.por_status.disponivel || 0} />
                  <StatusIndicator status="reservado" count={dashboard?.resumo.por_status.reservado || 0} />
                  <StatusIndicator status="vendido" count={dashboard?.resumo.por_status.vendido || 0} />
                </div>
              </div>
              
              {/* Enhanced Refresh Button Desktop */}
              <div className="relative">
                <button
                  onClick={onRefresh}
                  disabled={isLoading}
                  className="flex items-center space-x-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 hover:bg-white hover:shadow-xl hover:shadow-violet-100/30 transition-all duration-300 disabled:opacity-50 active:scale-95 group"
                >
                  <RotateCcw className={`w-5 h-5 text-gray-600 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-300'}`} />
                  <span className="font-mono text-sm uppercase tracking-wider text-gray-700">Sync</span>
                </button>
                
                {isLoading && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-violet-400 to-cyan-400 rounded-2xl blur opacity-30 animate-pulse" />
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal Editorial */}
      <main className="relative max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12 pb-24 md:pb-12">
        <EditorialGrid>
          {/* Seção de Métricas Compactas Mobile-First */}
          <div className="space-y-4 md:space-y-6">
            {/* Header Compacto Mobile-First */}
            <div className="text-center space-y-2 md:space-y-3">
              <div className="flex items-center justify-center space-x-3 md:space-x-4">
                <div className="h-px bg-gradient-to-r from-transparent via-violet-300 to-transparent flex-1" />
                <h2 className="text-lg md:text-2xl font-light text-gray-900 tracking-tight">
                  Inventário
                </h2>
                <div className="h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent flex-1" />
              </div>
              <p className="text-gray-600 font-mono text-xs md:text-sm uppercase tracking-widest">
                Overview do estoque
              </p>
            </div>

            {/* Cards de Métricas Compactos Mobile-First */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {/* Total de Veículos - Card Principal Compacto */}
              <div className="col-span-2 bg-gradient-to-br from-violet-500 via-purple-600 to-violet-700 rounded-2xl p-4 md:p-6 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3 md:mb-4">
                    <div className="flex-1">
                      <p className="text-violet-100 text-xs md:text-sm font-mono uppercase tracking-wider mb-2">
                        Total
                      </p>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl md:text-3xl lg:text-4xl font-bold">
                          {dashboard?.resumo.total_veiculos || 0}
                        </span>
                        <span className="text-xs md:text-sm font-mono text-violet-200">
                          veículos
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1">
                      <span className="text-xs font-medium">↗ +12%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs md:text-sm">
                      <span className="text-violet-200">Meta: 240</span>
                      <span className="font-medium">{Math.round(((dashboard?.resumo.total_veiculos || 0) / 240) * 100)}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-white to-violet-200 h-1.5 rounded-full transition-all duration-1000 ease-out"
                        style={{width: `${Math.min(((dashboard?.resumo.total_veiculos || 0) / 240) * 100, 100)}%`}}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Valor do Inventário Compacto */}
              <div className="bg-gradient-to-br from-cyan-400 via-blue-500 to-cyan-600 rounded-2xl p-4 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-cyan-100 text-xs font-mono uppercase tracking-wider">
                      Valor
                    </p>
                    <span className="text-xs font-mono bg-white/20 backdrop-blur-sm rounded px-1.5 py-0.5">
                      ↗ +8%
                    </span>
                  </div>
                  
                  <p className="text-lg md:text-xl font-bold truncate leading-tight">
                    {formatCurrency(dashboard?.resumo.valor_total || 0)}
                  </p>
                </div>
              </div>

              {/* Disponíveis Compacto */}
              <div className="bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 rounded-2xl p-4 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-emerald-100 text-xs font-mono uppercase tracking-wider">
                      Disponível
                    </p>
                    <span className="text-xs font-mono bg-white/20 backdrop-blur-sm rounded px-1.5 py-0.5">
                      ↗ +5%
                    </span>
                  </div>
                  
                  <div className="flex items-baseline space-x-1">
                    <p className="text-2xl md:text-3xl font-bold">
                      {dashboard?.resumo.por_status.disponivel || 0}
                    </p>
                    <span className="text-xs font-mono text-emerald-200">un</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Summary Cards Compactos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {/* Reservados Compacto */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                      R
                    </span>
                    <div>
                      <p className="text-amber-600 text-xs font-mono uppercase tracking-wider">
                        Reservados
                      </p>
                      <p className="text-xl md:text-2xl font-bold text-gray-800">
                        {dashboard?.resumo.por_status.reservado || 0}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-xs font-mono text-red-600">
                      ↘ -3%
                    </span>
                  </div>
                </div>
                
                <div className="w-full bg-amber-200/50 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-amber-400 to-orange-500 h-1.5 rounded-full transition-all duration-1000 ease-out"
                    style={{width: `${Math.min(((dashboard?.resumo.por_status.reservado || 0) / (dashboard?.resumo.total_veiculos || 1)) * 100, 100)}%`}}
                  />
                </div>
              </div>

              {/* Vendidos Compacto */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-4 border border-gray-200/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 bg-gradient-to-br from-gray-400 to-slate-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                      V
                    </span>
                    <div>
                      <p className="text-gray-600 text-xs font-mono uppercase tracking-wider">
                        Vendidos
                      </p>
                      <p className="text-xl md:text-2xl font-bold text-gray-800">
                        {dashboard?.resumo.por_status.vendido || 0}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-xs font-mono text-emerald-600">
                      ↗ +15%
                    </span>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200/50 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-gray-400 to-slate-500 h-1.5 rounded-full transition-all duration-1000 ease-out"
                    style={{width: `${Math.min(((dashboard?.resumo.por_status.vendido || 0) / (dashboard?.resumo.total_veiculos || 1)) * 100, 100)}%`}}
                  />
                </div>
              </div>
            </div>
          </div>


          {/* Seção de Busca Editorial Sofisticada */}
          <div data-section="search" className="my-12 lg:my-16 group">
            <div className={`relative flex items-center space-x-4 lg:space-x-6 py-8 border-b-2 transition-all duration-300 ${
              isSearchFocused 
                ? 'border-gradient-to-r from-purple-400 via-cyan-400 to-pink-400' 
                : 'border-gray-200 group-hover:border-purple-200'
            }`}>
              {/* Search icon with glow */}
              <div className="relative">
                <span className="font-mono text-xs text-gray-400 uppercase tracking-widest whitespace-nowrap group-hover:text-purple-500 transition-colors">
                  Buscar
                </span>
                {isSearchFocused && (
                  <div className="absolute inset-0 bg-purple-400 blur-md opacity-20 animate-pulse" />
                )}
              </div>
              
              {/* Enhanced search input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Digite o nome da marca..."
                  className={`w-full text-lg lg:text-xl font-light bg-transparent border-none outline-none placeholder-gray-400 py-2 transition-all duration-300 ${
                    isSearchFocused ? 'text-purple-700 placeholder-purple-300' : 'text-gray-900'
                  }`}
                />
                
                {/* Search feedback */}
                {searchTerm && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                    <div className="flex items-center space-x-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                      <span>{marcasFiltradas.length}</span>
                      <span>resultado{marcasFiltradas.length !== 1 ? 's' : ''}</span>
                    </div>
                    <button
                      onClick={() => setSearchTerm('')}
                      className="w-10 h-10 md:w-6 md:h-6 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
                      style={{ minHeight: '44px', minWidth: '44px' }}
                    >
                      <Minus className="w-4 h-4 md:w-3 md:h-3" />
                    </button>
                  </div>
                )}
                
                {/* Typing indicator */}
                {isSearchFocused && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 animate-pulse" />
                )}
              </div>
            </div>
            
            {/* Search suggestions */}
            {isSearchFocused && !searchTerm && (
              <div className="mt-4 p-4 bg-gradient-to-r from-violet-500/10 to-cyan-400/10 rounded-lg border border-violet-400/20">
                <p className="text-sm text-gray-600 mb-2 font-medium">Sugestões:</p>
                <div className="flex flex-wrap gap-2">
                  {dashboard?.hierarquia?.slice(0, 4).map((item, i) => (
                    <button
                      key={i}
                      onClick={() => setSearchTerm(item.marca)}
                      className="px-4 py-3 md:px-3 md:py-1 bg-white text-violet-500 rounded-full text-sm md:text-xs hover:bg-violet-500/10 hover:shadow-sm transition-all duration-200 border border-violet-400/30 active:scale-95"
                      style={{ minHeight: '44px' }}
                    >
                      {item.marca}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Lista de Marcas Editorial */}
          <EditorialSection
            titulo="Inventário por Marca"
            numero="03"
            color="neon"
          >
            <NewEditorialList
              items={marcasFiltradas}
              isLoading={isLoading}
            />
          </EditorialSection>
        </EditorialGrid>
      </main>

      {/* Footer Editorial Sofisticado */}
      <footer className="relative border-t border-gradient-to-r from-purple-100 via-transparent to-cyan-100 mt-16 lg:mt-24 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-transparent to-cyan-50/20" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-violet-500 via-cyan-400 to-fuchsia-500" />
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start lg:items-center">
            {/* Left side - Brand info */}
            <div className="col-span-1 lg:col-span-8 space-y-3">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-cyan-400 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">V8</span>
                  </div>
                  <p className="font-mono text-sm text-gray-600 uppercase tracking-widest">
                    System — Automotive Inventory
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500 max-w-md">
                Plataforma inteligente para gestão automotiva com analytics avançado
              </p>
            </div>

            {/* Right side - Status and timestamp */}
            <div className="col-span-1 lg:col-span-4 flex flex-col lg:items-end space-y-3">
              <div className="text-left lg:text-right space-y-1">
                <p className="font-mono text-xs text-gray-400 uppercase tracking-wider">
                  Última atualização
                </p>
                <p className="font-mono text-sm text-gray-600 font-medium">
                  {new Date().toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              
              {/* Status indicator */}
              <div className="flex items-center space-x-2 px-3 py-2 bg-emerald-50 rounded-full border border-emerald-200 lg:ml-auto">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse-dot" />
                <span className="text-xs font-mono text-emerald-700 font-medium uppercase tracking-wide">
                  Online
                </span>
              </div>
            </div>
          </div>
          
          {/* Performance stats */}
          <div className="mt-8 pt-8 border-t border-gray-100/50 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-lg font-light text-violet-500">{dashboard?.resumo.total_veiculos || 0}</p>
              <p className="text-xs font-mono text-gray-500 uppercase tracking-wider">Veículos</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-light text-cyan-400">{dashboard?.hierarquia?.length || 0}</p>
              <p className="text-xs font-mono text-gray-500 uppercase tracking-wider">Marcas</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-light text-fuchsia-500">{dashboard?.resumo.por_status.reservado || 0}</p>
              <p className="text-xs font-mono text-gray-500 uppercase tracking-wider">Reservados</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-light text-lime-400">+12%</p>
              <p className="text-xs font-mono text-gray-500 uppercase tracking-wider">Crescimento</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Modular Menu */}
      <FloatingModularMenu
        onAction={handleMenuAction}
        onRefresh={onRefresh || (() => {})}
        setShowMobileSearch={setShowMobileSearch}
      />

      {/* Mobile Search Overlay */}
      <MobileSearchOverlay
        isOpen={showMobileSearch}
        onClose={() => setShowMobileSearch(false)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        suggestions={dashboard?.hierarquia || []}
        onSuggestionClick={(marca) => {
          setSearchTerm(marca);
          // setActiveSection('search'); // unused
        }}
      />
    </div>
  );
}