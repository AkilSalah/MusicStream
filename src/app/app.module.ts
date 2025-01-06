import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { StoreModule } from '@ngrx/store';
import { FormGroup, FormsModule } from '@angular/forms';
import { trackReducer } from './features/store/reducers/track.reducer';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    StoreModule.forRoot({ tracks: trackReducer }), 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
