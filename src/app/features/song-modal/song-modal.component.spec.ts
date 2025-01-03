import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongModalComponent } from './song-modal.component';

describe('SongModalComponent', () => {
  let component: SongModalComponent;
  let fixture: ComponentFixture<SongModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SongModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SongModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
