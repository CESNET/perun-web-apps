import { MatTooltip } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { AttributeRightsService, NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import {
  AttributeAction,
  AttributeDefinition,
  AttributePolicyCollection,
  AttributesManagerService,
  Service,
  ServicesManagerService,
} from '@perun-web-apps/perun/openapi';
import { slideInOutLeft, slideInOutRight, switchAnimation } from '@perun-web-apps/perun/animations';
import { AttributeForExportData } from '@perun-web-apps/perun/models';
import { TABLE_ENTITYLESS_ATTRIBUTE_KEYS } from '@perun-web-apps/config/table-config';
import { Clipboard } from '@angular/cdk/clipboard';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { spaceNameValidator } from '@perun-web-apps/perun/utils';
import { ServicesListComponent } from '../../services-list/services-list.component';
import { AttributeUniqueCheckboxComponent } from '@perun-web-apps/perun/components';
import { AttributeRightsTabGroupComponent } from '@perun-web-apps/perun/components';
import { AttributeCriticalOperationsCheckboxesComponent } from '@perun-web-apps/perun/components';
import { EntitylessAttributeKeysListComponent } from '../../entityless-attribute-keys-list/entityless-attribute-keys-list.component';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

export interface EditAttributeDefinitionDialogData {
  attDef: AttributeDefinition;
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    LoadingDialogComponent,
    MatExpansionModule,
    TranslateModule,
    MatTooltip,
    ServicesListComponent,
    AttributeUniqueCheckboxComponent,
    AttributeRightsTabGroupComponent,
    AttributeCriticalOperationsCheckboxesComponent,
    EntitylessAttributeKeysListComponent,
    LoaderDirective,
  ],
  standalone: true,
  selector: 'app-edit-attribute-definition-dialog',
  templateUrl: './edit-attribute-definition-dialog.component.html',
  styleUrls: ['./edit-attribute-definition-dialog.component.scss'],
  animations: [switchAnimation, slideInOutLeft, slideInOutRight],
})
export class EditAttributeDefinitionDialogComponent implements OnInit {
  tableId = TABLE_ENTITYLESS_ATTRIBUTE_KEYS;
  loading = false;
  showKeys = false;
  attDef: AttributeDefinition = this.data.attDef;
  initUnique: boolean;
  initReadOperations: boolean;
  initReadGlobal: boolean;
  initWriteOperations: boolean;
  initWriteGlobal: boolean;
  finalReadOperations: boolean;
  finalReadGlobal: boolean;
  finalWriteOperations: boolean;
  finalWriteGlobal: boolean;
  attributeControl = this.formBuilder.group({
    name: [this.attDef.displayName, [Validators.required, spaceNameValidator()]],
    description: [this.attDef.description, Validators.required],
  });
  urn = `${this.attDef.namespace}:${this.attDef.friendlyName}`;
  collections$ = new BehaviorSubject<AttributePolicyCollection[]>([]);
  emptyCollections: AttributePolicyCollection[] = [
    {
      id: -1,
      attributeId: this.data.attDef.id,
      action: AttributeAction.READ,
      policies: [],
    },
  ];
  services$: Observable<Service[]> = this.serviceService
    .getServicesByAttributeDefinition(this.attDef.id)
    .pipe(startWith([]));

  constructor(
    public dialogRef: MatDialogRef<EditAttributeDefinitionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditAttributeDefinitionDialogData,
    private notificator: NotificatorService,
    private translate: TranslateService,
    private clipboard: Clipboard,
    private attributesManager: AttributesManagerService,
    private serviceService: ServicesManagerService,
    private formBuilder: FormBuilder,
    private attributeRightsService: AttributeRightsService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.dialogRef.addPanelClass('mat-dialog-height-transition');
    this.initUnique = this.attDef.unique;
    this.attributesManager.getAttributeRules(this.attDef.id).subscribe((attrRights) => {
      this.collections$ = new BehaviorSubject(attrRights.attributePolicyCollections);
      this.initReadOperations = 'READ' in attrRights.criticalActions;
      this.initWriteOperations = 'WRITE' in attrRights.criticalActions;
      this.initReadGlobal = attrRights.criticalActions['READ'] || false;
      this.initWriteGlobal = attrRights.criticalActions['WRITE'] || false;
      this.loading = false;
    });
  }

  onSubmit(): void {
    this.loading = true;
    this.updateAttribute();
    // create a copy in order not to update the unique flag with the first call, would cause an exception in the
    // value conversion call
    const dummyAttrDef = { ...this.attDef };
    dummyAttrDef.unique = this.initUnique;
    this.attributesManager
      .updateAttributeDefinition({ attributeDefinition: dummyAttrDef })
      .pipe(
        switchMap(() => of(this.collections$.getValue())),
        this.attributeRightsService.filterNullInPolicy(),
        switchMap((collections) =>
          // If list of collections is empty then pass empty collection with attribute definition ID for which all existing policies should be removed.
          this.attributesManager.setAttributePolicyCollections(
            collections.length > 0
              ? { policyCollections: collections }
              : { policyCollections: this.emptyCollections },
          ),
        ),
        switchMap(() =>
          this.attributeRightsService.updateAttributeAction(
            this.finalReadOperations,
            this.initReadOperations,
            this.finalReadGlobal,
            this.initReadGlobal,
            this.attDef.id,
            AttributeAction.READ,
          ),
        ),
        switchMap(() =>
          this.attributeRightsService.updateAttributeAction(
            this.finalWriteOperations,
            this.initWriteOperations,
            this.finalWriteGlobal,
            this.initWriteGlobal,
            this.attDef.id,
            AttributeAction.WRITE,
          ),
        ),
        switchMap(() => {
          if (this.initUnique === this.attDef.unique) {
            return of(null);
          }
          return this.attDef.unique
            ? this.attributesManager.convertAttributeToUnique(this.attDef.id)
            : this.attributesManager.convertAttributeToNonunique(this.attDef.id);
        }),
      )
      .subscribe({
        next: () => {
          this.notificator.showSuccess(
            this.translate.instant('DIALOGS.EDIT_ATTRIBUTE_DEFINITION.SUCCESS') as string,
          );
          this.dialogRef.close(true);
        },
        error: (err) => {
          // as long as the conversion to unique is the last call of the switch map this should be always correct
          this.attDef.unique = this.initUnique;
          this.loading = false;
          console.error(err);
        },
      });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  switchShowKeys(): void {
    this.showKeys = !this.showKeys;
    if (this.showKeys) {
      this.dialogRef.updateSize('800px');
    } else {
      this.dialogRef.updateSize('700px');
    }
  }

  copyUrn(): void {
    const success = this.clipboard.copy(this.urn);
    if (success) {
      this.notificator.showSuccess(
        this.translate.instant('DIALOGS.EDIT_ATTRIBUTE_DEFINITION.COPIED') as string,
      );
    } else {
      this.notificator.showError(
        this.translate.instant('DIALOGS.EDIT_ATTRIBUTE_DEFINITION.COPY_FAILED') as string,
      );
    }
  }

  onCopy(): void {
    this.updateAttribute();
    const data: AttributeForExportData = {
      attributeDefinition: this.attDef,
      attributeRights: this.collections$.getValue(),
    };
    const success = this.clipboard.copy(JSON.stringify(data));
    if (success) {
      this.notificator.showSuccess(
        this.translate.instant('DIALOGS.EDIT_ATTRIBUTE_DEFINITION.COPIED') as string,
      );
    } else {
      this.notificator.showError(
        this.translate.instant('DIALOGS.EDIT_ATTRIBUTE_DEFINITION.COPY_FAILED') as string,
      );
    }
  }

  private updateAttribute(): void {
    this.attDef.displayName = this.attributeControl.value.name;
    this.attDef.description = this.attributeControl.value.description;
  }
}
