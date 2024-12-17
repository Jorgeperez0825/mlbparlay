import { useState } from 'react';
import { MLBGame } from '@/services/mlbApi';
import { CreateParlayModal } from '@/components/modals/CreateParlayModal';

interface BettingAnalysisProps {
  game: MLBGame;
}

export const BettingAnalysis = ({ game }: BettingAnalysisProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-8 py-4 bg-[#041E42] text-white text-lg font-bold rounded-lg
                 hover:bg-[#E31837] transition-all duration-200 
                 transform hover:scale-105 shadow-lg hover:shadow-xl"
      >
        Create Custom Parlay
      </button>

      <CreateParlayModal
        game={game}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}; 