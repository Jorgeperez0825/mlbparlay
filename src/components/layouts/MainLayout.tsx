import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { HomeIcon, TrophyIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Logo } from '@/components/common/Logo';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MAIN_NAVIGATION = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: HomeIcon
  },
  {
    name: 'Parlay',
    path: '/schedule',
    icon: TrophyIcon
  },
  {
    name: 'History',
    path: '/history',
    icon: ClockIcon
  }
];

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-800 flex">
      {/* Sidebar */}
      <div 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-16'
        } bg-gradient-to-b from-[#041E42] to-[#002D72] fixed h-full transition-all duration-300 flex flex-col shadow-xl`}
      >
        {/* Logo section */}
        <div className="h-16 border-b border-[#1A365D]/30 flex justify-between items-center px-4 bg-[#041E42]/50">
          <div className={`${isSidebarOpen ? 'flex-1' : 'w-8'} transition-all duration-300`}>
            <Logo />
          </div>
          <div className={`flex-shrink-0 ${isSidebarOpen ? 'ml-8' : 'absolute -right-3'}`}>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-all duration-200"
            >
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${!isSidebarOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className={`${isSidebarOpen ? 'px-3' : 'px-2'} py-4 flex-1`}>
          <ul className="space-y-1">
            {MAIN_NAVIGATION.map((item) => (
              <li key={item.path}>
                <Link 
                  href={item.path}
                  className={`flex items-center ${
                    isSidebarOpen 
                      ? 'gap-3 px-3 py-2.5' 
                      : 'justify-center p-2.5'
                  } rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-all duration-200 group relative`}
                  title={!isSidebarOpen ? item.name : undefined}
                >
                  <item.icon className={`h-5 w-5 transition-transform duration-200 group-hover:scale-105`} />
                  {isSidebarOpen ? (
                    <span className="font-medium">{item.name}</span>
                  ) : (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-[#041E42] rounded-md invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all whitespace-nowrap z-50 shadow-lg">
                      <span className="font-medium">{item.name}</span>
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className={`${isSidebarOpen ? 'px-3' : 'px-2'} py-4 border-t border-[#1A365D]/30`}>
          <div className={`rounded-lg bg-white/5 ${isSidebarOpen ? 'p-3' : 'p-2'}`}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#E31837] flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-white">JD</span>
              </div>
              {isSidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">John Doe</p>
                  <p className="text-xs text-white/60 truncate">john.doe@example.com</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div 
        className={`${
          isSidebarOpen ? 'ml-64' : 'ml-16'
        } flex-1 transition-all duration-300`}
      >
        {/* Top Bar */}
        <div className="sticky top-0 bg-[#041E42] border-b border-[#1A365D] h-16">
          <div className="flex justify-between items-center h-full px-4">
            <div className="flex items-center gap-4">
              {/* Controles izquierdos si los necesitas */}
            </div>
            
            {/* Barra de búsqueda central */}
            <div className="flex-1 max-w-lg mx-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-full px-3 py-1.5 bg-[#002D72] text-white text-sm rounded-md
                             placeholder-gray-400 focus:outline-none focus:ring-1
                             focus:ring-[#E31837] border border-[#1A365D]"
                />
                <button className="absolute right-2.5 top-1/2 -translate-y-1/2">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Icono de notificaciones */}
              <button className="relative p-1.5 text-white hover:bg-[#002D72] rounded-lg transition-colors">
                <svg 
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                
                {/* Indicador de notificaciones */}
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-[#E31837] rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">3</span>
                </span>
              </button>
              
              {/* Perfil de usuario */}
              <div className="relative" ref={profileMenuRef}>
                <button 
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1.5 text-white hover:bg-[#002D72] rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#E31837] flex items-center justify-center">
                    <span className="text-sm font-semibold">JD</span>
                  </div>
                  <svg 
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Menú desplegable del perfil */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-semibold text-gray-900">John Doe</p>
                      <p className="text-xs text-gray-500">john.doe@example.com</p>
                    </div>
                    
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <svg 
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span>Mi Perfil</span>
                    </Link>
                    
                    <div className="border-t">
                      <button 
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <svg 
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span>Cerrar sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}; 