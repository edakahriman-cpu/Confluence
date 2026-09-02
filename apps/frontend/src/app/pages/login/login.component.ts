import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, ApiError } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <main class="auth-layout">
      <section class="brand-panel"><div class="brand-mark">C</div><p class="eyebrow">CONFLUENCE APP</p><h1>Ideas move<br /><em>forward.</em></h1><p class="brand-copy">Bring your team's knowledge, decisions, and momentum into one clear space.</p><div class="orb orb-one"></div><div class="orb orb-two"></div></section>
      <section class="form-panel"><div class="form-wrap"><p class="mobile-brand">CONFLUENCE APP</p><p class="eyebrow">WELCOME BACK</p><h2>Sign in</h2><p class="subcopy">Enter your details to continue to your workspace.</p>
        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <label for="username">Username</label><input id="username" formControlName="username" autocomplete="username" placeholder="Your username" /><small class="field-error" *ngIf="form.controls.username.touched && form.controls.username.invalid">Username must be at least 3 characters.</small>
          <label for="password">Password</label><input id="password" type="password" formControlName="password" autocomplete="current-password" placeholder="Your password" /><small class="field-error" *ngIf="form.controls.password.touched && form.controls.password.invalid">Password must be at least 5 characters.</small>
          <a class="forgot-link" routerLink="/forgot-password">Forgot password?</a><p class="form-error" *ngIf="error">{{ error }}</p><button class="primary-button" type="submit" [disabled]="loading">{{ loading ? 'Signing in...' : 'Sign in' }} <span aria-hidden="true">-&gt;</span></button>
        </form><p class="switch-copy">New to Confluence? <a routerLink="/signup">Create an account</a></p>
      </div></section>
    </main>
  `,
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly form = inject(FormBuilder).nonNullable.group({ username: ['', [Validators.required, Validators.minLength(3)]], password: ['', [Validators.required, Validators.minLength(5)]] });
  loading = false;
  error = '';

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    this.auth.login(this.form.controls.username.value.trim(), this.form.controls.password.value).subscribe({ next: () => this.router.navigateByUrl('/home'), error: (err: ApiError) => { this.error = Array.isArray(err.message) ? err.message.join(' ') : err.message ?? 'Unable to sign in. Please try again.'; this.loading = false; } });
  }
}
