import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, catchError, map, takeUntil } from 'rxjs';
import { Track } from '../../core/models/track';
import { TrackService } from '../../core/services/indexed-db.service';
import { SearchService } from '../../core/services/search.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit, OnDestroy {
  tracks$: Observable<Track[]>;
  filteredTracks$: Observable<Track[]>;
  searchText: string = '';
  isModalVisible: boolean = false;
  selectedTrack: Track | null = null;
  modalMode: 'add' | 'update' = 'add';
  private destroy$ = new Subject<void>();
  isLoading = true;
  error: string | null = null;
  selectedCategory: string = 'ALL';
  trackImages: Map<string, string> = new Map();


  constructor(private trackService: TrackService,private searchService: SearchService) {
    this.tracks$ = new Observable<Track[]>();
    this.filteredTracks$ = this.tracks$;
  }

  searchTrack(): void {
    this.tracks$ = this.tracks$.pipe(
      map(tracks => {
        const searchText = this.searchText.trim().toLowerCase();
        if (!searchText) return tracks;
        
        return tracks.filter(track =>
          track.title.toLowerCase().includes(searchText) ||
          track.artist.toLowerCase().includes(searchText)
        );
      })
    );
  }
  
  
  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.tracks$ = this.trackService.getAllTrackMetadata().pipe(
      map(tracks => {
        if (category === 'ALL') return tracks;
        return tracks.filter(track => track.category.toLowerCase() === category.toLowerCase());
      })
    );
  }
  

  ngOnInit() {
    this.trackService.dbReady$.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (ready) => {
        if (ready) {
          // Initialiser d'abord les tracks
          this.loadTracks();
          
          // Puis s'abonner aux changements de recherche
          this.searchService.searchText$.pipe(
            takeUntil(this.destroy$)
          ).subscribe(text => {
            this.searchText = text;
            this.searchTrack();
          });
          
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

  loadTracks() {
    this.tracks$ = this.trackService.getAllTrackMetadata().pipe(
      map(tracks => {
        tracks.forEach(track => {
          if (!this.trackImages.has(track.id)) {
            this.loadTrackImage(track.id);
          }
        });
        return tracks;
      }),
      catchError(error => {
        this.error = 'Failed to load tracks';
        console.error('Error loading tracks:', error);
        return [];
      })
    );
    
    // Initialiser filteredTracks$ avec tous les tracks au départ
    this.filteredTracks$ = this.tracks$;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    // Nettoyer toutes les URLs d'images
    this.trackImages.forEach(url => URL.revokeObjectURL(url));
    this.trackImages.clear();
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

  onSongSubmit(event: { 
    track: Track; 
    audioFile: File | null;
    imageFile: File | null;
  }) {
    if (!event || !event.track) {
      console.error('Invalid submission data');
      return;
    }
  
    if (this.modalMode === 'add' && event.audioFile) {
      // Créer immédiatement l'URL de l'image si elle existe
      if (event.imageFile) {
        const imageUrl = URL.createObjectURL(event.imageFile);
        this.trackImages.set(event.track.id, imageUrl);
      }

      this.trackService.addTrack(event.track, event.audioFile, event.imageFile || undefined).subscribe({
        next: (addedTrack) => {
          console.log('Track added successfully:', addedTrack);
          // Pas besoin de recharger l'image car elle est déjà affichée
          this.loadTracks();
          this.closeModal();
        },
        error: (err) => {
          // En cas d'erreur, supprimer l'URL de l'image
          if (event.imageFile) {
            URL.revokeObjectURL(this.trackImages.get(event.track.id) || '');
            this.trackImages.delete(event.track.id);
          }
          console.error('Failed to add track:', err);
          this.error = 'Failed to add track';
        }
      });
    } else if (this.modalMode === 'update') {
      if (event.audioFile) {
        // Même logique pour la mise à jour
        if (event.imageFile) {
          const imageUrl = URL.createObjectURL(event.imageFile);
          this.trackImages.set(event.track.id, imageUrl);
        }

        this.trackService.updateTrack(event.track, event.audioFile, event.imageFile || undefined).subscribe({
          next: (updatedTrack) => {
            console.log('Track updated successfully:', updatedTrack);
            this.loadTracks();
            this.closeModal();
          },
          error: (err) => {
            if (event.imageFile) {
              URL.revokeObjectURL(this.trackImages.get(event.track.id) || '');
              this.trackImages.delete(event.track.id);
            }
            console.error('Failed to update track:', err);
            this.error = 'Failed to update track';
          }
        });
      } else {
        // Mise à jour des métadonnées uniquement
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

  loadTrackImage(trackId: string) {
    this.trackService.getImageFile(trackId).subscribe({
      next: (blob) => {
        if (blob) {
          const imageUrl = URL.createObjectURL(blob);
          this.trackImages.set(trackId, imageUrl);
        }
      },
      error: (error) => console.error('Error loading image:', error)
    });
  }

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
}