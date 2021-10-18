import { Injectable } from '@angular/core';
import {
  AuditMessagesManagerService,
  MemberGroupStatus,
  MembersManagerService,
  MembersOrderColumn, PaginatedAuditMessages,
  PaginatedRichMembers, PaginatedRichUsers,
  SortingOrder, UsersManagerService, UsersOrderColumn, VoMemberStatuses
} from '@perun-web-apps/perun/openapi';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DynamicPaginatingService {

  constructor(private membersService: MembersManagerService,
              private usersService: UsersManagerService,
              private auditMessagesManagerService: AuditMessagesManagerService) { }

  getMembers(voId: number,
             attrNames: string[],
             sortOrder: SortingOrder,
             pageNumber: number,
             pageSize : number,
             sortColumn: MembersOrderColumn,
             statuses: VoMemberStatuses[],
             searchString?: string,
             groupId?: number,
             groupStatuses?: MemberGroupStatus[]): Observable<PaginatedRichMembers> {
    return this.membersService.getMembersPage({
      vo: voId,
      attrNames: attrNames,
      query: {pageSize: pageSize,
        offset: pageNumber*pageSize,
        order: sortOrder,
        sortColumn: sortColumn,
        statuses: statuses,
        searchString: searchString,
        groupId: groupId,
        groupStatuses: groupStatuses}})

  }

  getUsers(attrNames: string[],
           order: SortingOrder,
           pageNumber: number,
           pageSize: number,
           sortColumn: UsersOrderColumn,
           searchString: string,
           withoutVo: boolean): Observable<PaginatedRichUsers> {
    return this.usersService.getUsersPage({
      attrNames: attrNames,
      query: {
        offset: pageSize*pageNumber,
        pageSize: pageSize,
        order: order,
        sortColumn: sortColumn,
        searchString: searchString,
        withoutVo: withoutVo
      }
    });
  }

  getAuditMessages(order: SortingOrder,
           pageNumber: number,
           pageSize: number): Observable<PaginatedAuditMessages> {
    return this.auditMessagesManagerService.getMessagesPage({
      query: {
        offset: pageSize*pageNumber,
        pageSize: pageSize,
        order: order
      }
    });
  }
}
