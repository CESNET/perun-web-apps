import { Inject, Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpParams} from '@angular/common/http';
import { PERUN_API_SERVICE } from '@perun-web-apps/perun/tokens';
import { PerunApiService } from './perun-api-service';
import { Facility, Resource, RichFacility, Vo } from '@perun-web-apps/perun/models';
import { Group } from '@perun-web-apps/perun/openapi';

@Injectable({
  providedIn: 'root'
})
export class FacilityService {

  constructor(
    @Inject(PERUN_API_SERVICE) private apiService: PerunApiService
  ) { }

  getFacilityById(id: number, showNotificationOnError = true): Observable<Facility> {
    return this.apiService.post('json/facilitiesManager/getFacilityById', {
      'id': id
    }, showNotificationOnError);
  }

  getFacilitiesByDestination(destination: string, showNotificationOnError = true): Observable<Facility[]> {
    return this.apiService.post('json/facilitiesManager/getFacilitiesByDestination', {
      'destination': destination
    }, showNotificationOnError);
  }

  getAssignedResources(facility: number, showNotificationOnError = true): Observable<Resource[]> {
    return this.apiService.post('json/facilitiesManager/getAssignedResources', {
      'facility': facility
    }, showNotificationOnError);
  }

  getAllowedGroups(facility: number, vo: number, showNotificationOnError = true): Observable<Group[]> {
    return this.apiService.post('json/facilitiesManager/getAllowedGroups', {
      'facility': facility,
      'vo': vo
    }, showNotificationOnError);
  }

  getFacilities(showNotificationOnError = true): Observable<Facility[]> {
    return this.apiService.get('json/facilitiesManager/getFacilities', new HttpParams(), showNotificationOnError);
  }

  getRichFacilities(showNotificationOnError = true): Observable<RichFacility[]> {
    return this.apiService.get('json/facilitiesManager/getRichFacilities', new HttpParams(), showNotificationOnError);
  }

  getAllowedVos(facility: number, showNotificationOnError = true): Observable<Vo[]> {
    return this.apiService.post('json/facilitiesManager/getAllowedVos', {
      'facility': facility
    }, showNotificationOnError);
  }
}
