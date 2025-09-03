import { TranslateModule } from '@ngx-translate/core';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService, StoreService } from '@perun-web-apps/perun/services';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';

@Component({
  imports: [CommonModule, MatIconModule, UiAlertsModule, TranslateModule, MatButton],
  standalone: true,
  selector: 'perun-web-apps-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.scss'],
})
export class LoginScreenComponent implements OnInit {
  afterLogout: boolean;

  constructor(
    private auth: AuthService,
    private router: Router,
    private storeService: StoreService,
  ) {}

  ngOnInit(): void {
    if (this.auth.isLoggedIn() || sessionStorage.getItem('baPrincipal')) {
      void this.router.navigate([''], { queryParamsHandling: 'merge' });
    }
    // handle post logout
    if (this.auth.isLogoutProcess()) {
      this.afterLogout = true;
      this.auth.setLogoutProcess(false);
    }
  }
  startAuth(): void {
    this.auth.startAuthentication();
  }
}
