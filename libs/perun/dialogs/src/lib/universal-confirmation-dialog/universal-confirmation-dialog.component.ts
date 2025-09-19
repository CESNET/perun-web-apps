import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

export interface ConfirmationDialogData {
  theme: string;
  message: string;
}

@Component({
  imports: [CommonModule, MatButtonModule, MatDialogModule, TranslateModule],
  standalone: true,
  selector: 'perun-web-apps-universal-confirmation-dialog',
  templateUrl: './universal-confirmation-dialog.component.html',
  styleUrls: ['./universal-confirmation-dialog.component.scss'],
})
export class UniversalConfirmationDialogComponent implements OnInit {
  theme: string;
  message: string;

  constructor(
    public dialogRef: MatDialogRef<UniversalConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData,
  ) {}

  ngOnInit(): void {
    this.theme = this.data.theme;
    this.message = this.data.message;
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    this.dialogRef.close(true);
  }
}
