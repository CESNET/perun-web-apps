import { Injectable } from '@angular/core';
// tslint:disable-next-line:nx-enforce-module-boundaries
import { AuthService } from './auth.service';
import { StoreService } from './store.service';
import { GuiAuthResolver } from './gui-auth-resolver.service';
import { AuthzResolverService } from '@perun-web-apps/perun/openapi';
import { MatDialog } from '@angular/material/dialog';
import { UserDontExistDialogComponent } from '../../../components/src/lib/user-dont-exist-dialog/user-dont-exist-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class InitAuthService {

  constructor(
    private authService: AuthService,
    private storeService: StoreService,
    private authResolver: GuiAuthResolver,
    private authzService: AuthzResolverService,
    private dialog: MatDialog
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
        if (perunPrincipal.user === null) {
          this.dialog.open(UserDontExistDialogComponent, {height: '80px'});
        } else {
          this.storeService.setPerunPrincipal(perunPrincipal);
          this.authResolver.init(perunPrincipal);
        }
      });
  }
}
