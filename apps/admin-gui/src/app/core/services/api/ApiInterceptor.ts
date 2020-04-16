import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '@perun-web-apps/perun/services';
import { ApiRequestConfigurationService } from './api-request-configuration.service';
import { NotificatorService } from '../common/notificator.service';
import { RPCError } from '@perun-web-apps/perun/models';
import { StoreService } from '@perun-web-apps/perun/services';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private apiRequestConfiguration: ApiRequestConfigurationService,
    private notificator: NotificatorService,
    private store: StoreService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const apiUrl = this.store.get('api_url');
    // check if the request is trying to access localization file, if so
    // disable cache
    if (req.url.indexOf("i18n") !== -1) {
      req = req.clone({
        setHeaders: {
          'Cache-control': 'no-cache, must-revalidate'
        }
      })
    }
    if (apiUrl !== undefined && req.url.toString().indexOf(apiUrl) !== -1 && !this.authService.isLoggedIn()) {
      const err: RPCError = {
        message: "Your authentication has timed out.",
        errorId: null,
        name: "User not logged in.",
        type: "UserNotLoggedIn"
      };
      this.notificator.showRPCError(err);
      return throwError(err);
    }
    // Apply the headers
    req = req.clone({
      setHeaders: {
        'Authorization': this.authService.getAuthorizationHeaderValue()
      }
    });

    // Also handle errors globally
    return next.handle(req).pipe(
      tap(x => x, err => {
        // Handle this err
        const errRpc = this.formatErrors(err, req);
        if (errRpc === undefined) {
          return throwError(err);
        }
        if (this.apiRequestConfiguration.shouldHandleError()) {
          this.notificator.showRPCError(errRpc);
        } else {
          return throwError(errRpc);
        }
      })
    );
  }

  private formatErrors(error: any, req: HttpRequest<any>) {
    let rpcError;
    if (error.error.errorId) {
      rpcError = error.error;
    } else {
      rpcError = JSON.parse(error.error) as RPCError;
    }
    if (rpcError === undefined) {
      return undefined;
    }
    rpcError.call = req.url;
    rpcError.payload = req.body;
    return rpcError;
  }
}
