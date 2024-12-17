import { MLBGame, mlbApi } from './mlbApi';

interface PlayerStats {
  id: number;
  name: string;
  recentForm: {
    lastGames: {
      hits: number;
      atBats: number;
      homeRuns: number;
      strikeouts: number;
    }[];
    streak: {
      hitting: number;
      homers: number;
    };
  };
  vsTeam: {
    avg: number;
    hits: number;
    homeRuns: number;
    atBats: number;
  };
  vsVenue: {
    avg: number;
    ops: number;
    games: number;
  };
}

interface PitcherStats {
  id: number;
  name: string;
  recentForm: {
    lastGames: {
      innings: number;
      strikeouts: number;
      earnedRuns: number;
      hits: number;
    }[];
  };
  vsTeam: {
    era: number;
    strikeouts: number;
    innings: number;
    games: number;
  };
  atVenue: {
    era: number;
    strikeouts: number;
    innings: number;
    games: number;
  };
}

interface BettingStrategy {
  id: string;
  type: 'PLAYER_PROP' | 'TEAM_PROP' | 'GAME_PROP';
  name: string;
  description: string;
  confidence: number; // 0-100
  odds: string;
  analysis: string;
  data: {
    player?: PlayerStats;
    pitcher?: PitcherStats;
    prediction: number;
    probability: number;
  };
}

export class AnalysisService {
  // Método principal de análisis
  async analyzeGame(game: MLBGame): Promise<BettingStrategy[]> {
    try {
      const [
        homeTeamStats,
        awayTeamStats,
        homePitcherStats,
        awayPitcherStats,
        venueStats,
        recentMatchups
      ] = await Promise.all([
        this.getTeamStats(game.teams.home.team.id),
        this.getTeamStats(game.teams.away.team.id),
        this.getPitcherStats(game.probablePitchers?.home?.id),
        this.getPitcherStats(game.probablePitchers?.away?.id),
        this.getVenueStats(game.venue.id),
        this.getRecentMatchups(game.teams.home.team.id, game.teams.away.team.id)
      ]);

      const strategies: BettingStrategy[] = [];

      // Análisis de pitchers
      if (homePitcherStats && awayPitcherStats) {
        strategies.push(
          this.analyzePitcherMatchup(homePitcherStats, awayPitcherStats, venueStats),
          ...this.generateStrikeoutProps(homePitcherStats, awayTeamStats),
          ...this.generateStrikeoutProps(awayPitcherStats, homeTeamStats)
        );
      }

      // Análisis de bateadores
      strategies.push(
        ...this.analyzeHitterMatchups(homeTeamStats, awayPitcherStats),
        ...this.analyzeHitterMatchups(awayTeamStats, homePitcherStats)
      );

      strategies.push(
        ...this.analyzeVenueTrends(venueStats, homeTeamStats, awayTeamStats),
        ...this.analyzeRecentMatchups(recentMatchups)
      );

      return strategies.sort((a, b) => b.confidence - a.confidence);
    } catch (error) {
      console.error('Error analyzing game:', error);
      throw error;
    }
  }

  // Métodos de obtención de datos
  private async getTeamStats(teamId: number): Promise<any> {
    return mlbApi.getTeamStats(teamId.toString());
  }

  private async getPitcherStats(pitcherId?: number): Promise<PitcherStats | null> {
    if (!pitcherId) return null;
    return mlbApi.getPlayerStats(pitcherId.toString());
  }

  private async getVenueStats(venueId: number): Promise<any> {
    return mlbApi.getVenueStats(venueId.toString());
  }

  private async getRecentMatchups(team1Id: number, team2Id: number): Promise<any> {
    return mlbApi.getHeadToHeadHistory(team1Id.toString(), team2Id.toString(), 2023, 2023);
  }

  // Métodos de análisis
  private analyzePitcherMatchup(
    homePitcher: PitcherStats,
    awayPitcher: PitcherStats,
    venueStats: any
  ): BettingStrategy {
    const homeRecentPerformance = this.calculatePitcherForm(homePitcher.recentForm.lastGames);
    const awayRecentPerformance = this.calculatePitcherForm(awayPitcher.recentForm.lastGames);

    const confidence = this.calculateConfidence([
      homeRecentPerformance.consistency,
      awayRecentPerformance.consistency,
      homePitcher.atVenue.era < 4.0 ? 0.7 : 0.3,
      awayPitcher.atVenue.era < 4.0 ? 0.7 : 0.3
    ]);

    return {
      id: `pitcher_matchup_${homePitcher.id}_${awayPitcher.id}`,
      type: 'GAME_PROP',
      name: 'Pitcher Matchup Analysis',
      description: `${homePitcher.name} vs ${awayPitcher.name}`,
      confidence,
      odds: this.calculateOdds(confidence),
      analysis: this.generatePitcherAnalysis(homePitcher, awayPitcher, venueStats),
      data: {
        pitcher: homePitcher,
        prediction: homeRecentPerformance.expectedERA,
        probability: confidence / 100
      }
    };
  }

  private generateStrikeoutProps(pitcher: PitcherStats, opposingTeam: any): BettingStrategy[] {
    const avgStrikeouts = this.calculateAverageStrikeouts(pitcher.recentForm.lastGames);
    const teamStrikeoutRate = this.getTeamStrikeoutRate(opposingTeam);
    
    const confidence = this.calculateConfidence([
      avgStrikeouts > 6 ? 0.8 : 0.4,
      teamStrikeoutRate > 0.23 ? 0.7 : 0.3,
      pitcher.atVenue.strikeouts / pitcher.atVenue.innings > 1.0 ? 0.6 : 0.4
    ]);

    return [{
      id: `strikeouts_over_${pitcher.id}`,
      type: 'PLAYER_PROP',
      name: `${pitcher.name} Strikeouts Over`,
      description: 'Pitcher strikeout total prediction',
      confidence,
      odds: this.calculateOdds(confidence),
      analysis: this.generateStrikeoutAnalysis(pitcher, opposingTeam, avgStrikeouts),
      data: {
        pitcher,
        prediction: avgStrikeouts,
        probability: confidence / 100
      }
    }];
  }

  // Métodos de utilidad
  private calculatePitcherForm(games: PitcherStats['recentForm']['lastGames']) {
    const eras = games.map(g => (g.earnedRuns * 9) / g.innings);
    return {
      expectedERA: eras.reduce((a, b) => a + b, 0) / eras.length,
      consistency: this.calculateConsistency(eras)
    };
  }

  private calculateConsistency(values: number[]): number {
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / values.length;
    return 1 - Math.min(Math.sqrt(variance) / avg, 1);
  }

  private calculateConfidence(factors: number[]): number {
    return Math.round(
      factors.reduce((a, b) => a + b, 0) / factors.length * 100
    );
  }

  private calculateOdds(confidence: number): string {
    const baseOdds = confidence > 65 ? -110 : +110;
    return baseOdds > 0 ? `+${baseOdds}` : baseOdds.toString();
  }

  private generatePitcherAnalysis(
    homePitcher: PitcherStats,
    awayPitcher: PitcherStats,
    venueStats: any
  ): string {
    // Implementar lógica de generación de análisis
    return `Analysis based on recent performance and historical matchups...`;
  }

  private generateStrikeoutAnalysis(
    pitcher: PitcherStats,
    opposingTeam: any,
    avgStrikeouts: number
  ): string {
    // Implementar lógica de generación de análisis
    return `Strikeout analysis based on pitcher's recent performance...`;
  }

  private calculateAverageStrikeouts(games: PitcherStats['recentForm']['lastGames']): number {
    return games.reduce((sum, game) => sum + game.strikeouts, 0) / games.length;
  }

  private getTeamStrikeoutRate(team: any): number {
    // Implementación básica
    return team.stats?.batting?.strikeouts / (team.stats?.batting?.atBats || 500) || 0.23;
  }

  private analyzeHitterMatchups(teamStats: any, opposingPitcher: PitcherStats | null): BettingStrategy[] {
    // Implementación básica por ahora
    return [];
  }

  private analyzeVenueTrends(venueStats: any, homeTeamStats: any, awayTeamStats: any): BettingStrategy[] {
    // Implementación básica por ahora
    return [];
  }

  private analyzeRecentMatchups(recentGames: any[]): BettingStrategy[] {
    // Implementación básica por ahora
    return [];
  }

  // ... otros métodos de análisis
} 