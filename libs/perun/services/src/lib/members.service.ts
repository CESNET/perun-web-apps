import { Inject, Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpParams} from '@angular/common/http';
import { PERUN_API_SERVICE } from '@perun-web-apps/perun/tokens';
import { PerunApiService } from './perun-api-service';
import { Candidate, Group, Member, RichMember } from '@perun-web-apps/perun/models';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  constructor(
    @Inject(PERUN_API_SERVICE) private apiService: PerunApiService
  ) { }

  getMemberById(memberId: number, showNotificationOnError = true): Observable<Member> {
    return this.apiService.get(`json/membersManager/getMemberById?id=${memberId}`, new HttpParams(), showNotificationOnError);
  }

  findCompleteRichMembers(voId: number, searchString: string, attrsNames: string[],allowedStatuses:string [], showNotificationOnError = true):
    Observable<RichMember[]> {
    return this.apiService.post('json/membersManager/findCompleteRichMembers',
      {
        'vo': voId,
        'searchString': searchString,
        'attrsNames': attrsNames,
        'allowedStatuses': allowedStatuses
      }, showNotificationOnError);
  }

  getCompleteRichMembers(voId: number, attrsNames: string[], allowedStatuses: string[], showNotificationOnError = true): Observable<RichMember[]> {
    return this.apiService.post(`json/membersManager/getCompleteRichMembers`,
      {
        'vo': voId,
        'attrsNames': attrsNames,
        'allowedStatuses': allowedStatuses
      }, showNotificationOnError);
  }

  getRichMemberWithAttributes(memberId: number, showNotificationOnError = true): Observable<RichMember> {
    return this.apiService.get(`json/membersManager/getRichMemberWithAttributes?id=${memberId}`,
      new HttpParams(), showNotificationOnError);
  }

  findCompleteRichMembersForGroup(groupId: number, searchString: string, attrsNames: string[], showNotificationOnError = true):
    Observable<RichMember[]> {

    return this.apiService.post('json/membersManager/findCompleteRichMembers', {
      'group': groupId,
      'attrsNames': attrsNames,
      'allowedStatuses': ['INVALID', 'SUSPENDED', 'EXPIRED', 'VALID', 'DISABLED'],
      'searchString': searchString,
      'lookingInParentGroup': false
    }, showNotificationOnError);
  }

  getCompleteRichMembersForGroup(groupId: number, attrNames: string[], showNotificationOnError = true): Observable<RichMember[]> {
    return this.apiService.post('json/membersManager/getCompleteRichMembers', {
      'group': groupId,
      'attrsNames': attrNames,
      'allowedStatuses': ['INVALID', 'SUSPENDED', 'VALID'],
      'lookingInParentGroup': false
    }, showNotificationOnError);
  }

  deleteMembers(memberIds: number[], showNotificationOnError = true): Observable<void> {
    return this.apiService.post('json/membersManager/deleteMembers', {
      'members': memberIds
    }, showNotificationOnError);
  }

  getMembersByUser(user: number, showNotificationOnError = true): Observable<Member[]> {
    return this.apiService.post('json/membersManager/getMembersByUser', {
      'user': user
    }, showNotificationOnError);
  }

  createMember(voId: number, userId: number, showNotificationOnError = true): Observable<RichMember> {
    return this.apiService.post('json/membersManager/createMember', {
      vo: voId,
      user: userId
    }, showNotificationOnError);
  }

  createMemberWithGroups(
    voId: number,
    userId: number,
    groups: Group[],
    showNotificationOnError = true
  ): Observable<RichMember> {
    return this.apiService.post('json/membersManager/createMember', {
      vo: voId,
      user: userId,
      groups: groups
    }, showNotificationOnError);
  }

  createMemberForCandidateWithGroups(
    voId: number,
    candidate: Candidate,
    groups: Group[],
    showNotificationOnError = true
  ): Observable<RichMember> {
    return this.apiService.post('json/membersManager/createMember', {
      vo: voId,
      candidate: candidate,
      groups: groups
    }, showNotificationOnError);
  }

  createMemberForCandidate(
    voId: number,
    candidate: Candidate,
    showNotificationOnError = true
  ): Observable<RichMember> {
    return this.apiService.post('json/membersManager/createMember', {
      vo: voId,
      candidate: candidate
    }, showNotificationOnError);
  }

  getMemberByUser(voId: number, userId: number, showNotificationOnError = true): Observable<Member> {
    return this.apiService.post('json/membersManager/getMemberByUser', {
      'vo': voId,
      'user': userId
    }, showNotificationOnError);
  }

  getRichMember(memberId: number, showNotificationOnError = true): Observable<RichMember> {
    return this.apiService.post('json/membersManager/getRichMember', {
      'id': memberId
    }, showNotificationOnError);
  }

  setStatus(member: number, status: string, showNotificationOnError = true): Observable<Member> {
    return this.apiService.post('json/membersManager/setStatus', {
      'member': member,
      'status': status
    }, showNotificationOnError);
  }
}
