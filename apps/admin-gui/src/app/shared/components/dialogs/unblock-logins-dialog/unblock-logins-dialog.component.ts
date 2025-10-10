import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { BlockedLogin } from '@perun-web-apps/perun/openapi';
import { UsersManagerService } from '@perun-web-apps/perun/openapi';
import { GlobalNamespacePipe } from '@perun-web-apps/perun/pipes';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

export interface UnblockLoginsDialogData {
  theme: string;
  logins: BlockedLogin[];
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
    GlobalNamespacePipe,
  ],
  standalone: true,
  selector: 'app-unblock-logins-dialog',
  templateUrl: './unblock-logins-dialog.component.html',
  styleUrls: ['./unblock-logins-dialog.component.scss'],
  providers: [GlobalNamespacePipe],
})
export class UnblockLoginsDialogComponent implements OnInit {
  loading: boolean;
  theme: string;
  dataSource: MatTableDataSource<BlockedLogin>;
  displayedColumns = ['login', 'namespace'];

  constructor(
    public dialogRef: MatDialogRef<UnblockLoginsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UnblockLoginsDialogData,
    private notificator: NotificatorService,
    private translate: TranslateService,
    private usersService: UsersManagerService,
  ) {}

  ngOnInit(): void {
    this.theme = this.data.theme;
    this.dataSource = new MatTableDataSource<BlockedLogin>(this.data.logins);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    this.loading = true;
    this.usersService
      .unblockLoginsByIdBodyParams({ logins: this.data.logins.map((login) => login.id) })
      .subscribe({
        next: () => {
          this.notificator.showInstantSuccess('ADMIN.BLOCKED_LOGINS.UNBLOCK_SUCCESS');
          this.dialogRef.close(true);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }
}
