import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { MLBGame, mlbApi } from '@/services/mlbApi';
import { MainLayout } from '@/components/layouts/MainLayout';
import { 
  FireIcon as FireIconOutline,
  ChartBarIcon as ChartBarIconOutline,
  UserIcon as UserIconOutline,
  ArrowTrendingUpIcon as TrendingUpIconOutline
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { bettingApi } from '@/services/bettingApi';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [hotBets, setHotBets] = useState([]);
  const [trendingRecords, setTrendingRecords] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [bets, records, searches] = await Promise.all([
          bettingApi.getHotBets(),
          bettingApi.getRecordChases(),
          bettingApi.getPopularSearches()
        ]);

        setHotBets(bets);
        setTrendingRecords(records);
        setPopularSearches(searches);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">MLB Betting Trends</h1>
          <p className="mt-2 text-sm text-gray-500">
            Real-time insights and most popular bets across the league
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Hot Bets Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-[#041E42] to-[#002D72] px-6 py-4">
              <div className="flex items-center gap-2">
                <FireIconOutline className="h-6 w-6 text-red-500" />
                <h2 className="text-xl font-bold text-white">Hottest Bets Right Now</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {hotBets.map((bet, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {bet.type}
                        </span>
                        <h3 className="mt-2 text-lg font-semibold text-gray-900">{bet.description}</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-[#041E42]">{bet.odds}</span>
                        <div className="text-sm text-gray-500 mt-1">{bet.volume}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUpIconOutline className="h-4 w-4" />
                        <span className="text-sm font-medium">{bet.trend}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Confidence</span>
                        <div className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
                          {bet.confidence}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Record Chases Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-[#041E42] to-[#002D72] px-6 py-4">
              <div className="flex items-center gap-2">
                <ChartBarIconOutline className="h-6 w-6 text-yellow-400" />
                <h2 className="text-xl font-bold text-white">Record Chases</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {trendingRecords.map((record, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{record.player}</h3>
                        <p className="text-sm text-gray-500">{record.record}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-[#041E42]">{record.odds}</span>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="text-sm font-medium text-gray-700">{record.current}</div>
                    </div>
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                        <div
                          style={{ width: `${record.progress}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                        ></div>
                      </div>
                      <div className="text-right mt-1">
                        <span className="text-sm font-medium text-gray-500">{record.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Popular Searches Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-[#041E42] to-[#002D72] px-6 py-4">
            <div className="flex items-center gap-2">
              <UserIconOutline className="h-6 w-6 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Most Searched Props</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {popularSearches.map((search, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{search.term}</h3>
                    {search.trending && (
                      <TrendingUpIconOutline className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{search.volume}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
