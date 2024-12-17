interface AnalysisRequest {
  gameId: string;
  date: string;
  teams: {
    home: string;
    away: string;
  };
}

interface AnalysisResponse {
  prediction: string;
  confidence: number;
  factors: string[];
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
}

export const mlbAnalyzer = new MLBAnalyzer(); 