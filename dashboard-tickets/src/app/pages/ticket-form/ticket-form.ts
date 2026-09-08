import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket';
import { TicketPriority, TicketStatus } from '../../models/ticket';

@Component({
  selector: 'app-ticket-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <h2>{{ isEditMode ? 'Modifier le ticket' : 'Créer un nouveau ticket' }}</h2>

    <form [formGroup]="ticketForm" (ngSubmit)="onSubmit()" class="form-container">
      <div class="form-group">
        <label for="title">Titre *</label>
        <input id="title" type="text" formControlName="title" class="form-control" />
        @if (ticketForm.controls.title.touched && ticketForm.controls.title.invalid) {
          <span class="field-error">Le titre est requis (minimum 5 caractères).</span>
        }
      </div>

      <div class="form-group">
        <label for="description">Description *</label>
        <textarea id="description" formControlName="description" rows="5" class="form-control"></textarea>
        @if (ticketForm.controls.description.touched && ticketForm.controls.description.invalid) {
          <span class="field-error">La description est requise.</span>
        }
      </div>

      <div class="form-group">
        <label for="priority">Priorité *</label>
        <select id="priority" formControlName="priority" class="form-control">
          @for (priority of priorities; track priority) {
            <option [value]="priority">{{ priority }}</option>
          }
        </select>
      </div>

      <div class="form-group">
        <label for="status">Statut *</label>
        <select id="status" formControlName="status" class="form-control">
          @for (status of statuses; track status) {
            <option [value]="status">{{ status }}</option>
          }
        </select>
      </div>

      <div class="form-actions">
        <button type="submit" [disabled]="ticketForm.invalid" class="btn btn-primary">
          {{ isEditMode ? 'Enregistrer les modifications' : 'Créer le ticket' }}
        </button>
        <a routerLink="/tickets" class="btn btn-secondary">Annuler</a>
      </div>
    </form>
  `,
  styles: [`
    .form-container { display: flex; flex-direction: column; gap: 1rem; max-width: 600px; }
    .form-group { display: flex; flex-direction: column; gap: 0.25rem; }
    .form-control { padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; }
    .field-error { color: #dc3545; font-size: 0.85rem; }
    .form-actions { display: flex; gap: 0.5rem; margin-top: 1rem; }
    .btn { padding: 0.5rem 1rem; text-decoration: none; border-radius: 4px; border: none; cursor: pointer; }
    .btn-primary { background-color: #0066cc; color: white; }
    .btn-primary:disabled { background-color: #cccccc; cursor: not-allowed; }
    .btn-secondary { background-color: #6c757d; color: white; }
  `]
})
export class TicketFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly ticketService = inject(TicketService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly priorities: TicketPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  readonly statuses: TicketStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

  ticketId: string | null = null;
  isEditMode = false;

  readonly ticketForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required]],
    priority: ['MEDIUM' as TicketPriority, [Validators.required]],
    status: ['OPEN' as TicketStatus, [Validators.required]]
  });

  ngOnInit(): void {
    this.ticketId = this.route.snapshot.paramMap.get('id');
    if (this.ticketId) {
      this.isEditMode = true;
      this.ticketService.getById(this.ticketId).subscribe({
        next: (ticket) => {
          this.ticketForm.patchValue({
            title: ticket.title,
            description: ticket.description,
            priority: ticket.priority,
            status: ticket.status
          });
        },
        error: () => {
          alert('Impossible de charger les données du ticket.');
          this.router.navigate(['/tickets']);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      return;
    }

    const formValue = this.ticketForm.getRawValue();

    if (this.isEditMode && this.ticketId) {
      this.ticketService.update(this.ticketId, formValue).subscribe({
        next: () => this.router.navigate(['/tickets', this.ticketId]),
        error: () => alert('Erreur lors de la mise à jour.')
      });
    } else {
      this.ticketService.create(formValue).subscribe({
        next: () => this.router.navigate(['/tickets']),
        error: () => alert('Erreur lors de la création.')
      });
    }
  }
}