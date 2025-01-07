import { createReducer, on } from '@ngrx/store';
import * as TrackActions from '../actions/track.action';
import { Track } from '../../../core/models/track';

export interface TrackState {
  tracks: Track[];
  loading: boolean;
  error: string | null;
}

export const initialState: TrackState = {
  tracks: [],
  loading: false,
  error: null
};

export const trackReducer = createReducer(
  initialState,
  on(TrackActions.loadTracks, state => ({ ...state, loading: true, error: null })),
  on(TrackActions.loadTracksSuccess, (state, { tracks }) => ({ ...state, tracks, loading: false })),
  on(TrackActions.loadTracksError, (state, { error }) => ({ ...state, loading: false, error: error.message })),
  on(TrackActions.addTrackSuccess, (state, { track }) => ({ ...state, tracks: [...state.tracks, track] })),
  on(TrackActions.addTrackError, (state, { error }) => ({ ...state, error: error.message })),
  on(TrackActions.updateTrackSuccess, (state, { track }) => ({
    ...state,
    tracks: state.tracks.map(t => t.id === track.id ? track : t)
  })),
  on(TrackActions.updateTrackError, (state, { error }) => ({ ...state, error: error.message })),
  on(TrackActions.deleteTrackSuccess, (state, { id }) => ({
    ...state,
    tracks: state.tracks.filter(t => t.id !== id)
  })),
  on(TrackActions.deleteTrackError, (state, { error }) => ({ ...state, error: error.message }))
);
