import { useState } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { CalendarIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface BetHistory {
  id: string;
  date: string;
  type: string;
  description: string;
  odds: string;
  amount: number;
  result: 'win' | 'loss' | 'pending';
  payout?: number;
  game: {
    teams: {
      away: string;
      home: string;
    };
    score?: {
      away: number;
      home: number;
    };
  };
}

// Datos de ejemplo - Después los reemplazaremos con datos reales
const SAMPLE_BETS: BetHistory[] = [
  {
    id: '1',
    date: '2024-03-15',
    type: 'Moneyline',
    description: 'Yankees ML',
    odds: '-150',
    amount: 100,
    result: 'win',
    payout: 166.67,
    game: {
      teams: {
        away: 'Yankees',
        home: 'Red Sox'
      },
      score: {
        away: 6,
        home: 3
      }
    }
  },
  {
    id: '2',
    date: '2024-03-16',
    type: 'Run Line',
    description: 'Dodgers -1.5',
    odds: '+120',
    amount: 50,
    result: 'loss',
    game: {
      teams: {
        away: 'Dodgers',
        home: 'Giants'
      },
      score: {
        away: 2,
        home: 3
      }
    }
  },
  {
    id: '3',
    date: '2024-03-20',
    type: 'Total',
    description: 'Over 8.5',
    odds: '-110',
    amount: 75,
    result: 'pending',
    game: {
      teams: {
        away: 'Mets',
        home: 'Braves'
      }
    }
  }
];

const BetCard = ({ bet }: { bet: BetHistory }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-start mb-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {bet.type}
          </span>
          <span className="text-sm text-gray-500">
            {new Date(bet.date).toLocaleDateString()}
          </span>
        </div>
        <h3 className="mt-2 text-lg font-semibold">{bet.description}</h3>
        <p className="text-sm text-gray-500 mt-1">
          {bet.game.teams.away} vs {bet.game.teams.home}
        </p>
      </div>
      <div className="text-right">
        <div className="text-lg font-bold text-[#041E42]">${bet.amount}</div>
        <div className="text-sm text-gray-500">{bet.odds}</div>
      </div>
    </div>

    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {bet.result === 'win' && (
          <>
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-green-600">
              Won ${bet.payout?.toFixed(2)}
            </span>
          </>
        )}
        {bet.result === 'loss' && (
          <>
            <XCircleIcon className="h-5 w-5 text-red-500" />
            <span className="text-sm font-medium text-red-600">
              Lost ${bet.amount}
            </span>
          </>
        )}
        {bet.result === 'pending' && (
          <>
            <CalendarIcon className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium text-yellow-600">
              Pending
            </span>
          </>
        )}
      </div>
      {bet.game.score && (
        <div className="text-sm text-gray-500">
          Final: {bet.game.score.away} - {bet.game.score.home}
        </div>
      )}
    </div>
  </div>
);

const HistoryPage = () => {
  const [bets] = useState<BetHistory[]>(SAMPLE_BETS);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Betting History</h1>
          <p className="mt-2 text-sm text-gray-500">
            Track your past bets and performance
          </p>
        </div>

        <div className="space-y-6">
          {bets.map((bet) => (
            <BetCard key={bet.id} bet={bet} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default HistoryPage; 