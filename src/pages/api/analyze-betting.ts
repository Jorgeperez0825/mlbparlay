import { NextApiRequest, NextApiResponse } from 'next';
import { AnalysisService } from '@/services/analysisService';
import { mlbApi } from '@/services/mlbApi';

const analysisService = new AnalysisService();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { gameId, selectedMetrics, bankroll = 1000 } = req.body;

    // Fetch game data
    const game = await mlbApi.getGame(gameId);
    
    // Fetch historical data (you'll need to implement this in mlbApi)
    const historicalData = await mlbApi.getHistoricalData(gameId);
    
    // Mock odds data for now - you'll need to integrate with a real odds provider
    const mockOdds = [
      {
        bookmaker: 'BookmakerA',
        decimal: 2.1,
        impliedProbability: 0.476
      },
      {
        bookmaker: 'BookmakerB',
        decimal: 1.95,
        impliedProbability: 0.513
      }
    ];

    // Perform analysis
    const analysis = await analysisService.analyzeBettingOpportunity(
      game,
      selectedMetrics,
      historicalData,
      mockOdds,
      bankroll
    );

    return res.status(200).json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({ 
      message: 'Error analyzing betting opportunity',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 