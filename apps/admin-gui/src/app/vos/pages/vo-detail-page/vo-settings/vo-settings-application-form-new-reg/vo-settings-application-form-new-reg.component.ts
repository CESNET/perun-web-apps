import { MatTooltip } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDivider } from '@angular/material/divider';
import { AlertComponent } from '@perun-web-apps/ui/alerts';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {
  EntityStorageService,
  GuiAuthResolver,
  NotificatorService,
} from '@perun-web-apps/perun/services';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Vo } from '@perun-web-apps/perun/openapi';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';
import {
  BulkItemDefinitionUpdateRequest,
  FormSpecificationDTO,
  FormsService,
  FormTypeConfig,
  ItemDefinitionDTO,
  ItemDefinitionPatchRequest,
  ItemWithDefinitionDTO,
} from '@perun-web-apps/perun/registrar-openapi';
import { AddApplicationFormItemDialogNewRegComponent } from '../../../../../shared/components/dialogs/add-application-form-item-dialog-new-reg/add-application-form-item-dialog-new-reg.component';
import { EditApplicationFormItemDialogNewRegComponent } from '../../../../../shared/components/dialogs/edit-application-form-item-dialog-new-reg/edit-application-form-item-dialog-new-reg.component';
import { UpdateApplicationFormDialogNewRegComponent } from '../../../../../shared/components/dialogs/update-application-form-dialog-new-reg/update-application-form-dialog-new-reg.component';
import { ApplicationFormListNewRegComponent } from '../../../../components/application-form-list-new-reg/application-form-list-new-reg.component';
import { catchError, forkJoin, of, switchMap, tap } from 'rxjs';
import { RPCError } from '@perun-web-apps/perun/models';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    AlertComponent,
    MatDivider,
    MatProgressSpinnerModule,
    TranslateModule,
    MatTooltip,
    LoaderDirective,
    LoadingTableComponent,
    ApplicationFormListNewRegComponent,
    MatSlideToggle,
    FormsModule,
  ],
  standalone: true,
  selector: 'app-vo-settings-application-form-new-reg',
  templateUrl: './vo-settings-application-form-new-reg.component.html',
  styleUrls: ['./vo-settings-application-form-new-reg.component.scss'],
})
export class VoSettingsApplicationFormNewRegComponent implements OnInit {
  static id = 'VoSettingsApplicationFormNewRegComponent';
  @HostBinding('class.router-component') true;
  loadingHeader = false;
  loadingTable = false;
  formSpecification: FormSpecificationDTO;
  selectedType: FormTypeConfig = { formType: 'INITIAL' };
  showExtension = false;
  formItems: ItemWithDefinitionDTO[] = [];
  newFormItemIds: string[] = [];
  toRemoveFormItemIds: string[] = [];
  itemsChanged = false;
  missingSubmitButton = false;
  editAuth: boolean;
  displayedColumns: string[] = [];
  refreshApplicationForm = false;
  inputItem: ItemDefinitionDTO.TypeEnum[] = [
    'DATE_PICKER',
    'VERIFIED_EMAIL',
    'CHECKBOX',
    'LOGIN',
    'PASSWORD',
    'SELECTION_CUSTOM',
    'SELECTIONBOX',
    'TEXTFIELD',
  ];
  private vo: Vo;

  constructor(
    private formsService: FormsService,
    private dialog: MatDialog,
    private notificator: NotificatorService,
    private translate: TranslateService,
    private router: Router,
    private authResolver: GuiAuthResolver,
    private entityStorageService: EntityStorageService,
  ) {}

  ngOnInit(): void {
    this.loadingHeader = true;
    this.loadingTable = true;
    this.vo = this.entityStorageService.getEntity();
    this.setAuthRights();

    this.formsService
      .getFormByObject('VO', this.vo.id.toString())
      .pipe(
        catchError((err: RPCError) => {
          if (err.status === 404) {
            return this.formsService.createForm('VO', this.vo.id.toString());
          }
          throw err;
        }),
        switchMap((formSpecification) => {
          this.formSpecification = formSpecification;
          return this.formsService.getEnrichedItems(
            formSpecification.id,
            this.selectedType.formType,
            this.selectedType.attributeName,
          );
        }),
      )
      .subscribe({
        next: (formItems) => {
          this.formItems = formItems;
          this.loadingHeader = false;
          this.loadingTable = false;
        },
        error: (err: RPCError) => {
          this.notificator.showRPCError(err);
          this.loadingHeader = false;
          this.loadingTable = false;
        },
      });
  }

  add(): void {
    let config = getDefaultDialogConfig();
    const fakeId = crypto.randomUUID();
    this.newFormItemIds.push(fakeId);
    config.width = '500px';
    config.data = {
      applicationFormItems: this.formItems,
      fakeId: fakeId,
      formSpecificationId: this.formSpecification.id,
    };

    const dialog = this.dialog.open(AddApplicationFormItemDialogNewRegComponent, config);
    dialog.afterClosed().subscribe((success: ItemWithDefinitionDTO[]) => {
      // success is field contains of two items: first is applicationFormItems with new item in it,
      // second item is new Application Form Item
      if (success) {
        this.formItems = Object.assign([], success[0]);

        config = getDefaultDialogConfig();
        config.width = '600px';
        config.height = '600px';
        config.data = {
          applicationFormItem: success[1],
          theme: 'vo-theme',
          allItems: this.formItems,
          formSpecificationId: this.formSpecification.id,
        };

        const editDialog = this.dialog.open(EditApplicationFormItemDialogNewRegComponent, config);
        editDialog.afterClosed().subscribe((updatedItem: ItemWithDefinitionDTO) => {
          if (updatedItem) {
            Object.assign(success[1], updatedItem);
            this.changeItems();
          }
        });
      }
    });
  }

  settings(): void {
    const config = getDefaultDialogConfig();
    config.width = '400px';
    config.data = {
      entity: 'vo',
      applicationForm: this.formSpecification,
      theme: 'vo-theme',
    };

    const dialog = this.dialog.open(UpdateApplicationFormDialogNewRegComponent, config);
    dialog.afterClosed().subscribe((newForm: FormSpecificationDTO) => {
      if (newForm) {
        this.translate
          .get('VO_DETAIL.SETTINGS.APPLICATION_FORM.CHANGE_SETTINGS_SUCCESS')
          .subscribe((successMessage: string) => {
            this.notificator.showSuccess(successMessage);
          });
        this.formSpecification = newForm;
      }
    });
  }

  preview(): void {
    void this.router.navigate(
      ['/organizations', this.vo.id, 'settings', 'applicationForm', 'preview'],
      {
        queryParams: { applicationFormItems: JSON.stringify(this.formItems) },
        queryParamsHandling: 'merge',
      },
    );
  }

  changeItems(): void {
    this.itemsChanged = true;

    const containsSubmit =
      this.formItems.filter(
        (item) =>
          !this.toRemoveFormItemIds.includes(item.formItemDTO.id) &&
          item.itemDefinition.type === 'SUBMIT_BUTTON',
      ).length > 0;
    const containsInput =
      this.formItems.filter(
        (item) =>
          !this.toRemoveFormItemIds.includes(item.formItemDTO.id) &&
          this.inputItem.includes(item.itemDefinition.type),
      ).length > 0;

    if (containsInput && !containsSubmit) {
      this.missingSubmitButton = true;
    } else {
      this.missingSubmitButton = false;
    }
  }

  removeChanged(removedIds: string[]): void {
    this.toRemoveFormItemIds = removedIds;
    this.changeItems();
  }

  save(): void {
    this.loadingTable = true;

    const itemsToDelete = this.formItems.filter((item) =>
      this.toRemoveFormItemIds.includes(item.formItemDTO.id),
    );

    const definitionDeletionCalls = itemsToDelete
      .filter((item) => !!item.itemDefinition?.id)
      .map((item) =>
        this.formsService.deleteItemDefinitionForForm(
          this.formSpecification.id,
          item.itemDefinition.id,
        ),
      );

    const otherDeletionCalls = [];
    itemsToDelete.forEach((item) => {
      if (item.destination?.id && item.destination.accessLevel === 'FORM_SPECIFIC') {
        otherDeletionCalls.push(
          this.formsService.deleteDestinationForForm(
            this.formSpecification.id,
            item.destination.id,
          ),
        );
      }
      if (item.prefillStrategyEntries) {
        item.prefillStrategyEntries.forEach((prefill) => {
          if (prefill?.id && prefill.accessLevel === 'FORM_SPECIFIC') {
            otherDeletionCalls.push(
              this.formsService.deletePrefillStrategyForForm(this.formSpecification.id, prefill.id),
            );
          }
        });
      }
    });

    const deletions$ =
      definitionDeletionCalls.length > 0 ? forkJoin(definitionDeletionCalls) : of(null);

    deletions$
      .pipe(
        switchMap(() => {
          // ONLY runs if item definition deletions succeeded
          return otherDeletionCalls.length > 0 ? forkJoin(otherDeletionCalls) : of(null);
        }),
      )
      .subscribe({
        next: () => {
          this.toRemoveFormItemIds = [];
          this.formItems = this.formItems.filter(
            (item) =>
              !itemsToDelete.some((deleted) => deleted.formItemDTO.id === item.formItemDTO.id),
          );

          const creationCalls = [];
          const itemDefCreationCalls = []; // execute these after prefills and dests created
          this.formItems.forEach((item) => {
            if (item.destination && item.destination.id === null) {
              creationCalls.push(
                this.formsService
                  .createOrGetDestinationForForm(this.formSpecification.id, item.destination)
                  .pipe(
                    catchError(() => of(null)),
                    tap((destination) => {
                      if (destination) {
                        item.destination = destination;
                        item.itemDefinition.destinationId = destination.id;
                      }
                    }),
                  ),
              );
            }
            if (item.prefillStrategyEntries) {
              item.prefillStrategyEntries.forEach((prefill) => {
                if (prefill && prefill.id === null) {
                  creationCalls.push(
                    this.formsService
                      .createOrGetPrefillStrategyForForm(this.formSpecification.id, prefill)
                      .pipe(
                        catchError(() => of(null)),
                        tap((prefillStrategy) => {
                          if (prefillStrategy) {
                            Object.assign(prefill, prefillStrategy);
                            if (!item.itemDefinition.prefillStrategyIds) {
                              item.itemDefinition.prefillStrategyIds = [];
                            }
                            if (
                              !item.itemDefinition.prefillStrategyIds.includes(prefillStrategy.id)
                            ) {
                              item.itemDefinition.prefillStrategyIds.push(prefillStrategy.id);
                            }
                          }
                        }),
                      ),
                  );
                }
              });
            }
            if (item.itemDefinition.id === null) {
              itemDefCreationCalls.push(
                this.formsService
                  .createItemDefinitionForForm(this.formSpecification.id, item.itemDefinition)
                  .pipe(
                    tap((itemDefinition) => {
                      if (itemDefinition) {
                        item.formItemDTO.itemDefinitionId = itemDefinition.id;
                        item.itemDefinition = itemDefinition;
                      }
                    }),
                  ),
              );
            }
          });

          const executeUpdates = (): void => {
            const definitionUpdates = this.formItems.map((item) => {
              if (item.itemDefinition.id === null) {
                return;
              }
              const patchObject = {} as ItemDefinitionPatchRequest;
              patchObject.displayName = item.itemDefinition.displayName;
              patchObject.updatable = item.itemDefinition.updatable;
              patchObject.required = item.itemDefinition.required;
              patchObject.prefillStrategyIds = item.itemDefinition.prefillStrategyIds;
              patchObject.texts = item.itemDefinition.texts;
              patchObject.hidden = item.itemDefinition.hidden;
              patchObject.disabled = item.itemDefinition.disabled;
              patchObject.validators = item.itemDefinition.validators;
              patchObject.formTypes = item.itemDefinition.formTypes;
              if (item.itemDefinition.defaultValue) {
                patchObject.defaultValue = item.itemDefinition.defaultValue;
              }
              if (item.itemDefinition.destinationId) {
                patchObject.destinationId = item.itemDefinition.destinationId;
              }
              const bulkUpdateRequest: BulkItemDefinitionUpdateRequest = {
                itemDefinitionId: item.itemDefinition.id,
                patchRequest: patchObject,
              };
              return bulkUpdateRequest;
            });

            // modify only the form type config which is selected

            const typeconfig = this.formSpecification.items.find(
              (prr) => prr.formTypeConfig.formType === this.selectedType.formType,
            );
            if (typeconfig) {
              typeconfig.formItems = this.formItems.map((enriched) => enriched.formItemDTO);
            } else {
              this.formSpecification.items.push({
                formTypeConfig: { formType: this.selectedType.formType },
                formItems: this.formItems.map((enriched) => enriched.formItemDTO),
              });
            }

            // Execute all definition updates in parallel, then update form items
            this.formsService.bulkUpdateItemDefinitions(definitionUpdates).subscribe({
              next: () => {
                this.formsService
                  .updateFormItems(this.formSpecification.id, this.formSpecification.items)
                  .subscribe({
                    next: () => {
                      this.translate
                        .get(
                          'VO_DETAIL.SETTINGS.APPLICATION_FORM.CHANGE_APPLICATION_FORM_ITEMS_SUCCESS',
                        )
                        .subscribe((successMessage: string) => {
                          this.notificator.showSuccess(successMessage);
                        });
                      this.refreshItems();
                    },
                    error: () => (this.loadingTable = false),
                  });
              },
              error: () => (this.loadingTable = false),
            });
          };

          const executeItemDefCreations = (): void => {
            if (itemDefCreationCalls.length > 0) {
              forkJoin(itemDefCreationCalls).subscribe({
                next: () => executeUpdates(),
                error: () => (this.loadingTable = false),
              });
            } else {
              executeUpdates();
            }
          };

          if (creationCalls.length > 0) {
            forkJoin(creationCalls).subscribe({
              next: () => executeItemDefCreations(),
              error: () => (this.loadingTable = false),
            });
          } else {
            executeItemDefCreations();
          }
        },
        error: () => (this.loadingTable = false),
      });
  }

  refreshItems(): void {
    this.loadingTable = true;
    this.refreshApplicationForm = true;
    this.newFormItemIds = [];
    this.formsService
      .getEnrichedItems(
        this.formSpecification.id,
        this.selectedType.formType,
        this.selectedType.attributeName,
      )
      .subscribe((formItems) => {
        this.formItems = formItems;
        this.itemsChanged = false;
        this.setAuthRights();
        this.refreshApplicationForm = false;
        this.loadingTable = false;
      });
  }

  changeFormType(): void {
    if (this.selectedType.formType === 'INITIAL') {
      this.toggleFormType('EXTENSION');
    } else {
      this.toggleFormType('INITIAL');
    }
  }

  toggleFormType(type: FormTypeConfig.FormTypeEnum): void {
    this.showExtension = type === 'EXTENSION';
    this.selectedType = { formType: type, attributeName: null };
    this.loadingTable = true;
    this.formsService
      .getEnrichedItems(this.formSpecification.id, this.selectedType.formType, null)
      .subscribe((formItems) => {
        this.formItems = formItems;
        this.loadingTable = false;
        this.itemsChanged = false;
      });
  }

  private setAuthRights(): void {
    this.editAuth = this.authResolver.isAuthorized(
      'vo-updateFormItems_ApplicationForm_List<ApplicationFormItem>_policy',
      [this.vo],
    );
    this.displayedColumns = this.editAuth
      ? ['drag', 'shortname', 'type', 'disabled', 'hidden', 'preview', 'edit', 'delete']
      : ['shortname', 'type', 'disabled', 'hidden', 'preview'];
  }
}
