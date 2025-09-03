import { TranslateModule } from '@ngx-translate/core';
import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { TaskResult, TasksManagerService } from '@perun-web-apps/perun/openapi';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { NotificatorService, PerunTranslateService } from '@perun-web-apps/perun/services';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

export interface DeleteTaskResultDialogData {
  theme: string;
  taskResults: TaskResult[];
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    LoadingDialogComponent,
    MatTableModule,
    TranslateModule,
    LoaderDirective,
  ],
  standalone: true,
  selector: 'app-delete-task-result-dialog',
  templateUrl: './delete-task-result-dialog.component.html',
  styleUrls: ['./delete-task-result-dialog.component.scss'],
})
export class DeleteTaskResultDialogComponent implements OnInit {
  loading = false;
  theme: string;
  dataSource = new MatTableDataSource<TaskResult>(this.data.taskResults);
  displayedColumns = ['id', 'destination', 'time'];
  private taskResults: TaskResult[];

  constructor(
    private dialogRef: MatDialogRef<DeleteTaskResultDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DeleteTaskResultDialogData,
    private taskManager: TasksManagerService,
    private notificator: NotificatorService,
    private translate: PerunTranslateService,
  ) {}

  ngOnInit(): void {
    this.theme = this.data.theme;
    this.taskResults = this.data.taskResults;
  }

  onDelete(): void {
    this.loading = true;

    const taskResultsIds = this.taskResults.map((result) => result.id);
    this.taskManager.deleteTaskResultsByIds(taskResultsIds).subscribe({
      next: () => {
        this.dialogRef.close(true);
        this.loading = false;
        this.notificator.showSuccess(this.translate.instant('DIALOGS.DELETE_TASK_RESULT.SUCCESS'));
      },
      error: () => (this.loading = false),
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
