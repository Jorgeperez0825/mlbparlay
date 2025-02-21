import Image from 'next/image';
import { getTeamLogo } from '@/utils/teamLogos';
import * as Tabs from '@radix-ui/react-tabs';
import { useState } from 'react';

interface Team {
  code: string;
  name: string;
  score: number;
}

interface GameDetailsCardProps {
  homeTeam: Team;
  awayTeam: Team;
  inning: number;
  hits?: {
    home: number;
    away: number;
  };
  errors?: {
    home: number;
    away: number;
  };
  startTime: string;
  status: 'scheduled' | 'live' | 'finished';
}

// Details Tab Content
function DetailsTab({ homeTeam, awayTeam }: { homeTeam: Team; awayTeam: Team }) {
  return (
    <div className="py-4">
      <div className="space-y-4">
        {/* Pitching Matchup */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Probable Pitchers</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm">
              <div className="font-medium">{awayTeam.name}</div>
              <div className="text-[var(--text-secondary)]">TBD</div>
            </div>
            <div className="text-sm">
              <div className="font-medium">{homeTeam.name}</div>
              <div className="text-[var(--text-secondary)]">TBD</div>
            </div>
          </div>
        </div>

        {/* Game Info */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Game Info</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Stadium</span>
              <span className="font-medium">TBD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Weather</span>
              <span className="font-medium">TBD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Wind</span>
              <span className="font-medium">TBD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Attendance</span>
              <span className="font-medium">TBD</span>
            </div>
          </div>
        </div>

        {/* Last 5 Games */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Last 5 Games</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 relative">
                  <Image
                    src={getTeamLogo(awayTeam.code) || ''}
                    alt={awayTeam.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-sm font-medium">{awayTeam.name}</span>
              </div>
              <div className="flex space-x-1">
                {['W', 'L', 'W', 'L', 'W'].map((result, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      result === 'W'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {result}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 relative">
                  <Image
                    src={getTeamLogo(homeTeam.code) || ''}
                    alt={homeTeam.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-sm font-medium">{homeTeam.name}</span>
              </div>
              <div className="flex space-x-1">
                {['L', 'W', 'W', 'L', 'W'].map((result, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      result === 'W'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {result}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Statistics Tab Content
function StatisticsTab({ homeTeam, awayTeam }: { homeTeam: Team; awayTeam: Team }) {
  return (
    <div className="py-4">
      <div className="space-y-6">
        {/* Team Stats */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Team Statistics</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-16 text-sm text-right">.275</div>
              <div className="flex-1 px-3">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-[27.5%] bg-blue-500 rounded-full"></div>
                </div>
              </div>
              <div className="w-16 text-sm">.268</div>
              <div className="w-20 text-sm text-[var(--text-secondary)]">AVG</div>
            </div>
            <div className="flex items-center">
              <div className="w-16 text-sm text-right">.350</div>
              <div className="flex-1 px-3">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-[35%] bg-blue-500 rounded-full"></div>
                </div>
              </div>
              <div className="w-16 text-sm">.342</div>
              <div className="w-20 text-sm text-[var(--text-secondary)]">OBP</div>
            </div>
            <div className="flex items-center">
              <div className="w-16 text-sm text-right">.450</div>
              <div className="flex-1 px-3">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-[45%] bg-blue-500 rounded-full"></div>
                </div>
              </div>
              <div className="w-16 text-sm">.445</div>
              <div className="w-20 text-sm text-[var(--text-secondary)]">SLG</div>
            </div>
          </div>
        </div>

        {/* Batting Leaders */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Batting Leaders</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-medium text-[var(--text-secondary)] mb-2">{awayTeam.name}</div>
              <div className="space-y-2">
                <div className="text-sm">
                  <div className="font-medium">Player Name</div>
                  <div className="text-[var(--text-secondary)]">.325 AVG, 15 HR, 45 RBI</div>
                </div>
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-[var(--text-secondary)] mb-2">{homeTeam.name}</div>
              <div className="space-y-2">
                <div className="text-sm">
                  <div className="font-medium">Player Name</div>
                  <div className="text-[var(--text-secondary)]">.315 AVG, 12 HR, 40 RBI</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Standings Tab Content
function StandingsTab() {
  const standings = [
    { team: 'Team A', w: 45, l: 30, pct: .600, gb: '-', l10: '7-3', streak: 'W3' },
    { team: 'Team B', w: 42, l: 33, pct: .560, gb: '3.0', l10: '5-5', streak: 'L1' },
    { team: 'Team C', w: 40, l: 35, pct: .533, gb: '5.0', l10: '6-4', streak: 'W2' },
    { team: 'Team D', w: 38, l: 37, pct: .507, gb: '7.0', l10: '4-6', streak: 'L2' },
    { team: 'Team E', w: 35, l: 40, pct: .467, gb: '10.0', l10: '3-7', streak: 'W1' },
  ];

  return (
    <div className="py-4">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Division Standings</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--text-secondary)]">
                <th className="text-left font-medium py-2">Team</th>
                <th className="text-center font-medium py-2">W</th>
                <th className="text-center font-medium py-2">L</th>
                <th className="text-center font-medium py-2">PCT</th>
                <th className="text-center font-medium py-2">GB</th>
                <th className="text-center font-medium py-2">L10</th>
                <th className="text-center font-medium py-2">STRK</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((team, index) => (
                <tr key={index} className="border-t border-[var(--border-color)]">
                  <td className="py-2">{team.team}</td>
                  <td className="text-center py-2">{team.w}</td>
                  <td className="text-center py-2">{team.l}</td>
                  <td className="text-center py-2">{team.pct.toFixed(3)}</td>
                  <td className="text-center py-2">{team.gb}</td>
                  <td className="text-center py-2">{team.l10}</td>
                  <td className="text-center py-2">{team.streak}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function GameDetailsCard({
  homeTeam,
  awayTeam,
  inning,
  hits = { home: 0, away: 0 },
  errors = { home: 0, away: 0 },
  startTime,
  status
}: GameDetailsCardProps) {
  const [activeTab, setActiveTab] = useState('details');
  const homeLogo = getTeamLogo(homeTeam.code);
  const awayLogo = getTeamLogo(awayTeam.code);
  const isLive = status === 'live';
  const isFinished = status === 'finished';

  // Get ordinal suffix for inning number
  const getOrdinalSuffix = (num: number) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
  };

  const inningDisplay = isLive ? `${inning}${getOrdinalSuffix(inning)} inning` : '';

  return (
    <div className="bg-white rounded-xl shadow-lg border border-[var(--border-color)] backdrop-blur-sm bg-white/95">
      {/* Mobile Drag Handle - Removed since it's now in the parent */}

      {/* Header */}
      <div className="p-3 border-b border-[var(--border-color)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-secondary)]"></div>
            <div className="text-xs sm:text-sm font-medium text-[var(--text-secondary)]">USA</div>
          </div>
        </div>
        <div className="text-xs sm:text-sm font-semibold mt-1">MLB {isFinished ? 'Game Summary' : 'Live Game'}</div>
      </div>

      {/* Score Section */}
      <div className="p-3 sm:p-4">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          {/* Away Team */}
          <div className="flex flex-col items-center text-center space-y-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 relative rounded-full bg-gray-50 p-2 shadow-sm transition-transform hover:scale-105">
              {awayLogo ? (
                <Image
                  src={awayLogo}
                  alt={`${awayTeam.name} logo`}
                  fill
                  className="object-contain p-1"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-[10px] sm:text-xs font-bold">{awayTeam.code}</span>
                </div>
              )}
            </div>
            <div className="text-lg sm:text-xl font-bold tracking-tight">{awayTeam.score}</div>
            <div className="text-[10px] sm:text-xs font-medium text-[var(--text-secondary)] max-w-[80px] truncate">
              {awayTeam.name}
            </div>
          </div>

          {/* Score Separator */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-base sm:text-lg font-bold text-[var(--text-secondary)] mb-1">VS</div>
            <div className="text-[10px] sm:text-xs text-[var(--text-secondary)]">
              {isLive ? 'LIVE' : isFinished ? 'FINAL' : startTime}
            </div>
          </div>

          {/* Home Team */}
          <div className="flex flex-col items-center text-center space-y-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 relative rounded-full bg-gray-50 p-2 shadow-sm transition-transform hover:scale-105">
              {homeLogo ? (
                <Image
                  src={homeLogo}
                  alt={`${homeTeam.name} logo`}
                  fill
                  className="object-contain p-1"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-[10px] sm:text-xs font-bold">{homeTeam.code}</span>
                </div>
              )}
            </div>
            <div className="text-lg sm:text-xl font-bold tracking-tight">{homeTeam.score}</div>
            <div className="text-[10px] sm:text-xs font-medium text-[var(--text-secondary)] max-w-[80px] truncate">
              {homeTeam.name}
            </div>
          </div>
        </div>

        {/* Game Status */}
        <div className="text-center mb-4 sm:mb-6">
          {isLive ? (
            <div className="inline-flex items-center space-x-2 bg-red-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
              <span className="font-medium text-red-600 text-sm">LIVE</span>
              {inningDisplay && (
                <span className="text-red-600/70 text-sm font-medium">{inningDisplay}</span>
              )}
            </div>
          ) : isFinished ? (
            <div className="inline-flex items-center space-x-2 bg-gray-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
              <span className="text-gray-600 text-sm font-medium">Final</span>
            </div>
          ) : (
            <div className="inline-flex items-center space-x-2 bg-gray-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
              <span className="text-gray-600 text-sm font-medium">{startTime}</span>
            </div>
          )}
        </div>

        {/* Stats Table */}
        <div className="w-full border border-[var(--border-color)] rounded-lg overflow-hidden bg-gray-50 mb-4 sm:mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100/80">
                <th className="py-2 px-3 text-left font-medium text-[var(--text-secondary)]">R</th>
                <th className="py-2 px-3 text-left font-medium text-[var(--text-secondary)]">H</th>
                <th className="py-2 px-3 text-left font-medium text-[var(--text-secondary)]">E</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr className="border-t border-[var(--border-color)]">
                <td className="py-2 px-3 font-medium">{awayTeam.score}</td>
                <td className="py-2 px-3 font-medium">{hits.away}</td>
                <td className="py-2 px-3 font-medium">{errors.away}</td>
              </tr>
              <tr className="border-t border-[var(--border-color)]">
                <td className="py-2 px-3 font-medium">{homeTeam.score}</td>
                <td className="py-2 px-3 font-medium">{hits.home}</td>
                <td className="py-2 px-3 font-medium">{errors.home}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Navigation Tabs */}
        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List className="flex border-b border-[var(--border-color)] overflow-x-auto mt-3 sm:mt-4">
            <Tabs.Trigger
              value="details"
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs md:text-sm font-medium text-[var(--text-secondary)] hover:text-black whitespace-nowrap transition-colors data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black"
            >
              Details
            </Tabs.Trigger>
            <Tabs.Trigger
              value="lineups"
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs md:text-sm font-medium text-[var(--text-secondary)] hover:text-black whitespace-nowrap transition-colors data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black"
            >
              Lineups
            </Tabs.Trigger>
            <Tabs.Trigger
              value="statistics"
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs md:text-sm font-medium text-[var(--text-secondary)] hover:text-black whitespace-nowrap transition-colors data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black"
            >
              Statistics
            </Tabs.Trigger>
            <Tabs.Trigger
              value="standings"
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs md:text-sm font-medium text-[var(--text-secondary)] hover:text-black whitespace-nowrap transition-colors data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black"
            >
              Standings
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="details">
            <DetailsTab homeTeam={homeTeam} awayTeam={awayTeam} />
          </Tabs.Content>

          <Tabs.Content value="lineups">
            <div className="py-4 text-center text-sm text-[var(--text-secondary)]">
              Lineups will be available closer to game time
            </div>
          </Tabs.Content>

          <Tabs.Content value="statistics">
            <StatisticsTab homeTeam={homeTeam} awayTeam={awayTeam} />
          </Tabs.Content>

          <Tabs.Content value="standings">
            <StandingsTab />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
} 