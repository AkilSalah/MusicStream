import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
   { path: 'library', loadChildren: () => import('./features/library/library.module').then(m => m.LibraryModule) },
   { path: 'track', loadChildren: () => import('./features/track/track.module').then(m => m.TrackModule) },
   { path: '', loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
