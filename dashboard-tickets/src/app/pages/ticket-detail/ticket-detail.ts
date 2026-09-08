import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket';
import { Ticket } from '../../models/ticket';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (isLoading) {
      <p>Chargement du ticket...</p>
    } @else if (errorMessage) {
      <p class="error">{{ errorMessage }}</p>
    } @else if (ticket) {
      <div class="ticket-card">
        <h2>{{ ticket.title }}</h2>
        <div class="meta">
          <p><strong>ID :</strong> {{ ticket.id }}</p>
          <p><strong>Statut :</strong> {{ ticket.status }}</p>
          <p><strong>Priorité :</strong> {{ ticket.priority }}</p>
          <p><strong>Créé le :</strong> {{ ticket.createdAt }}</p>
          <p><strong>Dernière mise à jour :</strong> {{ ticket.updatedAt }}</p>
        </div>
        <div class="description">
          <h3>Description</h3>
          <p>{{ ticket.description }}</p>
        </div>

        <div class="actions">
          <a [routerLink]="['/tickets', ticket.id, 'edit']" class="btn btn-primary">Modifier</a>
          <button (click)="onDelete()" class="btn btn-danger">Supprimer</button>
          <a routerLink="/tickets" class="btn btn-secondary">Retour à la liste</a>
        </div>
      </div>
    }
  `,
  styles: [`
    .ticket-card { border: 1px solid #ccc; padding: 1.5rem; border-radius: 8px; }
    .meta { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; background: #f8f9fa; padding: 1rem; border-radius: 4px; }
    .description { margin-top: 1rem; }
    .actions { margin-top: 1.5rem; display: flex; gap: 0.5rem; }
    .btn { padding: 0.5rem 1rem; text-decoration: none; border-radius: 4px; cursor: pointer; border: none; }
    .btn-primary { background-color: #0066cc; color: white; }
    .btn-secondary { background-color: #6c757d; color: white; }
    .btn-danger { background-color: #dc3545; color: white; }
    .error { color: #dc3545; }
  `]
})
export class TicketDetailComponent implements OnInit {
  private readonly ticketService = inject(TicketService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ticket: Ticket | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.ticketService.getById(id).subscribe({
        next: (data) => {
          this.ticket = data;
          this.isLoading = false;
        },
        error: () => {
          this.errorMessage = 'Ticket introuvable ou erreur réseau.';
          this.isLoading = false;
        }
      });
    }
  }

  onDelete(): void {
    if (this.ticket && confirm('Confirmer la suppression de ce ticket ?')) {
      this.ticketService.delete(this.ticket.id).subscribe({
        next: () => {
          this.router.navigate(['/tickets']);
        },
        error: () => {
          alert('Erreur lors de la suppression.');
        }
      });
    }
  }
}