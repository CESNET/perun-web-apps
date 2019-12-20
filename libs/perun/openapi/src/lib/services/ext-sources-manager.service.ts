/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class ExtSourcesManagerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getExtSourceById
   */
  static readonly GetExtSourceByIdPath = '/json/extSourcesManager/getExtSourceById';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getExtSourceById()` instead.
   *
   * This method doesn't expect any response body
   */
  getExtSourceById$Response(params: {

    /**
     * numeric id
     */
    id: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ExtSourcesManagerService.GetExtSourceByIdPath, 'get');
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
   * To access the full response (for headers, for example), `getExtSourceById$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getExtSourceById(params: {

    /**
     * numeric id
     */
    id: number;

  }): Observable<void> {

    return this.getExtSourceById$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getExtSourceByName
   */
  static readonly GetExtSourceByNamePath = '/json/extSourcesManager/getExtSourceByName';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getExtSourceByName()` instead.
   *
   * This method doesn't expect any response body
   */
  getExtSourceByName$Response(params: {

    /**
     * ExtSource Name
     */
    name: string;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ExtSourcesManagerService.GetExtSourceByNamePath, 'get');
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
   * To access the full response (for headers, for example), `getExtSourceByName$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getExtSourceByName(params: {

    /**
     * ExtSource Name
     */
    name: string;

  }): Observable<void> {

    return this.getExtSourceByName$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getExtSources
   */
  static readonly GetExtSourcesPath = '/json/extSourcesManager/getExtSources';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getExtSources()` instead.
   *
   * This method doesn't expect any response body
   */
  getExtSources$Response(params?: {

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ExtSourcesManagerService.GetExtSourcesPath, 'get');
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
   * To access the full response (for headers, for example), `getExtSources$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getExtSources(params?: {

  }): Observable<void> {

    return this.getExtSources$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}
