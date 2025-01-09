import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Track, MusicCategory } from '../../core/models/track';
import { TrackService } from '../../core/services/indexed-db.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-song-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './song-modal.component.html'
})
export class SongModalComponent implements OnChanges {
  @Input() isVisible = false;
  @Input() track: Track | null = null;
  @Input() mode: 'add' | 'update' = 'add';
  @Output() modalClose = new EventEmitter<void>();
  @Output() submit = new EventEmitter<{ 
    track: Track; 
    audioFile: File | null;
    imageFile: File | null; 
  }>();
  imageFile: File | null = null;
  audioFile: File | null = null;
  modalTitle: string = 'Create New Track';

  trackForm: FormGroup;
  categories = Object.values(MusicCategory);

  constructor(private fb: FormBuilder, private trackService: TrackService) {
    this.trackForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      artist: ['', [Validators.required]],
      description: ['', [Validators.maxLength(400)]],
      category: [null, [Validators.required]],
      duration: [0], 
    });
  }
  
  // Close modal
  closeModal() {
    this.modalClose.emit();
    this.resetForm();
  }


  ngOnChanges() {
    if (this.track && this.mode === 'update') {
      this.modalTitle = 'Update Track';
      this.trackForm.patchValue({
        title: this.track.title,
        artist: this.track.artist,
        description: this.track.description,
        category: this.track.category
      });
    } else {
      this.modalTitle = 'Create New Track';
      if (this.isVisible) {
        this.resetForm();
      }
    }
  }

  onImageChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && file.type.startsWith('image/')) {
      this.imageFile = file;
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.audioFile = file;
  
      if (input.accept?.includes('image')) {
        this.imageFile = file;
      } else {
        const audio = new Audio();
        audio.src = URL.createObjectURL(file);
  
        audio.addEventListener('loadedmetadata', () => {
          const durationInSeconds = Math.round(audio.duration);
          const minutes = Math.floor(durationInSeconds / 60);
          const seconds = durationInSeconds % 60;
          const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
          console.log('Duration loaded:', formattedDuration);
          this.trackForm.patchValue({ duration: formattedDuration });
          URL.revokeObjectURL(audio.src);
        });
      }
    }
  }
  
  
  
  onSubmit() {
    if (this.trackForm.valid && (this.mode === 'update' || this.audioFile)) {
      const formValue = this.trackForm.value;
      const track: Track = {
        id: this.track?.id || '',
        title: formValue.title,
        artist: formValue.artist,
        description: formValue.description || '',
        category: formValue.category,
        duration: formValue.duration || 0,
        addedAt: new Date(),
        fileUrl: this.audioFile?.name || this.track?.fileUrl || '',
        imageUrl: this.imageFile?.name || this.track?.imageUrl
      };

      this.submit.emit({
        track,
        audioFile: this.audioFile,
        imageFile: this.imageFile
      });
      
      this.resetForm();
      this.closeModal();
    }
  }

  resetForm() {
    this.trackForm.reset();
    this.audioFile = null;
    this.imageFile = null;
  }
}
  
