import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { PerunFooterComponent, PerunHeaderComponent } from '@perun-web-apps/perun/components';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { InitAuthService, StoreService } from '@perun-web-apps/perun/services';
import { LoginScreenBaseComponent } from '@perun-web-apps/perun/login';

@Component({
  imports: [
    CommonModule,
    PerunFooterComponent,
    PerunHeaderComponent,
    RouterModule,
    TranslateModule,
    LoginScreenBaseComponent,
  ],
  standalone: true,
  selector: 'perun-web-apps-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  contentBackgroundColor = this.store.getProperty('theme').content_bg_color;
  isLoginScreenShow = this.initAuth.isLoginScreenShown();

  constructor(
    private store: StoreService,
    private initAuth: InitAuthService,
  ) {}
}
