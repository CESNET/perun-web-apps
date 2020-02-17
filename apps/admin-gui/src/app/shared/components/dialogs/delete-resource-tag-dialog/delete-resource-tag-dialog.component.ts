import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource} from '@angular/material';
import { ResourcesManagerService, ResourceTag } from '@perun-web-apps/perun/openapi';

export interface DeleteResourceTagDialogDialogData {
  voId: number;
  tagsForDelete: ResourceTag[];
}

@Component({
  selector: 'app-delete-resource-tag-dialog',
  templateUrl: './delete-resource-tag-dialog.component.html',
  styleUrls: ['./delete-resource-tag-dialog.component.scss']
})
export class DeleteResourceTagDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<DeleteResourceTagDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private data: DeleteResourceTagDialogDialogData,
              private resourceManager: ResourcesManagerService) { }

  displayedColumns: string[] = ['name'];
  dataSource: MatTableDataSource<ResourceTag>;

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.data.tagsForDelete);
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onSubmit() {
    for (const resourceTag of this.data.tagsForDelete) {
      this.resourceManager.deleteResourceTag({resourceTag: resourceTag}).subscribe( () => {
        this.dialogRef.close(true);
      }, error => this.dialogRef.close(true));
    }
  }

}
