import { GameSchedule } from '@/components/common/GameSchedule';
import { MainLayout } from '@/components/layouts/MainLayout';
import { sampleGames } from '@/data/sampleGames';
import { useState } from 'react';

export default function Schedule() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <MainLayout>
      <GameSchedule 
        games={sampleGames} 
        onDateChange={handleDateChange}
      />
    </MainLayout>
  );
} 