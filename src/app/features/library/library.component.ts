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
  isModalVisible: boolean = false;
  selectedTrack: Track | null = null;
  modalMode: 'add' | 'update' = 'add';
  private destroy$ = new Subject<void>();
  isLoading = true;
  error: string | null = null;

  constructor(private trackService: TrackService) {
    this.tracks$ = new Observable<Track[]>();
    this.filteredTracks$ = this.tracks$;
  }

  ngOnInit() {
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

  // Show modal for adding new track
  showAddModal() {
    this.selectedTrack = null;
    this.modalMode = 'add';
    this.isModalVisible = true;
  }

  // Show modal for updating track
  showUpdateModal(track: Track) {
    this.selectedTrack = track;
    this.modalMode = 'update';
    this.isModalVisible = true;
  }

  // Close modal
  closeModal() {
    this.isModalVisible = false;
    this.selectedTrack = null;
  }

  onSongSubmit(event: { track: Track, audioFile: File | null }) {
    if (!event || !event.track) {
      console.error('Invalid submission data');
      return;
    }
  
    if (this.modalMode === 'add' && event.audioFile) {
      this.trackService.addTrack(event.track, event.audioFile).subscribe({
        next: (addedTrack) => {
          console.log('Track added successfully:', addedTrack);
          this.loadTracks();
          this.closeModal();
        },
        error: (err) => {
          console.error('Failed to add track:', err);
          this.error = 'Failed to add track';
        }
      });
    } else if (this.modalMode === 'update') {
      // Vérifie si audioFile est présent avant de l'utiliser
      if (event.audioFile) {
        this.trackService.updateTrack(event.track, event.audioFile).subscribe({
          next: (updatedTrack) => {
            console.log('Track updated successfully:', updatedTrack);
            this.loadTracks();
            this.closeModal();
          },
          error: (err) => {
            console.error('Failed to update track:', err);
            this.error = 'Failed to update track';
          }
        });
      } else {
        // Si pas de nouveau fichier audio, met à jour uniquement les métadonnées
        this.trackService.updateTrackMetadata(event.track).subscribe({
          next: (updatedTrack) => {
            console.log('Track metadata updated successfully:', updatedTrack);
            this.loadTracks();
            this.closeModal();
          },
          error: (err) => {
            console.error('Failed to update track metadata:', err);
            this.error = 'Failed to update track metadata';
          }
        });
      }
    }
  }

  // Delete track
  deleteTrack(trackId: string) {
    if (confirm('Are you sure you want to delete this track?')) {
      this.trackService.deleteTrack(trackId).subscribe({
        next: () => {
          this.loadTracks();
        },
        error: (err) => {
          console.error('Failed to delete track', err);
          this.error = 'Failed to delete track';
        }
      });
    }
  }

  // Clear error message
  clearError() {
    this.error = null;
  }
}