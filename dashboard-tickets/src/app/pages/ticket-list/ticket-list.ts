import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket';
import { Ticket } from '../../models/ticket';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="header">
      <h2>Tableau de bord - Tickets Clients</h2>
      <div class="actions">
        <a routerLink="/tickets/stats" class="btn btn-secondary">Voir les Statistiques</a>
        <a routerLink="/tickets/new" class="btn btn-primary">+ Nouveau Ticket</a>
      </div>
    </div>

    <p *ngIf="isLoading" class="loading">Chargement des tickets en cours...</p>
    <p *ngIf="!isLoading && errorMessage" class="error">{{ errorMessage }}</p>

    <div *ngIf="!isLoading && !errorMessage">
      <p *ngIf="tickets.length === 0" class="empty">Aucun ticket trouvé.</p>

      <table *ngIf="tickets.length > 0" class="ticket-table">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Statut</th>
            <th>Priorité</th>
            <th>Créé le</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let ticket of tickets">
            <td>
              <strong>{{ ticket.title }}</strong>
            </td>
            <td>
              <span class="badge" [class]="'badge status-' + ticket.status.toLowerCase()">
                {{ ticket.status }}
              </span>
            </td>
            <td>
              <span class="badge" [class]="'badge priority-' + ticket.priority.toLowerCase()">
                {{ ticket.priority }}
              </span>
            </td>
            <td>{{ ticket.createdAt | date: 'dd/MM/yyyy HH:mm' }}</td>
            <td class="table-actions">
              <a [routerLink]="['/tickets', ticket.id]" class="btn-sm">Détail</a>
              <a [routerLink]="['/tickets', ticket.id, 'edit']" class="btn-sm">Modifier</a>
              <button (click)="onDelete(ticket.id)" class="btn-sm btn-danger">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .actions { display: flex; gap: 0.5rem; }
    .ticket-table { width: 100%; border-collapse: collapse; }
    .ticket-table th, .ticket-table td { padding: 0.75rem; border: 1px solid #ddd; text-align: left; }
    .badge { padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.85rem; font-weight: bold; }
    .btn { padding: 0.5rem 1rem; text-decoration: none; border-radius: 4px; border: none; cursor: pointer; }
    .btn-primary { background-color: #0066cc; color: white; }
    .btn-secondary { background-color: #6c757d; color: white; }
    .btn-sm { padding: 0.25rem 0.5rem; font-size: 0.85rem; margin-right: 0.25rem; }
    .btn-danger { background-color: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .error { color: #dc3545; }
  `]
})
export class TicketListComponent implements OnInit {
  private readonly ticketService = inject(TicketService);

  tickets: Ticket[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.isLoading = true;
    this.ticketService.getAll().subscribe({
      next: (data) => {
        this.tickets = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des tickets.';
        this.isLoading = false;
      }
    });
  }

  onDelete(id: string): void {
    if (confirm('Voulez-vous vraiment supprimer ce ticket ?')) {
      this.ticketService.delete(id).subscribe({
        next: () => {
          this.tickets = this.tickets.filter((t) => t.id !== id);
        },
        error: () => {
          alert('Impossible de supprimer le ticket.');
        }
      });
    }
  }
}