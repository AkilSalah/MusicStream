import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrackRoutingModule } from './track-routing.module';
import { TrackComponent } from './track.component';
import { StoreModule } from '@ngrx/store';


@NgModule({
  declarations: [
    TrackComponent
  ],
  imports: [
    CommonModule,
    TrackRoutingModule,
    StoreModule.forRoot({}, {}),
  ]
})
export class TrackModule { }
