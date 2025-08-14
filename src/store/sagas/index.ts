import { all } from 'redux-saga/effects';
import { authSaga } from './authSaga';
import { playlistSaga } from './playlistSaga';
import { searchSaga } from './searchSaga';

export function* rootSaga() {
  yield all([
    authSaga(),
    playlistSaga(),
    searchSaga(),
  ]);
}