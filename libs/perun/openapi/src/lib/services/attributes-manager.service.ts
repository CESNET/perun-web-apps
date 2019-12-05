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
 * AttributesManager RPC API in Perun
 */
@Injectable({
  providedIn: 'root',
})
export class AttributesManagerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getAttributeDefinition
   */
  static readonly GetAttributeDefinitionPath = '/json/attributesManager/getAttributeDefinition';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAttributeDefinition()` instead.
   *
   * This method doesn't expect any response body
   */
  getAttributeDefinition$Response(params: {

    /**
     * full name of attribute definition (namespace + &#x27;:&#x27; + friendlyName)
     */
    attributeName: string;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetAttributeDefinitionPath, 'get');
    if (params) {

      rb.query('attributeName', params.attributeName);

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
   * To access the full response (for headers, for example), `getAttributeDefinition$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getAttributeDefinition(params: {

    /**
     * full name of attribute definition (namespace + &#x27;:&#x27; + friendlyName)
     */
    attributeName: string;

  }): Observable<void> {

    return this.getAttributeDefinition$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getFacilityAttributeByName
   */
  static readonly GetFacilityAttributeByNamePath = '/json/attributesManager/getAttribute/name-facility';

  /**
   * This is an overloaded method getAttribute, specialized for facility and attribute name.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getFacilityAttributeByName()` instead.
   *
   * This method doesn't expect any response body
   */
  getFacilityAttributeByName$Response(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * full name of attribute definition (namespace + &#x27;:&#x27; + friendlyName)
     */
    attributeName: string;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetFacilityAttributeByNamePath, 'get');
    if (params) {

      rb.query('facility', params.facility);
      rb.query('attributeName', params.attributeName);

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
   * This is an overloaded method getAttribute, specialized for facility and attribute name.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getFacilityAttributeByName$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getFacilityAttributeByName(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * full name of attribute definition (namespace + &#x27;:&#x27; + friendlyName)
     */
    attributeName: string;

  }): Observable<void> {

    return this.getFacilityAttributeByName$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getFacilityAttributeById
   */
  static readonly GetFacilityAttributeByIdPath = '/json/attributesManager/getAttribute/id-facility';

  /**
   * This is an overloaded method getAttribute, specialized for facility and attribute id.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getFacilityAttributeById()` instead.
   *
   * This method doesn't expect any response body
   */
  getFacilityAttributeById$Response(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * id of AttributeDefinition
     */
    attributeId: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetFacilityAttributeByIdPath, 'get');
    if (params) {

      rb.query('facility', params.facility);
      rb.query('attributeId', params.attributeId);

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
   * This is an overloaded method getAttribute, specialized for facility and attribute id.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getFacilityAttributeById$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getFacilityAttributeById(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * id of AttributeDefinition
     */
    attributeId: number;

  }): Observable<void> {

    return this.getFacilityAttributeById$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getUserAttributeByName
   */
  static readonly GetUserAttributeByNamePath = '/json/attributesManager/getAttribute/name-user';

  /**
   * This is an overloaded method getAttribute, specialized for user and attribute name.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getUserAttributeByName()` instead.
   *
   * This method doesn't expect any response body
   */
  getUserAttributeByName$Response(params: {

    /**
     * id of User
     */
    user: number;

    /**
     * full name of attribute definition (namespace + &#x27;:&#x27; + friendlyName)
     */
    attributeName: string;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetUserAttributeByNamePath, 'get');
    if (params) {

      rb.query('user', params.user);
      rb.query('attributeName', params.attributeName);

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
   * This is an overloaded method getAttribute, specialized for user and attribute name.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getUserAttributeByName$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getUserAttributeByName(params: {

    /**
     * id of User
     */
    user: number;

    /**
     * full name of attribute definition (namespace + &#x27;:&#x27; + friendlyName)
     */
    attributeName: string;

  }): Observable<void> {

    return this.getUserAttributeByName$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getUserAttributeById
   */
  static readonly GetUserAttributeByIdPath = '/json/attributesManager/getAttribute/id-user';

  /**
   * This is an overloaded method getAttribute, specialized for user and attribute id.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getUserAttributeById()` instead.
   *
   * This method doesn't expect any response body
   */
  getUserAttributeById$Response(params: {

    /**
     * id of User
     */
    user: number;

    /**
     * id of AttributeDefinition
     */
    attributeId: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetUserAttributeByIdPath, 'get');
    if (params) {

      rb.query('user', params.user);
      rb.query('attributeId', params.attributeId);

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
   * This is an overloaded method getAttribute, specialized for user and attribute id.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getUserAttributeById$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getUserAttributeById(params: {

    /**
     * id of User
     */
    user: number;

    /**
     * id of AttributeDefinition
     */
    attributeId: number;

  }): Observable<void> {

    return this.getUserAttributeById$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getUserFacilityAttributeByName
   */
  static readonly GetUserFacilityAttributeByNamePath = '/json/attributesManager/getAttribute/name-user_facility';

  /**
   * This is an overloaded method getAttribute, specialized for user, facility and attribute name.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getUserFacilityAttributeByName()` instead.
   *
   * This method doesn't expect any response body
   */
  getUserFacilityAttributeByName$Response(params: {

    /**
     * id of User
     */
    user: number;

    /**
     * id of Facility
     */
    facility: number;

    /**
     * full name of attribute definition (namespace + &#x27;:&#x27; + friendlyName)
     */
    attributeName: string;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetUserFacilityAttributeByNamePath, 'get');
    if (params) {

      rb.query('user', params.user);
      rb.query('facility', params.facility);
      rb.query('attributeName', params.attributeName);

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
   * This is an overloaded method getAttribute, specialized for user, facility and attribute name.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getUserFacilityAttributeByName$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getUserFacilityAttributeByName(params: {

    /**
     * id of User
     */
    user: number;

    /**
     * id of Facility
     */
    facility: number;

    /**
     * full name of attribute definition (namespace + &#x27;:&#x27; + friendlyName)
     */
    attributeName: string;

  }): Observable<void> {

    return this.getUserFacilityAttributeByName$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getUserFacilityAttributeById
   */
  static readonly GetUserFacilityAttributeByIdPath = '/json/attributesManager/getAttribute/id-user_facility';

  /**
   * This is an overloaded method getAttribute, specialized for user, facility and attribute id.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getUserFacilityAttributeById()` instead.
   *
   * This method doesn't expect any response body
   */
  getUserFacilityAttributeById$Response(params: {

    /**
     * id of User
     */
    user: number;

    /**
     * id of Facility
     */
    facility: number;

    /**
     * id of AttributeDefinition
     */
    attributeId: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetUserFacilityAttributeByIdPath, 'get');
    if (params) {

      rb.query('user', params.user);
      rb.query('facility', params.facility);
      rb.query('attributeId', params.attributeId);

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
   * This is an overloaded method getAttribute, specialized for user, facility and attribute id.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getUserFacilityAttributeById$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getUserFacilityAttributeById(params: {

    /**
     * id of User
     */
    user: number;

    /**
     * id of Facility
     */
    facility: number;

    /**
     * id of AttributeDefinition
     */
    attributeId: number;

  }): Observable<void> {

    return this.getUserFacilityAttributeById$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getVoAttributeByName
   */
  static readonly GetVoAttributeByNamePath = '/json/attributesManager/getAttribute/name-vo';

  /**
   * This is an overloaded method getAttribute, specialized for virtual organization and attribute name.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getVoAttributeByName()` instead.
   *
   * This method doesn't expect any response body
   */
  getVoAttributeByName$Response(params: {

    /**
     * id of Vo
     */
    vo: number;

    /**
     * full name of attribute definition (namespace + &#x27;:&#x27; + friendlyName)
     */
    attributeName: string;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetVoAttributeByNamePath, 'get');
    if (params) {

      rb.query('vo', params.vo);
      rb.query('attributeName', params.attributeName);

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
   * This is an overloaded method getAttribute, specialized for virtual organization and attribute name.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getVoAttributeByName$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getVoAttributeByName(params: {

    /**
     * id of Vo
     */
    vo: number;

    /**
     * full name of attribute definition (namespace + &#x27;:&#x27; + friendlyName)
     */
    attributeName: string;

  }): Observable<void> {

    return this.getVoAttributeByName$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getVoAttributeById
   */
  static readonly GetVoAttributeByIdPath = '/json/attributesManager/getAttribute/id-vo';

  /**
   * This is an overloaded method getAttribute, specialized for virtual organization and attribute id.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getVoAttributeById()` instead.
   *
   * This method doesn't expect any response body
   */
  getVoAttributeById$Response(params: {

    /**
     * id of Vo
     */
    vo: number;

    /**
     * id of AttributeDefinition
     */
    attributeId: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetVoAttributeByIdPath, 'get');
    if (params) {

      rb.query('vo', params.vo);
      rb.query('attributeId', params.attributeId);

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
   * This is an overloaded method getAttribute, specialized for virtual organization and attribute id.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getVoAttributeById$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getVoAttributeById(params: {

    /**
     * id of Vo
     */
    vo: number;

    /**
     * id of AttributeDefinition
     */
    attributeId: number;

  }): Observable<void> {

    return this.getVoAttributeById$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getMemberAttributeByName
   */
  static readonly GetMemberAttributeByNamePath = '/json/attributesManager/getAttribute/name-member';

  /**
   * This is an overloaded method getAttribute, specialized for member and attribute name.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getMemberAttributeByName()` instead.
   *
   * This method doesn't expect any response body
   */
  getMemberAttributeByName$Response(params: {

    /**
     * id of Member
     */
    member: number;

    /**
     * full name of attribute definition (namespace + &#x27;:&#x27; + friendlyName)
     */
    attributeName: string;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetMemberAttributeByNamePath, 'get');
    if (params) {

      rb.query('member', params.member);
      rb.query('attributeName', params.attributeName);

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
   * This is an overloaded method getAttribute, specialized for member and attribute name.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getMemberAttributeByName$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getMemberAttributeByName(params: {

    /**
     * id of Member
     */
    member: number;

    /**
     * full name of attribute definition (namespace + &#x27;:&#x27; + friendlyName)
     */
    attributeName: string;

  }): Observable<void> {

    return this.getMemberAttributeByName$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getMemberAttributeById
   */
  static readonly GetMemberAttributeByIdPath = '/json/attributesManager/getAttribute/id-member';

  /**
   * This is an overloaded method getAttribute, specialized for member and attribute id.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getMemberAttributeById()` instead.
   *
   * This method doesn't expect any response body
   */
  getMemberAttributeById$Response(params: {

    /**
     * id of Member
     */
    member: number;

    /**
     * id of AttributeDefinition
     */
    attributeId: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetMemberAttributeByIdPath, 'get');
    if (params) {

      rb.query('member', params.member);
      rb.query('attributeId', params.attributeId);

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
   * This is an overloaded method getAttribute, specialized for member and attribute id.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getMemberAttributeById$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getMemberAttributeById(params: {

    /**
     * id of Member
     */
    member: number;

    /**
     * id of AttributeDefinition
     */
    attributeId: number;

  }): Observable<void> {

    return this.getMemberAttributeById$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getGroupAttributeByName
   */
  static readonly GetGroupAttributeByNamePath = '/json/attributesManager/getAttribute/name-group';

  /**
   * This is an overloaded method getAttribute, specialized for group and attribute name.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getGroupAttributeByName()` instead.
   *
   * This method doesn't expect any response body
   */
  getGroupAttributeByName$Response(params: {

    /**
     * id of Group
     */
    group: number;

    /**
     * full name of attribute definition (namespace + &#x27;:&#x27; + friendlyName)
     */
    attributeName: string;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetGroupAttributeByNamePath, 'get');
    if (params) {

      rb.query('group', params.group);
      rb.query('attributeName', params.attributeName);

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
   * This is an overloaded method getAttribute, specialized for group and attribute name.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getGroupAttributeByName$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getGroupAttributeByName(params: {

    /**
     * id of Group
     */
    group: number;

    /**
     * full name of attribute definition (namespace + &#x27;:&#x27; + friendlyName)
     */
    attributeName: string;

  }): Observable<void> {

    return this.getGroupAttributeByName$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getGroupAttributeById
   */
  static readonly GetGroupAttributeByIdPath = '/json/attributesManager/getAttribute/id-group';

  /**
   * This is an overloaded method getAttribute, specialized for group and attribute id.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getGroupAttributeById()` instead.
   *
   * This method doesn't expect any response body
   */
  getGroupAttributeById$Response(params: {

    /**
     * id of Group
     */
    group: number;

    /**
     * id of AttributeDefinition
     */
    attributeId: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetGroupAttributeByIdPath, 'get');
    if (params) {

      rb.query('group', params.group);
      rb.query('attributeId', params.attributeId);

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
   * This is an overloaded method getAttribute, specialized for group and attribute id.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getGroupAttributeById$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getGroupAttributeById(params: {

    /**
     * id of Group
     */
    group: number;

    /**
     * id of AttributeDefinition
     */
    attributeId: number;

  }): Observable<void> {

    return this.getGroupAttributeById$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getResourceAttributeByName
   */
  static readonly GetResourceAttributeByNamePath = '/json/attributesManager/getAttribute/name-resource';

  /**
   * This is an overloaded method getAttribute, specialized for resource and attribute name.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getResourceAttributeByName()` instead.
   *
   * This method doesn't expect any response body
   */
  getResourceAttributeByName$Response(params: {

    /**
     * id of Resource
     */
    resource: number;

    /**
     * full name of attribute definition (namespace + &#x27;:&#x27; + friendlyName)
     */
    attributeName: string;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetResourceAttributeByNamePath, 'get');
    if (params) {

      rb.query('resource', params.resource);
      rb.query('attributeName', params.attributeName);

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
   * This is an overloaded method getAttribute, specialized for resource and attribute name.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getResourceAttributeByName$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getResourceAttributeByName(params: {

    /**
     * id of Resource
     */
    resource: number;

    /**
     * full name of attribute definition (namespace + &#x27;:&#x27; + friendlyName)
     */
    attributeName: string;

  }): Observable<void> {

    return this.getResourceAttributeByName$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getResourceAttributeById
   */
  static readonly GetResourceAttributeByIdPath = '/json/attributesManager/getAttribute/id-resource';

  /**
   * This is an overloaded method getAttribute, specialized for resource and attribute id.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getResourceAttributeById()` instead.
   *
   * This method doesn't expect any response body
   */
  getResourceAttributeById$Response(params: {

    /**
     * id of Resource
     */
    resource: number;

    /**
     * id of AttributeDefinition
     */
    attributeId: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetResourceAttributeByIdPath, 'get');
    if (params) {

      rb.query('resource', params.resource);
      rb.query('attributeId', params.attributeId);

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
   * This is an overloaded method getAttribute, specialized for resource and attribute id.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getResourceAttributeById$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getResourceAttributeById(params: {

    /**
     * id of Resource
     */
    resource: number;

    /**
     * id of AttributeDefinition
     */
    attributeId: number;

  }): Observable<void> {

    return this.getResourceAttributeById$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getMemberGroupAttributeByName
   */
  static readonly GetMemberGroupAttributeByNamePath = '/json/attributesManager/getAttribute/name-member-group';

  /**
   * This is an overloaded method getAttribute, specialized for member, group and attribute name.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getMemberGroupAttributeByName()` instead.
   *
   * This method doesn't expect any response body
   */
  getMemberGroupAttributeByName$Response(params: {

    /**
     * id of Member
     */
    member: number;

    /**
     * id of Group
     */
    group: number;

    /**
     * full name of attribute definition (namespace + &#x27;:&#x27; + friendlyName)
     */
    attributeName: string;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetMemberGroupAttributeByNamePath, 'get');
    if (params) {

      rb.query('member', params.member);
      rb.query('group', params.group);
      rb.query('attributeName', params.attributeName);

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
   * This is an overloaded method getAttribute, specialized for member, group and attribute name.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getMemberGroupAttributeByName$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getMemberGroupAttributeByName(params: {

    /**
     * id of Member
     */
    member: number;

    /**
     * id of Group
     */
    group: number;

    /**
     * full name of attribute definition (namespace + &#x27;:&#x27; + friendlyName)
     */
    attributeName: string;

  }): Observable<void> {

    return this.getMemberGroupAttributeByName$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getMemberGroupAttributeById
   */
  static readonly GetMemberGroupAttributeByIdPath = '/json/attributesManager/getAttribute/id-member-group';

  /**
   * This is an overloaded method getAttribute, specialized for member, group and attribute id.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getMemberGroupAttributeById()` instead.
   *
   * This method doesn't expect any response body
   */
  getMemberGroupAttributeById$Response(params: {

    /**
     * id of Member
     */
    member: number;

    /**
     * id of Group
     */
    group: number;

    /**
     * id of AttributeDefinition
     */
    attributeId: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetMemberGroupAttributeByIdPath, 'get');
    if (params) {

      rb.query('member', params.member);
      rb.query('group', params.group);
      rb.query('attributeId', params.attributeId);

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
   * This is an overloaded method getAttribute, specialized for member, group and attribute id.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getMemberGroupAttributeById$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getMemberGroupAttributeById(params: {

    /**
     * id of Member
     */
    member: number;

    /**
     * id of Group
     */
    group: number;

    /**
     * id of AttributeDefinition
     */
    attributeId: number;

  }): Observable<void> {

    return this.getMemberGroupAttributeById$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getMemberResourceAttributeByName
   */
  static readonly GetMemberResourceAttributeByNamePath = '/json/attributesManager/getAttribute/name-member-resource';

  /**
   * This is an overloaded method getAttribute, specialized for member, resource and attribute name.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getMemberResourceAttributeByName()` instead.
   *
   * This method doesn't expect any response body
   */
  getMemberResourceAttributeByName$Response(params: {

    /**
     * id of Member
     */
    member: number;

    /**
     * id of Resource
     */
    resource: number;

    /**
     * full name of attribute definition (namespace + &#x27;:&#x27; + friendlyName)
     */
    attributeName: string;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetMemberResourceAttributeByNamePath, 'get');
    if (params) {

      rb.query('member', params.member);
      rb.query('resource', params.resource);
      rb.query('attributeName', params.attributeName);

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
   * This is an overloaded method getAttribute, specialized for member, resource and attribute name.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getMemberResourceAttributeByName$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getMemberResourceAttributeByName(params: {

    /**
     * id of Member
     */
    member: number;

    /**
     * id of Resource
     */
    resource: number;

    /**
     * full name of attribute definition (namespace + &#x27;:&#x27; + friendlyName)
     */
    attributeName: string;

  }): Observable<void> {

    return this.getMemberResourceAttributeByName$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getMemberResourceAttributeById
   */
  static readonly GetMemberResourceAttributeByIdPath = '/json/attributesManager/getAttribute/id-member-resource';

  /**
   * This is an overloaded method getAttribute, specialized for member, resource and attribute id.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getMemberResourceAttributeById()` instead.
   *
   * This method doesn't expect any response body
   */
  getMemberResourceAttributeById$Response(params: {

    /**
     * id of Member
     */
    member: number;

    /**
     * id of Resource
     */
    resource: number;

    /**
     * id of AttributeDefinition
     */
    attributeId: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetMemberResourceAttributeByIdPath, 'get');
    if (params) {

      rb.query('member', params.member);
      rb.query('resource', params.resource);
      rb.query('attributeId', params.attributeId);

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
   * This is an overloaded method getAttribute, specialized for member, resource and attribute id.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getMemberResourceAttributeById$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getMemberResourceAttributeById(params: {

    /**
     * id of Member
     */
    member: number;

    /**
     * id of Resource
     */
    resource: number;

    /**
     * id of AttributeDefinition
     */
    attributeId: number;

  }): Observable<void> {

    return this.getMemberResourceAttributeById$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getGroupResourceAttributeByName
   */
  static readonly GetGroupResourceAttributeByNamePath = '/json/attributesManager/getAttribute/name-group-resource';

  /**
   * This is an overloaded method getAttribute, specialized for group, resource and attribute name.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getGroupResourceAttributeByName()` instead.
   *
   * This method doesn't expect any response body
   */
  getGroupResourceAttributeByName$Response(params: {

    /**
     * id of Group
     */
    group: number;

    /**
     * id of Resource
     */
    resource: number;

    /**
     * full name of attribute definition (namespace + &#x27;:&#x27; + friendlyName)
     */
    attributeName: string;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetGroupResourceAttributeByNamePath, 'get');
    if (params) {

      rb.query('group', params.group);
      rb.query('resource', params.resource);
      rb.query('attributeName', params.attributeName);

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
   * This is an overloaded method getAttribute, specialized for group, resource and attribute name.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getGroupResourceAttributeByName$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getGroupResourceAttributeByName(params: {

    /**
     * id of Group
     */
    group: number;

    /**
     * id of Resource
     */
    resource: number;

    /**
     * full name of attribute definition (namespace + &#x27;:&#x27; + friendlyName)
     */
    attributeName: string;

  }): Observable<void> {

    return this.getGroupResourceAttributeByName$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getGroupResourceAttributeById
   */
  static readonly GetGroupResourceAttributeByIdPath = '/json/attributesManager/getAttribute/id-group-resource';

  /**
   * This is an overloaded method getAttribute, specialized for group, resource and attribute id.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getGroupResourceAttributeById()` instead.
   *
   * This method doesn't expect any response body
   */
  getGroupResourceAttributeById$Response(params: {

    /**
     * id of Group
     */
    group: number;

    /**
     * id of Resource
     */
    resource: number;

    /**
     * id of AttributeDefinition
     */
    attributeId: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetGroupResourceAttributeByIdPath, 'get');
    if (params) {

      rb.query('group', params.group);
      rb.query('resource', params.resource);
      rb.query('attributeId', params.attributeId);

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
   * This is an overloaded method getAttribute, specialized for group, resource and attribute id.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getGroupResourceAttributeById$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getGroupResourceAttributeById(params: {

    /**
     * id of Group
     */
    group: number;

    /**
     * id of Resource
     */
    resource: number;

    /**
     * id of AttributeDefinition
     */
    attributeId: number;

  }): Observable<void> {

    return this.getGroupResourceAttributeById$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getUserExtSourceAttributeByName
   */
  static readonly GetUserExtSourceAttributeByNamePath = '/json/attributesManager/getAttribute/name-ues';

  /**
   * This is an overloaded method getAttribute, specialized for UserExtSource and attribute name.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getUserExtSourceAttributeByName()` instead.
   *
   * This method doesn't expect any response body
   */
  getUserExtSourceAttributeByName$Response(params: {

    /**
     * id of UserExtSource
     */
    userExtSource: number;

    /**
     * full name of attribute definition (namespace + &#x27;:&#x27; + friendlyName)
     */
    attributeName: string;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetUserExtSourceAttributeByNamePath, 'get');
    if (params) {

      rb.query('userExtSource', params.userExtSource);
      rb.query('attributeName', params.attributeName);

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
   * This is an overloaded method getAttribute, specialized for UserExtSource and attribute name.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getUserExtSourceAttributeByName$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getUserExtSourceAttributeByName(params: {

    /**
     * id of UserExtSource
     */
    userExtSource: number;

    /**
     * full name of attribute definition (namespace + &#x27;:&#x27; + friendlyName)
     */
    attributeName: string;

  }): Observable<void> {

    return this.getUserExtSourceAttributeByName$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getUserExtSourceAttributeById
   */
  static readonly GetUserExtSourceAttributeByIdPath = '/json/attributesManager/getAttribute/id-ues';

  /**
   * This is an overloaded method getAttribute, specialized for UserExtSource and attribute id.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getUserExtSourceAttributeById()` instead.
   *
   * This method doesn't expect any response body
   */
  getUserExtSourceAttributeById$Response(params: {

    /**
     * id of UserExtSource
     */
    userExtSource: number;

    /**
     * id of AttributeDefinition
     */
    attributeId: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetUserExtSourceAttributeByIdPath, 'get');
    if (params) {

      rb.query('userExtSource', params.userExtSource);
      rb.query('attributeId', params.attributeId);

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
   * This is an overloaded method getAttribute, specialized for UserExtSource and attribute id.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getUserExtSourceAttributeById$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getUserExtSourceAttributeById(params: {

    /**
     * id of UserExtSource
     */
    userExtSource: number;

    /**
     * id of AttributeDefinition
     */
    attributeId: number;

  }): Observable<void> {

    return this.getUserExtSourceAttributeById$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getHostAttributeByName
   */
  static readonly GetHostAttributeByNamePath = '/json/attributesManager/getAttribute/name-host';

  /**
   * This is an overloaded method getAttribute, specialized for host and attribute name.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getHostAttributeByName()` instead.
   *
   * This method doesn't expect any response body
   */
  getHostAttributeByName$Response(params: {

    /**
     * id of Host
     */
    host: number;

    /**
     * full name of attribute definition (namespace + &#x27;:&#x27; + friendlyName)
     */
    attributeName: string;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetHostAttributeByNamePath, 'get');
    if (params) {

      rb.query('host', params.host);
      rb.query('attributeName', params.attributeName);

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
   * This is an overloaded method getAttribute, specialized for host and attribute name.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getHostAttributeByName$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getHostAttributeByName(params: {

    /**
     * id of Host
     */
    host: number;

    /**
     * full name of attribute definition (namespace + &#x27;:&#x27; + friendlyName)
     */
    attributeName: string;

  }): Observable<void> {

    return this.getHostAttributeByName$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getHostAttributeById
   */
  static readonly GetHostAttributeByIdPath = '/json/attributesManager/getAttribute/id-host';

  /**
   * This is an overloaded method getAttribute, specialized for host and attribute id.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getHostAttributeById()` instead.
   *
   * This method doesn't expect any response body
   */
  getHostAttributeById$Response(params: {

    /**
     * id of Host
     */
    host: number;

    /**
     * id of AttributeDefinition
     */
    attributeId: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetHostAttributeByIdPath, 'get');
    if (params) {

      rb.query('host', params.host);
      rb.query('attributeId', params.attributeId);

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
   * This is an overloaded method getAttribute, specialized for host and attribute id.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getHostAttributeById$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getHostAttributeById(params: {

    /**
     * id of Host
     */
    host: number;

    /**
     * id of AttributeDefinition
     */
    attributeId: number;

  }): Observable<void> {

    return this.getHostAttributeById$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getEntitylessAttributeByName
   */
  static readonly GetEntitylessAttributeByNamePath = '/json/attributesManager/getAttribute/name-entityless';

  /**
   * This is an overloaded method getAttribute, specialized for entityless key and attribute name.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getEntitylessAttributeByName()` instead.
   *
   * This method doesn't expect any response body
   */
  getEntitylessAttributeByName$Response(params: {

    /**
     * key for entityless attribute
     */
    key: string;

    /**
     * full name of attribute definition (namespace + &#x27;:&#x27; + friendlyName)
     */
    attributeName: string;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetEntitylessAttributeByNamePath, 'get');
    if (params) {

      rb.query('key', params.key);
      rb.query('attributeName', params.attributeName);

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
   * This is an overloaded method getAttribute, specialized for entityless key and attribute name.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getEntitylessAttributeByName$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getEntitylessAttributeByName(params: {

    /**
     * key for entityless attribute
     */
    key: string;

    /**
     * full name of attribute definition (namespace + &#x27;:&#x27; + friendlyName)
     */
    attributeName: string;

  }): Observable<void> {

    return this.getEntitylessAttributeByName$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getAttribute
   */
  static readonly GetAttributePath = '/json/attributesManager/getAttribute/any';

  /**
   * This method cannot be fully described correctly in OpenID, because it cannot describe allowed combinations of parameters.
   * One of attributeName, attributeId is required.
   * The other parameters specify ids that can be combined in the following ways:
   *  (facility), (user), (user,facility), (vo), (member), (group), (resource),
   *  (member,group), (member,resource), (group,resource),(userExtSource), (host), (key)
   * Use the specialized methods getFacilityAttributeByName(), getMemberResourceAttributeById() etc.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAttribute()` instead.
   *
   * This method doesn't expect any response body
   */
  getAttribute$Response(params?: {

    /**
     * full name of attribute (namespace + &#x27;:&#x27; + friendlyName)
     */
    attributeName?: string;

    /**
     * id of attribute
     */
    attributeId?: number;

    /**
     * id of Facility
     */
    facility?: number;

    /**
     * id of User
     */
    user?: number;

    /**
     * id of Vo
     */
    vo?: number;

    /**
     * id of Resource
     */
    resource?: number;

    /**
     * id of Member
     */
    member?: number;

    /**
     * id of Group
     */
    group?: number;

    /**
     * id of Host
     */
    host?: number;

    /**
     * id of UserExtSource
     */
    userExtSource?: number;

    /**
     * key for entityless attribute
     */
    key?: string;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetAttributePath, 'get');
    if (params) {

      rb.query('attributeName', params.attributeName);
      rb.query('attributeId', params.attributeId);
      rb.query('facility', params.facility);
      rb.query('user', params.user);
      rb.query('vo', params.vo);
      rb.query('resource', params.resource);
      rb.query('member', params.member);
      rb.query('group', params.group);
      rb.query('host', params.host);
      rb.query('userExtSource', params.userExtSource);
      rb.query('key', params.key);

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
   * This method cannot be fully described correctly in OpenID, because it cannot describe allowed combinations of parameters.
   * One of attributeName, attributeId is required.
   * The other parameters specify ids that can be combined in the following ways:
   *  (facility), (user), (user,facility), (vo), (member), (group), (resource),
   *  (member,group), (member,resource), (group,resource),(userExtSource), (host), (key)
   * Use the specialized methods getFacilityAttributeByName(), getMemberResourceAttributeById() etc.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getAttribute$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getAttribute(params?: {

    /**
     * full name of attribute (namespace + &#x27;:&#x27; + friendlyName)
     */
    attributeName?: string;

    /**
     * id of attribute
     */
    attributeId?: number;

    /**
     * id of Facility
     */
    facility?: number;

    /**
     * id of User
     */
    user?: number;

    /**
     * id of Vo
     */
    vo?: number;

    /**
     * id of Resource
     */
    resource?: number;

    /**
     * id of Member
     */
    member?: number;

    /**
     * id of Group
     */
    group?: number;

    /**
     * id of Host
     */
    host?: number;

    /**
     * id of UserExtSource
     */
    userExtSource?: number;

    /**
     * key for entityless attribute
     */
    key?: string;

  }): Observable<void> {

    return this.getAttribute$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getFacilityAttributes
   */
  static readonly GetFacilityAttributesPath = '/json/attributesManager/getAttributes';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getFacilityAttributes()` instead.
   *
   * This method doesn't expect any response body
   */
  getFacilityAttributes$Response(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * list of attribute names List&lt;String&gt;
     */
    attrNames: Array<string>;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetFacilityAttributesPath, 'get');
    if (params) {

      rb.query('facility', params.facility);
      rb.query('attrNames[]', params.attrNames);

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
   * To access the full response (for headers, for example), `getFacilityAttributes$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getFacilityAttributes(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * list of attribute names List&lt;String&gt;
     */
    attrNames: Array<string>;

  }): Observable<void> {

    return this.getFacilityAttributes$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}
