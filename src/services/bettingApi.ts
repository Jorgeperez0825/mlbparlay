import axios from 'axios';

const ODDS_API_KEY = process.env.NEXT_PUBLIC_ODDS_API_KEY;
const ACTION_NETWORK_API_KEY = process.env.NEXT_PUBLIC_ACTION_NETWORK_API_KEY;

interface BettingTrend {
  type: string;
  description: string;
  odds: string;
  volume: string;
  trend: string;
  confidence: number;
}

interface RecordChase {
  player: string;
  record: string;
  current: string;
  odds: string;
  progress: number;
}

interface PopularSearch {
  term: string;
  volume: string;
  trending: boolean;
}

class BettingAPI {
  private readonly oddsApiClient;
  private readonly actionNetworkClient;

  constructor() {
    this.oddsApiClient = axios.create({
      baseURL: 'https://api.the-odds-api.com/v4',
      params: { apiKey: ODDS_API_KEY }
    });

    this.actionNetworkClient = axios.create({
      baseURL: 'https://api.actionnetwork.com/web/v1',
      headers: { 'Authorization': `Bearer ${ACTION_NETWORK_API_KEY}` }
    });
  }

  public async getHotBets(): Promise<BettingTrend[]> {
    try {
      // En un entorno real, obtendríamos esto de la API
      // Por ahora, retornamos datos de ejemplo
      return [
        {
          type: "Player Prop",
          description: "Shohei Ohtani Over 1.5 Total Bases",
          odds: "+105",
          volume: "12.5K bets",
          trend: "+25% last hour",
          confidence: 85
        },
        {
          type: "Team Prop",
          description: "Yankees Team Total Over 4.5 Runs",
          odds: "-110",
          volume: "8.2K bets",
          trend: "+15% last hour",
          confidence: 78
        },
        {
          type: "Pitcher Prop",
          description: "Gerrit Cole Over 7.5 Strikeouts",
          odds: "-120",
          volume: "6.8K bets",
          trend: "+18% last hour",
          confidence: 82
        }
      ];
    } catch (error) {
      console.error('Error fetching hot bets:', error);
      return [];
    }
  }

  public async getRecordChases(): Promise<RecordChase[]> {
    try {
      // Aquí combinaríamos datos de MLB Stats API con odds de las casas de apuestas
      return [
        {
          player: "Ronald Acuña Jr.",
          record: "40/40 Season",
          current: "30 HR, 35 SB",
          odds: "+150",
          progress: 75
        },
        {
          player: "Shohei Ohtani",
          record: "60 HR Season",
          current: "35 HR",
          odds: "+275",
          progress: 58
        },
        {
          player: "Freddie Freeman",
          record: "60 Doubles Season",
          current: "40 2B",
          odds: "+225",
          progress: 66
        }
      ];
    } catch (error) {
      console.error('Error fetching record chases:', error);
      return [];
    }
  }

  public async getPopularSearches(): Promise<PopularSearch[]> {
    try {
      // En producción, esto vendría de un servicio de analytics
      return [
        {
          term: "Home Run Props",
          volume: "25K searches",
          trending: true
        },
        {
          term: "Strikeout Props",
          volume: "18K searches",
          trending: true
        },
        {
          term: "Run Line Bets",
          volume: "15K searches",
          trending: false
        }
      ];
    } catch (error) {
      console.error('Error fetching popular searches:', error);
      return [];
    }
  }

  public async getGameOdds(gameId: string) {
    try {
      const response = await this.oddsApiClient.get(`/sports/baseball_mlb/events/${gameId}/odds`);
      return response.data;
    } catch (error) {
      console.error('Error fetching game odds:', error);
      throw error;
    }
  }

  public async getBettingTrends(gameId: string) {
    try {
      const response = await this.actionNetworkClient.get(`/games/${gameId}/trends`);
      return response.data;
    } catch (error) {
      console.error('Error fetching betting trends:', error);
      throw error;
    }
  }
}

export const bettingApi = new BettingAPI(); 