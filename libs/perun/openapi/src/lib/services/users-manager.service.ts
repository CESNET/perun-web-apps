/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';



/**
 * UsersManager RPC API in Perun
 */
@Injectable({
  providedIn: 'root',
})
export class UsersManagerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getUserById
   */
  static readonly GetUserByIdPath = '/json/usersManager/getUserById';

  /**
   * Returns object representing the User
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getUserById()` instead.
   *
   * This method doesn't expect any response body
   */
  getUserById$Response(params: {

    /**
     * numeric id
     */
    id: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, UsersManagerService.GetUserByIdPath, 'get');
    if (params) {

      rb.query('id', params.id);

    }
    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Returns object representing the User
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getUserById$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getUserById(params: {

    /**
     * numeric id
     */
    id: number;

  }): Observable<void> {

    return this.getUserById$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getUserByExtSourceNameAndExtLogin
   */
  static readonly GetUserByExtSourceNameAndExtLoginPath = '/json/usersManager/getUserByExtSourceNameAndExtLogin';

  /**
   * Returns User found by its authentication data
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getUserByExtSourceNameAndExtLogin()` instead.
   *
   * This method doesn't expect any response body
   */
  getUserByExtSourceNameAndExtLogin$Response(params: {

    /**
     * external login of user, e.g. john
     */
    extLogin: string;

    /**
     * external source name, e.g. IdP entityId
     */
    extSourceName: string;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, UsersManagerService.GetUserByExtSourceNameAndExtLoginPath, 'get');
    if (params) {

      rb.query('extLogin', params.extLogin);
      rb.query('extSourceName', params.extSourceName);

    }
    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Returns User found by its authentication data
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getUserByExtSourceNameAndExtLogin$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getUserByExtSourceNameAndExtLogin(params: {

    /**
     * external login of user, e.g. john
     */
    extLogin: string;

    /**
     * external source name, e.g. IdP entityId
     */
    extSourceName: string;

  }): Observable<void> {

    return this.getUserByExtSourceNameAndExtLogin$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getRichUserWithAttributes
   */
  static readonly GetRichUserWithAttributesPath = '/json/usersManager/getRichUserWithAttributes';

  /**
   * Returns object representing the User with attributes
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getRichUserWithAttributes()` instead.
   *
   * This method doesn't expect any response body
   */
  getRichUserWithAttributes$Response(params: {

    /**
     * id of User
     */
    user: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, UsersManagerService.GetRichUserWithAttributesPath, 'get');
    if (params) {

      rb.query('user', params.user);

    }
    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Returns object representing the User with attributes
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getRichUserWithAttributes$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getRichUserWithAttributes(params: {

    /**
     * id of User
     */
    user: number;

  }): Observable<void> {

    return this.getRichUserWithAttributes$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getUserExtSources
   */
  static readonly GetUserExtSourcesPath = '/json/usersManager/getUserExtSources';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getUserExtSources()` instead.
   *
   * This method doesn't expect any response body
   */
  getUserExtSources$Response(params: {

    /**
     * id of User
     */
    user: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, UsersManagerService.GetUserExtSourcesPath, 'get');
    if (params) {

      rb.query('user', params.user);

    }
    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getUserExtSources$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getUserExtSources(params: {

    /**
     * id of User
     */
    user: number;

  }): Observable<void> {

    return this.getUserExtSources$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getGroupsForFacilityWhereUserIsActive
   */
  static readonly GetGroupsForFacilityWhereUserIsActivePath = '/json/usersManager/getGroupsWhereUserIsActive/facility';

  /**
   * That means User is a VALID in the VO and the Group and groups are assigned to the facility.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getGroupsForFacilityWhereUserIsActive()` instead.
   *
   * This method doesn't expect any response body
   */
  getGroupsForFacilityWhereUserIsActive$Response(params: {

    /**
     * id of User
     */
    user: number;

    /**
     * id of Facility
     */
    facility: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, UsersManagerService.GetGroupsForFacilityWhereUserIsActivePath, 'get');
    if (params) {

      rb.query('user', params.user);
      rb.query('facility', params.facility);

    }
    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * That means User is a VALID in the VO and the Group and groups are assigned to the facility.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getGroupsForFacilityWhereUserIsActive$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getGroupsForFacilityWhereUserIsActive(params: {

    /**
     * id of User
     */
    user: number;

    /**
     * id of Facility
     */
    facility: number;

  }): Observable<void> {

    return this.getGroupsForFacilityWhereUserIsActive$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getGroupsForResourceWhereUserIsActive
   */
  static readonly GetGroupsForResourceWhereUserIsActivePath = '/json/usersManager/getGroupsWhereUserIsActive/resource';

  /**
   * That means User is a VALID in the VO and the Group and groups are assigned to the resource.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getGroupsForResourceWhereUserIsActive()` instead.
   *
   * This method doesn't expect any response body
   */
  getGroupsForResourceWhereUserIsActive$Response(params: {

    /**
     * id of User
     */
    user: number;

    /**
     * id of Resource
     */
    resource: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, UsersManagerService.GetGroupsForResourceWhereUserIsActivePath, 'get');
    if (params) {

      rb.query('user', params.user);
      rb.query('resource', params.resource);

    }
    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * That means User is a VALID in the VO and the Group and groups are assigned to the resource.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getGroupsForResourceWhereUserIsActive$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getGroupsForResourceWhereUserIsActive(params: {

    /**
     * id of User
     */
    user: number;

    /**
     * id of Resource
     */
    resource: number;

  }): Observable<void> {

    return this.getGroupsForResourceWhereUserIsActive$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}
