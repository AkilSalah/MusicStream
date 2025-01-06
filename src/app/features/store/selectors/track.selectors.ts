import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TrackState } from '../reducers/track.reducer';

// Feature Selector
export const selectTracksFeature = createFeatureSelector<TrackState>('tracks');

// Select All Tracks
export const selectAllTracks = createSelector(
  selectTracksFeature,
  (state: TrackState) => state.tracks
);

// Select Loading State
export const selectTracksLoading = createSelector(
  selectTracksFeature,
  (state: TrackState) => state.loading
);

// Select Error
export const selectTracksError = createSelector(
  selectTracksFeature,
  (state: TrackState) => state.error
);
