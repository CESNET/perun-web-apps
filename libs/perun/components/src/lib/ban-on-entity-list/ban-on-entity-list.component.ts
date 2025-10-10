import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  customDataSourceFilterPredicate,
  customDataSourceSort,
  downloadData,
  getDataForExport,
  TABLE_ITEMS_COUNT_OPTIONS,
} from '@perun-web-apps/perun/utils';
import {
  EnrichedBanOnFacility,
  EnrichedBanOnResource,
  EnrichedBanOnVo,
  Facility,
  Resource,
  RichMember,
  RichUser,
  User,
  Vo,
} from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { GuiAuthResolver, TableCheckbox } from '@perun-web-apps/perun/services';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  UserFullNamePipe,
  IsAllSelectedPipe,
  IsAuthorizedPipe,
  CheckboxLabelPipe,
  MasterCheckboxLabelPipe,
} from '@perun-web-apps/perun/pipes';
import { formatDate, CommonModule } from '@angular/common';
import { BAN_EXPIRATION_NEVER } from '../ban-specification/ban-specification.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';
import { TableWrapperComponent } from '@perun-web-apps/perun/table-utils';

export type EnrichedBan = EnrichedBanOnVo | EnrichedBanOnFacility | EnrichedBanOnResource;
export type BanOnEntityListColumn =
  | 'select'
  | 'banId'
  | 'targetName'
  | 'targetId'
  | 'subjectName'
  | 'subjectId'
  | 'description'
  | 'expiration'
  | 'edit';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    UiAlertsModule,
    IsAllSelectedPipe,
    TableWrapperComponent,
    MatTableModule,
    MatSortModule,
    TranslateModule,
    MatTooltip,
    IsAuthorizedPipe,
    UserFullNamePipe,
    CheckboxLabelPipe,
    MasterCheckboxLabelPipe,
  ],
  standalone: true,
  selector: 'perun-web-apps-ban-on-entity-list',
  templateUrl: './ban-on-entity-list.component.html',
  styleUrls: ['./ban-on-entity-list.component.scss'],
  providers: [UserFullNamePipe],
})
export class BanOnEntityListComponent implements OnInit {
  @Input() selection = new SelectionModel<EnrichedBan>(false, []);
  @Input() cachedSubject: BehaviorSubject<boolean>;
  @Input() tableId: string;
  @Input() updatePolicy: string;
  @Input() pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
  @Input() loading: boolean;
  @Input() columns: BanOnEntityListColumn[] = [
    'select',
    'banId',
    'targetId',
    'targetName',
    'subjectId',
    'subjectName',
    'description',
    'expiration',
    'edit',
  ];
  @Output() updateBan = new EventEmitter<EnrichedBan>();
  @ViewChild(TableWrapperComponent, { static: true }) tableWrapper: TableWrapperComponent;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  dataSource: MatTableDataSource<EnrichedBan>;
  target: string;
  subject: string;
  // contains all selected rows across all pages
  cachedSelection: SelectionModel<EnrichedBan>;
  // This date is set by backend as a 'never' expire option
  EXPIRE_NEVER = BAN_EXPIRATION_NEVER;

  constructor(
    private tableCheckbox: TableCheckbox,
    private authResolver: GuiAuthResolver,
    private userName: UserFullNamePipe,
    private destroyRef: DestroyRef,
  ) {}

  @Input() set bans(bans: EnrichedBan[]) {
    if (!this.dataSource) {
      this.dataSourceInit(bans);
    }
    if (bans.length !== 0) {
      this.setHeaderLabels(bans[0]);
    }

    this.dataSource.data = bans;
  }

  @Input() set filter(value: string) {
    this.dataSource.filter = value;
  }

  @Input() set displayedColumns(columns: BanOnEntityListColumn[]) {
    if (localStorage.getItem('showIds') !== 'true') {
      columns = columns.filter((column) => !column.endsWith('Id'));
    }
    this.columns = columns;
  }

  ngOnInit(): void {
    if (this.selection) {
      this.cachedSelection = new SelectionModel<EnrichedBan>(
        this.selection.isMultipleSelection(),
        [],
        true,
        this.selection.compareWith,
      );
      this.cachedSubject?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
        if (value) {
          this.cachedSelection.clear();
        }
      });
    }
  }

  getDataForColumn = (data: EnrichedBan, column: BanOnEntityListColumn): string => {
    const target: Vo | Facility | Resource = this.isFacilityBan(data)
      ? data.facility
      : this.isResourceBan(data)
        ? data.resource
        : data.vo;
    const subject: RichUser | RichMember = this.isFacilityBan(data) ? data.user : data.member;
    const subjectUser: User = this.isFacilityBan(data) ? data.user : data.member.user;
    switch (column) {
      case 'banId':
        return String(data.ban.id);
      case 'targetId':
        return String(target.id);
      case 'targetName':
        return target.name;
      case 'subjectId':
        return String(subject.id);
      case 'subjectName':
        return this.userName.transform(subjectUser);
      case 'description':
        return data.ban.description;
      case 'expiration':
        return Number(data.ban.validityTo) === this.EXPIRE_NEVER
          ? 'never'
          : formatDate(data.ban.validityTo, 'dd-MM-yyy', 'en');
      default:
        return '';
    }
  };

  exportAllData(format: string): void {
    downloadData(
      getDataForExport(this.dataSource.filteredData, this.columns, this.getDataForColumn),
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
        this.columns,
        this.getDataForColumn,
      ),
      format,
    );
  }

  toggle(ban: EnrichedBan): void {
    this.selection.toggle(ban);
  }

  masterToggle(allSelected: boolean): void {
    this.tableCheckbox.masterToggle(
      allSelected,
      this.selection,
      this.cachedSelection,
      this.dataSource.filter,
      this.dataSource,
      this.dataSource.sort,
      this.dataSource.paginator.pageSize,
      this.dataSource.paginator.pageIndex,
      false,
    );
  }

  toggleRow(row: EnrichedBan): void {
    this.selection.toggle(row);
    this.cachedSelection.toggle(row);
  }

  pageChanged(): void {
    if (this.cachedSelection) {
      this.tableCheckbox.selectCachedDataOnPage(
        this.dataSource,
        this.selection,
        this.cachedSelection,
        this.selection.compareWith,
      );
    }
  }

  private dataSourceInit(bans: EnrichedBan[]): void {
    this.dataSource = new MatTableDataSource(bans);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.tableWrapper.paginator;
    this.dataSource.filterPredicate = (data: EnrichedBan, filter: string): boolean =>
      customDataSourceFilterPredicate(data, filter, this.columns, this.getDataForColumn, true);
    this.dataSource.sortData = (data: EnrichedBan[], sort: MatSort): EnrichedBan[] =>
      customDataSourceSort(data, sort, this.getDataForColumn);
  }

  private isFacilityBan(ban: EnrichedBan): ban is EnrichedBanOnFacility {
    return 'facility' in ban;
  }

  private isResourceBan(ban: EnrichedBan): ban is EnrichedBanOnResource {
    return 'resource' in ban;
  }

  private setHeaderLabels(ban: EnrichedBan): void {
    // FIXME not scalable and misses translation
    if (this.isFacilityBan(ban)) {
      this.target = 'Facility';
      this.subject = 'User';
    } else if (this.isResourceBan(ban)) {
      this.target = 'Resource';
      this.subject = 'Member';
    } else {
      this.target = 'Organization';
      this.subject = 'Member';
    }
  }
}
