import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {AttributesListComponent} from '../../attributes-list/attributes-list.component';
import {NotificatorService} from '../../../../core/services/common/notificator.service';
import {TranslateService} from '@ngx-translate/core';
import { AttrEntity } from '@perun-web-apps/perun/models';
import { filterCoreAttributes } from '@perun-web-apps/perun/utils';
import { AttributesService } from '@perun-web-apps/perun/services';
import { Attribute, AttributesManagerService } from '@perun-web-apps/perun/openapi';

export interface CreateAttributeDialogData {
  entityId: number;
  notEmptyAttributes: Attribute[];
  style?: string;
  entity: AttrEntity;
}

@Component({
  selector: 'app-create-attribute-dialog',
  templateUrl: './create-attribute-dialog.component.html',
  styleUrls: ['./create-attribute-dialog.component.scss']
})

export class CreateAttributeDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<CreateAttributeDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: CreateAttributeDialogData,
              private attributesService: AttributesService,
              private attributesManager: AttributesManagerService,
              private notificator: NotificatorService,
              private translate: TranslateService) {
    this.translate.get('DIALOGS.CREATE_ATTRIBUTE.SUCCESS_SAVE').subscribe(value => this.saveSuccessMessage = value);
  }

  @ViewChild('list', {static: false})
  list: AttributesListComponent;

  attributes: Attribute[];
  selected = new SelectionModel<Attribute>(true, []);
  saveSuccessMessage: string;
  showError = false;
  filterValue = '';

  ngOnInit() {
    const unWanted = new Array<number>();
    this.data.notEmptyAttributes.forEach(attribute => {
      unWanted.push(attribute.id);
    });
    this.attributesService.getAttributeDefinitionsWithRights(this.data.entityId, this.data.entity).subscribe(attributes => {
      this.attributes = attributes as Attribute[];
      this.attributes = this.attributes.filter(attribute => {
        return !unWanted.includes(attribute.id);
      });
      this.attributes = filterCoreAttributes(this.attributes);
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave() {
    this.list.updateMapAttributes();
    let containsEmpty = false;
    for (const attribute of this.selected.selected) {
      if (attribute.type === 'java.util.ArrayList' && (<Array<any>>attribute.value).length === 0) {
        containsEmpty = true;
      }
      if (attribute.value === undefined) {
        containsEmpty = true;
      }
    }
    if (containsEmpty) {
      this.showError = true;
      setTimeout(() => {
        this.showError = false;
      }, 5000);
      return;
    }

    switch (this.data.entity) {
      case 'facility':
        this.attributesManager.setFacilityAttributes({facility: this.data.entityId, attributes: this.selected.selected}).subscribe(() => {
          this.handleSuccess();
        });
        break;
      case 'group':
        this.attributesManager.setGroupAttributes({group: this.data.entityId, attributes: this.selected.selected}).subscribe(() => {
          this.handleSuccess();
        });
        break;
      case 'member':
        this.attributesManager.setMemberAttributes({member: this.data.entityId, attributes: this.selected.selected}).subscribe(() => {
          this.handleSuccess();
        });
        break;
      case 'resource':
        this.attributesManager.setResourceAttributes({resource: this.data.entityId, attributes: this.selected.selected}).subscribe(() => {
          this.handleSuccess();
        });
        break;
      case 'user':
        this.attributesManager.setUserAttributes({user: this.data.entityId, attributes: this.selected.selected}).subscribe(() => {
          this.handleSuccess();
        });
        break;
      case 'vo':
        this.attributesManager.setVoAttributes({vo: this.data.entityId, attributes: this.selected.selected}).subscribe(() => {
          this.handleSuccess();
        });
        break;
    }
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
  }

  handleSuccess() {
    this.notificator.showSuccess(this.saveSuccessMessage);
    this.selected.clear();
    this.dialogRef.close('saved');
  }
}

