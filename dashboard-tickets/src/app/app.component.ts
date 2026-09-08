import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <header class="app-header">
      <h1>Support client - Ticketing</h1>
    </header>
    <main class="container">
      <router-outlet />
    </main>
  `,
  styles: [`
    .app-header { background: #1a252f; color: white; padding: 1rem 2rem; }
    .container { padding: 2rem; max-width: 1200px; margin: 0 auto; }
  `]
})
export class AppComponent {}