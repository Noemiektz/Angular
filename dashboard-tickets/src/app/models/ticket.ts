export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
}

export type CreateTicketDto = Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTicketDto = Partial<CreateTicketDto>;

export interface TicketStats {
  total: number;
  openCount: number;
  inProgressCount: number;
  resolvedCount: number;
  closedCount: number;
}