import { createAction, props } from '@ngrx/store';
import { Track } from '../../../core/models/track';

export const loadTracks = createAction('[Track] Load Tracks');
export const loadTracksSuccess = createAction('[Track] Load Tracks Success', props<{ tracks: Track[] }>());
export const loadTracksError = createAction('[Track] Load Tracks Error', props<{ error: any }>());

export const addTrack = createAction('[Track] Add Track', props<{ track: Track; audioFile: File }>());
export const addTrackSuccess = createAction('[Track] Add Track Success', props<{ track: Track }>());
export const addTrackError = createAction('[Track] Add Track Error', props<{ error: any }>());

export const updateTrack = createAction('[Track] Update Track', props<{ track: Track }>());
export const updateTrackSuccess = createAction('[Track] Update Track Success', props<{ track: Track }>());
export const updateTrackError = createAction('[Track] Update Track Error', props<{ error: any }>());

export const deleteTrack = createAction('[Track] Delete Track', props<{ id: string }>());
export const deleteTrackSuccess = createAction('[Track] Delete Track Success', props<{ id: string }>());
export const deleteTrackError = createAction('[Track] Delete Track Error', props<{ error: any }>());
