import { MLBGame } from './mlbApi';

interface AnalysisRequest {
  gameData: MLBGame;
  selectedAnalysis: string[];
}

interface AnalysisResponse {
  analysis: {
    dataPoints: Array<{
      name: string;
      value: any;
      significance: string;
    }>;
    insights: Array<{
      topic: string;
      description: string;
      impact: 'high' | 'medium' | 'low';
    }>;
    recommendations: Array<{
      type: string;
      description: string;
      confidence: number;
      odds?: string;
    }>;
  };
  bettingAdvice: {
    recommendations: Array<{
      market: string;
      bet: string;
      odds: string;
      confidence: number;
      reasoning: string;
    }>;
    riskFactors: Array<{
      factor: string;
      impact: string;
      mitigation?: string;
    }>;
  };
  confidenceScores: {
    overall: number;
    specific: {
      [key: string]: number;
    };
  };
}

export class OpenAIService {
  private async fetchMLBData(gameData: MLBGame, dataPoints: string[]) {
    // Aquí implementaremos la lógica para obtener datos específicos de la API de MLB
    // basados en los dataPoints seleccionados
    const data: any = {};
    
    for (const point of dataPoints) {
      switch (point) {
        case 'recent_games':
          // Implementar lógica para obtener juegos recientes
          break;
        case 'vs_team':
          // Implementar lógica para obtener estadísticas contra el equipo
          break;
        case 'at_venue':
          // Implementar lógica para obtener estadísticas en el estadio
          break;
        // ... otros casos para diferentes tipos de datos
      }
    }

    return data;
  }

  async analyzeGameData({ gameData, selectedAnalysis }: AnalysisRequest): Promise<AnalysisResponse> {
    try {
      // 1. Recopilar datos relevantes de la API de MLB
      const mlbData = await this.fetchMLBData(gameData, selectedAnalysis);

      // 2. Preparar el prompt para OpenAI
      const prompt = this.generatePrompt(gameData, mlbData, selectedAnalysis);

      // 3. Hacer la llamada a la API de OpenAI
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameData,
          mlbData,
          selectedAnalysis,
          prompt
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in analysis:', error);
      throw error;
    }
  }

  private generatePrompt(gameData: MLBGame, mlbData: any, selectedAnalysis: string[]): string {
    return `
      Analyze this MLB game for betting purposes:

      Game Information:
      ${gameData.teams.away.team.name} @ ${gameData.teams.home.team.name}
      Date: ${new Date(gameData.gameDate).toLocaleDateString()}
      Venue: ${gameData.venue.name}

      Selected Analysis Points:
      ${selectedAnalysis.join(', ')}

      Available Data:
      ${JSON.stringify(mlbData, null, 2)}

      Please provide:
      1. Detailed statistical analysis of the selected data points
      2. Key insights and patterns identified
      3. Specific betting recommendations with confidence levels
      4. Risk factors and potential impact on predictions
      5. Historical performance context where relevant

      Format as JSON with:
      - Analysis of each data point
      - Betting recommendations
      - Confidence scores
      - Risk assessment
    `;
  }
}

export const openAiService = new OpenAIService(); 