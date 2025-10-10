import { DebounceFilterComponent } from '@perun-web-apps/perun/components';
import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import {
  ResourcesManagerService,
  Service,
  ServicesManagerService,
} from '@perun-web-apps/perun/openapi';
import { TABLE_ASSIGN_SERVICE_TO_RESOURCE_DIALOG } from '@perun-web-apps/config/table-config';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs';
import { ServicesListComponent } from '../../services-list/services-list.component';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

export interface AssignServiceToResourceDialogData {
  theme: string;
  resourceId: number;
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    LoadingDialogComponent,
    DebounceFilterComponent,
    TranslateModule,
    ServicesListComponent,
    LoaderDirective,
  ],
  standalone: true,
  selector: 'app-perun-web-apps-assign-service-to-resource-dialog',
  templateUrl: './assign-service-to-resource-dialog.component.html',
  styleUrls: ['./assign-service-to-resource-dialog.component.scss'],
})
export class AssignServiceToResourceDialogComponent implements OnInit {
  loading = false;
  theme: string;
  unAssignedServices: Service[] = [];
  filteredServices: Service[] = [];
  selection = new SelectionModel<Service>(
    true,
    [],
    true,
    (service1, service2) => service1.id === service2.id,
  );
  cachedSubject = new BehaviorSubject(true);
  tableId = TABLE_ASSIGN_SERVICE_TO_RESOURCE_DIALOG;
  filterValue = '';

  constructor(
    private dialogRef: MatDialogRef<AssignServiceToResourceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AssignServiceToResourceDialogData,
    private notificator: NotificatorService,
    private translate: TranslateService,
    private resourceManager: ResourcesManagerService,
    private servicesManager: ServicesManagerService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.theme = this.data.theme;
    this.resourceManager
      .getAssignedServicesToResource(this.data.resourceId)
      .subscribe((assignedServices) => {
        this.servicesManager.getServices().subscribe((allServices) => {
          this.unAssignedServices = allServices;
          for (const assignedService of assignedServices) {
            for (const allService of allServices) {
              if (assignedService.id === allService.id) {
                this.unAssignedServices.splice(this.unAssignedServices.indexOf(allService), 1);
              }
            }
          }
          this.loading = false;
        });
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onAdd(): void {
    this.loading = true;
    this.addServices();
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.selection.clear();
    this.cachedSubject.next(true);
  }

  private addServices(): void {
    const addedServices: number[] = [];
    for (const service of this.selection.selected) {
      addedServices.push(service.id);
    }
    this.resourceManager.assignServices(this.data.resourceId, addedServices).subscribe(
      () => {
        this.translate
          .get('DIALOGS.ASSIGN_SERVICE_TO_RESOURCE.SERVICE_SUCCESS_MESSAGE')
          .subscribe((message: string) => {
            this.notificator.showSuccess(message);
            this.dialogRef.close(true);
          });
      },
      () => (this.loading = false),
    );
  }
}
