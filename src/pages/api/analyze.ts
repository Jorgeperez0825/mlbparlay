import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { MLBGame } from '@/services/mlbApi';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const gameData = req.body as MLBGame;

    const completion = await openai.chat.completions.create({
      messages: [{ 
        role: "user", 
        content: generatePrompt(gameData)
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

function generatePrompt(game: MLBGame): string {
  return `
    Analyze this MLB game between ${game.teams.home.team.name} and ${game.teams.away.team.name}:
    
    Home Team: ${game.teams.home.team.name}
    - Record: ${game.teams.home.leagueRecord.wins}-${game.teams.home.leagueRecord.losses}
    
    Away Team: ${game.teams.away.team.name}
    - Record: ${game.teams.away.leagueRecord.wins}-${game.teams.away.leagueRecord.losses}
    
    Venue: ${game.venue.name}
    
    Please provide:
    1. Win probability for each team
    2. Key matchup analysis
    3. Betting recommendations
    4. Important factors to consider
  `;
}
 