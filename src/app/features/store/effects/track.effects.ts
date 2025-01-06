import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as TrackActions from '../actions/track.action';
import { IndexedDbService } from '../../../core/services/indexed-db.service';

@Injectable()
export class TrackEffects {
  loadTracks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrackActions.loadTracks),
      mergeMap(() =>
        this.indexedDbService.getAllTracks().pipe(
          map(tracks => TrackActions.loadTracksSuccess({ tracks })),
          catchError(error => of({ type: '[Track] Load Tracks Error', payload: error }))
        )
      )
    )
  );

  addTrack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrackActions.addTrack),
      mergeMap(action =>
        this.indexedDbService.addTrack(action.track).pipe(
          map(track => TrackActions.addTrackSuccess({ track })),
          catchError(error => of({ type: '[Track] Add Track Error', payload: error }))
        )
      )
    )
  );

  updateTrack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrackActions.updateTrack),
      mergeMap(action =>
        this.indexedDbService.updateTrack(action.track).pipe(
          map(track => TrackActions.updateTrackSuccess({ track })),
          catchError(error => of({ type: '[Track] Update Track Error', payload: error }))
        )
      )
    )
  );

  deleteTrack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrackActions.deleteTrack),
      mergeMap(action =>
        this.indexedDbService.deleteTrack(action.id).pipe(
          map(() => TrackActions.deleteTrackSuccess({ id: action.id })),
          catchError(error => of({ type: '[Track] Delete Track Error', payload: error }))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private indexedDbService: IndexedDbService
  ) {}
}