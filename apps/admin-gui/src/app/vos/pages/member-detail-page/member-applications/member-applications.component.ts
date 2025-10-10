import { TranslateModule } from '@ngx-translate/core';
import {
  ApplicationsListComponent,
  DebounceFilterComponent,
  RefreshButtonComponent,
} from '@perun-web-apps/perun/components';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  Application,
  Member,
  PaginatedRichApplications,
  RegistrarManagerService,
} from '@perun-web-apps/perun/openapi';
import {
  TABLE_MEMBER_APPLICATIONS_DETAILED,
  TABLE_MEMBER_APPLICATIONS_NORMAL,
} from '@perun-web-apps/config/table-config';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { EntityStorageService, PerunTranslateService } from '@perun-web-apps/perun/services';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { PageQuery } from '@perun-web-apps/perun/models';
import { downloadApplicationsData, getDataForExport } from '@perun-web-apps/perun/utils';
import {
  dateToString,
  getExportDataForColumn,
  getSortDataColumnQuery,
} from '@perun-web-apps/perun/utils';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    DebounceFilterComponent,
    RefreshButtonComponent,
    TranslateModule,
    ApplicationsListComponent,
    LoadingTableComponent,
    LoaderDirective,
  ],
  standalone: true,
  selector: 'app-member-applications',
  templateUrl: './member-applications.component.html',
  styleUrls: ['./member-applications.component.scss'],
})
export class MemberApplicationsComponent implements OnInit {
  memberId: number;
  member: Member;
  displayedColumns: string[] = [
    'id',
    'createdAt',
    'type',
    'state',
    'user',
    'groupName',
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
    'user',
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

  applications: Application[] = [];
  nextPage = new BehaviorSubject<PageQuery>({});
  applicationsPage$: Observable<PaginatedRichApplications> = this.nextPage.pipe(
    switchMap((pageQuery) =>
      this.registrarService.getApplicationsPage({
        vo: this.member.voId,
        query: {
          pageSize: pageQuery.pageSize,
          offset: pageQuery.offset,
          order: pageQuery.order,
          sortColumn: getSortDataColumnQuery(pageQuery.sortColumn),
          searchString: pageQuery.searchString,
          getDetails: this.showAllDetails,
          dateFrom: dateToString(this.dateFrom),
          dateTo: dateToString(new Date()),
          userId: this.member.userId,
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
    this.member = this.entityStorageService.getEntity();
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

  downloadAll(a: { format: string; length: number }): void {
    const query = this.nextPage.getValue();

    this.registrarService
      .getApplicationsPage({
        vo: this.member.voId,
        query: {
          order: query.order,
          pageSize: a.length,
          offset: 0,
          searchString: query.searchString,
          sortColumn: getSortDataColumnQuery(query.sortColumn),
          getDetails: this.showAllDetails,
          dateFrom: dateToString(this.dateFrom),
          dateTo: dateToString(new Date()),
          userId: this.member.userId,
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
