import { generateRandomString, sha256, base64encode } from '../lib/utils';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const SCOPE = 'user-read-private user-read-email playlist-read-private playlist-modify-private playlist-modify-public';

export class SpotifyAuth {
  private codeVerifier: string | null = null;

  async initiateAuth(): Promise<void> {
    if (!CLIENT_ID || !REDIRECT_URI) {
      throw new Error('Spotify client configuration is missing. Please check your environment variables.');
    }

    this.codeVerifier = generateRandomString(64);
    const hashed = await sha256(this.codeVerifier);
    const codeChallenge = base64encode(hashed);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: SCOPE,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: REDIRECT_URI,
    });

    // Store code verifier for later use
    sessionStorage.setItem('code_verifier', this.codeVerifier);

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string): Promise<string> {
    if (!CLIENT_ID || !REDIRECT_URI) {
      throw new Error('Spotify client configuration is missing');
    }

    const codeVerifier = sessionStorage.getItem('code_verifier');
    if (!codeVerifier) {
      throw new Error('Code verifier not found');
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const data = await response.json();
    
    // Clean up
    sessionStorage.removeItem('code_verifier');
    
    return data.access_token;
  }

  getStoredToken(): string | null {
    return sessionStorage.getItem('spotify_access_token');
  }

  storeToken(token: string): void {
    sessionStorage.setItem('spotify_access_token', token);
  }

  clearToken(): void {
    sessionStorage.removeItem('spotify_access_token');
  }
}

export const spotifyAuth = new SpotifyAuth();