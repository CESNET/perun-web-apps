import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Application, Group, Member} from '@perun-web-apps/perun/openapi';
import {
  customDataSourceFilterPredicate,
  customDataSourceSort, downloadData, getDataForExport, parseFullName,
  TABLE_ITEMS_COUNT_OPTIONS, TableWrapperComponent
} from '@perun-web-apps/perun/utils';
import { GuiAuthResolver } from '@perun-web-apps/perun/services';

@Component({
  selector: 'app-applications-list',
  templateUrl: './applications-list.component.html',
  styleUrls: ['./applications-list.component.scss']
})
export class ApplicationsListComponent implements OnChanges, AfterViewInit {

  constructor(
    private authResolver: GuiAuthResolver,
    private changeDetector: ChangeDetectorRef) { }

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
  }

  @Input()
  applications: Application[] = [];

  @Input()
  group: Group;

  @Input()
  member: Member;

  @Input()
  displayedColumns: string[] = [];

  @Input()
  filterValue: string;

  @Input()
  pageSize = 10;

  @Input()
  disableRouting = false;

  @Output()
  page = new EventEmitter<PageEvent>();

  dataSource: MatTableDataSource<Application>;

  @ViewChild(TableWrapperComponent, {static: true}) child: TableWrapperComponent;

  private sort: MatSort;
  pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;

  ngAfterViewInit(): void {
    if (!this.authResolver.isPerunAdminOrObserver()){
      this.displayedColumns = this.displayedColumns.filter(column => column !== 'id');
    }
    this.setDataSource();
    this.changeDetector.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.dataSource = new MatTableDataSource<Application>(this.applications);
    this.setDataSource();
  }

  getDataForColumn(data: Application, column: string, outerThis: ApplicationsListComponent): string{
    switch (column) {
      case 'id':
        return data.id.toString();
      case 'createdAt':
        return data.createdAt;
      case 'type':
        return data.type;
      case 'state':
        return data.state;
      case 'user':
        return data.user ?
          data.user.lastName ? data.user.lastName : data.user.firstName ?? ''
          :
          data.createdBy.slice(data.createdBy.lastIndexOf('=')+1, data.createdBy.length);
      case 'group':
        return data.group ? data.group.name : '';
      case 'modifiedBy':
        return outerThis.parseModifiedBy(data);
      default:
        return '';
    }
  }

  getExportDataForColumn(data: Application, column: string, outerThis: ApplicationsListComponent): string{
    switch (column) {
      case 'id':
        return data.id.toString();
      case 'createdAt':
        return data.createdAt;
      case 'type':
        return data.type;
      case 'state':
        return data.state;
      case 'user':
        return data.user ?
          parseFullName(data.user)
          :
          data.createdBy.slice(data.createdBy.lastIndexOf('=')+1, data.createdBy.length);
      case 'group':
        return data.group ? data.group.name : '';
      case 'modifiedBy':
        return outerThis.parseModifiedBy(data);
      default:
        return '';
    }
  }

  parseModifiedBy(data: Application){
    const index = data.modifiedBy.lastIndexOf('/CN=');
    if (index !== -1) {
      const string =  data.modifiedBy.slice(index + 4, data.modifiedBy.length).replace('/unstructuredName=', ' ').toLowerCase();
      if (string.lastIndexOf('\\') !== -1) {
        return data.modifiedBy.slice(data.modifiedBy.lastIndexOf('=') + 1, data.modifiedBy.length);
      }
      return string;
    }
    return data.modifiedBy.toLowerCase();
  }

  exportData(format: string){
    downloadData(getDataForExport(this.dataSource.filteredData, this.displayedColumns, this.getExportDataForColumn, this), format);
  }

  setDataSource() {
    // don't set the data if the paginator was not loaded yet
    if (!this.child.paginator) {
      return;
    }
    if (!!this.dataSource) {
      this.dataSource.paginator = this.child.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data: Application, filter: string) => {
        return customDataSourceFilterPredicate(data, filter, this.displayedColumns, this.getDataForColumn, this)
      };
      this.dataSource.sortData = (data: Application[], sort: MatSort) => {
        return customDataSourceSort(data, sort, this.getDataForColumn, this);
      };
    }
    this.dataSource.filter = this.filterValue;
  }


  getFriendlyName(modifiedBy: string) {
    const index = modifiedBy.lastIndexOf('/CN=');
    if (index !== -1) {
      const string =  modifiedBy.slice(index + 4, modifiedBy.length).replace('/unstructuredName=', ' ');
      if (string.lastIndexOf('\\') !== -1) {
        return modifiedBy.slice(modifiedBy.lastIndexOf('=') + 1, modifiedBy.length);
      }
      return string;
    }
    return modifiedBy;
  }

  selectApplication(application: Application) {
    if (!this.disableRouting) {
      if (this.group) {
        return ['/organizations', application.vo.id, 'groups', this.group.id, 'applications', application.id];
      } else if (this.member) {
        return ['/organizations', application.vo.id, 'members', this.member.id, 'applications', application.id];
      } else {
        return ['/organizations', application.vo.id, 'applications', application.id];
      }
    }
    return null;
  }
}
