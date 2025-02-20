import * as HoverCard from '@radix-ui/react-hover-card';
import { Calendar, Clock } from 'lucide-react';

interface Team {
  code: string;
  name: string;
  score?: number;
}

interface GameCardProps {
  startTime: string;
  homeTeam: Team;
  awayTeam: Team;
  status: 'scheduled' | 'live' | 'finished';
}

export default function GameCard({ startTime, homeTeam, awayTeam, status }: GameCardProps) {
  const isLive = status === 'live';
  const isFinished = status === 'finished';

  return (
    <HoverCard.Root>
      <HoverCard.Trigger asChild>
        <div className="p-4 rounded-lg bg-white hover:bg-[var(--accent-color)] transition-all cursor-pointer border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-center justify-center w-16 h-full border-r border-[var(--border-color)] pr-4">
                {isLive ? (
                  <>
                    <span className="text-red-500 text-xs font-semibold">● LIVE</span>
                    <span className="text-[var(--text-secondary)] text-xs mt-1">3rd Inn.</span>
                  </>
                ) : isFinished ? (
                  <>
                    <span className="text-[var(--text-secondary)] text-xs">Final</span>
                    <Clock className="w-4 h-4 text-[var(--text-secondary)] mt-1" />
                  </>
                ) : (
                  <>
                    <span className="text-[var(--text-secondary)] text-xs">{startTime}</span>
                    <Calendar className="w-4 h-4 text-[var(--text-secondary)] mt-1" />
                  </>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[var(--accent-color)] rounded-full flex items-center justify-center border border-[var(--border-color)]">
                    <span className="text-xs font-bold text-black">{awayTeam.code}</span>
                  </div>
                  <span className="text-[var(--text-secondary)]">{awayTeam.name}</span>
                  <span className="text-lg font-semibold ml-auto text-black">{awayTeam.score ?? '-'}</span>
                </div>
                <div className="flex items-center space-x-3 mt-3">
                  <div className="w-8 h-8 bg-[var(--accent-color)] rounded-full flex items-center justify-center border border-[var(--border-color)]">
                    <span className="text-xs font-bold text-black">{homeTeam.code}</span>
                  </div>
                  <span className="text-[var(--text-secondary)]">{homeTeam.name}</span>
                  <span className="text-lg font-semibold ml-auto text-black">{homeTeam.score ?? '-'}</span>
                </div>
              </div>
            </div>
          </div>
          
          {isLive && (
            <div className="mt-3 pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span>P: J. deGrom</span>
              <span>Bases loaded</span>
              <span>Count: 2-2</span>
            </div>
          )}
        </div>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          className="w-80 rounded-lg bg-white p-4 shadow-lg border border-[var(--border-color)]"
          sideOffset={5}
        >
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-black">Game Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Venue</span>
                <span className="text-black">Yankee Stadium</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Weather</span>
                <span className="text-black">72°F, Clear</span>
              </div>
              {isLive && (
                <>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">At Bat</span>
                    <span className="text-black">Aaron Judge</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Pitcher</span>
                    <span className="text-black">Jacob deGrom</span>
                  </div>
                </>
              )}
            </div>
          </div>
          <HoverCard.Arrow className="fill-white" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
} 