import axios from 'axios';

const BASE_URL = 'https://statsapi.mlb.com/api/v1';

// Create an axios instance with base configuration
const mlbAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export interface MLBGame {
  gamePk: number;
  gameDate: string;
  teams: {
    away: {
      team: {
        id: number;
        name: string;
      };
      leagueRecord: {
        wins: number;
        losses: number;
      };
    };
    home: {
      team: {
        id: number;
        name: string;
      };
      leagueRecord: {
        wins: number;
        losses: number;
      };
    };
  };
  venue: {
    id: number;
    name: string;
  };
}

interface MLBHistoricalData {
  headToHead: any[];
  playerMatchups: any[];
  venueStats: any[];
  recentForm: any[];
}

class MLBApi {
  private async get(endpoint: string) {
    try {
      const response = await mlbAxios.get(endpoint);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('MLB API Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url
        });
        
        if (error.response?.status === 404) {
          throw new Error('MLB API: Resource not found');
        }
        if (error.code === 'ECONNABORTED') {
          throw new Error('MLB API: Request timeout');
        }
        if (error.code === 'ERR_NETWORK') {
          throw new Error('MLB API: Network error - Check your internet connection');
        }
      }
      throw error;
    }
  }

  public async getTodayGames(): Promise<{ dates: { games: MLBGame[] }[] }> {
    try {
      const today = new Date().toISOString().split('T')[0];
      // Use hydrate to get additional data in a single request
      const endpoint = `/schedule?sportId=1&date=${today}&hydrate=team,venue,game(content(summary)),probablePitcher,stats`;
      return await this.get(endpoint);
    } catch (error) {
      console.error('Error fetching today games:', error);
      return { dates: [] }; // Return a valid object in case of error
    }
  }

  public async getGame(gameId: string): Promise<MLBGame> {
    try {
      const response = await this.get(`/game/${gameId}/feed/live`);
      return response.gameData;
    } catch (error) {
      console.error(`Error fetching game ${gameId}:`, error);
      throw error;
    }
  }

  public async getHistoricalData(gameId: string): Promise<MLBHistoricalData> {
    try {
      const game = await this.getGame(gameId);
      const homeTeamId = game.teams.home.team.id;
      const awayTeamId = game.teams.away.team.id;
      const currentYear = new Date().getFullYear();

      // Fetch last 10 head-to-head games
      const headToHead = await this.get(
        `/schedule?sportId=1&teamId=${homeTeamId}&oppTeamId=${awayTeamId}&season=${currentYear}&gameType=R&hydrate=decisions,probablePitcher,linescore,stats`
      );

      // Fetch player matchups
      const playerMatchups = await this.get(
        `/people?personIds=${game.teams.home.team.id},${game.teams.away.team.id}&hydrate=stats(group=[hitting,pitching],type=[vsPlayer,statSplits],sitCodes=[h,a],season=${currentYear})`
      );

      // Fetch venue stats
      const venueStats = await this.get(
        `/venues/${game.venue.id}?hydrate=stats(group=[venue],season=${currentYear})`
      );

      // Fetch recent form (last 10 games for each team)
      const [homeTeamForm, awayTeamForm] = await Promise.all([
        this.get(`/schedule?sportId=1&teamId=${homeTeamId}&season=${currentYear}&gameType=R&limit=10&hydrate=decisions,probablePitcher,linescore,stats`),
        this.get(`/schedule?sportId=1&teamId=${awayTeamId}&season=${currentYear}&gameType=R&limit=10&hydrate=decisions,probablePitcher,linescore,stats`)
      ]);

      return {
        headToHead: headToHead.dates?.flatMap((d: any) => d.games) || [],
        playerMatchups: playerMatchups.people || [],
        venueStats: venueStats.venues?.[0]?.stats || [],
        recentForm: {
          homeTeam: homeTeamForm.dates?.flatMap((d: any) => d.games) || [],
          awayTeam: awayTeamForm.dates?.flatMap((d: any) => d.games) || []
        }
      };
    } catch (error) {
      console.error(`Error fetching historical data for game ${gameId}:`, error);
      throw error;
    }
  }
}

export const mlbApi = new MLBApi(); 