import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { Attribute, AttributesManagerService} from '@perun-web-apps/perun/openapi';
import { MatTableDataSource } from '@angular/material/table';
import { AttrEntity } from '@perun-web-apps/perun/models';

export interface EditAttributeDialogData {
  entityId: number;
  entity: AttrEntity;
  attributes: Attribute[];
  secondEntity?: AttrEntity;
  secondEntityId?: number;
}

@Component({
  selector: 'app-edit-attribute-dialog',
  templateUrl: './edit-attribute-dialog.component.html',
  styleUrls: ['./edit-attribute-dialog.component.css']
})
export class EditAttributeDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EditAttributeDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: EditAttributeDialogData,
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

    if (this.data.secondEntity === undefined) {
      if (this.data.entity === 'vo') {
        this.attributesManager.setVoAttributes({
          vo: this.data.entityId,
          attributes: this.data.attributes
        }).subscribe(() => {
          this.onSuccess();
        });
      } else if (this.data.entity === 'group') {
        this.attributesManager.setGroupAttributes({
          group: this.data.entityId,
          attributes: this.data.attributes
        }).subscribe(() => {
          this.onSuccess();
        });
      } else if (this.data.entity === 'user') {
        this.attributesManager.setUserAttributes({
          user: this.data.entityId,
          attributes: this.data.attributes
        }).subscribe(() => {
          this.onSuccess();
        });
      } else if (this.data.entity === 'member') {
        this.attributesManager.setMemberAttributes({
          member: this.data.entityId,
          attributes: this.data.attributes
        }).subscribe(() => {
          this.onSuccess();
        });
      } else if (this.data.entity === 'facility') {
        this.attributesManager.setFacilityAttributes({
          facility: this.data.entityId,
          attributes: this.data.attributes
        }).subscribe(() => {
          this.onSuccess();
        });
      }
    } else {
      // TODO attributes with two entities
      switch (this.data.secondEntity) {
        case 'resource':
          this.attributesManager.setMemberResourceAttributes({
            member: this.data.entityId,
            resource: this.data.secondEntityId,
            attributes: this.data.attributes
          }).subscribe(() => this.onSuccess());
      }
    }
  }

  onSuccess() {
    this.translate.get('DIALOGS.EDIT_ATTRIBUTES.SUCCESS').subscribe(successMessage => {
      this.notificator.showSuccess(successMessage);
      this.dialogRef.close(true);
    });
  }
}
