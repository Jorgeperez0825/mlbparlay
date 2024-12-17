import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { MLBGame } from '@/services/mlbApi';

interface GameCalendarProps {
  games: MLBGame[];
  onDateChange: (date: string) => void;
}

export const GameCalendar = ({ games, onDateChange }: GameCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
    onDateChange(newDate.toISOString().split('T')[0]);
  };

  const formatDate = (date: Date) => {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()]
    };
  };

  const formattedDate = formatDate(selectedDate);

  return (
    <div className="bg-[#041E42] text-white">
      {/* Date Navigation */}
      <div className="flex items-center justify-between p-4 border-b border-[#1A365D]">
        <button
          onClick={() => changeDate(-1)}
          className="p-1 hover:bg-[#1A365D] rounded-full transition-colors"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        
        <div className="text-center">
          <div className="text-sm font-medium">{formattedDate.day}</div>
          <div className="text-lg font-bold">{formattedDate.date}</div>
          <div className="text-sm">{formattedDate.month}</div>
        </div>

        <button
          onClick={() => changeDate(1)}
          className="p-1 hover:bg-[#1A365D] rounded-full transition-colors"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Games List */}
      <div className="divide-y divide-[#1A365D] max-h-[calc(100vh-200px)] overflow-y-auto">
        {games.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            No games scheduled for this date
          </div>
        ) : (
          games.map((game) => (
            <Link
              key={game.gamePk}
              href={`/analysis/${game.gamePk}`}
              className="block p-4 hover:bg-[#1A365D] transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <Image
                    src={`https://www.mlbstatic.com/team-logos/${game.teams.away.team.id}.svg`}
                    alt={game.teams.away.team.name}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                  <span className="text-sm">{game.teams.away.team.name}</span>
                </div>
                <span className="text-sm font-medium">
                  ({game.teams.away.leagueRecord.wins}-{game.teams.away.leagueRecord.losses})
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Image
                    src={`https://www.mlbstatic.com/team-logos/${game.teams.home.team.id}.svg`}
                    alt={game.teams.home.team.name}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                  <span className="text-sm">{game.teams.home.team.name}</span>
                </div>
                <span className="text-sm font-medium">
                  ({game.teams.home.leagueRecord.wins}-{game.teams.home.leagueRecord.losses})
                </span>
              </div>

              <div className="mt-2 text-xs text-gray-400">
                {new Date(game.gameDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {' - '}
                {game.venue.name}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}; 