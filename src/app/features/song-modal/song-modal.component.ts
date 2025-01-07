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
  @Output() submit = new EventEmitter<{ track: Track, audioFile: File }>();
  audioFile: File | null = null;

  trackForm: FormGroup;
  categories = Object.values(MusicCategory);

  constructor(private fb: FormBuilder) {
    this.trackForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      artist: ['', [Validators.required]],
      description: ['', [Validators.maxLength(200)]],
      category: [null, [Validators.required]],
    });
  }

  // Close modal
  closeModal() {
    this.modalClose.emit();
    this.resetForm();
  }

  // Reset form and audioFile
  resetForm() {
    this.trackForm.reset();
    this.audioFile = null;
  }

  // Update form if track is passed from parent
  ngOnChanges() {
    if (this.track) {
      this.trackForm.patchValue(this.track);
    } else if (this.isVisible) {
      this.trackForm.reset();
      this.audioFile = null;
    }
  }

  // Handle file change (audio file)
  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audio.onloadedmetadata = () => {
        this.trackForm.patchValue({ duration: Math.round(audio.duration) });
      };
      this.audioFile = file;
    }
  }

  onSubmit() {
    if (this.trackForm.valid && this.audioFile) {
      const formValue = this.trackForm.value;
      const track: Track = {
        id: this.track?.id || '',  // Use an empty string for new tracks
        title: formValue.title,
        artist: formValue.artist,
        description: formValue.description || '',
        category: formValue.category,
        addedAt: new Date(),
        duration: 0,  // This will be calculated when needed
        fileUrl: this.audioFile?.name || ''  // Assuming this.audioFile is the file object and fileUrl is the path
      };
      
      this.submit.emit({ track, audioFile: this.audioFile });
      this.resetForm();
      this.closeModal();
    }
  }
  
  
}
