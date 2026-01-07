import { TranslateModule } from '@ngx-translate/core';
import { DebounceFilterComponent, RefreshButtonComponent } from '@perun-web-apps/perun/components';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { Facility, Task, TaskResult, TasksManagerService } from '@perun-web-apps/perun/openapi';
import { EntityStorageService, GuiAuthResolver } from '@perun-web-apps/perun/services';
import { MatDialog } from '@angular/material/dialog';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { DeleteTaskResultDialogComponent } from '../../../../../shared/components/dialogs/delete-task-result-dialog/delete-task-result-dialog.component';
import { BehaviorSubject } from 'rxjs';
import { TaskResultsListComponent } from '@perun-web-apps/perun/components';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    DebounceFilterComponent,
    RefreshButtonComponent,
    TranslateModule,
    TaskResultsListComponent,
    LoaderDirective,
    LoadingTableComponent,
  ],
  standalone: true,
  selector: 'app-facility-task-results',
  templateUrl: './facility-task-results.component.html',
  styleUrls: ['./facility-task-results.component.scss'],
})
export class FacilityTaskResultsComponent implements OnInit {
  loading = false;
  filterValue = '';

  selection = new SelectionModel<TaskResult>(
    true,
    [],
    true,
    (taskResult1, taskResult2) => taskResult1.id === taskResult2.id,
  );
  taskId: number;
  task: Task = { id: 0 };
  facility: Facility;
  taskResults: TaskResult[] = [];
  cachedSubject = new BehaviorSubject(true);
  displayedColumns = [
    'select',
    'id',
    'destination',
    'type',
    'service',
    'status',
    'time',
    'returnCode',
    'standardMessage',
    'errorMessage',
  ];

  removeAuth = false;

  constructor(
    private route: ActivatedRoute,
    private taskManager: TasksManagerService,
    private authResolver: GuiAuthResolver,
    private dialog: MatDialog,
    private entityStorageService: EntityStorageService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.facility = this.entityStorageService.getEntity();
    this.removeAuth = this.authResolver.isAuthorized('deleteTask_Task_policy', [this.facility]);
    if (!this.removeAuth) {
      this.displayedColumns = [
        'id',
        'destination',
        'type',
        'service',
        'status',
        'time',
        'returnCode',
        'standardMessage',
        'errorMessage',
      ];
    }

    this.route.params.subscribe((params) => {
      this.taskId = Number(params['taskId']);
      this.taskManager.getTaskById(this.taskId).subscribe((task) => {
        this.task = task;
        this.refreshTable();
      });
    });
  }

  refreshTable(): void {
    this.loading = true;
    this.taskManager.getTaskResultsForGUIByTask(this.taskId).subscribe((taskResults) => {
      this.selection.clear();
      this.cachedSubject.next(true);
      this.taskResults = taskResults;
      this.loading = false;
    });
  }

  removeTaskResult(): void {
    const config = getDefaultDialogConfig();
    config.width = '600px';
    config.data = {
      theme: 'facility-theme',
      taskResults: this.selection.selected,
    };

    const dialogRef = this.dialog.open(DeleteTaskResultDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshTable();
      }
    });
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.refreshTable();
  }
}
