import { useState } from 'react';
import { MLBGame } from '@/services/mlbApi';
import { openAiService } from '@/services/openAiService';
import { PitcherIcon, BatterIcon, WeatherIcon, HistoryIcon, VenueIcon, StatsIcon } from '@/components/icons/AnalysisIcons';

interface CreateParlayModalProps {
  game: MLBGame;
  isOpen: boolean;
  onClose: () => void;
}

interface AnalysisOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  dataPoints: string[];
}

export const CreateParlayModal = ({ game, isOpen, onClose }: CreateParlayModalProps) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const analysisOptions: AnalysisOption[] = [
    {
      id: 'pitcher_analysis',
      name: 'Pitcher Analysis',
      description: 'Recent performance, matchup history, and venue stats',
      icon: <PitcherIcon />,
      dataPoints: ['recent_games', 'vs_team', 'at_venue', 'strikeout_rate']
    },
    {
      id: 'batter_trends',
      name: 'Batter Trends',
      description: 'Hot/cold streaks, pitcher matchups, and historical performance',
      icon: <BatterIcon />,
      dataPoints: ['batting_average', 'recent_hits', 'vs_pitcher', 'power_stats']
    },
    {
      id: 'weather_impact',
      name: 'Weather Impact',
      description: 'Weather conditions and their historical impact',
      icon: <WeatherIcon />,
      dataPoints: ['temperature', 'wind', 'humidity', 'historical_weather_impact']
    },
    {
      id: 'historical_matchups',
      name: 'Historical Matchups',
      description: 'Team vs team and key player matchups',
      icon: <HistoryIcon />,
      dataPoints: ['head_to_head', 'recent_meetings', 'scoring_patterns']
    },
    {
      id: 'venue_analysis',
      name: 'Venue Analysis',
      description: 'Park factors and team performance at venue',
      icon: <VenueIcon />,
      dataPoints: ['park_factors', 'team_venue_stats', 'scoring_trends']
    },
    {
      id: 'advanced_stats',
      name: 'Advanced Stats',
      description: 'Deep statistical analysis and trends',
      icon: <StatsIcon />,
      dataPoints: ['sabermetrics', 'run_differentials', 'win_probability']
    }
  ];

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      
      // Recopilar datos basados en las opciones seleccionadas
      const selectedDataPoints = selectedOptions.flatMap(
        optionId => analysisOptions.find(opt => opt.id === optionId)?.dataPoints || []
      );

      // Obtener datos de la API de MLB
      const analysisData = await openAiService.analyzeGameData({
        gameData: game,
        selectedAnalysis: selectedDataPoints
      });

      setAnalysis(analysisData);
    } catch (error) {
      console.error('Error analyzing game:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 my-8 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#041E42]">Custom Analysis Selection</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {analysisOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedOptions(prev => 
                prev.includes(option.id) 
                  ? prev.filter(id => id !== option.id)
                  : [...prev, option.id]
              )}
              className={`
                p-4 rounded-lg border-2 transition-all text-left flex flex-col
                ${selectedOptions.includes(option.id)
                  ? 'border-[#041E42] bg-[#041E42] text-white'
                  : 'border-gray-200 hover:border-[#041E42]'
                }
              `}
            >
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">{option.icon}</span>
                <span className="font-semibold">{option.name}</span>
              </div>
              <p className="text-sm opacity-75">{option.description}</p>
            </button>
          ))}
        </div>

        {analysis && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Analysis Results</h3>
            <pre className="whitespace-pre-wrap text-sm">
              {JSON.stringify(analysis, null, 2)}
            </pre>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAnalyze}
            disabled={selectedOptions.length === 0 || loading}
            className={`
              px-6 py-2 rounded-lg text-white font-semibold
              ${selectedOptions.length > 0 && !loading
                ? 'bg-[#041E42] hover:bg-[#E31837]'
                : 'bg-gray-300 cursor-not-allowed'
              } transition-colors
            `}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </span>
            ) : 'Analyze Selected Data'}
          </button>
        </div>
      </div>
    </div>
  );
}; 