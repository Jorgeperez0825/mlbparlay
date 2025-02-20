'use client';

import { useState, useEffect } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import GameCard from './GameCard';
import GameDetailsCard from './GameDetailsCard';
import MobileGameDetails from './MobileGameDetails';
import DateNavigation from '@/components/DateNavigation';

interface Game {
  id: number;
  startTime: string;
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
  status: 'scheduled' | 'live' | 'finished';
  venue?: string;
  period?: number;
  date?: string;
}

interface Props {
  games: Game[];
  isLoading: boolean;
  error: string | null;
  selectedDate: Date;
  previousDate: string;
  nextDate: string;
}

// Loading component
function LoadingCard() {
  return (
    <div className="p-4 rounded-lg bg-white border border-[var(--border-color)] animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-12 bg-gray-200 rounded"></div>
          <div className="space-y-3 flex-1">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Error message component
function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="p-4 rounded-lg bg-red-50 border border-red-200">
      <div className="flex items-center space-x-2 text-red-600">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}

// Empty state component
function EmptyState({ message }: { message: string }) {
  return (
    <div className="p-8 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        <CalendarIcon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-sm font-medium text-gray-900 mb-1">{message}</h3>
      <p className="text-sm text-gray-500">Check back later for updates.</p>
    </div>
  );
}

export default function GamesContent({ games, isLoading, error, selectedDate, previousDate, nextDate }: Props) {
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [isMobileDetailsOpen, setIsMobileDetailsOpen] = useState(false);

  const handleGameClick = (game: Game) => {
    setSelectedGame({
      homeTeam: {
        code: game.homeTeam.code,
        name: game.homeTeam.name,
        score: game.homeTeam.score
      },
      awayTeam: {
        code: game.awayTeam.code,
        name: game.awayTeam.name,
        score: game.awayTeam.score
      },
      inning: game.period || 1,
      hits: {
        home: 0,
        away: 0
      },
      errors: {
        home: 0,
        away: 0
      },
      startTime: game.startTime,
      status: game.status
    });
    setIsMobileDetailsOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 px-4 max-w-[1920px] mx-auto">
        {/* Left Sidebar - Leagues/Favorites */}
        <aside className="hidden md:block md:col-span-2">
          <div className="card p-4 sticky top-4 rounded-xl shadow-sm bg-white/95 backdrop-blur-sm">
            <h2 className="text-sm font-semibold mb-3">Leagues</h2>
            <nav className="space-y-1.5">
              <a href="#" className="block px-3 py-2 rounded-lg bg-black text-white font-medium text-sm hover:bg-black/90 transition-colors">
                MLB
              </a>
            </nav>
          </div>
        </aside>

        {/* Main Content - Games */}
        <main className="col-span-1 md:col-span-7">
          <div className="card rounded-xl shadow-sm bg-white/95 backdrop-blur-sm overflow-hidden">
            {/* Date Navigation */}
            <DateNavigation
              selectedDate={selectedDate}
              previousDate={previousDate}
              nextDate={nextDate}
            />

            {/* Loading State */}
            {isLoading && (
              <div className="p-4 space-y-4">
                <LoadingCard />
                <LoadingCard />
                <LoadingCard />
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="p-4">
                <ErrorMessage message={error} />
              </div>
            )}

            {/* Games Content */}
            {!isLoading && !error && (
              <Tabs.Root defaultValue="all" className="flex flex-col">
                <Tabs.List className="flex border-b border-[var(--border-color)] overflow-x-auto px-1">
                  <Tabs.Trigger
                    value="all"
                    className="flex-1 min-w-[100px] px-4 py-3 text-sm font-medium text-center transition-colors data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black text-[var(--text-secondary)] hover:text-black"
                  >
                    All Games ({games.length})
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="live"
                    className="flex-1 min-w-[100px] px-4 py-3 text-sm font-medium text-center transition-colors data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black text-[var(--text-secondary)] hover:text-black"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      {games.filter(game => game.status === 'live').length > 0 && (
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                      )}
                      <span>Live ({games.filter(game => game.status === 'live').length})</span>
                    </div>
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="finished"
                    className="flex-1 min-w-[100px] px-4 py-3 text-sm font-medium text-center transition-colors data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black text-[var(--text-secondary)] hover:text-black"
                  >
                    Finished ({games.filter(game => game.status === 'finished').length})
                  </Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="all" className="p-4 space-y-3">
                  {games.length > 0 ? (
                    games.map((game) => (
                      <GameCard key={game.id} {...game} onClick={() => handleGameClick(game)} />
                    ))
                  ) : (
                    <EmptyState message={`No games scheduled for ${format(selectedDate, 'MMMM d, yyyy')}`} />
                  )}
                </Tabs.Content>

                <Tabs.Content value="live" className="p-4 space-y-3">
                  {games.filter(game => game.status === 'live').length > 0 ? (
                    games.filter(game => game.status === 'live').map((game) => (
                      <GameCard key={game.id} {...game} onClick={() => handleGameClick(game)} />
                    ))
                  ) : (
                    <EmptyState message="No live games at the moment" />
                  )}
                </Tabs.Content>

                <Tabs.Content value="finished" className="p-4 space-y-3">
                  {games.filter(game => game.status === 'finished').length > 0 ? (
                    games.filter(game => game.status === 'finished').map((game) => (
                      <GameCard key={game.id} {...game} onClick={() => handleGameClick(game)} />
                    ))
                  ) : (
                    <EmptyState message="No finished games yet" />
                  )}
                </Tabs.Content>
              </Tabs.Root>
            )}
          </div>
        </main>

        {/* Right Sidebar - Game Details (Desktop) */}
        <aside className="hidden md:block md:col-span-3 md:relative">
          <div className="fixed w-[calc((100vw-2rem)/12*3)] max-w-md">
            {selectedGame && <GameDetailsCard {...selectedGame} />}
          </div>
        </aside>
      </div>

      {/* Mobile Game Details */}
      <MobileGameDetails
        isOpen={isMobileDetailsOpen}
        onClose={() => setIsMobileDetailsOpen(false)}
        selectedGame={selectedGame}
      />
    </>
  );
} 