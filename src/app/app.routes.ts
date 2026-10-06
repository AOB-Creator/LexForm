import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home').then(m => m.Home), title: 'LexForm' },
  { path: 'my', loadComponent: () => import('./features/my/my').then(m => m.My), title: 'LexForm' },
  { path: 't/:id', loadComponent: () => import('./features/editor/editor').then(m => m.Editor) },
  { path: '**', redirectTo: '' },
];
