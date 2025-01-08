import { createAction, props } from '@ngrx/store';
import { Track } from '../../../core/models/track';

export const play = createAction('[Player] Play');
export const pause = createAction('[Player] Pause');
export const stop = createAction('[Player] Stop');
export const startBuffering = createAction('[Player] Start Buffering');
export const startLoading = createAction(
    '[Player] Start Loading',
    props<{ id: string }>() 
  );
export const loadSuccess = createAction('[Player] Load Success', props<{ track: Track }>());
export const loadError = createAction('[Player] Load Error', props<{ error: string }>());

