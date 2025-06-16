// signup.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports:[CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  email = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) {}

  signup() {
    this.http.post<{ success: boolean }>('https://your-backend.com/signup', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        if (res.success) {
          alert('Signup successful!');
          this.router.navigate(['/login']);
        } else {
          alert('Signup failed!');
        }
      },
      error: () => alert('Server error – check backend console.')
    });
  }

  login() {
    this.router.navigate(['/login']);
  }
}
