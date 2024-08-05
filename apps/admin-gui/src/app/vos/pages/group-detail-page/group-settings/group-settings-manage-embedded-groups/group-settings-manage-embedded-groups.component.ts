import { Component, OnInit } from '@angular/core';
import { Group, RegistrarManagerService, Type } from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EntityStorageService, GuiAuthResolver } from '@perun-web-apps/perun/services';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { AddGroupToGroupRegistrationComponent } from '../../../../../shared/components/dialogs/add-group-to-group-registration/add-group-to-group-registration.component';

@Component({
  selector: 'app-group-settings-manage-embedded-groups',
  templateUrl: './group-settings-manage-embedded-groups.component.html',
  styleUrls: ['./group-settings-manage-embedded-groups.component.scss'],
})
export class GroupSettingsManageEmbeddedGroupsComponent implements OnInit {
  loading: boolean;
  registrationGroup: Group;
  groups: Group[] = [];
  selected: SelectionModel<Group> = new SelectionModel<Group>(
    true,
    [],
    true,
    (group1, group2) => group1.id === group2.id,
  );
  embeddedFormItemId: number;
  addAuth: boolean;
  manageEmbeddedGroupsItemSaved = false;
  removeAuth$: Observable<boolean> = this.selected.changed.pipe(
    map((change) => {
      return change.source.selected.reduce(
        (acc, grp) =>
          acc &&
          this.authResolver.isAuthorized(
            'deleteGroupsFromAutoRegistration_List<Group>_Group_ApplicationFormItem_policy',
            [this.registrationGroup, grp],
          ),
        true,
      );
    }),
    startWith(true),
  );

  constructor(
    private registrarService: RegistrarManagerService,
    public authResolver: GuiAuthResolver,
    private dialog: MatDialog,
    protected route: ActivatedRoute,
    private entityStorageService: EntityStorageService,
    private registrarManager: RegistrarManagerService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.registrationGroup = this.entityStorageService.getEntity();
    this.registrarManager.getFormItemsForGroup(this.registrationGroup.id).subscribe({
      next: (formItems) => {
        const embeddedFormItems = formItems.filter(
          (item) => item.type === Type.EMBEDDED_GROUP_APPLICATION,
        );
        if (embeddedFormItems.length > 0) {
          this.embeddedFormItemId = embeddedFormItems[0].id;
          this.manageEmbeddedGroupsItemSaved = true;
          this.loadGroups();
        }
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  loadGroups(): void {
    this.loading = true;
    this.registrarService
      .getSubgroupsToAutoRegistration(this.registrationGroup.id, this.embeddedFormItemId)
      .subscribe({
        next: (groups) => {
          this.groups = groups;
          // FIXME: is it ok to add just registrationGroup or also some potentially added group?
          this.addAuth = this.authResolver.isAuthorized(
            'addGroupsToAutoRegistration_List<Group>_Group_ApplicationFormItem_policy',
            [this.registrationGroup],
          );
          this.selected.clear();
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
  }

  onAddGroup(): void {
    const config = getDefaultDialogConfig();
    config.width = '900px';
    config.data = {
      groupId: this.registrationGroup.id,
      assignedGroups: this.groups.map((group) => group.id),
      embeddedFormItemId: this.embeddedFormItemId,
      theme: 'group-theme',
    };

    const dialogRef = this.dialog.open(AddGroupToGroupRegistrationComponent, config);

    dialogRef.afterClosed().subscribe((groupAssigned) => {
      if (groupAssigned) {
        this.loadGroups();
      }
    });
  }

  removeGroup(): void {
    this.loading = true;
    this.registrarService
      .deleteSubgroupsFromAutoRegistration(
        this.selected.selected.map((group) => group.id),
        this.registrationGroup.id,
        this.embeddedFormItemId,
      )
      .subscribe({
        next: () => {
          this.loadGroups();
        },
        error: () => (this.loading = false),
      });
  }
}
