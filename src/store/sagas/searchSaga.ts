import { call, put, takeLatest, select, debounce } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { spotifyService } from '../../services/spotify';
import { 
  searchTracksRequest,
  searchTracksSuccess,
  searchTracksFailure,
} from '../slices/searchSlice';
import { RootState } from '../index';
import { SpotifySearchResult } from '../../types/spotify';

function* handleSearchTracks(
  action: PayloadAction<{ query: string; offset?: number }>
): Generator<any, void, any> {
  try {
    const accessToken: string = yield select((state: RootState) => state.auth.accessToken);
    const { query, offset = 0 } = action.payload;
    
    if (!query.trim()) {
      yield put(searchTracksSuccess({ tracks: [], hasMore: false, offset: 0 }));
      return;
    }
    
    const response: SpotifySearchResult = yield call(
      [spotifyService, 'searchTracks'], 
      accessToken, 
      query, 
      offset
    );
    
    yield put(searchTracksSuccess({
      tracks: response.tracks.items,
      hasMore: response.tracks.next !== null,
      offset: offset + response.tracks.items.length,
    }));
  } catch (error) {
    yield put(searchTracksFailure(error instanceof Error ? error.message : 'Search failed'));
  }
}

export function* searchSaga() {
  yield debounce(300, searchTracksRequest.type, handleSearchTracks);
}