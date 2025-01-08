import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackRoutingModule } from './track-routing.module';
import { TrackComponent } from './track.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TrackComponent,
  ],
  imports: [
    CommonModule,
    TrackRoutingModule,
    FormsModule
  ]
})
export class TrackModule { }