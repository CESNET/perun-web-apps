import { TranslateModule } from '@ngx-translate/core';
import { DebounceFilterComponent, RefreshButtonComponent } from '@perun-web-apps/perun/components';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, HostBinding, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import {
  DeleteAttributeDefinitionDialogComponent,
  DeleteAttributeDefinitionDialogData,
} from '../../../../shared/components/dialogs/delete-attribute-definition-dialog/delete-attribute-definition-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CreateAttributeDefinitionDialogComponent } from '../../../../shared/components/dialogs/create-attribute-definition-dialog/create-attribute-definition-dialog.component';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { AttributeDefinition, AttributesManagerService } from '@perun-web-apps/perun/openapi';
import { TABLE_ADMIN_ATTRIBUTES } from '@perun-web-apps/config/table-config';
import { AttributeImportDialogComponent } from '../../../../shared/components/dialogs/attribute-import-dialog/attribute-import-dialog.component';
import { GuiAuthResolver } from '@perun-web-apps/perun/services';
import { BehaviorSubject } from 'rxjs';
import { AttrDefListComponent } from '../../../../shared/components/attr-def-list/attr-def-list.component';
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
  selector: 'app-admin-attributes',
  templateUrl: './admin-attributes.component.html',
  styleUrls: ['./admin-attributes.component.scss'],
})
export class AdminAttributesComponent implements OnInit {
  @HostBinding('class.router-component') true;

  attrDefinitions: AttributeDefinition[] = [];

  selected = new SelectionModel<AttributeDefinition>(
    true,
    [],
    true,
    (attributeDefinition1, attributeDefinition2) =>
      attributeDefinition1.id === attributeDefinition2.id,
  );
  cachedSubject = new BehaviorSubject(true);
  filterValue = '';

  loading: boolean;
  tableId = TABLE_ADMIN_ATTRIBUTES;

  constructor(
    private dialog: MatDialog,
    private attributesManager: AttributesManagerService,
    public authResolver: GuiAuthResolver,
  ) {}

  ngOnInit(): void {
    this.refreshTable();
  }

  onCreate(): void {
    const config = getDefaultDialogConfig<never>();
    config.width = '650px';

    const dialogRef = this.dialog.open(CreateAttributeDefinitionDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshTable();
      }
    });
  }

  onDelete(): void {
    const config = getDefaultDialogConfig<DeleteAttributeDefinitionDialogData>();
    config.width = '450px';
    config.data = {
      attributes: this.selected.selected,
      theme: 'admin-theme',
    };

    const dialogRef = this.dialog.open(DeleteAttributeDefinitionDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshTable();
      }
    });
  }

  refreshTable(): void {
    this.loading = true;
    this.attributesManager.getAllAttributeDefinitions().subscribe((attrDefs) => {
      this.attrDefinitions = attrDefs;
      this.selected.clear();
      this.cachedSubject.next(true);
      this.loading = false;
    });
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.refreshTable();
  }

  onImport(): void {
    const config = getDefaultDialogConfig<never>();
    config.width = '700px';

    const dialogRef = this.dialog.open(AttributeImportDialogComponent, config);

    dialogRef.afterClosed().subscribe((value) => {
      if (value === true) {
        this.refreshTable();
      }
    });
  }
}
