import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Attribute,
  AttributesManagerService,
  Resource,
  ResourcesManagerService
} from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { EditAttributeDialogComponent } from '../../../../../shared/components/dialogs/edit-attribute-dialog/edit-attribute-dialog.component';
import { DeleteAttributeDialogComponent } from '../../../../../shared/components/dialogs/delete-attribute-dialog/delete-attribute-dialog.component';
import { AttributesListComponent } from '@perun-web-apps/perun/components';
import { MatDialog } from '@angular/material/dialog';
import { CreateAttributeDialogComponent } from '../../../../../shared/components/dialogs/create-attribute-dialog/create-attribute-dialog.component';

@Component({
  selector: 'app-member-settings-resource-attributes',
  templateUrl: './member-settings-resource-attributes.component.html',
  styleUrls: ['./member-settings-resource-attributes.component.scss']
})
export class MemberSettingsResourceAttributesComponent implements OnInit {

  constructor(protected route: ActivatedRoute,
              private attributesManagerService: AttributesManagerService,
              private resourcesManagerService: ResourcesManagerService,
              private dialog:MatDialog) {
  }

  @ViewChild('list')
  list: AttributesListComponent;

  voId: number;
  memberId: number;
  attributes: Attribute[] = [];
  resources: Resource[] = [];
  selection = new SelectionModel<Attribute>(true, []);

  filter = '';
  filteredResources: Resource[] = [];

  loading: boolean;
  innerLoading: boolean;

  ngOnInit(): void {
    this.loading = true;
    this.route.parent.parent.params.subscribe(parent => {
      this.memberId = parent['memberId'];
      this.voId = parent['voId'];

      this.resourcesManagerService.getAllowedResources(this.memberId).subscribe(resources => {
        this.resources = resources;
        this.filteredResources = resources;
        this.loading = false;
      });
    });
  }

  getResourceAttributes(resourceId: number) {
    this.innerLoading = true;
    this.attributesManagerService.getMemberResourceAttributes(this.memberId, resourceId).subscribe(resAttributes => {
      this.attributes = resAttributes;
      this.innerLoading = false;
    });
  }

  applyFilter(filterValue: string) {
    this.filter = filterValue;
    this.filteredResources = this.resources.filter(res => res.name.toLowerCase().includes(filterValue.toLowerCase()));
  }

  onSave(resourceId: number) {
    // have to use this to update attribute with map in it, before saving it
    this.list.updateMapAttributes();

    const dialogRef = this.dialog.open(EditAttributeDialogComponent, {
      width: '450px',
      data: {
        entityId: this.memberId,
        entity: 'member',
        secondEntity: 'resource',
        secondEntityId: resourceId,
        attributes: this.selection.selected
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selection.clear();
        this.getResourceAttributes(resourceId);
      }
    });
  }

  onDelete(resourceId: number) {
    const dialogRef = this.dialog.open(DeleteAttributeDialogComponent, {
      width: '450px',
      data: {
        entityId: this.memberId,
        entity: 'member',
        secondEntity: 'resource',
        secondEntityId: resourceId,
        attributes: this.selection.selected
      }
    });

    dialogRef.afterClosed().subscribe(didConfirm => {
      if (didConfirm) {
        this.selection.clear();
        this.getResourceAttributes(resourceId);
      }
    });
  }

  onAdd(resourceId: number){
    const dialogRef = this.dialog.open(CreateAttributeDialogComponent, {
      width: '1050px',
      data: {
        entityId: this.memberId,
        entity: 'member',
        secondEntity: 'resource',
        secondEntityId: resourceId,
        notEmptyAttributes: this.attributes,
        style: 'member-theme'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selection.clear();
        this.getResourceAttributes(resourceId);
      }
    });
  }
}
