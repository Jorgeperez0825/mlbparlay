export interface Metric {
  id: string;
  name: string;
  description: string;
}

export interface MetricCategory {
  id: string;
  name: string;
  metrics: Metric[];
}

export const METRIC_CATEGORIES: MetricCategory[] = [
  {
    id: 'ai_analysis',
    name: 'AI Deep Analysis',
    metrics: [
      { 
        id: 'historical_pattern', 
        name: 'Pattern Recognition', 
        description: 'AI analysis of historical patterns to identify high-probability scenarios'
      },
      { 
        id: 'market_inefficiency', 
        name: 'Market Inefficiency Detection', 
        description: 'AI-powered detection of mispriced odds across different bookmakers'
      },
      { 
        id: 'sentiment_analysis', 
        name: 'Market Sentiment Analysis', 
        description: 'Analysis of public betting patterns and sharp money movement'
      }
    ]
  },
  {
    id: 'margin_optimization',
    name: 'Margin Optimization',
    metrics: [
      { 
        id: 'kelly_criterion', 
        name: 'Kelly Criterion Calculator', 
        description: 'Optimal bet sizing based on edge and bankroll management'
      },
      { 
        id: 'hedge_opportunities', 
        name: 'Hedging Opportunities', 
        description: 'Identifies opportunities to lock in profit through hedging'
      },
      { 
        id: 'arbitrage_finder', 
        name: 'Arbitrage Detection', 
        description: 'Finds arbitrage opportunities across different bookmakers'
      }
    ]
  },
  {
    id: 'advanced_stats',
    name: 'Advanced Statistics',
    metrics: [
      { 
        id: 'regression_analysis', 
        name: 'Regression Analysis', 
        description: 'Statistical modeling to predict performance variations'
      },
      { 
        id: 'variance_analysis', 
        name: 'Variance Calculator', 
        description: 'Calculates expected variance and confidence intervals'
      },
      { 
        id: 'correlation_matrix', 
        name: 'Correlation Matrix', 
        description: 'Identifies correlations between different betting markets'
      }
    ]
  },
  {
    id: 'money_line',
    name: 'Money Line Analysis',
    metrics: [
      { 
        id: 'win_probability', 
        name: 'Win Probability', 
        description: 'Advanced win probability based on pitching matchups, team form, and historical data'
      },
      { 
        id: 'value_odds', 
        name: 'Value Odds Detection', 
        description: 'Identifies when bookmaker odds differ significantly from calculated probabilities'
      },
      { 
        id: 'momentum_shifts', 
        name: 'Momentum Analysis', 
        description: 'Recent team performance trends and their impact on winning probability'
      }
    ]
  },
  {
    id: 'run_line',
    name: 'Run Line Predictions',
    metrics: [
      { 
        id: 'run_differential', 
        name: 'Run Differential Prediction', 
        description: 'Expected run differential based on team matchups and conditions'
      },
      { 
        id: 'blowout_potential', 
        name: 'Blowout Potential', 
        description: 'Likelihood of a game being decided by 3+ runs'
      },
      { 
        id: 'close_game_trends', 
        name: 'Close Game Analysis', 
        description: 'Team performance in one-run games and extra innings'
      }
    ]
  },
  {
    id: 'totals',
    name: 'Over/Under Analysis',
    metrics: [
      { 
        id: 'scoring_prediction', 
        name: 'Total Runs Prediction', 
        description: 'Expected total runs based on pitching matchups, weather, and park factors'
      },
      { 
        id: 'early_scoring', 
        name: 'Early Innings Scoring', 
        description: 'First 5 innings scoring patterns for F5 betting opportunities'
      },
      { 
        id: 'weather_impact', 
        name: 'Weather Impact', 
        description: 'How weather conditions affect total runs scored'
      }
    ]
  },
  {
    id: 'props',
    name: 'Player Props Analysis',
    metrics: [
      { 
        id: 'strikeout_props', 
        name: 'Pitcher Strikeouts', 
        description: 'Strikeout predictions based on matchups and conditions'
      },
      { 
        id: 'hits_props', 
        name: 'Player Hits', 
        description: 'Hit probability for specific batter vs pitcher matchups'
      },
      { 
        id: 'total_bases', 
        name: 'Total Bases', 
        description: 'Expected total bases for batters including HR probability'
      }
    ]
  },
  {
    id: 'value_alerts',
    name: 'Value Betting Alerts',
    metrics: [
      { 
        id: 'line_movement', 
        name: 'Line Movement', 
        description: 'Alerts for significant line movements and sharp money'
      },
      { 
        id: 'steam_moves', 
        name: 'Steam Moves', 
        description: 'Sudden, coordinated betting patterns across multiple books'
      },
      { 
        id: 'reverse_line', 
        name: 'Reverse Line Movement', 
        description: 'When the line moves against the majority of bets'
      }
    ]
  },
  {
    id: 'parlay_builder',
    name: 'Parlay Optimization',
    metrics: [
      { 
        id: 'correlation_finder', 
        name: 'Correlated Plays', 
        description: 'Finds potentially correlated bets for parlay construction'
      },
      { 
        id: 'parlay_calculator', 
        name: 'Value Calculator', 
        description: 'Calculates true odds vs offered odds for parlay combinations'
      },
      { 
        id: 'risk_assessment', 
        name: 'Risk Assessment', 
        description: 'Analyzes risk levels for different parlay combinations'
      }
    ]
  }
]; 