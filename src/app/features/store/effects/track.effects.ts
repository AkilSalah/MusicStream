import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as TrackActions from '../actions/track.action';
import { TrackService } from '../../../core/services/indexed-db.service';
import { updateTrack } from '../actions/track.action';

@Injectable()
export class TrackEffects {
  loadTracks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrackActions.loadTracks),
      mergeMap(() =>
        this.indexedDbService.getAllTrackMetadata().pipe(
          map(tracks => TrackActions.loadTracksSuccess({ tracks })),
          catchError(error => of(TrackActions.loadTracksError({ error })))
        )
      )
    )
  );

  addTrack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrackActions.addTrack),
      mergeMap(action => {
        return this.indexedDbService.addTrack(action.track, action.audioFile).pipe(
          map(track => TrackActions.addTrackSuccess({ track })),
          catchError(error => of(TrackActions.addTrackError({ error })))
        );
      })
    )
  );

  // updateTrack$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(TrackActions.updateTrack),
  //     mergeMap(action =>
  //       this.indexedDbService.updateTrack(action.track,action.).pipe(
  //         map(track => TrackActions.updateTrackSuccess({ track })),
  //         catchError(error => of(TrackActions.updateTrackError({ error })))
  //       )
  //     )
  //   )
  // );

  deleteTrack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrackActions.deleteTrack),
      mergeMap(action =>
        this.indexedDbService.deleteTrack(action.id).pipe(
          map(() => TrackActions.deleteTrackSuccess({ id: action.id })),
          catchError(error => of(TrackActions.deleteTrackError({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private indexedDbService: TrackService
  ) {}
}
