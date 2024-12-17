import React, { useEffect, useState } from 'react';
import { MLBGame, mlbApi } from '@/services/mlbApi';
import { format } from 'date-fns';

interface SeasonStats {
  season: number;
  games: MLBGame[];
}

const MLBHistory = () => {
  const [loading, setLoading] = useState(true);
  const [seasons, setSeasons] = useState<SeasonStats[]>([]);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const results = await mlbApi.getLast5YearsStats();
        const currentYear = new Date().getFullYear();
        
        const formattedSeasons = results.map((result, index) => ({
          season: currentYear - index,
          games: result.dates.flatMap(date => date.games)
        }));

        setSeasons(formattedSeasons);
      } catch (error) {
        console.error('Error fetching historical data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="sticky top-0 bg-[#2a2a2a] border-b border-gray-800 p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">MLB History</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {seasons.map((season) => (
              <div key={season.season} className="bg-[#2a2a2a] rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">{season.season} Season</h2>
                <div className="grid gap-4">
                  {season.games.slice(0, 10).map((game) => (
                    <div key={game.gamePk} className="flex items-center justify-between p-4 bg-[#333333] rounded">
                      <div>
                        <div className="text-sm text-gray-400">
                          {format(new Date(game.gameDate), 'MMM d, yyyy')}
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{game.teams.home.team.name}</span>
                            <span>{game.teams.home.score}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{game.teams.away.team.name}</span>
                            <span>{game.teams.away.score}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-gray-400">
                        {game.venue.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MLBHistory; 