import { MLBGame } from './mlbApi';

interface GameAnalysis {
  prediction: {
    winner: string;
    confidence: number;
    predictedScore: {
      home: number;
      away: number;
    };
  };
  keyFactors: string[];
  analysis: {
    pitching: string;
    batting: string;
    historical: string;
    weather: string;
    injuries: string;
  };
  bettingAdvice: {
    recommendation: string;
    moneyline: string;
    spread: string;
    overUnder: string;
    confidence: number;
  };
}

interface AnalysisRequest {
  gameId: string;
  date: string;
  teams: {
    home: string;
    away: string;
  };
  // ... otros campos necesarios
}

interface AnalysisResponse {
  prediction: string;
  confidence: number;
  factors: string[];
  // ... otros campos necesarios
}

export class MLBAnalyzer {
  async analyzeGame(data: AnalysisRequest): Promise<AnalysisResponse> {
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to analyze game');
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  }

  private getLastTenRecord(games: MLBGame[]): string {
    let wins = 0;
    games.slice(0, 10).forEach(game => {
      const isHomeTeam = game.teams.home.team.id === games[0].teams.home.team.id;
      const teamScore = isHomeTeam ? game.teams.home.score : game.teams.away.score;
      const opponentScore = isHomeTeam ? game.teams.away.score : game.teams.home.score;
      
      if (teamScore > opponentScore) {
        wins++;
      }
    });
    return `${wins}-${10-wins}`;
  }

  private getHeadToHeadRecord(games: MLBGame[]): string {
    let homeWins = 0;
    let awayWins = 0;

    games.forEach(game => {
      if (game.teams.home.score > game.teams.away.score) {
        homeWins++;
      } else if (game.teams.away.score > game.teams.home.score) {
        awayWins++;
      }
    });

    return `${homeWins}-${awayWins}`;
  }

  private formatInjuries(injuries: { home: any[], away: any[] }): string {
    const formatTeamInjuries = (players: any[]) => {
      return players.map(player => 
        `${player.person.fullName} (${player.status.description})`
      ).join(', ');
    };

    return `
      Home Team: ${formatTeamInjuries(injuries.home)}
      Away Team: ${formatTeamInjuries(injuries.away)}
    `;
  }
}

export const mlbAnalyzer = new MLBAnalyzer(); 