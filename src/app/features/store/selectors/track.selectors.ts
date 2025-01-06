import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TrackState } from '../reducers/track.reducer';

export const selectTrackState = createFeatureSelector<TrackState>('tracks');

export const selectAllTracks = createSelector(
  selectTrackState,
  (state: TrackState) => state.tracks
);

export const selectTrackById = (id: string) => createSelector(
  selectAllTracks,
  (tracks) => tracks.find(track => track.id === id)
);