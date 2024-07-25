import { Component, DestroyRef, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  BlockedLogin,
  InvitationsManagerService,
  InvitationsOrderColumn,
  InvitationStatus,
  InvitationWithSender,
  PaginatedInvitationsWithSender,
  RichGroup,
} from '@perun-web-apps/perun/openapi';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { PageQuery } from '@perun-web-apps/perun/models';
import { EntityStorageService } from '@perun-web-apps/perun/services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CacheHelperService } from '../../../../core/services/common/cache-helper.service';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { TABLE_GROUP_INVITATIONS } from '@perun-web-apps/config/table-config';
import { downloadData, getDataForExport } from '@perun-web-apps/perun/utils';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-group-invitations',
  templateUrl: './group-invitations.component.html',
  styleUrls: ['./group-invitations.component.scss'],
})
export class GroupInvitationsComponent implements OnInit {
  static id = 'GroupInvitationsComponent';
  group: RichGroup;
  selection = new SelectionModel<InvitationWithSender>(
    false,
    [],
    true,
    (invitation1, invitation2) => invitation1.id === invitation2.id,
  );
  cacheSubject = new BehaviorSubject(true);
  displayedColumns = [
    'checkbox',
    'id',
    'status',
    'expiration',
    'receiverName',
    'receiverEmail',
    'senderName',
  ];
  invitations: InvitationWithSender[] = [];
  nextPage = new BehaviorSubject<PageQuery>({});
  invitationsPage$: Observable<PaginatedInvitationsWithSender> = this.nextPage.pipe(
    switchMap((pageQuery) =>
      this.invitationsManager.getInvitationsPage({
        group: this.group.id,
        query: {
          order: pageQuery.order,
          pageSize: pageQuery.pageSize,
          offset: pageQuery.offset,
          sortColumn: this.getSortDataColumnQuery(pageQuery.sortColumn),
          searchString: pageQuery.searchString,
          statuses: this.selectedStatuses,
          expirationFrom: this.expirationDateToString(this.startDate.value),
          expirationTo: this.expirationDateToString(this.endDate.value),
        },
      }),
    ),
    // 'Tapping' is generally a last resort
    tap((page) => {
      this.invitations = page.data;
      this.selection.clear();
      setTimeout(() => this.loadingSubject$.next(false), 200);
    }),
    startWith({ data: [], totalCount: 0, offset: 0, pageSize: 0 }),
  );

  loadingSubject$ = new BehaviorSubject(false);
  loading$: Observable<boolean> = merge(
    this.loadingSubject$,
    this.nextPage.pipe(map((): boolean => true)),
  );
  tableId = TABLE_GROUP_INVITATIONS;
  statuses = new FormControl(['']);
  statusList = ['PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED', 'UNSENT'];
  selectedStatuses: InvitationStatus[] = ['PENDING'];
  searchString = '';
  startDate: FormControl<Date> = new FormControl<Date>(null);
  endDate: FormControl<Date> = new FormControl<Date>(null);

  constructor(
    private entityStorageService: EntityStorageService,
    private destroyRef: DestroyRef,
    private cacheHelperService: CacheHelperService,
    private invitationsManager: InvitationsManagerService,
  ) {}

  ngOnInit(): void {
    this.statuses.setValue(this.selectedStatuses);
    this.group = this.entityStorageService.getEntity();

    this.startDate.valueChanges.subscribe(() => this.refreshTable());
    this.endDate.valueChanges.subscribe(() => this.refreshTable());

    // Refresh cached data
    this.cacheHelperService
      .refreshComponentCachedData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((nextValue) => {
        if (nextValue === GroupInvitationsComponent.id) {
          this.refreshTable();
        }
      });
  }

  refreshTable(): void {
    this.cacheSubject.next(true);
    this.nextPage.next(this.nextPage.value);
  }

  changeInvitationStatus(): void {
    this.selectedStatuses = this.statuses.value as InvitationStatus[];
    this.refreshTable();
  }

  displaySelectedStatuses(): string {
    if (this.selectedStatuses.length === this.statusList.length) {
      return 'ALL';
    }
    const statuses: string[] = this.statuses.value;
    if (statuses) {
      return `${statuses[0]}  ${
        statuses.length > 1
          ? '(+' +
            (statuses.length - 1).toString() +
            ' ' +
            (statuses.length === 2 ? 'other)' : 'others)')
          : ''
      }`;
    }
    return '';
  }

  onSearchByString(filter: string): void {
    this.searchString = filter;
    this.refreshTable();
  }

  downloadAll(a: {
    format: string;
    length: number;
    getDataForColumnFun: (data: BlockedLogin, column: string) => string;
  }): void {
    const query = this.nextPage.getValue();

    this.invitationsManager
      .getInvitationsPage({
        group: this.group.id,
        query: {
          order: query.order,
          pageSize: a.length,
          offset: 0,
          sortColumn: this.getSortDataColumnQuery(query.sortColumn),
          searchString: query.searchString,
          statuses: this.selectedStatuses,
          expirationFrom: this.expirationDateToString(this.startDate.value),
          expirationTo: this.expirationDateToString(this.endDate.value),
        },
      })
      .subscribe({
        next: (paginatedGroups) => {
          downloadData(
            getDataForExport(paginatedGroups.data, this.displayedColumns, a.getDataForColumnFun),
            a.format,
          );
        },
      });
  }

  private expirationDateToString(date: Date): string | null {
    return date ? formatDate(date, 'yyyy-MM-dd', 'en-GB') : null;
  }

  private getSortDataColumnQuery(column: string): InvitationsOrderColumn {
    if (!column) {
      return InvitationsOrderColumn.ID;
    }
    switch (column.toUpperCase()) {
      case 'ID':
        return InvitationsOrderColumn.ID;
      case 'STATUS':
        return InvitationsOrderColumn.STATUS;
      case 'EXPIRATION':
        return InvitationsOrderColumn.EXPIRATION;
      case 'RECEIVERNAME':
        return InvitationsOrderColumn.RECEIVER_NAME;
      case 'RECEIVEREMAIL':
        return InvitationsOrderColumn.RECEIVER_EMAIL;
      case 'SENDERNAME':
        return InvitationsOrderColumn.SENDER_NAME;
      default:
        return InvitationsOrderColumn.ID;
    }
  }
}
