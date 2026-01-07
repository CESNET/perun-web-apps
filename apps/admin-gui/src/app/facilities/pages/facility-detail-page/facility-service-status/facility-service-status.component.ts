import { MatTooltip } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { DebounceFilterComponent, RefreshButtonComponent } from '@perun-web-apps/perun/components';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FacilitiesManagerService,
  Facility,
  ResourcesManagerService,
  ServicesManagerService,
  ServiceState,
  TasksManagerService,
} from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import {
  EntityStorageService,
  GuiAuthResolver,
  NotificatorService,
} from '@perun-web-apps/perun/services';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { DeleteTaskResultDialogComponent } from '../../../../shared/components/dialogs/delete-task-result-dialog/delete-task-result-dialog.component';
import { DeleteServiceFromFacilityComponent } from '../../../../shared/components/dialogs/delete-service-from-facility/delete-service-from-facility.component';
import { DeleteTaskDialogComponent } from '../../../../shared/components/dialogs/delete-task-dialog/delete-task-dialog.component';
import { BehaviorSubject } from 'rxjs';
import { ServicesStatusListComponent } from '@perun-web-apps/perun/components';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    DebounceFilterComponent,
    RefreshButtonComponent,
    MatMenuModule,
    TranslateModule,
    MatTooltip,
    ServicesStatusListComponent,
    LoaderDirective,
    LoadingTableComponent,
  ],
  standalone: true,
  selector: 'app-facility-service-status',
  templateUrl: './facility-service-status.component.html',
  styleUrls: ['./facility-service-status.component.scss'],
})
export class FacilityServiceStatusComponent implements OnInit {
  facility: Facility;
  servicesStates: ServiceState[] = [];

  selected = new SelectionModel<ServiceState>(
    true,
    [],
    true,
    (serviceState1, serviceState2) => serviceState1.service.id === serviceState2.service.id,
  );
  cachedSubject = new BehaviorSubject(true);
  filterValue = '';
  loading: boolean;

  disableAllowButton = true;
  disableBlockButton = true;
  disableRemoveButton = true;
  disableForcePropagationButton = false;
  taskIsNull: boolean;
  taskId: number;

  propagationAuth: boolean;
  allowAuth: boolean;
  blockAuth: boolean;
  deleteAuth: boolean;
  routeAuth: boolean;

  constructor(
    private tasksManager: TasksManagerService,
    private servicesManager: ServicesManagerService,
    private notificator: NotificatorService,
    private translate: TranslateService,
    private authResolver: GuiAuthResolver,
    private facilityManager: FacilitiesManagerService,
    private resourcesManager: ResourcesManagerService,
    private dialog: MatDialog,
    private entityStorageService: EntityStorageService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.facility = this.entityStorageService.getEntity();
    this.setAuthRights();
    this.refreshTable();
  }

  forcePropagation(): void {
    const serviceIds = this.selected.selected.map((status) => status.service.id);
    this.servicesManager.forceServicePropagationBulk(serviceIds, this.facility.id).subscribe({
      next: () => {
        this.notificator.showInstantSuccess(
          'FACILITY_DETAIL.SERVICES_STATUS.SUCCESS_FORCE_PROPAGATION',
        );
        this.loading = false;
        this.refreshTable();
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  allow(): void {
    const serviceIds = this.selected.selected.map((status) => status.service.id);
    this.servicesManager.unblockServicesOnFacility(serviceIds, this.facility.id).subscribe({
      next: () => {
        this.notificator.showInstantSuccess('FACILITY_DETAIL.SERVICES_STATUS.SUCCESS_ALLOW');
        this.refreshTable();
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  block(): void {
    const serviceIds = this.selected.selected.map((status) => status.service.id);
    this.servicesManager.blockServicesOnFacility(serviceIds, this.facility.id).subscribe({
      next: () => {
        this.notificator.showInstantSuccess('FACILITY_DETAIL.SERVICES_STATUS.SUCCESS_BLOCK');
        this.refreshTable();
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  removeTaskResults(): void {
    this.loading = true;
    this.tasksManager
      .getTaskResultsForGUIByTask(this.selected.selected[0].task.id)
      .subscribe((taskResults) => {
        const config = getDefaultDialogConfig();
        config.width = '600px';
        config.data = {
          theme: 'facility-theme',
          taskResults: taskResults,
        };
        this.loading = false;
        this.dialog.open(DeleteTaskResultDialogComponent, config);
      });
  }

  removeServiceFromFacility(): void {
    this.loading = true;
    this.facilityManager
      .getAssignedResourcesByAssignedServiceForFacility(
        this.selected.selected[0].facility.id,
        this.selected.selected[0].service.id,
      )
      .subscribe({
        next: (resources) => {
          const config = getDefaultDialogConfig();
          config.width = '600px';
          this.taskId = this.taskIsNull ? null : this.selected.selected[0].task.id;

          if (resources.length === 0) {
            config.data = {
              theme: 'facility-theme',
              taskId: this.taskId,
            };
            this.loading = false;
            const dialogRef = this.dialog.open(DeleteTaskDialogComponent, config);

            dialogRef.afterClosed().subscribe((result) => {
              if (result) {
                this.disableRemoveButton = true;
                this.refreshTable();
              }
            });
          } else {
            this.resourcesManager
              .getRichResourcesByIds(resources.map((resource) => resource.id))
              .subscribe((richResources) => {
                config.data = {
                  theme: 'facility-theme',
                  taskId: this.taskId,
                  serviceId: this.selected.selected[0].service.id,
                  facilityId: this.selected.selected[0].facility.id,
                  resource: richResources,
                };
                this.loading = false;
                const dialogRef = this.dialog.open(DeleteServiceFromFacilityComponent, config);

                dialogRef.afterClosed().subscribe((result) => {
                  if (result) {
                    this.disableRemoveButton = true;
                    this.refreshTable();
                  }
                });
              });
          }
        },
        error: () => (this.loading = false),
      });
  }

  refreshTable(): void {
    this.loading = true;
    this.tasksManager.getFacilityServicesState(this.facility.id).subscribe((states) => {
      this.servicesStates = states;
      this.selected.clear();
      this.cachedSubject.next(true);
      this.setAuthRights();
      this.loading = false;
    });
  }

  setAuthRights(): void {
    this.propagationAuth = this.authResolver.isAuthorized(
      'forceServicePropagation_Facility_Service_policy',
      [this.facility],
    );
    this.blockAuth = this.authResolver.isAuthorized(
      'blockServiceOnFacility_Service_Facility_policy',
      [this.facility],
    );
    this.allowAuth = this.authResolver.isAuthorized(
      'unblockServiceOnFacility_Service_Facility_policy',
      [this.facility],
    );
    this.deleteAuth = this.authResolver.isAuthorized('deleteTask_Task_policy', [this.facility]);
    this.routeAuth = this.authResolver.isAuthorized('getTaskResultsByTask_int_policy', [
      this.facility,
    ]);
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.refreshTable();
  }

  selectionChanged(): void {
    this.disableBlockButton = false;
    this.disableAllowButton = false;
    this.disableRemoveButton = this.selected.selected.length !== 1;
    this.disableForcePropagationButton = false;

    if (!this.disableRemoveButton) {
      this.taskIsNull = this.selected.selected[0].task === null;
    }

    for (const ss of this.selected.selected) {
      if (ss.blockedOnFacility) {
        this.disableBlockButton = true;
        this.disableForcePropagationButton = true;
      } else {
        this.disableAllowButton = true;
      }
    }
  }
}
