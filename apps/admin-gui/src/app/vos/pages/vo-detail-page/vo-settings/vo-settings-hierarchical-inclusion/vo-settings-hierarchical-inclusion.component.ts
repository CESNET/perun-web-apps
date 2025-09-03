import { TranslateModule } from '@ngx-translate/core';
import {
  GroupsListComponent,
  RefreshButtonComponent,
  VoSearchSelectComponent,
} from '@perun-web-apps/perun/components';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Group, GroupsManagerService, Vo, VosManagerService } from '@perun-web-apps/perun/openapi';
import {
  EntityStorageService,
  GuiAuthResolver,
  NotificatorService,
  PerunTranslateService,
} from '@perun-web-apps/perun/services';
import { SelectionModel } from '@angular/cdk/collections';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { MatDialog } from '@angular/material/dialog';
import { AddGroupHierarchicalIncludeDialogComponent } from '../../../../../shared/components/dialogs/add-group-hierarchical-include-dialog/add-group-hierarchical-include-dialog.component';
import { UniversalConfirmationItemsDialogComponent } from '@perun-web-apps/perun/dialogs';
import { TABLE_HIERARCHICAL_INCLUSION } from '@perun-web-apps/config/table-config';
import { BehaviorSubject } from 'rxjs';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    RefreshButtonComponent,
    TranslateModule,
    GroupsListComponent,
    VoSearchSelectComponent,
    LoaderDirective,
    LoadingTableComponent,
  ],
  standalone: true,
  selector: 'app-vo-settings-hierarchical-inclusion',
  templateUrl: './vo-settings-hierarchical-inclusion.component.html',
  styleUrls: ['./vo-settings-hierarchical-inclusion.component.scss'],
})
export class VoSettingsHierarchicalInclusionComponent implements OnInit {
  loading = false;
  vo: Vo;
  parentVos: Vo[] = [];
  selectedParentVo: Vo;
  addAuth = false;
  deleteAuth = false;
  allowedGroups: Group[] = [];
  selected: SelectionModel<Group> = new SelectionModel<Group>(
    true,
    [],
    true,
    (group1, group2) => group1.id === group2.id,
  );
  tableId = TABLE_HIERARCHICAL_INCLUSION;
  cacheSubject = new BehaviorSubject(true);

  constructor(
    private dialog: MatDialog,
    private entityStorage: EntityStorageService,
    private voService: VosManagerService,
    private groupService: GroupsManagerService,
    private notificator: NotificatorService,
    private translate: PerunTranslateService,
    private authResolver: GuiAuthResolver,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.vo = this.entityStorage.getEntity();
    this.voService.getEnrichedVoById(this.vo.id).subscribe(
      (enrichedVo) => {
        this.parentVos = enrichedVo.parentVos;
        this.loading = false;
      },
      () => (this.loading = false),
    );
    this.selected.changed.subscribe(() => {
      this.deleteAuth =
        this.deleteAuth &&
        this.selected.selected.filter((group) =>
          this.authResolver.isAuthorized('group-disallowGroupToHierarchicalVo_Group_Vo_policy', [
            group,
          ]),
        ).length === this.selected.selected.length;
    });
  }

  voSelected(vo: Vo): void {
    this.selectedParentVo = vo;
    this.addAuth = this.authResolver.isAuthorized('vo-allowGroupToHierarchicalVo_Group_Vo_policy', [
      vo,
    ]);
    this.deleteAuth = this.authResolver.isAuthorized(
      'vo-disallowGroupToHierarchicalVo_Group_Vo_policy',
      [vo],
    );
    this.loadAllowedGroups();
  }

  loadAllowedGroups(): void {
    this.loading = true;
    this.cacheSubject.next(true);
    this.selected.clear();
    this.groupService
      .getVoAllAllowedGroupsToHierarchicalVo(this.selectedParentVo.id, this.vo.id)
      .subscribe((groups) => {
        this.allowedGroups = groups;
        this.loading = false;
      });
  }

  addGroupsInclusion(): void {
    const config = getDefaultDialogConfig();
    config.width = '750px';
    config.data = {
      theme: 'vo-theme',
      voId: this.vo.id,
      parentVo: this.selectedParentVo,
      allowedGroupsIds: this.allowedGroups.map((group) => group.id),
    };

    this.dialog
      .open(AddGroupHierarchicalIncludeDialogComponent, config)
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.loadAllowedGroups();
        }
      });
  }

  removeGroupsInclusion(): void {
    const config = getDefaultDialogConfig();
    config.width = '750px';
    config.data = {
      theme: 'vo-theme',
      title: 'DIALOGS.REMOVE_GROUPS_HIERARCHICAL_INCLUSION.TITLE',
      description: 'DIALOGS.REMOVE_GROUPS_HIERARCHICAL_INCLUSION.DESCRIPTION',
      items: this.selected.selected.map((group) => group.name),
      alert: this.translate.instant('DIALOGS.REMOVE_GROUPS_HIERARCHICAL_INCLUSION.ALERT', {
        parentVo: this.selectedParentVo.name,
      }),
      type: 'remove',
      showAsk: true,
    };

    this.dialog
      .open(UniversalConfirmationItemsDialogComponent, config)
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.disallowGroups();
        }
      });
  }

  disallowGroups(): void {
    this.loading = true;
    const groupIds = this.selected.selected.map((group) => group.id);
    this.groupService.disallowGroupsToHierarchicalVo(groupIds, this.selectedParentVo.id).subscribe({
      next: () => {
        this.notificator.showSuccess(
          this.translate.instant('DIALOGS.REMOVE_GROUPS_HIERARCHICAL_INCLUSION.SUCCESS'),
        );
        this.loadAllowedGroups();
      },
      error: () => (this.loading = false),
    });
  }
}
