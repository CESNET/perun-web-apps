import { TranslateModule } from '@ngx-translate/core';
import { DebounceFilterComponent } from '@perun-web-apps/perun/components';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ExtSource, ExtSourcesManagerService } from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { NotificatorService, PerunTranslateService } from '@perun-web-apps/perun/services';
import { BehaviorSubject } from 'rxjs';
import { ExtSourcesListComponent } from '../../ext-sources-list/ext-sources-list.component';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';

export interface AddExtSourceDialogData {
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
    DebounceFilterComponent,
    TranslateModule,
    ExtSourcesListComponent,
    LoaderDirective,
    LoadingTableComponent,
  ],
  standalone: true,
  selector: 'app-add-ext-source-dialog',
  templateUrl: './add-ext-source-dialog.component.html',
  styleUrls: ['./add-ext-source-dialog.component.scss'],
})
export class AddExtSourceDialogComponent implements OnInit {
  theme: string;
  extSources: ExtSource[] = [];
  selection = new SelectionModel<ExtSource>(true, []);
  cachedSubject = new BehaviorSubject(true);
  loading = false;
  filterValue = '';
  successMessage: string;

  constructor(
    private dialogRef: MatDialogRef<AddExtSourceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: AddExtSourceDialogData,
    private extSourceService: ExtSourcesManagerService,
    private notificator: NotificatorService,
    private translate: PerunTranslateService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.theme = this.data.theme;

    if (this.data.groupId) {
      this.extSourceService.getVoExtSources(this.data.voId).subscribe(
        (sources) => {
          this.extSources = sources.filter(
            (source) => !this.data.extSources.some(({ id }) => id === source.id),
          );
          this.loading = false;
        },
        () => (this.loading = false),
      );
    } else {
      this.extSourceService.getExtSources().subscribe(
        (sources) => {
          this.extSources = sources.filter(
            (source) => !this.data.extSources.some(({ id }) => id === source.id),
          );
          this.loading = false;
        },
        () => (this.loading = false),
      );
    }
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.selection.clear();
    this.cachedSubject.next(true);
  }

  addVoExtSources(extSources: ExtSource[]): void {
    const extSourceIds = extSources.map((src) => src.id);
    this.extSourceService.addExtSourcesWithVoSource(this.data.voId, extSourceIds).subscribe({
      next: () => {
        this.notificator.showSuccess(
          this.translate.instant('DIALOGS.ADD_EXT_SOURCES.SUCCESS_ADDED'),
        );
        this.dialogRef.close(true);
      },
      error: () => (this.loading = false),
    });
  }

  addGroupExtSources(extSources: ExtSource[]): void {
    const extSourceIds = extSources.map((src) => src.id);

    this.extSourceService.addExtSourcesWithGroupSource(this.data.groupId, extSourceIds).subscribe({
      next: () => {
        this.notificator.showSuccess(
          this.translate.instant('DIALOGS.ADD_EXT_SOURCES.SUCCESS_ADDED'),
        );
        this.dialogRef.close(true);
      },
      error: () => (this.loading = false),
    });
  }

  onAdd(): void {
    this.loading = true;
    if (this.data.groupId) {
      this.addGroupExtSources(this.selection.selected);
    } else {
      this.addVoExtSources(this.selection.selected);
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
