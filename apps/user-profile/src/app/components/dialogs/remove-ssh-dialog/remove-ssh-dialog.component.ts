import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Attribute, AttributesManagerService} from '@perun-web-apps/perun/openapi';

export interface RemoveSshDialogData {
  keys: string[];
  attribute: Attribute;
  userId: number;
}

@Component({
  selector: 'perun-web-apps-remove-ssh-dialog',
  templateUrl: './remove-ssh-dialog.component.html',
  styleUrls: ['./remove-ssh-dialog.component.scss']
})
export class RemoveSshDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<RemoveSshDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private data: RemoveSshDialogData,
              private attributesManagerService:AttributesManagerService) { }

  displayedColumns: string[] = ['name'];
  dataSource: MatTableDataSource<string>;

  ngOnInit() {
    this.dataSource = new MatTableDataSource<string>(this.data.keys);
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onSubmit() {
    // @ts-ignore
    let keys: string[] = this.data.attribute.value ? this.data.attribute.value : [];
    keys = keys.filter(elem => elem !== this.data.keys[0]);
    this.data.attribute.value = keys;

    this.attributesManagerService.setUserAttribute({ user: this.data.userId, attribute: this.data.attribute }).subscribe(() => {
      this.dialogRef.close(true);
    });

  }

}
