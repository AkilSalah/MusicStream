import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Track } from '../../core/models/track';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrl: './track.component.css'
})
export class TrackComponent {
  tracks$: Observable<Track[]>;
  constructor(private store: Store) {
    this.tracks$ = this.store.select(fromTrack.selectAllTracks);
  }
  ngOnInit() {
    this.store.dispatch(TrackActions.loadTracks());
  }

  editTrack(track: Track) {
    // Implement edit logic (e.g., open modal with track data)
  }

  deleteTrack(id: string) {
    this.store.dispatch(TrackActions.deleteTrack({ id }));
  }

}
