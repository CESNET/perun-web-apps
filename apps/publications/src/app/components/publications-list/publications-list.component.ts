import {
  AfterViewInit,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import {
  CabinetManagerService,
  Publication,
  PublicationForGUI,
  RichResource,
} from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import {
  customDataSourceSort,
  downloadData,
  getDataForExport,
  getDefaultDialogConfig,
  TABLE_ITEMS_COUNT_OPTIONS,
  TableWrapperComponent,
} from '@perun-web-apps/perun/utils';
import {
  GuiAuthResolver,
  NotificatorService,
  TableCheckboxModified,
} from '@perun-web-apps/perun/services';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ShowCiteDialogComponent } from '../../dialogs/show-cite-dialog/show-cite-dialog.component';
import { BehaviorSubject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'perun-web-apps-publications-list',
  templateUrl: './publications-list.component.html',
  styleUrls: ['./publications-list.component.scss'],
})
export class PublicationsListComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() publications: PublicationForGUI[];
  @Input() selection = new SelectionModel<PublicationForGUI>(true, []);
  @Input() cachedSubject: BehaviorSubject<boolean>;
  @Input() displayedColumns: string[] = [
    'select',
    'id',
    'lock',
    'title',
    'reportedBy',
    'year',
    'category',
    'thankedTo',
    'cite',
  ];
  @Input() tableId: string;
  @Input() pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
  @Input() routerPath: string;
  @Input() disabledRouting = false;
  @Input() openInTab = false;
  @Input() allowAlert = true;
  @Input() loading: boolean;
  @Output() publicationSelector: EventEmitter<PublicationForGUI> =
    new EventEmitter<PublicationForGUI>();
  @ViewChild(TableWrapperComponent, { static: true }) child: TableWrapperComponent;

  // contains all selected rows across all pages
  cachedSelection: SelectionModel<PublicationForGUI>;

  dataSource: MatTableDataSource<PublicationForGUI>;
  buttonPressed = false;
  changeLockMessage: string;
  lockAuth = false;
  locked: string;
  unlocked: string;

  private sort: MatSort;

  constructor(
    private tableCheckbox: TableCheckboxModified,
    private cabinetService: CabinetManagerService,
    private dialog: MatDialog,
    private notificator: NotificatorService,
    private translate: TranslateService,
    private authResolver: GuiAuthResolver,
    private destroyRef: DestroyRef,
  ) {
    translate
      .get('PUBLICATIONS_LIST.CHANGE_LOCK_SUCCESS')
      .subscribe((value: string) => (this.changeLockMessage = value));
    translate.get('PUBLICATIONS_LIST.LOCKED').subscribe((value: string) => (this.locked = value));
    translate
      .get('PUBLICATIONS_LIST.UNLOCKED')
      .subscribe((value: string) => (this.unlocked = value));
    this.lockAuth = this.authResolver.isCabinetAdmin();
  }

  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSource();
  }

  static getDataForColumn(data: PublicationForGUI, column: string): string {
    switch (column) {
      case 'id':
        return data.id.toString();
      case 'lock':
        return String(data.locked);
      case 'title':
        return data.title;
      case 'reportedBy': {
        let result = '';
        data.authors.forEach((a) => (result += a.firstName + ' ' + a.lastName + ';'));
        return result.slice(0, -1);
      }
      case 'year':
        return data.year.toString();
      case 'category':
        return data.categoryName;
      case 'thankedTo': {
        let res = '';
        data.thanks.forEach((t) => (res += t.ownerName + ';'));
        return res.slice(0, -1);
      }
      default:
        return data[column] as string;
    }
  }

  ngOnInit(): void {
    if (this.selection) {
      this.cachedSelection = new SelectionModel<PublicationForGUI>(
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

  ngOnChanges(): void {
    this.dataSource = new MatTableDataSource<PublicationForGUI>(this.publications);
    this.setDataSource();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.child.paginator;
  }

  exportAllData(format: string): void {
    downloadData(
      getDataForExport(
        this.dataSource.filteredData,
        this.displayedColumns,
        PublicationsListComponent.getDataForColumn,
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
        PublicationsListComponent.getDataForColumn,
      ),
      format,
    );
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    return this.tableCheckbox.isAllSelected(this.selection.selected.length, this.dataSource);
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.tableCheckbox.masterToggle(
      this.isAllSelected(),
      this.selection,
      this.cachedSelection,
      '',
      this.dataSource,
      this.sort,
      this.child.paginator.pageSize,
      this.child.paginator.pageIndex,
      false,
    );
  }

  itemSelectionToggle(item: RichResource): void {
    this.selection.toggle(item);
    this.cachedSelection.toggle(item);
  }

  showCite(publication: PublicationForGUI): void {
    const config = getDefaultDialogConfig();
    config.width = '500px';
    config.data = publication;

    this.dialog.open(ShowCiteDialogComponent, config);
  }

  lockOrUnlockPublication(publication: PublicationForGUI): void {
    this.cabinetService
      .lockPublications({
        publications: [this.createPublication(publication)],
        lock: !publication.locked,
      })
      .subscribe(() => {
        if (publication.locked) {
          this.notificator.showSuccess(this.changeLockMessage + this.unlocked);
        } else {
          this.notificator.showSuccess(this.changeLockMessage + this.locked);
        }
        publication.locked = !publication.locked;
      });
  }

  emitPublication(publication: PublicationForGUI): void {
    this.publicationSelector.emit(publication);
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

  private setDataSource(): void {
    if (this.dataSource) {
      this.dataSource.sortData = (data: PublicationForGUI[], sort: MatSort): PublicationForGUI[] =>
        customDataSourceSort(data, sort, PublicationsListComponent.getDataForColumn);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.child.paginator;
    }
  }

  private createPublication(publication: PublicationForGUI): Publication {
    return {
      id: publication.id,
      beanName: publication.beanName,
      externalId: publication.externalId,
      publicationSystemId: publication.publicationSystemId,
      categoryId: publication.categoryId,
      createdBy: publication.createdBy,
      createdDate: publication.createdDate,
      doi: publication.doi,
      isbn: publication.isbn,
      locked: publication.locked,
      main: publication.main,
      rank: publication.rank,
      title: publication.title,
      year: publication.year,
    };
  }
}
