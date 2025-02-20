export interface Team {
  id: number;
  name: string;
  abbreviation?: string;
  venue_name?: string;
}

export interface Game {
  id: number;
  date: string;
  time: string;
  status: string;
  home_team: Team;
  away_team: Team;
  home_team_name: string;
  away_team_name: string;
  home_team_score: number;
  visitor_team_score: number;
  period: number;
  postseason: boolean;
  season: number;
}

export interface PlayerStats {
  id: number;
  team: Team;
  player: {
    id: number;
    first_name: string;
    last_name: string;
    position: string;
  };
  season: number;
  postseason: boolean;
  batting_avg: number;
  batting_obp: number;
  batting_slg: number;
  batting_ops: number;
  batting_ab: number;
  batting_r: number;
  batting_h: number;
  batting_2b: number;
  batting_3b: number;
  batting_hr: number;
  batting_rbi: number;
  batting_bb: number;
  batting_so: number;
  batting_sb: number;
  pitching_w: number;
  pitching_l: number;
  pitching_era: number;
  pitching_sv: number;
  pitching_ip: number;
  pitching_h: number;
  pitching_er: number;
  pitching_hr: number;
  pitching_bb: number;
  pitching_k: number;
  pitching_whip: number;
} 