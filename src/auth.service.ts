import { Injectable } from "@angular/core";

@Injectable({
    providedIn : "root"
})

export class AuthService {
    private isLoggedIn = false;

  login() {
    this.isLoggedIn = true;
    localStorage.setItem('loggedIn', 'true');
  }

  logout() {
    this.isLoggedIn = false;
    localStorage.removeItem('loggedIn');
  }

  checkLogin(): boolean {
    return this.isLoggedIn || localStorage.getItem('loggedIn') === 'true';
  }
}