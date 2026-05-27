import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [AsyncPipe, CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.scss'
})
export class Toast {
  private readonly toastService = inject(ToastService);

  readonly messages$ = this.toastService.messages$;

  dismiss(id: number): void {
    this.toastService.dismiss(id);
  }
}
