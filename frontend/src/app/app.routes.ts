import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/auth/login/login')
        .then(m => m.Login)
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/home/home')
        .then(m => m.Home)
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/admin-panel/admin-panel')
        .then(m => m.AdminPanel)
  }
];