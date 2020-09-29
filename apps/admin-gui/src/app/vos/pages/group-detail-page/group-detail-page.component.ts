import { Component, OnInit } from '@angular/core';
import { SideMenuService } from '../../../core/services/common/side-menu.service';
import { ActivatedRoute } from '@angular/router';
import { SideMenuItemService } from '../../../shared/side-menu/side-menu-item.service';
import { fadeIn } from '@perun-web-apps/perun/animations';
import { GroupsManagerService, RichGroup, Vo, VosManagerService } from '@perun-web-apps/perun/openapi';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { MatDialog } from '@angular/material/dialog';
import {
  EditFacilityResourceGroupVoDialogComponent,
  EditFacilityResourceGroupVoDialogOptions
} from '@perun-web-apps/perun/components';
import { GuiAuthResolver } from '@perun-web-apps/perun/services';
import { Urns } from '@perun-web-apps/perun/urns';
import { GroupSyncDetailDialogComponent } from '@perun-web-apps/perun/components';

@Component({
  selector: 'app-group-detail-page',
  templateUrl: './group-detail-page.component.html',
  styleUrls: ['./group-detail-page.component.scss'],
  animations: [
    fadeIn
  ]
})
export class GroupDetailPageComponent implements OnInit {

  constructor(
    private sideMenuService: SideMenuService,
    private voService: VosManagerService,
    private route: ActivatedRoute,
    private sideMenuItemService: SideMenuItemService,
    private groupService: GroupsManagerService,
    private dialog: MatDialog,
    private guiAuthResolver: GuiAuthResolver
  ) {
  }

  vo: Vo;
  group: RichGroup;
  editAuth = false;
  loading = false;
  syncAuth = false;
  syncEnabled = false;
  attrNames = [
    Urns.GROUP_SYNC_ENABLED,
    Urns.GROUP_LAST_SYNC_STATE,
    Urns.GROUP_LAST_SYNC_TIMESTAMP,
    Urns.GROUP_STRUCTURE_SYNC_ENABLED,
    Urns.GROUP_LAST_STRUCTURE_SYNC_STATE,
    Urns.GROUP_LAST_STRUCTURE_SYNC_TIMESTAMP
  ];

  ngOnInit() {
    this.loading = true;
    this.route.params.subscribe(params => {
      const voId = params['voId'];
      const groupId = params['groupId'];

      this.voService.getVoById(voId).subscribe(vo => {
        this.vo = vo;
        this.groupService.getRichGroupByIdWithAttributesByNames(groupId, this.attrNames).subscribe(group => {
          this.group = group;
          this.syncEnabled = this.isSynchronized();
          this.editAuth = this.guiAuthResolver.isAuthorized('updateGroup_Group_policy', [this.group]);
          this.syncAuth = this.guiAuthResolver.isAuthorized('forceGroupSynchronization_Group_policy', [this.group]);
          const voSideMenuItem = this.sideMenuItemService.parseVo(vo);
          const groupSideMenuItem = this.sideMenuItemService.parseGroup(group);

          this.sideMenuService.setAccessMenuItems([voSideMenuItem, groupSideMenuItem]);
          this.loading = false;
        }, () => this.loading = false);
      }, () => this.loading = false);
    });
  }

  isSynchronized() {
    return this.group.attributes.some(att =>
      att.friendlyName === "synchronizationEnabled" && att.value !== null && att.value.toString() === "true");
  }

  onSyncDetail() {
    const config = getDefaultDialogConfig();
    config.data = {
      groupId: this.group.id,
      theme: 'group-theme'
    };
    this.dialog.open(GroupSyncDetailDialogComponent, config);
  }

  editGroup() {
    const config = getDefaultDialogConfig();
    config.width = '450px';
    config.data = {
      theme: 'group-theme',
      group: this.group,
      dialogType: EditFacilityResourceGroupVoDialogOptions.GROUP
    };
    const dialogRef = this.dialog.open(EditFacilityResourceGroupVoDialogComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.groupService.getGroupById(this.group.id).subscribe(group => {
          this.group = group;
        });
      }
    });
  }
}
