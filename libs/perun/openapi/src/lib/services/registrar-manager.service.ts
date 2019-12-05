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
export class RegistrarManagerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getVoApplicationForm
   */
  static readonly GetVoApplicationFormPath = '/json/registrarManager/getApplicationForm/vo';

  /**
   * There is exactly one form for membership per VO, one form is used for both initial registration and annual account expansion,
   * just the form items are marked whether the should be present in one, the other, or both types of application.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getVoApplicationForm()` instead.
   *
   * This method doesn't expect any response body
   */
  getVoApplicationForm$Response(params: {

    /**
     * id of Vo
     */
    vo: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, RegistrarManagerService.GetVoApplicationFormPath, 'get');
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
   * There is exactly one form for membership per VO, one form is used for both initial registration and annual account expansion,
   * just the form items are marked whether the should be present in one, the other, or both types of application.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getVoApplicationForm$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getVoApplicationForm(params: {

    /**
     * id of Vo
     */
    vo: number;

  }): Observable<void> {

    return this.getVoApplicationForm$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getGroupApplicationForm
   */
  static readonly GetGroupApplicationFormPath = '/json/registrarManager/getApplicationForm/group';

  /**
   * There is exactly one form for membership per Group, one form is used for both initial registration and annual account expansion,
   * just the form items are marked whether the should be present in one, the other, or both types of application.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getGroupApplicationForm()` instead.
   *
   * This method doesn't expect any response body
   */
  getGroupApplicationForm$Response(params: {

    /**
     * id of Group
     */
    group: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, RegistrarManagerService.GetGroupApplicationFormPath, 'get');
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
   * There is exactly one form for membership per Group, one form is used for both initial registration and annual account expansion,
   * just the form items are marked whether the should be present in one, the other, or both types of application.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getGroupApplicationForm$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getGroupApplicationForm(params: {

    /**
     * id of Group
     */
    group: number;

  }): Observable<void> {

    return this.getGroupApplicationForm$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}
