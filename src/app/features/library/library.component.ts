import { Component } from '@angular/core';
import { Track } from '../../core/models/track';
import { Observable } from 'rxjs';
import { state } from '@angular/animations';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrl: './library.component.css'
})
export class LibraryComponent {
  tracks$: Observable<Track[]>;
  filteredTracks$: Observable<Track[]>;
  searchTerm = '';
  isModalVisible: boolean = false;


  constructor(private store: Store) {
    this.tracks$ = this.store.select(fromTrack.selectAllTracks);
    this.filteredTracks$ = this.tracks$;
  }

  ngOnInit() {
    this.store.dispatch(TrackActions.loadTracks());
  }



  showModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }

  onSongSubmit(track: Track) : void {
    console.log('Song submitted:', track);
    // this.store.dispatch(addTrack({ track }));
    this.closeModal();
  }
    


  
}