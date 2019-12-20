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
 * MembersManager RPC API in Perun
 */
@Injectable({
  providedIn: 'root',
})
export class MembersManagerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getMemberById
   */
  static readonly GetMemberByIdPath = '/json/membersManager/getMemberById';

  /**
   * Gets Member
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getMemberById()` instead.
   *
   * This method doesn't expect any response body
   */
  getMemberById$Response(params: {

    /**
     * numeric id
     */
    id: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, MembersManagerService.GetMemberByIdPath, 'get');
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
   * Gets Member
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getMemberById$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getMemberById(params: {

    /**
     * numeric id
     */
    id: number;

  }): Observable<void> {

    return this.getMemberById$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getRichMember
   */
  static readonly GetRichMemberPath = '/json/membersManager/getRichMember';

  /**
   * Get RichMember without attributes
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getRichMember()` instead.
   *
   * This method doesn't expect any response body
   */
  getRichMember$Response(params: {

    /**
     * numeric id
     */
    id: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, MembersManagerService.GetRichMemberPath, 'get');
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
   * Get RichMember without attributes
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getRichMember$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getRichMember(params: {

    /**
     * numeric id
     */
    id: number;

  }): Observable<void> {

    return this.getRichMember$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getRichMemberWithAttributes
   */
  static readonly GetRichMemberWithAttributesPath = '/json/membersManager/getRichMemberWithAttributes';

  /**
   * Get richMember with member/user attributes
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getRichMemberWithAttributes()` instead.
   *
   * This method doesn't expect any response body
   */
  getRichMemberWithAttributes$Response(params: {

    /**
     * numeric id
     */
    id: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, MembersManagerService.GetRichMemberWithAttributesPath, 'get');
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
   * Get richMember with member/user attributes
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getRichMemberWithAttributes$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getRichMemberWithAttributes(params: {

    /**
     * numeric id
     */
    id: number;

  }): Observable<void> {

    return this.getRichMemberWithAttributes$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getMemberByUser
   */
  static readonly GetMemberByUserPath = '/json/membersManager/getMemberByUser';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getMemberByUser()` instead.
   *
   * This method doesn't expect any response body
   */
  getMemberByUser$Response(params: {

    /**
     * id of Vo
     */
    vo: number;

    /**
     * id of User
     */
    user: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, MembersManagerService.GetMemberByUserPath, 'get');
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
   * To access the full response (for headers, for example), `getMemberByUser$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getMemberByUser(params: {

    /**
     * id of Vo
     */
    vo: number;

    /**
     * id of User
     */
    user: number;

  }): Observable<void> {

    return this.getMemberByUser$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getMembersByUser
   */
  static readonly GetMembersByUserPath = '/json/membersManager/getMembersByUser';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getMembersByUser()` instead.
   *
   * This method doesn't expect any response body
   */
  getMembersByUser$Response(params: {

    /**
     * id of User
     */
    user: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, MembersManagerService.GetMembersByUserPath, 'get');
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
   * To access the full response (for headers, for example), `getMembersByUser$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getMembersByUser(params: {

    /**
     * id of User
     */
    user: number;

  }): Observable<void> {

    return this.getMembersByUser$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation findMembersInVo
   */
  static readonly FindMembersInVoPath = '/json/membersManager/findMembersInVo';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findMembersInVo()` instead.
   *
   * This method doesn't expect any response body
   */
  findMembersInVo$Response(params: {

    /**
     * id of Vo
     */
    vo: number;

    /**
     * string to search by
     */
    searchString: string;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, MembersManagerService.FindMembersInVoPath, 'get');
    if (params) {

      rb.query('vo', params.vo);
      rb.query('searchString', params.searchString);

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
   * To access the full response (for headers, for example), `findMembersInVo$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  findMembersInVo(params: {

    /**
     * id of Vo
     */
    vo: number;

    /**
     * string to search by
     */
    searchString: string;

  }): Observable<void> {

    return this.findMembersInVo$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}
