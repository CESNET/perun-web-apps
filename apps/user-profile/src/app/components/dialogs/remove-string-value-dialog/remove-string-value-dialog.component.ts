import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Attribute, AttributesManagerService } from '@perun-web-apps/perun/openapi';
import { MatTableDataSource } from '@angular/material/table';

export interface RemoveStringValueDialogData {
  values: string[];
  attribute: Attribute;
  userId: number;
  description: string;
  title: string;
}

@Component({
  selector: 'perun-web-apps-remove-string-value-dialog',
  templateUrl: './remove-string-value-dialog.component.html',
  styleUrls: ['./remove-string-value-dialog.component.scss']
})
export class RemoveStringValueDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<RemoveStringValueDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private data: RemoveStringValueDialogData,
              private attributesManagerService:AttributesManagerService) { }

  displayedColumns: string[] = ['name'];
  dataSource: MatTableDataSource<string>;

  description: string;
  title: string;

  ngOnInit() {
    this.dataSource = new MatTableDataSource<string>(this.data.values);
    this.description = this.data.description;
    this.title = this.data.title;
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onSubmit() {
    // @ts-ignore
    let values: string[] = this.data.attribute.value ? this.data.attribute.value : [];
    values = values.filter(elem => !this.data.values.find(el => el === elem));
    this.data.attribute.value = values;

    this.attributesManagerService.setUserAttribute({ user: this.data.userId, attribute: this.data.attribute }).subscribe(() => {
      this.dialogRef.close(true);
    });

  }


}
