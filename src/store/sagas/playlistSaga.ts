import { call, put, takeEvery, select } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { spotifyService } from '../../services/spotify';
import { 
  fetchPlaylistsRequest,
  fetchPlaylistsSuccess,
  fetchPlaylistsFailure,
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
} from '../slices/playlistSlice';
import { RootState } from '../index';
import { SpotifyPlaylist, SpotifyPaginatedResponse, SpotifyPlaylistTrack } from '../../types/spotify';

function* handleFetchPlaylists(): Generator<any, void, any> {
  try {
    const accessToken: string = yield select((state: RootState) => state.auth.accessToken);
    const response: SpotifyPaginatedResponse<SpotifyPlaylist> = yield call(
      [spotifyService, 'getUserPlaylists'], 
      accessToken
    );
    yield put(fetchPlaylistsSuccess(response.items));
  } catch (error) {
    yield put(fetchPlaylistsFailure(error instanceof Error ? error.message : 'Failed to fetch playlists'));
  }
}

function* handleFetchPlaylistTracks(
  action: PayloadAction<{ playlistId: string; offset?: number }>
): Generator<any, void, any> {
  try {
    const accessToken: string = yield select((state: RootState) => state.auth.accessToken);
    const { playlistId, offset = 0 } = action.payload;
    
    const response: SpotifyPaginatedResponse<SpotifyPlaylistTrack> = yield call(
      [spotifyService, 'getPlaylistTracks'], 
      accessToken, 
      playlistId, 
      offset
    );
    
    yield put(fetchPlaylistTracksSuccess({
      tracks: response.items,
      hasMore: response.next !== null,
      offset: offset + response.items.length,
    }));
  } catch (error) {
    yield put(fetchPlaylistTracksFailure(error instanceof Error ? error.message : 'Failed to fetch tracks'));
  }
}

function* handleAddTrackToPlaylist(
  action: PayloadAction<{ playlistId: string; trackUri: string }>
): Generator<any, void, any> {
  try {
    const accessToken: string = yield select((state: RootState) => state.auth.accessToken);
    const { playlistId, trackUri } = action.payload;
    
    yield call([spotifyService, 'addTrackToPlaylist'], accessToken, playlistId, trackUri);
    yield put(addTrackToPlaylistSuccess());
    
    // Refresh the playlist tracks
    yield put(fetchPlaylistTracksRequest({ playlistId, offset: 0 }));
  } catch (error) {
    yield put(addTrackToPlaylistFailure(error instanceof Error ? error.message : 'Failed to add track'));
  }
}

function* handleRemoveTrackFromPlaylist(
  action: PayloadAction<{ playlistId: string; trackUri: string }>
): Generator<any, void, any> {
  try {
    const accessToken: string = yield select((state: RootState) => state.auth.accessToken);
    const { playlistId, trackUri } = action.payload;
    
    yield call([spotifyService, 'removeTrackFromPlaylist'], accessToken, playlistId, trackUri);
    yield put(removeTrackFromPlaylistSuccess(trackUri));
  } catch (error) {
    yield put(removeTrackFromPlaylistFailure(error instanceof Error ? error.message : 'Failed to remove track'));
  }
}

function* handleCreatePlaylist(
  action: PayloadAction<{ name: string; description?: string }>
): Generator<any, void, any> {
  try {
    const accessToken: string = yield select((state: RootState) => state.auth.accessToken);
    const userId: string = yield select((state: RootState) => state.auth.user?.id);
    const { name, description } = action.payload;
    
    const playlist: SpotifyPlaylist = yield call(
      [spotifyService, 'createPlaylist'], 
      accessToken, 
      userId, 
      name, 
      description
    );
    
    yield put(createPlaylistSuccess(playlist));
  } catch (error) {
    yield put(createPlaylistFailure(error instanceof Error ? error.message : 'Failed to create playlist'));
  }
}

export function* playlistSaga() {
  yield takeEvery(fetchPlaylistsRequest.type, handleFetchPlaylists);
  yield takeEvery(fetchPlaylistTracksRequest.type, handleFetchPlaylistTracks);
  yield takeEvery(addTrackToPlaylistRequest.type, handleAddTrackToPlaylist);
  yield takeEvery(removeTrackFromPlaylistRequest.type, handleRemoveTrackFromPlaylist);
  yield takeEvery(createPlaylistRequest.type, handleCreatePlaylist);
}