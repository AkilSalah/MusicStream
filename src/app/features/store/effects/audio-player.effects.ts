import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import * as PlayerActions from '../actions/audio-player.action';
import { TrackService } from '../../../core/services/indexed-db.service';

@Injectable()
export class PlayerEffects {
  constructor(
    private actions$: Actions,
    private trackService: TrackService
  ) {}

  loadTrack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.startLoading),
      switchMap(({ id }) =>
        this.trackService.getTrackById(id).pipe(
          map((track) =>
            track
              ? PlayerActions.loadSuccess({ track })
              : PlayerActions.loadError({ error: 'Track not found' })
          ),
          catchError((error) =>
            of(PlayerActions.loadError({ error: error.message || 'Failed to load track' }))
          )
        )
      )
    )
  );
  

  handleAudioError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.loadError),
      map(action => {
        console.error('Audio Player Error:', action.error);
        return PlayerActions.stop();
      })
    )
  );
}

