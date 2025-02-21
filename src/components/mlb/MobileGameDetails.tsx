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
  hits?: {
    home: number;
    away: number;
  };
  errors?: {
    home: number;
    away: number;
  };
  startTime: string;
  status: 'scheduled' | 'live' | 'finished';
}

interface MobileGameDetailsProps {
  game: GameDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileGameDetails({ game, isOpen, onClose }: MobileGameDetailsProps) {
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

  if (!isVisible || !game) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      {/* Content */}
      <div 
        className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-lg max-h-[90vh] overflow-y-auto"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag Handle */}
        <div className="sticky top-0 pt-3 pb-2 bg-white/95 backdrop-blur-sm z-10">
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto" />
        </div>

        {/* Game Details Card */}
        <div className="p-4">
          <GameDetailsCard {...game} />
        </div>
      </div>
    </div>
  );
} 