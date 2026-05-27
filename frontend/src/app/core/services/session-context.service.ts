import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { AuthService } from './auth.service';
import { AuthSession } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class SessionContextService {
  private readonly sessionSubject = new BehaviorSubject<AuthSession | null>(null);
  readonly session$ = this.sessionSubject.asObservable();

  constructor(private authService: AuthService) {}

  initialize(): void {
    this.sessionSubject.next(this.authService.getSession());
  }

  refresh(): void {
    this.initialize();
  }

  getSnapshot(): AuthSession | null {
    return this.sessionSubject.value ?? this.authService.getSession();
  }
}
