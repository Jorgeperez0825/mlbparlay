'use client';

import { useEffect, useState } from 'react';
import GameDetailsCard from './GameDetailsCard';

interface Team {
  code: string;
  name: string;
  score: number;
}

interface GameDetails {
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
}

interface MobileGameDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGame: GameDetails | null;
}

export default function MobileGameDetails({ isOpen, onClose, selectedGame }: MobileGameDetailsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Restore body scroll when modal is closed
        document.body.style.overflow = 'unset';
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchEnd - touchStart;
    const isDownSwipe = distance > 100;
    if (isDownSwipe) {
      onClose();
    }
    // Reset values
    setTouchStart(0);
    setTouchEnd(0);
  };

  if (!isVisible) return null;

  return (
    <div className="md:hidden fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div 
        className={`absolute inset-x-0 bottom-0 transform transition-all duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{
          maxHeight: 'calc(100vh - env(safe-area-inset-top) - 1rem)',
          height: '85vh',
          paddingBottom: 'env(safe-area-inset-bottom)'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="bg-white rounded-t-2xl h-full flex flex-col overflow-hidden">
          {/* Drag Handle and Header */}
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm pt-2 pb-1.5 px-4 rounded-t-2xl border-b border-[var(--border-color)]">
            <div className="flex justify-center mb-1.5">
              <div className="w-10 h-1 rounded-full bg-gray-200"></div>
            </div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold">Game Details</h3>
              <button 
                onClick={onClose}
                className="p-1.5 -m-1.5 rounded-lg hover:bg-gray-100 active:bg-gray-200 text-[var(--text-secondary)] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-3">
            {selectedGame && <GameDetailsCard {...selectedGame} />}
          </div>
        </div>
      </div>
    </div>
  );
} 