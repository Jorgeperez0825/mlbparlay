import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { MLBGame, mlbApi } from '@/services/mlbApi';
import { MainLayout } from '@/components/layouts/MainLayout';
import { 
  ChartBarIcon, 
  PresentationChartLineIcon,
  UserGroupIcon,
  CloudIcon,
  ScaleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

const analysisCategories = {
  pitcher: {
    title: 'Pitcher Analysis',
    icon: UserGroupIcon,
    options: [
      { id: 'recent_performance', label: 'Recent Performance', description: 'Last 5 starts analysis' },
      { id: 'head_to_head', label: 'Head-to-Head Stats', description: 'Historical matchup data' },
      { id: 'venue_stats', label: 'Venue Performance', description: 'Stats at current ballpark' },
      { id: 'pitch_metrics', label: 'Pitch Metrics', description: 'Detailed pitch analysis' },
      { id: 'rest_days', label: 'Days Rest Impact', description: 'Performance by rest days' }
    ]
  },
  batting: {
    title: 'Batting Analysis',
    icon: ChartBarIcon,
    options: [
      { id: 'team_trends', label: 'Team Trends', description: 'Recent offensive performance' },
      { id: 'vs_pitcher', label: 'vs Pitcher Stats', description: 'Matchup statistics' },
      { id: 'hot_cold', label: 'Hot/Cold Streaks', description: 'Current hitting trends' },
      { id: 'lineup_analysis', label: 'Lineup Analysis', description: 'Projected lineup impact' },
      { id: 'platoon_splits', label: 'Platoon Splits', description: 'L/R matchup analysis' }
    ]
  },
  advanced: {
    title: 'Advanced Metrics',
    icon: PresentationChartLineIcon,
    options: [
      { id: 'expected_stats', label: 'Expected Stats', description: 'xBA, xSLG, xwOBA analysis' },
      { id: 'park_factors', label: 'Park Factors', description: 'Venue impact analysis' },
      { id: 'win_probability', label: 'Win Probability', description: 'Advanced win metrics' },
      { id: 'weather_impact', label: 'Weather Impact', description: 'Weather effect analysis' },
      { id: 'umpire_trends', label: 'Umpire Trends', description: 'Umpire tendencies' }
    ]
  }
};

interface AnalysisResult {
  category: string;
  title: string;
  confidence: number;
  prediction: string;
  insights: string[];
  trends: {
    label: string;
    value: string;
    trend: 'up' | 'down' | 'neutral';
  }[];
  recommendation: {
    type: 'strong' | 'moderate' | 'weak';
    text: string;
  };
}

export default function GameAnalysis() {
  const router = useRouter();
  const { gameId } = router.query;
  const [game, setGame] = useState<MLBGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [availableGames, setAvailableGames] = useState<MLBGame[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        // Mock games con la estructura correcta de MLBGame
        const mockGames: MLBGame[] = [
          { 
            gamePk: 1,
            teams: { 
              away: { team: { name: 'Minnesota Twins' } }, 
              home: { team: { name: 'Kansas City Royals' } }
            },
            gameDate: new Date().toISOString(),
            venue: { name: 'Kauffman Stadium' },
            weather: { condition: 'Sunny', temp: 75 },
            status: { abstractGameState: 'Preview' }
          },
          { 
            gamePk: 2,
            teams: { 
              away: { team: { name: 'New York Yankees' } }, 
              home: { team: { name: 'Boston Red Sox' } }
            },
            gameDate: new Date().toISOString(),
            venue: { name: 'Fenway Park' },
            weather: { condition: 'Cloudy', temp: 68 },
            status: { abstractGameState: 'Preview' }
          }
        ];
        setAvailableGames(mockGames);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, []);

  useEffect(() => {
    const fetchGame = async () => {
      if (gameId) {
        setLoading(true);
        try {
          // Para desarrollo, usar datos mock si el juego no existe
          const gameData = await mlbApi.getGameById(gameId as string).catch(() => {
            // Si falla la API, usar el primer juego mock como fallback
            return availableGames[0];
          });
          setGame(gameData);
        } catch (error) {
          console.error('Error fetching game:', error);
          // Mostrar mensaje de error al usuario
          setGame(null);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchGame();
  }, [gameId, availableGames]);

  const handleAnalyze = async () => {
    if (selectedOptions.length === 0) return;
    setAnalyzing(true);
    
    // Simulación de resultados
    const mockResults: AnalysisResult[] = [
      {
        category: 'Pitcher Analysis',
        title: 'Starting Pitcher Matchup',
        confidence: 85,
        prediction: "Home team's pitcher has a significant advantage",
        insights: [
          "Away pitcher showing signs of fatigue in last 3 starts",
          "Home pitcher has excellent career numbers against current lineup",
          "Current weather conditions favor home pitcher's style"
        ],
        trends: [
          {
            label: "Strikeout Rate",
            value: "9.8 K/9",
            trend: "up"
          },
          {
            label: "Ground Ball %",
            value: "52%",
            trend: "up"
          },
          {
            label: "Hard Hit %",
            value: "32%",
            trend: "down"
          }
        ],
        recommendation: {
          type: "strong",
          text: "Consider over 6.5 strikeouts for home pitcher"
        }
      },
      {
        category: 'Batting Analysis',
        title: 'Team Offensive Metrics',
        confidence: 72,
        prediction: "Expect moderate to high scoring game",
        insights: [
          "Away team batting .295 vs LHP in last 7 games",
          "Home team leads league in OPS this month",
          "Both teams showing improved plate discipline"
        ],
        trends: [
          {
            label: "Team wOBA",
            value: ".355",
            trend: "up"
          },
          {
            label: "BABIP",
            value: ".310",
            trend: "neutral"
          }
        ],
        recommendation: {
          type: "moderate",
          text: "Consider over 8.5 total runs"
        }
      }
    ];

    setTimeout(() => {
      setAnalysisResults(mockResults);
      setAnalyzing(false);
    }, 2000);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#041E42]"></div>
        </div>
      </MainLayout>
    );
  }

  if (!game) {
    return (
      <MainLayout>
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-80px)]">
          <div className="text-xl text-gray-600 mb-4">No se encontró el juego</div>
          <button
            onClick={() => router.push('/research/' + availableGames[0]?.gamePk)}
            className="px-4 py-2 bg-[#041E42] text-white rounded-lg hover:bg-[#002D72] transition-colors"
          >
            Volver al primer juego disponible
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-screen bg-gray-50">
        {/* Game Selector */}
        <div className="mb-4">
          <select
            value={gameId as string}
            onChange={(e) => router.push(`/research/${e.target.value}`)}
            className="w-full md:w-auto px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-900 focus:ring-[#041E42] focus:border-[#041E42] cursor-pointer"
          >
            {availableGames.map((availableGame) => (
              <option key={availableGame.gamePk} value={availableGame.gamePk}>
                {availableGame.teams.away.team.name} @ {availableGame.teams.home.team.name} - {' '}
                {new Date(availableGame.gameDate).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit'
                })}
              </option>
            ))}
          </select>
        </div>

        {/* Game Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-[#041E42] to-[#002D72] p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {game.teams.away.team.name} @ {game.teams.home.team.name}
                </h1>
                <div className="flex items-center gap-2 text-gray-300 text-sm mt-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span>
                    {new Date(game.gameDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <div className="bg-white/10 rounded-lg px-3 py-2 flex-1 sm:flex-none">
                  <div className="text-xs text-gray-300">Venue</div>
                  <div className="text-sm text-white font-medium truncate">{game.venue.name}</div>
                </div>
                <div className="bg-white/10 rounded-lg px-3 py-2 flex-1 sm:flex-none">
                  <div className="text-xs text-gray-300">Weather</div>
                  <div className="text-sm text-white font-medium">
                    {game.weather?.condition && game.weather?.temp 
                      ? `${game.weather.condition}, ${game.weather.temp}°F`
                      : 'Not available'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Analysis Configuration Panel */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-24 max-h-[calc(100vh-8rem)]">
              <div className="bg-gradient-to-r from-[#041E42] to-[#002D72] p-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <ChartBarIcon className="w-6 h-6" />
                  Analysis Configuration
                </h2>
              </div>
              
              <div className="p-4 space-y-6 divide-y divide-gray-100 overflow-y-auto max-h-[calc(100vh-16rem)]">
                {Object.entries(analysisCategories).map(([key, category]) => (
                  <div key={key} className="pt-6 first:pt-0 space-y-3">
                    <div className="flex items-center gap-2 pb-2">
                      <category.icon className="w-5 h-5 text-[#041E42]" />
                      <h3 className="font-semibold text-lg text-[#041E42]">
                        {category.title}
                      </h3>
                    </div>
                    <div className="space-y-2.5">
                      {category.options.map(option => (
                        <label 
                          key={option.id}
                          className={`
                            flex items-start p-3 rounded-lg cursor-pointer border
                            ${selectedOptions.includes(option.id)
                              ? 'bg-[#041E42]/5 border-[#041E42] shadow-sm'
                              : 'border-gray-200 hover:bg-gray-50'
                            }
                            transition-all duration-200
                          `}
                        >
                          <input
                            type="checkbox"
                            checked={selectedOptions.includes(option.id)}
                            onChange={() => {
                              setSelectedOptions(prev =>
                                prev.includes(option.id)
                                  ? prev.filter(id => id !== option.id)
                                  : [...prev, option.id]
                              );
                            }}
                            className="w-4 h-4 text-[#041E42] rounded border-gray-300 focus:ring-[#041E42] mt-1"
                          />
                          <div className="ml-3 min-w-0">
                            <div className="font-medium text-gray-900">{option.label}</div>
                            <div className="text-sm text-gray-500 line-clamp-2">{option.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="pt-6">
                  <button 
                    onClick={handleAnalyze}
                    disabled={selectedOptions.length === 0 || analyzing}
                    className={`
                      w-full px-6 py-3 rounded-lg font-bold shadow-md
                      transition-all duration-200 flex items-center justify-center gap-2
                      ${selectedOptions.length > 0 && !analyzing
                        ? 'bg-gradient-to-r from-[#041E42] to-[#002D72] text-white hover:shadow-lg transform hover:scale-[1.02]'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    {analyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <ChartBarIcon className="w-5 h-5" />
                        <span>Generate Analysis</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-8 space-y-6 pb-8">
            {analysisResults.length > 0 ? (
              <>
                {analysisResults.map((result, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-[#041E42] to-[#002D72] p-4">
                      <h2 className="text-xl font-bold text-white flex items-center justify-between flex-wrap gap-2">
                        <span className="mr-auto">{result.title}</span>
                        <span className="text-sm bg-white/20 px-3 py-1 rounded-full whitespace-nowrap">
                          {result.confidence}% Confidence
                        </span>
                      </h2>
                    </div>

                    <div className="p-4 sm:p-6 space-y-6">
                      {/* Prediction Section */}
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">Prediction</h3>
                        <p className="text-blue-800">{result.prediction}</p>
                      </div>

                      {/* Key Insights */}
                      <div className="bg-white rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Insights</h3>
                        <div className="space-y-2.5">
                          {result.insights.map((insight, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                              <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700 flex-1">{insight}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Trends Grid */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Metrics</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {result.trends.map((trend, i) => (
                            <div key={i} className="bg-gray-50 rounded-lg p-4">
                              <div className="text-sm text-gray-500">{trend.label}</div>
                              <div className="flex items-center justify-between mt-1.5">
                                <span className="text-lg font-semibold text-gray-900">
                                  {trend.value}
                                </span>
                                <span className={`
                                  flex items-center gap-1 text-lg
                                  ${trend.trend === 'up' ? 'text-green-500' : ''}
                                  ${trend.trend === 'down' ? 'text-red-500' : ''}
                                  ${trend.trend === 'neutral' ? 'text-gray-400' : ''}
                                `}>
                                  {trend.trend === 'up' && '↑'}
                                  {trend.trend === 'down' && '↓'}
                                  {trend.trend === 'neutral' && '→'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recommendation */}
                      <div className={`
                        rounded-lg p-4 border
                        ${result.recommendation.type === 'strong' ? 'bg-green-50 border-green-100' : ''}
                        ${result.recommendation.type === 'moderate' ? 'bg-yellow-50 border-yellow-100' : ''}
                        ${result.recommendation.type === 'weak' ? 'bg-gray-50 border-gray-100' : ''}
                      `}>
                        <div className="flex items-center gap-2">
                          <ExclamationCircleIcon className={`
                            w-5 h-5 flex-shrink-0
                            ${result.recommendation.type === 'strong' ? 'text-green-500' : ''}
                            ${result.recommendation.type === 'moderate' ? 'text-yellow-500' : ''}
                            ${result.recommendation.type === 'weak' ? 'text-gray-500' : ''}
                          `} />
                          <h3 className="font-semibold text-gray-900">Betting Recommendation</h3>
                        </div>
                        <p className="mt-2 text-gray-700">{result.recommendation.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Analysis Results Yet
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Select analysis options and click "Generate Analysis" to see detailed insights and predictions
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 