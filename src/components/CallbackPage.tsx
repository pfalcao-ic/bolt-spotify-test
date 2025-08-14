import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Music } from 'lucide-react';
import { exchangeCodeRequest } from '../store/slices/authSlice';

export const CallbackPage: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      console.error('Spotify authorization error:', error);
      // Redirect to login page or show error
      window.location.href = '/';
      return;
    }

    if (code) {
      dispatch(exchangeCodeRequest(code));
    } else {
      // No code found, redirect to login
      window.location.href = '/';
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-spotify-black via-gray-900 to-spotify-black flex items-center justify-center">
      <div className="text-center text-white">
        <div className="flex justify-center mb-6">
          <div className="bg-spotify-green rounded-full p-4 animate-pulse">
            <Music className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-4">Connecting to Spotify...</h1>
        <p className="text-gray-300">Please wait while we authenticate your account.</p>
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-spotify-green"></div>
        </div>
      </div>
    </div>
  );
};