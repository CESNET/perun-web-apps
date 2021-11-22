import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface NoServiceDialogData {
  theme: string;
}

@Component({
  selector: 'app-no-service-dialog',
  templateUrl: './no-service-dialog.component.html',
  styleUrls: ['./no-service-dialog.component.scss']
})
export class NoServiceDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<NoServiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NoServiceDialogData) { }

  theme = '';
  ngOnInit(): void {
    this.theme = this.data.theme;
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onSkip() {
    this.dialogRef.close(true);
  }
}
