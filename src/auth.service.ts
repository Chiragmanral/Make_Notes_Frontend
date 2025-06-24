import { Injectable } from "@angular/core";
import { jwtDecode } from 'jwt-decode';
import { Router } from "@angular/router";

@Injectable({
    providedIn : "root"
})

export class AuthService {
  private logoutTimer : any;

  constructor(private router: Router) {}

  login(token : string) {
    localStorage.setItem('token', token);
    const decoded: any = jwtDecode(token);
    const expiresAt = decoded.exp * 1000; // convert seconds → ms
    const timeout = expiresAt - Date.now();

    this.autoLogout(timeout);
  }

  logout() {
    localStorage.removeItem('token');
    // this.router.navigate(['/login']);
    clearTimeout(this.logoutTimer);
    window.location.href = '/login';
  }

  autoLogout(delay : number) {
    this.logoutTimer = setTimeout(() => {
      alert('Session expired. Please log in again.');
      this.logout();
    }, delay);
  }

  checkLogin(): boolean {
    const token = this.getToken();
    if(!token) return false;

    try {
      const decoded : any = jwtDecode(token);
      const expiry = decoded.exp;

      if(Math.floor(Date.now()/1000) > expiry) {
        // Token is already expired
        this.logout();
        return false;
      }
      return true;
    }
    catch(err) {
      // Invalid token format (user edited)
      this.logout();
      return false;
    }
  }

  getToken() : string | null {
    return localStorage.getItem('token');
  }
}

