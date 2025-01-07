import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, catchError, takeUntil } from 'rxjs';
import { Track } from '../../core/models/track';
import { TrackService } from '../../core/services/indexed-db.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css'] 
})
export class LibraryComponent implements OnInit, OnDestroy {
  tracks$: Observable<Track[]>;
  filteredTracks$: Observable<Track[]>;
  searchTerm = '';
  isModalVisible: boolean = false; // Controls modal visibility
  private destroy$ = new Subject<void>();
  isLoading = true;
  error: string | null = null;

  constructor(private trackService: TrackService) {
    // Initialize with empty observables
    this.tracks$ = new Observable<Track[]>();
    this.filteredTracks$ = this.tracks$;
  }

  ngOnInit() {
    // Wait for DB initialization before loading tracks
    this.trackService.dbReady$.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (ready) => {
        if (ready) {
          this.loadTracks();
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.error = 'Failed to initialize database';
        this.isLoading = false;
        console.error('Database initialization error:', error);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTracks() {
    this.tracks$ = this.trackService.getAllTrackMetadata().pipe(
      catchError(error => {
        this.error = 'Failed to load tracks';
        console.error('Error loading tracks:', error);
        return [];
      })
    );
    this.filteredTracks$ = this.tracks$;
  }

  // Show modal
  showModal() {
    this.isModalVisible = true;
  }

  // Close modal
  closeModal() {
    this.isModalVisible = false;
  }

  onSongSubmit(event: { track: Track, audioFile: File }) {
    if (!event || !event.track || !event.audioFile) {
      console.error('Invalid submission data');
      return;
    }
  
    this.trackService.addTrack(event.track, event.audioFile).subscribe({
      next: (addedTrack) => {
        console.log('Track added successfully:', addedTrack);
        this.loadTracks(); // Reload the tracks list after adding a new one
        this.closeModal(); // Close modal after submission
      },
      error: (err) => {
        console.error('Failed to add track:', err);
        // Here you could add user feedback about the error
      }
    });
  }
  

  // Delete track
  deleteTrack(trackId: string) {
    this.trackService.deleteTrack(trackId).subscribe({
      next: () => {
        this.loadTracks(); // Reload tracks after deletion
      },
      error: (err) => {
        console.error('Failed to delete track', err);
      }
    });
  }
}
