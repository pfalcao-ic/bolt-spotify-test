import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { spotifyAuth } from '../../services/auth';
import { spotifyService } from '../../services/spotify';
import { 
  loginRequest, 
  loginSuccess, 
  loginFailure, 
  exchangeCodeRequest,
  checkAuthRequest 
} from '../slices/authSlice';
import { SpotifyUser } from '../../types/spotify';

function* handleLogin(): Generator<any, void, any> {
  try {
    yield call([spotifyAuth, 'initiateAuth']);
  } catch (error) {
    yield put(loginFailure(error instanceof Error ? error.message : 'Login failed'));
  }
}

function* handleExchangeCode(action: PayloadAction<string>): Generator<any, void, any> {
  try {
    const accessToken: string = yield call([spotifyAuth, 'exchangeCodeForToken'], action.payload);
    const user: SpotifyUser = yield call([spotifyService, 'getCurrentUser'], accessToken);
    
    spotifyAuth.storeToken(accessToken);
    yield put(loginSuccess({ accessToken, user }));
  } catch (error) {
    yield put(loginFailure(error instanceof Error ? error.message : 'Token exchange failed'));
  }
}

function* handleCheckAuth(): Generator<any, void, any> {
  try {
    const storedToken = spotifyAuth.getStoredToken();
    if (storedToken) {
      const user: SpotifyUser = yield call([spotifyService, 'getCurrentUser'], storedToken);
      yield put(loginSuccess({ accessToken: storedToken, user }));
    }
  } catch (error) {
    // Token might be expired, clear it
    spotifyAuth.clearToken();
    yield put(loginFailure('Session expired'));
  }
}

export function* authSaga() {
  yield takeEvery(loginRequest.type, handleLogin);
  yield takeLatest(exchangeCodeRequest.type, handleExchangeCode);
  yield takeLatest(checkAuthRequest.type, handleCheckAuth);
}