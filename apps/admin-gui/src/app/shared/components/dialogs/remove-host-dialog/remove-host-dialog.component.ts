import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FacilitiesManagerService, Host } from '@perun-web-apps/perun/openapi';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

export interface RemoveHostDialogData {
  theme: string;
  facilityId: number;
  hosts: Host[];
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
  selector: 'app-remove-host-dialog',
  templateUrl: './remove-host-dialog.component.html',
  styleUrls: ['./remove-host-dialog.component.scss'],
})
export class RemoveHostDialogComponent implements OnInit {
  theme: string;
  hosts: Host[];
  displayedColumns: string[] = ['name'];
  dataSource: MatTableDataSource<Host>;
  loading = false;

  constructor(
    private dialogRef: MatDialogRef<RemoveHostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: RemoveHostDialogData,
    public facilitiesManager: FacilitiesManagerService,
    private notificator: NotificatorService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.theme = this.data.theme;
    this.hosts = this.data.hosts;
    this.dataSource = new MatTableDataSource<Host>(this.data.hosts);
  }

  onConfirm(): void {
    this.loading = true;
    this.facilitiesManager
      .removeHosts(
        this.data.facilityId,
        this.hosts.map((m) => m.id),
      )
      .subscribe(
        () => {
          this.notificator.showSuccess(
            this.translate.instant('DIALOGS.REMOVE_HOST.SUCCESS') as string,
          );
          this.dialogRef.close(true);
        },
        () => (this.loading = false),
      );
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
