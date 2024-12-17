import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { MLBGame } from '@/services/mlbApi';

interface GameScheduleProps {
  games: MLBGame[];
  onDateChange: (date: string) => void;
}

export const GameSchedule = ({ games, onDateChange }: GameScheduleProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const getDates = () => {
    const dates = [];
    for (let i = -3; i <= 3; i++) {
      const date = new Date(selectedDate);
      date.setDate(selectedDate.getDate() + i);
      dates.push(date);
    }
    return dates;
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

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
    onDateChange(newDate.toISOString().split('T')[0]);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onDateChange(date.toISOString().split('T')[0]);
    setIsCalendarOpen(false);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const getGameStatus = (gameDate: string) => {
    const now = new Date();
    const gameTime = new Date(gameDate);
    
    if (gameTime > now) {
      return 'upcoming';
    } else {
      return 'live';
    }
  };

  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  return (
    <div className="bg-white">
      {/* Calendar Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-[#041E42]">MLB Schedule</h2>
            <div className="relative">
              <button
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="flex items-center space-x-2 text-sm text-gray-500 hover:text-[#041E42] transition-colors"
              >
                <CalendarIcon className="h-5 w-5" />
                <span>
                  {selectedDate.toLocaleDateString('en-US', { 
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </button>

              {/* Calendar Dropdown */}
              {isCalendarOpen && (
                <>
                  <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-50"
                    onClick={() => setIsCalendarOpen(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80 z-50">
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => {
                          const newDate = new Date(selectedDate);
                          newDate.setMonth(selectedDate.getMonth() - 1);
                          setSelectedDate(newDate);
                        }}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <ChevronLeftIcon className="h-5 w-5" />
                      </button>
                      <div className="font-medium">
                        {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </div>
                      <button
                        onClick={() => {
                          const newDate = new Date(selectedDate);
                          newDate.setMonth(selectedDate.getMonth() + 1);
                          setSelectedDate(newDate);
                        }}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <ChevronRightIcon className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                        <div key={day} className="text-xs font-medium text-gray-500">
                          {day}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {generateCalendarDays().map((date, index) => (
                        <button
                          key={index}
                          onClick={() => date && handleDateSelect(date)}
                          disabled={!date}
                          className={`
                            p-2 text-sm rounded-full
                            ${!date ? 'text-gray-300' : 
                              isSelected(date)
                                ? 'bg-[#041E42] text-white'
                                : isToday(date)
                                  ? 'bg-blue-50 text-blue-600'
                                  : 'hover:bg-gray-100'
                            }
                          `}
                        >
                          {date?.getDate()}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => changeDate(-7)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={() => changeDate(7)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRightIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Date Selector */}
        <div className="flex border-t border-gray-200">
          {getDates().map((date) => {
            const formatted = formatDate(date);
            return (
              <button
                key={date.toISOString()}
                onClick={() => handleDateSelect(date)}
                className={`flex-1 py-3 relative ${
                  isSelected(date)
                    ? 'bg-[#041E42] text-white'
                    : isToday(date)
                    ? 'bg-blue-50'
                    : 'hover:bg-gray-50'
                } transition-colors`}
              >
                <div className="text-xs font-medium">{formatted.day}</div>
                <div className="text-2xl font-bold mt-1">{formatted.date}</div>
                <div className="text-xs mt-1">{formatted.month}</div>
                {isToday(date) && !isSelected(date) && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Games List */}
      <div className="divide-y divide-gray-100">
        {games.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-gray-400 text-lg">No games scheduled for this date</div>
            <p className="text-gray-500 text-sm mt-2">Select another date to view games</p>
          </div>
        ) : (
          games.map((game) => {
            const status = getGameStatus(game.gameDate);
            return (
              <Link
                key={game.gamePk}
                href={`/research/${game.gamePk}`}
                className="block hover:bg-gray-50 transition-colors"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {status === 'live' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          LIVE
                        </span>
                      )}
                      <div className="text-sm text-gray-500">
                        {new Date(game.gameDate).toLocaleTimeString([], { 
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true 
                        })}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {game.venue.name}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 items-center">
                    {/* Away Team */}
                    <div className="flex items-center space-x-4">
                      <Image
                        src={`https://www.mlbstatic.com/team-logos/${game.teams.away.team.id}.svg`}
                        alt={game.teams.away.team.name}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                      <div>
                        <div className="font-bold text-lg">{game.teams.away.team.name}</div>
                        <div className="text-sm text-gray-500">
                          ({game.teams.away.leagueRecord.wins}-{game.teams.away.leagueRecord.losses})
                        </div>
                      </div>
                    </div>

                    {/* VS */}
                    <div className="text-center">
                      <span className="text-2xl font-bold text-gray-300">VS</span>
                    </div>

                    {/* Home Team */}
                    <div className="flex items-center justify-end space-x-4">
                      <div className="text-right">
                        <div className="font-bold text-lg">{game.teams.home.team.name}</div>
                        <div className="text-sm text-gray-500">
                          ({game.teams.home.leagueRecord.wins}-{game.teams.home.leagueRecord.losses})
                        </div>
                      </div>
                      <Image
                        src={`https://www.mlbstatic.com/team-logos/${game.teams.home.team.id}.svg`}
                        alt={game.teams.home.team.name}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button 
                      className="inline-flex items-center px-6 py-2.5 border-2 border-[#041E42] text-base font-bold rounded-lg 
                      text-white bg-[#041E42] hover:bg-[#E31837] hover:border-[#E31837] transition-all duration-200 
                      transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Create Parlay
                    </button>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}; 