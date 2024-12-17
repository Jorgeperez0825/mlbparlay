import { useState } from 'react';
import { useRouter } from 'next/router';
import { MainLayout } from '@/components/layouts/MainLayout';
import { METRIC_CATEGORIES } from '@/constants/metrics';
import Image from 'next/image';
import { sampleGames } from '@/data/sampleGames';
import { AnalysisResult } from '@/components/analytics/AnalysisResult';
import { ParlayModal } from '@/components/analytics/ParlayModal';
import { ParlayBar } from '@/components/analytics/ParlayBar';

// Datos de ejemplo para los lineups
const lineups = {
  away: [
    { id: 1, name: "DJ LeMahieu", position: "2B", bats: "R", avg: ".278", hr: "12", rbi: "45" },
    { id: 2, name: "Aaron Judge", position: "RF", bats: "R", avg: ".312", hr: "35", rbi: "87" },
    { id: 3, name: "Juan Soto", position: "LF", bats: "L", avg: ".298", hr: "28", rbi: "92" },
    { id: 4, name: "Giancarlo Stanton", position: "DH", bats: "R", avg: ".245", hr: "24", rbi: "68" },
    { id: 5, name: "Anthony Rizzo", position: "1B", bats: "L", avg: ".267", hr: "18", rbi: "55" },
    { id: 6, name: "Gleyber Torres", position: "SS", bats: "R", avg: ".289", hr: "15", rbi: "52" },
    { id: 7, name: "Alex Verdugo", position: "CF", bats: "L", avg: ".272", hr: "8", rbi: "38" },
    { id: 8, name: "Jose Trevino", position: "C", bats: "R", avg: ".245", hr: "6", rbi: "28" },
    { id: 9, name: "Oswald Peraza", position: "3B", bats: "R", avg: ".255", hr: "4", rbi: "22" }
  ],
  home: [
    { id: 10, name: "Brandon Nimmo", position: "CF", bats: "L", avg: ".285", hr: "14", rbi: "48" },
    { id: 11, name: "Francisco Lindor", position: "SS", bats: "S", avg: ".298", hr: "25", rbi: "85" },
    { id: 12, name: "Pete Alonso", position: "1B", bats: "R", avg: ".278", hr: "42", rbi: "108" },
    { id: 13, name: "Jeff McNeil", position: "2B", bats: "L", avg: ".312", hr: "8", rbi: "52" },
    { id: 14, name: "Starling Marte", position: "RF", bats: "R", avg: ".292", hr: "16", rbi: "58" },
    { id: 15, name: "Daniel Vogelbach", position: "DH", bats: "L", avg: ".245", hr: "18", rbi: "45" },
    { id: 16, name: "Brett Baty", position: "3B", bats: "L", avg: ".248", hr: "12", rbi: "42" },
    { id: 17, name: "Omar Narváez", position: "C", bats: "L", avg: ".238", hr: "5", rbi: "25" },
    { id: 18, name: "Mark Canha", position: "LF", bats: "R", avg: ".268", hr: "10", rbi: "38" }
  ],
  pitchers: {
    away: { id: 19, name: "Gerrit Cole", throws: "R", record: "12-4", era: "2.95", so: "185" },
    home: { id: 20, name: "Kodai Senga", throws: "R", record: "10-6", era: "3.12", so: "168" }
  }
};

interface Bet {
  type: string;
  description: string;
  odds: string;
  game: string;
}

export default function GameAnalysis() {
  const router = useRouter();
  const { gameId } = router.query;
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['strikeout_props']);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [parlayBets, setParlayBets] = useState<Bet[]>([]);
  const [isParlayModalOpen, setIsParlayModalOpen] = useState(false);
  const [isAnalysisPanelOpen, setIsAnalysisPanelOpen] = useState(true);

  // Encontrar el juego en los datos de ejemplo
  const game = sampleGames.find(g => g.gamePk.toString() === gameId);

  const addToParlayHandler = (bet: Bet) => {
    setParlayBets(prev => [...prev, bet]);
  };

  const removeBetHandler = (index: number) => {
    setParlayBets(prev => prev.filter((_, i) => i !== index));
  };

  // Función de prueba para agregar una apuesta
  const addTestBet = () => {
    const newBet = {
      type: 'Over/Under',
      description: 'Aaron Judge Over 1.5 Strikeouts',
      odds: '-110',
      game: 'NYY vs BOS'
    };
    addToParlayHandler(newBet);
  };

  if (!game) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-500">Game not found</p>
        </div>
      </MainLayout>
    );
  }

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metricId)
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(prev => prev === categoryId ? null : categoryId);
  };

  const getSelectedMetricDetails = (metricId: string) => {
    for (const category of METRIC_CATEGORIES) {
      const metric = category.metrics.find(m => m.id === metricId);
      if (metric) {
        return metric;
      }
    }
    return null;
  };

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-4rem)] pb-6">
        {/* Main Content */}
        <div className={`flex-1 overflow-auto p-6 transition-all duration-300 ${
          isAnalysisPanelOpen ? 'pr-96' : 'pr-12'
        }`}>
          {/* Game Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-3 gap-4 items-center">
              {/* Away Team */}
              <div className="flex items-center space-x-4">
                <Image
                  src={`https://www.mlbstatic.com/team-logos/${game.teams.away.team.id}.svg`}
                  alt={game.teams.away.team.name}
                  width={64}
                  height={64}
                  className="object-contain"
                />
                <div>
                  <div className="font-bold text-xl">{game.teams.away.team.name}</div>
                  <div className="text-sm text-gray-500">
                    ({game.teams.away.leagueRecord.wins}-{game.teams.away.leagueRecord.losses})
                  </div>
                </div>
              </div>

              {/* VS */}
              <div className="text-center">
                <div className="text-3xl font-bold text-[#E31837]">VS</div>
                <div className="text-sm text-gray-500 mt-2">{game.venue.name}</div>
              </div>

              {/* Home Team */}
              <div className="flex items-center justify-end space-x-4">
                <div className="text-right">
                  <div className="font-bold text-xl">{game.teams.home.team.name}</div>
                  <div className="text-sm text-gray-500">
                    ({game.teams.home.leagueRecord.wins}-{game.teams.home.leagueRecord.losses})
                  </div>
                </div>
                <Image
                  src={`https://www.mlbstatic.com/team-logos/${game.teams.home.team.id}.svg`}
                  alt={game.teams.home.team.name}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Botón de prueba para agregar apuestas */}
          <button
            onClick={addTestBet}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Test Bet
          </button>

          {/* Betting Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Money Line */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Money Line</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>{game.teams.away.team.name}</span>
                  <span className="font-semibold text-[#041E42]">+150</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{game.teams.home.team.name}</span>
                  <span className="font-semibold text-[#041E42]">-170</span>
                </div>
              </div>
            </div>

            {/* Run Line */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Run Line</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>{game.teams.away.team.name} +1.5</span>
                  <span className="font-semibold text-[#041E42]">-130</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{game.teams.home.team.name} -1.5</span>
                  <span className="font-semibold text-[#041E42]">+110</span>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Total (8.5)</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Over 8.5</span>
                  <span className="font-semibold text-[#041E42]">-110</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Under 8.5</span>
                  <span className="font-semibold text-[#041E42]">-110</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lineups */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Away Team Lineup */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {game.teams.away.team.name} Lineup
                </h3>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-blue-50 rounded-full">
                    <span className="text-sm text-blue-600 font-medium">
                      SP: {lineups.pitchers.away.name} ({lineups.pitchers.away.record})
                    </span>
                  </div>
                </div>
              </div>
              <div className="overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">POS</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">PLAYER</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">B</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">AVG</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">HR</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">RBI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {lineups.away.map((player) => (
                      <tr 
                        key={player.id}
                        onClick={() => setSelectedPlayer(player.id)}
                        className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedPlayer === player.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <td className="px-4 py-2 text-sm">{player.position}</td>
                        <td className="px-4 py-2 text-sm font-medium">{player.name}</td>
                        <td className="px-4 py-2 text-sm text-center">{player.bats}</td>
                        <td className="px-4 py-2 text-sm text-center">{player.avg}</td>
                        <td className="px-4 py-2 text-sm text-center">{player.hr}</td>
                        <td className="px-4 py-2 text-sm text-center">{player.rbi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Home Team Lineup */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {game.teams.home.team.name} Lineup
                </h3>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-blue-50 rounded-full">
                    <span className="text-sm text-blue-600 font-medium">
                      SP: {lineups.pitchers.home.name} ({lineups.pitchers.home.record})
                    </span>
                  </div>
                </div>
              </div>
              <div className="overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">POS</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">PLAYER</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">B</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">AVG</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">HR</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">RBI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {lineups.home.map((player) => (
                      <tr 
                        key={player.id}
                        onClick={() => setSelectedPlayer(player.id)}
                        className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedPlayer === player.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <td className="px-4 py-2 text-sm">{player.position}</td>
                        <td className="px-4 py-2 text-sm font-medium">{player.name}</td>
                        <td className="px-4 py-2 text-sm text-center">{player.bats}</td>
                        <td className="px-4 py-2 text-sm text-center">{player.avg}</td>
                        <td className="px-4 py-2 text-sm text-center">{player.hr}</td>
                        <td className="px-4 py-2 text-sm text-center">{player.rbi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Player Props Analysis */}
          {selectedPlayer && selectedMetrics.includes('strikeout_props') && (
            <div className="mb-6">
              <AnalysisResult 
                metric={getSelectedMetricDetails('strikeout_props')!}
                game={game}
              />
            </div>
          )}
        </div>

        {/* Botón flotante cuando el panel está cerrado */}
        {!isAnalysisPanelOpen && (
          <button
            onClick={() => setIsAnalysisPanelOpen(true)}
            className="fixed right-0 top-24 bg-[#041E42] text-white px-3 py-4 rounded-l-lg shadow-lg hover:bg-[#002D72] transition-colors group"
          >
            <div className="flex flex-col items-center gap-2">
              <svg
                className="w-5 h-5 transform transition-transform group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span className="writing-mode-vertical text-xs font-medium tracking-wide">Analysis Tools</span>
            </div>
          </button>
        )}

        {/* Analysis Sidebar */}
        <div 
          className={`fixed right-0 top-16 h-[calc(100vh-4rem)] bg-white border-l border-gray-200 
            overflow-y-auto transition-all duration-300 shadow-lg ${
            isAnalysisPanelOpen ? 'w-96 translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header con gradiente */}
          <div className="bg-gradient-to-r from-[#041E42] to-[#002D72] px-6 py-4 sticky top-0 z-10">
            <h2 className="text-lg font-bold text-white">Betting Analysis Tools</h2>
          </div>

          {/* Botón para colapsar mejorado */}
          <button
            onClick={() => setIsAnalysisPanelOpen(false)}
            className="absolute -left-4 top-4 bg-[#041E42] text-white rounded-full p-2.5 shadow-lg hover:bg-[#002D72] transition-colors group z-20"
          >
            <svg
              className="w-4 h-4 transform transition-transform group-hover:translate-x-0.5"
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

          {/* Contenido del panel */}
          <div className="p-6">
            <div className="space-y-4">
              {METRIC_CATEGORIES.map((category) => (
                <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  {/* Category Header */}
                  <button
                    type="button"
                    className="w-full px-4 py-3 flex items-center justify-between text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <span className="font-medium text-[#041E42]">{category.name}</span>
                    <span className={`text-[#041E42] transition-transform duration-200 ${
                      expandedCategory === category.id ? 'transform rotate-180' : ''
                    }`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>

                  {/* Category Metrics */}
                  {expandedCategory === category.id && (
                    <div className="p-4 space-y-3 bg-white">
                      {category.metrics.map((metric) => (
                        <div
                          key={metric.id}
                          className={`
                            p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                            hover:shadow-md
                            ${selectedMetrics.includes(metric.id)
                              ? 'border-[#041E42] bg-[#041E42] bg-opacity-5'
                              : 'border-gray-200 hover:border-[#041E42]'
                            }
                          `}
                          onClick={() => toggleMetric(metric.id)}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={selectedMetrics.includes(metric.id)}
                              onChange={() => toggleMetric(metric.id)}
                              className="mt-1 h-4 w-4 text-[#041E42] focus:ring-[#041E42] border-gray-300 rounded cursor-pointer"
                            />
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900">{metric.name}</h4>
                              <p className="text-sm text-gray-500 mt-1">{metric.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Parlay Components */}
        <ParlayModal
          isOpen={isParlayModalOpen}
          onClose={() => setIsParlayModalOpen(false)}
          bets={parlayBets}
          onRemoveBet={removeBetHandler}
        />
        <ParlayBar
          bets={parlayBets}
          onOpen={() => setIsParlayModalOpen(true)}
        />
      </div>

      <style jsx>{`
        .writing-mode-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
          transform: rotate(180deg);
        }
      `}</style>
    </MainLayout>
  );
} 