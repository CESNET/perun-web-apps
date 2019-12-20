/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { VoAdminRoles } from '../models/vo-admin-roles';


/**
 * VosManager RPC API in Perun
 */
@Injectable({
  providedIn: 'root',
})
export class VosManagerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getMyVos
   */
  static readonly GetMyVosPath = '/json/vosManager/getVos';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getMyVos()` instead.
   *
   * This method doesn't expect any response body
   */
  getMyVos$Response(params?: {

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, VosManagerService.GetMyVosPath, 'get');
    if (params) {


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
   * To access the full response (for headers, for example), `getMyVos$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getMyVos(params?: {

  }): Observable<void> {

    return this.getMyVos$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getAllVos
   */
  static readonly GetAllVosPath = '/json/vosManager/getAllVos';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllVos()` instead.
   *
   * This method doesn't expect any response body
   */
  getAllVos$Response(params?: {

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, VosManagerService.GetAllVosPath, 'get');
    if (params) {


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
   * To access the full response (for headers, for example), `getAllVos$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getAllVos(params?: {

  }): Observable<void> {

    return this.getAllVos$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getVoByShortName
   */
  static readonly GetVoByShortNamePath = '/json/vosManager/getVoByShortName';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getVoByShortName()` instead.
   *
   * This method doesn't expect any response body
   */
  getVoByShortName$Response(params?: {

    /**
     * short name of Vo
     */
    shortName?: string;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, VosManagerService.GetVoByShortNamePath, 'get');
    if (params) {

      rb.query('shortName', params.shortName);

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
   * To access the full response (for headers, for example), `getVoByShortName$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getVoByShortName(params?: {

    /**
     * short name of Vo
     */
    shortName?: string;

  }): Observable<void> {

    return this.getVoByShortName$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getVoById
   */
  static readonly GetVoByIdPath = '/json/vosManager/getVoById';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getVoById()` instead.
   *
   * This method doesn't expect any response body
   */
  getVoById$Response(params: {

    /**
     * numeric id
     */
    id: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, VosManagerService.GetVoByIdPath, 'get');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getVoById$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getVoById(params: {

    /**
     * numeric id
     */
    id: number;

  }): Observable<void> {

    return this.getVoById$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation addVoAdminUser
   */
  static readonly AddVoAdminUserPath = '/urlinjsonout/vosManager/addAdmin/user';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `addVoAdminUser()` instead.
   *
   * This method doesn't expect any response body
   */
  addVoAdminUser$Response(params: {

    /**
     * id of Vo
     */
    vo: number;

    /**
     * id of User
     */
    user: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, VosManagerService.AddVoAdminUserPath, 'post');
    if (params) {

      rb.query('vo', params.vo);
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
   * To access the full response (for headers, for example), `addVoAdminUser$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  addVoAdminUser(params: {

    /**
     * id of Vo
     */
    vo: number;

    /**
     * id of User
     */
    user: number;

  }): Observable<void> {

    return this.addVoAdminUser$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation addVoAdminGroup
   */
  static readonly AddVoAdminGroupPath = '/urlinjsonout/vosManager/addAdmin/group';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `addVoAdminGroup()` instead.
   *
   * This method doesn't expect any response body
   */
  addVoAdminGroup$Response(params: {

    /**
     * id of Vo
     */
    vo: number;

    /**
     * Group id
     */
    authorizedGroup: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, VosManagerService.AddVoAdminGroupPath, 'post');
    if (params) {

      rb.query('vo', params.vo);
      rb.query('authorizedGroup', params.authorizedGroup);

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
   * To access the full response (for headers, for example), `addVoAdminGroup$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  addVoAdminGroup(params: {

    /**
     * id of Vo
     */
    vo: number;

    /**
     * Group id
     */
    authorizedGroup: number;

  }): Observable<void> {

    return this.addVoAdminGroup$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation removeVoAdminUser
   */
  static readonly RemoveVoAdminUserPath = '/urlinjsonout/vosManager/removeAdmin/user';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `removeVoAdminUser()` instead.
   *
   * This method doesn't expect any response body
   */
  removeVoAdminUser$Response(params: {

    /**
     * id of Vo
     */
    vo: number;

    /**
     * id of User
     */
    user: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, VosManagerService.RemoveVoAdminUserPath, 'post');
    if (params) {

      rb.query('vo', params.vo);
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
   * To access the full response (for headers, for example), `removeVoAdminUser$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  removeVoAdminUser(params: {

    /**
     * id of Vo
     */
    vo: number;

    /**
     * id of User
     */
    user: number;

  }): Observable<void> {

    return this.removeVoAdminUser$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation removeVoAdminGroup
   */
  static readonly RemoveVoAdminGroupPath = '/urlinjsonout/vosManager/removeAdmin/group';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `removeVoAdminGroup()` instead.
   *
   * This method doesn't expect any response body
   */
  removeVoAdminGroup$Response(params: {

    /**
     * id of Vo
     */
    vo: number;

    /**
     * Group id
     */
    authorizedGroup: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, VosManagerService.RemoveVoAdminGroupPath, 'post');
    if (params) {

      rb.query('vo', params.vo);
      rb.query('authorizedGroup', params.authorizedGroup);

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
   * To access the full response (for headers, for example), `removeVoAdminGroup$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  removeVoAdminGroup(params: {

    /**
     * id of Vo
     */
    vo: number;

    /**
     * Group id
     */
    authorizedGroup: number;

  }): Observable<void> {

    return this.removeVoAdminGroup$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getVoAdminUsers
   */
  static readonly GetVoAdminUsersPath = '/json/vosManager/getAdmins';

  /**
   * Get list of all vo administrators for supported role and specific vo.
   * If onlyDirectAdmins is true, return only direct admins of the vo for supported role.
   * Supported roles: VOOBSERVER, TOPGROUPCREATOR, VOADMIN
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getVoAdminUsers()` instead.
   *
   * This method doesn't expect any response body
   */
  getVoAdminUsers$Response(params: {

    /**
     * id of Vo
     */
    vo: number;

    /**
     * supported role name
     */
    role: VoAdminRoles;

    /**
     * get only direct administrators (if false, get both direct and indirect)
     */
    onlyDirectAdmins: boolean;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, VosManagerService.GetVoAdminUsersPath, 'get');
    if (params) {

      rb.query('vo', params.vo);
      rb.query('role', params.role);
      rb.query('onlyDirectAdmins', params.onlyDirectAdmins);

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
   * Get list of all vo administrators for supported role and specific vo.
   * If onlyDirectAdmins is true, return only direct admins of the vo for supported role.
   * Supported roles: VOOBSERVER, TOPGROUPCREATOR, VOADMIN
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getVoAdminUsers$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getVoAdminUsers(params: {

    /**
     * id of Vo
     */
    vo: number;

    /**
     * supported role name
     */
    role: VoAdminRoles;

    /**
     * get only direct administrators (if false, get both direct and indirect)
     */
    onlyDirectAdmins: boolean;

  }): Observable<void> {

    return this.getVoAdminUsers$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getVoAdminGroups
   */
  static readonly GetVoAdminGroupsPath = '/json/vosManager/getAdminGroups';

  /**
   * Get list of administrator groups of the given VO.
   * Supported roles: VOOBSERVER, TOPGROUPCREATOR, VOADMIN
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getVoAdminGroups()` instead.
   *
   * This method doesn't expect any response body
   */
  getVoAdminGroups$Response(params: {

    /**
     * id of Vo
     */
    vo: number;

    /**
     * supported role name
     */
    role: VoAdminRoles;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, VosManagerService.GetVoAdminGroupsPath, 'get');
    if (params) {

      rb.query('vo', params.vo);
      rb.query('role', params.role);

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
   * Get list of administrator groups of the given VO.
   * Supported roles: VOOBSERVER, TOPGROUPCREATOR, VOADMIN
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getVoAdminGroups$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getVoAdminGroups(params: {

    /**
     * id of Vo
     */
    vo: number;

    /**
     * supported role name
     */
    role: VoAdminRoles;

  }): Observable<void> {

    return this.getVoAdminGroups$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}
