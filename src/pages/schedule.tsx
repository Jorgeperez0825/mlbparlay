import { GameSchedule } from '@/components/common/GameSchedule';
import { MainLayout } from '@/components/layouts/MainLayout';
import { sampleGames } from '@/data/sampleGames';

export default function Schedule() {
  const handleDateChange = (date: string) => {
    console.log('Date changed:', date);
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