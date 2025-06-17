import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './Login/login.component';
import { SignupComponent } from './Signup/signup.component';
import { AuthGuard } from '../auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path : "login", component : LoginComponent},
  { path : "signup", component : SignupComponent},
  { path : "notes", component : HomeComponent, canActivate : [AuthGuard]}
];
