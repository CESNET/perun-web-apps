import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { ResourcesManagerService } from '@perun-web-apps/perun/openapi';

export interface CreateResourceTagDialogDialogData {
  voId: number;
}

@Component({
  selector: 'app-create-resource-tag-dialog',
  templateUrl: './create-resource-tag-dialog.component.html',
  styleUrls: ['./create-resource-tag-dialog.component.scss']
})
export class CreateResourceTagDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<CreateResourceTagDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private data: CreateResourceTagDialogDialogData,
              private resourceManager: ResourcesManagerService) { }

  name = '';

  ngOnInit() {
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onSubmit() {
    if (this.name !== '') {
      this.resourceManager.createResourceTagWithTagName({tagName: this.name, vo: this.data.voId}).subscribe( () => {
        this.dialogRef.close(true);
      });
    }

  }
}
