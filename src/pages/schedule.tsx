import { useEffect, useState } from 'react';
import { GameSchedule } from '@/components/common/GameSchedule';
import { MainLayout } from '@/components/layouts/MainLayout';
import { mlbApi, MLBGame } from '@/services/mlbApi';

export default function Schedule() {
  const [games, setGames] = useState<MLBGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = async (date: string) => {
    try {
      setLoading(true);
      setError(null);
      const gamesData = await mlbApi.getGamesByDate(date);
      console.log('Juegos obtenidos:', gamesData); // Para debug
      setGames(gamesData);
    } catch (err) {
      setError('Error al cargar los juegos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Cargar juegos del día actual al inicio
    const today = new Date().toISOString().split('T')[0];
    fetchGames(today);
  }, []);

  const handleDateChange = (date: string) => {
    fetchGames(date);
  };

  if (error) {
    return (
      <MainLayout>
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => fetchGames(new Date().toISOString().split('T')[0])}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Reintentar
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <GameSchedule 
        games={games}
        onDateChange={handleDateChange}
        isLoading={loading}
      />
    </MainLayout>
  );
} 