import { Component, OnInit } from '@angular/core';
import { GroupsManagerService, TasksManagerService } from '@perun-web-apps/perun/openapi';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-tasks',
  templateUrl: './admin-tasks.component.html',
  styleUrls: ['./admin-tasks.component.scss'],
})
export class AdminTasksComponent implements OnInit {
  groupSyncSuspended: boolean;
  tasksPropSuspended: boolean;
  loading: boolean = true;

  constructor(
    private groupsManager: GroupsManagerService,
    private tasksManager: TasksManagerService,
    private notificator: NotificatorService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.groupsManager.isSuspendedGroupSynchronization().subscribe({
      next: (suspended) => {
        this.groupSyncSuspended = suspended;
        this.tasksManager.isSuspendedTasksPropagation().subscribe({
          next: (suspendedTasks) => {
            this.tasksPropSuspended = suspendedTasks;
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          },
        });
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  toggleGroupSuspension(): void {
    this.groupSyncSuspended = !this.groupSyncSuspended;
    if (this.groupSyncSuspended) {
      this.groupsManager.suspendGroupSynchronization().subscribe({
        next: () => {
          this.notificator.showSuccess(
            this.translate.instant('ADMIN.TASKS.SYNC_SUSPENDED_SUCCESS') as string,
          );
        },
        error: () => {
          this.groupSyncSuspended = !this.groupSyncSuspended;
        },
      });
    } else {
      this.groupsManager.resumeGroupSynchronization().subscribe({
        next: () => {
          this.notificator.showSuccess(
            this.translate.instant('ADMIN.TASKS.SYNC_RESUMED_SUCCESS') as string,
          );
        },
        error: () => {
          this.groupSyncSuspended = !this.groupSyncSuspended;
        },
      });
    }
  }

  toggleTaskSuspension(): void {
    this.tasksPropSuspended = !this.tasksPropSuspended;
    if (this.tasksPropSuspended) {
      this.tasksManager.suspendTasksPropagation(true).subscribe({
        next: () => {
          this.notificator.showSuccess(
            this.translate.instant('ADMIN.TASKS.PROPAGATION_SUSPENDED_SUCCESS') as string,
          );
        },
        error: () => {
          this.tasksPropSuspended = !this.tasksPropSuspended;
        },
      });
    } else {
      this.tasksManager.resumeTasksPropagation(true).subscribe({
        next: () => {
          this.notificator.showSuccess(
            this.translate.instant('ADMIN.TASKS.PROPAGATION_RESUMED_SUCCESS') as string,
          );
        },
        error: () => {
          this.tasksPropSuspended = !this.tasksPropSuspended;
        },
      });
    }
  }
}
