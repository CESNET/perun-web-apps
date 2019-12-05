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
 * OwnersManager RPC API in Perun
 */
@Injectable({
  providedIn: 'root',
})
export class OwnersManagerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation createOwner
   */
  static readonly CreateOwnerPath = '/json/ownersManager/createOwner';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createOwner()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  createOwner$Response(params: {

    body: { 'name': string, 'contact': string, 'ownerType': 0 | 1 }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, OwnersManagerService.CreateOwnerPath, 'post');
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
   * To access the full response (for headers, for example), `createOwner$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  createOwner(params: {

    body: { 'name': string, 'contact': string, 'ownerType': 0 | 1 }
  }): Observable<void> {

    return this.createOwner$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation deleteOwner
   */
  static readonly DeleteOwnerPath = '/urlinjsonout/ownersManager/deleteOwner';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteOwner()` instead.
   *
   * This method doesn't expect any response body
   */
  deleteOwner$Response(params: {

    /**
     * id of Owner
     */
    owner: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, OwnersManagerService.DeleteOwnerPath, 'post');
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
   * To access the full response (for headers, for example), `deleteOwner$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  deleteOwner(params: {

    /**
     * id of Owner
     */
    owner: number;

  }): Observable<void> {

    return this.deleteOwner$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getOwnerById
   */
  static readonly GetOwnerByIdPath = '/json/ownersManager/getOwnerById';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getOwnerById()` instead.
   *
   * This method doesn't expect any response body
   */
  getOwnerById$Response(params: {

    /**
     * numeric id
     */
    id: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, OwnersManagerService.GetOwnerByIdPath, 'get');
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
   * To access the full response (for headers, for example), `getOwnerById$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getOwnerById(params: {

    /**
     * numeric id
     */
    id: number;

  }): Observable<void> {

    return this.getOwnerById$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getAllOwners
   */
  static readonly GetAllOwnersPath = '/json/ownersManager/getOwners';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllOwners()` instead.
   *
   * This method doesn't expect any response body
   */
  getAllOwners$Response(params?: {

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, OwnersManagerService.GetAllOwnersPath, 'get');
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
   * To access the full response (for headers, for example), `getAllOwners$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getAllOwners(params?: {

  }): Observable<void> {

    return this.getAllOwners$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}
