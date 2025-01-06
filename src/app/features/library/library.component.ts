import { Component } from '@angular/core';
import { Track } from '../../core/models/track';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as TrackActions from '../store/actions/track.action'; 
import * as fromTrackSelectors from '../store/selectors/track.selectors';


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
    this.tracks$ = this.store.select(fromTrackSelectors.selectAllTracks);
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

  onSongSubmit(track: Track): void {
    console.log('Song submitted:', track);
    this.store.dispatch(TrackActions.addTrack({ track }));
    this.closeModal();
  }
}