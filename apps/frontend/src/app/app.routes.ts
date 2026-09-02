import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'login' },
	{ path: 'login', component: LoginComponent },
	{ path: 'signup', component: SignupComponent },
	{ path: 'forgot-password', component: ForgotPasswordComponent },
	{ path: 'home', component: HomeComponent, canActivate: [authGuard] },
	{ path: '**', redirectTo: 'login' },
];
