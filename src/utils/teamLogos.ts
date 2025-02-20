export const teamLogos: Record<string, string> = {
  // American League East
  'BAL': 'https://www.mlbstatic.com/team-logos/110.svg', // Baltimore Orioles
  'BOS': 'https://www.mlbstatic.com/team-logos/111.svg', // Boston Red Sox
  'NYY': 'https://www.mlbstatic.com/team-logos/147.svg', // New York Yankees
  'TB': 'https://www.mlbstatic.com/team-logos/139.svg',  // Tampa Bay Rays
  'TOR': 'https://www.mlbstatic.com/team-logos/141.svg', // Toronto Blue Jays

  // American League Central
  'CWS': 'https://www.mlbstatic.com/team-logos/145.svg', // Chicago White Sox
  'CLE': 'https://www.mlbstatic.com/team-logos/114.svg', // Cleveland Guardians
  'DET': 'https://www.mlbstatic.com/team-logos/116.svg', // Detroit Tigers
  'KC': 'https://www.mlbstatic.com/team-logos/118.svg',  // Kansas City Royals
  'MIN': 'https://www.mlbstatic.com/team-logos/142.svg', // Minnesota Twins

  // American League West
  'HOU': 'https://www.mlbstatic.com/team-logos/117.svg', // Houston Astros
  'LAA': 'https://www.mlbstatic.com/team-logos/108.svg', // Los Angeles Angels
  'OAK': 'https://www.mlbstatic.com/team-logos/133.svg', // Oakland Athletics
  'SEA': 'https://www.mlbstatic.com/team-logos/136.svg', // Seattle Mariners
  'TEX': 'https://www.mlbstatic.com/team-logos/140.svg', // Texas Rangers

  // National League East
  'ATL': 'https://www.mlbstatic.com/team-logos/144.svg', // Atlanta Braves
  'MIA': 'https://www.mlbstatic.com/team-logos/146.svg', // Miami Marlins
  'NYM': 'https://www.mlbstatic.com/team-logos/121.svg', // New York Mets
  'PHI': 'https://www.mlbstatic.com/team-logos/143.svg', // Philadelphia Phillies
  'WSH': 'https://www.mlbstatic.com/team-logos/120.svg', // Washington Nationals

  // National League Central
  'CHC': 'https://www.mlbstatic.com/team-logos/112.svg', // Chicago Cubs
  'CIN': 'https://www.mlbstatic.com/team-logos/113.svg', // Cincinnati Reds
  'MIL': 'https://www.mlbstatic.com/team-logos/158.svg', // Milwaukee Brewers
  'PIT': 'https://www.mlbstatic.com/team-logos/134.svg', // Pittsburgh Pirates
  'STL': 'https://www.mlbstatic.com/team-logos/138.svg', // St. Louis Cardinals

  // National League West
  'ARI': 'https://www.mlbstatic.com/team-logos/109.svg', // Arizona Diamondbacks
  'COL': 'https://www.mlbstatic.com/team-logos/115.svg', // Colorado Rockies
  'LAD': 'https://www.mlbstatic.com/team-logos/119.svg', // Los Angeles Dodgers
  'SD': 'https://www.mlbstatic.com/team-logos/135.svg',  // San Diego Padres
  'SF': 'https://www.mlbstatic.com/team-logos/137.svg',  // San Francisco Giants
};

export function getTeamLogo(code: string): string {
  return teamLogos[code] || '';
} 