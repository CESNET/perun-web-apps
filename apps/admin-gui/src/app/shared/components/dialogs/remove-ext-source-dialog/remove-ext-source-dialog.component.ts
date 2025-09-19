import { MatTableModule } from '@angular/material/table';
import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ExtSource, ExtSourcesManagerService } from '@perun-web-apps/perun/openapi';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TableConfigService } from '@perun-web-apps/config/table-config';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

export interface RemoveExtSourceDialogData {
  voId: number;
  groupId?: number;
  theme: string;
  extSources: ExtSource[];
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
  selector: 'app-remove-ext-source-dialog',
  templateUrl: './remove-ext-source-dialog.component.html',
  styleUrls: ['./remove-ext-source-dialog.component.scss'],
})
export class RemoveExtSourceDialogComponent implements OnInit {
  theme: string;
  extSources: ExtSource[] = [];
  displayedColumns: string[] = ['id', 'name'];
  loading = false;

  constructor(
    private dialogRef: MatDialogRef<RemoveExtSourceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: RemoveExtSourceDialogData,
    private extSourceService: ExtSourcesManagerService,
    private notificator: NotificatorService,
    private tableConfigService: TableConfigService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.theme = this.data.theme;
    this.extSources = this.data.extSources;
  }

  removeVoExtSources(): void {
    const extSourceIds = this.extSources.map((src) => src.id);

    this.extSourceService.removeExtSourcesWithVoSource(this.data.voId, extSourceIds).subscribe({
      next: () => {
        this.translate
          .get('DIALOGS.REMOVE_EXT_SOURCES.SUCCESS_REMOVED')
          .subscribe((successMessage: string) => {
            this.notificator.showSuccess(successMessage);
            this.dialogRef.close(true);
          });
      },
      error: () => (this.loading = false),
    });
  }

  removeGroupExtSources(): void {
    const extSourceIds = this.extSources.map((src) => src.id);

    this.extSourceService
      .removeExtSourcesWithGroupSource(this.data.groupId, extSourceIds)
      .subscribe({
        next: () => {
          this.translate
            .get('DIALOGS.REMOVE_EXT_SOURCES.SUCCESS_REMOVED')
            .subscribe((successMessage: string) => {
              this.notificator.showSuccess(successMessage);
              this.dialogRef.close(true);
            });
        },
        error: () => (this.loading = false),
      });
  }

  onRemove(): void {
    this.loading = true;
    if (this.data.groupId) {
      this.removeGroupExtSources();
    } else {
      this.removeVoExtSources();
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
