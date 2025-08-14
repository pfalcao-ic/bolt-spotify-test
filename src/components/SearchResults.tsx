import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Music, Search as SearchIcon } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { RootState } from '../store';
import { searchTracksRequest } from '../store/slices/searchSlice';
import { addTrackToPlaylistRequest } from '../store/slices/playlistSlice';
import { formatDuration } from '../lib/utils';
import { toast } from 'sonner';

export const SearchResults: React.FC = () => {
  const dispatch = useDispatch();
  const { query, results, loading, hasMore, offset } = useSelector(
    (state: RootState) => state.search
  );
  const { selectedPlaylist } = useSelector((state: RootState) => state.playlist);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleAddTrack = (trackId: string, trackName: string, artistName: string) => {
    if (!selectedPlaylist) {
      toast.error('Please select a playlist first');
      return;
    }

    dispatch(addTrackToPlaylistRequest({
      playlistId: selectedPlaylist.id,
      trackUri: `spotify:track:${trackId}`,
    }));

    toast.success(`Added "${trackName}" by ${artistName} to ${selectedPlaylist.name}`);
  };

  const loadMoreResults = useCallback(() => {
    if (!query.trim() || loading || loadingMore || !hasMore) return;

    setLoadingMore(true);
    dispatch(searchTracksRequest({ query, offset }));
  }, [dispatch, query, loading, loadingMore, hasMore, offset]);

  useEffect(() => {
    if (!loading) {
      setLoadingMore(false);
    }
  }, [loading]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      loadMoreResults();
    }
  }, [loadMoreResults]);

  if (!query.trim()) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <SearchIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Search for tracks to add to your playlist</p>
        </div>
      </div>
    );
  }

  if (results.length === 0 && !loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No tracks found for "{query}"</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Search Results {query && `for "${query}"`}
        </h2>
        {results.length > 0 && (
          <span className="text-sm text-gray-500">
            {results.length} tracks found
          </span>
        )}
      </div>

      <ScrollArea className="h-[400px]" onScrollCapture={handleScroll}>
        <div className="space-y-2">
          {results.map((track) => (
            <div
              key={track.id}
              className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg group transition-colors"
            >
              {track.album.images[0] && (
                <img
                  src={track.album.images[0].url}
                  alt={track.album.name}
                  className="w-12 h-12 rounded shadow-sm"
                />
              )}

              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {track.name}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {track.artists.map(artist => artist.name).join(', ')} • {track.album.name}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">
                  {formatDuration(track.duration_ms)}
                </span>
                
                <Button
                  onClick={() => handleAddTrack(
                    track.id, 
                    track.name, 
                    track.artists.map(a => a.name).join(', ')
                  )}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-spotify-green hover:text-spotify-green hover:bg-green-50"
                  disabled={!selectedPlaylist}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {(loading || loadingMore) && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-spotify-green"></div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};