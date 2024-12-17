import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface GameAnalysisRequest {
  gameId: string;
  date: string;
  teams: {
    home: string;
    away: string;
  };
  prompt: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const data = req.body as GameAnalysisRequest;

    const completion = await openai.chat.completions.create({
      messages: [{ 
        role: "user", 
        content: data.prompt || generatePrompt(data)
      }],
      model: "gpt-4",
      response_format: { type: "json_object" },
    });

    if (completion.choices[0].message.content) {
      res.status(200).json(JSON.parse(completion.choices[0].message.content));
    } else {
      res.status(500).json({ message: 'No content received from OpenAI' });
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ message: 'Error analyzing game data' });
  }
}

function generatePrompt(game: GameAnalysisRequest): string {
  return `
    Analyze this MLB game between ${game.teams.home} and ${game.teams.away}:
    
    Teams:
    - Home Team: ${game.teams.home}
    - Away Team: ${game.teams.away}
    
    Date: ${game.date}
    
    Please provide:
    1. Win probability for each team
    2. Key matchup analysis
    3. Betting recommendations
    4. Important factors to consider
  `;
}
 