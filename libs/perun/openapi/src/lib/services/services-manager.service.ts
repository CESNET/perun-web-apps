/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { DestinationPropagationType } from '../models/destination-propagation-type';
import { DestinationType } from '../models/destination-type';
import { Service } from '../models/service';

@Injectable({
  providedIn: 'root',
})
export class ServicesManagerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getServiceById
   */
  static readonly GetServiceByIdPath = '/json/servicesManager/getServiceById';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getServiceById()` instead.
   *
   * This method doesn't expect any response body
   */
  getServiceById$Response(params: {

    /**
     * numeric id
     */
    id: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ServicesManagerService.GetServiceByIdPath, 'get');
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
   * To access the full response (for headers, for example), `getServiceById$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getServiceById(params: {

    /**
     * numeric id
     */
    id: number;

  }): Observable<void> {

    return this.getServiceById$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getServiceByName
   */
  static readonly GetServiceByNamePath = '/json/servicesManager/getServiceByName';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getServiceByName()` instead.
   *
   * This method doesn't expect any response body
   */
  getServiceByName$Response(params: {

    /**
     * name of service
     */
    name: string;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ServicesManagerService.GetServiceByNamePath, 'get');
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
   * To access the full response (for headers, for example), `getServiceByName$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getServiceByName(params: {

    /**
     * name of service
     */
    name: string;

  }): Observable<void> {

    return this.getServiceByName$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getDestinationById
   */
  static readonly GetDestinationByIdPath = '/json/servicesManager/getDestinationById';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getDestinationById()` instead.
   *
   * This method doesn't expect any response body
   */
  getDestinationById$Response(params: {

    /**
     * numeric id
     */
    id: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ServicesManagerService.GetDestinationByIdPath, 'get');
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
   * To access the full response (for headers, for example), `getDestinationById$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getDestinationById(params: {

    /**
     * numeric id
     */
    id: number;

  }): Observable<void> {

    return this.getDestinationById$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getDestinations
   */
  static readonly GetDestinationsPath = '/json/servicesManager/getDestinations/s-f';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getDestinations()` instead.
   *
   * This method doesn't expect any response body
   */
  getDestinations$Response(params: {

    /**
     * id of Service
     */
    service: number;

    /**
     * id of Facility
     */
    facility: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ServicesManagerService.GetDestinationsPath, 'get');
    if (params) {

      rb.query('service', params.service);
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
   * To access the full response (for headers, for example), `getDestinations$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getDestinations(params: {

    /**
     * id of Service
     */
    service: number;

    /**
     * id of Facility
     */
    facility: number;

  }): Observable<void> {

    return this.getDestinations$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getAllDestinations
   */
  static readonly GetAllDestinationsPath = '/json/servicesManager/getDestinations/all';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllDestinations()` instead.
   *
   * This method doesn't expect any response body
   */
  getAllDestinations$Response(params?: {

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ServicesManagerService.GetAllDestinationsPath, 'get');
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
   * To access the full response (for headers, for example), `getAllDestinations$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getAllDestinations(params?: {

  }): Observable<void> {

    return this.getAllDestinations$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getRichDestinationsForService
   */
  static readonly GetRichDestinationsForServicePath = '/json/servicesManager/getAllRichDestinations/s';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getRichDestinationsForService()` instead.
   *
   * This method doesn't expect any response body
   */
  getRichDestinationsForService$Response(params: {

    /**
     * id of Service
     */
    service: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ServicesManagerService.GetRichDestinationsForServicePath, 'get');
    if (params) {

      rb.query('service', params.service);

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
   * To access the full response (for headers, for example), `getRichDestinationsForService$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getRichDestinationsForService(params: {

    /**
     * id of Service
     */
    service: number;

  }): Observable<void> {

    return this.getRichDestinationsForService$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getRichDestinationsForFacility
   */
  static readonly GetRichDestinationsForFacilityPath = '/json/servicesManager/getAllRichDestinations/f';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getRichDestinationsForFacility()` instead.
   *
   * This method doesn't expect any response body
   */
  getRichDestinationsForFacility$Response(params: {

    /**
     * id of Facility
     */
    facility: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ServicesManagerService.GetRichDestinationsForFacilityPath, 'get');
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
   * To access the full response (for headers, for example), `getRichDestinationsForFacility$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getRichDestinationsForFacility(params: {

    /**
     * id of Facility
     */
    facility: number;

  }): Observable<void> {

    return this.getRichDestinationsForFacility$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getRichDestinations
   */
  static readonly GetRichDestinationsPath = '/json/servicesManager/getRichDestinations';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getRichDestinations()` instead.
   *
   * This method doesn't expect any response body
   */
  getRichDestinations$Response(params: {

    /**
     * id of Service
     */
    service: number;

    /**
     * id of Facility
     */
    facility: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ServicesManagerService.GetRichDestinationsPath, 'get');
    if (params) {

      rb.query('service', params.service);
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
   * To access the full response (for headers, for example), `getRichDestinations$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getRichDestinations(params: {

    /**
     * id of Service
     */
    service: number;

    /**
     * id of Facility
     */
    facility: number;

  }): Observable<void> {

    return this.getRichDestinations$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation addDestination
   */
  static readonly AddDestinationPath = '/urlinjsonout/servicesManager/addDestination';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `addDestination()` instead.
   *
   * This method doesn't expect any response body
   */
  addDestination$Response(params: {

    /**
     * id of Service
     */
    service: number;

    /**
     * id of Facility
     */
    facility: number;

    /**
     * Destination&#x27;s destination, usually a DNS name
     */
    destination: string;

    /**
     * Destination&#x27;s type
     */
    type: DestinationType;

    /**
     * Destination&#x27;s propagationType
     */
    propagationType: DestinationPropagationType;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ServicesManagerService.AddDestinationPath, 'post');
    if (params) {

      rb.query('service', params.service);
      rb.query('facility', params.facility);
      rb.query('destination', params.destination);
      rb.query('type', params.type);
      rb.query('propagationType', params.propagationType);

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
   * To access the full response (for headers, for example), `addDestination$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  addDestination(params: {

    /**
     * id of Service
     */
    service: number;

    /**
     * id of Facility
     */
    facility: number;

    /**
     * Destination&#x27;s destination, usually a DNS name
     */
    destination: string;

    /**
     * Destination&#x27;s type
     */
    type: DestinationType;

    /**
     * Destination&#x27;s propagationType
     */
    propagationType: DestinationPropagationType;

  }): Observable<void> {

    return this.addDestination$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation addDestinationToMultipleServices
   */
  static readonly AddDestinationToMultipleServicesPath = '/json/servicesManager/addDestination';

  /**
   * Adds an destination for a facility and list of services. If destination doesn't exist it will be created.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `addDestinationToMultipleServices()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  addDestinationToMultipleServices$Response(params: {

    body: { 'services': Array<Service>, 'facility': number, 'destination': string, 'type': DestinationType, 'propagationType': DestinationPropagationType }
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ServicesManagerService.AddDestinationToMultipleServicesPath, 'post');
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
   * Adds an destination for a facility and list of services. If destination doesn't exist it will be created.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `addDestinationToMultipleServices$Response()` instead.
   *
   * This method sends `application/json` and handles response body of type `application/json`
   */
  addDestinationToMultipleServices(params: {

    body: { 'services': Array<Service>, 'facility': number, 'destination': string, 'type': DestinationType, 'propagationType': DestinationPropagationType }
  }): Observable<void> {

    return this.addDestinationToMultipleServices$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation removeDestination
   */
  static readonly RemoveDestinationPath = '/urlinjsonout/servicesManager/removeDestination';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `removeDestination()` instead.
   *
   * This method doesn't expect any response body
   */
  removeDestination$Response(params: {

    /**
     * id of Service
     */
    service: number;

    /**
     * id of Facility
     */
    facility: number;

    /**
     * Destination&#x27;s destination
     */
    destination: string;

    /**
     * Destination&#x27;s type
     */
    type: DestinationType;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ServicesManagerService.RemoveDestinationPath, 'post');
    if (params) {

      rb.query('service', params.service);
      rb.query('facility', params.facility);
      rb.query('destination', params.destination);
      rb.query('type', params.type);

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
   * To access the full response (for headers, for example), `removeDestination$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  removeDestination(params: {

    /**
     * id of Service
     */
    service: number;

    /**
     * id of Facility
     */
    facility: number;

    /**
     * Destination&#x27;s destination
     */
    destination: string;

    /**
     * Destination&#x27;s type
     */
    type: DestinationType;

  }): Observable<void> {

    return this.removeDestination$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation removeAllDestinations
   */
  static readonly RemoveAllDestinationsPath = '/urlinjsonout/servicesManager/removeAllDestinations';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `removeAllDestinations()` instead.
   *
   * This method doesn't expect any response body
   */
  removeAllDestinations$Response(params: {

    /**
     * id of Service
     */
    service: number;

    /**
     * id of Facility
     */
    facility: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ServicesManagerService.RemoveAllDestinationsPath, 'post');
    if (params) {

      rb.query('service', params.service);
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
   * To access the full response (for headers, for example), `removeAllDestinations$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  removeAllDestinations(params: {

    /**
     * id of Service
     */
    service: number;

    /**
     * id of Facility
     */
    facility: number;

  }): Observable<void> {

    return this.removeAllDestinations$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getAssignedServices
   */
  static readonly GetAssignedServicesPath = '/json/servicesManager/getAssignedServices';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAssignedServices()` instead.
   *
   * This method doesn't expect any response body
   */
  getAssignedServices$Response(params: {

    /**
     * id of Facility
     */
    facility: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ServicesManagerService.GetAssignedServicesPath, 'get');
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
   * To access the full response (for headers, for example), `getAssignedServices$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getAssignedServices(params: {

    /**
     * id of Facility
     */
    facility: number;

  }): Observable<void> {

    return this.getAssignedServices$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getAssignedResources
   */
  static readonly GetAssignedResourcesPath = '/json/servicesManager/getAssignedResourcesForService';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAssignedResources()` instead.
   *
   * This method doesn't expect any response body
   */
  getAssignedResources$Response(params: {

    /**
     * id of Service
     */
    service: number;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ServicesManagerService.GetAssignedResourcesPath, 'get');
    if (params) {

      rb.query('service', params.service);

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
   * To access the full response (for headers, for example), `getAssignedResources$Response()` instead.
   *
   * This method doesn't expect any response body
   */
  getAssignedResources(params: {

    /**
     * id of Service
     */
    service: number;

  }): Observable<void> {

    return this.getAssignedResources$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}
