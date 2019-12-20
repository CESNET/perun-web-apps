/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { Facility } from '../models/facility';


/**
 * FacilitiesManager RPC API in Perun
 */
@Injectable({
  providedIn: 'root',
})
export class FacilitiesManagerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getFacilityById
   */
  static readonly GetFacilityByIdPath = '/json/facilitiesManager/getFacilityById';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getFacilityById()` instead.
   *
   * This method doesn't expect any response body
   */
  getFacilityById$Response(params: {

    /**
     * numeric id
     */
    id: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, FacilitiesManagerService.GetFacilityByIdPath, 'get');
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
   * To access the full response (for headers, for example), `getFacilityById$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getFacilityById(params: {

    /**
     * numeric id
     */
    id: number;

  }): Observable<void> {

    return this.getFacilityById$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getFacilityByName
   */
  static readonly GetFacilityByNamePath = '/json/facilitiesManager/getFacilityByName';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getFacilityByName()` instead.
   *
   * This method doesn't expect any response body
   */
  getFacilityByName$Response(params: {

    /**
     * name of Facility
     */
    name: string;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, FacilitiesManagerService.GetFacilityByNamePath, 'get');
    if (params) {

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
   * To access the full response (for headers, for example), `getFacilityByName$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getFacilityByName(params: {

    /**
     * name of Facility
     */
    name: string;

  }): Observable<void> {

    return this.getFacilityByName$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getAssignedUsers
   */
  static readonly GetAssignedUsersPath = '/json/facilitiesManager/getAssignedUsers';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAssignedUsers()` instead.
   *
   * This method doesn't expect any response body
   */
  getAssignedUsers$Response(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * id of Service
     */
    service?: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, FacilitiesManagerService.GetAssignedUsersPath, 'get');
    if (params) {

      rb.query('facility', params.facility);
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
   * To access the full response (for headers, for example), `getAssignedUsers$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getAssignedUsers(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * id of Service
     */
    service?: number;

  }): Observable<void> {

    return this.getAssignedUsers$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getRichFacilities
   */
  static readonly GetRichFacilitiesPath = '/json/facilitiesManager/getRichFacilities';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getRichFacilities()` instead.
   *
   * This method doesn't expect any response body
   */
  getRichFacilities$Response(params?: {

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, FacilitiesManagerService.GetRichFacilitiesPath, 'get');
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
   * To access the full response (for headers, for example), `getRichFacilities$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getRichFacilities(params?: {

  }): Observable<void> {

    return this.getRichFacilities$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getFacilitiesByDestination
   */
  static readonly GetFacilitiesByDestinationPath = '/json/facilitiesManager/getFacilitiesByDestination';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getFacilitiesByDestination()` instead.
   *
   * This method doesn't expect any response body
   */
  getFacilitiesByDestination$Response(params: {

    /**
     * string name of destination
     */
    destination: string;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, FacilitiesManagerService.GetFacilitiesByDestinationPath, 'get');
    if (params) {

      rb.query('destination', params.destination);

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
   * To access the full response (for headers, for example), `getFacilitiesByDestination$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getFacilitiesByDestination(params: {

    /**
     * string name of destination
     */
    destination: string;

  }): Observable<void> {

    return this.getFacilitiesByDestination$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getFacilitiesByAttribute
   */
  static readonly GetFacilitiesByAttributePath = '/json/facilitiesManager/getFacilitiesByAttribute';

  /**
   * Searching only def and opt attributes. Large attributes are not supported.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getFacilitiesByAttribute()` instead.
   *
   * This method doesn't expect any response body
   */
  getFacilitiesByAttribute$Response(params: {

    /**
     * full name of attribute definition (namespace + &#x27;:&#x27; + friendlyName)
     */
    attributeName: string;

    /**
     * string value of Attribute
     */
    attributeValue: string;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, FacilitiesManagerService.GetFacilitiesByAttributePath, 'get');
    if (params) {

      rb.query('attributeName', params.attributeName);
      rb.query('attributeValue', params.attributeValue);

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
   * Searching only def and opt attributes. Large attributes are not supported.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getFacilitiesByAttribute$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getFacilitiesByAttribute(params: {

    /**
     * full name of attribute definition (namespace + &#x27;:&#x27; + friendlyName)
     */
    attributeName: string;

    /**
     * string value of Attribute
     */
    attributeValue: string;

  }): Observable<void> {

    return this.getFacilitiesByAttribute$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getAllFacilities
   */
  static readonly GetAllFacilitiesPath = '/json/facilitiesManager/getFacilities';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllFacilities()` instead.
   *
   * This method doesn't expect any response body
   */
  getAllFacilities$Response(params?: {

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, FacilitiesManagerService.GetAllFacilitiesPath, 'get');
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
   * To access the full response (for headers, for example), `getAllFacilities$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getAllFacilities(params?: {

  }): Observable<void> {

    return this.getAllFacilities$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getFacilitiesCount
   */
  static readonly GetFacilitiesCountPath = '/json/facilitiesManager/getFacilitiesCount';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getFacilitiesCount()` instead.
   *
   * This method doesn't expect any response body
   */
  getFacilitiesCount$Response(params?: {

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, FacilitiesManagerService.GetFacilitiesCountPath, 'get');
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
   * To access the full response (for headers, for example), `getFacilitiesCount$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getFacilitiesCount(params?: {

  }): Observable<void> {

    return this.getFacilitiesCount$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getFacilityOwners
   */
  static readonly GetFacilityOwnersPath = '/json/facilitiesManager/getOwners';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getFacilityOwners()` instead.
   *
   * This method doesn't expect any response body
   */
  getFacilityOwners$Response(params: {

    /**
     * id of Facility
     */
    facility: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, FacilitiesManagerService.GetFacilityOwnersPath, 'get');
    if (params) {

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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getFacilityOwners$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getFacilityOwners(params: {

    /**
     * id of Facility
     */
    facility: number;

  }): Observable<void> {

    return this.getFacilityOwners$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation addFacilityOwner
   */
  static readonly AddFacilityOwnerPath = '/urlinjsonout/facilitiesManager/addOwner';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `addFacilityOwner()` instead.
   *
   * This method doesn't expect any response body
   */
  addFacilityOwner$Response(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * id of Owner
     */
    owner: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, FacilitiesManagerService.AddFacilityOwnerPath, 'post');
    if (params) {

      rb.query('facility', params.facility);
      rb.query('owner', params.owner);

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
   * To access the full response (for headers, for example), `addFacilityOwner$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  addFacilityOwner(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * id of Owner
     */
    owner: number;

  }): Observable<void> {

    return this.addFacilityOwner$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation removeFacilityOwner
   */
  static readonly RemoveFacilityOwnerPath = '/urlinjsonout/facilitiesManager/removeOwner';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `removeFacilityOwner()` instead.
   *
   * This method doesn't expect any response body
   */
  removeFacilityOwner$Response(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * id of Owner
     */
    owner: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, FacilitiesManagerService.RemoveFacilityOwnerPath, 'post');
    if (params) {

      rb.query('facility', params.facility);
      rb.query('owner', params.owner);

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
   * To access the full response (for headers, for example), `removeFacilityOwner$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  removeFacilityOwner(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * id of Owner
     */
    owner: number;

  }): Observable<void> {

    return this.removeFacilityOwner$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getAllowedVos
   */
  static readonly GetAllowedVosPath = '/urlinjsonout/facilitiesManager/getAllowedVos';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllowedVos()` instead.
   *
   * This method doesn't expect any response body
   */
  getAllowedVos$Response(params: {

    /**
     * id of Facility
     */
    facility: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, FacilitiesManagerService.GetAllowedVosPath, 'post');
    if (params) {

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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getAllowedVos$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getAllowedVos(params: {

    /**
     * id of Facility
     */
    facility: number;

  }): Observable<void> {

    return this.getAllowedVos$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getAllowedGroups
   */
  static readonly GetAllowedGroupsPath = '/json/facilitiesManager/getAllowedGroups';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllowedGroups()` instead.
   *
   * This method doesn't expect any response body
   */
  getAllowedGroups$Response(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * id of Vo
     */
    vo?: number;

    /**
     * id of Service
     */
    service?: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, FacilitiesManagerService.GetAllowedGroupsPath, 'get');
    if (params) {

      rb.query('facility', params.facility);
      rb.query('vo', params.vo);
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
   * To access the full response (for headers, for example), `getAllowedGroups$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getAllowedGroups(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * id of Vo
     */
    vo?: number;

    /**
     * id of Service
     */
    service?: number;

  }): Observable<void> {

    return this.getAllowedGroups$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getAllowedRichGroupsWithAttributes
   */
  static readonly GetAllowedRichGroupsWithAttributesPath = '/json/facilitiesManager/getAllowedRichGroupsWithAttributes';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllowedRichGroupsWithAttributes()` instead.
   *
   * This method doesn't expect any response body
   */
  getAllowedRichGroupsWithAttributes$Response(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * list of attribute names List&lt;String&gt;
     */
    attrNames: Array<string>;

    /**
     * id of Vo
     */
    vo?: number;

    /**
     * id of Service
     */
    service?: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, FacilitiesManagerService.GetAllowedRichGroupsWithAttributesPath, 'get');
    if (params) {

      rb.query('facility', params.facility);
      rb.query('attrNames[]', params.attrNames);
      rb.query('vo', params.vo);
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
   * To access the full response (for headers, for example), `getAllowedRichGroupsWithAttributes$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getAllowedRichGroupsWithAttributes(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * list of attribute names List&lt;String&gt;
     */
    attrNames: Array<string>;

    /**
     * id of Vo
     */
    vo?: number;

    /**
     * id of Service
     */
    service?: number;

  }): Observable<void> {

    return this.getAllowedRichGroupsWithAttributes$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getAssignedResourcesForFacility
   */
  static readonly GetAssignedResourcesForFacilityPath = '/json/facilitiesManager/getAssignedResources';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAssignedResourcesForFacility()` instead.
   *
   * This method doesn't expect any response body
   */
  getAssignedResourcesForFacility$Response(params: {

    /**
     * id of Facility
     */
    facility: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, FacilitiesManagerService.GetAssignedResourcesForFacilityPath, 'get');
    if (params) {

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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getAssignedResourcesForFacility$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getAssignedResourcesForFacility(params: {

    /**
     * id of Facility
     */
    facility: number;

  }): Observable<void> {

    return this.getAssignedResourcesForFacility$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getAssignedRichResourcesForFacility
   */
  static readonly GetAssignedRichResourcesForFacilityPath = '/json/facilitiesManager/getAssignedRichResources';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAssignedRichResourcesForFacility()` instead.
   *
   * This method doesn't expect any response body
   */
  getAssignedRichResourcesForFacility$Response(params: {

    /**
     * id of Facility
     */
    facility: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, FacilitiesManagerService.GetAssignedRichResourcesForFacilityPath, 'get');
    if (params) {

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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getAssignedRichResourcesForFacility$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getAssignedRichResourcesForFacility(params: {

    /**
     * id of Facility
     */
    facility: number;

  }): Observable<void> {

    return this.getAssignedRichResourcesForFacility$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation createFacility
   */
  static readonly CreateFacilityPath = '/urlinjsonout/facilitiesManager/createFacility';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createFacility()` instead.
   *
   * This method doesn't expect any response body
   */
  createFacility$Response(params: {

    /**
     * name of a facility - can contain only a-Z0-9.-_ and space characters
     */
    name: string;

    /**
     * optional description of a facility
     */
    description?: string;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, FacilitiesManagerService.CreateFacilityPath, 'post');
    if (params) {

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
   * To access the full response (for headers, for example), `createFacility$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  createFacility(params: {

    /**
     * name of a facility - can contain only a-Z0-9.-_ and space characters
     */
    name: string;

    /**
     * optional description of a facility
     */
    description?: string;

  }): Observable<void> {

    return this.createFacility$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation deleteFacility
   */
  static readonly DeleteFacilityPath = '/urlinjsonout/facilitiesManager/deleteFacility';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteFacility()` instead.
   *
   * This method doesn't expect any response body
   */
  deleteFacility$Response(params: {

    /**
     * id of Facility
     */
    facility: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, FacilitiesManagerService.DeleteFacilityPath, 'post');
    if (params) {

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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `deleteFacility$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  deleteFacility(params: {

    /**
     * id of Facility
     */
    facility: number;

  }): Observable<void> {

    return this.deleteFacility$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation updateFacility
   */
  static readonly UpdateFacilityPath = '/json/facilitiesManager/updateFacility';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateFacility()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  updateFacility$Response(params: {

    body: { 'facility': Facility }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, FacilitiesManagerService.UpdateFacilityPath, 'post');
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
   * To access the full response (for headers, for example), `updateFacility$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  updateFacility(params: {

    body: { 'facility': Facility }
  }): Observable<void> {

    return this.updateFacility$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getOwnerFacilities
   */
  static readonly GetOwnerFacilitiesPath = '/json/facilitiesManager/getOwnerFacilities';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getOwnerFacilities()` instead.
   *
   * This method doesn't expect any response body
   */
  getOwnerFacilities$Response(params: {

    /**
     * id of Owner
     */
    owner: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, FacilitiesManagerService.GetOwnerFacilitiesPath, 'get');
    if (params) {

      rb.query('owner', params.owner);

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
   * To access the full response (for headers, for example), `getOwnerFacilities$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getOwnerFacilities(params: {

    /**
     * id of Owner
     */
    owner: number;

  }): Observable<void> {

    return this.getOwnerFacilities$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getHosts
   */
  static readonly GetHostsPath = '/json/facilitiesManager/getHosts';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getHosts()` instead.
   *
   * This method doesn't expect any response body
   */
  getHosts$Response(params: {

    /**
     * id of Facility
     */
    facility: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, FacilitiesManagerService.GetHostsPath, 'get');
    if (params) {

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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getHosts$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getHosts(params: {

    /**
     * id of Facility
     */
    facility: number;

  }): Observable<void> {

    return this.getHosts$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getHostById
   */
  static readonly GetHostByIdPath = '/json/facilitiesManager/getHostById';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getHostById()` instead.
   *
   * This method doesn't expect any response body
   */
  getHostById$Response(params: {

    /**
     * numeric id
     */
    id: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, FacilitiesManagerService.GetHostByIdPath, 'get');
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
   * To access the full response (for headers, for example), `getHostById$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getHostById(params: {

    /**
     * numeric id
     */
    id: number;

  }): Observable<void> {

    return this.getHostById$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getHostsByHostname
   */
  static readonly GetHostsByHostnamePath = '/json/facilitiesManager/getHostsByHostname';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getHostsByHostname()` instead.
   *
   * This method doesn't expect any response body
   */
  getHostsByHostname$Response(params: {

    /**
     * name of a host
     */
    hostname: string;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, FacilitiesManagerService.GetHostsByHostnamePath, 'get');
    if (params) {

      rb.query('hostname', params.hostname);

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
   * To access the full response (for headers, for example), `getHostsByHostname$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getHostsByHostname(params: {

    /**
     * name of a host
     */
    hostname: string;

  }): Observable<void> {

    return this.getHostsByHostname$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getFacilityForHost
   */
  static readonly GetFacilityForHostPath = '/json/facilitiesManager/getFacilityForHost';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getFacilityForHost()` instead.
   *
   * This method doesn't expect any response body
   */
  getFacilityForHost$Response(params: {

    /**
     * id of Host
     */
    host: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, FacilitiesManagerService.GetFacilityForHostPath, 'get');
    if (params) {

      rb.query('host', params.host);

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
   * To access the full response (for headers, for example), `getFacilityForHost$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getFacilityForHost(params: {

    /**
     * id of Host
     */
    host: number;

  }): Observable<void> {

    return this.getFacilityForHost$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getHostsCount
   */
  static readonly GetHostsCountPath = '/json/facilitiesManager/getHostsCount';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getHostsCount()` instead.
   *
   * This method doesn't expect any response body
   */
  getHostsCount$Response(params: {

    /**
     * id of Facility
     */
    facility: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, FacilitiesManagerService.GetHostsCountPath, 'get');
    if (params) {

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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getHostsCount$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getHostsCount(params: {

    /**
     * id of Facility
     */
    facility: number;

  }): Observable<void> {

    return this.getHostsCount$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation addHosts
   */
  static readonly AddHostsPath = '/urlinjsonout/facilitiesManager/addHosts';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `addHosts()` instead.
   *
   * This method doesn't expect any response body
   */
  addHosts$Response(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * list of host names List&lt;String&gt;
     */
    hostnames: Array<string>;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, FacilitiesManagerService.AddHostsPath, 'post');
    if (params) {

      rb.query('facility', params.facility);
      rb.query('hostnames[]', params.hostnames);

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
   * To access the full response (for headers, for example), `addHosts$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  addHosts(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * list of host names List&lt;String&gt;
     */
    hostnames: Array<string>;

  }): Observable<void> {

    return this.addHosts$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation removeHosts
   */
  static readonly RemoveHostsPath = '/urlinjsonout/facilitiesManager/removeHosts';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `removeHosts()` instead.
   *
   * This method doesn't expect any response body
   */
  removeHosts$Response(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * list of host ids List&lt;Integer&gt;
     */
    hosts: Array<number>;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, FacilitiesManagerService.RemoveHostsPath, 'post');
    if (params) {

      rb.query('facility', params.facility);
      rb.query('hosts[]', params.hosts);

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
   * To access the full response (for headers, for example), `removeHosts$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  removeHosts(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * list of host ids List&lt;Integer&gt;
     */
    hosts: Array<number>;

  }): Observable<void> {

    return this.removeHosts$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation addHost
   */
  static readonly AddHostPath = '/urlinjsonout/facilitiesManager/addHost';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `addHost()` instead.
   *
   * This method doesn't expect any response body
   */
  addHost$Response(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * DNS name of host
     */
    hostname: string;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, FacilitiesManagerService.AddHostPath, 'post');
    if (params) {

      rb.query('facility', params.facility);
      rb.query('hostname', params.hostname);

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
   * To access the full response (for headers, for example), `addHost$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  addHost(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * DNS name of host
     */
    hostname: string;

  }): Observable<void> {

    return this.addHost$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation removeHost
   */
  static readonly RemoveHostPath = '/urlinjsonout/facilitiesManager/removeHost';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `removeHost()` instead.
   *
   * This method doesn't expect any response body
   */
  removeHost$Response(params: {

    /**
     * id of Host
     */
    host: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, FacilitiesManagerService.RemoveHostPath, 'post');
    if (params) {

      rb.query('host', params.host);

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
   * To access the full response (for headers, for example), `removeHost$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  removeHost(params: {

    /**
     * id of Host
     */
    host: number;

  }): Observable<void> {

    return this.removeHost$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation addFacilityAdminUser
   */
  static readonly AddFacilityAdminUserPath = '/urlinjsonout/facilitiesManager/addAdmin/user';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `addFacilityAdminUser()` instead.
   *
   * This method doesn't expect any response body
   */
  addFacilityAdminUser$Response(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * id of User
     */
    user: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, FacilitiesManagerService.AddFacilityAdminUserPath, 'post');
    if (params) {

      rb.query('facility', params.facility);
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
   * To access the full response (for headers, for example), `addFacilityAdminUser$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  addFacilityAdminUser(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * id of User
     */
    user: number;

  }): Observable<void> {

    return this.addFacilityAdminUser$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation addFacilityAdminGroup
   */
  static readonly AddFacilityAdminGroupPath = '/urlinjsonout/facilitiesManager/addAdmin/group';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `addFacilityAdminGroup()` instead.
   *
   * This method doesn't expect any response body
   */
  addFacilityAdminGroup$Response(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * Group id
     */
    authorizedGroup: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, FacilitiesManagerService.AddFacilityAdminGroupPath, 'post');
    if (params) {

      rb.query('facility', params.facility);
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
   * To access the full response (for headers, for example), `addFacilityAdminGroup$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  addFacilityAdminGroup(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * Group id
     */
    authorizedGroup: number;

  }): Observable<void> {

    return this.addFacilityAdminGroup$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation removeFacilityAdminUser
   */
  static readonly RemoveFacilityAdminUserPath = '/urlinjsonout/facilitiesManager/removeAdmin/user';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `removeFacilityAdminUser()` instead.
   *
   * This method doesn't expect any response body
   */
  removeFacilityAdminUser$Response(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * id of User
     */
    user: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, FacilitiesManagerService.RemoveFacilityAdminUserPath, 'post');
    if (params) {

      rb.query('facility', params.facility);
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
   * To access the full response (for headers, for example), `removeFacilityAdminUser$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  removeFacilityAdminUser(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * id of User
     */
    user: number;

  }): Observable<void> {

    return this.removeFacilityAdminUser$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation removeFacilityAdminGroup
   */
  static readonly RemoveFacilityAdminGroupPath = '/urlinjsonout/facilitiesManager/removeAdmin/group';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `removeFacilityAdminGroup()` instead.
   *
   * This method doesn't expect any response body
   */
  removeFacilityAdminGroup$Response(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * Group id
     */
    authorizedGroup: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, FacilitiesManagerService.RemoveFacilityAdminGroupPath, 'post');
    if (params) {

      rb.query('facility', params.facility);
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
   * To access the full response (for headers, for example), `removeFacilityAdminGroup$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  removeFacilityAdminGroup(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * Group id
     */
    authorizedGroup: number;

  }): Observable<void> {

    return this.removeFacilityAdminGroup$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getFacilityAdminUsers
   */
  static readonly GetFacilityAdminUsersPath = '/json/facilitiesManager/getAdmins';

  /**
   * Get list of all facility administrators for supported role and given facility.
   * If onlyDirectAdmins is true, return only direct admins of the group for supported role.
   * Supported roles: FacilityAdmin
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getFacilityAdminUsers()` instead.
   *
   * This method doesn't expect any response body
   */
  getFacilityAdminUsers$Response(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * if true, get only direct facility administrators (if false, get both direct and indirect)
     */
    onlyDirectAdmins: boolean;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, FacilitiesManagerService.GetFacilityAdminUsersPath, 'get');
    if (params) {

      rb.query('facility', params.facility);
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
   * Get list of all facility administrators for supported role and given facility.
   * If onlyDirectAdmins is true, return only direct admins of the group for supported role.
   * Supported roles: FacilityAdmin
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getFacilityAdminUsers$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getFacilityAdminUsers(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * if true, get only direct facility administrators (if false, get both direct and indirect)
     */
    onlyDirectAdmins: boolean;

  }): Observable<void> {

    return this.getFacilityAdminUsers$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getFacilityAdminGroups
   */
  static readonly GetFacilityAdminGroupsPath = '/json/facilitiesManager/getAdminGroups';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getFacilityAdminGroups()` instead.
   *
   * This method doesn't expect any response body
   */
  getFacilityAdminGroups$Response(params: {

    /**
     * id of Facility
     */
    facility: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, FacilitiesManagerService.GetFacilityAdminGroupsPath, 'get');
    if (params) {

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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getFacilityAdminGroups$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getFacilityAdminGroups(params: {

    /**
     * id of Facility
     */
    facility: number;

  }): Observable<void> {

    return this.getFacilityAdminGroups$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}
