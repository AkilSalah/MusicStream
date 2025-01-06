import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Track, MusicCategory } from '../../core/models/track';

@Component({
  selector: 'app-song-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './song-modal.component.html'
})
export class SongModalComponent implements OnChanges {
  @Input() isVisible = false;
  @Input() track: Track | null = null;
  @Output() modalClose = new EventEmitter<void>();
  @Output() submit = new EventEmitter<Track>();

  trackForm: FormGroup;
  categories = Object.values(MusicCategory);

  constructor(private fb: FormBuilder) {
    this.trackForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      artist: ['', [Validators.required]],
      description: ['', [Validators.maxLength(200)]],
      category: ['', [Validators.required]],
      trackFile: [null, [Validators.required]]
    });
  }

  ngOnChanges() {
    if (this.track) {
      this.trackForm.patchValue(this.track);
    }
  }

  closeModal() {
    this.modalClose.emit();
  }

  onSubmit() {
    if (this.trackForm.valid) {
      const formData = this.trackForm.value;
      const track: Track = {
        ...formData,
        id: this.track ? this.track.id : undefined,
        date: new Date(),
        duration: 0 
      };
      this.submit.emit(track);
    }
  }

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // You can add file processing logic here if needed
      this.trackForm.patchValue({ trackFile: file });
    }
  }
}

