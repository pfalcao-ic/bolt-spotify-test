import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Music, Headphones, ListMusic, Users } from 'lucide-react';
import { Button } from './ui/button';
import { RootState } from '../store';
import { loginRequest, checkAuthRequest } from '../store/slices/authSlice';

export const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(checkAuthRequest());
  }, [dispatch]);

  const handleLogin = () => {
    dispatch(loginRequest());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-spotify-black via-gray-900 to-spotify-black flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-spotify-green rounded-full p-4">
              <Music className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Spotify Playlist Manager
          </h1>
          <p className="text-gray-300 text-lg">
            Manage your Spotify playlists with ease
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-gray-700">
              <ListMusic className="h-5 w-5 text-spotify-green" />
              <span>Browse and manage your playlists</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <Headphones className="h-5 w-5 text-spotify-green" />
              <span>Search and add new tracks</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <Users className="h-5 w-5 text-spotify-green" />
              <span>Create and organize playlists</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <Button
            onClick={handleLogin}
            disabled={loading}
            variant="spotify"
            className="w-full py-3 text-lg font-semibold"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Connecting...</span>
              </div>
            ) : (
              'Connect with Spotify'
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            We'll redirect you to Spotify to authorize this application.
            Your credentials are never stored on our servers.
          </p>
        </div>

        <div className="text-center text-gray-400 text-sm">
          <p>
            Make sure you have a Spotify account and the necessary environment
            variables configured.
          </p>
        </div>
      </div>
    </div>
  );
};