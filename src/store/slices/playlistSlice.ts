import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlaylistState, SpotifyPlaylist, SpotifyPlaylistTrack } from '../../types/spotify';

const initialState: PlaylistState = {
  playlists: [],
  selectedPlaylist: null,
  tracks: [],
  loading: false,
  error: null,
  hasMore: false,
  offset: 0,
};

export const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    fetchPlaylistsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPlaylistsSuccess: (state, action: PayloadAction<SpotifyPlaylist[]>) => {
      state.loading = false;
      state.playlists = action.payload;
      state.error = null;
    },
    fetchPlaylistsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    selectPlaylist: (state, action: PayloadAction<SpotifyPlaylist>) => {
      state.selectedPlaylist = action.payload;
      state.tracks = [];
      state.offset = 0;
      state.hasMore = true;
    },
    fetchPlaylistTracksRequest: (state, action: PayloadAction<{ playlistId: string; offset?: number }>) => {
      if (action.payload.offset === 0) {
        state.tracks = [];
      }
      state.loading = true;
      state.error = null;
    },
    fetchPlaylistTracksSuccess: (state, action: PayloadAction<{ tracks: SpotifyPlaylistTrack[]; hasMore: boolean; offset: number }>) => {
      state.loading = false;
      if (action.payload.offset === 0) {
        state.tracks = action.payload.tracks;
      } else {
        state.tracks = [...state.tracks, ...action.payload.tracks];
      }
      state.hasMore = action.payload.hasMore;
      state.offset = action.payload.offset;
      state.error = null;
    },
    fetchPlaylistTracksFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addTrackToPlaylistRequest: (state, action: PayloadAction<{ playlistId: string; trackUri: string }>) => {
      state.loading = true;
      state.error = null;
    },
    addTrackToPlaylistSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    addTrackToPlaylistFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    removeTrackFromPlaylistRequest: (state, action: PayloadAction<{ playlistId: string; trackUri: string }>) => {
      state.loading = true;
      state.error = null;
    },
    removeTrackFromPlaylistSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.tracks = state.tracks.filter(track => `spotify:track:${track.track.id}` !== action.payload);
      state.error = null;
    },
    removeTrackFromPlaylistFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    createPlaylistRequest: (state, action: PayloadAction<{ name: string; description?: string }>) => {
      state.loading = true;
      state.error = null;
    },
    createPlaylistSuccess: (state, action: PayloadAction<SpotifyPlaylist>) => {
      state.loading = false;
      state.playlists = [action.payload, ...state.playlists];
      state.error = null;
    },
    createPlaylistFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchPlaylistsRequest,
  fetchPlaylistsSuccess,
  fetchPlaylistsFailure,
  selectPlaylist,
  fetchPlaylistTracksRequest,
  fetchPlaylistTracksSuccess,
  fetchPlaylistTracksFailure,
  addTrackToPlaylistRequest,
  addTrackToPlaylistSuccess,
  addTrackToPlaylistFailure,
  removeTrackFromPlaylistRequest,
  removeTrackFromPlaylistSuccess,
  removeTrackFromPlaylistFailure,
  createPlaylistRequest,
  createPlaylistSuccess,
  createPlaylistFailure,
} = playlistSlice.actions;