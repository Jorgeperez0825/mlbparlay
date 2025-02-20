'use client';

import { useEffect, useState } from 'react';
import GameDetailsCard from './GameDetailsCard';

interface Team {
  code: string;
  name: string;
  score?: number;
}

interface MobileGameDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGame?: {
    homeTeam: Team;
    awayTeam: Team;
    inning: number;
    hits: {
      home: number;
      away: number;
    };
    errors: {
      home: number;
      away: number;
    };
    startTime: string;
    status: 'scheduled' | 'live' | 'finished';
  };
}

export default function MobileGameDetails({ isOpen, onClose, selectedGame }: MobileGameDetailsProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div className="md:hidden fixed inset-0 z-50">
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
        onClick={onClose}
      />
      <div 
        className={`absolute inset-x-0 bottom-0 transform transition-all duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{
          maxHeight: 'calc(100vh - 2rem)',
          height: '85vh'
        }}
      >
        <div className="bg-white rounded-t-2xl h-full flex flex-col">
          {/* Drag Handle */}
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm pt-3 pb-2 px-4 rounded-t-2xl border-b border-[var(--border-color)]">
            <div className="flex justify-center mb-1">
              <div className="w-12 h-1 rounded-full bg-gray-200"></div>
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Game Details</h3>
              <button 
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-[var(--text-secondary)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {selectedGame && <GameDetailsCard {...selectedGame} />}
          </div>
        </div>
      </div>
    </div>
  );
} 