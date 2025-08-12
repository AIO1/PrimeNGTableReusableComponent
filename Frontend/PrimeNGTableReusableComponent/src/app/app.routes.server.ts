import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // GENERAL
  { path: 'home', renderMode: RenderMode.Client },

  // FALLBACK
  { path: '', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Prerender }
];