import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';

import { MockApiService } from '../core/services/mock-api.service';
import {
  AppUser,
  UserCreatePayload,
  UserRole,
  UserStatus,
  UserUpdatePayload
} from '../models/user.model';

export interface UserFilters {
  search: string;
  role: UserRole | 'all';
  status: UserStatus | 'all';
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private mockApi: MockApiService) {}

  getUsers(delayMs = 700): Observable<AppUser[]> {
    return this.mockApi.getUsers(delayMs);
  }

  getFilteredUsers(filters: UserFilters, delayMs = 700): Observable<AppUser[]> {
    return this.getUsers(delayMs).pipe(
      map((users) => this.applyFilters(users, filters))
    );
  }

  addUser(payload: UserCreatePayload, delayMs = 700): Observable<AppUser[]> {
    return this.getUsers(delayMs).pipe(
      switchMap((users) => {
        const newUser: AppUser = {
          ...payload,
          id: `USR-${Date.now().toString().slice(-4)}`,
          status: 'pending',
          lastLogin: 'Invite pending',
          createdAt: new Date().toISOString().slice(0, 10)
        };

        const nextUsers = [newUser, ...users];
        return this.mockApi.saveUsers(nextUsers, delayMs);
      })
    );
  }

  updateUser(id: string, payload: UserUpdatePayload, delayMs = 700): Observable<AppUser[]> {
    return this.getUsers(delayMs).pipe(
      switchMap((users) => {
        const nextUsers = users.map((user) =>
          user.id === id ? { ...user, ...payload } : user
        );

        return this.mockApi.saveUsers(nextUsers, delayMs);
      })
    );
  }

  deleteUser(id: string, delayMs = 700): Observable<AppUser[]> {
    return this.getUsers(delayMs).pipe(
      switchMap((users) => {
        const nextUsers = users.filter((user) => user.id !== id);
        return this.mockApi.saveUsers(nextUsers, delayMs);
      })
    );
  }

  private applyFilters(users: AppUser[], filters: UserFilters): AppUser[] {
    const normalizedSearch = filters.search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !normalizedSearch ||
        user.name.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch) ||
        user.department.toLowerCase().includes(normalizedSearch);

      const matchesRole = filters.role === 'all' || user.role === filters.role;
      const matchesStatus = filters.status === 'all' || user.status === filters.status;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }
}
