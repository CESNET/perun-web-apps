import { TranslateModule } from '@ngx-translate/core';
import { DebounceFilterComponent, RefreshButtonComponent } from '@perun-web-apps/perun/components';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import {
  AttributeDefinition,
  AttributesManagerService,
  Service,
} from '@perun-web-apps/perun/openapi';
import { TABLE_REQUIRED_ATTRIBUTES } from '@perun-web-apps/config/table-config';
import { MatDialog } from '@angular/material/dialog';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import {
  AddRequiredAttributesDialogComponent,
  AddRequiredAttributesDialogData,
} from '../../../../../../shared/components/dialogs/add-required-attributes-dialog/add-required-attributes-dialog.component';
import {
  RemoveRequiredAttributesDialogComponent,
  RemoveRequiredAttributesDialogData,
} from '../../../../../../shared/components/dialogs/remove-required-attributes-dialog/remove-required-attributes-dialog.component';
import { EntityStorageService, GuiAuthResolver } from '@perun-web-apps/perun/services';
import { BehaviorSubject } from 'rxjs';
import { AttrDefListComponent } from '../../../../../../shared/components/attr-def-list/attr-def-list.component';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    DebounceFilterComponent,
    RefreshButtonComponent,
    TranslateModule,
    AttrDefListComponent,
    LoaderDirective,
    LoadingTableComponent,
  ],
  standalone: true,
  selector: 'app-service-required-attributes',
  templateUrl: './service-required-attributes.component.html',
  styleUrls: ['./service-required-attributes.component.scss'],
})
export class ServiceRequiredAttributesComponent implements OnInit {
  loading = false;
  filterValue = '';
  selection = new SelectionModel<AttributeDefinition>(
    true,
    [],
    true,
    (attributeDefinition1, attributeDefinition2) =>
      attributeDefinition1.id === attributeDefinition2.id,
  );
  cachedSubject = new BehaviorSubject(true);
  attrDefinitions: AttributeDefinition[] = [];
  tableId = TABLE_REQUIRED_ATTRIBUTES;
  private service: Service;

  constructor(
    private attributeManager: AttributesManagerService,
    private dialog: MatDialog,
    public authResolver: GuiAuthResolver,
    private entityStorageService: EntityStorageService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.service = this.entityStorageService.getEntity();
    this.refreshTable();
  }

  refreshTable(): void {
    this.loading = true;
    this.attributeManager.getRequiredAttributesDefinition(this.service.id).subscribe((attrDef) => {
      this.selection.clear();
      this.cachedSubject.next(true);
      this.attrDefinitions = attrDef;
      this.loading = false;
    });
  }

  onAdd(): void {
    const config = getDefaultDialogConfig<AddRequiredAttributesDialogData>();
    config.width = '950px';
    config.data = {
      serviceId: this.service.id,
      theme: 'service-theme',
    };

    const dialogRef = this.dialog.open(AddRequiredAttributesDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshTable();
      }
    });
  }

  onRemove(): void {
    const config = getDefaultDialogConfig<RemoveRequiredAttributesDialogData>();
    config.width = '650px';
    config.data = {
      serviceId: this.service.id,
      attrDefinitions: this.selection.selected,
      theme: 'service-theme',
    };

    const dialogRef = this.dialog.open(RemoveRequiredAttributesDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshTable();
      }
    });
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.refreshTable();
  }
}
