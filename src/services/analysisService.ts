import { mlbAnalyzer } from './openaiApi';
import { MLBGame } from './mlbApi';

interface OddsData {
  bookmaker: string;
  decimal: number;
  impliedProbability: number;
}

interface MarketAnalysis {
  inefficiencies: Array<{
    bookmaker: string;
    odds: number;
    deviation: number;
    expectedValue: number;
  }>;
  arbitrageOpportunities: Array<{
    bookmakers: string[];
    odds: number[];
    guaranteedProfit: number;
  }>;
}

export interface AnalysisMetric {
  id: string;
  value: number;
  confidence: number;
  explanation: string;
}

export interface BettingAnalysis {
  gameId: string;
  metrics: AnalysisMetric[];
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
  expectedValue: number;
  timestamp: string;
}

export class AnalysisService {
  private async analyzePatterns(game: MLBGame, historicalData: unknown): Promise<string> {
    try {
      const analysis = await mlbAnalyzer.analyzeGame({
        gameId: game.gamePk.toString(),
        date: game.gameDate,
        teams: {
          home: game.teams.home.team.name,
          away: game.teams.away.team.name
        },
        prompt: `Analyze the following MLB game and historical data to identify betting patterns and opportunities:
        
        Game Data:
        - Teams: ${game.teams.away.team.name} vs ${game.teams.home.team.name}
        - Date: ${game.gameDate}
        - Venue: ${game.venue.name}
        
        Historical Context:
        ${JSON.stringify(historicalData, null, 2)}
        
        Please analyze:
        1. Historical patterns and trends
        2. Key statistical indicators
        3. Potential value opportunities
        4. Risk factors to consider
        
        Provide a detailed analysis focusing on betting implications.`
      });

      return analysis.prediction;
    } catch (error) {
      console.error('Error analyzing patterns:', error);
      throw error;
    }
  }

  private async calculateMarginOptimization(odds: OddsData, bankroll: number): Promise<{
    optimalBetSize: number;
    expectedValue: number;
    confidence: number;
  }> {
    // Kelly Criterion calculation
    const probability = odds.impliedProbability;
    const decimal = odds.decimal;
    
    const edge = (probability * (decimal - 1)) - (1 - probability);
    const kellyFraction = edge / (decimal - 1);
    
    // Conservative Kelly (using 1/4 of the suggested bet size)
    const optimalBetSize = (kellyFraction * bankroll) * 0.25;
    
    return {
      optimalBetSize,
      expectedValue: edge * bankroll,
      confidence: probability
    };
  }

  private async detectMarketInefficiencies(odds: OddsData[]): Promise<MarketAnalysis> {
    const inefficiencies: MarketAnalysis['inefficiencies'] = [];
    const arbitrageOpportunities: MarketAnalysis['arbitrageOpportunities'] = [];
    
    // Calculate true probability using market consensus
    const impliedProbabilities = odds.map(o => 1 / o.decimal);
    const marketConsensus = 1 / (impliedProbabilities.reduce((a, b) => a + b) / impliedProbabilities.length);
    
    // Find significant deviations
    odds.forEach(odd => {
      const deviation = Math.abs(1/odd.decimal - marketConsensus);
      if (deviation > 0.05) { // 5% threshold
        inefficiencies.push({
          bookmaker: odd.bookmaker,
          odds: odd.decimal,
          deviation: deviation,
          expectedValue: (marketConsensus * odd.decimal) - 1
        });
      }
    });
    
    // Check for arbitrage opportunities
    for (let i = 0; i < odds.length; i++) {
      for (let j = i + 1; j < odds.length; j++) {
        const margin = (1/odds[i].decimal) + (1/odds[j].decimal);
        if (margin < 1) {
          arbitrageOpportunities.push({
            bookmakers: [odds[i].bookmaker, odds[j].bookmaker],
            odds: [odds[i].decimal, odds[j].decimal],
            guaranteedProfit: (1 - margin) * 100
          });
        }
      }
    }
    
    return { inefficiencies, arbitrageOpportunities };
  }

  public async analyzeBettingOpportunity(
    game: MLBGame,
    selectedMetrics: string[],
    historicalData: unknown,
    odds: OddsData[],
    bankroll: number
  ): Promise<BettingAnalysis> {
    const analysis: BettingAnalysis = {
      gameId: game.gamePk.toString(),
      metrics: [],
      recommendations: [],
      riskLevel: 'medium',
      expectedValue: 0,
      timestamp: new Date().toISOString()
    };

    // Process each selected metric
    for (const metricId of selectedMetrics) {
      switch (metricId) {
        case 'historical_pattern': {
          const patternAnalysis = await this.analyzePatterns(game, historicalData);
          analysis.metrics.push({
            id: metricId,
            value: 0,
            confidence: 0.8,
            explanation: patternAnalysis
          });
          break;
        }
        
        case 'market_inefficiency': {
          const { inefficiencies, arbitrageOpportunities } = await this.detectMarketInefficiencies(odds);
          const hasSignificantValue = inefficiencies.some(i => i.expectedValue > 0.05);
          
          analysis.metrics.push({
            id: metricId,
            value: inefficiencies.length,
            confidence: 0.85,
            explanation: JSON.stringify({ inefficiencies, arbitrageOpportunities })
          });
          
          if (hasSignificantValue) {
            analysis.recommendations.push('Significant market inefficiencies detected. Consider value betting opportunities.');
          }
          break;
        }
        
        case 'kelly_criterion': {
          const optimization = await this.calculateMarginOptimization(odds[0], bankroll);
          
          analysis.metrics.push({
            id: metricId,
            value: optimization.optimalBetSize,
            confidence: optimization.confidence,
            explanation: `Optimal bet size: $${optimization.optimalBetSize.toFixed(2)}, Expected value: $${optimization.expectedValue.toFixed(2)}`
          });
          
          analysis.expectedValue = optimization.expectedValue;
          break;
        }
      }
    }

    // Calculate overall risk level
    const avgConfidence = analysis.metrics.reduce((sum, m) => sum + m.confidence, 0) / analysis.metrics.length;
    analysis.riskLevel = avgConfidence > 0.8 ? 'low' : avgConfidence > 0.6 ? 'medium' : 'high';

    return analysis;
  }
} 