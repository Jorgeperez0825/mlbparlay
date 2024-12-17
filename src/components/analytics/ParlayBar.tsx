import React from 'react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';

interface Bet {
  type: string;
  description: string;
  odds: string;
  game: string;
}

interface ParlayBarProps {
  bets: Bet[];
  onOpen: () => void;
}

export const ParlayBar = ({ bets, onOpen }: ParlayBarProps) => {
  if (bets.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50">
      <button
        onClick={onOpen}
        className="bg-[#E31837] text-white rounded-full shadow-lg hover:bg-[#C41230] transition-colors group flex items-center gap-3 px-12 py-3 w-[400px]"
      >
        <div className="flex items-center gap-4 justify-center w-full">
          <div className="bg-white bg-opacity-20 text-sm font-bold px-3 py-1.5 rounded">
            {bets.length}
          </div>
          <span className="font-medium text-lg">View Parlay</span>
          <ChevronUpIcon className="h-6 w-6 transform group-hover:translate-y-[-2px] transition-transform" />
        </div>
      </button>
    </div>
  );
}; 