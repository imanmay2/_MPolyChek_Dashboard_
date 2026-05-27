import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, delay, of, tap } from 'rxjs';

import { STORAGE_KEYS } from '../constants/storage.constants';
import { AuthSession, LoginPayload, UserRole } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) {}

  login(payload: LoginPayload, delayMs = 850): Observable<AuthSession> {
    const session: AuthSession = {
      userId: payload.userId,
      role: payload.role,
      token: `mock-token-${payload.role}-${Date.now()}`,
      loginAt: new Date().toISOString()
    };

    return of(session).pipe(
      delay(delayMs),
      tap((currentSession) => this.persistSession(currentSession))
    );
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(STORAGE_KEYS.session);
      localStorage.removeItem(STORAGE_KEYS.legacyUser);
    }

    void this.router.navigate(['/']);
  }

  getSession(): AuthSession | null {
    if (!this.isBrowser()) {
      return null;
    }

    const storedSession = localStorage.getItem(STORAGE_KEYS.session);
    const legacyUser = localStorage.getItem(STORAGE_KEYS.legacyUser);

    if (storedSession) {
      return JSON.parse(storedSession) as AuthSession;
    }

    if (legacyUser) {
      const parsedLegacyUser = JSON.parse(legacyUser) as LoginPayload;

      return {
        userId: parsedLegacyUser.userId,
        role: parsedLegacyUser.role,
        token: 'legacy-session',
        loginAt: new Date().toISOString()
      };
    }

    return null;
  }

  isAuthenticated(): boolean {
    return Boolean(this.getSession());
  }

  hasRole(role: UserRole): boolean {
    return this.getSession()?.role === role;
  }

  private persistSession(session: AuthSession): void {
    if (!this.isBrowser()) {
      return;
    }

    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
    localStorage.setItem(STORAGE_KEYS.legacyUser, JSON.stringify(session));
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
