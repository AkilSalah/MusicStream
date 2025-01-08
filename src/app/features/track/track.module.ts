import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackRoutingModule } from './track-routing.module';
import { TrackComponent } from './track.component';

@NgModule({
  declarations: [
    TrackComponent,
  ],
  imports: [
    CommonModule,
    TrackRoutingModule,
  ]
})
export class TrackModule { }