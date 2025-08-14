import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchState, SpotifyTrack } from '../../types/spotify';

const initialState: SearchState = {
  query: '',
  results: [],
  loading: false,
  error: null,
  hasMore: false,
  offset: 0,
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
      if (!action.payload.trim()) {
        state.results = [];
        state.hasMore = false;
        state.offset = 0;
      }
    },
    searchTracksRequest: (state, action: PayloadAction<{ query: string; offset?: number }>) => {
      if (action.payload.offset === 0) {
        state.results = [];
      }
      state.loading = true;
      state.error = null;
    },
    searchTracksSuccess: (state, action: PayloadAction<{ tracks: SpotifyTrack[]; hasMore: boolean; offset: number }>) => {
      state.loading = false;
      if (action.payload.offset === 0) {
        state.results = action.payload.tracks;
      } else {
        state.results = [...state.results, ...action.payload.tracks];
      }
      state.hasMore = action.payload.hasMore;
      state.offset = action.payload.offset;
      state.error = null;
    },
    searchTracksFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearSearch: (state) => {
      state.query = '';
      state.results = [];
      state.hasMore = false;
      state.offset = 0;
      state.error = null;
    },
  },
});

export const {
  setSearchQuery,
  searchTracksRequest,
  searchTracksSuccess,
  searchTracksFailure,
  clearSearch,
} = searchSlice.actions;