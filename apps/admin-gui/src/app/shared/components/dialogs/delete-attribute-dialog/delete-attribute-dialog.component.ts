import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { AttrEntity } from '@perun-web-apps/perun/models';
import { Attribute, AttributesManagerService } from '@perun-web-apps/perun/openapi';

export interface DeleteAttributeDialogData {
  entityId: number;
  entity: AttrEntity;
  attributes: Attribute[];
  secondEntity?: AttrEntity;
  secondEntityId?: number;
}

@Component({
  selector: 'app-delete-attribute-dialog',
  templateUrl: './delete-attribute-dialog.component.html',
  styleUrls: ['./delete-attribute-dialog.component.scss']
})
export class DeleteAttributeDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteAttributeDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DeleteAttributeDialogData,
              private notificator: NotificatorService,
              private translate: TranslateService,
              private attributesManager: AttributesManagerService
  ) {
  }

  displayedColumns: string[] = ['name'];
  dataSource: MatTableDataSource<Attribute>;

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Attribute>(this.data.attributes);
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onSubmit() {
    const ids: number[] = [];
    for (const attr of this.data.attributes) {
      ids.push(attr.id);
    }

    const payload: any = {};

    payload[this.data.entity] = this.data.entityId;
    payload['attributes'] = ids;

    if (this.data.secondEntity !== undefined) {
      payload[this.data.secondEntity] = this.data.secondEntityId;
    }

    switch (this.data.entity) {
      case 'vo':
        this.attributesManager.removeVoAttributes(this.data.entityId, ids).subscribe(() => {
          this.onSuccess();
        });
        break;
      case 'group':
        switch (this.data.secondEntity) {
          case 'resource':
            this.attributesManager.removeGroupResourceAttributes(this.data.entityId, this.data.secondEntityId, ids).subscribe(() => this.onSuccess());
            break;
          default:
            this.attributesManager.removeGroupAttributes(this.data.entityId, ids).subscribe(() => this.onSuccess());
        }
        break;
      case 'user':
        switch (this.data.secondEntity) {
          case 'facility':
            this.attributesManager.removeUserFacilityAttributes(this.data.entityId, this.data.secondEntityId, ids).subscribe(() => this.onSuccess());
            break;
          default:
            this.attributesManager.removeUserAttributes(this.data.entityId, ids).subscribe(() => this.onSuccess());
        }
        break;
      case 'member':
        switch (this.data.secondEntity) {
          case 'resource':
            this.attributesManager.removeMemberResourceAttributes(this.data.entityId, this.data.secondEntityId, ids).subscribe(() => this.onSuccess());
            break;
          case 'group':
            this.attributesManager.removeMemberGroupAttributes(this.data.entityId, this.data.secondEntityId, ids).subscribe(() => this.onSuccess());
            break;
          default:
            this.attributesManager.removeMemberAttributes(this.data.entityId, ids).subscribe(() => this.onSuccess());
        }
        break;
      case 'facility':
        this.attributesManager.removeFacilityAttributes(this.data.entityId, ids).subscribe(() => {
          this.onSuccess();
        });
        break;
      case 'host':
        this.attributesManager.removeHostAttributes(this.data.entityId, ids).subscribe(() => {
          this.onSuccess();
        });
        break;
    }
  }

  onSuccess() {
    this.translate.get('DIALOGS.DELETE_ATTRIBUTES.SUCCESS').subscribe(successMessage => {
      this.notificator.showSuccess(successMessage);
      this.dialogRef.close(true);
    });
  }
}
