import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Attribute,
  AttributesManagerService,
  Facility,
  Resource,
  ResourcesManagerService
} from '@perun-web-apps/perun/openapi';
import { MatDialog } from '@angular/material/dialog';
import { AttributesListComponent } from '@perun-web-apps/perun/components';
import { SelectionModel } from '@angular/cdk/collections';
import { EditAttributeDialogComponent } from '../dialogs/edit-attribute-dialog/edit-attribute-dialog.component';
import { DeleteAttributeDialogComponent } from '../dialogs/delete-attribute-dialog/delete-attribute-dialog.component';
import { CreateAttributeDialogComponent } from '../dialogs/create-attribute-dialog/create-attribute-dialog.component';

@Component({
  selector: 'perun-web-apps-two-entity-attribute-page',
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
  entityValues: Resource[] | Facility[];


  attributes: Attribute[] = [];
  selection = new SelectionModel<Attribute>(true, []);

  filter = '';
  filteredEntityValues: Resource[] | Facility [] = [];

  loading: boolean;
  innerLoading: boolean;

  ngOnChanges(): void {
    this.filteredEntityValues = this.entityValues;
  }

  getResourceAttributes(entityId: number) {
    this.innerLoading = true;
    this.attributesManagerService.getMemberResourceAttributes(this.firstEntityId, entityId).subscribe(resAttributes => {
      this.attributes = resAttributes;
      this.innerLoading = false;
    });
  }

  applyFilter(filterValue: string) {
    this.filter = filterValue;
    this.filteredEntityValues = this.entityValues.filter(res => res.name.toLowerCase().includes(filterValue.toLowerCase()));
  }

  onSave(entityId: number) {
    // have to use this to update attribute with map in it, before saving it
    this.list.updateMapAttributes();

    const dialogRef = this.dialog.open(EditAttributeDialogComponent, {
      width: '450px',
      data: {
        entityId: this.firstEntityId,
        entity: this.firstEntity,
        secondEntity: this.secondEntity,
        secondEntityId: entityId,
        attributes: this.selection.selected
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selection.clear();
        this.getResourceAttributes(entityId);
      }
    });
  }

  onDelete(entityId: number) {
    const dialogRef = this.dialog.open(DeleteAttributeDialogComponent, {
      width: '450px',
      data: {
        entityId: this.firstEntityId,
        entity: this.firstEntity,
        secondEntity: this.secondEntity,
        secondEntityId: entityId,
        attributes: this.selection.selected
      }
    });

    dialogRef.afterClosed().subscribe(didConfirm => {
      if (didConfirm) {
        this.selection.clear();
        this.getResourceAttributes(entityId);
      }
    });
  }

  onAdd(entityId: number){
    const dialogRef = this.dialog.open(CreateAttributeDialogComponent, {
      width: '1050px',
      data: {
        entityId: this.firstEntityId,
        entity: this.firstEntity,
        secondEntity: this.secondEntity,
        secondEntityId: entityId,
        notEmptyAttributes: this.attributes,
        style: 'member-theme'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selection.clear();
        this.getResourceAttributes(entityId);
      }
    });
  }

}
