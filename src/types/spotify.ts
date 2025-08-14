export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: SpotifyImage[];
}

export interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string | null;
  images: SpotifyImage[];
  tracks: {
    total: number;
  };
  owner: {
    display_name: string;
  };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  duration_ms: number;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyArtist {
  id: string;
  name: string;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
  release_date: string;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyPlaylistTrack {
  added_at: string;
  track: SpotifyTrack;
}

export interface SpotifySearchResult {
  tracks: {
    items: SpotifyTrack[];
    total: number;
    limit: number;
    offset: number;
    next: string | null;
  };
}

export interface SpotifyPaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
}

export interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  user: SpotifyUser | null;
  loading: boolean;
  error: string | null;
}

export interface PlaylistState {
  playlists: SpotifyPlaylist[];
  selectedPlaylist: SpotifyPlaylist | null;
  tracks: SpotifyPlaylistTrack[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  offset: number;
}

export interface SearchState {
  query: string;
  results: SpotifyTrack[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  offset: number;
}