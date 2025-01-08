import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, switchMap, tap } from 'rxjs';
import { TrackService } from '../../core/services/indexed-db.service';
import * as PlayerActions from '../store/actions/audio-player.action';
import * as PlayerSelectors from '../store/selectors/audio-player.selectors';
import { Track } from '../../core/models/track';
import { PlayerState } from '../store/reducers/trackPlayer.reducer';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html'
})
export class TrackComponent implements OnInit {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
  track$: Observable<Track | null>;
  playerStatus$: Observable<PlayerState>;
  playerError$: Observable<string | null>;
  audioUrl: string | null = null;
  PlayerState = PlayerState;

  constructor(
    private route: ActivatedRoute,
    private trackService: TrackService,
    private store: Store
  ) {
    this.track$ = this.store.select(PlayerSelectors.selectCurrentTrack);
    this.playerStatus$ = this.store.select(PlayerSelectors.selectPlayerStatus);
    this.playerError$ = this.store.select(PlayerSelectors.selectPlayerError);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const trackId = params['id'];
      this.store.dispatch(PlayerActions.startLoading({ id: trackId }));
      
      // Get track metadata and audio file
      this.trackService.getTrackById(trackId).pipe(
        tap(track => {
          if (track) {
            this.store.dispatch(PlayerActions.loadSuccess({ track }));
          } else {
            this.store.dispatch(PlayerActions.loadError({ error: 'Track not found' }));
          }
        }),
        switchMap(track => {
          if (!track) {
            throw new Error('Track not found');
          }
          return this.trackService.getAudioFile(track.id);
        })
      ).subscribe({
        next: (audioBlob) => {
          if (audioBlob) {
            // Create object URL for the audio blob
            this.audioUrl = URL.createObjectURL(audioBlob);
            if (this.audioPlayer) {
              this.audioPlayer.nativeElement.src = this.audioUrl;
            }
          } else {
            this.store.dispatch(PlayerActions.loadError({ error: 'Audio file not found' }));
          }
        },
        error: (error) => {
          this.store.dispatch(PlayerActions.loadError({ error: error.message }));
        }
      });
    });
  }

  ngOnDestroy() {
    // Clean up object URL when component is destroyed
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
    }
  }

  onPlay() {
    this.store.dispatch(PlayerActions.play());
  }

  onPause() {
    this.store.dispatch(PlayerActions.pause());
  }

  onStop() {
    this.store.dispatch(PlayerActions.stop());
  }

  onError() {
    this.store.dispatch(PlayerActions.loadError({ error: 'Error playing audio file' }));
  }
}