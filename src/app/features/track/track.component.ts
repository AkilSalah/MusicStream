import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Track } from '../../core/models/track';
import { Store } from '@ngrx/store';
import * as TrackActions from '../store/actions/track.action'; 
import * as fromTrackSelectors from '../store/selectors/track.selectors';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrl: './track.component.css'
})
export class TrackComponent {
  tracks$: Observable<Track[]>;
  constructor(private store: Store) {
    this.tracks$ = this.store.select(fromTrackSelectors.selectAllTracks);
  }
  // ngOnInit() {
  //   this.store.dispatch(TrackActions.loadTracks());
  // }

  // editTrack(track: Track) {
  //   // Implement edit logic (e.g., open modal with track data)
  // }

  // deleteTrack(id: string) {
  //   this.store.dispatch(TrackActions.deleteTrack({ id }));
  // }

}
