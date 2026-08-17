import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },

  {
    path: 'auth',
    children: [
      {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () => import('./pages/auth/login/login').then((m) => m.LoginComponent),
      },

      {
        path: 'register',
        canActivate: [guestGuard],
        loadComponent: () =>
          import('./pages/auth/register/register').then((m) => m.RegisterComponent),
      },
    ],
  },

  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard').then((m) => m.DashboardComponent),
      },

      {
        path: 'exams',
        loadComponent: () => import('./pages/exams/exams').then((m) => m.ExamsComponent),
      },

      {
        path: 'exam-details/:id',
        loadComponent: () =>
          import('./pages/exam-details/exam-details').then((m) => m.ExamDetailsComponent),
      },

      {
        path: 'question/:id',
        loadComponent: () => import('./pages/question/question').then((m) => m.QuestionComponent),
      },

      {
        path: 'result',
        loadComponent: () => import('./pages/result/result').then((m) => m.ResultsComponent),
      },

      {
        path: 'result/:id',
        loadComponent: () =>
          import('./pages/result-details/result-details').then((m) => m.ResultDetails),
      },

      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile').then((m) => m.ProfileComponent),
      },

      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings').then((c) => c.SettingsComponent),
      },
    ],
  },

  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: {
      roles: ['admin'],
    },
    loadComponent: () => import('./pages/admin/admin').then((m) => m.AdminComponent),
  },

  {
    path: 'admin/questions/:id',
    canActivate: [authGuard, roleGuard],
    data: {
      roles: ['admin'],
    },
    loadComponent: () =>
      import('./pages/admin/questions/questions').then((m) => m.AdminQuestionsComponent),
  },

  {
    path: 'admin/exams',
    canActivate: [authGuard, roleGuard],
    data: {
      roles: ['admin'],
    },
    loadComponent: () => import('./pages/admin/exams/exams').then((m) => m.AdminExamsComponent),
  },

  {
    path: 'not-found',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },

  {
    path: '**',
    redirectTo: 'not-found',
  },
];
