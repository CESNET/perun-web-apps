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
export class UtilsService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getPerunRpcVersion
   */
  static readonly GetPerunRpcVersionPath = '/';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getPerunRpcVersion()` instead.
   *
   * This method doesn't expect any response body
   */
  getPerunRpcVersion$Response(params?: {

  }): Observable<StrictHttpResponse<string>> {

    const rb = new RequestBuilder(this.rootUrl, UtilsService.GetPerunRpcVersionPath, 'get');
    if (params) {


    }
    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<string>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getPerunRpcVersion$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getPerunRpcVersion(params?: {

  }): Observable<string> {

    return this.getPerunRpcVersion$Response(params).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

  /**
   * Path part for operation getPerunStatus
   */
  static readonly GetPerunStatusPath = '/json/utils/getPerunStatus';

  /**
   * Returns list of strings which looks like this
   * "Version of Perun: 3.8.6",
   * "Version of PerunDB: 3.1.55",
   * "Version of Servlet: Apache Tomcat/9.0.16 (Debian)",
   * "Version of DB-driver: PostgreSQL JDBC Driver-42.2.8",
   * "Version of DB: PostgreSQL-12.0 (Debian 12.0-2.pgdg100+1)",
   * "Version of Java platform: 11.0.5",
   * "AuditerConsumer: '127.0.0.1:6071' with last processed id='23463958'",
   * "AuditerConsumer: 'ldapcConsumer' with last processed id='23463958'",
   * "AuditerConsumer: 'notifications' with last processed id='23463952'",
   * "LastMessageId: 23463958",
   * "Timestamp: 2019-11-14 10:12:30.99"
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getPerunStatus()` instead.
   *
   * This method doesn't expect any response body
   */
  getPerunStatus$Response(params?: {

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, UtilsService.GetPerunStatusPath, 'get');
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
   * Returns list of strings which looks like this
   * "Version of Perun: 3.8.6",
   * "Version of PerunDB: 3.1.55",
   * "Version of Servlet: Apache Tomcat/9.0.16 (Debian)",
   * "Version of DB-driver: PostgreSQL JDBC Driver-42.2.8",
   * "Version of DB: PostgreSQL-12.0 (Debian 12.0-2.pgdg100+1)",
   * "Version of Java platform: 11.0.5",
   * "AuditerConsumer: '127.0.0.1:6071' with last processed id='23463958'",
   * "AuditerConsumer: 'ldapcConsumer' with last processed id='23463958'",
   * "AuditerConsumer: 'notifications' with last processed id='23463952'",
   * "LastMessageId: 23463958",
   * "Timestamp: 2019-11-14 10:12:30.99"
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getPerunStatus$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getPerunStatus(params?: {

  }): Observable<void> {

    return this.getPerunStatus$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getPerunStatistics
   */
  static readonly GetPerunStatisticsPath = '/json/utils/getPerunStatistics';

  /**
   * Returns list of strings which looks like this
   * "Timestamp: '2019-11-14 10:46:39.613'",
   * "USERS: '39927'",
   * "FACILITIES: '552'",
   * "DESTINATIONS: '2568'",
   * "VOS: '341'",
   * "RESOURCES: '2560'",
   * "GROUPS: '2300'",
   * "AUDITMESSAGES: '7333237'"
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getPerunStatistics()` instead.
   *
   * This method doesn't expect any response body
   */
  getPerunStatistics$Response(params?: {

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, UtilsService.GetPerunStatisticsPath, 'get');
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
   * Returns list of strings which looks like this
   * "Timestamp: '2019-11-14 10:46:39.613'",
   * "USERS: '39927'",
   * "FACILITIES: '552'",
   * "DESTINATIONS: '2568'",
   * "VOS: '341'",
   * "RESOURCES: '2560'",
   * "GROUPS: '2300'",
   * "AUDITMESSAGES: '7333237'"
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getPerunStatistics$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getPerunStatistics(params?: {

  }): Observable<void> {

    return this.getPerunStatistics$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getPerunSystemTimeInMillis
   */
  static readonly GetPerunSystemTimeInMillisPath = '/json/utils/getPerunSystemTimeInMillis';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getPerunSystemTimeInMillis()` instead.
   *
   * This method doesn't expect any response body
   */
  getPerunSystemTimeInMillis$Response(params?: {

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, UtilsService.GetPerunSystemTimeInMillisPath, 'get');
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
   * To access the full response (for headers, for example), `getPerunSystemTimeInMillis$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getPerunSystemTimeInMillis(params?: {

  }): Observable<void> {

    return this.getPerunSystemTimeInMillis$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getGuiConfiguration
   */
  static readonly GetGuiConfigurationPath = '/json/utils/getGuiConfiguration';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getGuiConfiguration()` instead.
   *
   * This method doesn't expect any response body
   */
  getGuiConfiguration$Response(params?: {

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, UtilsService.GetGuiConfigurationPath, 'get');
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
   * To access the full response (for headers, for example), `getGuiConfiguration$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getGuiConfiguration(params?: {

  }): Observable<void> {

    return this.getGuiConfiguration$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}
