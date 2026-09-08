import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { TicketStats } from '../../models/ticket.model';

@Component({
  selector: 'app-ticket-stats',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h2>Statistiques des Tickets</h2>

    @if (isLoading) {
      <p>Chargement des statistiques...</p>
    } @else if (errorMessage) {
      <p class="error">{{ errorMessage }}</p>
    } @else if (stats) {
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total</h3>
          <p class="stat-value">{{ stats.total }}</p>
        </div>
        <div class="stat-card">
          <h3>Ouverts</h3>
          <p class="stat-value open">{{ stats.openCount }}</p>
        </div>
        <div class="stat-card">
          <h3>En cours</h3>
          <p class="stat-value progress">{{ stats.inProgressCount }}</p>
        </div>
        <div class="stat-card">
          <h3>Résolus</h3>
          <p class="stat-value resolved">{{ stats.resolvedCount }}</p>
        </div>
        <div class="stat-card">
          <h3>Fermés</h3>
          <p class="stat-value closed">{{ stats.closedCount }}</p>
        </div>
      </div>
    }

    <div class="actions">
      <a routerLink="/tickets" class="btn btn-secondary">Retour aux tickets</a>
    </div>
  `,
  styles: [`
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .stat-card { border: 1px solid #ddd; padding: 1rem; border-radius: 8px; text-align: center; background: #fafafa; }
    .stat-value { font-size: 2rem; font-weight: bold; margin: 0.5rem 0 0 0; }
    .actions { margin-top: 1rem; }
    .btn { padding: 0.5rem 1rem; text-decoration: none; border-radius: 4px; }
    .btn-secondary { background-color: #6c757d; color: white; }
    .error { color: #dc3545; }
  `]
})
export class TicketStatsComponent implements OnInit {
  private readonly ticketService = inject(TicketService);

  stats: TicketStats | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.ticketService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les statistiques.';
        this.isLoading = false;
      }
    });
  }
}