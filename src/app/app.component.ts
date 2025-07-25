import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {
  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    window.addEventListener('storage', async () => {
      const isLoggedIn = await firstValueFrom(this.auth.checkLogin());
      if (!isLoggedIn) {
        this.auth.logout();
      }
    });
  }
}
