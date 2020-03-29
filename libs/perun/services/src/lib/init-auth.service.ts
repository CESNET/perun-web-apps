import { Injectable } from '@angular/core';
// tslint:disable-next-line:nx-enforce-module-boundaries
import { AuthService } from './auth.service';
import { StoreService } from './store.service';
import { GuiAuthResolver } from './gui-auth-resolver.service';
import { AuthzResolverService } from '@perun-web-apps/perun/openapi';

@Injectable({
  providedIn: 'root'
})
export class InitAuthService {

  constructor(
    private authService: AuthService,
    private storeService: StoreService,
    private authResolver: GuiAuthResolver,
    private authzService: AuthzResolverService
  ) {
  }

  /**
   * Load additional data. First it init authService with necessarily data, then
   * start authentication.
   */
  authenticateUser(): Promise<boolean> {
    this.authService.loadConfigData();

    if (this.storeService.get('skip_oidc')) {
      return new Promise<boolean>(resolve => resolve(true));
    } else {
      return this.authService.authenticate();
    }
  }

  /**
   * Load principal
   */
  loadPrincipal(): Promise<any> {
    console.log('Started principal');
    return this.authzService.getPerunPrincipal()
      .toPromise()
      .then(perunPrincipal => {
        this.storeService.setPerunPrincipal(perunPrincipal);
        this.authResolver.init(perunPrincipal);
      });
  }
}
