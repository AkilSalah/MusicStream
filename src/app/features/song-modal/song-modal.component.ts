import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-song-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './song-modal.component.html'
})
export class SongModalComponent {
  @Input() isVisible: boolean = false;
  @Output() modalClose: EventEmitter<void> = new EventEmitter<void>();
  @Output() submit = new EventEmitter<any>();

  songData = {
    name: '',
    price: '',
    category: '',
    description: ''
  };

  closeModal() {
    this.isVisible = false;
    this.modalClose.emit();
  }

  onSubmit() {
    this.submit.emit(this.songData);
    this.closeModal();
  }
}