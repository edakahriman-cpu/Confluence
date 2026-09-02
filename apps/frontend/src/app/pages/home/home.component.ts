import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `<main class="home-page"><header><div class="brand-mark small">C</div><span class="eyebrow">CONFLUENCE APP</span><button class="text-button" type="button" (click)="logout()">Sign out</button></header><section class="home-content"><p class="eyebrow">YOUR WORKSPACE</p><h1>Welcome, {{ auth.currentUser()?.username }}.</h1><p>Your workspace is ready for the ideas that matter.</p></section></main>`,
})
export class HomeComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
