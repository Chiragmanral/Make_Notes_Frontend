import { Injectable } from "@angular/core";

@Injectable({
    providedIn : "root"
})

export class AuthService {

  login() {
    localStorage.setItem('loggedIn', 'true');
  }

  logout() {
    localStorage.removeItem('loggedIn');
  }

  checkLogin(): boolean {
    return localStorage.getItem('loggedIn') === 'true';
  }
}