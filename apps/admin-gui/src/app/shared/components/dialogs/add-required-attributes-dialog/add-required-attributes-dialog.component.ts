import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  AttributeDefinition,
  AttributesManagerService,
  ServicesManagerService,
} from '@perun-web-apps/perun/openapi';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { SelectionModel } from '@angular/cdk/collections';

export interface AddRequiredAttributesDialogData {
  serviceId: number;
  theme: string;
}

@Component({
  selector: 'app-add-required-attributes',
  templateUrl: './add-required-attributes-dialog.component.html',
  styleUrls: ['./add-required-attributes-dialog.component.scss'],
})
export class AddRequiredAttributesDialogComponent implements OnInit {
  theme: string;
  attrDefinitions: AttributeDefinition[] = [];
  selection = new SelectionModel<AttributeDefinition>(true, []);
  filterValue = '';
  loading = false;
  private serviceId: number;

  constructor(
    private dialogRef: MatDialogRef<AddRequiredAttributesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: AddRequiredAttributesDialogData,
    private serviceManager: ServicesManagerService,
    private attributesManager: AttributesManagerService,
    private notificator: NotificatorService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.theme = this.data.theme;
    this.serviceId = this.data.serviceId;
    this.attributesManager.getAllAttributeDefinitions().subscribe((attrDefinitions) => {
      this.attrDefinitions = attrDefinitions;
      this.loading = false;
    });
  }

  onAdd(): void {
    this.loading = true;
    const attrDefinitionsIds = this.selection.selected.map((attrDef) => attrDef.id);

    this.serviceManager.addRequiredAttributes(this.serviceId, attrDefinitionsIds).subscribe(
      () => {
        this.notificator.showSuccess(
          this.translate.instant('DIALOGS.ADD_REQUIRED_ATTRIBUTES.SUCCESS') as string
        );
        this.dialogRef.close(true);
        this.loading = false;
      },
      () => (this.loading = false)
    );
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
  }
}
