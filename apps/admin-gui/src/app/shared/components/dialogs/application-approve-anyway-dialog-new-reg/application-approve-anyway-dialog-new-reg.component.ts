import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';

import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { AlertComponent } from '@perun-web-apps/ui/alerts';
import { ApprovalFailure, SubmissionsService } from '@perun-web-apps/perun/registrar-openapi';
import { TranslateModule } from '@ngx-translate/core';

export interface DialogData {
  failures: ApprovalFailure[];
  applicationId: string;
  theme: string;
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    AlertComponent,
    LoadingDialogComponent,
    TranslateModule,
    LoaderDirective,
  ],
  standalone: true,
  selector: 'app-application-approve-anyway-dialog-new-reg',
  templateUrl: './application-approve-anyway-dialog-new-reg.component.html',
  styleUrls: ['./application-approve-anyway-dialog-new-reg.component.scss'],
})
export class ApplicationApproveAnywayDialogNewRegComponent implements OnInit {
  failures: ApprovalFailure[] = [];
  allSoft: boolean = false;
  theme: string;
  applicationId: string;
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ApplicationApproveAnywayDialogNewRegComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private submissionService: SubmissionsService,
  ) {}

  ngOnInit(): void {
    this.failures = this.data.failures;
    this.allSoft = this.failures.every((failure) => failure.soft);
    this.theme = this.data.theme;
    this.applicationId = this.data.applicationId;
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onSubmit(): void {
    this.loading = true;
    this.submissionService.approveApplicationForce(this.applicationId).subscribe({
      next: (result) => {
        this.dialogRef.close(result);
      },
      error: () => (this.loading = false),
    });
  }
}
