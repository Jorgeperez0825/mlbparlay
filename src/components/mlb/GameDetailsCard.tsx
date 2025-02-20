import Image from 'next/image';
import { getTeamLogo } from '@/utils/teamLogos';

interface Team {
  code: string;
  name: string;
  score?: number;
}

interface GameDetailsCardProps {
  homeTeam: Team;
  awayTeam: Team;
  inning: number;
  hits: {
    home: number;
    away: number;
  };
  errors: {
    home: number;
    away: number;
  };
  startTime: string;
  status: 'scheduled' | 'live' | 'finished';
}

export default function GameDetailsCard({
  homeTeam,
  awayTeam,
  inning,
  hits,
  errors,
  startTime,
  status
}: GameDetailsCardProps) {
  const homeLogo = getTeamLogo(homeTeam.code);
  const awayLogo = getTeamLogo(awayTeam.code);
  const isLive = status === 'live';

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
        <div className="text-xs sm:text-sm font-semibold mt-1">MLB Spring Training, Round 1</div>
      </div>

      {/* Score Section */}
      <div className="p-3 sm:p-4">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          {/* Away Team */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 relative rounded-full bg-gray-50 p-2 shadow-sm transition-transform hover:scale-105">
              {awayLogo ? (
                <Image
                  src={awayLogo}
                  alt={`${awayTeam.name} logo`}
                  fill
                  className="object-contain p-1.5"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-xs sm:text-sm font-bold">{awayTeam.code}</span>
                </div>
              )}
            </div>
            <div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">{awayTeam.score || 0}</div>
              <div className="text-[11px] sm:text-xs md:text-sm font-medium text-[var(--text-secondary)]">{awayTeam.name}</div>
            </div>
          </div>

          {/* Score Separator */}
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--text-secondary)]">-</div>

          {/* Home Team */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-right">{homeTeam.score || 0}</div>
              <div className="text-[11px] sm:text-xs md:text-sm font-medium text-[var(--text-secondary)] text-right">{homeTeam.name}</div>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 relative rounded-full bg-gray-50 p-2 shadow-sm transition-transform hover:scale-105">
              {homeLogo ? (
                <Image
                  src={homeLogo}
                  alt={`${homeTeam.name} logo`}
                  fill
                  className="object-contain p-1.5"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-xs sm:text-sm font-bold">{homeTeam.code}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Game Status */}
        <div className="text-center mb-3 sm:mb-4">
          {isLive ? (
            <div className="inline-flex items-center space-x-2 bg-red-50 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
              <span className="font-medium text-red-600 text-[11px] sm:text-xs md:text-sm">LIVE</span>
              <span className="text-red-600/70 text-[11px] sm:text-xs md:text-sm font-medium">{inning}nd inning</span>
            </div>
          ) : (
            <div className="inline-flex items-center space-x-2 bg-gray-50 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
              <span className="text-gray-600 text-[11px] sm:text-xs md:text-sm font-medium">{startTime}</span>
            </div>
          )}
        </div>

        {/* Stats Table */}
        <div className="w-full border border-[var(--border-color)] rounded-lg overflow-hidden bg-gray-50">
          <table className="w-full text-[11px] sm:text-xs md:text-sm">
            <thead>
              <tr className="bg-gray-100/80">
                <th className="py-1.5 sm:py-2 px-2 sm:px-3 text-left font-medium text-[var(--text-secondary)]">1</th>
                <th className="py-1.5 sm:py-2 px-2 sm:px-3 text-left font-medium text-[var(--text-secondary)]">2</th>
                <th className="py-1.5 sm:py-2 px-2 sm:px-3 text-left font-medium text-[var(--text-secondary)]">H</th>
                <th className="py-1.5 sm:py-2 px-2 sm:px-3 text-left font-medium text-[var(--text-secondary)]">E</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr className="border-t border-[var(--border-color)]">
                <td className="py-1.5 sm:py-2 px-2 sm:px-3 font-medium">{awayTeam.score}</td>
                <td className="py-1.5 sm:py-2 px-2 sm:px-3 text-red-500 font-medium">0</td>
                <td className="py-1.5 sm:py-2 px-2 sm:px-3 font-medium">{hits.away}</td>
                <td className="py-1.5 sm:py-2 px-2 sm:px-3 font-medium">{errors.away}</td>
              </tr>
              <tr className="border-t border-[var(--border-color)]">
                <td className="py-1.5 sm:py-2 px-2 sm:px-3 font-medium">{homeTeam.score}</td>
                <td className="py-1.5 sm:py-2 px-2 sm:px-3 text-red-500 font-medium">0</td>
                <td className="py-1.5 sm:py-2 px-2 sm:px-3 font-medium">{hits.home}</td>
                <td className="py-1.5 sm:py-2 px-2 sm:px-3 font-medium">{errors.home}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-3 sm:mt-4 border-b border-[var(--border-color)] overflow-x-auto">
          <div className="flex min-w-max space-x-4">
            <button className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs md:text-sm font-medium text-black border-b-2 border-black whitespace-nowrap transition-colors hover:text-black/70">
              Details
            </button>
            <button className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs md:text-sm font-medium text-[var(--text-secondary)] hover:text-black whitespace-nowrap transition-colors">
              Lineups
            </button>
            <button className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs md:text-sm font-medium text-[var(--text-secondary)] hover:text-black whitespace-nowrap transition-colors">
              Statistics
            </button>
            <button className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs md:text-sm font-medium text-[var(--text-secondary)] hover:text-black whitespace-nowrap transition-colors">
              Standings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 