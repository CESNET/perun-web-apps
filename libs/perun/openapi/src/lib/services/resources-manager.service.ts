/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { Resource } from '../models/resource';
import { ResourceTag } from '../models/resource-tag';


/**
 * ResourcesManager RPC API in Perun
 */
@Injectable({
  providedIn: 'root',
})
export class ResourcesManagerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getResourceById
   */
  static readonly GetResourceByIdPath = '/json/resourcesManager/getResourceById';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getResourceById()` instead.
   *
   * This method doesn't expect any response body
   */
  getResourceById$Response(params: {

    /**
     * numeric id
     */
    id: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ResourcesManagerService.GetResourceByIdPath, 'get');
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
   * To access the full response (for headers, for example), `getResourceById$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getResourceById(params: {

    /**
     * numeric id
     */
    id: number;

  }): Observable<void> {

    return this.getResourceById$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getResourceByName
   */
  static readonly GetResourceByNamePath = '/json/resourcesManager/getResourceByName';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getResourceByName()` instead.
   *
   * This method doesn't expect any response body
   */
  getResourceByName$Response(params: {

    /**
     * id of Vo
     */
    vo: number;

    /**
     * id of Facility
     */
    facility: number;

    /**
     * resource name
     */
    name: string;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ResourcesManagerService.GetResourceByNamePath, 'get');
    if (params) {

      rb.query('vo', params.vo);
      rb.query('facility', params.facility);
      rb.query('name', params.name);

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
   * To access the full response (for headers, for example), `getResourceByName$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getResourceByName(params: {

    /**
     * id of Vo
     */
    vo: number;

    /**
     * id of Facility
     */
    facility: number;

    /**
     * resource name
     */
    name: string;

  }): Observable<void> {

    return this.getResourceByName$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getRichResourceById
   */
  static readonly GetRichResourceByIdPath = '/json/resourcesManager/getRichResourceById';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getRichResourceById()` instead.
   *
   * This method doesn't expect any response body
   */
  getRichResourceById$Response(params: {

    /**
     * numeric id
     */
    id: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ResourcesManagerService.GetRichResourceByIdPath, 'get');
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
   * To access the full response (for headers, for example), `getRichResourceById$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getRichResourceById(params: {

    /**
     * numeric id
     */
    id: number;

  }): Observable<void> {

    return this.getRichResourceById$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation createResource
   */
  static readonly CreateResourcePath = '/urlinjsonout/resourcesManager/createResource';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createResource()` instead.
   *
   * This method doesn't expect any response body
   */
  createResource$Response(params: {

    /**
     * id of Vo
     */
    vo: number;

    /**
     * id of Facility
     */
    facility: number;

    /**
     * resource name
     */
    name: string;

    /**
     * optional resource description
     */
    description?: string;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ResourcesManagerService.CreateResourcePath, 'post');
    if (params) {

      rb.query('vo', params.vo);
      rb.query('facility', params.facility);
      rb.query('name', params.name);
      rb.query('description', params.description);

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
   * To access the full response (for headers, for example), `createResource$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  createResource(params: {

    /**
     * id of Vo
     */
    vo: number;

    /**
     * id of Facility
     */
    facility: number;

    /**
     * resource name
     */
    name: string;

    /**
     * optional resource description
     */
    description?: string;

  }): Observable<void> {

    return this.createResource$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation updateResource
   */
  static readonly UpdateResourcePath = '/json/resourcesManager/updateResource';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateResource()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  updateResource$Response(params: {

    body: { 'resource': Resource }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ResourcesManagerService.UpdateResourcePath, 'post');
    if (params) {


      rb.body(params.body, 'application/json');
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
   * To access the full response (for headers, for example), `updateResource$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  updateResource(params: {

    body: { 'resource': Resource }
  }): Observable<void> {

    return this.updateResource$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation deleteResource
   */
  static readonly DeleteResourcePath = '/urlinjsonout/resourcesManager/deleteResource';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteResource()` instead.
   *
   * This method doesn't expect any response body
   */
  deleteResource$Response(params: {

    /**
     * id of Resource
     */
    resource: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ResourcesManagerService.DeleteResourcePath, 'post');
    if (params) {

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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `deleteResource$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  deleteResource(params: {

    /**
     * id of Resource
     */
    resource: number;

  }): Observable<void> {

    return this.deleteResource$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation assignGroupToResource
   */
  static readonly AssignGroupToResourcePath = '/urlinjsonout/resourcesManager/assignGroupToResource';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `assignGroupToResource()` instead.
   *
   * This method doesn't expect any response body
   */
  assignGroupToResource$Response(params: {

    /**
     * id of Group
     */
    group: number;

    /**
     * id of Resource
     */
    resource: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ResourcesManagerService.AssignGroupToResourcePath, 'post');
    if (params) {

      rb.query('group', params.group);
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `assignGroupToResource$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  assignGroupToResource(params: {

    /**
     * id of Group
     */
    group: number;

    /**
     * id of Resource
     */
    resource: number;

  }): Observable<void> {

    return this.assignGroupToResource$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation assignGroupsToResource
   */
  static readonly AssignGroupsToResourcePath = '/urlinjsonout/resourcesManager/assignGroupsToResource';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `assignGroupsToResource()` instead.
   *
   * This method doesn't expect any response body
   */
  assignGroupsToResource$Response(params: {

    /**
     * list of Group ids List&lt;Integer&gt;
     */
    groups: Array<number>;

    /**
     * id of Resource
     */
    resource: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ResourcesManagerService.AssignGroupsToResourcePath, 'post');
    if (params) {

      rb.query('groups[]', params.groups);
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `assignGroupsToResource$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  assignGroupsToResource(params: {

    /**
     * list of Group ids List&lt;Integer&gt;
     */
    groups: Array<number>;

    /**
     * id of Resource
     */
    resource: number;

  }): Observable<void> {

    return this.assignGroupsToResource$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation assignGroupToResources
   */
  static readonly AssignGroupToResourcesPath = '/urlinjsonout/resourcesManager/assignGroupToResources';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `assignGroupToResources()` instead.
   *
   * This method doesn't expect any response body
   */
  assignGroupToResources$Response(params: {

    /**
     * id of Group
     */
    group: number;

    /**
     * list of Resource ids List&lt;Integer&gt;
     */
    resources: Array<number>;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ResourcesManagerService.AssignGroupToResourcesPath, 'post');
    if (params) {

      rb.query('group', params.group);
      rb.query('resources[]', params.resources);

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
   * To access the full response (for headers, for example), `assignGroupToResources$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  assignGroupToResources(params: {

    /**
     * id of Group
     */
    group: number;

    /**
     * list of Resource ids List&lt;Integer&gt;
     */
    resources: Array<number>;

  }): Observable<void> {

    return this.assignGroupToResources$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation removeGroupFromResource
   */
  static readonly RemoveGroupFromResourcePath = '/urlinjsonout/resourcesManager/removeGroupFromResource';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `removeGroupFromResource()` instead.
   *
   * This method doesn't expect any response body
   */
  removeGroupFromResource$Response(params: {

    /**
     * id of Group
     */
    group: number;

    /**
     * id of Resource
     */
    resource: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ResourcesManagerService.RemoveGroupFromResourcePath, 'post');
    if (params) {

      rb.query('group', params.group);
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `removeGroupFromResource$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  removeGroupFromResource(params: {

    /**
     * id of Group
     */
    group: number;

    /**
     * id of Resource
     */
    resource: number;

  }): Observable<void> {

    return this.removeGroupFromResource$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation removeGroupsFromResource
   */
  static readonly RemoveGroupsFromResourcePath = '/urlinjsonout/resourcesManager/removeGroupsFromResource';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `removeGroupsFromResource()` instead.
   *
   * This method doesn't expect any response body
   */
  removeGroupsFromResource$Response(params: {

    /**
     * list of Group ids List&lt;Integer&gt;
     */
    groups: Array<number>;

    /**
     * id of Resource
     */
    resource: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ResourcesManagerService.RemoveGroupsFromResourcePath, 'post');
    if (params) {

      rb.query('groups[]', params.groups);
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `removeGroupsFromResource$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  removeGroupsFromResource(params: {

    /**
     * list of Group ids List&lt;Integer&gt;
     */
    groups: Array<number>;

    /**
     * id of Resource
     */
    resource: number;

  }): Observable<void> {

    return this.removeGroupsFromResource$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation removeGroupFromResources
   */
  static readonly RemoveGroupFromResourcesPath = '/urlinjsonout/resourcesManager/removeGroupFromResources';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `removeGroupFromResources()` instead.
   *
   * This method doesn't expect any response body
   */
  removeGroupFromResources$Response(params: {

    /**
     * id of Group
     */
    group: number;

    /**
     * list of Resource ids List&lt;Integer&gt;
     */
    resources: Array<number>;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ResourcesManagerService.RemoveGroupFromResourcesPath, 'post');
    if (params) {

      rb.query('group', params.group);
      rb.query('resources[]', params.resources);

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
   * To access the full response (for headers, for example), `removeGroupFromResources$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  removeGroupFromResources(params: {

    /**
     * id of Group
     */
    group: number;

    /**
     * list of Resource ids List&lt;Integer&gt;
     */
    resources: Array<number>;

  }): Observable<void> {

    return this.removeGroupFromResources$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getAssignedGroups
   */
  static readonly GetAssignedGroupsPath = '/json/resourcesManager/getAssignedGroups';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAssignedGroups()` instead.
   *
   * This method doesn't expect any response body
   */
  getAssignedGroups$Response(params: {

    /**
     * id of Resource
     */
    resource: number;

    /**
     * optional member id
     */
    member?: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ResourcesManagerService.GetAssignedGroupsPath, 'get');
    if (params) {

      rb.query('resource', params.resource);
      rb.query('member', params.member);

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
   * To access the full response (for headers, for example), `getAssignedGroups$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getAssignedGroups(params: {

    /**
     * id of Resource
     */
    resource: number;

    /**
     * optional member id
     */
    member?: number;

  }): Observable<void> {

    return this.getAssignedGroups$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getResourcesWhereUserIsAdmin
   */
  static readonly GetResourcesWhereUserIsAdminPath = '/json/resourcesManager/getResourcesWhereUserIsAdmin';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getResourcesWhereUserIsAdmin()` instead.
   *
   * This method doesn't expect any response body
   */
  getResourcesWhereUserIsAdmin$Response(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * id of Vo
     */
    vo: number;

    /**
     * id of User
     */
    user: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ResourcesManagerService.GetResourcesWhereUserIsAdminPath, 'get');
    if (params) {

      rb.query('facility', params.facility);
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
   * To access the full response (for headers, for example), `getResourcesWhereUserIsAdmin$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getResourcesWhereUserIsAdmin(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * id of Vo
     */
    vo: number;

    /**
     * id of User
     */
    user: number;

  }): Observable<void> {

    return this.getResourcesWhereUserIsAdmin$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getResourcesWhereGroupIsAdmin
   */
  static readonly GetResourcesWhereGroupIsAdminPath = '/json/resourcesManager/getResourcesWhereUserIsAdmin/group';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getResourcesWhereGroupIsAdmin()` instead.
   *
   * This method doesn't expect any response body
   */
  getResourcesWhereGroupIsAdmin$Response(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * id of Vo
     */
    vo: number;

    /**
     * id of Group
     */
    group: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ResourcesManagerService.GetResourcesWhereGroupIsAdminPath, 'get');
    if (params) {

      rb.query('facility', params.facility);
      rb.query('vo', params.vo);
      rb.query('group', params.group);

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
   * To access the full response (for headers, for example), `getResourcesWhereGroupIsAdmin$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getResourcesWhereGroupIsAdmin(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * id of Vo
     */
    vo: number;

    /**
     * id of Group
     */
    group: number;

  }): Observable<void> {

    return this.getResourcesWhereGroupIsAdmin$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getResourcesFromVoWhereUserIsAdmin
   */
  static readonly GetResourcesFromVoWhereUserIsAdminPath = '/json/resourcesManager/getResourcesWhereUserIsAdmin/fromVo';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getResourcesFromVoWhereUserIsAdmin()` instead.
   *
   * This method doesn't expect any response body
   */
  getResourcesFromVoWhereUserIsAdmin$Response(params: {

    /**
     * id of Vo
     */
    vo: number;

    /**
     * id of User
     */
    user: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ResourcesManagerService.GetResourcesFromVoWhereUserIsAdminPath, 'get');
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
   * To access the full response (for headers, for example), `getResourcesFromVoWhereUserIsAdmin$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getResourcesFromVoWhereUserIsAdmin(params: {

    /**
     * id of Vo
     */
    vo: number;

    /**
     * id of User
     */
    user: number;

  }): Observable<void> {

    return this.getResourcesFromVoWhereUserIsAdmin$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getAllResourcesWhereUserIsAdmin
   */
  static readonly GetAllResourcesWhereUserIsAdminPath = '/json/resourcesManager/getResourcesWhereUserIsAdmin/all';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllResourcesWhereUserIsAdmin()` instead.
   *
   * This method doesn't expect any response body
   */
  getAllResourcesWhereUserIsAdmin$Response(params: {

    /**
     * id of User
     */
    user: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ResourcesManagerService.GetAllResourcesWhereUserIsAdminPath, 'get');
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
   * To access the full response (for headers, for example), `getAllResourcesWhereUserIsAdmin$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getAllResourcesWhereUserIsAdmin(params: {

    /**
     * id of User
     */
    user: number;

  }): Observable<void> {

    return this.getAllResourcesWhereUserIsAdmin$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation assignService
   */
  static readonly AssignServicePath = '/urlinjsonout/resourcesManager/assignService';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `assignService()` instead.
   *
   * This method doesn't expect any response body
   */
  assignService$Response(params: {

    /**
     * id of Resource
     */
    resource: number;

    /**
     * id of Service
     */
    service: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ResourcesManagerService.AssignServicePath, 'post');
    if (params) {

      rb.query('resource', params.resource);
      rb.query('service', params.service);

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
   * To access the full response (for headers, for example), `assignService$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  assignService(params: {

    /**
     * id of Resource
     */
    resource: number;

    /**
     * id of Service
     */
    service: number;

  }): Observable<void> {

    return this.assignService$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation assignServicesPackage
   */
  static readonly AssignServicesPackagePath = '/urlinjsonout/resourcesManager/assignServicesPackage';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `assignServicesPackage()` instead.
   *
   * This method doesn't expect any response body
   */
  assignServicesPackage$Response(params: {

    /**
     * id of Resource
     */
    resource: number;

    /**
     * id of ServicesPackage
     */
    servicesPackage: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ResourcesManagerService.AssignServicesPackagePath, 'post');
    if (params) {

      rb.query('resource', params.resource);
      rb.query('servicesPackage', params.servicesPackage);

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
   * To access the full response (for headers, for example), `assignServicesPackage$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  assignServicesPackage(params: {

    /**
     * id of Resource
     */
    resource: number;

    /**
     * id of ServicesPackage
     */
    servicesPackage: number;

  }): Observable<void> {

    return this.assignServicesPackage$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation removeService
   */
  static readonly RemoveServicePath = '/urlinjsonout/resourcesManager/removeService';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `removeService()` instead.
   *
   * This method doesn't expect any response body
   */
  removeService$Response(params: {

    /**
     * id of Resource
     */
    resource: number;

    /**
     * id of Service
     */
    service: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ResourcesManagerService.RemoveServicePath, 'post');
    if (params) {

      rb.query('resource', params.resource);
      rb.query('service', params.service);

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
   * To access the full response (for headers, for example), `removeService$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  removeService(params: {

    /**
     * id of Resource
     */
    resource: number;

    /**
     * id of Service
     */
    service: number;

  }): Observable<void> {

    return this.removeService$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation removeServicesPackage
   */
  static readonly RemoveServicesPackagePath = '/urlinjsonout/resourcesManager/removeServicesPackage';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `removeServicesPackage()` instead.
   *
   * This method doesn't expect any response body
   */
  removeServicesPackage$Response(params: {

    /**
     * id of Resource
     */
    resource: number;

    /**
     * id of ServicesPackage
     */
    servicesPackage: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ResourcesManagerService.RemoveServicesPackagePath, 'post');
    if (params) {

      rb.query('resource', params.resource);
      rb.query('servicesPackage', params.servicesPackage);

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
   * To access the full response (for headers, for example), `removeServicesPackage$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  removeServicesPackage(params: {

    /**
     * id of Resource
     */
    resource: number;

    /**
     * id of ServicesPackage
     */
    servicesPackage: number;

  }): Observable<void> {

    return this.removeServicesPackage$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation assignResourceTagToResource
   */
  static readonly AssignResourceTagToResourcePath = '/json/resourcesManager/assignResourceTagToResource';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `assignResourceTagToResource()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  assignResourceTagToResource$Response(params: {

    body: { 'resource': number, 'resourceTag': ResourceTag }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ResourcesManagerService.AssignResourceTagToResourcePath, 'post');
    if (params) {


      rb.body(params.body, 'application/json');
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
   * To access the full response (for headers, for example), `assignResourceTagToResource$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  assignResourceTagToResource(params: {

    body: { 'resource': number, 'resourceTag': ResourceTag }
  }): Observable<void> {

    return this.assignResourceTagToResource$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation removeResourceTagFromResource
   */
  static readonly RemoveResourceTagFromResourcePath = '/json/resourcesManager/removeResourceTagFromResource';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `removeResourceTagFromResource()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  removeResourceTagFromResource$Response(params: {

    body: { 'resource': number, 'resourceTag': ResourceTag }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ResourcesManagerService.RemoveResourceTagFromResourcePath, 'post');
    if (params) {


      rb.body(params.body, 'application/json');
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
   * To access the full response (for headers, for example), `removeResourceTagFromResource$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  removeResourceTagFromResource(params: {

    body: { 'resource': number, 'resourceTag': ResourceTag }
  }): Observable<void> {

    return this.removeResourceTagFromResource$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation removeAllResourceTagsFromResource
   */
  static readonly RemoveAllResourceTagsFromResourcePath = '/urlinjsonout/resourcesManager/removeAllResourcesTagFromResource';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `removeAllResourceTagsFromResource()` instead.
   *
   * This method doesn't expect any response body
   */
  removeAllResourceTagsFromResource$Response(params: {

    /**
     * id of Resource
     */
    resource: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ResourcesManagerService.RemoveAllResourceTagsFromResourcePath, 'post');
    if (params) {

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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `removeAllResourceTagsFromResource$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  removeAllResourceTagsFromResource(params: {

    /**
     * id of Resource
     */
    resource: number;

  }): Observable<void> {

    return this.removeAllResourceTagsFromResource$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getAllResourcesByResourceTag
   */
  static readonly GetAllResourcesByResourceTagPath = '/json/resourcesManager/getAllResourcesByResourceTag';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllResourcesByResourceTag()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  getAllResourcesByResourceTag$Response(params: {

    body: { 'resource': number, 'resourceTag': ResourceTag }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ResourcesManagerService.GetAllResourcesByResourceTagPath, 'post');
    if (params) {


      rb.body(params.body, 'application/json');
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
   * To access the full response (for headers, for example), `getAllResourcesByResourceTag$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  getAllResourcesByResourceTag(params: {

    body: { 'resource': number, 'resourceTag': ResourceTag }
  }): Observable<void> {

    return this.getAllResourcesByResourceTag$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getAllResourcesTagsForVo
   */
  static readonly GetAllResourcesTagsForVoPath = '/json/resourcesManager/getAllResourcesTagsForVo';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllResourcesTagsForVo()` instead.
   *
   * This method doesn't expect any response body
   */
  getAllResourcesTagsForVo$Response(params: {

    /**
     * id of Vo
     */
    vo: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ResourcesManagerService.GetAllResourcesTagsForVoPath, 'get');
    if (params) {

      rb.query('vo', params.vo);

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
   * To access the full response (for headers, for example), `getAllResourcesTagsForVo$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getAllResourcesTagsForVo(params: {

    /**
     * id of Vo
     */
    vo: number;

  }): Observable<void> {

    return this.getAllResourcesTagsForVo$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getAllResourcesTagsForResource
   */
  static readonly GetAllResourcesTagsForResourcePath = '/json/resourcesManager/getAllResourcesTagsForResource';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllResourcesTagsForResource()` instead.
   *
   * This method doesn't expect any response body
   */
  getAllResourcesTagsForResource$Response(params: {

    /**
     * id of Resource
     */
    resource: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ResourcesManagerService.GetAllResourcesTagsForResourcePath, 'get');
    if (params) {

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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getAllResourcesTagsForResource$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getAllResourcesTagsForResource(params: {

    /**
     * id of Resource
     */
    resource: number;

  }): Observable<void> {

    return this.getAllResourcesTagsForResource$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}
