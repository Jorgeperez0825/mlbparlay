import GameCard from "@/components/mlb/GameCard";
import GameDetailsCard from "@/components/mlb/GameDetailsCard";
import * as Tabs from '@radix-ui/react-tabs';
import { CalendarIcon } from 'lucide-react';
import { format, addDays, subDays, parseISO } from 'date-fns';
import { api } from '@/utils/api';
import DateNavigation from "@/components/DateNavigation";
import { Metadata } from "next";

// Define the Props interface with searchParams as a Promise
interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// This is needed for Next.js server components
async function getGames(date: string) {
  try {
    // Get current season (year)
    const currentYear = new Date().getFullYear();
    
    // Determine if we should fetch spring training games
    const isSpringTraining = isDateInSpringTraining(date);
    
    console.log('Fetching games with params:', {
      date,
      season: currentYear,
      seasonType: isSpringTraining ? 'spring' : 'regular'
    });
    
    const response = await api.games.list({
      dates: [date],
      seasons: [currentYear],
      per_page: 25,
      page: 1,
      season_type: isSpringTraining ? 'spring' : 'regular'
    });
    
    console.log('API Response:', JSON.stringify(response, null, 2));
    return response.data;
  } catch (error) {
    console.error('Error fetching games:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
    // Return empty array as fallback
    return [];
  }
}

// Helper function to determine if a date falls within spring training
function isDateInSpringTraining(dateStr: string): boolean {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  
  // Spring Training typically starts mid-February
  const springTrainingStart = new Date(year, 1, 20); // February 20
  const springTrainingEnd = new Date(year, 2, 26);   // March 26
  
  return date >= springTrainingStart && date <= springTrainingEnd;
}

// Helper function to get MLB season year
function getSeasonYear(date: Date): number {
  const month = date.getMonth();
  const year = date.getFullYear();
  
  // If we're in the offseason (October-December), use next year
  if (month >= 9) { // October onwards
    return year + 1;
  }
  return year;
}

// Test function to verify API connection
async function testApiConnection() {
  try {
    console.log('Testing API connection with teams endpoint...');
    const response = await api.teams.list({
      per_page: 10,
      page: 1
    });
    
    // Log the full response structure
    console.log('Teams API Full Response:', {
      status: 'success',
      responseType: typeof response,
      hasData: Boolean(response?.data),
      dataType: Array.isArray(response?.data) ? 'array' : typeof response?.data,
      dataLength: Array.isArray(response?.data) ? response.data.length : 0,
      meta: response?.meta,
      firstTeam: response?.data?.[0],
    });
    
    return response.data;
  } catch (error) {
    console.error('Error testing API connection:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    return null;
  }
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

export const metadata: Metadata = {
  title: 'MLB Games',
  description: 'View MLB games and scores',
};

// Main Page component
export default async function Page({ searchParams }: Props) {
  // Await the searchParams promise to get the actual search parameters
  const resolvedSearchParams = await searchParams;

  // Track loading and error states
  let isLoading = true;
  let error: string | null = null;

  // Get the date from resolved search params or use today
  const today = new Date();
  const dateParam = Array.isArray(resolvedSearchParams.date)
    ? resolvedSearchParams.date[0]
    : resolvedSearchParams.date;
  const selectedDate = dateParam ? parseISO(dateParam) : today;
  const formattedSelectedDate = format(selectedDate, 'yyyy-MM-dd');
  const seasonYear = getSeasonYear(selectedDate);

  // Previous and next dates for navigation
  const previousDate = format(subDays(selectedDate, 1), 'yyyy-MM-dd');
  const nextDate = format(addDays(selectedDate, 1), 'yyyy-MM-dd');

  // Test API connection first
  const apiTest = await testApiConnection();
  if (!apiTest) {
    error = "Unable to connect to the MLB API. Please try again later.";
    isLoading = false;
  }

  // Fetch games for the selected date
  const realGames = await getGames(formattedSelectedDate);
  isLoading = false;

  if (!realGames || realGames.length === 0) {
    const date = new Date(formattedSelectedDate);
    const month = date.getMonth();
    const day = date.getDate();
    
    if (month === 0) { // January
      error = `No games available. Spring Training ${seasonYear} starts on February 20.`;
    } else if (month === 1 && day < 20) { // Before February 20
      error = `No games available. Spring Training ${seasonYear} starts on February 20.`;
    } else if (month === 2 && day > 26 && day < 28) { // Between Spring Training and Regular Season
      error = `No games available. Regular Season ${seasonYear} starts on March 28.`;
    } else if (month >= 9) { // October onwards
      error = `Season ${seasonYear - 1} has ended. Spring Training ${seasonYear} starts on February 20.`;
    } else {
      error = `No games scheduled for ${format(selectedDate, 'MMMM d, yyyy')}`;
    }
  }

  // Map API response to UI format with better error handling
  const games = realGames.length > 0 ? realGames.map(game => {
    console.log('Processing game:', game); // Debug log

    // Safely access nested properties
    const homeTeam = game?.home_team || {};
    const awayTeam = game?.away_team || {};
    
    // Format date and time
    let formattedDate = 'TBD';
    let formattedTime = 'TBD';
    try {
      if (game?.date) {
        const gameDate = new Date(game.date);
        formattedDate = format(gameDate, 'MMM d, yyyy');
        formattedTime = game.time || format(gameDate, 'h:mm a');
      }
    } catch (error) {
      console.error('Error formatting date:', error);
    }
    
    // Determine game status
    let gameStatus: 'scheduled' | 'live' | 'finished' = 'scheduled';
    if (game?.status?.toLowerCase().includes('final')) {
      gameStatus = 'finished';
      formattedTime = 'Final';
    } else if (game?.status?.toLowerCase().includes('progress')) {
      gameStatus = 'live';
      formattedTime = 'Live';
    }
    
    // Get venue information
    const venue = homeTeam?.venue_name || 'TBD';
    
    return {
      id: game?.id || Math.random(),
      startTime: formattedTime,
      homeTeam: {
        code: homeTeam?.abbreviation || homeTeam?.name?.substring(0, 3)?.toUpperCase() || 'TBD',
        name: game?.home_team_name || homeTeam?.name || 'TBD',
        score: game?.home_team_score || 0,
      },
      awayTeam: {
        code: awayTeam?.abbreviation || awayTeam?.name?.substring(0, 3)?.toUpperCase() || 'TBD',
        name: game?.away_team_name || awayTeam?.name || 'TBD',
        score: game?.visitor_team_score || 0,
      },
      status: gameStatus,
      venue: venue,
      period: game?.period || 0,
      date: formattedDate
    };
  }) : [];

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
                      <GameCard key={game.id} {...game} />
                    ))
                  ) : (
                    <EmptyState message={`No games scheduled for ${format(selectedDate, 'MMMM d, yyyy')}`} />
                  )}
                </Tabs.Content>

                <Tabs.Content value="live" className="p-4 space-y-3">
                  {games.filter(game => game.status === 'live').length > 0 ? (
                    games.filter(game => game.status === 'live').map((game) => (
                      <GameCard key={game.id} {...game} />
                    ))
                  ) : (
                    <EmptyState message="No live games at the moment" />
                  )}
                </Tabs.Content>

                <Tabs.Content value="finished" className="p-4 space-y-3">
                  {games.filter(game => game.status === 'finished').length > 0 ? (
                    games.filter(game => game.status === 'finished').map((game) => (
                      <GameCard key={game.id} {...game} />
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
            <GameDetailsCard
              homeTeam={{
                code: "LAD",
                name: "Dodgers",
                score: 0
              }}
              awayTeam={{
                code: "CHC",
                name: "Cubs",
                score: 0
              }}
              inning={2}
              hits={{
                home: 0,
                away: 3
              }}
              errors={{
                home: 0,
                away: 0
              }}
              startTime="Today 3:05 PM"
              status="live"
            />
          </div>
        </aside>
      </div>

      {/* Mobile Game Details Sheet */}
      <div className="md:hidden fixed inset-0 z-50">
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300"
          aria-hidden="true"
        />
        <div 
          className="absolute inset-x-0 bottom-0 transform transition-all duration-300 ease-out"
          style={{
            maxHeight: 'calc(100vh - 2rem)',
            height: '85vh'
          }}
        >
          <div className="bg-white rounded-t-2xl h-full flex flex-col">
            {/* Drag Handle */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm pt-3 pb-2 px-4 rounded-t-2xl border-b border-[var(--border-color)]">
              <div className="flex justify-center mb-1">
                <div className="w-12 h-1 rounded-full bg-gray-200"></div>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Game Details</h3>
                <button className="p-1.5 rounded-lg hover:bg-gray-100 text-[var(--text-secondary)]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <GameDetailsCard
                homeTeam={{
                  code: "LAD",
                  name: "Dodgers",
                  score: 0
                }}
                awayTeam={{
                  code: "CHC",
                  name: "Cubs",
                  score: 0
                }}
                inning={2}
                hits={{
                  home: 0,
                  away: 3
                }}
                errors={{
                  home: 0,
                  away: 0
                }}
                startTime="Today 3:05 PM"
                status="live"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}