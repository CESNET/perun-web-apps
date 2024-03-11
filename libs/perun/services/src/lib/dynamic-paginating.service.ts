import { Injectable } from '@angular/core';
import {
  ApplicationsOrderColumn,
  AppState,
  AuditMessagesManagerService,
  MemberGroupStatus,
  MembersManagerService,
  MembersOrderColumn,
  PaginatedRichApplications,
  PaginatedRichMembers,
  PaginatedRichUsers,
  RegistrarManagerService,
  SortingOrder,
  UsersManagerService,
  UsersOrderColumn,
  VoMemberStatuses,
  ConsentStatus,
} from '@perun-web-apps/perun/openapi';
import { Observable } from 'rxjs';
import { BlockedLoginsOrderColumn, PaginatedBlockedLogins } from '@perun-web-apps/perun/openapi';

@Injectable({
  providedIn: 'root',
})
export class DynamicPaginatingService {
  constructor(
    private membersService: MembersManagerService,
    private usersService: UsersManagerService,
    private auditMessagesManagerService: AuditMessagesManagerService,
    private registrarService: RegistrarManagerService,
  ) {}

  getMembers(
    voId: number,
    attrNames: string[],
    sortOrder: SortingOrder,
    pageNumber: number,
    pageSize: number,
    sortColumn: MembersOrderColumn,
    statuses: VoMemberStatuses[],
    searchString?: string,
    groupId?: number,
    groupStatuses?: MemberGroupStatus[],
  ): Observable<PaginatedRichMembers> {
    return this.membersService.getMembersPage({
      vo: voId,
      attrNames: attrNames,
      query: {
        pageSize: pageSize,
        offset: pageNumber * pageSize,
        order: sortOrder,
        sortColumn: sortColumn,
        statuses: statuses,
        searchString: searchString,
        groupId: groupId,
        groupStatuses: groupStatuses,
      },
    });
  }

  getUsers(
    attrNames: string[],
    order: SortingOrder,
    pageNumber: number,
    pageSize: number,
    sortColumn: UsersOrderColumn,
    searchString: string,
    withoutVo: boolean,
    facilityId: number,
    voId: number,
    resourceId: number,
    serviceId: number,
    onlyAllowed: boolean,
    consentStatuses: ConsentStatus[],
  ): Observable<PaginatedRichUsers> {
    return this.usersService.getUsersPage({
      attrNames: attrNames,
      query: {
        offset: pageSize * pageNumber,
        pageSize: pageSize,
        order: order,
        sortColumn: sortColumn,
        searchString: searchString,
        withoutVo: withoutVo,
        facilityId: facilityId,
        voId: voId,
        resourceId: resourceId,
        serviceId: serviceId,
        onlyAllowed: onlyAllowed,
        consentStatuses: consentStatuses,
      },
    });
  }

  getBlockedLogins(
    pageSize: number,
    pageNumber: number,
    order: SortingOrder,
    sortColumn: BlockedLoginsOrderColumn,
    searchString?: string,
    namespaces?: string[],
  ): Observable<PaginatedBlockedLogins> {
    return this.usersService.getBlockedLoginsPage({
      query: {
        pageSize: pageSize,
        offset: pageSize * pageNumber,
        order: order,
        sortColumn: sortColumn,
        namespaces: namespaces,
        searchString: searchString,
      },
    });
  }

  getApplications(
    pageSize: number,
    pageIndex: number,
    sortOrder: SortingOrder,
    sortColumn: ApplicationsOrderColumn,
    includeGroupApps: boolean,
    searchString: string,
    states: AppState[],
    dateFrom: string,
    dateTo: string,
    userId: number,
    voId: number,
    groupId: number,
    getDetails: boolean,
  ): Observable<PaginatedRichApplications> {
    return this.registrarService.getApplicationsPage({
      vo: voId,
      query: {
        pageSize: pageSize,
        offset: pageIndex * pageSize,
        order: sortOrder,
        sortColumn: sortColumn,
        searchString: searchString,
        includeGroupApplications: includeGroupApps,
        getDetails: getDetails,
        states: states,
        dateFrom: dateFrom,
        dateTo: dateTo,
        userId: userId,
        groupId: groupId,
      },
    });
  }
}
