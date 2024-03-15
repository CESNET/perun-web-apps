import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PageQuery } from '@perun-web-apps/perun/models';
import {
  MemberGroupStatus,
  MembersManagerService,
  MembersOrderColumn,
  PaginatedRichMembers,
  RichMember,
  VoMemberStatuses,
} from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { startWith, switchMap, tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { downloadData, getDataForExport } from '@perun-web-apps/perun/utils';

@Injectable({
  providedIn: 'root',
})
export class MembersListService {
  nextPageHandler(
    nextPage: BehaviorSubject<PageQuery>,
    membersService: MembersManagerService,
    voId: number,
    attrNames: string[],
    statuses: FormControl<string[]>,
    groupId: number,
    groupStatuses: FormControl<string[]>,
    selection: SelectionModel<RichMember>,
    loadingSubject$: BehaviorSubject<boolean>,
  ): Observable<PaginatedRichMembers> {
    return nextPage.pipe(
      switchMap((pageQuery) =>
        membersService.getMembersPage({
          vo: voId,
          attrNames: attrNames,
          query: {
            pageSize: pageQuery.pageSize,
            offset: pageQuery.offset,
            order: pageQuery.order,
            sortColumn: this.getSortColumn(pageQuery.sortColumn),
            searchString: pageQuery.searchString,
            statuses: statuses?.value as VoMemberStatuses[],
            groupId: groupId,
            groupStatuses: groupStatuses?.value as MemberGroupStatus[],
          },
        }),
      ),
      // 'Tapping' is generally a last resort
      tap(() => {
        selection.clear();
        setTimeout(() => loadingSubject$.next(false), 200);
      }),
      startWith({ data: [], totalCount: 0, offset: 0, pageSize: 0 }),
    );
  }

  downloadAll(
    format: string,
    length: number,
    getDataForColumnFun: (data: RichMember, column: string) => string,
    nextPage: BehaviorSubject<PageQuery>,
    membersService: MembersManagerService,
    voId: number,
    attrNames: string[],
    statuses: FormControl<string[]>,
    groupId: number,
    groupStatuses: FormControl<string[]>,
    displayedColumns: string[],
  ): void {
    const pageQuery = nextPage.getValue();

    membersService
      .getMembersPage({
        vo: voId,
        attrNames: attrNames,
        query: {
          order: pageQuery.order,
          pageSize: length,
          offset: 0,
          sortColumn: this.getSortColumn(pageQuery.sortColumn),
          searchString: pageQuery.searchString,
          statuses: statuses.value as VoMemberStatuses[],
          groupId: groupId,
          groupStatuses: groupStatuses?.value as MemberGroupStatus[],
        },
      })
      .subscribe({
        next: (paginatedGroups) => {
          downloadData(
            getDataForExport(paginatedGroups.data, displayedColumns, getDataForColumnFun),
            format,
          );
        },
      });
  }

  getSortColumn(value: string): MembersOrderColumn {
    switch (value?.toUpperCase()) {
      case 'FULLNAME':
        return MembersOrderColumn.NAME;
      case 'ORGANIZATION':
        return MembersOrderColumn.ORGANIZATION;
      case 'EMAIL':
        return MembersOrderColumn.EMAIL;
      case 'STATUS':
        return MembersOrderColumn.STATUS;
      case 'GROUPSTATUS':
        return MembersOrderColumn.GROUP_STATUS;
      default:
        return MembersOrderColumn.ID;
    }
  }
}
