import { Directive, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  ApiRequestConfigurationService,
  NotificatorService,
  SKIP_ERROR_NOTIFICATION,
} from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { RPCError } from '@perun-web-apps/perun/models';
import { ApplicationFormItem } from '@perun-web-apps/perun/openapi';
import {
  BulkItemDefinitionUpdateRequest,
  FormSpecificationDTO,
  FormsService,
  ItemDefinitionDTO,
  ItemDefinitionPatchRequest,
  ItemWithDefinitionDTO,
  Option,
} from '@perun-web-apps/perun/registrar-openapi';
import { catchError, forkJoin, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { AddApplicationFormItemDialogNewRegComponent } from '../dialogs/add-application-form-item-dialog-new-reg/add-application-form-item-dialog-new-reg.component';
import { EditApplicationFormItemDialogNewRegComponent } from '../dialogs/edit-application-form-item-dialog-new-reg/edit-application-form-item-dialog-new-reg.component';
import {
  UpdateApplicationFormDialogNewRegComponent,
  UpdateApplicationFormsResult,
} from '../dialogs/update-application-form-dialog-new-reg/update-application-form-dialog-new-reg.component';
import { ApplicationFormCopyItemsDialogNewRegComponent } from '../dialogs/application-form-copy-items-dialog-new-reg/application-form-copy-items-dialog-new-reg.component';
import { HttpContext } from '@angular/common/http';

@Directive()
export abstract class ApplicationFormBaseNewRegComponent implements OnInit {
  loadingHeader = false;
  loadingTable = false;
  selectedForm: FormSpecificationDTO;
  initForm: FormSpecificationDTO;
  extForm: FormSpecificationDTO;
  // the object's own EMBEDDED_INITIAL flow form (GROUP only); its autoApprove is the embedded auto-approval
  embeddedForm: FormSpecificationDTO | null = null;
  selectedType = 'INITIAL';
  showExtension = false;
  formItems: ItemWithDefinitionDTO[] = [];
  toRemoveFormItemIds: string[] = [];
  newFormItemIds: string[] = [];
  itemsChanged = false;
  missingSubmitButton = false;
  editAuth = false;
  refreshApplicationForm = false;
  embeddedGroupsItemSaved = false;

  flowModuleNames = [
    'InitialMembership',
    'UpdateAttribute',
    'CancellationMembership',
    'ExtensionMembership',
  ];

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
    protected apiRequest: ApiRequestConfigurationService,
    protected translate: TranslateService,
    protected router: Router,
  ) {}

  get moduleNames(): string[] {
    return this.initForm.modules
      .filter((module) => !this.flowModuleNames.includes(module.moduleName))
      .map((module) => module.moduleName);
  }
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
      formSpecificationId: this.selectedForm.id,
      embeddedItemExists: this.hasEmbeddedItem(),
    };

    const dialog = this.dialog.open(AddApplicationFormItemDialogNewRegComponent, config);
    dialog
      .afterClosed()
      .subscribe((success: [ItemWithDefinitionDTO[], ItemWithDefinitionDTO, boolean]) => {
        if (success) {
          const isEmbedded = !!success[2];
          this.formItems = Object.assign([], success[0]);

          config = getDefaultDialogConfig();
          config.width = '600px';
          config.height = '600px';
          config.data = {
            applicationFormItem: success[1],
            theme: this.theme,
            allItems: this.formItems,
            formSpecificationId: this.selectedForm.id,
            isEmbedded,
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

  copy(): void {
    const config = getDefaultDialogConfig();
    config.width = '500px';
    config.data = { idmObject: this.initForm.idmObject, theme: 'vo-theme' };

    const dialog = this.dialog.open(ApplicationFormCopyItemsDialogNewRegComponent, config);
    dialog.afterClosed().subscribe((copyFrom) => {
      if (copyFrom) {
        this.loadingHeader = true;
        this.loadingTable = true;
        this.loadForm();
      }
    });
  }

  settings(): void {
    const config = getDefaultDialogConfig();

    config.width = '400px';
    config.data = {
      entity: this.entityType.toLowerCase(),
      initForm: this.initForm,
      extForm: this.extForm,
      embeddedForm: this.embeddedForm,
      theme: this.theme,
    };

    const dialog = this.dialog.open(UpdateApplicationFormDialogNewRegComponent, config);

    dialog.afterClosed().subscribe((result: UpdateApplicationFormsResult | undefined) => {
      if (result) {
        this.translate
          .get('VO_DETAIL.SETTINGS.APPLICATION_FORM.CHANGE_SETTINGS_SUCCESS')
          .subscribe((successMessage: string) => {
            this.notificator.showSuccess(successMessage);
          });

        this.initForm = result.initForm;
        this.extForm = result.extForm;
        this.embeddedForm = result.embeddedForm;
      }
    });
  }

  preview(): void {
    void this.router.navigate(this.getPreviewRoute(), {
      queryParams: { applicationFormItems: JSON.stringify(this.toLegacyPreviewItems()) },
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
        this.formsService.deleteItemDefinitionForForm(this.selectedForm.id, item.itemDefinition.id),
      );

    const otherDeletionCalls: Observable<unknown>[] = [];
    itemsToDelete.forEach((item) => {
      if (item.destination?.id && item.destination.accessLevel === 'FORM_SPECIFIC') {
        otherDeletionCalls.push(
          this.formsService.deleteDestinationForForm(this.selectedForm.id, item.destination.id),
        );
      }
      if (item.prefillStrategyEntries) {
        item.prefillStrategyEntries.forEach((prefill) => {
          if (prefill?.id && prefill.accessLevel === 'FORM_SPECIFIC') {
            otherDeletionCalls.push(
              this.formsService.deletePrefillStrategyForForm(this.selectedForm.id, prefill.id),
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
    this.formsService.getEnrichedItems(this.selectedForm.id).subscribe((formItems) => {
      this.formItems = formItems;
      this.embeddedGroupsItemSaved = formItems.some(
        (item) => item.itemDefinition.type === 'EMBEDDED_GROUPS',
      );
      this.itemsChanged = false;
      this.checkAuth(); // Call the specific implementation
      this.refreshApplicationForm = false;
      this.loadingTable = false;
    });
  }

  changeFormType(): void {
    if (this.selectedType === 'INITIAL') {
      this.toggleFormType('EXTENSION');
    } else {
      this.toggleFormType('INITIAL');
    }
  }

  toggleFormType(type: string): void {
    this.showExtension = type === 'EXTENSION';
    this.selectedType = type;
    this.loadingTable = true;
    this.loadForm();
  }

  /** True when this form has an embedded groups (EMBEDDED_GROUPS) item. */
  hasEmbeddedItem(): boolean {
    return this.formItems.some((item) => item.itemDefinition.type === 'EMBEDDED_GROUPS');
  }

  /**
   * The preview page renders the legacy ApplicationFormItem shape (with legacy item type names),
   * so new Registrar items are mapped onto it; the preview stays identical to the old one.
   */
  private toLegacyPreviewItems(): ApplicationFormItem[] {
    const legacyTypes: Record<string, string> = {
      EMBEDDED_GROUPS: 'EMBEDDED_GROUP_APPLICATION',
      SELECTION_CUSTOM: 'COMBOBOX',
      LOGIN: 'USERNAME',
      VERIFIED_EMAIL: 'VALIDATED_EMAIL',
    };
    return this.formItems.map((item) => {
      const definition = item.itemDefinition;
      const options =
        (definition as unknown as { configuration?: { options?: Option[] } }).configuration
          ?.options ?? [];
      const i18n: { [key: string]: { label?: string; help?: string; options?: string } } = {};
      for (const lang of Object.keys(definition.texts ?? {})) {
        i18n[lang] = {
          label: definition.texts[lang]?.label,
          help: definition.texts[lang]?.help,
          options: options
            .map((option) => `${option.value}#${option.labels?.[lang] ?? ''}`)
            .join('|'),
        };
      }
      return {
        id: item.formItemDTO.id as unknown as number,
        shortname: item.formItemDTO.name,
        type: (legacyTypes[definition.type] ?? definition.type) as ApplicationFormItem['type'],
        required: definition.required,
        applicationTypes: definition.flowIds as ApplicationFormItem['applicationTypes'],
        hidden: definition.hidden as ApplicationFormItem['hidden'],
        disabled: definition.disabled as ApplicationFormItem['disabled'],
        hiddenDependencyItemId: null,
        disabledDependencyItemId: null,
        forDelete: this.toRemoveFormItemIds.includes(item.formItemDTO.id),
        i18n,
      } as ApplicationFormItem;
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
              .createOrGetDestinationForForm(this.selectedForm.id, item.destination)
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
                  .createOrGetPrefillStrategyForForm(this.selectedForm.id, prefill)
                  .pipe(
                    catchError(() => of(null)),
                    tap((prefillStrategy) => {
                      if (prefillStrategy) {
                        Object.assign(prefill, prefillStrategy);
                        // rebuild the id list from the entries (in entry order: IDM first,
                        // then identity) so the canonical order never drifts, whichever
                        // entry was just created
                        item.itemDefinition.prefillStrategyIds = item.prefillStrategyEntries
                          .map((entry) => entry.id)
                          .filter((id): id is string => id != null);
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
                      // rebuild the id list from the entries (in entry order: IDM first,
                      // then identity) so the canonical order never drifts, whichever
                      // entry was just created
                      item.itemDefinition.prefillStrategyIds = item.prefillStrategyEntries
                        .map((entry) => entry.id)
                        .filter((id): id is string => id != null);
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
            .createItemDefinitionForForm(this.selectedForm.id, item.itemDefinition)
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
    forkJoin({
      initForm: this.getOrCreateForm('INITIAL'),
      extForm: this.getOrCreateForm('EXTENSION'),
    })
      .pipe(
        tap(({ initForm, extForm }) => {
          this.initForm = initForm;
          this.extForm = extForm;
          this.selectedForm = this.selectedType === 'INITIAL' ? initForm : extForm;
        }),
        switchMap(() =>
          forkJoin({
            items: this.formsService.getEnrichedItems(this.selectedForm.id),
            // groups also own an EMBEDDED_INITIAL flow form (fetched like the other flows); VOs do not
            embeddedForm:
              this.entityType === 'GROUP'
                ? this.getOrCreateForm('EMBEDDED_INITIAL')
                : of(null as FormSpecificationDTO | null),
          }),
        ),
      )
      .subscribe({
        next: ({ items, embeddedForm }) => {
          this.formItems = items;
          this.embeddedGroupsItemSaved = items.some(
            (item) => item.itemDefinition.type === 'EMBEDDED_GROUPS',
          );
          this.embeddedForm = embeddedForm;
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

  private getOrCreateForm(
    type: 'INITIAL' | 'EXTENSION' | 'EMBEDDED_INITIAL',
  ): Observable<FormSpecificationDTO> {
    const context = new HttpContext().set(SKIP_ERROR_NOTIFICATION, true);
    return this.formsService
      .getFormByObjectAndFlow(this.entityType, this.entityId, type, false, 'body', false, {
        context,
      })
      .pipe(
        catchError((err: RPCError) => {
          if (err.status === 404) {
            return this.formsService.createForm({
              flowId: type,
              idmObjectType: this.entityType,
              objectId: this.entityId,
            });
          }

          return throwError(() => err);
        }),
      );
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
        patchObject.flowIds = item.itemDefinition.flowIds;
        if ('configuration' in item.itemDefinition) {
          patchObject.configuration = item.itemDefinition.configuration;
        }
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

    this.formsService.bulkUpdateItemDefinitions(definitionUpdates).subscribe({
      next: () => {
        this.formsService
          .updateFormItems(this.selectedForm.id, {
            formItems: this.formItems.map((item) => item.formItemDTO),
          })
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
