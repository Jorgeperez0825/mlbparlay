import { useState } from 'react';
import { MLBGame } from '@/services/mlbApi';

interface AnalysisResultProps {
  game: MLBGame;
}

interface Metric {
  id: string;
  name: string;
  description: string;
  value: number;
  confidence: number;
}

export const AnalysisResult = ({ game }: AnalysisResultProps) => {
  const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null);
  const [loading, setLoading] = useState(false);

  const metrics: Metric[] = [
    {
      id: 'win_probability',
      name: 'Win Probability',
      description: 'Victory probability based on historical statistics',
      value: 0,
      confidence: 0
    },
    {
      id: 'run_line',
      name: 'Run Line',
      description: 'Run line analysis and prediction',
      value: 0,
      confidence: 0
    },
    {
      id: 'total_runs',
      name: 'Total Runs',
      description: 'Prediction of total runs in the game',
      value: 0,
      confidence: 0
    }
  ];

  const handleMetricSelect = (metric: Metric) => {
    setSelectedMetric(metric);
    // Here we could make an API call to get detailed analysis
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Game Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {metrics.map((metric) => (
          <button
            key={metric.id}
            onClick={() => handleMetricSelect(metric)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedMetric?.id === metric.id
                ? 'border-[#041E42] bg-[#041E42] text-white'
                : 'border-gray-200 hover:border-[#041E42]'
            }`}
          >
            <div className="font-semibold">{metric.name}</div>
            <div className="text-sm opacity-75">{metric.description}</div>
          </button>
        ))}
      </div>

      {selectedMetric && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">{selectedMetric.name}</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span>Predicted Value:</span>
              <span className="font-semibold">{selectedMetric.value}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Confidence:</span>
              <span className="font-semibold">{selectedMetric.confidence}%</span>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#041E42]"></div>
        </div>
      )}
    </div>
  );
}; 