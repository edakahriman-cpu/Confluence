import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiError, AuthService, ForgotPasswordResponse } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <main class="auth-layout"><section class="brand-panel"><div class="brand-mark">C</div><p class="eyebrow">CONFLUENCE APP</p><h1>Keep moving<br /><em>with ease.</em></h1><p class="brand-copy">We'll help you get back to the work that matters.</p><div class="orb orb-one"></div><div class="orb orb-two"></div></section>
      <section class="form-panel"><div class="form-wrap"><p class="mobile-brand">CONFLUENCE APP</p><p class="eyebrow">ACCOUNT ACCESS</p><h2>Reset password</h2><p class="subcopy">Enter your username and we'll prepare a secure reset token.</p><form *ngIf="!result" [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <label for="username">Username</label><input id="username" formControlName="username" autocomplete="username" placeholder="Your username" /><small class="field-error" *ngIf="form.controls.username.touched && form.controls.username.invalid">Username must be at least 3 characters.</small><p class="form-error" *ngIf="error">{{ error }}</p><button class="primary-button" type="submit" [disabled]="loading">{{ loading ? 'Preparing token...' : 'Continue' }} <span aria-hidden="true">-&gt;</span></button>
      </form><div class="success-box" *ngIf="result"><strong>{{ result.message }}</strong><p>Your reset token is ready. Keep it private and use it with the password reset flow.</p><code>{{ result.resetToken }}</code><button class="secondary-button" type="button" (click)="copyToken()">{{ copied ? 'Copied' : 'Copy token' }}</button></div><p class="switch-copy"><a routerLink="/login">&lt;- Back to sign in</a></p></div></section>
    </main>
  `,
})
export class ForgotPasswordComponent {
  private readonly auth = inject(AuthService);
  readonly form = inject(FormBuilder).nonNullable.group({ username: ['', [Validators.required, Validators.minLength(3)]] });
  loading = false;
  error = '';
  result: ForgotPasswordResponse | null = null;
  copied = false;

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    this.auth.forgotPassword(this.form.controls.username.value.trim()).subscribe({ next: (result) => { this.result = result; this.loading = false; }, error: (err: ApiError) => { this.error = Array.isArray(err.message) ? err.message.join(' ') : err.message ?? 'Unable to prepare a reset token.'; this.loading = false; } });
  }

  copyToken(): void {
    if (!this.result) return;
    navigator.clipboard?.writeText(this.result.resetToken);
    this.copied = true;
  }
}
