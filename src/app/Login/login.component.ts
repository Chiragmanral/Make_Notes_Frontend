// login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private http: HttpClient, private router: Router, private auth: AuthService) {}

  login() {
    this.http.post<{ success: boolean }>('https://your-backend.com/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        if (res.success) {
          this.auth.login();
          this.router.navigate(['/notes']);
        } else {
          alert('Invalid credentials!');
        }
      },
      error: () => alert('Server error – check backend console.')
    });
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}
