import { Routes } from '@angular/router';

import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';
import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';

export const routes: Routes = [

  {
    path: '',
    loadComponent: () =>
      import('./features/auth/login/login')
        .then(m => m.Login)
  },

  {
    path: '',
    component: DashboardLayout,
    canActivate: [authGuard],

    children: [

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/home/home')
            .then(m => m.Home)
      },

      {
        path: 'admin',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/admin/admin-panel/admin-panel')
            .then(m => m.AdminPanel)
      }

    ]
  },

  {
    path: '**',
    redirectTo: 'dashboard'
  }

];
