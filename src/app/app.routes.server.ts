import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'brandDetails/:id/:slug',
    renderMode: RenderMode.Client,
  },
  {
    path: 'details/:id/:slug',
    renderMode: RenderMode.Client,
  },
  {
    path: 'checkout/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
