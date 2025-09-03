import { TranslateModule } from '@ngx-translate/core';
import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

export interface ShowValueDialogData {
  title: string;
  value: string;
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    CdkCopyToClipboard,
    MatDialogModule,
    TranslateModule,
  ],
  standalone: true,
  selector: 'perun-web-apps-show-value-dialog',
  templateUrl: './show-value-dialog.component.html',
  styleUrls: ['./show-value-dialog.component.scss'],
})
export class ShowValueDialogComponent implements OnInit {
  value: string;
  title: string;

  constructor(
    private dialogRef: MatDialogRef<ShowValueDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: ShowValueDialogData,
  ) {}

  ngOnInit(): void {
    this.value = this.data.value;
    this.title = this.data.title;
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
