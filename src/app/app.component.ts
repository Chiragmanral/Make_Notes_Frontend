import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {
  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    const token = this.auth.getToken();
        if (token) {
          const decoded: any = jwtDecode(token);
          const expiryTime = decoded.exp * 1000;
          const timeout = expiryTime - Date.now();
      
          if (timeout > 0) {
            this.auth.autoLogout(timeout);
          } else {
            this.auth.logout();
          }
        }

        setInterval(() => {
          if (!this.auth.checkLogin()) {
            this.auth.logout();
          }
        }, 8000);
    
        window.addEventListener('storage', () => {
          if (!this.auth.checkLogin()) {
            this.auth.logout();
          }
        });
  }
}
