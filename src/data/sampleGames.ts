import { MLBGame } from '@/services/mlbApi';

export const sampleGames: MLBGame[] = [
  {
    gamePk: 1,
    gameDate: new Date().toISOString(), // Current game (LIVE)
    teams: {
      away: {
        team: {
          id: 147,
          name: "New York Yankees"
        },
        leagueRecord: {
          wins: 45,
          losses: 36
        }
      },
      home: {
        team: {
          id: 121,
          name: "New York Mets"
        },
        leagueRecord: {
          wins: 42,
          losses: 39
        }
      }
    },
    venue: {
      id: 1,
      name: "Citi Field"
    }
  },
  {
    gamePk: 2,
    gameDate: new Date(Date.now() + 3600000).toISOString(), // Game in 1 hour (Upcoming)
    teams: {
      away: {
        team: {
          id: 143,
          name: "Boston Red Sox"
        },
        leagueRecord: {
          wins: 40,
          losses: 42
        }
      },
      home: {
        team: {
          id: 141,
          name: "Toronto Blue Jays"
        },
        leagueRecord: {
          wins: 44,
          losses: 37
        }
      }
    },
    venue: {
      id: 2,
      name: "Rogers Centre"
    }
  },
  {
    gamePk: 3,
    gameDate: new Date(Date.now() + 7200000).toISOString(), // Game in 2 hours (Upcoming)
    teams: {
      away: {
        team: {
          id: 145,
          name: "Chicago White Sox"
        },
        leagueRecord: {
          wins: 38,
          losses: 44
        }
      },
      home: {
        team: {
          id: 142,
          name: "Minnesota Twins"
        },
        leagueRecord: {
          wins: 47,
          losses: 34
        }
      }
    },
    venue: {
      id: 3,
      name: "Target Field"
    }
  },
  {
    gamePk: 4,
    gameDate: new Date(Date.now() + 10800000).toISOString(), // Game in 3 hours (Upcoming)
    teams: {
      away: {
        team: {
          id: 158,
          name: "Los Angeles Dodgers"
        },
        leagueRecord: {
          wins: 51,
          losses: 30
        }
      },
      home: {
        team: {
          id: 137,
          name: "San Francisco Giants"
        },
        leagueRecord: {
          wins: 46,
          losses: 35
        }
      }
    },
    venue: {
      id: 4,
      name: "Oracle Park"
    }
  }
]; 