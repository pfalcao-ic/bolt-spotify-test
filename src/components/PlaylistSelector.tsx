import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { RootState } from '../store';
import { 
  fetchPlaylistsRequest, 
  selectPlaylist, 
  fetchPlaylistTracksRequest 
} from '../store/slices/playlistSlice';

export const PlaylistSelector: React.FC = () => {
  const dispatch = useDispatch();
  const { playlists, selectedPlaylist, loading } = useSelector(
    (state: RootState) => state.playlist
  );

  useEffect(() => {
    dispatch(fetchPlaylistsRequest());
  }, [dispatch]);

  const handlePlaylistSelect = (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (playlist) {
      dispatch(selectPlaylist(playlist));
      dispatch(fetchPlaylistTracksRequest({ playlistId: playlist.id, offset: 0 }));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Select Playlist
        </label>
        <Select
          value={selectedPlaylist?.id || ''}
          onValueChange={handlePlaylistSelect}
          disabled={loading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a playlist..." />
          </SelectTrigger>
          <SelectContent>
            {playlists.map((playlist) => (
              <SelectItem key={playlist.id} value={playlist.id}>
                <div className="flex items-center space-x-2">
                  {playlist.images[0] && (
                    <img
                      src={playlist.images[0].url}
                      alt={playlist.name}
                      className="w-6 h-6 rounded"
                    />
                  )}
                  <span>{playlist.name}</span>
                  <span className="text-xs text-gray-500">
                    ({playlist.tracks.total} tracks)
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedPlaylist && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-start space-x-4">
            {selectedPlaylist.images[0] && (
              <img
                src={selectedPlaylist.images[0].url}
                alt={selectedPlaylist.name}
                className="w-16 h-16 rounded-lg shadow-md"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{selectedPlaylist.name}</h3>
              <p className="text-sm text-gray-600 mb-2">
                by {selectedPlaylist.owner.display_name}
              </p>
              {selectedPlaylist.description && (
                <p className="text-sm text-gray-700">
                  {selectedPlaylist.description}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                {selectedPlaylist.tracks.total} tracks
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};