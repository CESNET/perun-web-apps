/**
 * Perun RPC API
 * Perun Remote Procedure Calls Application Programming Interface
 *
 * The version of the OpenAPI document: 0.0.0
 * Contact: perun@cesnet.cz
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
  HttpEvent,
  HttpParameterCodec,
  HttpContext,
} from '@angular/common/http';
import { CustomHttpParameterCodec } from '../encoder';
import { Observable } from 'rxjs';

// @ts-ignore
import { InputInviteToGroupFromCsv } from '../model/inputInviteToGroupFromCsv';
// @ts-ignore
import { Invitation } from '../model/invitation';
// @ts-ignore
import { PerunException } from '../model/perunException';

// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS } from '../variables';
import { Configuration } from '../configuration';
import { PaginatedRichApplications } from '../model/paginatedRichApplications';
import { InputGetInvitationsPage } from '../model/inputGetInvitationsPage';
import { PaginatedInvitationsWithSender } from '../model/paginatedInvitationsWithSender';

@Injectable({
  providedIn: 'root',
})
export class InvitationsManagerService {
  protected basePath = 'https://api-dev.perun-aai.org/ba/rpc';
  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();
  public encoder: HttpParameterCodec;

  constructor(
    protected httpClient: HttpClient,
    @Optional() @Inject(BASE_PATH) basePath: string,
    @Optional() configuration: Configuration,
  ) {
    if (configuration) {
      this.configuration = configuration;
    }
    if (typeof this.configuration.basePath !== 'string') {
      if (typeof basePath !== 'string') {
        basePath = this.basePath;
      }
      this.configuration.basePath = basePath;
    }
    this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
  }

  private addToHttpParams(httpParams: HttpParams, value: any, key?: string): HttpParams {
    if (typeof value === 'object' && value instanceof Date === false) {
      httpParams = this.addToHttpParamsRecursive(httpParams, value);
    } else {
      httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
    }
    return httpParams;
  }

  private addToHttpParamsRecursive(httpParams: HttpParams, value?: any, key?: string): HttpParams {
    if (value == null) {
      return httpParams;
    }

    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        (value as any[]).forEach(
          (elem) => (httpParams = this.addToHttpParamsRecursive(httpParams, elem, key)),
        );
      } else if (value instanceof Date) {
        if (key != null) {
          httpParams = httpParams.append(key, (value as Date).toISOString().substr(0, 10));
        } else {
          throw Error('key may not be null if value is Date');
        }
      } else {
        Object.keys(value).forEach(
          (k) =>
            (httpParams = this.addToHttpParamsRecursive(
              httpParams,
              value[k],
              key != null ? `${key}.${k}` : k,
            )),
        );
      }
    } else if (key != null) {
      httpParams = httpParams.append(key, value);
    } else {
      throw Error('key may not be null if value is not object or array');
    }
    return httpParams;
  }

  /**
   * Creates invitation to group and sends the link via email. Link leads to the application form of the group and consequently connects to a pre-approved application.
   * @param vo id of Vo
   * @param group id of Group
   * @param receiverName Name of the invited user
   * @param receiverEmail Email of the invited user
   * @param language Language of the invitation, should match available instance locales
   * @param expiration Expiration date of the invite in format yyyy-MM-dd}
   * @param redirectUrl URL to redirect to after application filled out.
   * @param useNon if set to true sends the request to the backend server as 'non' instead of the usual (oauth, krb...).
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public inviteToGroup(
    vo: number,
    group: number,
    receiverName: string,
    receiverEmail: string,
    language: string,
    expiration?: string,
    redirectUrl?: string,
    useNon?: boolean,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<Invitation>;
  public inviteToGroup(
    vo: number,
    group: number,
    receiverName: string,
    receiverEmail: string,
    language: string,
    expiration?: string,
    redirectUrl?: string,
    useNon?: boolean,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<HttpResponse<Invitation>>;
  public inviteToGroup(
    vo: number,
    group: number,
    receiverName: string,
    receiverEmail: string,
    language: string,
    expiration?: string,
    redirectUrl?: string,
    useNon?: boolean,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<HttpEvent<Invitation>>;
  public inviteToGroup(
    vo: number,
    group: number,
    receiverName: string,
    receiverEmail: string,
    language: string,
    expiration?: string,
    redirectUrl?: string,
    useNon: boolean = false,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<any> {
    if (vo === null || vo === undefined) {
      throw new Error('Required parameter vo was null or undefined when calling inviteToGroup.');
    }
    if (group === null || group === undefined) {
      throw new Error('Required parameter group was null or undefined when calling inviteToGroup.');
    }
    if (receiverName === null || receiverName === undefined) {
      throw new Error(
        'Required parameter receiverName was null or undefined when calling inviteToGroup.',
      );
    }
    if (receiverEmail === null || receiverEmail === undefined) {
      throw new Error(
        'Required parameter receiverEmail was null or undefined when calling inviteToGroup.',
      );
    }
    if (language === null || language === undefined) {
      throw new Error(
        'Required parameter language was null or undefined when calling inviteToGroup.',
      );
    }

    let localVarQueryParameters = new HttpParams({ encoder: this.encoder });
    if (vo !== undefined && vo !== null) {
      localVarQueryParameters = this.addToHttpParams(localVarQueryParameters, <any>vo, 'vo');
    }
    if (group !== undefined && group !== null) {
      localVarQueryParameters = this.addToHttpParams(localVarQueryParameters, <any>group, 'group');
    }
    if (receiverName !== undefined && receiverName !== null) {
      localVarQueryParameters = this.addToHttpParams(
        localVarQueryParameters,
        <any>receiverName,
        'receiverName',
      );
    }
    if (receiverEmail !== undefined && receiverEmail !== null) {
      localVarQueryParameters = this.addToHttpParams(
        localVarQueryParameters,
        <any>receiverEmail,
        'receiverEmail',
      );
    }
    if (language !== undefined && language !== null) {
      localVarQueryParameters = this.addToHttpParams(
        localVarQueryParameters,
        <any>language,
        'language',
      );
    }
    if (expiration !== undefined && expiration !== null) {
      localVarQueryParameters = this.addToHttpParams(
        localVarQueryParameters,
        <any>expiration,
        'expiration',
      );
    }
    if (redirectUrl !== undefined && redirectUrl !== null) {
      localVarQueryParameters = this.addToHttpParams(
        localVarQueryParameters,
        <any>redirectUrl,
        'redirectUrl',
      );
    }

    let localVarHeaders = this.defaultHeaders;

    let localVarCredential: string | undefined;
    // authentication (BasicAuth) required
    localVarCredential = this.configuration.lookupCredential('BasicAuth');
    if (localVarCredential) {
      localVarHeaders = localVarHeaders.set('Authorization', 'Basic ' + localVarCredential);
    }

    // authentication (BearerAuth) required
    localVarCredential = this.configuration.lookupCredential('BearerAuth');
    if (localVarCredential) {
      localVarHeaders = localVarHeaders.set('Authorization', 'Bearer ' + localVarCredential);
    }

    let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
    if (localVarHttpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['application/json'];
      localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    }
    if (localVarHttpHeaderAcceptSelected !== undefined) {
      localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
    }

    let localVarHttpContext: HttpContext | undefined = options && options.context;
    if (localVarHttpContext === undefined) {
      localVarHttpContext = new HttpContext();
    }

    let responseType_: 'text' | 'json' | 'blob' = 'json';
    if (localVarHttpHeaderAcceptSelected) {
      if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
        responseType_ = 'text';
      } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
        responseType_ = 'json';
      } else {
        responseType_ = 'blob';
      }
    }

    let requestUrl = `${this.configuration.basePath}/urlinjsonout/invitationsManager/inviteToGroup`;
    if (useNon) {
      // replace the authentication part of url with 'non' authentication
      let helperUrl = new URL(requestUrl);
      let path = helperUrl.pathname.split('/');
      path[1] = 'non';
      helperUrl.pathname = path.join('/');
      requestUrl = helperUrl.toString();
    }
    return this.httpClient.post<Invitation>(requestUrl, null, {
      context: localVarHttpContext,
      params: localVarQueryParameters,
      responseType: <any>responseType_,
      withCredentials: this.configuration.withCredentials,
      headers: localVarHeaders,
      observe: observe,
      reportProgress: reportProgress,
    });
  }

  /**
   * Creates invitations to group and sends the link via email from CSV. Link leads to the application form of the group and consequently connects to a pre-approved application.
   * @param InputInviteToGroupFromCsv
   * @param useNon if set to true sends the request to the backend server as 'non' instead of the usual (oauth, krb...).
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public inviteToGroupFromCsv(
    InputInviteToGroupFromCsv: InputInviteToGroupFromCsv,
    useNon?: boolean,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<{ [key: string]: string }>;
  public inviteToGroupFromCsv(
    InputInviteToGroupFromCsv: InputInviteToGroupFromCsv,
    useNon?: boolean,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<HttpResponse<{ [key: string]: string }>>;
  public inviteToGroupFromCsv(
    InputInviteToGroupFromCsv: InputInviteToGroupFromCsv,
    useNon?: boolean,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<HttpEvent<{ [key: string]: string }>>;
  public inviteToGroupFromCsv(
    InputInviteToGroupFromCsv: InputInviteToGroupFromCsv,
    useNon: boolean = false,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<any> {
    if (InputInviteToGroupFromCsv === null || InputInviteToGroupFromCsv === undefined) {
      throw new Error(
        'Required parameter InputInviteToGroupFromCsv was null or undefined when calling inviteToGroupFromCsv.',
      );
    }

    let localVarHeaders = this.defaultHeaders;

    let localVarCredential: string | undefined;
    // authentication (BasicAuth) required
    localVarCredential = this.configuration.lookupCredential('BasicAuth');
    if (localVarCredential) {
      localVarHeaders = localVarHeaders.set('Authorization', 'Basic ' + localVarCredential);
    }

    // authentication (BearerAuth) required
    localVarCredential = this.configuration.lookupCredential('BearerAuth');
    if (localVarCredential) {
      localVarHeaders = localVarHeaders.set('Authorization', 'Bearer ' + localVarCredential);
    }

    let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
    if (localVarHttpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['application/json'];
      localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    }
    if (localVarHttpHeaderAcceptSelected !== undefined) {
      localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
    }

    let localVarHttpContext: HttpContext | undefined = options && options.context;
    if (localVarHttpContext === undefined) {
      localVarHttpContext = new HttpContext();
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/json'];
    const httpContentTypeSelected: string | undefined =
      this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected !== undefined) {
      localVarHeaders = localVarHeaders.set('Content-Type', httpContentTypeSelected);
    }

    let responseType_: 'text' | 'json' | 'blob' = 'json';
    if (localVarHttpHeaderAcceptSelected) {
      if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
        responseType_ = 'text';
      } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
        responseType_ = 'json';
      } else {
        responseType_ = 'blob';
      }
    }

    let requestUrl = `${this.configuration.basePath}/json/invitationsManager/inviteToGroupFromCsv`;
    if (useNon) {
      // replace the authentication part of url with 'non' authentication
      let helperUrl = new URL(requestUrl);
      let path = helperUrl.pathname.split('/');
      path[1] = 'non';
      helperUrl.pathname = path.join('/');
      requestUrl = helperUrl.toString();
    }
    return this.httpClient.post<{ [key: string]: string }>(requestUrl, InputInviteToGroupFromCsv, {
      context: localVarHttpContext,
      responseType: <any>responseType_,
      withCredentials: this.configuration.withCredentials,
      headers: localVarHeaders,
      observe: observe,
      reportProgress: reportProgress,
    });
  }

  /**
   * Get page of invitations from the given group.
   * @param InputGetInvitationsPage
   * @param useNon if set to true sends the request to the backend server as 'non' instead of the usual (oauth, krb...).
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getInvitationsPage(
    InputGetInvitationsPage: InputGetInvitationsPage,
    useNon?: boolean,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<PaginatedInvitationsWithSender>;
  public getInvitationsPage(
    InputGetInvitationsPage: InputGetInvitationsPage,
    useNon?: boolean,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<HttpResponse<PaginatedInvitationsWithSender>>;
  public getInvitationsPage(
    InputGetInvitationsPage: InputGetInvitationsPage,
    useNon?: boolean,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<HttpEvent<PaginatedInvitationsWithSender>>;
  public getInvitationsPage(
    InputGetInvitationsPage: InputGetInvitationsPage,
    useNon: boolean = false,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<any> {
    if (InputGetInvitationsPage === null || InputGetInvitationsPage === undefined) {
      throw new Error(
        'Required parameter InputGetInvitationsPage was null or undefined when calling getInvitationsPage.',
      );
    }

    let localVarHeaders = this.defaultHeaders;

    let localVarCredential: string | undefined;
    // authentication (BasicAuth) required
    localVarCredential = this.configuration.lookupCredential('BasicAuth');
    if (localVarCredential) {
      localVarHeaders = localVarHeaders.set('Authorization', 'Basic ' + localVarCredential);
    }

    // authentication (BearerAuth) required
    localVarCredential = this.configuration.lookupCredential('BearerAuth');
    if (localVarCredential) {
      localVarHeaders = localVarHeaders.set('Authorization', 'Bearer ' + localVarCredential);
    }

    let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
    if (localVarHttpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['application/json'];
      localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    }
    if (localVarHttpHeaderAcceptSelected !== undefined) {
      localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
    }

    let localVarHttpContext: HttpContext | undefined = options && options.context;
    if (localVarHttpContext === undefined) {
      localVarHttpContext = new HttpContext();
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/json'];
    const httpContentTypeSelected: string | undefined =
      this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected !== undefined) {
      localVarHeaders = localVarHeaders.set('Content-Type', httpContentTypeSelected);
    }

    let responseType_: 'text' | 'json' | 'blob' = 'json';
    if (localVarHttpHeaderAcceptSelected) {
      if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
        responseType_ = 'text';
      } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
        responseType_ = 'json';
      } else {
        responseType_ = 'blob';
      }
    }

    let requestUrl = `${this.configuration.basePath}/json/invitationsManager/getInvitationsPage`;
    if (useNon) {
      // replace the authentication part of url with 'non' authentication
      let helperUrl = new URL(requestUrl);
      let path = helperUrl.pathname.split('/');
      path[1] = 'non';
      helperUrl.pathname = path.join('/');
      requestUrl = helperUrl.toString();
    }
    return this.httpClient.post<PaginatedInvitationsWithSender>(
      requestUrl,
      InputGetInvitationsPage,
      {
        context: localVarHttpContext,
        responseType: <any>responseType_,
        withCredentials: this.configuration.withCredentials,
        headers: localVarHeaders,
        observe: observe,
        reportProgress: reportProgress,
      },
    );
  }
}
