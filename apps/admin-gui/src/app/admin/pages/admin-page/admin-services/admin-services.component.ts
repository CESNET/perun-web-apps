import { Component, DestroyRef, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Service, ServicesManagerService } from '@perun-web-apps/perun/openapi';
import { TABLE_ADMIN_SERVICES } from '@perun-web-apps/config/table-config';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { MatDialog } from '@angular/material/dialog';
import { CreateEditServiceDialogComponent } from '../../../../shared/components/dialogs/create-edit-service-dialog/create-edit-service-dialog.component';
import { DeleteServiceDialogComponent } from '../../../../shared/components/dialogs/delete-service-dialog/delete-service-dialog.component';
import { GuiAuthResolver } from '@perun-web-apps/perun/services';
import { CacheHelperService } from '../../../../core/services/common/cache-helper.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-admin-services',
  templateUrl: './admin-services.component.html',
  styleUrls: ['./admin-services.component.scss'],
})
export class AdminServicesComponent implements OnInit {
  static id = 'AdminServicesComponent';

  services: Service[];
  selection = new SelectionModel<Service>(
    true,
    [],
    true,
    (service1, service2) => service1.id === service2.id,
  );
  cachedSubject = new BehaviorSubject(true);
  loading = false;
  filterValue = '';
  tableId = TABLE_ADMIN_SERVICES;

  constructor(
    private serviceManager: ServicesManagerService,
    private dialog: MatDialog,
    public authResolver: GuiAuthResolver,
    private cacheHelperService: CacheHelperService,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    this.refreshTable();

    // Refresh cached data
    this.cacheHelperService
      .refreshComponentCachedData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((nextValue) => {
        if (nextValue === AdminServicesComponent.id) {
          this.refreshTable();
        }
      });
  }

  createService(): void {
    const config = getDefaultDialogConfig();
    config.width = '600px';
    config.data = {
      theme: 'admin-theme',
    };

    const dialogRef = this.dialog.open(CreateEditServiceDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshTable();
      }
    });
  }

  deleteService(): void {
    const config = getDefaultDialogConfig();
    config.width = '600px';
    config.data = {
      theme: 'admin-theme',
      services: this.selection.selected,
    };

    const dialogRef = this.dialog.open(DeleteServiceDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshTable();
      }
    });
  }

  refreshTable(): void {
    this.loading = true;
    this.serviceManager.getServices().subscribe((services) => {
      this.services = services;
      this.selection.clear();
      this.cachedSubject.next(true);
      this.loading = false;
    });
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.refreshTable();
  }
}
