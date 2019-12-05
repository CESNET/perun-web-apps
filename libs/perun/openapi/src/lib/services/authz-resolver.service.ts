/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { PerunPrincipal } from '../models/perun-principal';


/**
 * AuthzResolver RPC API in Perun
 */
@Injectable({
  providedIn: 'root',
})
export class AuthzResolverService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getPerunPrincipal
   */
  static readonly GetPerunPrincipalPath = '/json/authzResolver/getPerunPrincipal';

  /**
   * Returns object representing the currently authenticated user.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getPerunPrincipal()` instead.
   *
   * This method doesn't expect any response body
   */
  getPerunPrincipal$Response(params?: {

  }): Observable<StrictHttpResponse<PerunPrincipal>> {

    const rb = new RequestBuilder(this.rootUrl, AuthzResolverService.GetPerunPrincipalPath, 'get');
    if (params) {


    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<PerunPrincipal>;
      })
    );
  }

  /**
   * Returns object representing the currently authenticated user.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getPerunPrincipal$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getPerunPrincipal(params?: {

  }): Observable<PerunPrincipal> {

    return this.getPerunPrincipal$Response(params).pipe(
      map((r: StrictHttpResponse<PerunPrincipal>) => r.body as PerunPrincipal)
    );
  }

}
