import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { MLBGame } from '@/services/mlbApi';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Funciones auxiliares
function getLastTenRecord(games: MLBGame[]): string {
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

function getHeadToHeadRecord(games: MLBGame[]): string {
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

function formatInjuries(injuries: { home: any[], away: any[] }): string {
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

function generatePrompt(gameData: any): string {
  return `
    As an MLB betting analyst, provide a detailed analysis and prediction for this game:
    
    Home Team: ${gameData.game.teams.home.team.name}
    - Season Record: ${gameData.homeTeamStats.wins}-${gameData.homeTeamStats.losses}
    - Last 10 Games: ${getLastTenRecord(gameData.trends.home)}
    - Starting Pitcher: ${gameData.pitchingMatchup.home.fullName}
    (ERA: ${gameData.pitchingMatchup.home.stats[0]?.stat.era})
    
    Away Team: ${gameData.game.teams.away.team.name}
    - Season Record: ${gameData.awayTeamStats.wins}-${gameData.awayTeamStats.losses}
    - Last 10 Games: ${getLastTenRecord(gameData.trends.away)}
    - Starting Pitcher: ${gameData.pitchingMatchup.away.fullName}
    (ERA: ${gameData.pitchingMatchup.away.stats[0]?.stat.era})
    
    Weather: ${gameData.weather.condition}, ${gameData.weather.temp}°F
    
    Head to Head this season: ${getHeadToHeadRecord(gameData.headToHead)}
    
    Key Injuries:
    ${formatInjuries(gameData.injuries)}
    
    Provide:
    1. Winner prediction with confidence percentage
    2. Predicted score
    3. Key factors influencing the prediction
    4. Analysis of pitching matchup, batting, historical performance, weather impact
    5. Betting advice (moneyline, spread, over/under)
    
    Format the response as a JSON object.
  `;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const gameData = req.body;

    const completion = await openai.chat.completions.create({
      messages: [{ 
        role: "user", 
        content: generatePrompt(gameData)
      }],
      model: "gpt-4",
      response_format: { type: "json_object" },
    });

    res.status(200).json(JSON.parse(completion.choices[0].message.content));
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ message: 'Error analyzing game data' });
  }
} 