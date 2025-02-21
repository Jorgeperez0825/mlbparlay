import * as HoverCard from '@radix-ui/react-hover-card';
import { Calendar, Clock, MapPin, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { getTeamLogo } from '@/utils/teamLogos';

interface Team {
  code: string;
  name: string;
  score?: number;
}

interface GameCardProps {
  id: number;
  startTime: string;
  homeTeam: Team;
  awayTeam: Team;
  status: 'scheduled' | 'live' | 'finished';
  venue?: string;
  period?: number;
  date?: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export default function GameCard({ 
  startTime, 
  homeTeam, 
  awayTeam, 
  status,
  venue,
  period,
  date,
  onClick,
  isSelected
}: GameCardProps) {
  const isLive = status === 'live';
  const isFinished = status === 'finished';

  // Format period display
  const periodDisplay = period ? `${period}${getOrdinalSuffix(period)} Inn.` : '1st Inn.';

  // Get team logos
  const homeLogo = getTeamLogo(homeTeam.code);
  const awayLogo = getTeamLogo(awayTeam.code);

  // Get score differential for the winning team (if game is live or finished)
  const getScoreDiff = () => {
    if (!homeTeam.score || !awayTeam.score) return null;
    const diff = Math.abs(homeTeam.score - awayTeam.score);
    return `+${diff}`;
  };

  // Determine winning team
  const homeTeamWinning = (homeTeam.score ?? 0) > (awayTeam.score ?? 0);
  const awayTeamWinning = (awayTeam.score ?? 0) > (homeTeam.score ?? 0);
  const scoreDiff = getScoreDiff();

  return (
    <HoverCard.Root>
      <HoverCard.Trigger asChild>
        <div 
          className={`group p-2 sm:p-3 rounded-lg hover:bg-[var(--accent-color)] transition-all cursor-pointer border shadow-sm hover:shadow-md ${
            isSelected 
              ? 'bg-[var(--accent-color)] border-black' 
              : 'bg-white border-[var(--border-color)]'
          }`}
          onClick={onClick}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 flex-1">
              {/* Game Status Section */}
              <div className="flex flex-col items-center justify-center w-12 sm:w-14 h-full border-r border-[var(--border-color)] pr-2 sm:pr-3">
                {isLive ? (
                  <>
                    <div className="flex items-center space-x-1">
                      <span className="animate-pulse relative flex h-1 sm:h-1.5 w-1 sm:w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1 sm:h-1.5 w-1 sm:w-1.5 bg-red-500"></span>
                      </span>
                      <span className="text-red-500 text-[9px] sm:text-[10px] font-semibold">LIVE</span>
                    </div>
                    <span className="text-[var(--text-secondary)] text-[9px] sm:text-[10px] mt-1 sm:mt-1.5 font-medium">{periodDisplay}</span>
                  </>
                ) : isFinished ? (
                  <>
                    <span className="text-[var(--text-secondary)] text-[9px] sm:text-[10px] font-medium">Final</span>
                    <Clock className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[var(--text-secondary)] mt-1 sm:mt-1.5" />
                  </>
                ) : (
                  <>
                    <span className="text-[var(--text-secondary)] text-[9px] sm:text-[10px] font-medium">{startTime}</span>
                    <Calendar className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[var(--text-secondary)] mt-1 sm:mt-1.5" />
                  </>
                )}
              </div>

              {/* Teams Section */}
              <div className="flex-1 min-w-0">
                {/* Away Team */}
                <div className="flex items-center space-x-2">
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center border-2 transition-colors ${awayTeamWinning ? 'border-green-500' : 'border-[var(--border-color)]'} overflow-hidden group-hover:shadow-sm`}>
                    {awayLogo ? (
                      <Image
                        src={awayLogo}
                        alt={`${awayTeam.name} logo`}
                        width={20}
                        height={20}
                        className="w-4 h-4 sm:w-5 sm:h-5 object-contain transition-transform group-hover:scale-110"
                      />
                    ) : (
                      <span className="text-[9px] sm:text-[10px] font-bold text-black">{awayTeam.code}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[var(--text-secondary)] block truncate text-[10px] sm:text-[11px]">{awayTeam.name}</span>
                    {awayTeamWinning && scoreDiff && (isLive || isFinished) && (
                      <span className="text-[9px] sm:text-[10px] text-green-500 font-medium">Up by {scoreDiff}</span>
                    )}
                  </div>
                  <span className={`text-sm sm:text-base font-semibold ${awayTeamWinning ? 'text-green-500' : 'text-black'}`}>
                    {awayTeam.score ?? '-'}
                  </span>
                </div>

                {/* Home Team */}
                <div className="flex items-center space-x-2 mt-1.5 sm:mt-2">
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center border-2 transition-colors ${homeTeamWinning ? 'border-green-500' : 'border-[var(--border-color)]'} overflow-hidden group-hover:shadow-sm`}>
                    {homeLogo ? (
                      <Image
                        src={homeLogo}
                        alt={`${homeTeam.name} logo`}
                        width={20}
                        height={20}
                        className="w-4 h-4 sm:w-5 sm:h-5 object-contain transition-transform group-hover:scale-110"
                      />
                    ) : (
                      <span className="text-[9px] sm:text-[10px] font-bold text-black">{homeTeam.code}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[var(--text-secondary)] block truncate text-[10px] sm:text-[11px]">{homeTeam.name}</span>
                    {homeTeamWinning && scoreDiff && (isLive || isFinished) && (
                      <span className="text-[9px] sm:text-[10px] text-green-500 font-medium">Up by {scoreDiff}</span>
                    )}
                  </div>
                  <span className={`text-sm sm:text-base font-semibold ${homeTeamWinning ? 'text-green-500' : 'text-black'}`}>
                    {homeTeam.score ?? '-'}
                  </span>
                </div>
              </div>

              {/* Arrow indicator */}
              <div className="ml-1 sm:ml-2 text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
            </div>
          </div>
          
          {/* Game Info Footer */}
          {(isLive || venue) && (
            <div className="mt-1.5 sm:mt-2 pt-1.5 sm:pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-[9px] sm:text-[10px] text-[var(--text-secondary)]">
              {isLive && <span className="font-medium">{periodDisplay}</span>}
              {venue && (
                <div className="flex items-center space-x-0.5">
                  <MapPin className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                  <span className="truncate max-w-[120px] sm:max-w-[150px]">{venue}</span>
                </div>
              )}
              {date && <span>{date}</span>}
            </div>
          )}
        </div>
      </HoverCard.Trigger>

      {/* Hover Card Content - Only show on desktop */}
      <HoverCard.Portal>
        <HoverCard.Content
          className="hidden sm:block w-80 rounded-lg bg-white p-4 shadow-lg border border-[var(--border-color)]"
          sideOffset={5}
        >
          <div className="space-y-4">
            {/* Header with Logos */}
            <div className="flex items-center justify-center space-x-4">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-[var(--border-color)] overflow-hidden">
                  {awayLogo ? (
                    <Image
                      src={awayLogo}
                      alt={`${awayTeam.name} logo`}
                      width={32}
                      height={32}
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <span className="text-sm font-bold text-black">{awayTeam.code}</span>
                  )}
                </div>
                <span className="text-sm font-medium mt-1">{awayTeam.name}</span>
              </div>
              <div className="text-center">
                <div className="text-xs text-[var(--text-secondary)] mb-1">VS</div>
                {(isLive || isFinished) && (
                  <div className="text-lg font-bold">
                    {awayTeam.score} - {homeTeam.score}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-[var(--border-color)] overflow-hidden">
                  {homeLogo ? (
                    <Image
                      src={homeLogo}
                      alt={`${homeTeam.name} logo`}
                      width={32}
                      height={32}
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <span className="text-sm font-bold text-black">{homeTeam.code}</span>
                  )}
                </div>
                <span className="text-sm font-medium mt-1">{homeTeam.name}</span>
              </div>
            </div>

            {/* Game Details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-1 border-b border-[var(--border-color)]">
                <span className="text-[var(--text-secondary)]">Status</span>
                <span className={`font-medium ${isLive ? 'text-red-500' : 'text-black'}`}>
                  {isLive ? 'Live' : isFinished ? 'Final' : 'Scheduled'}
                </span>
              </div>
              {venue && (
                <div className="flex justify-between items-center py-1 border-b border-[var(--border-color)]">
                  <span className="text-[var(--text-secondary)]">Venue</span>
                  <span className="font-medium text-black">{venue}</span>
                </div>
              )}
              {date && (
                <div className="flex justify-between items-center py-1 border-b border-[var(--border-color)]">
                  <span className="text-[var(--text-secondary)]">Date</span>
                  <span className="font-medium text-black">{date}</span>
                </div>
              )}
              {isLive && (
                <div className="flex justify-between items-center py-1 border-b border-[var(--border-color)]">
                  <span className="text-[var(--text-secondary)]">Current Inning</span>
                  <span className="font-medium text-black">{periodDisplay}</span>
                </div>
              )}
            </div>
          </div>
          <HoverCard.Arrow className="fill-white" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}

// Helper function to add ordinal suffix to numbers (1st, 2nd, 3rd, etc.)
function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
} 