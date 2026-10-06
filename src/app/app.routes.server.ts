import { RenderMode, ServerRoute } from '@angular/ssr';
import { TEMPLATES } from './templates';
import { CATEGORIES } from './templates/shared';

/** Every public page is prerendered to static HTML at build time. */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'c/:id', renderMode: RenderMode.Prerender, getPrerenderParams: async () => CATEGORIES.map(c => ({ id: c.id })) },
  { path: 't/:id', renderMode: RenderMode.Prerender, getPrerenderParams: async () => TEMPLATES.map(t => ({ id: t.id })) },
  { path: 'my', renderMode: RenderMode.Prerender },
  { path: '404', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Client },
];
