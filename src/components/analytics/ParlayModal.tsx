import React from 'react';
import { Modal } from '../common/Modal';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Bet {
  type: string;
  description: string;
  odds: string;
  game: string;
}

interface ParlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  bets: Bet[];
  onRemoveBet: (index: number) => void;
}

export const ParlayModal = ({ isOpen, onClose, bets, onRemoveBet }: ParlayModalProps) => {
  const calculateParlayOdds = (odds: string[]): number => {
    // Convert American odds to decimal and multiply
    const decimalOdds = odds.map(odd => {
      const num = parseInt(odd);
      return num > 0 ? (num / 100) + 1 : (100 / Math.abs(num)) + 1;
    });
    
    const totalOdds = decimalOdds.reduce((acc, curr) => acc * curr, 1);
    
    // Convert back to American odds
    return totalOdds > 2 
      ? ((totalOdds - 1) * 100) 
      : (-100 / (totalOdds - 1));
  };

  const totalOdds = bets.length > 0 ? calculateParlayOdds(bets.map(bet => bet.odds)) : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Your Parlay">
      <div className="space-y-6">
        {/* Bets List */}
        <div className="space-y-4">
          {bets.map((bet, index) => (
            <div 
              key={index} 
              className="bg-gray-50 rounded-lg p-4 flex items-start justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {bet.type}
                  </span>
                  <span className="text-sm text-gray-500">{bet.game}</span>
                </div>
                <p className="mt-2 text-gray-900 font-medium">{bet.description}</p>
                <div className="mt-1 text-sm text-gray-500">Odds: {bet.odds}</div>
              </div>
              <button
                onClick={() => onRemoveBet(index)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Parlay Summary */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Number of Legs:</span>
            <span className="font-medium">{bets.length}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Total Odds:</span>
            <span className="font-medium text-[#041E42]">
              {totalOdds > 0 ? '+' : ''}{Math.round(totalOdds)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Potential Payout:</span>
            <span className="font-bold text-lg text-[#041E42]">
              ${((totalOdds > 0 ? totalOdds / 100 : -100 / totalOdds) * 10).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Continue Building
          </button>
          <button
            className="flex-1 px-4 py-2 bg-[#041E42] text-white rounded-lg hover:bg-[#E31837] transition-colors"
          >
            Save Parlay
          </button>
        </div>
      </div>
    </Modal>
  );
}; 