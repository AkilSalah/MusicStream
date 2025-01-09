import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  imageUrl: string | null = null;  

  // Player state
  isPlaying = false;
  isMuted = false;
  volume = 1;
  currentTime = '00:00';
  duration = '00:00';
  progress = 0;
  
   tracks: Track[] = [];
   currentTrackIndex = -1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private trackService: TrackService,
    private store: Store
  ) {
    this.track$ = this.store.select(PlayerSelectors.selectCurrentTrack);
    this.playerStatus$ = this.store.select(PlayerSelectors.selectPlayerStatus);
    this.playerError$ = this.store.select(PlayerSelectors.selectPlayerError);
  }
  private loadTrackImage(trackId: string) {
    this.trackService.getImageFile(trackId).subscribe({
      next: (imageBlob) => {
        if (imageBlob) {
          // Nettoyer l'ancienne URL si elle existe
          if (this.imageUrl) {
            URL.revokeObjectURL(this.imageUrl);
          }
          // Créer une nouvelle URL pour l'image
          this.imageUrl = URL.createObjectURL(imageBlob);
        }
      },
      error: (error) => {
        console.error('Error loading track image:', error);
      }
    });
  }
  ngOnInit() {
    this.trackService.getAllTrackMetadata().pipe(
      switchMap(tracks => {
        this.tracks = tracks;
        return this.route.params;
      })
    ).subscribe(params => {
      const trackId = params['id'];
      this.currentTrackIndex = this.tracks.findIndex(t => t.id === trackId);
      this.loadTrack(trackId);
    });
  }
  

  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  togglePlay() {
    if (this.audioPlayer.nativeElement.paused) {
      this.audioPlayer.nativeElement.play();
    } else {
      this.audioPlayer.nativeElement.pause();
    }
  }



  toggleMute() {
    this.audioPlayer.nativeElement.muted = !this.audioPlayer.nativeElement.muted;
    this.isMuted = this.audioPlayer.nativeElement.muted;
  }

  updateVolume(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.audioPlayer.nativeElement.volume = Number(value);
    this.volume = Number(value);
  }

  seekTo(event: MouseEvent) {
    const progressBar = event.currentTarget as HTMLElement;
    const clickPosition = event.offsetX;
    const width = progressBar.offsetWidth;
    const percentage = clickPosition / width;
    const time = percentage * this.audioPlayer.nativeElement.duration;
    this.audioPlayer.nativeElement.currentTime = time;
  }

  onTimeUpdate() {
    const audio = this.audioPlayer.nativeElement;
    this.currentTime = this.formatTime(audio.currentTime);
    this.progress = (audio.currentTime / audio.duration) * 100;
  }

  onLoadedMetadata() {
    const audio = this.audioPlayer.nativeElement;
    this.duration = this.formatTime(audio.duration);
  }

  private loadTrack(trackId: string) {
    this.store.dispatch(PlayerActions.startLoading({ id: trackId }));
    
    this.trackService.getTrackById(trackId).pipe(
      tap(track => {
        if (track) {
          this.store.dispatch(PlayerActions.loadSuccess({ track }));
          this.loadTrackImage(track.id);
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
          if (this.audioUrl) {
            URL.revokeObjectURL(this.audioUrl);
          }
          this.audioUrl = URL.createObjectURL(audioBlob);
        } else {
          this.store.dispatch(PlayerActions.loadError({ error: 'Audio file not found' }));
        }
      },
      error: (error) => {
        this.store.dispatch(PlayerActions.loadError({ error: error.message }));
      }
    });
  }

  nextTrack() {
    if (this.currentTrackIndex < this.tracks.length - 1) {
      const nextTrack = this.tracks[this.currentTrackIndex + 1];
      this.router.navigate(['/track', nextTrack.id]);
    }
  }

  previousTrack() {
    if (this.currentTrackIndex > 0) {
      const prevTrack = this.tracks[this.currentTrackIndex - 1];
      this.router.navigate(['/track', prevTrack.id]);
    }
  }

  onPlay() {
    this.isPlaying = true;
    this.store.dispatch(PlayerActions.play());
  }

  onPause() {
    this.isPlaying = false;
    this.store.dispatch(PlayerActions.pause());
  }

  onStop() {
    this.isPlaying = false;
    this.store.dispatch(PlayerActions.stop());
  }

  onError() {
    this.store.dispatch(PlayerActions.loadError({ error: 'Error playing audio file' }));
  }

  ngOnDestroy() {
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
    }
    if(this.imageUrl){
      URL.revokeObjectURL(this.imageUrl)
    }
  }
}