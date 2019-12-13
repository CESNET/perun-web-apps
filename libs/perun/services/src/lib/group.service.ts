import { Inject, Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpParams} from '@angular/common/http';
import { PERUN_API_SERVICE } from '@perun-web-apps/perun/tokens';
import { PerunApiService } from './perun-api-service';
import { Group, Vo } from '@perun-web-apps/perun/models';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(
    @Inject(PERUN_API_SERVICE) private apiService: PerunApiService
  ) { }

  getGroupById(id: number, showNotificationOnError = true): Observable<Group> {
    return this.apiService.get(`json/groupsManager/getGroupById?id=${id}`, new HttpParams(), showNotificationOnError);
  }

  getAllGroups(voId: number, showNotificationOnError = true): Observable<Group[]> {
    return this.apiService.get(`json/groupsManager/getAllGroups?vo=${voId}`, new HttpParams(), showNotificationOnError);
  }

  getAllSubGroups(groupId: number, showNotificationOnError = true): Observable<Group[]> {
    return this.apiService.get(`json/groupsManager/getSubGroups?parentGroup=${groupId}`, new HttpParams(), showNotificationOnError);
  }

  getSubGroups(groupId: number, showNotificationOnError = true): Observable<Group[]> {
    return this.apiService.get(`json/groupsManager/getSubGroups?parentGroup=${groupId}`, new HttpParams(), showNotificationOnError);
  }

  getAllRichSubGroupsWithAttributesByNames(groupId: number, showNotificationOnError = true): Observable<Group[]> {
    return this.apiService.get(`json/groupsManager/getAllRichSubGroupsWithAttributesByNames?group=${groupId}&attrNames=[]`,
      new HttpParams(), showNotificationOnError);
  }

  createGroup(voId: number, name: string, description: string, showNotificationOnError = true): Observable<Group> {
    return this.apiService.post('json/groupsManager/createGroup', {
      vo: voId,
      name: name,
      description: description
    }, showNotificationOnError);
  }

  createSubGroup(groupId: number, name: string, description: string, showNotificationOnError = true): Observable<Group> {
    return this.apiService.post('json/groupsManager/createGroup', {
      parentGroup: groupId,
      name: name,
      description: description
    }, showNotificationOnError);
  }

  getMemberGroups(memberId: number, showNotificationOnError = true): Observable<Group[]> {
    return this.apiService.get(`json/groupsManager/getMemberGroups?member=${memberId}`, new HttpParams(), showNotificationOnError);
  }

  deleteGroups(groups: Group[], showNotificationOnError = true) {
    return this.apiService.post('json/groupsManager/deleteGroups', {
      groups : groups.map( val => (val.id)),
      forceDelete : 1
    }, showNotificationOnError);
  }

  getAllMemberGroups(member: number, showNotificationOnError = true): Observable<Group[]> {
    return this.apiService.post('json/groupsManager/getAllMemberGroups', {
      'member': member
    }, showNotificationOnError);
  }

  moveGroup(movingGroupId: number, destinationGroupId?: number, showNotificationOnError = true): Observable<void> {
    return this.apiService.post('json/groupsManager/moveGroup', {
      'movingGroup' : movingGroupId,
      'destinationGroup' : destinationGroupId
    }, showNotificationOnError);
  }

  getVoOfGroup(id: number, showNotificationOnError = true): Observable<Vo> {
    return this.apiService.get(`json/groupsManager/getVo?group=${id}`, new HttpParams(), showNotificationOnError);
  }

  addMembers(group: number, members: number[], showNotificationOnError: boolean = true): Observable<void> {
    return this.apiService.post('json/groupsManager/addMembers', {
      group: group,
      members: members
      }, showNotificationOnError);
  }

  removeMembers(group: number, members: number[], showNotificationOnError: boolean = true): Observable<any> {
    return this.apiService.post('json/groupsManager/removeMembers', {
      group: group,
      members: members
    }, showNotificationOnError);
  }

  createUnion(resultGroup: number, operandGroup: number, showNotificationOnError: boolean = true): Observable<void> {
    return this.apiService.post('json/groupsManager/createGroupUnion', {
      resultGroup: resultGroup,
      operandGroup: operandGroup
    }, showNotificationOnError);
  }

  getUnions(group: number, reverse: boolean, showNotificationOnError: boolean = true): Observable<Group[]> {
    return this.apiService.post('json/groupsManager/getGroupUnions', {
      group: group,
      reverseDirection: reverse
    }, showNotificationOnError);
  }

  removeUnion(resultGroup: number, operandGroup: number, showNotificationOnError: boolean = true): Observable<any> {
    return this.apiService.post('json/groupsManager/removeGroupUnion', {
      resultGroup: resultGroup,
      operandGroup: operandGroup
    }, showNotificationOnError);
  }
}
