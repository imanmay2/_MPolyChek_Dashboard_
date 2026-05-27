import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.html',
  styleUrl: './modal.scss'
})
export class Modal {
  @Input({ required: true }) title = '';
  @Input() subtitle = '';
  @Input() isOpen = false;

  @Output() closed = new EventEmitter<void>();

  close(): void {
    this.closed.emit();
  }
}
