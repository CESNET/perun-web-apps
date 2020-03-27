import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AttributesManagerService } from '@perun-web-apps/perun/openapi';
import { MatTableDataSource } from '@angular/material/table';

export interface RemoveUnixGroupDialogData {
  groups: string[];
  namespace: string;
  userId: number;
}

@Component({
  selector: 'perun-web-apps-remove-unix-group-dialog',
  templateUrl: './remove-unix-group-dialog.component.html',
  styleUrls: ['./remove-unix-group-dialog.component.scss']
})
export class RemoveUnixGroupDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<RemoveUnixGroupDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private data: RemoveUnixGroupDialogData,
              private attributesManagerService:AttributesManagerService) { }

  displayedColumns: string[] = ['name'];
  dataSource: MatTableDataSource<string>;

  ngOnInit() {
    console.log(this.data.groups);
    this.dataSource = new MatTableDataSource<string>(this.data.groups);
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onSubmit() {
    this.attributesManagerService.getUserAttributeByName(this.data.userId, `urn:perun:user:attribute-def:def:preferredUnixGroupName-namespace:${this.data.namespace}`).subscribe(attribute => {
      // @ts-ignore
      let groups: string[] = attribute.value ? attribute.value : [];
      groups = groups.filter(elem => !this.data.groups.find(el => el === elem));
      attribute.value = groups;

      this.attributesManagerService.setUserAttribute({ user: this.data.userId, attribute: attribute }).subscribe(() => {
        this.dialogRef.close(true);
      });
    });
  }
}
