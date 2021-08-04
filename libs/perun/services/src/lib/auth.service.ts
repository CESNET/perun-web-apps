import { EventEmitter, Injectable, Injector } from '@angular/core';
import {User, UserManager, UserManagerSettings} from 'oidc-client';
import {from, Observable} from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { StoreService } from './store.service';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { MatDialog } from '@angular/material/dialog';
import { SessionExpirationDialogComponent } from '@perun-web-apps/perun/session-expiration';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router: Router;

  constructor(
    private injector: Injector,
    private store: StoreService,
    private dialog: MatDialog,
    private route: ActivatedRoute

  ) {
    setTimeout(() => {
      this.router = this.injector.get(Router);

      this.startIdpFilterKeeper();
    });

    this.route.queryParams.subscribe(params => {
      if (params["idpFilter"]) {
        this.filterShortname = params["idpFilter"];
      }
    });
  }
  manager: UserManager;

  userSet: EventEmitter<User> = new EventEmitter<User>();

  user: User = null;
  loggedIn = false;
  filterShortname: string;

  redirectUrl: string;

  getClientSettings(): UserManagerSettings {
    const filterValue = this.setIdpFilter();
    return {
      authority: this.store.get('oidc_client', 'oauth_authority'),
      client_id: this.store.get('oidc_client', 'oauth_client_id'),
      redirect_uri: this.store.get('oidc_client', 'oauth_redirect_uri'),
      post_logout_redirect_uri: this.store.get('oidc_client', 'oauth_post_logout_redirect_uri'),
      response_type: this.store.get('oidc_client', 'oauth_response_type'),
      scope: this.store.get('oidc_client', 'oauth_scopes'),
      filterProtocolClaims: true,
      loadUserInfo: this.store.get('oidc_client', 'oauth_load_user_info'),
      automaticSilentRenew: true,
      silent_redirect_uri: this.store.get('oidc_client', 'oauth_silent_redirect_uri'),
      extraQueryParams: { 'acr_values': filterValue }
    };
  }

  setIdpFilter(): string {
    const queryParams = location.search.substr(1).split('&');
    this.filterShortname = null;
    const filters = this.store.get('oidc_client', 'filters');
    if (!filters) {
      return null;
    }
    let filterValue = null;
    queryParams.forEach(param => {
      const parsedParam = param.split('=')
      if(parsedParam[0] === 'idpFilter') {
        if (filters[parsedParam[1]]) {
          this.filterShortname = parsedParam[1];
          filterValue = filters[parsedParam[1]];
        }
      }
    })
    if(filters['default'] && !filterValue) {
      this.filterShortname = 'default';
      return filters['default'];
    }
    return filterValue;
  }

  getUserManager(): UserManager {
    return this.manager;
  }

  /**
   * Subscribes to route events and keeps the idpFilter query parameter.
   *
   * @private
   */
  private startIdpFilterKeeper(): void {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        const idpFilterParams: Params = { idpFilter: this.getIdpFilter() };
        this.router.navigate(
          [],
          {
            relativeTo: this.route,
            queryParams: idpFilterParams.idpFilter === 'default' ? {} : idpFilterParams,
            queryParamsHandling: 'merge',
            replaceUrl: true
          });
      });
  }

  loadConfigData() {
    this.manager = new UserManager(this.getClientSettings());
    this.setUser();
    this.manager.events.addUserLoaded(user => {
      this.user = user;
    });
    this.manager.events.addAccessTokenExpired(() => {
      const config = getDefaultDialogConfig();
      config.width = '450px';

      const dialogRef = this.dialog.open(SessionExpirationDialogComponent, config);

      dialogRef.afterClosed().subscribe(() => {
        this.startAuthentication().then(() => {});
      });
    });
  }

  verifyAuth(): Promise<boolean> {
    const currentPathname = location.pathname;
    const queryParams = location.search.substr(1);

    if (currentPathname === '/api-callback') {
      return this.handleAuthCallback()
        .then(() => this.redirectToOriginDestination())
    } else {
      return this.verifyAuthentication(currentPathname, queryParams);
    }
  }

  logout() {
    this.manager.signoutRedirect()
      .catch(function(error) {
        console.log(error);
      });
  }

  isLoggedInPromise(): Observable<boolean> {
    return from(this.manager.getUser()).pipe(map<User, boolean>((user) => !!user && !user.expired));
  }

  isLoggedIn(): boolean {
    return this.user != null && !this.user.expired;
  }

  getClaims(): any {
    return this.user.profile;
  }

  getAuthorizationHeaderValue(): string {
    return this.user ? 'Bearer ' + this.user.access_token : '';
  }

  startAuthentication(): Promise<void> {
    return this.manager.signinRedirect();
  }

  completeAuthentication(): Promise<void> {
    return this.manager.signinRedirectCallback().then(user => {
      this.user = user;
      this.userSet.emit(this.user);
    });
  }

  startSigninMainWindow() {
    this.manager.signinRedirect({ data: this.redirectUrl }).then(function () {
      console.log('signinRedirect done');
    }).catch(function (err) {
      console.log(err);
    });
  }

  setUser() {
    this.manager.getUser().then( user => {
      this.user = user;
    });
  }

  /**
   * This method serves as a simple check
   * that decides if the page user
   * is accessing is valid.
   *
   * @param path current url path
   * @return true if path is valid, false otherwise
   */
  private isPotentiallyValidPath(path: string): boolean {
    const validPaths = ['/home', '/organizations', '/facilities', '/myProfile', '/admin', '/login'];
    if (path === '/'){
      return true;
    }
    for (const validPath of validPaths){
      if (path.startsWith(validPath)) {
        return  true;
      }
    }

    return false;
  }

  /**
   * Check if the user is logged in and if not,
   * prevent proxy overload by checking path validity and only then
   * save current path and start authentication;
   *
   * On invalid path doesn't start authentication
   *
   * @param path current url path
   * @param queryParams current url's query parameters
   * @return true if user is logged in, false otherwise and an error
   *         if given path is invalid
   */
  private verifyAuthentication(path: string, queryParams: string): Promise<any> {
    return this.isLoggedInPromise()
      .toPromise()
      .then(isLoggedIn => {
        if (!isLoggedIn) {
          if (!this.isPotentiallyValidPath(path)) {
            return new Promise<boolean>((resolve, reject) => reject("Invalid path"));
          }

          sessionStorage.setItem('auth:redirect', path);
          sessionStorage.setItem('auth:queryParams', queryParams);

          return false;
        }
        return true;
      });
  }

  /**
   * This method is used to handle oauth callbacks.
   *
   * First, it finishes the authentication and then redirects user to the url
   * he wanted to visit.
   *
   */
  public handleAuthCallback(): Promise<boolean> {
    return this.completeAuthentication()
      .then(() => true);
  }

  public redirectToOriginDestination(): Promise<boolean> {
    const mfaRoute = sessionStorage.getItem('mfa_route');
    if (mfaRoute){
      return this.router.navigate([mfaRoute], {replaceUrl: true})
    }
    let redirectUrl = sessionStorage.getItem('auth:redirect');
    const storageParams = sessionStorage.getItem('auth:queryParams');
    let params: string[] = [];
    if (storageParams) {
      params = storageParams.split('&');
    }
    const queryParams: Params = {};
    params.forEach(param => {
      const elements = param.split('=');
      queryParams[elements[0]] = elements[1];
    })
    if (!redirectUrl || redirectUrl === '/login') {
      redirectUrl = '/';
    }
    sessionStorage.removeItem('auth:redirect');
    sessionStorage.removeItem('auth:queryParams');

    if (queryParams['idpFilter']) {
      this.filterShortname = queryParams['idpFilter'];
    }
    return this.router.navigate([redirectUrl], {queryParams: queryParams, replaceUrl: true});
  }

  public getIdpFilter(): string {
    return this.filterShortname;
  }
}
