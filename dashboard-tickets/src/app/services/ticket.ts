import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket, CreateTicketDto, UpdateTicketDto, TicketStats } from '../models/ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://api.exemple.com/tickets'; // Remplacer par l'URL de l'API fournie

  getAll(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.apiUrl);
  }

  getById(id: string): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/${id}`);
  }

  create(ticket: CreateTicketDto): Observable<Ticket> {
    return this.http.post<Ticket>(this.apiUrl, ticket);
  }

  update(id: string, ticket: UpdateTicketDto): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.apiUrl}/${id}`, ticket);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getStats(): Observable<TicketStats> {
    return this.http.get<TicketStats>(`${this.apiUrl}/stats`);
  }
}