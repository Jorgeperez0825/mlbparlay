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
  const headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  games: {
    list: async (params?: { date?: string; team_ids?: number[]; season?: number }) => {
      const searchParams = new URLSearchParams();
      if (params?.date) searchParams.append('dates[]', params.date);
      if (params?.team_ids) params.team_ids.forEach(id => searchParams.append('team_ids[]', id.toString()));
      if (params?.season) searchParams.append('seasons[]', params.season.toString());
      
      return fetchApi('/games?' + searchParams.toString());
    },
    get: async (id: number) => fetchApi(`/games/${id}`),
  },
  teams: {
    list: async () => fetchApi('/teams'),
    get: async (id: number) => fetchApi(`/teams/${id}`),
  },
  stats: {
    list: async (params?: { season?: number; player_ids?: number[] }) => {
      const searchParams = new URLSearchParams();
      if (params?.season) searchParams.append('season', params.season.toString());
      if (params?.player_ids) params.player_ids.forEach(id => searchParams.append('player_ids[]', id.toString()));
      
      return fetchApi('/stats?' + searchParams.toString());
    },
  },
}; 