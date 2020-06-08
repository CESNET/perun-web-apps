import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Attribute,
  AttributesManagerService,
  Facility, Group,
  Resource,
  ResourcesManagerService
} from '@perun-web-apps/perun/openapi';
import { MatDialog } from '@angular/material/dialog';
import { AttributesListComponent } from '@perun-web-apps/perun/components';
import { SelectionModel } from '@angular/cdk/collections';
import { EditAttributeDialogComponent } from '../dialogs/edit-attribute-dialog/edit-attribute-dialog.component';
import { DeleteAttributeDialogComponent } from '../dialogs/delete-attribute-dialog/delete-attribute-dialog.component';
import { CreateAttributeDialogComponent } from '../dialogs/create-attribute-dialog/create-attribute-dialog.component';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';

@Component({
  selector: 'app-two-entity-attribute-page',
  templateUrl: './two-entity-attribute-page.component.html',
  styleUrls: ['./two-entity-attribute-page.component.scss']
})
export class TwoEntityAttributePageComponent implements OnChanges {

  constructor(protected route: ActivatedRoute,
              private attributesManagerService: AttributesManagerService,
              private resourcesManagerService: ResourcesManagerService,
              private dialog:MatDialog) {
  }

  @ViewChild('list')
  list: AttributesListComponent;

  @Input()
  firstEntityId: number;

  @Input()
  firstEntity: string;

  // @Input()
  // secondEntityId: number;

  @Input()
  secondEntity: string;

  @Input()
  entityValues: Resource[] | Facility[] | Group[];


  attributes: Attribute[] = [];
  selection = new SelectionModel<Attribute>(true, []);

  filter = '';
  filteredEntityValues: Resource[] | Facility [] = [];

  loading: boolean;
  innerLoading: boolean;

  ngOnChanges(): void {
    this.filteredEntityValues = this.entityValues;
  }

  getAttributes(entityId: number) {
    this.innerLoading = true;
    switch (this.firstEntity) {
      case 'member':
        switch (this.secondEntity) {
          case 'resource':
            this.attributesManagerService.getMemberResourceAttributes(this.firstEntityId, entityId).subscribe(attributes => {
              this.attributes = attributes;
              this.innerLoading = false;
            });
            break;
          case 'group':
            this.attributesManagerService.getMemberGroupAttributes(this.firstEntityId, entityId).subscribe(attributes => {
              this.attributes = attributes;
              this.innerLoading = false;
            });
        }
        break;
      case 'group':
        this.attributesManagerService.getGroupResourceAttributes(this.firstEntityId, entityId).subscribe(attributes => {
          this.attributes = attributes;
          this.innerLoading = false;
        });
        break;
      case 'user':
        this.attributesManagerService.getUserFacilityAttributes(this.firstEntityId, entityId).subscribe(attributes => {
          this.attributes = attributes;
          this.innerLoading = false;
        });
        break;
    }

  }

  applyFilter(filterValue: string) {
    this.filter = filterValue;
    this.filteredEntityValues = this.entityValues.filter(res => res.name.toLowerCase().includes(filterValue.toLowerCase()));
  }

  onSave(entityId: number) {
    // have to use this to update attribute with map in it, before saving it
    this.list.updateMapAttributes();

    const config = getDefaultDialogConfig();
    config.width = '450px';
    config.data = {
      entityId: this.firstEntityId,
      entity: this.firstEntity,
      secondEntity: this.secondEntity,
      secondEntityId: entityId,
      attributes: this.selection.selected
    };

    const dialogRef = this.dialog.open(EditAttributeDialogComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selection.clear();
        this.getAttributes(entityId);
      }
    });
  }

  onDelete(entityId: number) {
    const config = getDefaultDialogConfig();
    config.width = '450px';
    config.data = {
      entityId: this.firstEntityId,
      entity: this.firstEntity,
      secondEntity: this.secondEntity,
      secondEntityId: entityId,
      attributes: this.selection.selected
    };

    const dialogRef = this.dialog.open(DeleteAttributeDialogComponent, config);

    dialogRef.afterClosed().subscribe(didConfirm => {
      if (didConfirm) {
        this.selection.clear();
        this.getAttributes(entityId);
      }
    });
  }

  onAdd(entityId: number){
    const config = getDefaultDialogConfig();
    config.width = '1050px';
    config.data = {
      entityId: this.firstEntityId,
      entity: this.firstEntity,
      secondEntity: this.secondEntity,
      secondEntityId: entityId,
      notEmptyAttributes: this.attributes,
      style: `${this.firstEntity}-theme`
    };

    const dialogRef = this.dialog.open(CreateAttributeDialogComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selection.clear();
        this.getAttributes(entityId);
      }
    });
  }

}
