import GameCard from "@/components/mlb/GameCard";
import * as Tabs from '@radix-ui/react-tabs';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

const sampleGames = [
  {
    id: 1,
    startTime: "7:10 PM",
    homeTeam: {
      code: "BOS",
      name: "Red Sox",
    },
    awayTeam: {
      code: "NYY",
      name: "Yankees",
    },
    status: "scheduled" as const,
  },
  {
    id: 2,
    startTime: "Live",
    homeTeam: {
      code: "LAD",
      name: "Dodgers",
      score: 3,
    },
    awayTeam: {
      code: "SF",
      name: "Giants",
      score: 2,
    },
    status: "live" as const,
  },
  {
    id: 3,
    startTime: "Final",
    homeTeam: {
      code: "HOU",
      name: "Astros",
      score: 5,
    },
    awayTeam: {
      code: "TEX",
      name: "Rangers",
      score: 4,
    },
    status: "finished" as const,
  },
];

export default function Home() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Sidebar - Leagues/Favorites */}
      <aside className="lg:col-span-2">
        <div className="card p-4">
          <h2 className="section-title">Leagues</h2>
          <nav className="space-y-2">
            <a href="#" className="block px-3 py-2 rounded-md bg-black text-white font-medium">
              MLB
            </a>
          </nav>
        </div>
      </aside>

      {/* Main Content - Games */}
      <main className="lg:col-span-7">
        <div className="card">
          {/* Date Navigation */}
          <div className="p-4 border-b border-[var(--border-color)]">
            <div className="flex items-center justify-between">
              <button className="p-2 hover:bg-[var(--accent-color)] rounded-md transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">{format(new Date(), 'EEEE, MMMM d')}</span>
              </div>
              <button className="p-2 hover:bg-[var(--accent-color)] rounded-md transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs.Root defaultValue="all" className="flex flex-col">
            <Tabs.List className="flex border-b border-[var(--border-color)]">
              <Tabs.Trigger
                value="all"
                className="flex-1 px-4 py-3 text-sm text-center transition-colors data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black text-[var(--text-secondary)] hover:text-black"
              >
                All Games
              </Tabs.Trigger>
              <Tabs.Trigger
                value="live"
                className="flex-1 px-4 py-3 text-sm text-center transition-colors data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black text-[var(--text-secondary)] hover:text-black"
              >
                Live
              </Tabs.Trigger>
              <Tabs.Trigger
                value="finished"
                className="flex-1 px-4 py-3 text-sm text-center transition-colors data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black text-[var(--text-secondary)] hover:text-black"
              >
                Finished
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="all" className="p-4 space-y-4">
              {sampleGames.map((game) => (
                <GameCard key={game.id} {...game} />
              ))}
            </Tabs.Content>

            <Tabs.Content value="live" className="p-4 space-y-4">
              {sampleGames.filter(game => game.status === 'live').map((game) => (
                <GameCard key={game.id} {...game} />
              ))}
            </Tabs.Content>

            <Tabs.Content value="finished" className="p-4 space-y-4">
              {sampleGames.filter(game => game.status === 'finished').map((game) => (
                <GameCard key={game.id} {...game} />
              ))}
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </main>

      {/* Right Sidebar - Stats/News */}
      <aside className="lg:col-span-3 space-y-6">
        <div className="card p-4">
          <h2 className="section-title">League Leaders</h2>
          <div className="space-y-4">
            <div className="p-3 rounded-md bg-white border border-[var(--border-color)]">
              <div className="text-xs text-[var(--text-secondary)] mb-2">Home Runs</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-[var(--accent-color)] rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-black">NYY</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-black">Aaron Judge</div>
                    <div className="text-xs text-[var(--text-secondary)]">Yankees</div>
                  </div>
                </div>
                <div className="text-lg font-bold text-black">37</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <h2 className="section-title">Recent News</h2>
          <div className="space-y-4">
            <div className="text-sm">
              <div className="text-[var(--text-secondary)] hover:text-black cursor-pointer transition-colors">
                Judge hits 3 HRs as Yankees sweep Red Sox
              </div>
              <div className="text-xs mt-1 text-[var(--text-secondary)]">2 hours ago</div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
