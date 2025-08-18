'use client';

import { ReactNode } from 'react';

type ModuleTheme = 'overview' | 'estoque' | 'whatsleads' | 'vendedores';

interface ModularLayoutProps {
  children: ReactNode;
  theme: ModuleTheme;
  className?: string;
}

// Configurações de tema por módulo
const moduleThemes = {
  overview: {
    name: 'Overview',
    background: 'bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20',
    accent: 'from-blue-500 via-indigo-600 to-blue-700',
    color: 'blue'
  },
  estoque: {
    name: 'Estoque',
    background: 'bg-gradient-to-br from-emerald-50/30 via-white to-green-50/20',
    accent: 'from-emerald-500 via-green-600 to-emerald-700',
    color: 'emerald'
  },
  whatsleads: {
    name: 'WhatsLeads',
    background: 'bg-gradient-to-br from-green-50/30 via-white to-emerald-50/20',
    accent: 'from-green-400 via-emerald-500 to-green-600',
    color: 'green'
  },
  vendedores: {
    name: 'Vendedores',
    background: 'bg-gradient-to-br from-purple-50/30 via-white to-violet-50/20',
    accent: 'from-purple-500 via-violet-600 to-purple-700',
    color: 'purple'
  }
};

export function ModularLayout({ children, theme, className = '' }: ModularLayoutProps) {
  const currentTheme = moduleThemes[theme];

  return (
    <div className={`min-h-screen ${currentTheme.background} text-gray-900 ${className}`}>
      {/* CSS Variables para tema dinâmico */}
      <style jsx global>{`
        :root {
          --module-color: ${currentTheme.color};
          --module-accent: ${currentTheme.accent};
        }
        
        .module-gradient {
          background: linear-gradient(to right, var(--module-accent));
        }
        
        .module-border {
          border-color: rgb(var(--module-color-500) / 0.3);
        }
        
        .module-shadow {
          box-shadow: 0 10px 25px -5px rgb(var(--module-color-500) / 0.1);
        }
      `}</style>
      
      {children}
    </div>
  );
}

// Layout específico para cada módulo
export function OverviewLayout({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <ModularLayout theme="overview" className={className}>
      {children}
    </ModularLayout>
  );
}

export function EstoqueLayout({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <ModularLayout theme="estoque" className={className}>
      {children}
    </ModularLayout>
  );
}

export function WhatsLeadsLayout({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <ModularLayout theme="whatsleads" className={className}>
      {children}
    </ModularLayout>
  );
}

export function VendedoresLayout({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <ModularLayout theme="vendedores" className={className}>
      {children}
    </ModularLayout>
  );
}