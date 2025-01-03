import { createReducer, on } from '@ngrx/store';
import { Track } from "../../../core/models/track";
import { addTrack, deleteTrack, updateTrack, loadTracks } from '../actions/track.action';

export interface State {
  tracks: Track[];
  loading: boolean;
  error: string | null;
}

export const initialState: State = {
  tracks: [],
  loading: false,
  error: null,
};

export const trackReducer = createReducer(
  initialState,
  
  on(addTrack, (state, { track }) => ({
    ...state,
    tracks: [...state.tracks, track]
  })),

  on(updateTrack, (state, { track }) => ({
    ...state,
    tracks: state.tracks.map(t => t.id === track.id ? track : t)
  })),

  on(deleteTrack, (state, { id }) => ({
    ...state,
    tracks: state.tracks.filter(track => track.id !== id)
  })),

  on(loadTracks, state => ({
    ...state,
    loading: true
  }))
);
