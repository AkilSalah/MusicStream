import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Track } from '../../core/models/track';
import { IndexedDbService } from '../../core/services/indexed-db.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css'] 
})
export class LibraryComponent implements OnInit {
  tracks$: Observable<Track[]>;
  filteredTracks$: Observable<Track[]>;
  searchTerm = '';
  isModalVisible: boolean = false;

  constructor(private indexedDbService: IndexedDbService) {
    this.tracks$ = this.indexedDbService.getAllTracks();
    this.filteredTracks$ = this.tracks$;
  }

  ngOnInit() {
    // Load tracks from IndexedDB
    this.loadTracks();
  }

  loadTracks() {
    this.tracks$ = this.indexedDbService.getAllTracks();
    this.filteredTracks$ = this.tracks$;
  }

  showModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }

  onSongSubmit(track: Track): void {
    console.log('Song submitted:', track);
    this.indexedDbService.addTrack(track).subscribe({
      next: () => {
        console.log('Track added successfully');
        this.loadTracks(); // Reload tracks after adding
        this.closeModal();
      },
      error: (error) => console.error('Error adding track:', error)
    });
  }

  deleteTrack(id: string) {
    this.indexedDbService.deleteTrack(id).subscribe({
      next: () => {
        console.log('Track deleted successfully');
        this.loadTracks(); // Reload tracks after deleting
      },
      error: (error) => console.error('Error deleting track:', error)
    });
  }
}

