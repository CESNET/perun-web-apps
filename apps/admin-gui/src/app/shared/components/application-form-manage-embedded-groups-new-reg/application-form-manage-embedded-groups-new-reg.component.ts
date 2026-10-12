import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { Group, GroupsManagerService } from '@perun-web-apps/perun/openapi';
import {
  EntityStorageService,
  GuiAuthResolver,
  SKIP_ERROR_NOTIFICATION,
  StoreService,
} from '@perun-web-apps/perun/services';
import { ApplicationFormManageGroupsComponent } from '../../../vos/components/application-form-manage-groups/application-form-manage-groups.component';
import { AddEmbeddedGroupsNewRegComponent } from '../dialogs/add-embedded-groups-new-reg/add-embedded-groups-new-reg.component';
import {
  EMBEDDED_FLOW_ID,
  EMBEDDED_OPTION_PLACEHOLDER_LABEL,
  EMBEDDED_OPTION_PLACEHOLDER_VALUE,
} from '../../embedded-groups';
import {
  FormSpecificationDTO,
  FormsService,
  ItemWithDefinitionDTO,
  Option,
} from '@perun-web-apps/perun/registrar-openapi';
import { catchError, forkJoin, map, Observable, of, switchMap, throwError } from 'rxjs';
import { HttpContext, HttpErrorResponse } from '@angular/common/http';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';

@Component({
  imports: [CommonModule, ApplicationFormManageGroupsComponent],
  standalone: true,
  selector: 'app-application-form-manage-embedded-groups-new-reg',
  templateUrl: './application-form-manage-embedded-groups-new-reg.component.html',
  styleUrls: ['./application-form-manage-embedded-groups-new-reg.component.scss'],
})
export class ApplicationFormManageEmbeddedGroupsNewRegComponent implements OnInit {
  loading = false;
  manageEmbeddedItemSaved = false;
  addAuth = false;
  removeAuth$ = of(false);
  groups: Group[] = [];
  selected = new SelectionModel<Group>(true, [], true, (a, b) => a.id === b.id);

  private entityId: number;
  private entityType: 'VO' | 'GROUP';
  private theme: string;
  private languages: string[];
  // the embedded groups item definitions (one per flow form carrying the EmbeddedGroups module)
  private definitions: { definitionId: string; targets: Option[] }[] = [];
  // existing embedded flow forms of this object (option value = form id)
  private targetForms: FormSpecificationDTO[] = [];

  constructor(
    private formsService: FormsService,
    private groupsService: GroupsManagerService,
    private entityStorageService: EntityStorageService,
    private authResolver: GuiAuthResolver,
    private dialog: MatDialog,
    private store: StoreService,
  ) {}

  ngOnInit(): void {
    const entity = this.entityStorageService.getEntity();
    this.languages = this.store.getProperty('supported_languages');
    if (entity.beanName === 'Vo') {
      this.entityType = 'VO';
      this.entityId = entity.id;
      this.theme = 'vo-theme';
      this.addAuth = this.authResolver.isAuthorized(
        'vo-updateFormItems_ApplicationForm_List<ApplicationFormItem>_policy',
        [entity],
      );
    } else {
      this.entityType = 'GROUP';
      this.entityId = entity.id;
      this.theme = 'group-theme';
      this.addAuth = this.authResolver.isAuthorized(
        'group-updateFormItems_ApplicationForm_List<ApplicationFormItem>_policy',
        [entity],
      );
    }
    this.removeAuth$ = of(this.addAuth);
    this.load();
  }

  load(): void {
    this.loading = true;
    const context = new HttpContext().set(SKIP_ERROR_NOTIFICATION, true);
    forkJoin({
      initForm: this.getFormTolerant('INITIAL', context),
      extForm: this.getFormTolerant('EXTENSION', context),
    })
      .pipe(
        map(({ initForm, extForm }) =>
          [initForm, extForm].filter((form): form is FormSpecificationDTO => !!form),
        ),
        switchMap((presentForms) => {
          if (presentForms.length === 0) {
            return of({
              withModule: presentForms,
              items: [] as ItemWithDefinitionDTO[][],
              targets: [] as FormSpecificationDTO[],
            });
          }
          return forkJoin({
            items: forkJoin(
              presentForms.map((form) => this.formsService.getEnrichedItems(form.id)),
            ),
            targets: this.formsService.getEmbeddedTargetForms(presentForms[0].id).pipe(
              catchError((error) => {
                console.error('Failed to load embedded target forms', error);
                return of([] as FormSpecificationDTO[]);
              }),
            ),
          }).pipe(map((result) => ({ withModule: presentForms, ...result })));
        }),
      )
      .subscribe({
        next: ({ withModule, items, targets }) => {
          this.targetForms = targets;
          this.definitions = [];
          withModule.forEach((form, index) => {
            items[index]
              .filter((item) => item.itemDefinition.type === 'EMBEDDED_GROUPS')
              .forEach((item) => {
                this.definitions.push({
                  definitionId: item.itemDefinition.id,
                  targets: this.targetsOf(item),
                });
              });
          });
          this.manageEmbeddedItemSaved = this.definitions.length > 0;
          this.loadGroups();
        },
        error: () => (this.loading = false),
      });
  }

  openAddDialog(): void {
    const config = getDefaultDialogConfig();
    config.width = '900px';
    config.data = {
      theme: this.theme,
      entityType: this.entityType,
      entityId: this.entityId,
      assignedGroupIds: this.groups.map((group) => group.id),
    };
    const dialogRef = this.dialog.open(AddEmbeddedGroupsNewRegComponent, config);
    dialogRef.afterClosed().subscribe((groups: Group[] | undefined) => {
      if (groups && groups.length > 0) {
        this.addGroups(groups);
      }
    });
  }

  removeSelected(): void {
    const removedIds = new Set(this.selected.selected.map((group) => group.id));
    const removedFormIds = new Set(
      this.targetForms
        .filter((form) => removedIds.has(Number(form.idmObject?.objectId)))
        .map((form) => form.id),
    );
    if (removedFormIds.size === 0) {
      return;
    }
    const entries = this.currentOptionEntries().filter(([formId]) => !removedFormIds.has(formId));
    this.patchOptions(entries);
  }

  /**
   * Group names and descriptions are fetched live from Perun (groups-getGroupsByIds):
   * the labels stored in the registrar item definition are only a snapshot taken
   * when the target was added and can be outdated.
   */
  private loadGroups(): void {
    const preliminary = this.currentOptionEntries().map(([formId, name]) => {
      const target = this.targetForms.find((f) => f.id === formId);
      return { id: target ? Number(target.idmObject.objectId) : 0, name };
    });
    const fallback = (): void => {
      this.groups = preliminary.map(({ id, name }) => ({ id, name }) as Group);
    };
    const ids = [...new Set(preliminary.map((p) => p.id).filter((id) => id !== 0))];
    if (ids.length === 0) {
      fallback();
      this.loading = false;
      return;
    }
    this.groupsService
      .getGroupsByIds(ids, false, 'body', false, {
        context: new HttpContext().set(SKIP_ERROR_NOTIFICATION, true),
      })
      .subscribe({
        next: (perunGroups) => {
          const byId = new Map(perunGroups.map((group) => [group.id, group]));
          this.groups = preliminary.map(({ id, name }) => byId.get(id) ?? ({ id, name } as Group));
          this.loading = false;
        },
        error: (error) => {
          console.error('Failed to load embedded groups from Perun', error);
          fallback();
          this.loading = false;
        },
      });
  }

  /**
   * For each selected group ensure the group's embedded flow form exists in the new
   * registrar (creating it when missing) and add it as an embedded target
   * (target value = embedded form id, label = group name).
   */
  private addGroups(groups: Group[]): void {
    this.loading = true;
    const context = new HttpContext().set(SKIP_ERROR_NOTIFICATION, true);
    forkJoin(
      groups.map((group) =>
        this.formsService
          .getFormByObjectAndFlow(
            'GROUP',
            group.id.toString(),
            EMBEDDED_FLOW_ID,
            false,
            'body',
            false,
            { context },
          )
          .pipe(
            catchError((error: HttpErrorResponse) => {
              if (error.status === 404) {
                return this.formsService.createForm({
                  flowId: EMBEDDED_FLOW_ID,
                  idmObjectType: 'GROUP',
                  objectId: group.id.toString(),
                });
              }
              return throwError(() => error);
            }),
          ),
      ),
    ).subscribe({
      next: (forms) => {
        const entries = this.currentOptionEntries();
        groups.forEach((group, index) => {
          entries.push([forms[index].id, group.name]);
        });
        this.patchOptions(entries);
      },
      error: () => (this.loading = false),
    });
  }

  /** Current targets (value=embedded form id, label=group name) of the first embedded definition. */
  private currentOptionEntries(): [string, string][] {
    if (this.definitions.length === 0) {
      return [];
    }
    return this.definitions[0].targets
      .filter((target) => target.value !== EMBEDDED_OPTION_PLACEHOLDER_VALUE)
      .map((target) => [target.value ?? '', this.localizedTargetLabel(target) ?? '']);
  }

  /** Write the target set into every embedded definition, then refresh. */
  private patchOptions(entries: [string, string][]): void {
    let targets: Option[];
    if (entries.length > 0) {
      targets = entries.map(([value, name]) => {
        const labels: Record<string, string> = {};
        for (const lang of this.languages) {
          labels[lang] = name;
        }
        return { value, labels } as Option;
      });
    } else {
      // EMBEDDED_GROUPS definitions require at least one target; keep the placeholder
      targets = [
        {
          value: EMBEDDED_OPTION_PLACEHOLDER_VALUE,
          labels: { en: EMBEDDED_OPTION_PLACEHOLDER_LABEL },
        },
      ];
    }
    this.loading = true;
    forkJoin(
      this.definitions.map((definition) =>
        this.formsService.updateItemDefinition(definition.definitionId, {
          configuration: { targets },
        }),
      ),
    ).subscribe({
      next: () => this.load(),
      error: () => (this.loading = false),
    });
  }

  /** The targets of an EMBEDDED_GROUPS item definition. */
  private targetsOf(item: ItemWithDefinitionDTO): Option[] {
    const configuration = (
      item.itemDefinition as unknown as { configuration?: { targets?: Option[] } }
    ).configuration;
    return configuration?.targets ?? [];
  }

  /** Best-effort label of a target in the default language, falling back to any language. */
  private localizedTargetLabel(target: Option): string | undefined {
    const lang = this.languages[0];
    return target.labels?.[lang] ?? Object.values(target.labels ?? {})[0];
  }

  private getFormTolerant(
    flowId: string,
    context: HttpContext,
  ): Observable<FormSpecificationDTO | null> {
    return this.formsService
      .getFormByObjectAndFlow(
        this.entityType,
        this.entityId.toString(),
        flowId,
        false,
        'body',
        false,
        { context },
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            return of(null);
          }
          return throwError(() => error);
        }),
      );
  }
}
