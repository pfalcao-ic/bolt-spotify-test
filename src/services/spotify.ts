import { 
  SpotifyUser, 
  SpotifyPlaylist, 
  SpotifyPlaylistTrack, 
  SpotifySearchResult,
  SpotifyPaginatedResponse 
} from '../types/spotify';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

class SpotifyService {
  private getAuthHeaders(accessToken: string) {
    return {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  async getCurrentUser(accessToken: string): Promise<SpotifyUser> {
    const response = await fetch(`${SPOTIFY_API_BASE}/me`, {
      headers: this.getAuthHeaders(accessToken),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }

    return response.json();
  }

  async getUserPlaylists(accessToken: string, offset = 0, limit = 50): Promise<SpotifyPaginatedResponse<SpotifyPlaylist>> {
    const response = await fetch(
      `${SPOTIFY_API_BASE}/me/playlists?offset=${offset}&limit=${limit}`,
      {
        headers: this.getAuthHeaders(accessToken),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch playlists: ${response.statusText}`);
    }

    return response.json();
  }

  async getPlaylistTracks(
    accessToken: string, 
    playlistId: string, 
    offset = 0, 
    limit = 50
  ): Promise<SpotifyPaginatedResponse<SpotifyPlaylistTrack>> {
    const response = await fetch(
      `${SPOTIFY_API_BASE}/playlists/${playlistId}/tracks?offset=${offset}&limit=${limit}`,
      {
        headers: this.getAuthHeaders(accessToken),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch playlist tracks: ${response.statusText}`);
    }

    return response.json();
  }

  async searchTracks(
    accessToken: string, 
    query: string, 
    offset = 0, 
    limit = 20
  ): Promise<SpotifySearchResult> {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(
      `${SPOTIFY_API_BASE}/search?q=${encodedQuery}&type=track&offset=${offset}&limit=${limit}`,
      {
        headers: this.getAuthHeaders(accessToken),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to search tracks: ${response.statusText}`);
    }

    return response.json();
  }

  async addTrackToPlaylist(
    accessToken: string, 
    playlistId: string, 
    trackUri: string
  ): Promise<void> {
    const response = await fetch(
      `${SPOTIFY_API_BASE}/playlists/${playlistId}/tracks`,
      {
        method: 'POST',
        headers: this.getAuthHeaders(accessToken),
        body: JSON.stringify({
          uris: [trackUri],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to add track to playlist: ${response.statusText}`);
    }
  }

  async removeTrackFromPlaylist(
    accessToken: string, 
    playlistId: string, 
    trackUri: string
  ): Promise<void> {
    const response = await fetch(
      `${SPOTIFY_API_BASE}/playlists/${playlistId}/tracks`,
      {
        method: 'DELETE',
        headers: this.getAuthHeaders(accessToken),
        body: JSON.stringify({
          tracks: [{ uri: trackUri }],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to remove track from playlist: ${response.statusText}`);
    }
  }

  async createPlaylist(
    accessToken: string, 
    userId: string, 
    name: string, 
    description?: string
  ): Promise<SpotifyPlaylist> {
    const response = await fetch(
      `${SPOTIFY_API_BASE}/users/${userId}/playlists`,
      {
        method: 'POST',
        headers: this.getAuthHeaders(accessToken),
        body: JSON.stringify({
          name,
          description: description || '',
          public: false,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create playlist: ${response.statusText}`);
    }

    return response.json();
  }
}

export const spotifyService = new SpotifyService();