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
  email : string = '';
  password : string = '';
  isSignupSuccessful : boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  signup() {
    if(!this.email || !this.password) return;
    this.http.post<{ success: boolean }>('https://make-notes-backend.onrender.com/signup', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        if (res.success) {
          alert("Signup successfull!!");
          this.router.navigate(['/login']);
          
          // this.isSignupSuccessful = true;
          // setTimeout(() => {
          //   this.router.navigate(['/login']);
          // }, 2000);
          
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
