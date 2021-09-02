import { Injectable } from '@angular/core';
// eslint-disable-next-line
import { AuthService } from './auth.service';
import { StoreService } from './store.service';
import { GuiAuthResolver } from './gui-auth-resolver.service';
import { AuthzResolverService } from '@perun-web-apps/perun/openapi';
import { MatDialog } from '@angular/material/dialog';
import { UserDontExistDialogComponent } from '@perun-web-apps/general';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class InitAuthService {
  constructor(
    private authService: AuthService,
    private storeService: StoreService,
    private authResolver: GuiAuthResolver,
    private authzService: AuthzResolverService,
    private dialog: MatDialog,
    private router: Router
  ) {}
  private loginScreenShown = false;
  private serviceAccess = false;
  private serviceAccessLoginScreen = false;


  setLoginScreen(shown): void {
    this.loginScreenShown = shown;
  }

  isLoginScreenShown() {
    return this.loginScreenShown;
  }

  isServiceAccess() {
    return this.serviceAccess;
  }

  isServiceAccessLoginScreenShown(){
    return this.serviceAccessLoginScreen;
  }


  /**
   * Load additional data. First it init authService with necessarily data, then
   * start authentication.
   */
  verifyAuth(): Promise<boolean> {
    if (sessionStorage.getItem("baPrincipal")) {
      this.serviceAccess = true;
      if (location.pathname === '/service-access') {
        return this.router.navigate([]).then(() => true);
      } else {
        return this.router.navigate([location.pathname]).then(() => true);
      }
    }

    this.authService.loadConfigData();

    if (this.storeService.skipOidc()) {
      return new Promise<boolean>((resolve) => resolve(true));
    } else {
      return this.authService.verifyAuth();
    }
  }

  startAuth(): Promise<void> {
    this.authService.startAuthentication();
    return new Promise<void>(() =>{});
  }

  /**
   * Load principal
   */
  loadPrincipal(): Promise<any> {
    return this.authzService
      .getPerunPrincipal()
      .toPromise()
      .then((perunPrincipal) => {
        if (perunPrincipal.user === null) {
          const config = getDefaultDialogConfig();
          this.dialog.open(UserDontExistDialogComponent, config);
        } else {
          this.storeService.setPerunPrincipal(perunPrincipal);
          this.authResolver.init(perunPrincipal);
        }
      });
  }

  /**
   * Handles the auth start. If the configuration property `auto_auth_redirect`
   * is set to true, a rediret to the oidc server will be made.
   * If the property is set to false, a redirect to local page /login will be
   * made.
   */
  handleAuthStart(): Promise<void> {
    if (location.pathname === '/service-access' || sessionStorage.getItem("baPrincipal")) {
      this.serviceAccess = true;
      this.serviceAccessLoginScreen = true;
      return new Promise<void>((resolve) => {resolve()});
    } else if (this.storeService.get('auto_auth_redirect')) {
      return (
        this.startAuth()
          // start a promise that will never resolve, so the app loading won't finish in case
          // of the auth redirect
          .then(
            () => new Promise<void>(() => {})
          )
      );
    } else {
      this.setLoginScreen(true);
      return (
        this.router
          .navigate(['login'])
          // forget the navigate result
          .then(() => null)
      );
    }
  }
}
