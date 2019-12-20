/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { Attribute } from '../models/attribute';
import { AttributeDefinition } from '../models/attribute-definition';


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
   * Path part for operation getFacilityResourceUserMemberAttributes
   */
  static readonly GetFacilityResourceUserMemberAttributesPath = '/json/attributesManager/getAttributes/f-r-u-m';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getFacilityResourceUserMemberAttributes()` instead.
   *
   * This method doesn't expect any response body
   */
  getFacilityResourceUserMemberAttributes$Response(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * id of Resource
     */
    resource: number;

    /**
     * id of User
     */
    user: number;

    /**
     * id of Member
     */
    member: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetFacilityResourceUserMemberAttributesPath, 'get');
    if (params) {

      rb.query('facility', params.facility);
      rb.query('resource', params.resource);
      rb.query('user', params.user);
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
   * To access the full response (for headers, for example), `getFacilityResourceUserMemberAttributes$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getFacilityResourceUserMemberAttributes(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * id of Resource
     */
    resource: number;

    /**
     * id of User
     */
    user: number;

    /**
     * id of Member
     */
    member: number;

  }): Observable<void> {

    return this.getFacilityResourceUserMemberAttributes$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getFacilityUserAttributes
   */
  static readonly GetFacilityUserAttributesPath = '/json/attributesManager/getAttributes/f-u';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getFacilityUserAttributes()` instead.
   *
   * This method doesn't expect any response body
   */
  getFacilityUserAttributes$Response(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * id of User
     */
    user: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetFacilityUserAttributesPath, 'get');
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
   * To access the full response (for headers, for example), `getFacilityUserAttributes$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getFacilityUserAttributes(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * id of User
     */
    user: number;

  }): Observable<void> {

    return this.getFacilityUserAttributes$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getFacilityAttributesByNames
   */
  static readonly GetFacilityAttributesByNamesPath = '/json/attributesManager/getAttributes/f-names';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getFacilityAttributesByNames()` instead.
   *
   * This method doesn't expect any response body
   */
  getFacilityAttributesByNames$Response(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * list of attribute names List&lt;String&gt;
     */
    attrNames: Array<string>;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetFacilityAttributesByNamesPath, 'get');
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
   * To access the full response (for headers, for example), `getFacilityAttributesByNames$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getFacilityAttributesByNames(params: {

    /**
     * id of Facility
     */
    facility: number;

    /**
     * list of attribute names List&lt;String&gt;
     */
    attrNames: Array<string>;

  }): Observable<void> {

    return this.getFacilityAttributesByNames$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getFacilityAttributes
   */
  static readonly GetFacilityAttributesPath = '/json/attributesManager/getAttributes/f';

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

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetFacilityAttributesPath, 'get');
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
   * To access the full response (for headers, for example), `getFacilityAttributes$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getFacilityAttributes(params: {

    /**
     * id of Facility
     */
    facility: number;

  }): Observable<void> {

    return this.getFacilityAttributes$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getVoAttributesByNames
   */
  static readonly GetVoAttributesByNamesPath = '/json/attributesManager/getAttributes/vo-names';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getVoAttributesByNames()` instead.
   *
   * This method doesn't expect any response body
   */
  getVoAttributesByNames$Response(params: {

    /**
     * id of Vo
     */
    vo: number;

    /**
     * list of attribute names List&lt;String&gt;
     */
    attrNames: Array<string>;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetVoAttributesByNamesPath, 'get');
    if (params) {

      rb.query('vo', params.vo);
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
   * To access the full response (for headers, for example), `getVoAttributesByNames$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getVoAttributesByNames(params: {

    /**
     * id of Vo
     */
    vo: number;

    /**
     * list of attribute names List&lt;String&gt;
     */
    attrNames: Array<string>;

  }): Observable<void> {

    return this.getVoAttributesByNames$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getVoAttributes
   */
  static readonly GetVoAttributesPath = '/json/attributesManager/getAttributes/vo';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getVoAttributes()` instead.
   *
   * This method doesn't expect any response body
   */
  getVoAttributes$Response(params: {

    /**
     * id of Vo
     */
    vo: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetVoAttributesPath, 'get');
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
   * To access the full response (for headers, for example), `getVoAttributes$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getVoAttributes(params: {

    /**
     * id of Vo
     */
    vo: number;

  }): Observable<void> {

    return this.getVoAttributes$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getMemberResourceAndUserFacilityAttributesByNames
   */
  static readonly GetMemberResourceAndUserFacilityAttributesByNamesPath = '/json/attributesManager/getAttributes/m-r-names-wu';

  /**
   * Gets selected non-empty attributes associated with the member and the resource.
   * It returns member and member-resource attributes and also user and user-facility attributes if
   * workWithUserAttributes is true.
   * Attributes are selected by list of attr_names. Empty list means all attributes.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getMemberResourceAndUserFacilityAttributesByNames()` instead.
   *
   * This method doesn't expect any response body
   */
  getMemberResourceAndUserFacilityAttributesByNames$Response(params: {

    /**
     * id of Member
     */
    member: number;

    /**
     * id of Resource
     */
    resource: number;

    /**
     * list of attribute names List&lt;String&gt;
     */
    attrNames: Array<string>;

    /**
     * flag to work with user attributes
     */
    workWithUserAttributes: boolean;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetMemberResourceAndUserFacilityAttributesByNamesPath, 'get');
    if (params) {

      rb.query('member', params.member);
      rb.query('resource', params.resource);
      rb.query('attrNames[]', params.attrNames);
      rb.query('workWithUserAttributes', params.workWithUserAttributes);

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
   * Gets selected non-empty attributes associated with the member and the resource.
   * It returns member and member-resource attributes and also user and user-facility attributes if
   * workWithUserAttributes is true.
   * Attributes are selected by list of attr_names. Empty list means all attributes.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getMemberResourceAndUserFacilityAttributesByNames$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getMemberResourceAndUserFacilityAttributesByNames(params: {

    /**
     * id of Member
     */
    member: number;

    /**
     * id of Resource
     */
    resource: number;

    /**
     * list of attribute names List&lt;String&gt;
     */
    attrNames: Array<string>;

    /**
     * flag to work with user attributes
     */
    workWithUserAttributes: boolean;

  }): Observable<void> {

    return this.getMemberResourceAndUserFacilityAttributesByNames$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getMemberResourceAndUserFacilityAttributes
   */
  static readonly GetMemberResourceAndUserFacilityAttributesPath = '/json/attributesManager/getAttributes/m-r-wu';

  /**
   * Gets all non-empty attributes associated with the member on the resource and if workWithUserAttributes is
   * true, gets also all non-empty user, user-facility and member attributes.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getMemberResourceAndUserFacilityAttributes()` instead.
   *
   * This method doesn't expect any response body
   */
  getMemberResourceAndUserFacilityAttributes$Response(params: {

    /**
     * id of Member
     */
    member: number;

    /**
     * id of Resource
     */
    resource: number;

    /**
     * flag to work with user attributes
     */
    workWithUserAttributes: boolean;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetMemberResourceAndUserFacilityAttributesPath, 'get');
    if (params) {

      rb.query('member', params.member);
      rb.query('resource', params.resource);
      rb.query('workWithUserAttributes', params.workWithUserAttributes);

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
   * Gets all non-empty attributes associated with the member on the resource and if workWithUserAttributes is
   * true, gets also all non-empty user, user-facility and member attributes.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getMemberResourceAndUserFacilityAttributes$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getMemberResourceAndUserFacilityAttributes(params: {

    /**
     * id of Member
     */
    member: number;

    /**
     * id of Resource
     */
    resource: number;

    /**
     * flag to work with user attributes
     */
    workWithUserAttributes: boolean;

  }): Observable<void> {

    return this.getMemberResourceAndUserFacilityAttributes$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getResourceGroupMemberAttributesByNames
   */
  static readonly GetResourceGroupMemberAttributesByNamesPath = '/json/attributesManager/getAttributes/r-g-m-names';

  /**
   * Get all attributes by the list of attrNames if they are in one of these namespaces:
   * - member
   * - group
   * - member-group
   * - resource
   * - member-resource
   * - group-resource
   * - user (get from member object)
   * - facility (get from resource object)
   * - user-facility
   * Returns all attributes even if they are empty or virtual.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getResourceGroupMemberAttributesByNames()` instead.
   *
   * This method doesn't expect any response body
   */
  getResourceGroupMemberAttributesByNames$Response(params: {

    /**
     * id of Resource
     */
    resource: number;

    /**
     * id of Group
     */
    group: number;

    /**
     * id of Member
     */
    member: number;

    /**
     * list of attribute names List&lt;String&gt;
     */
    attrNames: Array<string>;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetResourceGroupMemberAttributesByNamesPath, 'get');
    if (params) {

      rb.query('resource', params.resource);
      rb.query('group', params.group);
      rb.query('member', params.member);
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
   * Get all attributes by the list of attrNames if they are in one of these namespaces:
   * - member
   * - group
   * - member-group
   * - resource
   * - member-resource
   * - group-resource
   * - user (get from member object)
   * - facility (get from resource object)
   * - user-facility
   * Returns all attributes even if they are empty or virtual.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getResourceGroupMemberAttributesByNames$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getResourceGroupMemberAttributesByNames(params: {

    /**
     * id of Resource
     */
    resource: number;

    /**
     * id of Group
     */
    group: number;

    /**
     * id of Member
     */
    member: number;

    /**
     * list of attribute names List&lt;String&gt;
     */
    attrNames: Array<string>;

  }): Observable<void> {

    return this.getResourceGroupMemberAttributesByNames$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getMemberResourceAttributes
   */
  static readonly GetMemberResourceAttributesPath = '/json/attributesManager/getAttributes/m-r';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getMemberResourceAttributes()` instead.
   *
   * This method doesn't expect any response body
   */
  getMemberResourceAttributes$Response(params: {

    /**
     * id of Member
     */
    member: number;

    /**
     * id of Resource
     */
    resource: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetMemberResourceAttributesPath, 'get');
    if (params) {

      rb.query('member', params.member);
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
   * To access the full response (for headers, for example), `getMemberResourceAttributes$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getMemberResourceAttributes(params: {

    /**
     * id of Member
     */
    member: number;

    /**
     * id of Resource
     */
    resource: number;

  }): Observable<void> {

    return this.getMemberResourceAttributes$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getResourceGroupAndGroupAttributesByNames
   */
  static readonly GetResourceGroupAndGroupAttributesByNamesPath = '/json/attributesManager/getAttributes/r-g-names-wg';

  /**
   * Get all attributes associated with the group and the resource which have their name in list attrNames (empty too).
   * Virtual attributes too.
   * If workWithGroupAttributes is true, return also all group attributes in list of attrNames (with virtual attributes too).
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getResourceGroupAndGroupAttributesByNames()` instead.
   *
   * This method doesn't expect any response body
   */
  getResourceGroupAndGroupAttributesByNames$Response(params: {

    /**
     * id of Resource
     */
    resource: number;

    /**
     * id of Group
     */
    group: number;

    /**
     * list of attribute names List&lt;String&gt;
     */
    attrNames: Array<string>;

    /**
     * flag to work with group attributes
     */
    workWithGroupAttributes: boolean;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetResourceGroupAndGroupAttributesByNamesPath, 'get');
    if (params) {

      rb.query('resource', params.resource);
      rb.query('group', params.group);
      rb.query('attrNames[]', params.attrNames);
      rb.query('workWithGroupAttributes', params.workWithGroupAttributes);

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
   * Get all attributes associated with the group and the resource which have their name in list attrNames (empty too).
   * Virtual attributes too.
   * If workWithGroupAttributes is true, return also all group attributes in list of attrNames (with virtual attributes too).
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getResourceGroupAndGroupAttributesByNames$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getResourceGroupAndGroupAttributesByNames(params: {

    /**
     * id of Resource
     */
    resource: number;

    /**
     * id of Group
     */
    group: number;

    /**
     * list of attribute names List&lt;String&gt;
     */
    attrNames: Array<string>;

    /**
     * flag to work with group attributes
     */
    workWithGroupAttributes: boolean;

  }): Observable<void> {

    return this.getResourceGroupAndGroupAttributesByNames$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getResourceGroupAndGroupAttributes
   */
  static readonly GetResourceGroupAndGroupAttributesPath = '/json/attributesManager/getAttributes/r-g-wg';

  /**
   * Get all non-empty attributes associated with the group and resource. Virtual attributes too.
   * If workWithGroupAttributes is true, return also all group attributes.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getResourceGroupAndGroupAttributes()` instead.
   *
   * This method doesn't expect any response body
   */
  getResourceGroupAndGroupAttributes$Response(params: {

    /**
     * id of Resource
     */
    resource: number;

    /**
     * id of Group
     */
    group: number;

    /**
     * flag to work with group attributes
     */
    workWithGroupAttributes: boolean;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetResourceGroupAndGroupAttributesPath, 'get');
    if (params) {

      rb.query('resource', params.resource);
      rb.query('group', params.group);
      rb.query('workWithGroupAttributes', params.workWithGroupAttributes);

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
   * Get all non-empty attributes associated with the group and resource. Virtual attributes too.
   * If workWithGroupAttributes is true, return also all group attributes.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getResourceGroupAndGroupAttributes$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getResourceGroupAndGroupAttributes(params: {

    /**
     * id of Resource
     */
    resource: number;

    /**
     * id of Group
     */
    group: number;

    /**
     * flag to work with group attributes
     */
    workWithGroupAttributes: boolean;

  }): Observable<void> {

    return this.getResourceGroupAndGroupAttributes$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getResourceGroupAttributes
   */
  static readonly GetResourceGroupAttributesPath = '/json/attributesManager/getAttributes/r-g';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getResourceGroupAttributes()` instead.
   *
   * This method doesn't expect any response body
   */
  getResourceGroupAttributes$Response(params: {

    /**
     * id of Resource
     */
    resource: number;

    /**
     * id of Group
     */
    group: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetResourceGroupAttributesPath, 'get');
    if (params) {

      rb.query('resource', params.resource);
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
   * To access the full response (for headers, for example), `getResourceGroupAttributes$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getResourceGroupAttributes(params: {

    /**
     * id of Resource
     */
    resource: number;

    /**
     * id of Group
     */
    group: number;

  }): Observable<void> {

    return this.getResourceGroupAttributes$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getResourceAttributesByNames
   */
  static readonly GetResourceAttributesByNamesPath = '/json/attributesManager/getAttributes/r-names';

  /**
   * Get all attributes associated with the resource which have name in list attrNames (empty too).
   * Virtual attributes too.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getResourceAttributesByNames()` instead.
   *
   * This method doesn't expect any response body
   */
  getResourceAttributesByNames$Response(params: {

    /**
     * id of Resource
     */
    resource: number;

    /**
     * list of attribute names List&lt;String&gt;
     */
    attrNames: Array<string>;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetResourceAttributesByNamesPath, 'get');
    if (params) {

      rb.query('resource', params.resource);
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
   * Get all attributes associated with the resource which have name in list attrNames (empty too).
   * Virtual attributes too.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getResourceAttributesByNames$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getResourceAttributesByNames(params: {

    /**
     * id of Resource
     */
    resource: number;

    /**
     * list of attribute names List&lt;String&gt;
     */
    attrNames: Array<string>;

  }): Observable<void> {

    return this.getResourceAttributesByNames$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getResourceAttributes
   */
  static readonly GetResourceAttributesPath = '/json/attributesManager/getAttributes/r';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getResourceAttributes()` instead.
   *
   * This method doesn't expect any response body
   */
  getResourceAttributes$Response(params: {

    /**
     * id of Resource
     */
    resource: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetResourceAttributesPath, 'get');
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
   * To access the full response (for headers, for example), `getResourceAttributes$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getResourceAttributes(params: {

    /**
     * id of Resource
     */
    resource: number;

  }): Observable<void> {

    return this.getResourceAttributes$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getMemberGroupAndUserAttributesByNames
   */
  static readonly GetMemberGroupAndUserAttributesByNamesPath = '/json/attributesManager/getAttributes/m-g-names-wu';

  /**
   * Get all attributes associated with the member in the group which have name in list attrNames (empty too).
   * If workWithUserAttribute is true, return also all user attributes in list of attrNames (with virtual attributes too).
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getMemberGroupAndUserAttributesByNames()` instead.
   *
   * This method doesn't expect any response body
   */
  getMemberGroupAndUserAttributesByNames$Response(params: {

    /**
     * id of Member
     */
    member: number;

    /**
     * id of Group
     */
    group: number;

    /**
     * list of attribute names List&lt;String&gt;
     */
    attrNames: Array<string>;

    /**
     * flag to work with user attributes
     */
    workWithUserAttributes: boolean;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetMemberGroupAndUserAttributesByNamesPath, 'get');
    if (params) {

      rb.query('member', params.member);
      rb.query('group', params.group);
      rb.query('attrNames[]', params.attrNames);
      rb.query('workWithUserAttributes', params.workWithUserAttributes);

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
   * Get all attributes associated with the member in the group which have name in list attrNames (empty too).
   * If workWithUserAttribute is true, return also all user attributes in list of attrNames (with virtual attributes too).
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getMemberGroupAndUserAttributesByNames$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getMemberGroupAndUserAttributesByNames(params: {

    /**
     * id of Member
     */
    member: number;

    /**
     * id of Group
     */
    group: number;

    /**
     * list of attribute names List&lt;String&gt;
     */
    attrNames: Array<string>;

    /**
     * flag to work with user attributes
     */
    workWithUserAttributes: boolean;

  }): Observable<void> {

    return this.getMemberGroupAndUserAttributesByNames$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getMemberAndUserAttributesByNames
   */
  static readonly GetMemberAndUserAttributesByNamesPath = '/json/attributesManager/getAttributes/m-names-wu';

  /**
   * Get all attributes associated with the member which have name in list attrNames (empty too).
   * Virtual attributes too.
   * If workWithUserAttribute is true, return also all user attributes in list of attrNames (with virtual attributes too).
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getMemberAndUserAttributesByNames()` instead.
   *
   * This method doesn't expect any response body
   */
  getMemberAndUserAttributesByNames$Response(params: {

    /**
     * id of Member
     */
    member: number;

    /**
     * list of attribute names List&lt;String&gt;
     */
    attrNames: Array<string>;

    /**
     * flag to work with user attributes
     */
    workWithUserAttributes: boolean;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetMemberAndUserAttributesByNamesPath, 'get');
    if (params) {

      rb.query('member', params.member);
      rb.query('attrNames[]', params.attrNames);
      rb.query('workWithUserAttributes', params.workWithUserAttributes);

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
   * Get all attributes associated with the member which have name in list attrNames (empty too).
   * Virtual attributes too.
   * If workWithUserAttribute is true, return also all user attributes in list of attrNames (with virtual attributes too).
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getMemberAndUserAttributesByNames$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getMemberAndUserAttributesByNames(params: {

    /**
     * id of Member
     */
    member: number;

    /**
     * list of attribute names List&lt;String&gt;
     */
    attrNames: Array<string>;

    /**
     * flag to work with user attributes
     */
    workWithUserAttributes: boolean;

  }): Observable<void> {

    return this.getMemberAndUserAttributesByNames$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getMemberAndUserAttributes
   */
  static readonly GetMemberAndUserAttributesPath = '/json/attributesManager/getAttributes/m-wu';

  /**
   * Get all non-empty attributes associated with the member and if workWithUserAttributes is
   * true, get all non-empty attributes associated with user, who is this member.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getMemberAndUserAttributes()` instead.
   *
   * This method doesn't expect any response body
   */
  getMemberAndUserAttributes$Response(params: {

    /**
     * id of Member
     */
    member: number;

    /**
     * flag to work with user attributes
     */
    workWithUserAttributes: boolean;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetMemberAndUserAttributesPath, 'get');
    if (params) {

      rb.query('member', params.member);
      rb.query('workWithUserAttributes', params.workWithUserAttributes);

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
   * Get all non-empty attributes associated with the member and if workWithUserAttributes is
   * true, get all non-empty attributes associated with user, who is this member.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getMemberAndUserAttributes$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getMemberAndUserAttributes(params: {

    /**
     * id of Member
     */
    member: number;

    /**
     * flag to work with user attributes
     */
    workWithUserAttributes: boolean;

  }): Observable<void> {

    return this.getMemberAndUserAttributes$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getMemberGroupAttributesByNames
   */
  static readonly GetMemberGroupAttributesByNamesPath = '/json/attributesManager/getAttributes/m-g-names';

  /**
   * Get all attributes (empty and virtual too)associated with the member in the group which have name in list attrNames.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getMemberGroupAttributesByNames()` instead.
   *
   * This method doesn't expect any response body
   */
  getMemberGroupAttributesByNames$Response(params: {

    /**
     * id of Member
     */
    member: number;

    /**
     * id of Group
     */
    group: number;

    /**
     * list of attribute names List&lt;String&gt;
     */
    attrNames: Array<string>;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetMemberGroupAttributesByNamesPath, 'get');
    if (params) {

      rb.query('member', params.member);
      rb.query('group', params.group);
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
   * Get all attributes (empty and virtual too)associated with the member in the group which have name in list attrNames.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getMemberGroupAttributesByNames$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getMemberGroupAttributesByNames(params: {

    /**
     * id of Member
     */
    member: number;

    /**
     * id of Group
     */
    group: number;

    /**
     * list of attribute names List&lt;String&gt;
     */
    attrNames: Array<string>;

  }): Observable<void> {

    return this.getMemberGroupAttributesByNames$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getMemberAttributesByNames
   */
  static readonly GetMemberAttributesByNamesPath = '/json/attributesManager/getAttributes/m-names';

  /**
   * Get all attributes associated with the member which have name in list attrNames (empty too).
   * Virtual attribute too.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getMemberAttributesByNames()` instead.
   *
   * This method doesn't expect any response body
   */
  getMemberAttributesByNames$Response(params: {

    /**
     * id of Member
     */
    member: number;

    /**
     * list of attribute names List&lt;String&gt;
     */
    attrNames: Array<string>;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetMemberAttributesByNamesPath, 'get');
    if (params) {

      rb.query('member', params.member);
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
   * Get all attributes associated with the member which have name in list attrNames (empty too).
   * Virtual attribute too.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getMemberAttributesByNames$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getMemberAttributesByNames(params: {

    /**
     * id of Member
     */
    member: number;

    /**
     * list of attribute names List&lt;String&gt;
     */
    attrNames: Array<string>;

  }): Observable<void> {

    return this.getMemberAttributesByNames$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getMemberGroupAttributes
   */
  static readonly GetMemberGroupAttributesPath = '/json/attributesManager/getAttributes/m-g';

  /**
   * Get all non-empty attributes associated with the member in the group.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getMemberGroupAttributes()` instead.
   *
   * This method doesn't expect any response body
   */
  getMemberGroupAttributes$Response(params: {

    /**
     * id of Member
     */
    member: number;

    /**
     * id of Group
     */
    group: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetMemberGroupAttributesPath, 'get');
    if (params) {

      rb.query('member', params.member);
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
   * Get all non-empty attributes associated with the member in the group.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getMemberGroupAttributes$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getMemberGroupAttributes(params: {

    /**
     * id of Member
     */
    member: number;

    /**
     * id of Group
     */
    group: number;

  }): Observable<void> {

    return this.getMemberGroupAttributes$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getMemberAttributes
   */
  static readonly GetMemberAttributesPath = '/json/attributesManager/getAttributes/m';

  /**
   * Get all non-empty attributes associated with the member.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getMemberAttributes()` instead.
   *
   * This method doesn't expect any response body
   */
  getMemberAttributes$Response(params: {

    /**
     * id of Member
     */
    member: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetMemberAttributesPath, 'get');
    if (params) {

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
   * Get all non-empty attributes associated with the member.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getMemberAttributes$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getMemberAttributes(params: {

    /**
     * id of Member
     */
    member: number;

  }): Observable<void> {

    return this.getMemberAttributes$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getUserAttributesByNames
   */
  static readonly GetUserAttributesByNamesPath = '/json/attributesManager/getAttributes/u-names';

  /**
   * Get all attributes associated with the user which have name in list attrNames (empty too).
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getUserAttributesByNames()` instead.
   *
   * This method doesn't expect any response body
   */
  getUserAttributesByNames$Response(params: {

    /**
     * id of User
     */
    user: number;

    /**
     * list of attribute names List&lt;String&gt;
     */
    attrNames: Array<string>;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetUserAttributesByNamesPath, 'get');
    if (params) {

      rb.query('user', params.user);
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
   * Get all attributes associated with the user which have name in list attrNames (empty too).
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getUserAttributesByNames$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getUserAttributesByNames(params: {

    /**
     * id of User
     */
    user: number;

    /**
     * list of attribute names List&lt;String&gt;
     */
    attrNames: Array<string>;

  }): Observable<void> {

    return this.getUserAttributesByNames$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getUserAttributes
   */
  static readonly GetUserAttributesPath = '/json/attributesManager/getAttributes/u';

  /**
   * Get all non-empty attributes associated with the user.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getUserAttributes()` instead.
   *
   * This method doesn't expect any response body
   */
  getUserAttributes$Response(params: {

    /**
     * id of User
     */
    user: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetUserAttributesPath, 'get');
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
   * Get all non-empty attributes associated with the user.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getUserAttributes$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getUserAttributes(params: {

    /**
     * id of User
     */
    user: number;

  }): Observable<void> {

    return this.getUserAttributes$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getGroupAttributesByNames
   */
  static readonly GetGroupAttributesByNamesPath = '/json/attributesManager/getAttributes/g-names';

  /**
   * Get all attributes associated with the group which have name in list attrNames (empty too).
   * Virtual attribute too.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getGroupAttributesByNames()` instead.
   *
   * This method doesn't expect any response body
   */
  getGroupAttributesByNames$Response(params: {

    /**
     * id of Group
     */
    group: number;

    /**
     * list of attribute names List&lt;String&gt;
     */
    attrNames: Array<string>;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetGroupAttributesByNamesPath, 'get');
    if (params) {

      rb.query('group', params.group);
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
   * Get all attributes associated with the group which have name in list attrNames (empty too).
   * Virtual attribute too.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getGroupAttributesByNames$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getGroupAttributesByNames(params: {

    /**
     * id of Group
     */
    group: number;

    /**
     * list of attribute names List&lt;String&gt;
     */
    attrNames: Array<string>;

  }): Observable<void> {

    return this.getGroupAttributesByNames$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getGroupAttributes
   */
  static readonly GetGroupAttributesPath = '/json/attributesManager/getAttributes/g';

  /**
   * Get all non-empty attributes associated with the group.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getGroupAttributes()` instead.
   *
   * This method doesn't expect any response body
   */
  getGroupAttributes$Response(params: {

    /**
     * id of Group
     */
    group: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetGroupAttributesPath, 'get');
    if (params) {

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
   * Get all non-empty attributes associated with the group.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getGroupAttributes$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getGroupAttributes(params: {

    /**
     * id of Group
     */
    group: number;

  }): Observable<void> {

    return this.getGroupAttributes$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getHostAttributes
   */
  static readonly GetHostAttributesPath = '/json/attributesManager/getAttributes/h';

  /**
   * Get all non-empty attributes associated with the host.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getHostAttributes()` instead.
   *
   * This method doesn't expect any response body
   */
  getHostAttributes$Response(params: {

    /**
     * id of Host
     */
    host: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetHostAttributesPath, 'get');
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
   * Get all non-empty attributes associated with the host.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getHostAttributes$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getHostAttributes(params: {

    /**
     * id of Host
     */
    host: number;

  }): Observable<void> {

    return this.getHostAttributes$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getEntitylessAttributesByKey
   */
  static readonly GetEntitylessAttributesByKeyPath = '/json/attributesManager/getAttributes/key';

  /**
   * Get all entityless attributes with subject equaled String key.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getEntitylessAttributesByKey()` instead.
   *
   * This method doesn't expect any response body
   */
  getEntitylessAttributesByKey$Response(params: {

    /**
     * key for entityless attributes
     */
    key: string;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetEntitylessAttributesByKeyPath, 'get');
    if (params) {

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
   * Get all entityless attributes with subject equaled String key.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getEntitylessAttributesByKey$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getEntitylessAttributesByKey(params: {

    /**
     * key for entityless attributes
     */
    key: string;

  }): Observable<void> {

    return this.getEntitylessAttributesByKey$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getUserExtSourceAttributesByNames
   */
  static readonly GetUserExtSourceAttributesByNamesPath = '/json/attributesManager/getAttributes/ues-names';

  /**
   * Get all attributes associated with the userExtSource which have name in list attrNames (empty too).
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getUserExtSourceAttributesByNames()` instead.
   *
   * This method doesn't expect any response body
   */
  getUserExtSourceAttributesByNames$Response(params: {

    /**
     * id of UserExtSource
     */
    userExtSource: number;

    /**
     * list of attribute names List&lt;String&gt;
     */
    attrNames: Array<string>;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetUserExtSourceAttributesByNamesPath, 'get');
    if (params) {

      rb.query('userExtSource', params.userExtSource);
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
   * Get all attributes associated with the userExtSource which have name in list attrNames (empty too).
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getUserExtSourceAttributesByNames$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getUserExtSourceAttributesByNames(params: {

    /**
     * id of UserExtSource
     */
    userExtSource: number;

    /**
     * list of attribute names List&lt;String&gt;
     */
    attrNames: Array<string>;

  }): Observable<void> {

    return this.getUserExtSourceAttributesByNames$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getUserExtSourceAttributes
   */
  static readonly GetUserExtSourceAttributesPath = '/json/attributesManager/getAttributes/ues';

  /**
   * Get all non-empty attributes associated with the UserExtSource.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getUserExtSourceAttributes()` instead.
   *
   * This method doesn't expect any response body
   */
  getUserExtSourceAttributes$Response(params: {

    /**
     * id of UserExtSource
     */
    userExtSource: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetUserExtSourceAttributesPath, 'get');
    if (params) {

      rb.query('userExtSource', params.userExtSource);

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
   * Get all non-empty attributes associated with the UserExtSource.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getUserExtSourceAttributes$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getUserExtSourceAttributes(params: {

    /**
     * id of UserExtSource
     */
    userExtSource: number;

  }): Observable<void> {

    return this.getUserExtSourceAttributes$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getEntitylessAttributesByName
   */
  static readonly GetEntitylessAttributesByNamePath = '/json/attributesManager/getEntitylessAttributes';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getEntitylessAttributesByName()` instead.
   *
   * This method doesn't expect any response body
   */
  getEntitylessAttributesByName$Response(params: {

    /**
     * full name of attribute definition (namespace + &#x27;:&#x27; + friendlyName)
     */
    attrName: string;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetEntitylessAttributesByNamePath, 'get');
    if (params) {

      rb.query('attrName', params.attrName);

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
   * To access the full response (for headers, for example), `getEntitylessAttributesByName$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getEntitylessAttributesByName(params: {

    /**
     * full name of attribute definition (namespace + &#x27;:&#x27; + friendlyName)
     */
    attrName: string;

  }): Observable<void> {

    return this.getEntitylessAttributesByName$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getEntitylessKeys
   */
  static readonly GetEntitylessKeysPath = '/json/attributesManager/getEntitylessKeys';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getEntitylessKeys()` instead.
   *
   * This method doesn't expect any response body
   */
  getEntitylessKeys$Response(params: {

    /**
     * id of AttributeDefinition
     */
    attributeDefinition: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetEntitylessKeysPath, 'get');
    if (params) {

      rb.query('attributeDefinition', params.attributeDefinition);

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
   * To access the full response (for headers, for example), `getEntitylessKeys$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getEntitylessKeys(params: {

    /**
     * id of AttributeDefinition
     */
    attributeDefinition: number;

  }): Observable<void> {

    return this.getEntitylessKeys$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation setFacilityResourceGroupUserMemberAttributes
   */
  static readonly SetFacilityResourceGroupUserMemberAttributesPath = '/json/attributesManager/setAttributes/f-r-g-u-m';

  /**
   * Store the member, user, member-group, member-resource and user-facility attributes.
   * If an attribute is core attribute then the attribute isn't stored (It's skipped without any notification).
   * Group and group-resource attributes are not supported in this context.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setFacilityResourceGroupUserMemberAttributes()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setFacilityResourceGroupUserMemberAttributes$Response(params: {

    body: { 'facility': number, 'resource': number, 'group': number, 'user': number, 'member': number, 'attributes': Array<Attribute> }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.SetFacilityResourceGroupUserMemberAttributesPath, 'post');
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
   * Store the member, user, member-group, member-resource and user-facility attributes.
   * If an attribute is core attribute then the attribute isn't stored (It's skipped without any notification).
   * Group and group-resource attributes are not supported in this context.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `setFacilityResourceGroupUserMemberAttributes$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setFacilityResourceGroupUserMemberAttributes(params: {

    body: { 'facility': number, 'resource': number, 'group': number, 'user': number, 'member': number, 'attributes': Array<Attribute> }
  }): Observable<void> {

    return this.setFacilityResourceGroupUserMemberAttributes$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation setFacilityResourceUserMemberAttributes
   */
  static readonly SetFacilityResourceUserMemberAttributesPath = '/json/attributesManager/setAttributes/f-r-u-m';

  /**
   * Store the member, user, member-resource and user-facility attributes.
   * If an attribute is core attribute then the attribute isn't stored (It's skipped without any notification).
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setFacilityResourceUserMemberAttributes()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setFacilityResourceUserMemberAttributes$Response(params: {

    body: { 'facility': number, 'resource': number, 'user': number, 'member': number, 'attributes': Array<Attribute> }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.SetFacilityResourceUserMemberAttributesPath, 'post');
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
   * Store the member, user, member-resource and user-facility attributes.
   * If an attribute is core attribute then the attribute isn't stored (It's skipped without any notification).
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `setFacilityResourceUserMemberAttributes$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setFacilityResourceUserMemberAttributes(params: {

    body: { 'facility': number, 'resource': number, 'user': number, 'member': number, 'attributes': Array<Attribute> }
  }): Observable<void> {

    return this.setFacilityResourceUserMemberAttributes$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation setFacilityUserAttributes
   */
  static readonly SetFacilityUserAttributesPath = '/json/attributesManager/setAttributes/f-u';

  /**
   * Store the attributes associated with the facility and user combination.
   * If an attribute is core attribute then the attribute isn't stored (It's skipped without any notification).
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setFacilityUserAttributes()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setFacilityUserAttributes$Response(params: {

    body: { 'facility': number, 'user': number, 'attributes': Array<Attribute> }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.SetFacilityUserAttributesPath, 'post');
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
   * Store the attributes associated with the facility and user combination.
   * If an attribute is core attribute then the attribute isn't stored (It's skipped without any notification).
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `setFacilityUserAttributes$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setFacilityUserAttributes(params: {

    body: { 'facility': number, 'user': number, 'attributes': Array<Attribute> }
  }): Observable<void> {

    return this.setFacilityUserAttributes$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation setFacilityAttributes
   */
  static readonly SetFacilityAttributesPath = '/json/attributesManager/setAttributes/f';

  /**
   * Store the attributes associated with the facility.
   * If an attribute is core attribute then the attribute isn't stored (It's skipped without any notification).
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setFacilityAttributes()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setFacilityAttributes$Response(params: {

    body: { 'facility': number, 'attributes': Array<Attribute> }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.SetFacilityAttributesPath, 'post');
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
   * Store the attributes associated with the facility.
   * If an attribute is core attribute then the attribute isn't stored (It's skipped without any notification).
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `setFacilityAttributes$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setFacilityAttributes(params: {

    body: { 'facility': number, 'attributes': Array<Attribute> }
  }): Observable<void> {

    return this.setFacilityAttributes$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation setVoAttributes
   */
  static readonly SetVoAttributesPath = '/json/attributesManager/setAttributes/vo';

  /**
   * Store the attributes associated with the vo.
   * If an attribute is core attribute then the attribute isn't stored (It's skipped without any notification).
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setVoAttributes()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setVoAttributes$Response(params: {

    body: { 'vo': number, 'attributes': Array<Attribute> }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.SetVoAttributesPath, 'post');
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
   * Store the attributes associated with the vo.
   * If an attribute is core attribute then the attribute isn't stored (It's skipped without any notification).
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `setVoAttributes$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setVoAttributes(params: {

    body: { 'vo': number, 'attributes': Array<Attribute> }
  }): Observable<void> {

    return this.setVoAttributes$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation setMemberResourceAndUserAttributes
   */
  static readonly SetMemberResourceAndUserAttributesPath = '/json/attributesManager/setAttributes/m-r-wu';

  /**
   * Store the attributes associated with the resource and member combination.
   * If an attribute is core attribute then the attribute isn't stored (It's skipped without any notification).
   * If workWithUserAttributes is true, the method stores also the attributes associated with user, user-facility and member.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setMemberResourceAndUserAttributes()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setMemberResourceAndUserAttributes$Response(params: {

    body: { 'member': number, 'resource': number, 'attributes': Array<Attribute>, 'workWithUserAttributes': boolean }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.SetMemberResourceAndUserAttributesPath, 'post');
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
   * Store the attributes associated with the resource and member combination.
   * If an attribute is core attribute then the attribute isn't stored (It's skipped without any notification).
   * If workWithUserAttributes is true, the method stores also the attributes associated with user, user-facility and member.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `setMemberResourceAndUserAttributes$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setMemberResourceAndUserAttributes(params: {

    body: { 'member': number, 'resource': number, 'attributes': Array<Attribute>, 'workWithUserAttributes': boolean }
  }): Observable<void> {

    return this.setMemberResourceAndUserAttributes$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation setMemberResourceAttributes
   */
  static readonly SetMemberResourceAttributesPath = '/json/attributesManager/setAttributes/m-r';

  /**
   * Store the attributes associated with the resource and member combination.
   * If an attribute is core attribute then the attribute isn't stored (It's skipped without any notification).
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setMemberResourceAttributes()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setMemberResourceAttributes$Response(params: {

    body: { 'member': number, 'resource': number, 'attributes': Array<Attribute> }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.SetMemberResourceAttributesPath, 'post');
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
   * Store the attributes associated with the resource and member combination.
   * If an attribute is core attribute then the attribute isn't stored (It's skipped without any notification).
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `setMemberResourceAttributes$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setMemberResourceAttributes(params: {

    body: { 'member': number, 'resource': number, 'attributes': Array<Attribute> }
  }): Observable<void> {

    return this.setMemberResourceAttributes$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation setResourceGroupWithGroupAttributes
   */
  static readonly SetResourceGroupWithGroupAttributesPath = '/json/attributesManager/setAttributes/r-g-wg';

  /**
   * Store the attributes associated with group and resource, if workWithUserAttributes is true then also from group itself.
   * If an attribute is core attribute then the attribute isn't stored (It's skipped without any notification).
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setResourceGroupWithGroupAttributes()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setResourceGroupWithGroupAttributes$Response(params: {

    body: { 'resource': number, 'group': number, 'attributes': Array<Attribute>, 'workWithGroupAttributes': boolean }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.SetResourceGroupWithGroupAttributesPath, 'post');
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
   * Store the attributes associated with group and resource, if workWithUserAttributes is true then also from group itself.
   * If an attribute is core attribute then the attribute isn't stored (It's skipped without any notification).
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `setResourceGroupWithGroupAttributes$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setResourceGroupWithGroupAttributes(params: {

    body: { 'resource': number, 'group': number, 'attributes': Array<Attribute>, 'workWithGroupAttributes': boolean }
  }): Observable<void> {

    return this.setResourceGroupWithGroupAttributes$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation setResourceGroupAttributes
   */
  static readonly SetResourceGroupAttributesPath = '/json/attributesManager/setAttributes/r-g';

  /**
   * Store the attributes associated with the group on resource.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setResourceGroupAttributes()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setResourceGroupAttributes$Response(params: {

    body: { 'resource': number, 'group': number, 'attributes': Array<Attribute> }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.SetResourceGroupAttributesPath, 'post');
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
   * Store the attributes associated with the group on resource.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `setResourceGroupAttributes$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setResourceGroupAttributes(params: {

    body: { 'resource': number, 'group': number, 'attributes': Array<Attribute> }
  }): Observable<void> {

    return this.setResourceGroupAttributes$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation setResourceAttributes
   */
  static readonly SetResourceAttributesPath = '/json/attributesManager/setAttributes/r';

  /**
   * Store the attributes associated with the resource.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setResourceAttributes()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setResourceAttributes$Response(params: {

    body: { 'resource': number, 'attributes': Array<Attribute> }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.SetResourceAttributesPath, 'post');
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
   * Store the attributes associated with the resource.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `setResourceAttributes$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setResourceAttributes(params: {

    body: { 'resource': number, 'attributes': Array<Attribute> }
  }): Observable<void> {

    return this.setResourceAttributes$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation setMemberGroupWithUserAttributes
   */
  static readonly SetMemberGroupWithUserAttributesPath = '/json/attributesManager/setAttributes/m-g-wu';

  /**
   * Store the attributes associated with the member and group combination.
   * If an attribute is core attribute then the attribute isn't stored (It's skipped without any notification).
   * If workWithUserAttributes is true, the method stores also the attributes associated with user and member.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setMemberGroupWithUserAttributes()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setMemberGroupWithUserAttributes$Response(params: {

    body: { 'member': number, 'group': number, 'attributes': Array<Attribute>, 'workWithUserAttributes': boolean }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.SetMemberGroupWithUserAttributesPath, 'post');
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
   * Store the attributes associated with the member and group combination.
   * If an attribute is core attribute then the attribute isn't stored (It's skipped without any notification).
   * If workWithUserAttributes is true, the method stores also the attributes associated with user and member.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `setMemberGroupWithUserAttributes$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setMemberGroupWithUserAttributes(params: {

    body: { 'member': number, 'group': number, 'attributes': Array<Attribute>, 'workWithUserAttributes': boolean }
  }): Observable<void> {

    return this.setMemberGroupWithUserAttributes$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation setMemberWithUserAttributes
   */
  static readonly SetMemberWithUserAttributesPath = '/json/attributesManager/setAttributes/m-wu';

  /**
   * Store the attributes associated with member and user (which we get from this member) if workWithUserAttributes is true.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setMemberWithUserAttributes()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setMemberWithUserAttributes$Response(params: {

    body: { 'member': number, 'attributes': Array<Attribute>, 'workWithUserAttributes': boolean }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.SetMemberWithUserAttributesPath, 'post');
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
   * Store the attributes associated with member and user (which we get from this member) if workWithUserAttributes is true.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `setMemberWithUserAttributes$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setMemberWithUserAttributes(params: {

    body: { 'member': number, 'attributes': Array<Attribute>, 'workWithUserAttributes': boolean }
  }): Observable<void> {

    return this.setMemberWithUserAttributes$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation setMemberGroupAttributes
   */
  static readonly SetMemberGroupAttributesPath = '/json/attributesManager/setAttributes/m-g';

  /**
   * Store the attributes associated with the member and group combination.
   * If an attribute is core attribute then the attribute isn't stored (It's skipped without any notification).
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setMemberGroupAttributes()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setMemberGroupAttributes$Response(params: {

    body: { 'member': number, 'group': number, 'attributes': Array<Attribute> }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.SetMemberGroupAttributesPath, 'post');
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
   * Store the attributes associated with the member and group combination.
   * If an attribute is core attribute then the attribute isn't stored (It's skipped without any notification).
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `setMemberGroupAttributes$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setMemberGroupAttributes(params: {

    body: { 'member': number, 'group': number, 'attributes': Array<Attribute> }
  }): Observable<void> {

    return this.setMemberGroupAttributes$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation setMemberAttributes
   */
  static readonly SetMemberAttributesPath = '/json/attributesManager/setAttributes/m';

  /**
   * Store the attributes associated with the member.
   * If an attribute is core attribute then the attribute isn't stored (It's skipped without any notification).
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setMemberAttributes()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setMemberAttributes$Response(params: {

    body: { 'member': number, 'attributes': Array<Attribute> }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.SetMemberAttributesPath, 'post');
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
   * Store the attributes associated with the member.
   * If an attribute is core attribute then the attribute isn't stored (It's skipped without any notification).
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `setMemberAttributes$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setMemberAttributes(params: {

    body: { 'member': number, 'attributes': Array<Attribute> }
  }): Observable<void> {

    return this.setMemberAttributes$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation setUserAttributes
   */
  static readonly SetUserAttributesPath = '/json/attributesManager/setAttributes/u';

  /**
   * Store the attributes associated with the user.
   * If an attribute is core attribute then the attribute isn't stored (It's skipped without any notification).
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setUserAttributes()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setUserAttributes$Response(params: {

    body: { 'user': number, 'attributes': Array<Attribute> }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.SetUserAttributesPath, 'post');
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
   * Store the attributes associated with the user.
   * If an attribute is core attribute then the attribute isn't stored (It's skipped without any notification).
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `setUserAttributes$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setUserAttributes(params: {

    body: { 'user': number, 'attributes': Array<Attribute> }
  }): Observable<void> {

    return this.setUserAttributes$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation setGroupAttributes
   */
  static readonly SetGroupAttributesPath = '/json/attributesManager/setAttributes/g';

  /**
   * Store the attributes associated with the group.
   * If an attribute is core attribute then the attribute isn't stored (It's skipped without any notification).
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setGroupAttributes()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setGroupAttributes$Response(params: {

    body: { 'group': number, 'attributes': Array<Attribute> }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.SetGroupAttributesPath, 'post');
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
   * Store the attributes associated with the group.
   * If an attribute is core attribute then the attribute isn't stored (It's skipped without any notification).
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `setGroupAttributes$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setGroupAttributes(params: {

    body: { 'group': number, 'attributes': Array<Attribute> }
  }): Observable<void> {

    return this.setGroupAttributes$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation setHostAttributes
   */
  static readonly SetHostAttributesPath = '/json/attributesManager/setAttributes/h';

  /**
   * Store the attributes associated with the host.
   * If an attribute is core attribute then the attribute isn't stored (It's skipped without any notification).
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setHostAttributes()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setHostAttributes$Response(params: {

    body: { 'host': number, 'attributes': Array<Attribute> }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.SetHostAttributesPath, 'post');
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
   * Store the attributes associated with the host.
   * If an attribute is core attribute then the attribute isn't stored (It's skipped without any notification).
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `setHostAttributes$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setHostAttributes(params: {

    body: { 'host': number, 'attributes': Array<Attribute> }
  }): Observable<void> {

    return this.setHostAttributes$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation setUserExtSourceAttributes
   */
  static readonly SetUserExtSourceAttributesPath = '/json/attributesManager/setAttributes/ues';

  /**
   * Store the attributes associated with the UserExtSource.
   * If an attribute is core attribute then the attribute isn't stored (It's skipped without any notification).
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setUserExtSourceAttributes()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setUserExtSourceAttributes$Response(params: {

    body: { 'userExtSource': number, 'attributes': Array<Attribute> }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.SetUserExtSourceAttributesPath, 'post');
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
   * Store the attributes associated with the UserExtSource.
   * If an attribute is core attribute then the attribute isn't stored (It's skipped without any notification).
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `setUserExtSourceAttributes$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setUserExtSourceAttributes(params: {

    body: { 'userExtSource': number, 'attributes': Array<Attribute> }
  }): Observable<void> {

    return this.setUserExtSourceAttributes$Response(params).pipe(
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
   * Path part for operation getAttributeDefinitionByName
   */
  static readonly GetAttributeDefinitionByNamePath = '/json/attributesManager/getAttributeDefinition';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAttributeDefinitionByName()` instead.
   *
   * This method doesn't expect any response body
   */
  getAttributeDefinitionByName$Response(params: {

    /**
     * full name of attribute definition (namespace + &#x27;:&#x27; + friendlyName)
     */
    attributeName: string;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetAttributeDefinitionByNamePath, 'get');
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
   * To access the full response (for headers, for example), `getAttributeDefinitionByName$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getAttributeDefinitionByName(params: {

    /**
     * full name of attribute definition (namespace + &#x27;:&#x27; + friendlyName)
     */
    attributeName: string;

  }): Observable<void> {

    return this.getAttributeDefinitionByName$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getAllAttributeDefinitions
   */
  static readonly GetAllAttributeDefinitionsPath = '/json/attributesManager/getAttributesDefinition';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllAttributeDefinitions()` instead.
   *
   * This method doesn't expect any response body
   */
  getAllAttributeDefinitions$Response(params?: {

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetAllAttributeDefinitionsPath, 'get');
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
   * To access the full response (for headers, for example), `getAllAttributeDefinitions$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getAllAttributeDefinitions(params?: {

  }): Observable<void> {

    return this.getAllAttributeDefinitions$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getAttributeDefinitionById
   */
  static readonly GetAttributeDefinitionByIdPath = '/json/attributesManager/getAttributeDefinitionById';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAttributeDefinitionById()` instead.
   *
   * This method doesn't expect any response body
   */
  getAttributeDefinitionById$Response(params: {

    /**
     * numeric id
     */
    id: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetAttributeDefinitionByIdPath, 'get');
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
   * To access the full response (for headers, for example), `getAttributeDefinitionById$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getAttributeDefinitionById(params: {

    /**
     * numeric id
     */
    id: number;

  }): Observable<void> {

    return this.getAttributeDefinitionById$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getAttributeDefinitionsByNamespace
   */
  static readonly GetAttributeDefinitionsByNamespacePath = '/json/attributesManager/getAttributesDefinitionByNamespace';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAttributeDefinitionsByNamespace()` instead.
   *
   * This method doesn't expect any response body
   */
  getAttributeDefinitionsByNamespace$Response(params?: {

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.GetAttributeDefinitionsByNamespacePath, 'get');
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
   * To access the full response (for headers, for example), `getAttributeDefinitionsByNamespace$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getAttributeDefinitionsByNamespace(params?: {

  }): Observable<void> {

    return this.getAttributeDefinitionsByNamespace$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation setFacilityAttribute
   */
  static readonly SetFacilityAttributePath = '/json/attributesManager/setAttribute/facility';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setFacilityAttribute()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setFacilityAttribute$Response(params: {

    body: { 'facility': number, 'attribute': Attribute }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.SetFacilityAttributePath, 'post');
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
   * To access the full response (for headers, for example), `setFacilityAttribute$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setFacilityAttribute(params: {

    body: { 'facility': number, 'attribute': Attribute }
  }): Observable<void> {

    return this.setFacilityAttribute$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation setUserAttribute
   */
  static readonly SetUserAttributePath = '/json/attributesManager/setAttribute/user';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setUserAttribute()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setUserAttribute$Response(params: {

    body: { 'user': number, 'attribute': Attribute }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.SetUserAttributePath, 'post');
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
   * To access the full response (for headers, for example), `setUserAttribute$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setUserAttribute(params: {

    body: { 'user': number, 'attribute': Attribute }
  }): Observable<void> {

    return this.setUserAttribute$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation setUserFacilityAttribute
   */
  static readonly SetUserFacilityAttributePath = '/json/attributesManager/setAttribute/facility-user';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setUserFacilityAttribute()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setUserFacilityAttribute$Response(params: {

    body: { 'user': number, 'facility': number, 'attribute': Attribute }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.SetUserFacilityAttributePath, 'post');
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
   * To access the full response (for headers, for example), `setUserFacilityAttribute$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setUserFacilityAttribute(params: {

    body: { 'user': number, 'facility': number, 'attribute': Attribute }
  }): Observable<void> {

    return this.setUserFacilityAttribute$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation setVoAttribute
   */
  static readonly SetVoAttributePath = '/json/attributesManager/setAttribute/vo';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setVoAttribute()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setVoAttribute$Response(params: {

    body: { 'vo': number, 'attribute': Attribute }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.SetVoAttributePath, 'post');
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
   * To access the full response (for headers, for example), `setVoAttribute$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setVoAttribute(params: {

    body: { 'vo': number, 'attribute': Attribute }
  }): Observable<void> {

    return this.setVoAttribute$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation setMemberAttribute
   */
  static readonly SetMemberAttributePath = '/json/attributesManager/setAttribute/member';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setMemberAttribute()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setMemberAttribute$Response(params: {

    body: { 'member': number, 'attribute': Attribute }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.SetMemberAttributePath, 'post');
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
   * To access the full response (for headers, for example), `setMemberAttribute$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setMemberAttribute(params: {

    body: { 'member': number, 'attribute': Attribute }
  }): Observable<void> {

    return this.setMemberAttribute$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation setGroupAttribute
   */
  static readonly SetGroupAttributePath = '/json/attributesManager/setAttribute/group';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setGroupAttribute()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setGroupAttribute$Response(params: {

    body: { 'group': number, 'attribute': Attribute }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.SetGroupAttributePath, 'post');
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
   * To access the full response (for headers, for example), `setGroupAttribute$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setGroupAttribute(params: {

    body: { 'group': number, 'attribute': Attribute }
  }): Observable<void> {

    return this.setGroupAttribute$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation setResourceAttribute
   */
  static readonly SetResourceAttributePath = '/json/attributesManager/setAttribute/resource';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setResourceAttribute()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setResourceAttribute$Response(params: {

    body: { 'resource': number, 'attribute': Attribute }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.SetResourceAttributePath, 'post');
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
   * To access the full response (for headers, for example), `setResourceAttribute$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setResourceAttribute(params: {

    body: { 'resource': number, 'attribute': Attribute }
  }): Observable<void> {

    return this.setResourceAttribute$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation setMemberGroupAttribute
   */
  static readonly SetMemberGroupAttributePath = '/json/attributesManager/setAttribute/member-group';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setMemberGroupAttribute()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setMemberGroupAttribute$Response(params: {

    body: { 'member': number, 'group': number, 'attribute': Attribute }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.SetMemberGroupAttributePath, 'post');
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
   * To access the full response (for headers, for example), `setMemberGroupAttribute$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setMemberGroupAttribute(params: {

    body: { 'member': number, 'group': number, 'attribute': Attribute }
  }): Observable<void> {

    return this.setMemberGroupAttribute$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation setMemberResourceAttribute
   */
  static readonly SetMemberResourceAttributePath = '/json/attributesManager/setAttribute/member-resource';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setMemberResourceAttribute()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setMemberResourceAttribute$Response(params: {

    body: { 'member': number, 'resource': number, 'attribute': Attribute }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.SetMemberResourceAttributePath, 'post');
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
   * To access the full response (for headers, for example), `setMemberResourceAttribute$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setMemberResourceAttribute(params: {

    body: { 'member': number, 'resource': number, 'attribute': Attribute }
  }): Observable<void> {

    return this.setMemberResourceAttribute$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation setGroupResourceAttribute
   */
  static readonly SetGroupResourceAttributePath = '/json/attributesManager/setAttribute/group-resource';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setGroupResourceAttribute()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setGroupResourceAttribute$Response(params: {

    body: { 'group': number, 'resource': number, 'attribute': Attribute }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.SetGroupResourceAttributePath, 'post');
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
   * To access the full response (for headers, for example), `setGroupResourceAttribute$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setGroupResourceAttribute(params: {

    body: { 'group': number, 'resource': number, 'attribute': Attribute }
  }): Observable<void> {

    return this.setGroupResourceAttribute$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation setUserExtSourceAttribute
   */
  static readonly SetUserExtSourceAttributePath = '/json/attributesManager/setAttribute/userExtSource';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setUserExtSourceAttribute()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setUserExtSourceAttribute$Response(params: {

    body: { 'userExtSource': number, 'attribute': Attribute }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.SetUserExtSourceAttributePath, 'post');
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
   * To access the full response (for headers, for example), `setUserExtSourceAttribute$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setUserExtSourceAttribute(params: {

    body: { 'userExtSource': number, 'attribute': Attribute }
  }): Observable<void> {

    return this.setUserExtSourceAttribute$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation setHostAttribute
   */
  static readonly SetHostAttributePath = '/json/attributesManager/setAttribute/host';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setHostAttribute()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setHostAttribute$Response(params: {

    body: { 'host': number, 'attribute': Attribute }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.SetHostAttributePath, 'post');
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
   * To access the full response (for headers, for example), `setHostAttribute$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setHostAttribute(params: {

    body: { 'host': number, 'attribute': Attribute }
  }): Observable<void> {

    return this.setHostAttribute$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation setEntitylessAttribute
   */
  static readonly SetEntitylessAttributePath = '/json/attributesManager/setAttribute/entityless';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setEntitylessAttribute()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setEntitylessAttribute$Response(params: {

    body: { 'key': string, 'attribute': Attribute }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.SetEntitylessAttributePath, 'post');
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
   * To access the full response (for headers, for example), `setEntitylessAttribute$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  setEntitylessAttribute(params: {

    body: { 'key': string, 'attribute': Attribute }
  }): Observable<void> {

    return this.setEntitylessAttribute$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation createAttributeDefinition
   */
  static readonly CreateAttributeDefinitionPath = '/json/attributesManager/createAttribute';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createAttributeDefinition()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  createAttributeDefinition$Response(params: {

    body: { 'attribute': AttributeDefinition }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.CreateAttributeDefinitionPath, 'post');
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
   * To access the full response (for headers, for example), `createAttributeDefinition$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  createAttributeDefinition(params: {

    body: { 'attribute': AttributeDefinition }
  }): Observable<void> {

    return this.createAttributeDefinition$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation deleteAttributeDefinition
   */
  static readonly DeleteAttributeDefinitionPath = '/urlinjsonout/attributesManager/deleteAttribute';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteAttributeDefinition()` instead.
   *
   * This method doesn't expect any response body
   */
  deleteAttributeDefinition$Response(params: {

    /**
     * id of AttributeDefinition
     */
    attribute: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.DeleteAttributeDefinitionPath, 'post');
    if (params) {

      rb.query('attribute', params.attribute);

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
   * To access the full response (for headers, for example), `deleteAttributeDefinition$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  deleteAttributeDefinition(params: {

    /**
     * id of AttributeDefinition
     */
    attribute: number;

  }): Observable<void> {

    return this.deleteAttributeDefinition$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation deleteAttributeDefinitions
   */
  static readonly DeleteAttributeDefinitionsPath = '/urlinjsonout/attributesManager/deleteAttributes';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteAttributeDefinitions()` instead.
   *
   * This method doesn't expect any response body
   */
  deleteAttributeDefinitions$Response(params: {

    /**
     * list of attribute ids List&lt;Integer&gt;
     */
    attributes: Array<number>;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AttributesManagerService.DeleteAttributeDefinitionsPath, 'post');
    if (params) {

      rb.query('attributes[]', params.attributes);

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
   * To access the full response (for headers, for example), `deleteAttributeDefinitions$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  deleteAttributeDefinitions(params: {

    /**
     * list of attribute ids List&lt;Integer&gt;
     */
    attributes: Array<number>;

  }): Observable<void> {

    return this.deleteAttributeDefinitions$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}
