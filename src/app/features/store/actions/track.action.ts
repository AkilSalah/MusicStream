import { createAction, props } from "@ngrx/store";
import { Track } from "../../../core/models/track";

export const ACTION = createAction(
'[Track] Load Tracks'
);
export const addTrack = createAction(
    '[Track] Add Track', props<{ track: Track }>()
);
export const updateTrack = createAction(
    '[Track] Update Track', props<{ track: Track }>()
);
export const deleteTrack = createAction(
    '[Track] Delete Track', props<{ id: string }>()
);