import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Track } from '../../core/models/track';
import { Store } from '@ngrx/store';
import * as TrackActions from '../store/actions/track.action'; 
import * as fromTrackSelectors from '../store/selectors/track.selectors';
import { ActivatedRoute } from '@angular/router';
import { TrackService } from '../../core/services/indexed-db.service';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrl: './track.component.css'
})
export class TrackComponent {
  track: any;

  constructor(
    private route: ActivatedRoute,
    private trackService: TrackService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const trackId = params['id'];
      this.trackService.getTrackById(trackId).subscribe(track => {
        this.track = track;
      });
    });
  }
}