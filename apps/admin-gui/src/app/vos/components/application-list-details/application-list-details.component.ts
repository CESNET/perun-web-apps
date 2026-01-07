import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MiddleClickRouterLinkDirective } from '@perun-web-apps/perun/directives';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import {
  Application,
  ApplicationFormItem,
  Group,
  Member,
  RegistrarManagerService,
} from '@perun-web-apps/perun/openapi';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import {
  downloadData,
  getDataForExport,
  parseFullName,
  TABLE_ITEMS_COUNT_OPTIONS,
} from '@perun-web-apps/perun/utils';
import { TableWrapperComponent } from '@perun-web-apps/perun/table-utils';
import { GuiAuthResolver } from '@perun-web-apps/perun/services';
import {
  ModifiedNamePipe,
  SelectApplicationLinkPipe,
  UserFullNamePipe,
} from '@perun-web-apps/perun/pipes';
import { AppCreatedByNamePipe } from '@perun-web-apps/perun/pipes';
import { TableConfigService } from '@perun-web-apps/config/table-config';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface ApplicationData extends Application {
  formItem?: ApplicationFormItem;
  shortname?: string;
  value?: string;
  assuranceLevel?: string;
  prefilledValue?: string;
}

/**
 * @deprecated it seems that this component is no longer used anywhere
 */
@Component({
  imports: [
    CommonModule,
    UiAlertsModule,
    MiddleClickRouterLinkDirective,
    TableWrapperComponent,
    RouterModule,
    MatTableModule,
    MatProgressSpinnerModule,
    TranslateModule,
    UserFullNamePipe,
    SelectApplicationLinkPipe,
    ModifiedNamePipe,
    AppCreatedByNamePipe,
  ],
  standalone: true,
  selector: 'app-perun-web-apps-application-list-details',
  templateUrl: './application-list-details.component.html',
  styleUrls: ['./application-list-details.component.scss'],
})
export class ApplicationListDetailsComponent implements OnChanges, OnInit {
  @Input()
  applications: Application[] = [];
  @Input()
  group: Group;
  @Input()
  member: Member;
  @Input()
  filterValue: string;
  @Input()
  disableRouting = false;
  @ViewChild(TableWrapperComponent, { static: true }) child: TableWrapperComponent;

  displayedColumns: string[] = [
    'id',
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
    'createdAt',
    'modifiedBy',
    'modifiedAt',
    'fedInfo',
  ];
  unfilteredColumns = this.displayedColumns;
  dataSource: MatTableDataSource<ApplicationData>;
  loading = false;
  table: ApplicationData[] = [];
  addedColumns = new Set<string>();
  pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
  tableId = 'app-perun-web-apps-application-list-details';

  constructor(
    private router: Router,
    private authResolver: GuiAuthResolver,
    private registrarManager: RegistrarManagerService,
    private destroyRef: DestroyRef,
    private tableConfigService: TableConfigService,
  ) {}

  ngOnInit(): void {
    this.watchForIdColumnChanges();
  }

  ngOnChanges(): void {
    if (localStorage.getItem('showIds') !== 'true') {
      this.displayedColumns = this.displayedColumns.filter((column) => column !== 'id');
    }
    this.loading = true;
    this.table = [];
    this.initialize();
    this.getApplicationsData(0);
  }

  getExportDataForColumn(data: Application, column: string): string {
    switch (column) {
      case 'id':
        return data.id.toString();
      case 'voId':
        return data.vo.id.toString();
      case 'voName':
        return data.vo.name;
      case 'groupId':
        return data.group?.id.toString() ?? '';
      case 'groupName':
        return data.group?.name ?? '';
      case 'type':
        return data.type;
      case 'fedInfo':
        return data.fedInfo;
      case 'state':
        return data.state;
      case 'extSourceName':
        return data.extSourceName;
      case 'extSourceType':
        return data.extSourceType;
      case 'user':
        return data.user ? parseFullName(data.user) : '';
      case 'createdBy':
        return data.createdBy;
      case 'createdAt':
        return data.createdAt;
      case 'modifiedBy':
        return data.modifiedBy;
      case 'modifiedAt':
        return data.modifiedAt;
      default:
        return data[column] as string;
    }
  }

  exportAllData(format: string): void {
    downloadData(
      getDataForExport(
        this.dataSource.filteredData,
        this.displayedColumns,
        this.getExportDataForColumn.bind(ApplicationListDetailsComponent) as (
          data: Record<string, unknown>,
          column: string,
        ) => string,
      ),
      format,
    );
  }

  exportDisplayedData(format: string): void {
    const start = this.dataSource.paginator.pageIndex * this.dataSource.paginator.pageSize;
    const end = start + this.dataSource.paginator.pageSize;
    downloadData(
      getDataForExport(
        this.dataSource
          .sortData(this.dataSource.filteredData, this.dataSource.sort)
          .slice(start, end),
        this.displayedColumns,
        this.getExportDataForColumn.bind(ApplicationListDetailsComponent) as (
          data: Record<string, unknown>,
          column: string,
        ) => string,
      ),
      format,
    );
  }

  getApplicationsData(index: number): void {
    if (this.applications.length === index) {
      this.initialize();
      return;
    }
    const application: Application = this.applications[index];
    const obj = {};
    obj['id'] = application.id;
    obj['vo'] = application.vo;
    obj['group'] = application.group;
    obj['type'] = application.type;
    obj['fedInfo'] = application.fedInfo;
    obj['state'] = application.state;
    obj['extSourceName'] = application.extSourceName;
    obj['extSourceType'] = application.extSourceType;
    obj['extSourceLoa'] = application.extSourceLoa;
    obj['user'] = application.user;
    obj['createdBy'] = application.createdBy;
    obj['createdAt'] = application.createdAt;
    obj['modifiedBy'] = application.modifiedBy;
    obj['modifiedAt'] = application.modifiedAt;
    this.registrarManager.getApplicationDataById(application.id).subscribe((data) => {
      for (const item of data) {
        if (
          item.formItem.i18n['en'].label !== null &&
          item.formItem.i18n['en'].label.length !== 0
        ) {
          obj[item.formItem.i18n['en'].label] = item.value;
          this.addedColumns.add(item.formItem.i18n['en'].label);
        } else {
          obj[item.shortname] = item.value;
          this.addedColumns.add(item.shortname);
        }
      }
      this.table.push(obj);
      this.getApplicationsData(index + 1);
    });
  }

  initialize(): void {
    for (const val of this.addedColumns) {
      this.displayedColumns.push(val);
    }
    this.dataSource = new MatTableDataSource(this.table);
    this.dataSource.paginator = this.child.paginator;
    this.dataSource.filter = this.filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.loading = false;
  }

  private watchForIdColumnChanges(): void {
    this.tableConfigService.showIdsChanged
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((showIds) => {
        if (showIds) {
          this.displayedColumns = this.unfilteredColumns;
        } else {
          this.displayedColumns = this.unfilteredColumns.filter((column) => column !== 'id');
        }
      });
    if (localStorage.getItem('showIds') !== 'true') {
      this.displayedColumns = this.displayedColumns.filter((column) => column !== 'id');
    }
  }
}
