import { Directive, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { RPCError } from '@perun-web-apps/perun/models';
import {
  BulkItemDefinitionUpdateRequest,
  FormSpecificationDTO,
  FormsService,
  FormTypeConfig,
  ItemDefinitionDTO,
  ItemDefinitionPatchRequest,
  ItemWithDefinitionDTO,
} from '@perun-web-apps/perun/registrar-openapi';
import { catchError, forkJoin, Observable, of, switchMap, tap } from 'rxjs';
import { AddApplicationFormItemDialogNewRegComponent } from '../dialogs/add-application-form-item-dialog-new-reg/add-application-form-item-dialog-new-reg.component';
import { EditApplicationFormItemDialogNewRegComponent } from '../dialogs/edit-application-form-item-dialog-new-reg/edit-application-form-item-dialog-new-reg.component';
import { UpdateApplicationFormDialogNewRegComponent } from '../dialogs/update-application-form-dialog-new-reg/update-application-form-dialog-new-reg.component';

@Directive()
export abstract class ApplicationFormBaseNewRegComponent implements OnInit {
  loadingHeader = false;
  loadingTable = false;
  formSpecification: FormSpecificationDTO;
  selectedType: FormTypeConfig = { formType: 'INITIAL' };
  showExtension = false;
  formItems: ItemWithDefinitionDTO[] = [];
  toRemoveFormItemIds: string[] = [];
  newFormItemIds: string[] = [];
  itemsChanged = false;
  missingSubmitButton = false;
  editAuth = false;
  refreshApplicationForm = false;

  // Preserved as protected public API for templates
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

  protected constructor(
    protected formsService: FormsService,
    protected dialog: MatDialog,
    protected notificator: NotificatorService,
    protected translate: TranslateService,
    protected router: Router,
  ) {}

  // Abstract getters for entity-specific values
  protected abstract get entityId(): string;
  protected abstract get entityType(): 'VO' | 'GROUP';
  protected abstract get updatePolicy(): string;
  protected abstract get theme(): string;
  ngOnInit(): void {
    this.loadingHeader = true;
    this.loadingTable = true;
    this.checkAuth(); // Call the specific implementation first
    this.loadForm();
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
      if (success) {
        this.formItems = Object.assign([], success[0]);

        config = getDefaultDialogConfig();
        config.width = '600px';
        config.height = '600px';
        config.data = {
          applicationFormItem: success[1],
          theme: this.theme,
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
      entity: this.entityType.toLowerCase(),
      applicationForm: this.formSpecification,
      theme: this.theme,
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
    void this.router.navigate(this.getPreviewRoute(), {
      queryParams: { applicationFormItems: JSON.stringify(this.formItems) },
      queryParamsHandling: 'merge',
    });
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

    this.missingSubmitButton = containsInput && !containsSubmit;
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

    const otherDeletionCalls: Observable<unknown>[] = [];
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
        switchMap(() => (otherDeletionCalls.length > 0 ? forkJoin(otherDeletionCalls) : of(null))),
      )
      .subscribe({
        next: () => {
          this.toRemoveFormItemIds = [];
          this.formItems = this.formItems.filter(
            (item) =>
              !itemsToDelete.some((deleted) => deleted.formItemDTO.id === item.formItemDTO.id),
          );

          this.processCreationsAndUpdates();
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
        this.checkAuth(); // Call the specific implementation
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

  private processCreationsAndUpdates(): void {
    const creationCalls = [];
    const itemDefCreationCalls = [];

    this.formItems.forEach((item) => {
      // Destination creation logic (identical to original)
      if (item.destination && item.destination.id === null) {
        if (item.destination.accessLevel === 'FORM_SPECIFIC') {
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
        } else {
          creationCalls.push(
            this.formsService.createOrGetDestination(item.destination).pipe(
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
      }

      // Prefill strategy creation logic (identical to original)
      if (item.prefillStrategyEntries) {
        item.prefillStrategyEntries.forEach((prefill) => {
          if (prefill && prefill.id === null) {
            if (prefill.accessLevel === 'FORM_SPECIFIC') {
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
                        if (!item.itemDefinition.prefillStrategyIds.includes(prefillStrategy.id)) {
                          item.itemDefinition.prefillStrategyIds.push(prefillStrategy.id);
                        }
                      }
                    }),
                  ),
              );
            } else {
              creationCalls.push(
                this.formsService.createOrGetPrefillStrategy(prefill).pipe(
                  catchError(() => of(null)),
                  tap((prefillStrategy) => {
                    if (prefillStrategy) {
                      Object.assign(prefill, prefillStrategy);
                      if (!item.itemDefinition.prefillStrategyIds) {
                        item.itemDefinition.prefillStrategyIds = [];
                      }
                      if (!item.itemDefinition.prefillStrategyIds.includes(prefillStrategy.id)) {
                        item.itemDefinition.prefillStrategyIds.push(prefillStrategy.id);
                      }
                    }
                  }),
                ),
              );
            }
          }
        });
      }

      // Item definition creation (identical to original)
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

    const executeItemDefCreations = (): void => {
      if (itemDefCreationCalls.length > 0) {
        forkJoin(itemDefCreationCalls).subscribe({
          next: () => this.executeUpdates(),
          error: () => (this.loadingTable = false),
        });
      } else {
        this.executeUpdates();
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
  }

  private loadForm(): void {
    this.formsService
      .getFormByObject(this.entityType, this.entityId)
      .pipe(
        catchError((err: RPCError) => {
          if (err.status === 404) {
            return this.formsService.createForm(this.entityType, this.entityId);
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
  private executeUpdates(): void {
    const definitionUpdates = this.formItems
      .map((item) => {
        if (item.itemDefinition.id === null) {
          return null;
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
        return {
          itemDefinitionId: item.itemDefinition.id,
          patchRequest: patchObject,
        } as BulkItemDefinitionUpdateRequest;
      })
      .filter((update): update is BulkItemDefinitionUpdateRequest => update !== null);

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

    this.formsService.bulkUpdateItemDefinitions(definitionUpdates).subscribe({
      next: () => {
        this.formsService
          .updateFormItems(this.formSpecification.id, this.formSpecification.items)
          .subscribe({
            next: () => {
              this.translate
                .get('VO_DETAIL.SETTINGS.APPLICATION_FORM.CHANGE_APPLICATION_FORM_ITEMS_SUCCESS')
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
  }

  protected abstract getPreviewRoute(): unknown[];
  protected abstract checkAuth(): void; // Each component implements its own auth check
}
