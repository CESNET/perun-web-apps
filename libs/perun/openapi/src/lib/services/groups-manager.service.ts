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
 * GroupsManager RPC API in Perun
 */
@Injectable({
  providedIn: 'root',
})
export class GroupsManagerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getGroupById
   */
  static readonly GetGroupByIdPath = '/json/groupsManager/getGroupById';

  /**
   * Throws GroupNotExistsException when the group doesn't exist.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getGroupById()` instead.
   *
   * This method doesn't expect any response body
   */
  getGroupById$Response(params: {

    /**
     * numeric id
     */
    id: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, GroupsManagerService.GetGroupByIdPath, 'get');
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
   * Throws GroupNotExistsException when the group doesn't exist.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getGroupById$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getGroupById(params: {

    /**
     * numeric id
     */
    id: number;

  }): Observable<void> {

    return this.getGroupById$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation isGroupMember
   */
  static readonly IsGroupMemberPath = '/json/groupsManager/isGroupMember';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `isGroupMember()` instead.
   *
   * This method doesn't expect any response body
   */
  isGroupMember$Response(params: {

    /**
     * id of Member
     */
    member: number;

    /**
     * id of Group
     */
    group: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, GroupsManagerService.IsGroupMemberPath, 'get');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `isGroupMember$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  isGroupMember(params: {

    /**
     * id of Member
     */
    member: number;

    /**
     * id of Group
     */
    group: number;

  }): Observable<void> {

    return this.isGroupMember$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getMemberGroups
   */
  static readonly GetMemberGroupsPath = '/json/groupsManager/getMemberGroups';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getMemberGroups()` instead.
   *
   * This method doesn't expect any response body
   */
  getMemberGroups$Response(params: {

    /**
     * id of Member
     */
    member: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, GroupsManagerService.GetMemberGroupsPath, 'get');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getMemberGroups$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getMemberGroups(params: {

    /**
     * id of Member
     */
    member: number;

  }): Observable<void> {

    return this.getMemberGroups$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}
