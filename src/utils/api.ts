import { Game, Team, PlayerStats } from '@/types/api';

const API_KEY = process.env.NEXT_PUBLIC_BALLDONTLIE_API_KEY;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiResponse<T> {
  data: T;
  meta?: {
    total_pages: number;
    current_page: number;
    next_page: number;
    per_page: number;
    total_count: number;
  };
}

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  if (!API_KEY) {
    throw new Error('API_KEY is not configured. Please check your environment variables.');
  }

  const headers = {
    'Authorization': API_KEY,
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const url = `${API_URL}${endpoint}`;
  console.log('Making API request to:', url);
  console.log('With headers:', JSON.stringify({
    ...headers,
    'Authorization': 'HIDDEN'
  }, null, 2));

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      const error = {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        body: errorText,
      };
      console.error('API Error:', JSON.stringify(error, null, 2));
      throw new Error(`API call failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response data:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
      });
    }
    throw error;
  }
}

export const api = {
  games: {
    list: async (params?: { 
      dates?: string[]; 
      seasons?: number[]; 
      team_ids?: number[]; 
      postseason?: boolean;
      start_date?: string;
      end_date?: string;
      per_page?: number;
      page?: number;
      season_type?: 'spring' | 'regular';
    }) => {
      try {
        const searchParams = new URLSearchParams();
        if (params?.dates) params.dates.forEach(date => searchParams.append('dates[]', date));
        if (params?.seasons) params.seasons.forEach(season => searchParams.append('seasons[]', season.toString()));
        if (params?.team_ids) params.team_ids.forEach(id => searchParams.append('team_ids[]', id.toString()));
        if (params?.postseason !== undefined) searchParams.append('postseason', params.postseason.toString());
        if (params?.start_date) searchParams.append('start_date', params.start_date);
        if (params?.end_date) searchParams.append('end_date', params.end_date);
        if (params?.per_page) searchParams.append('per_page', params.per_page.toString());
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.season_type) searchParams.append('season_type', params.season_type);
        
        const queryString = searchParams.toString();
        const url = queryString ? `/games?${queryString}` : '/games';
        
        return fetchApi<Game[]>(url);
      } catch (error) {
        console.error('Error fetching games:', error);
        throw error;
      }
    },
    get: async (id: number) => fetchApi<Game>(`/games/${id}`),
  },
  teams: {
    list: async (params?: { 
      per_page?: number;
      page?: number;
    }) => {
      const searchParams = new URLSearchParams();
      if (params?.per_page) searchParams.append('per_page', params.per_page.toString());
      if (params?.page) searchParams.append('page', params.page.toString());
      
      const queryString = searchParams.toString();
      const url = queryString ? `/teams?${queryString}` : '/teams';
      
      return fetchApi<Team[]>(url);
    },
    get: async (id: number) => fetchApi<Team>(`/teams/${id}`),
  },
  stats: {
    list: async (params?: { 
      seasons?: number[]; 
      player_ids?: number[];
      game_ids?: number[];
      postseason?: boolean;
      per_page?: number;
      page?: number;
    }) => {
      const searchParams = new URLSearchParams();
      if (params?.seasons) params.seasons.forEach(season => searchParams.append('seasons[]', season.toString()));
      if (params?.player_ids) params.player_ids.forEach(id => searchParams.append('player_ids[]', id.toString()));
      if (params?.game_ids) params.game_ids.forEach(id => searchParams.append('game_ids[]', id.toString()));
      if (params?.postseason !== undefined) searchParams.append('postseason', params.postseason.toString());
      if (params?.per_page) searchParams.append('per_page', params.per_page.toString());
      if (params?.page) searchParams.append('page', params.page.toString());
      
      return fetchApi<PlayerStats[]>('/stats?' + searchParams.toString());
    },
  },
}; 