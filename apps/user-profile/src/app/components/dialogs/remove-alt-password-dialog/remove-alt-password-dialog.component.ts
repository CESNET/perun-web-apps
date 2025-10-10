import { TranslateModule } from '@ngx-translate/core';
import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { CustomTranslatePipe } from '@perun-web-apps/perun/pipes';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { UsersManagerService } from '@perun-web-apps/perun/openapi';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

export interface RemoveAltPasswordDialogData {
  userId: number;
  passwordId: string;
  description: string[];
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    CustomTranslatePipe,
    LoadingDialogComponent,
    MatTableModule,
    TranslateModule,
    LoaderDirective,
  ],
  standalone: true,
  selector: 'perun-web-apps-remove-alt-password-dialog',
  templateUrl: './remove-alt-password-dialog.component.html',
  styleUrls: ['./remove-alt-password-dialog.component.scss'],
})
export class RemoveAltPasswordDialogComponent implements OnInit {
  displayedColumns: string[] = ['description'];
  dataSource: MatTableDataSource<string>;
  loading: boolean;

  constructor(
    private dialogRef: MatDialogRef<RemoveAltPasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: RemoveAltPasswordDialogData,
    private usersManagerService: UsersManagerService,
  ) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<string>(this.data.description);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    this.loading = true;
    this.usersManagerService
      .deleteAlternativePassword({
        user: String(this.data.userId),
        loginNamespace: 'einfra',
        passwordId: this.data.passwordId,
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: () => (this.loading = false),
      });
  }
}
