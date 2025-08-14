import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, Clock, Calendar, Music } from 'lucide-react';
import { Button } from './ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { ScrollArea } from './ui/scroll-area';
import { RootState } from '../store';
import { 
  removeTrackFromPlaylistRequest, 
  fetchPlaylistTracksRequest 
} from '../store/slices/playlistSlice';
import { formatDuration, formatDate } from '../lib/utils';
import { toast } from 'sonner';

export const TrackTable: React.FC = () => {
  const dispatch = useDispatch();
  const { tracks, selectedPlaylist, loading, hasMore, offset } = useSelector(
    (state: RootState) => state.playlist
  );
  const [loadingMore, setLoadingMore] = useState(false);

  const handleRemoveTrack = (trackId: string, trackName: string) => {
    if (!selectedPlaylist) return;

    dispatch(removeTrackFromPlaylistRequest({
      playlistId: selectedPlaylist.id,
      trackUri: `spotify:track:${trackId}`,
    }));

    toast.success(`Removed "${trackName}" from playlist`);
  };

  const loadMoreTracks = useCallback(() => {
    if (!selectedPlaylist || loading || loadingMore || !hasMore) return;

    setLoadingMore(true);
    dispatch(fetchPlaylistTracksRequest({
      playlistId: selectedPlaylist.id,
      offset,
    }));
  }, [dispatch, selectedPlaylist, loading, loadingMore, hasMore, offset]);

  useEffect(() => {
    if (!loading) {
      setLoadingMore(false);
    }
  }, [loading]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      loadMoreTracks();
    }
  }, [loadMoreTracks]);

  if (!selectedPlaylist) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Select a playlist to view its tracks</p>
        </div>
      </div>
    );
  }

  if (tracks.length === 0 && !loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>This playlist is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Tracks</h2>
        <span className="text-sm text-gray-500">
          {tracks.length} of {selectedPlaylist.tracks.total} tracks
        </span>
      </div>

      <ScrollArea className="h-[600px]" onScrollCapture={handleScroll}>
        <div className="space-y-2">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Title</div>
            <div className="col-span-3">Album</div>
            <div className="col-span-2">Date Added</div>
            <div className="col-span-1 flex justify-center">
              <Clock className="h-4 w-4" />
            </div>
          </div>

          {/* Tracks */}
          {tracks.map((item, index) => (
            <div
              key={`${item.track.id}-${index}`}
              className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-50 rounded-lg group transition-colors"
            >
              <div className="col-span-1 flex items-center text-sm text-gray-500">
                {index + 1}
              </div>

              <div className="col-span-5 flex items-center space-x-3">
                {item.track.album.images[0] && (
                  <img
                    src={item.track.album.images[0].url}
                    alt={item.track.album.name}
                    className="w-10 h-10 rounded shadow-sm"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 truncate">
                    {item.track.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {item.track.artists.map(artist => artist.name).join(', ')}
                  </p>
                </div>
              </div>

              <div className="col-span-3 flex items-center">
                <p className="text-sm text-gray-700 truncate">
                  {item.track.album.name}
                </p>
              </div>

              <div className="col-span-2 flex items-center">
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(item.added_at)}</span>
                </div>
              </div>

              <div className="col-span-1 flex items-center justify-center space-x-2">
                <span className="text-sm text-gray-500">
                  {formatDuration(item.track.duration_ms)}
                </span>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove Track</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove "{item.track.name}" by{' '}
                        {item.track.artists.map(artist => artist.name).join(', ')}{' '}
                        from this playlist? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleRemoveTrack(item.track.id, item.track.name)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Remove Track
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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