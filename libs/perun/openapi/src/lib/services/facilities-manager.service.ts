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

}
