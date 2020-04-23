import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'perun-web-apps-user-dont-exist-dialog',
  templateUrl: './user-dont-exist-dialog.component.html',
  styleUrls: ['./user-dont-exist-dialog.component.css']
})
export class UserDontExistDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<UserDontExistDialogComponent>) {
  }

  ngOnInit(): void {
  }
}
