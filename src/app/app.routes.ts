import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home').then(m => m.Home) },
  { path: 'c/:id', loadComponent: () => import('./features/category/category').then(m => m.Category) },
  { path: 't/:id', loadComponent: () => import('./features/editor/editor').then(m => m.Editor) },
  { path: 'my', loadComponent: () => import('./features/my/my').then(m => m.My) },
  { path: '404', loadComponent: () => import('./features/not-found/not-found').then(m => m.NotFound) },
  { path: '**', loadComponent: () => import('./features/not-found/not-found').then(m => m.NotFound) },
];
