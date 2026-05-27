import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SEED_USERS } from '../constants/seed-data';
import { STORAGE_KEYS } from '../constants/storage.constants';
import { AppUser } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class MockApiService {
  private readonly latency = 700;

  getUsers(delayMs = this.latency): Observable<AppUser[]> {
    return this.respond(this.readUsers(), delayMs);
  }

  saveUsers(users: AppUser[], delayMs = this.latency): Observable<AppUser[]> {
    this.writeUsers(users);
    return this.respond(users, delayMs);
  }

  resetUsers(delayMs = this.latency): Observable<AppUser[]> {
    this.writeUsers(SEED_USERS);
    return this.respond(SEED_USERS, delayMs);
  }

  getDashboardData<T>(data: T, delayMs = 950): Observable<T> {
    return this.respond(data, delayMs);
  }

  private respond<T>(payload: T, latency = this.latency): Observable<T> {
    return new Observable<T>((subscriber) => {
      const timeoutId = globalThis.setTimeout(() => {
        subscriber.next(payload);
        subscriber.complete();
      }, latency);

      return () => globalThis.clearTimeout(timeoutId);
    });
  }

  private readUsers(): AppUser[] {
    if (!this.isBrowser()) {
      return SEED_USERS;
    }

    const storedUsers = localStorage.getItem(STORAGE_KEYS.users);

    if (!storedUsers) {
      this.writeUsers(SEED_USERS);
      return SEED_USERS;
    }

    return JSON.parse(storedUsers) as AppUser[];
  }

  private writeUsers(users: AppUser[]): void {
    if (!this.isBrowser()) {
      return;
    }

    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
