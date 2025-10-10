import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import {
  ResourcesManagerService,
  RichResource,
  ServicesManagerService,
  TasksManagerService,
} from '@perun-web-apps/perun/openapi';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { TABLE_RESOURCE_DELETE_SERVICE } from '@perun-web-apps/config/table-config';
import { NotificatorService, PerunTranslateService } from '@perun-web-apps/perun/services';
import { BehaviorSubject } from 'rxjs';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { ResourcesListComponent } from '@perun-web-apps/perun/components';

export interface DeleteServiceFromFacilityData {
  theme: string;
  taskId: number;
  serviceId: number;
  facilityId: number;
  resource: RichResource[];
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    LoadingDialogComponent,
    TranslateModule,
    MatTooltip,
    LoaderDirective,
    ResourcesListComponent,
  ],
  standalone: true,
  selector: 'app-delete-service-from-facility',
  templateUrl: './delete-service-from-facility.component.html',
  styleUrls: ['./delete-service-from-facility.component.scss'],
})
export class DeleteServiceFromFacilityComponent implements OnInit {
  loading = false;
  theme: string;
  taskId: number;
  resources: RichResource[] = [];
  displayedColumns = ['select', 'id', 'vo', 'name'];
  checkboxesDisabled = false;
  taskChecked = true;
  taskResultsChecked = true;
  destinationChecked = true;
  tableId = TABLE_RESOURCE_DELETE_SERVICE;
  dataSource = new MatTableDataSource<RichResource>(this.data.resource);
  selected = new SelectionModel<RichResource>(
    true,
    [...this.dataSource.data],
    true,
    (richResource1, richResource2) => richResource1.id === richResource2.id,
  );
  cachedSubject = new BehaviorSubject(true);
  private serviceId: number;
  private facilityId: number;

  constructor(
    private dialogRef: MatDialogRef<DeleteServiceFromFacilityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteServiceFromFacilityData,
    private resourcesManager: ResourcesManagerService,
    private tasksManager: TasksManagerService,
    private serviceManager: ServicesManagerService,
    private translate: PerunTranslateService,
    private notificator: NotificatorService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.theme = this.data.theme;
    this.taskId = this.data.taskId;
    this.serviceId = this.data.serviceId;
    this.facilityId = this.data.facilityId;
    this.resources = this.data.resource;
  }

  remove(): void {
    this.loading = true;

    // delete task results
    if (this.taskResultsChecked && !this.taskChecked && this.taskId !== null) {
      this.tasksManager.getTaskResultsForGUIByTask(this.taskId).subscribe((taskResults) => {
        this.tasksManager
          .deleteTaskResultsByIds(taskResults.map((result) => result.id))
          .subscribe();
      });
    }

    // delete task and task results
    if (this.taskChecked && this.taskId !== null) {
      this.tasksManager.deleteTask({ task: this.taskId }).subscribe();
    }

    // delete destination
    if (this.destinationChecked) {
      this.serviceManager
        .getRichDestinations(this.serviceId, this.facilityId)
        .subscribe((destinations) => {
          this.serviceManager
            .removeDestinationsByRichDestinations({ richDestinations: destinations })
            .subscribe();
        });
    }

    // delete service from resources/facility
    this.resourcesManager
      .removeServiceForResources(
        this.selected.selected.map((resource) => resource.id),
        this.serviceId,
      )
      .subscribe({
        next: () => {
          this.notificator.showSuccess(
            this.translate.instant('DIALOGS.REMOVE_SERVICE_FROM_FACILITY.SUCCESS'),
          );
          this.dialogRef.close(true);
        },
        error: () => (this.loading = false),
      });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  disableCheckboxes(allSelected: boolean): void {
    if (allSelected && this.checkboxesDisabled) {
      this.changeCheckboxes(true);
    }
    if (!allSelected && !this.checkboxesDisabled) {
      this.changeCheckboxes(false);
    }
  }

  changeCheckboxes(allSelected: boolean): void {
    this.checkboxesDisabled = !allSelected;
    this.taskChecked = allSelected;
    this.taskResultsChecked = allSelected;
    this.destinationChecked = allSelected;
    this.cd.detectChanges();
  }

  change(event: { source: { id: string }; checked: boolean }): void {
    switch (event.source.id) {
      case 'task': {
        this.taskChecked = event.checked;
        break;
      }
      case 'taskResults': {
        this.taskResultsChecked = event.checked;
        break;
      }
      case 'destination': {
        this.destinationChecked = event.checked;
        break;
      }
      default: {
        break;
      }
    }
  }
}
