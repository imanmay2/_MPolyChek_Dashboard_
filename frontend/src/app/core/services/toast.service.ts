import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: number;
  title: string;
  message: string;
  tone: 'success' | 'info' | 'warning' | 'danger';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly messagesSubject = new BehaviorSubject<ToastMessage[]>([]);
  readonly messages$ = this.messagesSubject.asObservable();

  show(title: string, message: string, tone: ToastMessage['tone'] = 'info'): void {
    const toast: ToastMessage = {
      id: Date.now(),
      title,
      message,
      tone
    };

    this.messagesSubject.next([toast, ...this.messagesSubject.value].slice(0, 3));

    window.setTimeout(() => this.dismiss(toast.id), 3200);
  }

  dismiss(id: number): void {
    this.messagesSubject.next(
      this.messagesSubject.value.filter((message) => message.id !== id)
    );
  }
}
