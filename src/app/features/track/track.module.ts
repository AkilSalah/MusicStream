import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrackRoutingModule } from './track-routing.module';
import { TrackComponent } from './track.component';
import { StoreModule } from '@ngrx/store';
import { trackReducer } from '../store/reducers/track.reducer';
import { TrackEffects } from '../store/effects/track.effects';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [
    TrackComponent,
    SourceBufferList
  ],
  imports: [
    CommonModule,
    TrackRoutingModule,
    // StoreModule.forRoot({ tracks: trackReducer }),
    // EffectsModule.forRoot([TrackEffects])
  ]
})
export class TrackModule { }
