import { Component, OnInit } from '@angular/core';
import { TABLE_AUDIT_MESSAGES } from '@perun-web-apps/config/table-config';
import {
  AuditMessage,
  AuditMessagesManagerService,
  PaginatedAuditMessages,
} from '@perun-web-apps/perun/openapi';
import { BehaviorSubject, merge, Observable, switchMap } from 'rxjs';
import { PageQuery } from '@perun-web-apps/perun/models';
import { map, startWith, tap } from 'rxjs/operators';

@Component({
  selector: 'app-admin-audit-log',
  templateUrl: './admin-audit-log.component.html',
  styleUrls: ['./admin-audit-log.component.scss'],
})
export class AdminAuditLogComponent implements OnInit {
  tableId = TABLE_AUDIT_MESSAGES;

  displayedColumns = ['id', 'timestamp', 'name', 'actor', 'event.message', 'detail'];
  auditMessages: AuditMessage[];
  selectedEvents: string[] = [];
  eventOptions: string[] = [];
  eventOptionsForSearchSelect: string[] = [];
  nextPage = new BehaviorSubject<PageQuery>({});
  resetPagination = new BehaviorSubject(false);
  messagesPage$: Observable<PaginatedAuditMessages> = this.nextPage.pipe(
    switchMap((pageQuery) =>
      this.auditMessagesManagerService.getMessagesPage({
        query: {
          offset: pageQuery.offset,
          pageSize: pageQuery.pageSize,
          order: pageQuery.order,
          selectedEvents: this.selectedEvents,
        },
      }),
    ),
    // 'Tapping' is generally a last resort
    tap((page) => {
      this.auditMessages = page.data;
      setTimeout(() => this.loadingSubject$.next(false), 200);
    }),
    startWith({ data: [], totalCount: 0, offset: 0, pageSize: 0 }),
  );

  loadingSubject$ = new BehaviorSubject(false);
  loading$: Observable<boolean> = merge(
    this.loadingSubject$,
    this.nextPage.pipe(map((): boolean => true)),
  );
  constructor(private auditMessagesManagerService: AuditMessagesManagerService) {}

  ngOnInit(): void {
    this.auditMessagesManagerService.findAllPossibleEvents().subscribe((res) => {
      this.eventOptions = res.sort();
      this.eventOptionsForSearchSelect = this.eventOptions;
    });
  }

  refreshTable(): void {
    this.resetPagination.next(true);
    this.nextPage.next(this.nextPage.value);
  }

  toggleEvent(events: string[]): void {
    // Replace array in-place so it won't trigger ngOnChanges
    this.selectedEvents.splice(0, this.selectedEvents.length, ...events);
  }

  refreshOnClosed(): void {
    this.selectedEvents = [...this.selectedEvents];
    const otherEntities = this.eventOptions.filter((e) => !this.selectedEvents.includes(e));
    this.eventOptionsForSearchSelect = [...this.selectedEvents, ...otherEntities];
    this.refreshTable();
  }
}
