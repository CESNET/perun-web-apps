import { Component, OnInit } from '@angular/core';
import {
  TABLE_MEMBER_APPLICATIONS_DETAILED,
  TABLE_MEMBER_APPLICATIONS_NORMAL,
} from '@perun-web-apps/config/table-config';
import {
  Application,
  AppState,
  PaginatedRichApplications,
  RegistrarManagerService,
  User,
} from '@perun-web-apps/perun/openapi';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { PageQuery } from '@perun-web-apps/perun/models';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import {
  dateToString,
  downloadApplicationsData,
  getDataForExport,
  getExportDataForColumn,
  getSortDataColumnQuery,
} from '@perun-web-apps/perun/utils';
import { EntityStorageService, PerunTranslateService } from '@perun-web-apps/perun/services';

@Component({
  selector: 'app-user-applications',
  templateUrl: './user-applications.component.html',
  styleUrls: ['./user-applications.component.scss'],
})
export class UserApplicationsComponent implements OnInit {
  user: User;
  userId: number;
  displayedColumns: string[] = [
    'id',
    'voName',
    'groupName',
    'createdAt',
    'type',
    'state',
    'modifiedBy',
  ];
  detailedDisplayedColumns: string[] = [
    'id',
    'createdAt',
    'voId',
    'voName',
    'groupId',
    'groupName',
    'type',
    'state',
    'extSourceName',
    'extSourceType',
    'createdBy',
    'modifiedBy',
    'modifiedAt',
    'fedInfo',
  ];
  filterValue = '';
  showAllDetails = false;
  detailTableId = TABLE_MEMBER_APPLICATIONS_DETAILED;
  tableId = TABLE_MEMBER_APPLICATIONS_NORMAL;
  dateFrom: Date = new Date('1970-01-01');

  currentStates: AppState[] = ['NEW', 'VERIFIED'];

  applications: Application[] = [];
  nextPage = new BehaviorSubject<PageQuery>({});
  applicationsPage$: Observable<PaginatedRichApplications> = this.nextPage.pipe(
    switchMap((pageQuery) =>
      this.registrarService.getApplicationsPage({
        query: {
          pageSize: pageQuery.pageSize,
          offset: pageQuery.offset,
          order: pageQuery.order,
          sortColumn: getSortDataColumnQuery(pageQuery.sortColumn),
          searchString: pageQuery.searchString,
          getDetails: this.showAllDetails,
          dateFrom: dateToString(this.dateFrom),
          dateTo: dateToString(new Date()),
          userId: this.user.id,
          states: this.currentStates,
        },
      }),
    ),
    // 'Tapping' is generally a last resort
    tap((page) => {
      this.applications = page.data;
      setTimeout(() => this.loadingSubject$.next(false), 200);
    }),
    startWith({ data: [], totalCount: 0, offset: 0, pageSize: 0 }),
  );
  loadingSubject$ = new BehaviorSubject(false);
  loading$: Observable<boolean> = merge(
    this.loadingSubject$,
    this.nextPage.pipe(map((): boolean => true)),
  );
  constructor(
    private entityStorageService: EntityStorageService,
    private registrarService: RegistrarManagerService,
    private translate: PerunTranslateService,
  ) {}

  ngOnInit(): void {
    this.user = this.entityStorageService.getEntity();
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.refreshTable();
  }

  showDetails(): void {
    this.showAllDetails = !this.showAllDetails;
  }

  refreshTable(): void {
    this.nextPage.next(this.nextPage.value);
  }

  statesChanged(states: AppState[]): void {
    this.currentStates = states;
    this.refreshTable();
  }

  downloadAll(a: { format: string; length: number }): void {
    const query = this.nextPage.getValue();

    this.registrarService
      .getApplicationsPage({
        query: {
          order: query.order,
          pageSize: a.length,
          offset: 0,
          searchString: query.searchString,
          sortColumn: getSortDataColumnQuery(query.sortColumn),
          getDetails: this.showAllDetails,
          dateFrom: dateToString(this.dateFrom),
          dateTo: dateToString(new Date()),
          userId: this.user.id,
          states: this.currentStates,
        },
      })
      .subscribe({
        next: (paginatedGroups) => {
          downloadApplicationsData(
            getDataForExport(
              paginatedGroups.data,
              this.showAllDetails ? this.detailedDisplayedColumns : this.displayedColumns,
              getExportDataForColumn,
            ),
            this.translate,
            a.format,
          );
        },
      });
  }
}
