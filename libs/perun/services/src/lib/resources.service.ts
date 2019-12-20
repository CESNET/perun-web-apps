import { Inject, Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpParams} from '@angular/common/http';
import { PERUN_API_SERVICE } from '@perun-web-apps/perun/tokens';
import { PerunApiService } from './perun-api-service';
import { Group, Resource, ResourceTag, RichResource, Service } from '@perun-web-apps/perun/models';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {

  constructor(
    @Inject(PERUN_API_SERVICE) private apiService: PerunApiService
  ) { }

  getResourceById(id: number, showNotificationOnError = true): Observable<Resource> {
    return this.apiService.post('json/resourcesManager/getResourceById', {
      id: id
    }, showNotificationOnError);
  }

  getResourcesByVo(id: number, showNotificationOnError = true): Observable<RichResource[]> {
    return this.apiService.get(`json/resourcesManager/getRichResources?vo=${id}`, new HttpParams(), showNotificationOnError);
  }

  getResourcesByGroup(id: number, showNotificationOnError = true): Observable<RichResource[]> {
    return this.apiService.get(`json/resourcesManager/getAssignedRichResources?group=${id}`, new HttpParams(), showNotificationOnError);
  }

  getAssignedResources(group: number, showNotificationOnError = true): Observable<Resource[]> {
    return this.apiService.post('json/resourcesManager/getAssignedResources', {
      'group': group
    }, showNotificationOnError);
  }

  getAssignedServices(resource: number, showNotificationOnError = true): Observable<Service[]> {
    return this.apiService.post('json/resourcesManager/getAssignedServices', {
      'resource': resource
    }, showNotificationOnError);
  }

  getAllResources(facilityId: number, showNotificationOnError = true): Observable<RichResource[]> {
    return this.apiService
      .get(`json/facilitiesManager/getAssignedRichResources?facility=${facilityId}`, new HttpParams(), showNotificationOnError);
  }

  removeResource(resourceId: number, showNotificationOnError = true) {
    return this.apiService.post('json/resourcesManager/deleteResource', {
      resource : resourceId,
      forceDelete : 1
    }, showNotificationOnError);
  }

  getAllResourcesTagsForVo(voId: number, showNotificationOnError = true): Observable<ResourceTag[]> {
    return this.apiService.post('json/resourcesManager/getAllResourcesTagsForVo', {
      'vo': voId
    }, showNotificationOnError);
  }

  updateResourceTag(resourceTag: ResourceTag, showNotificationOnError = true): Observable<ResourceTag> {
    return this.apiService.post('json/resourcesManager/updateResourceTag', {
      'resourceTag': resourceTag
    }, showNotificationOnError);
  }

  createResourceTag(tagName: string, vo: number, showNotificationOnError = true): Observable<ResourceTag> {
    return this.apiService.post('json/resourcesManager/createResourceTag', {
      'tagName': tagName,
      'vo': vo
    }, showNotificationOnError);
  }

  deleteResourceTag(resourceTag: ResourceTag, showNotificationOnError = true) {
    return this.apiService.post('json/resourcesManager/deleteResourceTag', {
      'resourceTag': resourceTag
    }, showNotificationOnError);
  }

  getAssignedGroups(resource: number, showNotificationOnError = true): Observable<Group[]> {
    return this.apiService.post('json/resourcesManager/getAssignedGroups', {
      'resource': resource
    }, showNotificationOnError);
  }

  removeGroupsFromResource(groups: Group[], resource: number, showNotificationOnError = true) {
    return this.apiService.post('json/resourcesManager/removeGroupsFromResource', {
      'groups': groups,
      'resource': resource
    }, showNotificationOnError);
  }

  assignGroupsToResource(groups: number[], resource: number, showNotificationOnError = true) {
    return this.apiService.post('json/resourcesManager/assignGroupsToResource', {
      'groups': groups,
      'resource': resource
    }, showNotificationOnError);
  }
}
