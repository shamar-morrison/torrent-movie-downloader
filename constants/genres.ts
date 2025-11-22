export const GENRES = [
  { id: 'all', label: 'All' },
  { id: 'action', label: 'Action' },
  { id: 'comedy', label: 'Comedy' },
  { id: 'sci-fi', label: 'Sci-Fi' },
  { id: 'horror', label: 'Horror' },
  { id: 'romance', label: 'Romance' },
  { id: 'thriller', label: 'Thriller' },
  { id: 'drama', label: 'Drama' },
  { id: 'animation', label: 'Animation' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'crime', label: 'Crime' },
  { id: 'fantasy', label: 'Fantasy' },
  { id: 'mystery', label: 'Mystery' },
] as const;

export const QUALITIES = ['All', '720p', '1080p', '2160p', '3D'] as const;

export type Genre = typeof GENRES[number]['id'];
export type Quality = typeof QUALITIES[number];
