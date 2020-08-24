import { EventEmitter, Injectable, Injector } from '@angular/core';
import {User, UserManager, UserManagerSettings} from 'oidc-client';
import {from, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { Params, Router } from '@angular/router';
import { StoreService } from './store.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router: Router;

  constructor(
    private injector: Injector,
    private store: StoreService
  ) {
    setTimeout(() => {
      this.router = this.injector.get(Router);
    });
  }
  manager: UserManager;

  userSet: EventEmitter<User> = new EventEmitter<User>();

  user: User = null;
  loggedIn = false;

  redirectUrl: string;


  getUserManager(): UserManager {
    return this.manager;
  }

  getClientSettings(): UserManagerSettings {
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
      silent_redirect_uri: this.store.get('oidc_client', 'oauth_silent_redirect_uri')
    };
  }

  loadConfigData() {
    this.manager = new UserManager(this.getClientSettings());
    this.setUser();
    this.manager.events.addUserLoaded(user => {
      this.user = user;
    });
  }

  authenticate(): Promise<boolean> {
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
    return from(this.manager.getUser()).pipe(map<User, boolean>((user) => {
      return !!user && !user.expired;
    }));
  }

  isLoggedIn(): boolean {
    return this.user != null && !this.user.expired;
  }

  getClaims(): any {
    return this.user.profile;
  }

  getAuthorizationHeaderValue(): string {
    return !!this.user ? 'Bearer ' + this.user.access_token : '';
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
   * Check if the user is logged in and if not,
   * save current path and start authentication;
   *
   * @param path current url path
   * @param queryParams current url's query parameters
   */
  private verifyAuthentication(path: string, queryParams: string): Promise<any> {
    return this.isLoggedInPromise()
      .toPromise()
      .then(isLoggedIn => {
        if (!isLoggedIn) {
          sessionStorage.setItem('auth:redirect', path);
          sessionStorage.setItem('auth:queryParams', queryParams);
          console.log("STARTED AUTH");
          return this.startAuthentication()
            .then(() => false);
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
    const redirectUrl = sessionStorage.getItem('auth:redirect');
    const storageParams = sessionStorage.getItem('auth:queryParams');
    let params: string[] = [];
    if (!!storageParams) {
      params = storageParams.split('&');
    }
    const queryParams: Params = {};
    params.forEach(param => {
      const elements = param.split('=');
      queryParams[elements[0]] = elements[1];
    })
    if (!!redirectUrl) {
      sessionStorage.removeItem('auth:redirect');
      sessionStorage.removeItem('auth:queryParams');

      return this.router.navigate([redirectUrl], {queryParams: queryParams, replaceUrl: true});
    } else {
      sessionStorage.removeItem('auth:redirect');
      sessionStorage.removeItem('auth:queryParams');
      return this.router.navigate(['/'], {replaceUrl: true});
    }
  }
}
