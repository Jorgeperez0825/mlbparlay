import { Metric } from '@/constants/metrics';
import { MLBGame } from '@/services/mlbApi';

interface AnalysisResultProps {
  metric: Metric;
  game: MLBGame;
}

export const AnalysisResult = ({ metric, game }: AnalysisResultProps) => {
  // Datos de ejemplo para el análisis de props
  const playerProps = {
    pitcher: {
      name: "Gerrit Cole",
      team: game.teams.home.team.name,
      image: "/players/cole.jpg",
      stats: {
        strikeouts: {
          line: 7.5,
          last5Games: [8, 6, 9, 7, 8],
          recommendation: "Over",
          confidence: 75,
          factors: [
            "Averages 8.2 K/9 in last 5 games",
            "Opposing team has 27% strikeout rate vs RHP",
            "Favorable stadium conditions"
          ]
        },
        hits_allowed: {
          line: 5.5,
          last5Games: [4, 6, 3, 5, 4],
          recommendation: "Under",
          confidence: 65
        },
        innings_pitched: {
          line: 6.5,
          last5Games: [7, 6, 7, 6.1, 6.2],
          recommendation: "Over",
          confidence: 70
        }
      }
    },
    batters: [
      {
        name: "Aaron Judge",
        team: game.teams.home.team.name,
        image: "/players/judge.jpg",
        props: {
          total_bases: {
            line: 1.5,
            last5Games: [2, 0, 3, 1, 2],
            recommendation: "Over",
            confidence: 68,
            factors: [
              "Batea .320 contra el pitcher actual",
              "OPS de .950 en los últimos 7 días",
              "4 hits de extra base en últimos 5 juegos"
            ]
          },
          hits: {
            line: 0.5,
            last5Games: [1, 0, 2, 1, 1],
            recommendation: "Over",
            confidence: 72
          }
        }
      }
    ]
  };

  const getAnalysisContent = () => {
    switch (metric.id) {
      case 'strikeout_props':
      case 'hits_props':
      case 'total_bases':
        return {
          title: 'Player Props Analysis',
          content: (
            <div className="space-y-8">
              {/* Pitcher Analysis Card */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-[#041E42] to-[#002D72] px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">P</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white">{playerProps.pitcher.name}</h4>
                        <p className="text-sm text-blue-200">{playerProps.pitcher.team}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1 bg-white/10 rounded-full">
                        <span className="text-sm text-white font-medium">Right Handed</span>
                      </div>
                      <div className="px-3 py-1 bg-white/10 rounded-full">
                        <span className="text-sm text-white font-medium">ERA 2.95</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  {/* Props Grid */}
                  <div className="grid grid-cols-3 gap-6">
                    {/* Strikeouts Prop */}
                    <div className="col-span-2 bg-gray-50 rounded-xl p-6">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h5 className="text-lg font-semibold text-gray-900">Strikeouts (K)</h5>
                          <div className="mt-1 text-3xl font-bold text-[#041E42]">
                            {playerProps.pitcher.stats.strikeouts.line}
                          </div>
                        </div>
                        <div className={`px-4 py-2 rounded-lg ${
                          playerProps.pitcher.stats.strikeouts.confidence >= 70
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          <div className="text-sm font-bold">
                            {playerProps.pitcher.stats.strikeouts.recommendation}
                          </div>
                          <div className="text-xs font-medium mt-1">
                            {playerProps.pitcher.stats.strikeouts.confidence}% confidence
                          </div>
                        </div>
                      </div>

                      {/* Performance Chart */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                          <h6 className="text-sm font-medium text-gray-600">Last 5 Games Performance</h6>
                          <div className="text-xs text-gray-500">Line: {playerProps.pitcher.stats.strikeouts.line}</div>
                        </div>
                        <div className="flex gap-2 h-32">
                          {playerProps.pitcher.stats.strikeouts.last5Games.map((k, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center justify-end">
                              <div 
                                className={`w-full rounded-t-lg transition-all ${
                                  k > playerProps.pitcher.stats.strikeouts.line
                                    ? 'bg-green-200'
                                    : 'bg-red-200'
                                }`}
                                style={{
                                  height: `${(k / Math.max(...playerProps.pitcher.stats.strikeouts.last5Games)) * 100}%`
                                }}
                              />
                              <div className="mt-2 text-xs font-medium text-gray-600">{k}</div>
                              <div className="text-xs text-gray-400">Game {5-i}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Key Factors */}
                      <div>
                        <h6 className="text-sm font-medium text-gray-600 mb-3">Key Factors</h6>
                        <ul className="space-y-2">
                          {playerProps.pitcher.stats.strikeouts.factors.map((factor, i) => (
                            <li key={i} className="flex items-start gap-2 bg-white p-3 rounded-lg border border-gray-100">
                              <span className="text-green-500 mt-1">•</span>
                              <span className="text-sm text-gray-700">{factor}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Additional Props */}
                    <div className="space-y-6">
                      {/* Hits Allowed */}
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h5 className="text-sm font-medium text-gray-600">Hits Allowed</h5>
                        <div className="mt-2">
                          <div className="text-2xl font-bold text-[#041E42]">
                            {playerProps.pitcher.stats.hits_allowed.line}
                          </div>
                          <div className="flex items-center gap-2 mt-3">
                            <div className={`px-3 py-1 rounded-lg text-sm font-medium ${
                              playerProps.pitcher.stats.hits_allowed.confidence >= 70
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {playerProps.pitcher.stats.hits_allowed.recommendation}
                            </div>
                            <span className="text-sm text-gray-500">
                              {playerProps.pitcher.stats.hits_allowed.confidence}%
                            </span>
                          </div>
                        </div>
                        {/* Mini Chart */}
                        <div className="flex gap-1 mt-4 h-8">
                          {playerProps.pitcher.stats.hits_allowed.last5Games.map((h, i) => (
                            <div
                              key={i}
                              className={`flex-1 rounded-t ${
                                h <= playerProps.pitcher.stats.hits_allowed.line
                                  ? 'bg-green-200'
                                  : 'bg-red-200'
                              }`}
                              style={{
                                height: `${(h / Math.max(...playerProps.pitcher.stats.hits_allowed.last5Games)) * 100}%`
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Innings Pitched */}
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h5 className="text-sm font-medium text-gray-600">Innings Pitched</h5>
                        <div className="mt-2">
                          <div className="text-2xl font-bold text-[#041E42]">
                            {playerProps.pitcher.stats.innings_pitched.line}
                          </div>
                          <div className="flex items-center gap-2 mt-3">
                            <div className={`px-3 py-1 rounded-lg text-sm font-medium ${
                              playerProps.pitcher.stats.innings_pitched.confidence >= 70
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {playerProps.pitcher.stats.innings_pitched.recommendation}
                            </div>
                            <span className="text-sm text-gray-500">
                              {playerProps.pitcher.stats.innings_pitched.confidence}%
                            </span>
                          </div>
                        </div>
                        {/* Mini Chart */}
                        <div className="flex gap-1 mt-4 h-8">
                          {playerProps.pitcher.stats.innings_pitched.last5Games.map((ip, i) => (
                            <div
                              key={i}
                              className={`flex-1 rounded-t ${
                                ip >= playerProps.pitcher.stats.innings_pitched.line
                                  ? 'bg-green-200'
                                  : 'bg-red-200'
                              }`}
                              style={{
                                height: `${(ip / Math.max(...playerProps.pitcher.stats.innings_pitched.last5Games)) * 100}%`
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Batter Analysis Card */}
              {playerProps.batters.map((batter, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-[#041E42] to-[#002D72] px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center">
                          <span className="text-2xl font-bold text-white">B</span>
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-white">{batter.name}</h4>
                          <p className="text-sm text-blue-200">{batter.team}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="px-3 py-1 bg-white/10 rounded-full">
                          <span className="text-sm text-white font-medium">Right Handed</span>
                        </div>
                        <div className="px-3 py-1 bg-white/10 rounded-full">
                          <span className="text-sm text-white font-medium">AVG .278</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-6">
                      {/* Total Bases Prop */}
                      <div className="col-span-2 bg-gray-50 rounded-xl p-6">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h5 className="text-lg font-semibold text-gray-900">Total Bases</h5>
                            <div className="mt-1 text-3xl font-bold text-[#041E42]">
                              {batter.props.total_bases.line}
                            </div>
                          </div>
                          <div className={`px-4 py-2 rounded-lg ${
                            batter.props.total_bases.confidence >= 70
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            <div className="text-sm font-bold">
                              {batter.props.total_bases.recommendation}
                            </div>
                            <div className="text-xs font-medium mt-1">
                              {batter.props.total_bases.confidence}% confidence
                            </div>
                          </div>
                        </div>

                        {/* Performance Chart */}
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-3">
                            <h6 className="text-sm font-medium text-gray-600">Last 5 Games Performance</h6>
                            <div className="text-xs text-gray-500">Line: {batter.props.total_bases.line}</div>
                          </div>
                          <div className="flex gap-2 h-32">
                            {batter.props.total_bases.last5Games.map((bases, i) => (
                              <div key={i} className="flex-1 flex flex-col items-center justify-end">
                                <div 
                                  className={`w-full rounded-t-lg transition-all ${
                                    bases > batter.props.total_bases.line
                                      ? 'bg-green-200'
                                      : 'bg-red-200'
                                  }`}
                                  style={{
                                    height: `${(bases / Math.max(...batter.props.total_bases.last5Games)) * 100}%`
                                  }}
                                />
                                <div className="mt-2 text-xs font-medium text-gray-600">{bases}</div>
                                <div className="text-xs text-gray-400">Game {5-i}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Key Factors */}
                        <div>
                          <h6 className="text-sm font-medium text-gray-600 mb-3">Key Factors</h6>
                          <ul className="space-y-2">
                            {batter.props.total_bases.factors.map((factor, i) => (
                              <li key={i} className="flex items-start gap-2 bg-white p-3 rounded-lg border border-gray-100">
                                <span className="text-green-500 mt-1">•</span>
                                <span className="text-sm text-gray-700">{factor}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Hits Prop */}
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h5 className="text-sm font-medium text-gray-600">Hits</h5>
                        <div className="mt-2">
                          <div className="text-2xl font-bold text-[#041E42]">
                            {batter.props.hits.line}
                          </div>
                          <div className="flex items-center gap-2 mt-3">
                            <div className={`px-3 py-1 rounded-lg text-sm font-medium ${
                              batter.props.hits.confidence >= 70
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {batter.props.hits.recommendation}
                            </div>
                            <span className="text-sm text-gray-500">
                              {batter.props.hits.confidence}%
                            </span>
                          </div>
                        </div>
                        {/* Mini Chart */}
                        <div className="flex gap-1 mt-4 h-8">
                          {batter.props.hits.last5Games.map((h, i) => (
                            <div
                              key={i}
                              className={`flex-1 rounded-t ${
                                h >= batter.props.hits.line
                                  ? 'bg-green-200'
                                  : 'bg-red-200'
                              }`}
                              style={{
                                height: `${(h / Math.max(...batter.props.hits.last5Games)) * 100}%`
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        };

      default:
        return {
          title: metric.name,
          content: (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">
                Analysis in development for: {metric.name}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {metric.description}
              </p>
            </div>
          )
        };
    }
  };

  const analysis = getAnalysisContent();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">{analysis.title}</h3>
      {analysis.content}
    </div>
  );
}; 