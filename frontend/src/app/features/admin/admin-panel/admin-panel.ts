import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ToastService } from '../../../core/services/toast.service';
import { AppUser, UserRole, UserStatus } from '../../../models/user.model';
import { UserFilters, UserService } from '../../../services/user.service';
import { Modal } from '../../../shared/modal/modal';

@Component({
  selector: 'app-admin-panel',
  imports: [CommonModule, FormsModule, Modal, ReactiveFormsModule],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.scss',
})
export class AdminPanel implements OnInit {
  users: AppUser[] = [];
  filteredUsers: AppUser[] = [];
  visibleUsers: AppUser[] = [];

  filters: UserFilters = {
    search: '',
    role: 'all',
    status: 'all'
  };

  readonly pageSize = 5;
  pageIndex = 0;
  totalPages = 1;
  isLoading = true;
  isSaving = false;
  isModalOpen = false;
  selectedUser: AppUser | null = null;

  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private userService: UserService
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      role: ['user' satisfies UserRole, Validators.required],
      status: ['pending' satisfies UserStatus, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;

    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.show('Unable to load users', 'Mock API returned an error.', 'danger');
      }
    });
  }

  applyFilters(): void {
    this.pageIndex = 0;
    this.filteredUsers = this.filterUsers(this.users);
    this.updatePagination();
  }

  openCreateModal(): void {
    this.selectedUser = null;
    this.userForm.reset({
      name: '',
      email: '',
      department: '',
      role: 'user',
      status: 'pending'
    });
    this.userForm.get('status')?.disable();
    this.isModalOpen = true;
  }

  openEditModal(user: AppUser): void {
    this.selectedUser = user;
    this.userForm.reset({
      name: user.name,
      email: user.email,
      department: user.department,
      role: user.role,
      status: user.status
    });
    this.userForm.get('status')?.enable();
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedUser = null;
    this.userForm.enable();
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const formValue = this.userForm.getRawValue() as {
      name: string;
      email: string;
      department: string;
      role: UserRole;
      status: UserStatus;
    };
    const isEditing = Boolean(this.selectedUser);

    const request$ = this.selectedUser
      ? this.userService.updateUser(this.selectedUser.id, formValue)
      : this.userService.addUser({
          name: formValue.name,
          email: formValue.email,
          department: formValue.department,
          role: formValue.role
        });

    request$.subscribe({
      next: (users) => {
        this.users = users;
        this.applyFilters();
        this.closeModal();
        this.isSaving = false;
        this.toastService.show(
          isEditing ? 'User updated' : 'Invite created',
          'User directory changes were persisted locally.',
          'success'
        );
      },
      error: () => {
        this.isSaving = false;
        this.toastService.show('Save failed', 'Please retry the user operation.', 'danger');
      }
    });
  }

  deleteUser(user: AppUser): void {
    this.userService.deleteUser(user.id).subscribe({
      next: (users) => {
        this.users = users;
        this.applyFilters();
        this.toastService.show('User deleted', `${user.name} was removed from the directory.`, 'warning');
      },
      error: () => {
        this.toastService.show('Delete failed', 'Please retry the delete operation.', 'danger');
      }
    });
  }

  nextPage(): void {
    if (this.pageIndex < this.totalPages - 1) {
      this.pageIndex += 1;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex -= 1;
      this.updatePagination();
    }
  }

  trackByUserId(index: number, user: AppUser): string {
    return user.id;
  }

  private filterUsers(users: AppUser[]): AppUser[] {
    const normalizedSearch = this.filters.search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !normalizedSearch ||
        user.name.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch) ||
        user.department.toLowerCase().includes(normalizedSearch);

      const matchesRole = this.filters.role === 'all' || user.role === this.filters.role;
      const matchesStatus = this.filters.status === 'all' || user.status === this.filters.status;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  private updatePagination(): void {
    this.totalPages = Math.max(Math.ceil(this.filteredUsers.length / this.pageSize), 1);
    const start = this.pageIndex * this.pageSize;
    this.visibleUsers = this.filteredUsers.slice(start, start + this.pageSize);
  }
}
