import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryRoutingModule } from './library-routing.module';
import { LibraryComponent } from './library.component';
import { SongModalComponent } from '../song-modal/song-modal.component';

@NgModule({
  declarations: [
    LibraryComponent
  ],
  imports: [
    CommonModule,
    LibraryRoutingModule,
    SongModalComponent  
  ]
})
export class LibraryModule { }