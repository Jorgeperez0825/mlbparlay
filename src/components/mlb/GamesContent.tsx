'use client';

import { useState, useEffect } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import GameCard from './GameCard';
import GameDetailsCard from './GameDetailsCard';
import MobileGameDetails from './MobileGameDetails';
import DateNavigation from '@/components/DateNavigation';

interface Team {
  code: string;
  name: string;
  score: number;
}

interface Game {
  id: number;
  startTime: string;
  homeTeam: Team;
  awayTeam: Team;
  status: 'scheduled' | 'live' | 'finished';
  venue?: string;
  period?: number;
  date?: string;
}

interface GameDetails {
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
    <div className="py-12 px-4">
      <div className="max-w-sm mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 ring-4 ring-gray-50">
          <CalendarIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-2">{message}</h3>
        <p className="text-sm text-gray-500 mb-6">Check back later for updates or try selecting a different date.</p>
        <div className="flex items-center justify-center space-x-2">
          <button className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
            <CalendarIcon className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Change Date</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GamesContent({ games, isLoading, error, selectedDate, previousDate, nextDate }: Props) {
  const [selectedGame, setSelectedGame] = useState<GameDetails | null>(null);
  const [isMobileDetailsOpen, setIsMobileDetailsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGameClick = (game: Game) => {
    const gameDetails = {
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
    };

    if (selectedGame?.homeTeam.code === game.homeTeam.code && 
        selectedGame?.awayTeam.code === game.awayTeam.code) {
      setSelectedGame(null);
      setIsMobileDetailsOpen(false);
    } else {
      setSelectedGame(gameDetails);
      if (window.innerWidth < 768) {
        setIsMobileDetailsOpen(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`sticky top-0 z-30 bg-white/80 backdrop-blur-lg transition-shadow ${
        isScrolled ? 'shadow-md' : ''
      }`}>
        <div className="max-w-[1920px] mx-auto px-4">
          <div className="py-3 flex items-center justify-between">
            <h1 className="text-lg font-semibold">MLB Games</h1>
            <div className="text-sm text-[var(--text-secondary)]">
              {format(selectedDate, 'MMMM d, yyyy')}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 px-4 max-w-[1920px] mx-auto pt-4">
        {/* Left Sidebar - Leagues/Favorites */}
        <aside className="hidden md:block md:col-span-2">
          <div className="sticky top-20 space-y-4">
            <div className="card p-4 rounded-xl shadow-sm bg-white/95 backdrop-blur-sm">
              <h2 className="text-sm font-semibold mb-3">Leagues</h2>
              <nav className="space-y-1.5">
                <a href="#" className="block px-3 py-2 rounded-lg bg-black text-white font-medium text-sm hover:bg-black/90 transition-colors">
                  MLB
                </a>
              </nav>
            </div>

            <div className="card p-4 rounded-xl shadow-sm bg-white/95 backdrop-blur-sm">
              <h2 className="text-sm font-semibold mb-3">Quick Filters</h2>
              <div className="space-y-2">
                <button className="w-full px-3 py-2 rounded-lg bg-gray-100 text-sm font-medium text-[var(--text-secondary)] hover:bg-gray-200 transition-colors text-left">
                  Live Games ({games.filter(game => game.status === 'live').length})
                </button>
                <button className="w-full px-3 py-2 rounded-lg bg-gray-100 text-sm font-medium text-[var(--text-secondary)] hover:bg-gray-200 transition-colors text-left">
                  Upcoming ({games.filter(game => game.status === 'scheduled').length})
                </button>
                <button className="w-full px-3 py-2 rounded-lg bg-gray-100 text-sm font-medium text-[var(--text-secondary)] hover:bg-gray-200 transition-colors text-left">
                  Finished ({games.filter(game => game.status === 'finished').length})
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content - Games */}
        <main className={`col-span-1 ${selectedGame ? 'md:col-span-7' : 'md:col-span-10'}`}>
          <div className="card rounded-xl shadow-sm bg-white/95 backdrop-blur-sm overflow-hidden">
            {/* Date Navigation */}
            <div className="border-b border-[var(--border-color)]">
              <DateNavigation
                selectedDate={selectedDate}
                previousDate={previousDate}
                nextDate={nextDate}
              />
            </div>

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
                <Tabs.List className="flex border-b border-[var(--border-color)] overflow-x-auto px-1 bg-gray-50/50">
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

                <div className="p-4 space-y-3">
                  {/* Mobile Quick Stats */}
                  <div className="md:hidden grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-[var(--text-secondary)]">Live</div>
                      <div className="text-lg font-semibold">{games.filter(game => game.status === 'live').length}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-[var(--text-secondary)]">Upcoming</div>
                      <div className="text-lg font-semibold">{games.filter(game => game.status === 'scheduled').length}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-[var(--text-secondary)]">Finished</div>
                      <div className="text-lg font-semibold">{games.filter(game => game.status === 'finished').length}</div>
                    </div>
                  </div>

                  <Tabs.Content value="all" className="space-y-3">
                    {games.length > 0 ? (
                      games.map((game) => (
                        <GameCard 
                          key={game.id} 
                          {...game} 
                          onClick={() => handleGameClick(game)}
                          isSelected={selectedGame?.homeTeam.code === game.homeTeam.code && selectedGame?.awayTeam.code === game.awayTeam.code}
                        />
                      ))
                    ) : (
                      <EmptyState message={`No games scheduled for ${format(selectedDate, 'MMMM d, yyyy')}`} />
                    )}
                  </Tabs.Content>

                  <Tabs.Content value="live" className="space-y-3">
                    {games.filter(game => game.status === 'live').length > 0 ? (
                      games.filter(game => game.status === 'live').map((game) => (
                        <GameCard 
                          key={game.id} 
                          {...game} 
                          onClick={() => handleGameClick(game)}
                          isSelected={selectedGame?.homeTeam.code === game.homeTeam.code && selectedGame?.awayTeam.code === game.awayTeam.code}
                        />
                      ))
                    ) : (
                      <EmptyState message="No live games at the moment" />
                    )}
                  </Tabs.Content>

                  <Tabs.Content value="finished" className="space-y-3">
                    {games.filter(game => game.status === 'finished').length > 0 ? (
                      games.filter(game => game.status === 'finished').map((game) => (
                        <GameCard 
                          key={game.id} 
                          {...game} 
                          onClick={() => handleGameClick(game)}
                          isSelected={selectedGame?.homeTeam.code === game.homeTeam.code && selectedGame?.awayTeam.code === game.awayTeam.code}
                        />
                      ))
                    ) : (
                      <EmptyState message="No finished games yet" />
                    )}
                  </Tabs.Content>
                </div>
              </Tabs.Root>
            )}
          </div>
        </main>

        {/* Right Sidebar - Game Details (Desktop) */}
        {selectedGame && (
          <aside className="hidden md:block md:col-span-3">
            <div className="sticky top-20 w-full">
              <GameDetailsCard {...selectedGame} />
            </div>
          </aside>
        )}
      </div>

      {/* Mobile Game Details */}
      <MobileGameDetails
        isOpen={isMobileDetailsOpen}
        onClose={() => {
          setIsMobileDetailsOpen(false);
          setSelectedGame(null);
        }}
        game={selectedGame}
      />
    </div>
  );
} 