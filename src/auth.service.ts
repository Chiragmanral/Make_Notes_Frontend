import { Injectable } from "@angular/core";
import { jwtDecode } from 'jwt-decode';
import { Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, catchError } from "rxjs";

@Injectable({
  providedIn: "root"
})

export class AuthService {
  private logoutTimer: any;

  constructor(private router: Router, private http: HttpClient) { }

  login(token: string) {
    localStorage.setItem('token', token);

    const decoded: any = jwtDecode(token);
    const expiresAt = decoded.exp * 1000; // convert seconds → ms
    const timeout = expiresAt - Date.now();

    this.autoLogout(timeout);
  }

  logout() {
    localStorage.removeItem('token');
    clearTimeout(this.logoutTimer);
    window.location.href = '/login';
    // this.router.navigate(['/login']);
  }

  autoLogout(delay: number) {
    this.logoutTimer = setTimeout(() => {
      alert('Session expired. Please log in again.');
      this.logout();
    }, delay);
  }


  checkLogin(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      this.logout();
      return of(false);
    }

    return this.http.get<{ loggedIn: boolean }>("https://make-notes-backend.onrender.com/isLoggedIn", {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      map(res => {
        if (!res.loggedIn) this.logout();
        return res.loggedIn;
      }),
      catchError(() => {
        this.logout();
        return of(false);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

