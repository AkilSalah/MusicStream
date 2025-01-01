import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrackComponent } from './track.component';

const routes: Routes = [{ path: '', component: TrackComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackRoutingModule { }
