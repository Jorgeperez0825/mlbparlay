import Image from 'next/image';
import { getTeamLogo } from '@/utils/teamLogos';
import * as Tabs from '@radix-ui/react-tabs';
import { useState, useEffect } from 'react';

interface Team {
  code: string;
  name: string;
  score: number;
}

interface Player {
  id: string;
  name: string;
  position: string;
  stats?: {
    avg?: number;
    hr?: number;
    rbi?: number;
    era?: number;
    wins?: number;
    losses?: number;
  };
}

interface GameStats {
  hits: number;
  errors: number;
  runs: number;
  leftOnBase: number;
  atBats: number;
  strikeouts: number;
}

interface Pitcher {
  id: string;
  name: string;
  stats: {
    era: number;
    wins: number;
    losses: number;
    inningsPitched: number;
    strikeouts: number;
  };
}

interface VenueInfo {
  name: string;
  location: string;
  weather?: {
    condition: string;
    temperature: number;
    wind: string;
  };
  capacity: number;
  attendance?: number;
}

interface TeamRecord {
  wins: number;
  losses: number;
  last10: string;
  streak: string;
  divisionRank: number;
  divisionGamesBack: number;
  winningPercentage: number;
}

interface MatchResult {
  date: string;
  homeTeam: {
    code: string;
    name: string;
    score: number;
  };
  awayTeam: {
    code: string;
    name: string;
    score: number;
  };
  venue: string;
  status: 'finished';
}

interface DetailedGameInfo {
  id: string;
  startTime: string;
  status: 'scheduled' | 'live' | 'finished';
  inning: number;
  isTopInning?: boolean;
  homeTeam: {
    ...Team;
    probablePitcher?: Pitcher;
    stats: GameStats;
    record: TeamRecord;
    lineup?: Player[];
    recentResults: MatchResult[];
  };
  awayTeam: {
    ...Team;
    probablePitcher?: Pitcher;
    stats: GameStats;
    record: TeamRecord;
    lineup?: Player[];
    recentResults: MatchResult[];
  };
  venue: VenueInfo;
  headToHead: {
    homeTeamWins: number;
    awayTeamWins: number;
    draws: number;
    recentGames: MatchResult[];
  };
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
  gameId: string;
}

// Details Tab Content
function DetailsTab({ gameDetails }: { gameDetails: DetailedGameInfo | null }) {
  if (!gameDetails) {
    return (
      <div className="py-4 text-center text-sm text-[var(--text-secondary)]">
        Loading game details...
      </div>
    );
  }

  const { homeTeam, awayTeam, venue } = gameDetails;

  return (
    <div className="py-4">
      <div className="space-y-4">
        {/* Pitching Matchup */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Probable Pitchers</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm">
              <div className="font-medium">{awayTeam.name}</div>
              {awayTeam.probablePitcher ? (
                <div>
                  <div className="font-medium text-black">{awayTeam.probablePitcher.name}</div>
                  <div className="text-[var(--text-secondary)]">
                    {awayTeam.probablePitcher.stats.wins}-{awayTeam.probablePitcher.stats.losses}, 
                    {awayTeam.probablePitcher.stats.era.toFixed(2)} ERA
                  </div>
                </div>
              ) : (
                <div className="text-[var(--text-secondary)]">TBD</div>
              )}
            </div>
            <div className="text-sm">
              <div className="font-medium">{homeTeam.name}</div>
              {homeTeam.probablePitcher ? (
                <div>
                  <div className="font-medium text-black">{homeTeam.probablePitcher.name}</div>
                  <div className="text-[var(--text-secondary)]">
                    {homeTeam.probablePitcher.stats.wins}-{homeTeam.probablePitcher.stats.losses}, 
                    {homeTeam.probablePitcher.stats.era.toFixed(2)} ERA
                  </div>
                </div>
              ) : (
                <div className="text-[var(--text-secondary)]">TBD</div>
              )}
            </div>
          </div>
        </div>

        {/* Game Info */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Game Info</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Stadium</span>
              <span className="font-medium">{venue.name}</span>
            </div>
            {venue.weather && (
              <>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Weather</span>
                  <span className="font-medium">
                    {venue.weather.condition}, {venue.weather.temperature}°F
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Wind</span>
                  <span className="font-medium">{venue.weather.wind}</span>
                </div>
              </>
            )}
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Attendance</span>
              <span className="font-medium">
                {venue.attendance ? venue.attendance.toLocaleString() : 'TBD'}
              </span>
            </div>
          </div>
        </div>

        {/* Last 5 Games */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Last 5 Games</h3>
          <div className="space-y-4">
            {[awayTeam, homeTeam].map((team, index) => (
              <div key={index}>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 relative">
                    <Image
                      src={getTeamLogo(team.code) || ''}
                      alt={team.name}
                      fill
                      className="object-contain"
                      sizes="24px"
                    />
                  </div>
                  <span className="text-sm font-medium">{team.name}</span>
                </div>
                <div className="flex space-x-1">
                  {team.recentResults.slice(0, 5).map((result, i) => {
                    const isWin = (result.homeTeam.code === team.code && result.homeTeam.score > result.awayTeam.score) ||
                                (result.awayTeam.code === team.code && result.awayTeam.score > result.homeTeam.score);
                    return (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                          isWin
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {isWin ? 'W' : 'L'}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Statistics Tab Content
function StatisticsTab({ gameDetails }: { gameDetails: DetailedGameInfo | null }) {
  if (!gameDetails) {
    return (
      <div className="py-4 text-center text-sm text-[var(--text-secondary)]">
        Loading statistics...
      </div>
    );
  }

  const { homeTeam, awayTeam } = gameDetails;

  // Calculate batting averages
  const homeAvg = (homeTeam.stats.hits / homeTeam.stats.atBats).toFixed(3);
  const awayAvg = (awayTeam.stats.hits / awayTeam.stats.atBats).toFixed(3);

  return (
    <div className="py-4">
      <div className="space-y-6">
        {/* Team Stats */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Team Statistics</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-16 text-sm text-right">{awayAvg}</div>
              <div className="flex-1 px-3">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${parseFloat(awayAvg) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-16 text-sm">{homeAvg}</div>
              <div className="w-20 text-sm text-[var(--text-secondary)]">AVG</div>
            </div>
            <div className="flex items-center">
              <div className="w-16 text-sm text-right">{awayTeam.stats.runs}</div>
              <div className="flex-1 px-3">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ 
                      width: `${(awayTeam.stats.runs / Math.max(awayTeam.stats.runs, homeTeam.stats.runs)) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
              <div className="w-16 text-sm">{homeTeam.stats.runs}</div>
              <div className="w-20 text-sm text-[var(--text-secondary)]">RUNS</div>
            </div>
            <div className="flex items-center">
              <div className="w-16 text-sm text-right">{awayTeam.stats.hits}</div>
              <div className="flex-1 px-3">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ 
                      width: `${(awayTeam.stats.hits / Math.max(awayTeam.stats.hits, homeTeam.stats.hits)) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
              <div className="w-16 text-sm">{homeTeam.stats.hits}</div>
              <div className="w-20 text-sm text-[var(--text-secondary)]">HITS</div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-medium text-[var(--text-secondary)] mb-2">{awayTeam.name}</div>
            <div className="space-y-2">
              <div className="text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">At Bats</span>
                  <span className="font-medium">{awayTeam.stats.atBats}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Strikeouts</span>
                  <span className="font-medium">{awayTeam.stats.strikeouts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Left on Base</span>
                  <span className="font-medium">{awayTeam.stats.leftOnBase}</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-[var(--text-secondary)] mb-2">{homeTeam.name}</div>
            <div className="space-y-2">
              <div className="text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">At Bats</span>
                  <span className="font-medium">{homeTeam.stats.atBats}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Strikeouts</span>
                  <span className="font-medium">{homeTeam.stats.strikeouts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Left on Base</span>
                  <span className="font-medium">{homeTeam.stats.leftOnBase}</span>
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
function StandingsTab({ gameDetails }: { gameDetails: DetailedGameInfo | null }) {
  if (!gameDetails) {
    return (
      <div className="py-4 text-center text-sm text-[var(--text-secondary)]">
        Loading standings...
      </div>
    );
  }

  const { homeTeam, awayTeam } = gameDetails;
  const teams = [
    {
      name: homeTeam.name,
      code: homeTeam.code,
      record: homeTeam.record,
      isParticipant: true
    },
    {
      name: awayTeam.name,
      code: awayTeam.code,
      record: awayTeam.record,
      isParticipant: true
    }
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
              {teams.map((team, index) => (
                <tr 
                  key={team.code} 
                  className={`border-t border-[var(--border-color)] ${
                    team.isParticipant ? 'bg-gray-50/50' : ''
                  }`}
                >
                  <td className="py-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 relative">
                        <Image
                          src={getTeamLogo(team.code) || ''}
                          alt={team.name}
                          fill
                          className="object-contain"
                          sizes="20px"
                        />
                      </div>
                      <span className="font-medium">{team.name}</span>
                    </div>
                  </td>
                  <td className="text-center py-2">{team.record.wins}</td>
                  <td className="text-center py-2">{team.record.losses}</td>
                  <td className="text-center py-2">{team.record.winningPercentage.toFixed(3)}</td>
                  <td className="text-center py-2">{team.record.divisionGamesBack}</td>
                  <td className="text-center py-2">{team.record.last10}</td>
                  <td className="text-center py-2">{team.record.streak}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Match History Tab Content
function MatchHistoryTab({ gameDetails }: { gameDetails: DetailedGameInfo | null }) {
  if (!gameDetails) {
    return (
      <div className="py-4 text-center text-sm text-[var(--text-secondary)]">
        Loading match history...
      </div>
    );
  }

  const { homeTeam, awayTeam, headToHead } = gameDetails;

  return (
    <div className="py-2">
      <div className="space-y-4">
        {/* Head to Head Summary */}
        <div>
          <h3 className="text-xs font-semibold mb-2">Head to Head Summary</h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-green-600 mb-0.5">{headToHead.homeTeamWins}</div>
              <div className="text-[10px] text-[var(--text-secondary)]">
                <div className="w-6 h-6 mx-auto mb-0.5 relative">
                  <Image
                    src={getTeamLogo(homeTeam.code) || ''}
                    alt={homeTeam.name}
                    fill
                    className="object-contain"
                    sizes="24px"
                  />
                </div>
                {homeTeam.name} Wins
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <div className="text-lg font-bold mb-0.5">{headToHead.draws}</div>
              <div className="text-[10px] text-[var(--text-secondary)]">
                <div className="w-6 h-6 mx-auto mb-0.5 flex items-center justify-center">
                  <span className="text-base">🤝</span>
                </div>
                Draws
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-green-600 mb-0.5">{headToHead.awayTeamWins}</div>
              <div className="text-[10px] text-[var(--text-secondary)]">
                <div className="w-6 h-6 mx-auto mb-0.5 relative">
                  <Image
                    src={getTeamLogo(awayTeam.code) || ''}
                    alt={awayTeam.name}
                    fill
                    className="object-contain"
                    sizes="24px"
                  />
                </div>
                {awayTeam.name} Wins
              </div>
            </div>
          </div>
        </div>

        {/* Recent Matches */}
        <div>
          <h3 className="text-xs font-semibold mb-2">Recent Matches</h3>
          <div className="space-y-2">
            {headToHead.recentGames.map((match, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-2">
                <div className="flex items-center justify-between text-[10px] text-[var(--text-secondary)] mb-2">
                  <div className="flex items-center space-x-1">
                    <span className="w-1 h-1 rounded-full bg-[var(--text-secondary)]"></span>
                    <span>{new Date(match.date).toLocaleDateString('en-US', { 
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>{match.venue}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 relative">
                      <Image
                        src={getTeamLogo(match.homeTeam.code) || ''}
                        alt={match.homeTeam.name}
                        fill
                        className="object-contain"
                        sizes="24px"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-medium">{match.homeTeam.name}</span>
                      <span className="text-sm font-bold">{match.homeTeam.score}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center px-2">
                    <span className="text-[10px] text-[var(--text-secondary)]">Final</span>
                    <span className="text-xs font-bold">VS</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-medium">{match.awayTeam.name}</span>
                      <span className="text-sm font-bold">{match.awayTeam.score}</span>
                    </div>
                    <div className="w-6 h-6 relative">
                      <Image
                        src={getTeamLogo(match.awayTeam.code) || ''}
                        alt={match.awayTeam.name}
                        fill
                        className="object-contain"
                        sizes="24px"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-[10px] text-[var(--text-secondary)]">
                  <div>
                    {match.homeTeam.score > match.awayTeam.score ? match.homeTeam.name :
                     match.awayTeam.score > match.homeTeam.score ? match.awayTeam.name :
                     'Draw'} {match.homeTeam.score === match.awayTeam.score ? '' : 'won'}
                  </div>
                  <div>
                    {Math.abs(match.homeTeam.score - match.awayTeam.score) === 0 ? 'Draw' :
                     `by ${Math.abs(match.homeTeam.score - match.awayTeam.score)} ${Math.abs(match.homeTeam.score - match.awayTeam.score) === 1 ? 'run' : 'runs'}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
  status,
  gameId
}: GameDetailsCardProps) {
  const [activeTab, setActiveTab] = useState('details');
  const [gameDetails, setGameDetails] = useState<DetailedGameInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        setIsLoading(true);
        // Replace this with your actual API endpoint
        const response = await fetch(`/api/mlb/games/${gameId}/details`);
        if (!response.ok) {
          throw new Error('Failed to fetch game details');
        }
        const data = await response.json();
        setGameDetails(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGameDetails();
  }, [gameId]);

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
      {/* Header */}
      <div className="p-3 border-b border-[var(--border-color)]">
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-secondary)]"></div>
          <div className="text-xs font-medium text-[var(--text-secondary)]">USA</div>
        </div>
        <div className="text-xs font-semibold mt-1">MLB {isFinished ? 'Game Summary' : 'Live Game'}</div>
      </div>

      {/* Score Section */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          {/* Away Team */}
          <div className="flex flex-col items-center text-center space-y-1">
            <div className="w-10 h-10 relative rounded-full bg-gray-50 p-1.5 shadow-sm transition-transform hover:scale-105">
              {awayLogo ? (
                <Image
                  src={awayLogo}
                  alt={`${awayTeam.name} logo`}
                  fill
                  className="object-contain p-0.5"
                  sizes="40px"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-[10px] font-bold">{awayTeam.code}</span>
                </div>
              )}
            </div>
            <div className="text-lg font-bold tracking-tight">{awayTeam.score}</div>
            <div className="text-[10px] font-medium text-[var(--text-secondary)] max-w-[70px] truncate">
              {awayTeam.name}
            </div>
          </div>

          {/* Score Separator */}
          <div className="flex flex-col items-center justify-center px-3">
            <div className="text-base font-bold text-[var(--text-secondary)] mb-0.5">VS</div>
            <div className="text-[10px] text-[var(--text-secondary)]">
              {isLive ? 'LIVE' : isFinished ? 'FINAL' : startTime}
            </div>
          </div>

          {/* Home Team */}
          <div className="flex flex-col items-center text-center space-y-1">
            <div className="w-10 h-10 relative rounded-full bg-gray-50 p-1.5 shadow-sm transition-transform hover:scale-105">
              {homeLogo ? (
                <Image
                  src={homeLogo}
                  alt={`${homeTeam.name} logo`}
                  fill
                  className="object-contain p-0.5"
                  sizes="40px"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-[10px] font-bold">{homeTeam.code}</span>
                </div>
              )}
            </div>
            <div className="text-lg font-bold tracking-tight">{homeTeam.score}</div>
            <div className="text-[10px] font-medium text-[var(--text-secondary)] max-w-[70px] truncate">
              {homeTeam.name}
            </div>
          </div>
        </div>

        {/* Game Status */}
        <div className="text-center mb-3">
          {isLive ? (
            <div className="inline-flex items-center space-x-1.5 bg-red-50 px-3 py-1.5 rounded-full">
              <span className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></span>
              <span className="font-medium text-red-600 text-xs">LIVE</span>
              {inningDisplay && (
                <span className="text-red-600/70 text-xs font-medium">{inningDisplay}</span>
              )}
            </div>
          ) : isFinished ? (
            <div className="inline-flex items-center space-x-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span className="text-gray-600 text-xs font-medium">Final</span>
            </div>
          ) : (
            <div className="inline-flex items-center space-x-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span className="text-gray-600 text-xs font-medium">{startTime}</span>
            </div>
          )}
        </div>

        {/* Stats Table */}
        <div className="w-full border border-[var(--border-color)] rounded-lg overflow-hidden bg-gray-50 mb-3">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-100/80">
                <th className="py-1.5 px-3 text-left font-medium text-[var(--text-secondary)]">R</th>
                <th className="py-1.5 px-3 text-left font-medium text-[var(--text-secondary)]">H</th>
                <th className="py-1.5 px-3 text-left font-medium text-[var(--text-secondary)]">E</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr className="border-t border-[var(--border-color)]">
                <td className="py-1.5 px-3 font-medium">{awayTeam.score}</td>
                <td className="py-1.5 px-3 font-medium">{hits.away}</td>
                <td className="py-1.5 px-3 font-medium">{errors.away}</td>
              </tr>
              <tr className="border-t border-[var(--border-color)]">
                <td className="py-1.5 px-3 font-medium">{homeTeam.score}</td>
                <td className="py-1.5 px-3 font-medium">{hits.home}</td>
                <td className="py-1.5 px-3 font-medium">{errors.home}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Navigation Tabs */}
        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List className="flex border-b border-[var(--border-color)] overflow-x-auto">
            <Tabs.Trigger
              value="details"
              className="flex-1 min-w-[60px] px-2 py-1.5 text-[10px] font-medium text-[var(--text-secondary)] hover:text-black whitespace-nowrap transition-colors data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black"
            >
              Details
            </Tabs.Trigger>
            <Tabs.Trigger
              value="match"
              className="flex-1 min-w-[60px] px-2 py-1.5 text-[10px] font-medium text-[var(--text-secondary)] hover:text-black whitespace-nowrap transition-colors data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black"
            >
              Match History
            </Tabs.Trigger>
            <Tabs.Trigger
              value="lineups"
              className="flex-1 min-w-[60px] px-2 py-1.5 text-[10px] font-medium text-[var(--text-secondary)] hover:text-black whitespace-nowrap transition-colors data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black"
            >
              Lineups
            </Tabs.Trigger>
            <Tabs.Trigger
              value="statistics"
              className="flex-1 min-w-[60px] px-2 py-1.5 text-[10px] font-medium text-[var(--text-secondary)] hover:text-black whitespace-nowrap transition-colors data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black"
            >
              Statistics
            </Tabs.Trigger>
            <Tabs.Trigger
              value="standings"
              className="flex-1 min-w-[60px] px-2 py-1.5 text-[10px] font-medium text-[var(--text-secondary)] hover:text-black whitespace-nowrap transition-colors data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black"
            >
              Standings
            </Tabs.Trigger>
          </Tabs.List>

          <div className="p-3">
            <Tabs.Content value="details">
              <DetailsTab gameDetails={gameDetails} />
            </Tabs.Content>

            <Tabs.Content value="match">
              <MatchHistoryTab gameDetails={gameDetails} />
            </Tabs.Content>

            <Tabs.Content value="lineups">
              <div className="py-3 text-center text-xs text-[var(--text-secondary)]">
                Lineups will be available closer to game time
              </div>
            </Tabs.Content>

            <Tabs.Content value="statistics">
              <StatisticsTab gameDetails={gameDetails} />
            </Tabs.Content>

            <Tabs.Content value="standings">
              <StandingsTab gameDetails={gameDetails} />
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </div>
    </div>
  );
} 