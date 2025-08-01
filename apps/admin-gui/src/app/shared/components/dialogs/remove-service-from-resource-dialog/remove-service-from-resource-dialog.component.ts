import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { ResourcesManagerService, Service } from '@perun-web-apps/perun/openapi';
import { MatTableDataSource } from '@angular/material/table';

export interface RemoveServiceFromResourceDialogData {
  resourceId: number;
  services: Service[];
  theme: string;
}

@Component({
  selector: 'app-perun-web-apps-remove-service-from-resource-dialog',
  templateUrl: './remove-service-from-resource-dialog.component.html',
  styleUrls: ['./remove-service-from-resource-dialog.component.scss'],
})
export class RemoveServiceFromResourceDialogComponent implements OnInit {
  theme: string;
  loading: boolean;
  displayedColumns: string[] = ['name'];
  servicesLastAssignedIds = [];
  servicesIds: number[] = [];
  removeTask: boolean;
  removeTaskResults: boolean;
  removeDestinations: boolean;
  dataSource: MatTableDataSource<Service>;

  constructor(
    public dialogRef: MatDialogRef<RemoveServiceFromResourceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RemoveServiceFromResourceDialogData,
    private notificator: NotificatorService,
    private translate: TranslateService,
    private resourcesManager: ResourcesManagerService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.servicesIds = this.data.services.map((service) => service.id);
    this.theme = this.data.theme;
    this.resourcesManager
      .isResourceLastAssignedServices(this.data.resourceId, this.servicesIds)
      .subscribe({
        next: (lastAssigned) => {
          this.servicesLastAssignedIds = lastAssigned.map((service) => service.id);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
    this.dataSource = new MatTableDataSource<Service>(this.data.services);
  }

  onSubmit(): void {
    this.loading = true;
    this.resourcesManager
      .removeServices(
        this.data.resourceId,
        this.servicesIds,
        this.removeTask,
        this.removeTaskResults,
        this.removeDestinations,
      )
      .subscribe({
        next: () => {
          this.translate
            .get('DIALOGS.REMOVE_SERVICE_FROM_RESOURCE.SUCCESS')
            .subscribe((successMessage: string) => {
              this.notificator.showSuccess(successMessage);
              this.dialogRef.close(true);
            });
        },
        error: () => (this.loading = false),
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
