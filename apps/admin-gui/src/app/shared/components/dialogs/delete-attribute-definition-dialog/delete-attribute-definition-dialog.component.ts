import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AttributeDefinition, AttributesManagerService } from '@perun-web-apps/perun/openapi';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

export interface DeleteAttributeDefinitionDialogData {
  attributes: AttributeDefinition[];
  theme: string;
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    UiAlertsModule,
    LoadingDialogComponent,
    MatTableModule,
    TranslateModule,
    LoaderDirective,
  ],
  standalone: true,
  selector: 'app-delete-attribute-definition-dialog',
  templateUrl: './delete-attribute-definition-dialog.component.html',
  styleUrls: ['./delete-attribute-definition-dialog.component.scss'],
})
export class DeleteAttributeDefinitionDialogComponent implements OnInit {
  displayedColumns: string[] = ['name'];
  dataSource: MatTableDataSource<AttributeDefinition>;
  loading = false;
  theme: string;

  constructor(
    public dialogRef: MatDialogRef<DeleteAttributeDefinitionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteAttributeDefinitionDialogData,
    private notificator: NotificatorService,
    private translate: TranslateService,
    private attributesManager: AttributesManagerService,
  ) {}

  ngOnInit(): void {
    this.theme = this.data.theme;
    this.dataSource = new MatTableDataSource<AttributeDefinition>(this.data.attributes);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    this.loading = true;
    const ids: number[] = [];
    for (const attr of this.data.attributes) {
      ids.push(attr.id);
    }

    this.attributesManager.deleteAttributeDefinitions(ids).subscribe(
      () => {
        this.translate
          .get('DIALOGS.DELETE_ATTRIBUTE_DEFINITION.SUCCESS')
          .subscribe((successMessage: string) => {
            this.notificator.showSuccess(successMessage);
            this.dialogRef.close(true);
          });
      },
      () => (this.loading = false),
    );
  }
}
