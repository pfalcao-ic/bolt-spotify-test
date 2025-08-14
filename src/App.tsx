import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'sonner';
import { Header } from './components/Header';
import { PlaylistSelector } from './components/PlaylistSelector';
import { TrackTable } from './components/TrackTable';
import { SearchResults } from './components/SearchResults';
import { LoginPage } from './components/LoginPage';
import { CallbackPage } from './components/CallbackPage';
import { RootState } from './store';
import { checkAuthRequest } from './store/slices/authSlice';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const { query } = useSelector((state: RootState) => state.search);

  useEffect(() => {
    dispatch(checkAuthRequest());
  }, [dispatch]);

  // Handle OAuth callback
  if (window.location.pathname === '/callback') {
    return <CallbackPage />;
  }

  // Show loading state during initial auth check
  if (loading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-spotify-green"></div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Playlist Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <PlaylistSelector />
            </div>
          </div>

          {/* Right Column - Tracks or Search Results */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {query.trim() ? <SearchResults /> : <TrackTable />}
            </div>
          </div>
        </div>
      </main>

      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1DB954',
            color: 'white',
            border: 'none',
          },
        }}
      />
    </div>
  );
}

export default App;