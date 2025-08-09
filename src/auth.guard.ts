import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }

  async canActivate(): Promise<boolean> {
    const isTokensValid = await firstValueFrom(this.auth.checkTokens());
    if (!isTokensValid) {
      await this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
