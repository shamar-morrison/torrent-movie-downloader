import type { MovieDetailsResponse, MovieFilters, MovieListResponse, MovieSuggestionsResponse } from '@/types/movie';
import axios from 'axios';

const API_BASE_URL = 'https://yts.lt/api/v2';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const updateApiBaseUrl = (url: string) => {
  api.defaults.baseURL = url;
};

export const moviesApi = {
  async getMovies(filters: MovieFilters = {}): Promise<MovieListResponse> {
    const params: Record<string, any> = {
      limit: filters.limit || 20,
      page: filters.page || 1,
    };

    if (filters.genre && filters.genre !== 'all') {
      params.genre = filters.genre;
    }
    if (filters.quality) {
      params.quality = filters.quality;
    }
    if (filters.minimum_rating) {
      params.minimum_rating = filters.minimum_rating;
    }
    if (filters.query_term) {
      params.query_term = filters.query_term;
    }
    if (filters.sort_by) {
      params.sort_by = filters.sort_by;
    }
    if (filters.order_by) {
      params.order_by = filters.order_by;
    }

    const response = await api.get<MovieListResponse>('/list_movies.json', { params });
    return response.data;
  },

  async getMovieDetails(movieId: number): Promise<MovieDetailsResponse> {
    const response = await api.get<MovieDetailsResponse>('/movie_details.json', {
      params: {
        movie_id: movieId,
      },
    });
    return response.data;
  },

  async getMovieSuggestions(movieId: number): Promise<MovieSuggestionsResponse> {
    const response = await api.get<MovieSuggestionsResponse>('/movie_suggestions.json', {
      params: {
        movie_id: movieId,
      },
    });
    return response.data;
  },
};

export const generateMagnetLink = (hash: string, title: string): string => {
  const trackers = [
    'udp://open.demonii.com:1337/announce',
    'udp://tracker.openbittorrent.com:80',
    'udp://tracker.coppersurfer.tk:6969',
    'udp://glotorrents.pw:6969/announce',
    'udp://tracker.opentrackr.org:1337/announce',
    'udp://torrent.gresille.org:80/announce',
    'udp://p4p.arenabg.com:1337',
    'udp://tracker.leechers-paradise.org:6969',
  ];

  const trackerString = trackers.map(t => `&tr=${encodeURIComponent(t)}`).join('');
  return `magnet:?xt=urn:btih:${hash}&dn=${encodeURIComponent(title)}${trackerString}`;
};
