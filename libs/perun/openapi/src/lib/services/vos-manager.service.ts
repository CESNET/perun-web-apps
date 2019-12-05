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

}
