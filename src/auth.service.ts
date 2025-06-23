import { Injectable } from "@angular/core";

@Injectable({
    providedIn : "root"
})

export class AuthService {

  login(token : string) {
    localStorage.setItem('token', token);
  }

  logout() {
    localStorage.removeItem('token');
  }

  checkLogin(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken() : string | null {
    return localStorage.getItem('token');
  }
}