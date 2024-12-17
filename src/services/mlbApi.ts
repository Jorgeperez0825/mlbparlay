import axios from 'axios';

const BASE_URL = 'https://statsapi.mlb.com/api/v1';

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
  status: {
    abstractGameState: string;
    codedGameState: string;
    detailedState: string;
    statusCode: string;
    startTimeTBD: boolean;
  };
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
      score?: number;
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
      score?: number;
    };
  };
  venue: {
    id: number;
    name: string;
  };
  probablePitchers?: {
    away?: {
      id: number;
      fullName: string;
    };
    home?: {
      id: number;
      fullName: string;
    };
  };
  weather?: {
    condition: string;
    temp: number;
  };
  linescore?: any;
  liveData?: any;
}

interface GameDate {
  games: MLBGame[];
}

interface MLBHistoricalData {
  headToHead: MLBGame[];
  playerMatchups: Player[];
  venueStats: VenueStats[];
  recentForm: {
    homeTeam: MLBGame[];
    awayTeam: MLBGame[];
  };
}

interface VenueStats {
  stats: Array<{
    type: string;
    value: number;
  }>;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
  game: MLBGame;
}

interface GameStats {
  stat: {
    era?: number;
    avg?: number;
    hr?: number;
    rbi?: number;
    // ... otros stats necesarios
  };
}

interface Player {
  id: number;
  fullName: string;
  stats: GameStats[];
  game: MLBGame;
}

interface Weather {
  condition: string;
  temp: number;
}

interface MLBResponse<T> {
  dates?: Array<{
    games: T[];
  }>;
  people?: T[];
  venues?: Array<{
    stats: VenueStats[];
  }>;
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

interface MLBApiError {
  message: string;
  code: number;
  details?: any;
}

export class MLBApi {
  private cache: Map<string, CacheItem<any>> = new Map();
  private readonly CACHE_DURATION = 1000 * 60 * 60; // 1 hora

  private getCacheKey(method: string, params: any): string {
    return `${method}-${JSON.stringify(params)}`;
  }

  private getFromCache<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const now = Date.now();
    if (now - item.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  private async makeRequest<T>(endpoint: string, params?: any): Promise<T> {
    try {
      const response = await mlbAxios.get(endpoint, { params });
      
      if (!response.data) {
        throw new Error('No data received from MLB API');
      }
      
      return response.data;
    } catch (error: any) {
      const apiError: MLBApiError = {
        message: error.message || 'Unknown error occurred',
        code: error.response?.status || 500,
        details: error.response?.data
      };

      if (apiError.code === 404) {
        console.error(`MLB API Endpoint not found: ${endpoint}`, params);
        throw new Error(`MLB API endpoint ${endpoint} not available`);
      }

      if (apiError.code === 403) {
        console.error('MLB API access forbidden - check authentication');
        throw new Error('MLB API access denied');
      }

      console.error('MLB API Error:', apiError);
      throw error;
    }
  }

  public async getTodayGames(): Promise<MLBGame[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await mlbAxios.get('/schedule', {
        params: {
          sportId: 1,
          date: today,
          hydrate: 'team,venue,game(content(summary)),probablePitcher,stats,lineup'
        }
      });

      return response.data.dates[0]?.games || [];
    } catch (error) {
      console.error('Error fetching MLB games:', error);
      throw error;
    }
  }

  public async getGamesByDate(date: string): Promise<MLBGame[]> {
    try {
      const response = await mlbAxios.get('/schedule', {
        params: {
          sportId: 1,
          date,
          hydrate: 'team,venue',
          gameTypes: ['R'], // Solo juegos de temporada regular por ahora
        }
      });

      console.log('MLB API Response:', response.data); // Para debug

      if (!response.data.dates || response.data.dates.length === 0) {
        return [];
      }

      return this.mapGamesResponse(response.data.dates[0].games);
    } catch (error) {
      console.error('Error fetching MLB games:', error);
      throw error;
    }
  }

  private mapGamesResponse(games: any[]): MLBGame[] {
    return games.map((game: any) => {
      return {
        gamePk: game.gamePk,
        gameDate: game.gameDate,
        status: {
          abstractGameState: game.status?.abstractGameState || '',
          codedGameState: game.status?.codedGameState || '',
          detailedState: game.status?.detailedState || '',
          statusCode: game.status?.statusCode || '',
          startTimeTBD: game.status?.startTimeTBD || false
        },
        teams: {
          away: {
            team: {
              id: game.teams.away.team.id,
              name: game.teams.away.team.name
            },
            leagueRecord: {
              wins: game.teams.away.leagueRecord?.wins || 0,
              losses: game.teams.away.leagueRecord?.losses || 0
            },
            score: game.teams.away.score
          },
          home: {
            team: {
              id: game.teams.home.team.id,
              name: game.teams.home.team.name
            },
            leagueRecord: {
              wins: game.teams.home.leagueRecord?.wins || 0,
              losses: game.teams.home.leagueRecord?.losses || 0
            },
            score: game.teams.home.score
          }
        },
        venue: {
          id: game.venue.id,
          name: game.venue.name
        }
      };
    });
  }

  public async getGameDetails(gameId: string): Promise<MLBGame> {
    try {
      // Primero intentamos obtener los datos básicos del juego
      const response = await mlbAxios.get('/schedule', {
        params: {
          sportId: 1,
          gamePk: gameId,
          hydrate: 'team,venue,game(content(summary,matchup)),probablePitcher,stats,lineup,flags,linescore'
        }
      });

      if (!response.data.dates || response.data.dates.length === 0 || !response.data.dates[0].games.length) {
        throw new Error('Game not found');
      }

      const gameData = response.data.dates[0].games[0];

      // Intentamos obtener datos adicionales si están disponibles
      try {
        const liveData = await mlbAxios.get(`/game/${gameId}/boxscore`);
        return {
          ...this.mapGameResponse(gameData),
          liveData: liveData.data
        };
      } catch (liveError) {
        // Si no podemos obtener los datos en vivo, devolvemos solo los datos básicos
        console.warn('Could not fetch live game data:', liveError);
        return this.mapGameResponse(gameData);
      }
    } catch (error) {
      console.error('Error fetching game details:', error);
      throw error;
    }
  }

  private mapGameResponse(game: any): MLBGame {
    return {
      gamePk: game.gamePk,
      gameDate: game.gameDate,
      status: {
        abstractGameState: game.status?.abstractGameState || '',
        codedGameState: game.status?.codedGameState || '',
        detailedState: game.status?.detailedState || '',
        statusCode: game.status?.statusCode || '',
        startTimeTBD: game.status?.startTimeTBD || false
      },
      teams: {
        away: {
          team: {
            id: game.teams.away.team.id,
            name: game.teams.away.team.name
          },
          leagueRecord: {
            wins: game.teams.away.leagueRecord?.wins || 0,
            losses: game.teams.away.leagueRecord?.losses || 0
          },
          score: game.teams.away.score
        },
        home: {
          team: {
            id: game.teams.home.team.id,
            name: game.teams.home.team.name
          },
          leagueRecord: {
            wins: game.teams.home.leagueRecord?.wins || 0,
            losses: game.teams.home.leagueRecord?.losses || 0
          },
          score: game.teams.home.score
        }
      },
      venue: {
        id: game.venue.id,
        name: game.venue.name
      },
      probablePitchers: game.gameData?.probablePitchers || {},
      weather: game.gameData?.weather || {},
      linescore: game.linescore || {}
    };
  }

  public async getTeamStats(teamId: string): Promise<any> {
    try {
      const response = await mlbAxios.get(`/teams/${teamId}/stats`, {
        params: {
          stats: 'season,vsTeam,statSplits',
          season: new Date().getFullYear(),
          gameType: 'R'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching team stats:', error);
      // Retornar datos mock por ahora
      return {
        id: parseInt(teamId),
        stats: {
          batting: {
            avg: 0.265,
            ops: 0.780,
            strikeouts: 450,
            homeRuns: 85
          },
          pitching: {
            era: 3.85,
            whip: 1.25,
            strikeouts: 520
          }
        },
        splits: {
          home: { avg: 0.272, ops: 0.795 },
          away: { avg: 0.258, ops: 0.765 }
        }
      };
    }
  }

  public async getHistoricalSeasonData(season: number): Promise<any> {
    try {
      const response = await mlbAxios.get('/schedule', {
        params: {
          sportId: 1,
          season,
          gameTypes: ['R', 'P'], // R para temporada regular, P para playoffs
          hydrate: 'team,stats,standings'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${season} season data:`, error);
      throw error;
    }
  }

  public async getTeamHistoricalStats(teamId: string, startSeason: number, endSeason: number): Promise<any> {
    const cacheKey = this.getCacheKey('teamHistoricalStats', { teamId, startSeason, endSeason });
    const cachedData = this.getFromCache(cacheKey);
    if (cachedData) return cachedData;

    try {
      // Primero verificamos si el equipo existe
      await this.makeRequest(`/teams/${teamId}`);

      const seasons = await Promise.all(
        Array.from({ length: endSeason - startSeason + 1 }, (_, i) => startSeason + i)
          .map(async year => {
            try {
              const data = await this.makeRequest(`/teams/${teamId}/stats`, {
                stats: 'season',
                group: 'hitting,pitching',
                season: year
              });
              
              return {
                year,
                stats: data
              };
            } catch (error) {
              console.warn(`Failed to fetch stats for team ${teamId} in ${year}`);
              return {
                year,
                stats: null,
                error: true
              };
            }
          })
      );

      const validSeasons = seasons.filter(season => !season.error);
      
      if (validSeasons.length === 0) {
        throw new Error(`No historical data available for team ${teamId}`);
      }

      this.setCache(cacheKey, validSeasons);
      return validSeasons;
    } catch (error) {
      console.error('Error fetching historical team stats:', error);
      throw error;
    }
  }

  // Método de utilidad para verificar si un endpoint está disponible
  private async verifyEndpoint(endpoint: string): Promise<boolean> {
    try {
      await mlbAxios.head(endpoint);
      return true;
    } catch {
      return false;
    }
  }

  // Método para obtener las temporadas disponibles para un equipo
  public async getAvailableSeasons(teamId: string): Promise<number[]> {
    try {
      const response = await this.makeRequest('/teams', {
        teamId,
        fields: 'teams,season,active'
      });
      
      return response.teams?.[0]?.seasons?.map((s: any) => s.season) || [];
    } catch (error) {
      console.error('Error fetching available seasons:', error);
      throw error;
    }
  }

  public async getHeadToHeadHistory(
    team1Id: string,
    team2Id: string,
    startSeason: number,
    endSeason: number
  ): Promise<MLBGame[]> {
    const cacheKey = this.getCacheKey('headToHeadHistory', { team1Id, team2Id, startSeason, endSeason });
    const cachedData = this.getFromCache<MLBGame[]>(cacheKey);
    if (cachedData) return cachedData;

    try {
      const responses = await Promise.all(
        Array.from({ length: endSeason - startSeason + 1 }, (_, i) => startSeason + i).map(year =>
          mlbAxios.get('/schedule', {
            params: {
              sportId: 1,
              season: year,
              teamId: team1Id,
              opponentId: team2Id,
              gameTypes: ['R', 'P'],
              hydrate: 'team,stats'
            }
          })
        )
      );

      const games: MLBGame[] = responses.flatMap(response => 
        response.data.dates ? response.data.dates.flatMap((date: GameDate) => date.games) : []
      );

      this.setCache(cacheKey, games);
      return games;
    } catch (error) {
      console.error('Error fetching head-to-head history:', error);
      throw error;
    }
  }

  public async getPlayerHistoricalStats(playerId: string, startSeason: number, endSeason: number): Promise<any> {
    const cacheKey = this.getCacheKey('playerHistoricalStats', { playerId, startSeason, endSeason });
    const cachedData = this.getFromCache(cacheKey);
    if (cachedData) return cachedData;

    try {
      const seasons = await Promise.all(
        Array.from({ length: endSeason - startSeason + 1 }, (_, i) => startSeason + i).map(year =>
          mlbAxios.get(`/people/${playerId}/stats`, {
            params: {
              stats: 'season',
              group: 'hitting,pitching',
              season: year
            }
          }).then(response => ({
            year,
            stats: response.data
          }))
        )
      );

      this.setCache(cacheKey, seasons);
      return seasons;
    } catch (error) {
      console.error('Error fetching player historical stats:', error);
      throw error;
    }
  }

  // Método de prueba para obtener juegos de agosto
  public async getAugustGames(year: number): Promise<MLBGame[]> {
    try {
      const allGames: MLBGame[] = [];
      
      // Obtener juegos para cada día de agosto
      for (let day = 1; day <= 31; day++) {
        const date = `${year}-08-${day.toString().padStart(2, '0')}`;
        console.log(`Buscando juegos para: ${date}`);
        
        const games = await this.getGamesByDate(date);
        allGames.push(...games);
      }

      return allGames;
    } catch (error) {
      console.error('Error fetching August games:', error);
      throw error;
    }
  }

  public async getVenueStats(venueId: string): Promise<any> {
    try {
      const response = await mlbAxios.get(`/venues/${venueId}/stats`, {
        params: {
          season: new Date().getFullYear(),
          gameType: 'R'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching venue stats:', error);
      // Retornar datos mock por ahora
      return {
        id: venueId,
        stats: {
          runs: { avg: 8.5 },
          homeRuns: { avg: 2.1 },
          hits: { avg: 16.3 }
        },
        factors: {
          runs: 1.02,
          homeRuns: 0.98,
          hits: 1.03
        }
      };
    }
  }

  public async getPlayerStats(playerId: string): Promise<any> {
    try {
      const response = await mlbAxios.get(`/people/${playerId}/stats`, {
        params: {
          stats: 'gameLog,vsTeam,statSplits',
          group: 'hitting,pitching',
          season: new Date().getFullYear(),
          gameType: 'R'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching player stats:', error);
      // Retornar datos mock por ahora
      return {
        id: parseInt(playerId),
        name: "Player Name",
        recentForm: {
          lastGames: [
            { innings: 6, strikeouts: 7, earnedRuns: 2, hits: 5 },
            { innings: 5.2, strikeouts: 6, earnedRuns: 3, hits: 6 },
            { innings: 7, strikeouts: 8, earnedRuns: 1, hits: 4 }
          ]
        },
        vsTeam: {
          era: 3.45,
          strikeouts: 45,
          innings: 38,
          games: 6
        },
        atVenue: {
          era: 3.12,
          strikeouts: 28,
          innings: 24,
          games: 4
        }
      };
    }
  }

  public async getGameById(gameId: string): Promise<MLBGame> {
    try {
      // Cambiamos el endpoint para usar el formato correcto de la API de MLB
      const response = await mlbAxios.get(`/schedule`, {
        params: {
          gamePk: gameId,
          hydrate: 'game(content(summary)),probablePitcher,linescore,venue,weather,stats'
        }
      });

      // Verificar si hay datos del juego
      if (!response.data.dates?.[0]?.games?.[0]) {
        throw new Error('Game not found');
      }

      const gameData = response.data.dates[0].games[0];
      
      // Mapear la respuesta al formato MLBGame
      return {
        gamePk: gameData.gamePk,
        gameDate: gameData.gameDate,
        status: {
          abstractGameState: gameData.status.abstractGameState,
          codedGameState: gameData.status.codedGameState,
          detailedState: gameData.status.detailedState,
          statusCode: gameData.status.statusCode,
          startTimeTBD: gameData.status.startTimeTBD
        },
        teams: {
          away: {
            team: {
              id: gameData.teams.away.team.id,
              name: gameData.teams.away.team.name
            },
            leagueRecord: gameData.teams.away.leagueRecord || { wins: 0, losses: 0 },
            score: gameData.teams.away.score
          },
          home: {
            team: {
              id: gameData.teams.home.team.id,
              name: gameData.teams.home.team.name
            },
            leagueRecord: gameData.teams.home.leagueRecord || { wins: 0, losses: 0 },
            score: gameData.teams.home.score
          }
        },
        venue: {
          id: gameData.venue.id,
          name: gameData.venue.name
        },
        probablePitchers: {
          away: gameData.teams.away.probablePitcher ? {
            id: gameData.teams.away.probablePitcher.id,
            fullName: gameData.teams.away.probablePitcher.fullName
          } : undefined,
          home: gameData.teams.home.probablePitcher ? {
            id: gameData.teams.home.probablePitcher.id,
            fullName: gameData.teams.home.probablePitcher.fullName
          } : undefined
        },
        weather: gameData.weather ? {
          condition: gameData.weather.condition,
          temp: gameData.weather.temp
        } : undefined,
        linescore: gameData.linescore,
        liveData: gameData
      };
    } catch (error) {
      console.error('Error fetching game by ID:', error);
      // Si es un error de red, intentar con datos mock para desarrollo
      if (process.env.NODE_ENV === 'development') {
        return this.getMockGameData(gameId);
      }
      throw error;
    }
  }

  // Método auxiliar para datos mock durante desarrollo
  private getMockGameData(gameId: string): MLBGame {
    return {
      gamePk: parseInt(gameId),
      gameDate: new Date().toISOString(),
      status: {
        abstractGameState: "Preview",
        codedGameState: "P",
        detailedState: "Scheduled",
        statusCode: "S",
        startTimeTBD: false
      },
      teams: {
        away: {
          team: {
            id: 1,
            name: "New York Yankees"
          },
          leagueRecord: { wins: 80, losses: 65 },
          score: 0
        },
        home: {
          team: {
            id: 2,
            name: "Boston Red Sox"
          },
          leagueRecord: { wins: 75, losses: 70 },
          score: 0
        }
      },
      venue: {
        id: 1,
        name: "Fenway Park"
      },
      probablePitchers: {
        away: {
          id: 123,
          fullName: "Gerrit Cole"
        },
        home: {
          id: 456,
          fullName: "Chris Sale"
        }
      },
      weather: {
        condition: "Clear",
        temp: 72
      }
    };
  }
}

export const mlbApi = new MLBApi(); 