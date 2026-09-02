import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiError, AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <main class="auth-layout"><section class="brand-panel"><div class="brand-mark">C</div><p class="eyebrow">CONFLUENCE APP</p><h1>Make room<br /><em>for clarity.</em></h1><p class="brand-copy">A focused home for the conversations and knowledge that move your work ahead.</p><div class="orb orb-one"></div><div class="orb orb-two"></div></section>
      <section class="form-panel"><div class="form-wrap"><p class="mobile-brand">CONFLUENCE APP</p><p class="eyebrow">GET STARTED</p><h2>Create account</h2><p class="subcopy">Set up your workspace in a few simple steps.</p><form [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <label for="username">Username</label><input id="username" formControlName="username" autocomplete="username" placeholder="Choose a username" /><small class="field-error" *ngIf="form.controls.username.touched && form.controls.username.invalid">Username must be 3 to 30 characters.</small>
        <label for="email">Email <span>(optional)</span></label><input id="email" type="email" formControlName="email" autocomplete="email" placeholder="you@company.com" /><small class="field-error" *ngIf="form.controls.email.touched && form.controls.email.invalid">Enter a valid email address.</small>
        <label for="password">Password</label><input id="password" type="password" formControlName="password" autocomplete="new-password" placeholder="At least 5 characters" /><small class="field-error" *ngIf="form.controls.password.touched && form.controls.password.invalid">Password must be at least 5 characters.</small>
        <p class="form-error" *ngIf="error">{{ error }}</p><button class="primary-button" type="submit" [disabled]="loading">{{ loading ? 'Creating account...' : 'Create account' }} <span aria-hidden="true">-&gt;</span></button>
      </form><p class="switch-copy">Already have an account? <a routerLink="/login">Sign in</a></p></div></section>
    </main>
  `,
})
export class SignupComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly form = inject(FormBuilder).nonNullable.group({ username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]], email: ['', [Validators.email]], password: ['', [Validators.required, Validators.minLength(5)]] });
  loading = false;
  error = '';

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    const { username, email, password } = this.form.getRawValue();
    this.auth.register(username.trim(), email.trim(), password).subscribe({ next: () => this.router.navigateByUrl('/home'), error: (err: ApiError) => { this.error = Array.isArray(err.message) ? err.message.join(' ') : err.message ?? 'Unable to create your account.'; this.loading = false; } });
  }
}
