"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, HardHat, Package, UserCheck, Factory, ClipboardCheck, ScrollText, Menu } from 'lucide-react';

export default function Sidebar() {
  const [isMinimized, setIsMinimized] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/') {
      setIsMinimized(false);
      localStorage.setItem('sidebarMinimized', 'false');
    } else {
      const timer = setTimeout(() => {
        setIsMinimized(true);
        localStorage.setItem('sidebarMinimized', 'true');
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const handleItemClick = () => {
  };

  const handleToggleSidebar = () => {
    const newState = !isMinimized;
    setIsMinimized(newState);
    localStorage.setItem('sidebarMinimized', newState.toString());
  };

  // Determina a altura baseada na rota atual
  const sidebarHeight = pathname === '/' ? 'h-[90vh]' : 'min-h-screen';

  return (
    <aside 
      className={`${isMinimized ? 'w-16' : 'w-48'} text-white p-4 ${sidebarHeight} flex flex-col transition-all duration-300 ease-in-out`} 
      style={{ background: '#2E2E2E' }}
    >
      {isMinimized ? (
        <div className="flex flex-col items-center">
          <button
            onClick={handleToggleSidebar}
            className="p-2 rounded-md transition-colors"
            style={{ transition: 'background-color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#343434'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            title="Expandir menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <nav className="flex-grow flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold pl-4">Menu</h2>
            <button
              onClick={handleToggleSidebar}
              className="p-2 rounded-md transition-colors"
              style={{ transition: 'background-color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#343434'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              title="Minimizar menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
          <ul className="flex-grow overflow-auto space-y-2 hide-scrollbar">
            <li>
              <Link 
                href="/obras" 
                className="flex items-center gap-2 py-2 px-4 rounded-md transition-colors"
                style={{ transition: 'background-color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#343434'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onClick={handleItemClick}
              >
                <Building2 className="w-5 h-5" />
                Obras
              </Link>
            </li>
            <li>
              <Link 
                href="/equipamentos" 
                className="flex items-center gap-2 py-2 px-4 rounded-md transition-colors"
                style={{ transition: 'background-color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#343434'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onClick={handleItemClick}
              >
                <HardHat className="w-5 h-5" />
                Equipamentos
              </Link>
            </li>
            <li>
              <Link 
                href="/materiais" 
                className="flex items-center gap-2 py-2 px-4 rounded-md transition-colors"
                style={{ transition: 'background-color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#343434'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onClick={handleItemClick}
              >
                <Package className="w-5 h-5" />
                Materiais
              </Link>
            </li>
            <li>
              <Link 
                href="/fornecedores" 
                className="flex items-center gap-2 py-2 px-4 rounded-md transition-colors"
                style={{ transition: 'background-color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#343434'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onClick={handleItemClick}
              >
                <Factory className="w-5 h-5" />
                Fornecedores
              </Link>
            </li>
            <li>
              <Link 
                href="/fiscalizacoes" 
                className="flex items-center gap-2 py-2 px-4 rounded-md transition-colors"
                style={{ transition: 'background-color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#343434'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onClick={handleItemClick}
              >
                <ClipboardCheck className="w-5 h-5" />
                Fiscalizações
              </Link>
            </li>
            <li>
              <Link 
                href="/responsaveis-tecnicos" 
                className="flex items-center gap-2 py-2 px-4 rounded-md transition-colors"
                style={{ transition: 'background-color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#343434'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onClick={handleItemClick}
              >
                <UserCheck className="w-7 h-7" />
                Responsáveis Técnicos
              </Link>
            </li>
            <li>
              <Link 
                href="/relatorios" 
                className="flex items-center gap-2 py-2 px-4 rounded-md transition-colors"
                style={{ transition: 'background-color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#343434'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onClick={handleItemClick}
              >
                <ScrollText className="w-5 h-5" />
                Relatórios
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </aside>
  );
}
