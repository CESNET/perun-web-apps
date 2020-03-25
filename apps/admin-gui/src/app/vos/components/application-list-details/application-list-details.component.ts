import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Application, Group, RegistrarManagerService } from '@perun-web-apps/perun/openapi';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perun-web-apps-application-list-details',
  templateUrl: './application-list-details.component.html',
  styleUrls: ['./application-list-details.component.scss']
})
export class ApplicationListDetailsComponent implements OnChanges {

  constructor(private router: Router,
              private registrarManager: RegistrarManagerService) { }

  @Input()
  applications: Application[] = [];

  @Input()
  group: Group;

  @Input()
  filterValue: string;

  displayedColumns: string[] = ['id', 'voId', 'voName', 'groupId', 'groupName', 'type',
    'state', 'extSourceName', 'extSourceType', 'extSourceLoa',
    'user', 'createdBy', 'createdAt', 'modifiedBy', 'modifiedAt', 'fedInfo'];

  dataSource: MatTableDataSource<any>;

  loading = false;

  table = [];

  addedColumns = new Set<string>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnChanges(changes: SimpleChanges) {
    this.loading = true;
    this.getApplicationsData(0);
  }

  getApplicationsData(index: number) {
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
    this.registrarManager.getApplicationDataById(application.id).subscribe( data => {
      for (const item of data) {
        if (item.formItem.i18n['en'].label !== null && item.formItem.i18n['en'].label.length !== 0) {
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

  initialize() {
    for (const val of this.addedColumns) {
      this.displayedColumns.push(val);
    }
    this.dataSource = new MatTableDataSource(this.table);
    this.dataSource.paginator = this.paginator;
    this.dataSource.filter = this.filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.loading = false;
  }

  getFriendlyName(modifiedBy: string) {
    const index = modifiedBy.lastIndexOf('/CN=');
    if (index !== -1) {
      const string =  modifiedBy.slice(index + 4, modifiedBy.length)
        .replace('/unstructuredName=', ' ');
      if (string.lastIndexOf('\\') !== -1) {
        return modifiedBy.slice(modifiedBy.lastIndexOf('=') + 1, modifiedBy.length);
      }
      return string;
    }
    return modifiedBy;
  }

  selectApplication(application: Application) {
    if (this.group) {
      this.router.navigate(['/organizations', application.vo.id, 'groups', this.group.id, 'applications', application.id]);
    } else {
      this.router.navigate(['/organizations', application.vo.id, 'applications', application.id]);
    }
  }
}
