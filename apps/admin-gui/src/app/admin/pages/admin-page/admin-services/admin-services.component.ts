import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Service, ServicesManagerService } from '@perun-web-apps/perun/openapi';
import { TABLE_ADMIN_SERVICES, TableConfigService } from '@perun-web-apps/config/table-config';
import { PageEvent } from '@angular/material/paginator';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { MatDialog } from '@angular/material/dialog';
import { CreateEditServiceDialogComponent } from '../../../../shared/components/dialogs/create-edit-service-dialog/create-edit-service-dialog.component';
import { DeleteServiceDialogComponent } from '../../../../shared/components/dialogs/delete-service-dialog/delete-service-dialog.component';


@Component({
  selector: 'app-admin-services',
  templateUrl: './admin-services.component.html',
  styleUrls: ['./admin-services.component.scss']
})
export class AdminServicesComponent implements OnInit {

  constructor(private tableConfigService: TableConfigService,
              private serviceManager: ServicesManagerService,
              private dialog: MatDialog
              ) { }


  services: Service[];
  selection = new SelectionModel<Service>(true, []);
  loading = false;
  filterValue = "";
  pageSize: number;
  tableId = TABLE_ADMIN_SERVICES;

  ngOnInit(): void {
    this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
    this.serviceManager.getServices().subscribe(services => {
      this.services= services;
      this.refreshTable();
    });
  }


  createService(){
    const config = getDefaultDialogConfig();
    config.width = '600px';
    config.data = {
      theme: 'admin-theme'
    };

    const dialogRef = this.dialog.open(CreateEditServiceDialogComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshTable();
      }
    });
  }

  deleteService(){
    const config = getDefaultDialogConfig();
    config.width = '600px';
    config.data = {
      theme: 'admin-theme',
      services: this.selection.selected
    };

    const dialogRef = this.dialog.open(DeleteServiceDialogComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshTable();
      }
    });
  }

  refreshTable(){
    this.loading = true;
    this.serviceManager.getServices().subscribe(services => {
      this.services= services;
      this.selection.clear();
      this.loading = false;
    });
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
  }
}
