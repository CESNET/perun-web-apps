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
export class DatabaseManagerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getCurrentDatabaseVersion
   */
  static readonly GetCurrentDatabaseVersionPath = '/json/databaseManager/getCurrentDatabaseVersion';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getCurrentDatabaseVersion()` instead.
   *
   * This method doesn't expect any response body
   */
  getCurrentDatabaseVersion$Response(params?: {

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, DatabaseManagerService.GetCurrentDatabaseVersionPath, 'get');
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
   * To access the full response (for headers, for example), `getCurrentDatabaseVersion$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getCurrentDatabaseVersion(params?: {

  }): Observable<void> {

    return this.getCurrentDatabaseVersion$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getDatabaseDriverInformation
   */
  static readonly GetDatabaseDriverInformationPath = '/json/databaseManager/getDatabaseDriverInformation';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getDatabaseDriverInformation()` instead.
   *
   * This method doesn't expect any response body
   */
  getDatabaseDriverInformation$Response(params?: {

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, DatabaseManagerService.GetDatabaseDriverInformationPath, 'get');
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
   * To access the full response (for headers, for example), `getDatabaseDriverInformation$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getDatabaseDriverInformation(params?: {

  }): Observable<void> {

    return this.getDatabaseDriverInformation$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getDatabaseInformation
   */
  static readonly GetDatabaseInformationPath = '/json/databaseManager/getDatabaseInformation';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getDatabaseInformation()` instead.
   *
   * This method doesn't expect any response body
   */
  getDatabaseInformation$Response(params?: {

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, DatabaseManagerService.GetDatabaseInformationPath, 'get');
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
   * To access the full response (for headers, for example), `getDatabaseInformation$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getDatabaseInformation(params?: {

  }): Observable<void> {

    return this.getDatabaseInformation$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}
