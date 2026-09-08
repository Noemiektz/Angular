import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'tickets', pathMatch: 'full' },
  {
    path: 'tickets',
    loadComponent: () =>
      import('./pages/ticket-list/ticket-list.component').then((m) => m.TicketListComponent)
  },
  {
    path: 'tickets/stats',
    loadComponent: () =>
      import('./pages/ticket-stats/ticket-stats.component').then((m) => m.TicketStatsComponent)
  },
  {
    path: 'tickets/new',
    loadComponent: () =>
      import('./pages/ticket-form/ticket-form.component').then((m) => m.TicketFormComponent)
  },
  {
    path: 'tickets/:id',
    loadComponent: () =>
      import('./pages/ticket-detail/ticket-detail.component').then((m) => m.TicketDetailComponent)
  },
  {
    path: 'tickets/:id/edit',
    loadComponent: () =>
      import('./pages/ticket-form/ticket-form.component').then((m) => m.TicketFormComponent)
  },
  { path: '**', redirectTo: 'tickets' }
];