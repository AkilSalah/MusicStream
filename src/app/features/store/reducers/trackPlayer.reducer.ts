import { createReducer, on } from '@ngrx/store';
import * as PlayerActions from '../actions/audio-player.action';
import { Track } from '../../../core/models/track';

export enum PlayerState {
  PLAYING = 'playing',
  PAUSED = 'paused',
  STOPPED = 'stopped',
  BUFFERING = 'buffering',
  LOADING = 'loading',
  ERROR = 'error',
  SUCCESS = 'success'
}

export interface PlayerStateModel {
  status: PlayerState;
  currentTrack: Track | null;
  error: string | null;
}

export const initialState: PlayerStateModel = {
  status: PlayerState.STOPPED,
  currentTrack: null,
  error: null,
};

export const playerReducer = createReducer(
  initialState,
  on(PlayerActions.play, state => ({ ...state, status: PlayerState.PLAYING })),
  on(PlayerActions.pause, state => ({ ...state, status: PlayerState.PAUSED })),
  on(PlayerActions.stop, state => ({ ...state, status: PlayerState.STOPPED, error: null })),
  on(PlayerActions.startBuffering, state => ({ ...state, status: PlayerState.BUFFERING })),
  on(PlayerActions.startLoading, state => ({ ...state, status: PlayerState.LOADING, error: null })),
  on(PlayerActions.loadSuccess, (state, { track }) => ({
    ...state,
    status: PlayerState.SUCCESS,
    currentTrack: track,
    error: null,
  })),
  on(PlayerActions.loadError, (state, { error }) => ({
    ...state,
    status: PlayerState.ERROR,
    error,
  }))
);

