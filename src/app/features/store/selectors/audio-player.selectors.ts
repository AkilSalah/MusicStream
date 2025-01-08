import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PlayerStateModel } from '../reducers/trackPlayer.reducer';

export const selectPlayerState = createFeatureSelector<PlayerStateModel>('player');

export const selectPlayerStatus = createSelector(
  selectPlayerState,
  (state: PlayerStateModel) => state.status
);

export const selectPlayerError = createSelector(
  selectPlayerState,
  (state: PlayerStateModel) => state.error
);

export const selectCurrentTrack = createSelector(
  selectPlayerState,
  (state: PlayerStateModel) => state.currentTrack
);

