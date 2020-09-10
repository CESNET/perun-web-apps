import {Component, OnInit} from '@angular/core';
import {MenuItem} from '@perun-web-apps/perun/models';
import {InviteMemberDialogComponent} from '../../../../shared/components/dialogs/invite-member-dialog/invite-member-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {SideMenuService} from '../../../../core/services/common/side-menu.service';
import {ActivatedRoute, Router} from '@angular/router';
import {GuiAuthResolver} from '@perun-web-apps/perun/services';
import { Vo, VosManagerService } from '@perun-web-apps/perun/openapi';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';

@Component({
  selector: 'app-vo-overview',
  templateUrl: './vo-overview.component.html',
  styleUrls: ['./vo-overview.component.scss']
})
export class VoOverviewComponent implements OnInit {

  // @HostBinding('class.router-component') true;

  constructor(
    private sideMenuService: SideMenuService,
    private voService: VosManagerService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected authResolver: GuiAuthResolver
  ) {
  }

  vo: Vo;
  items: MenuItem[] = [];

  navItems: MenuItem[] = [];

  ngOnInit(): void {
    this.route.parent.params.subscribe(parentParams => {
      const voId = parentParams['voId'];

      this.voService.getVoById(voId).subscribe(vo => {
        this.vo = vo;

        // this.initItems();
        this.initNavItems();
      });
    });
  }

  private initNavItems() {
    // Attributes
    this.navItems.push({
        cssIcon: 'perun-attributes',
        url: `/organizations/${this.vo.id}/attributes`,
        label: 'MENU_ITEMS.VO.ATTRIBUTES',
        style: 'vo-btn'
      });

    // Members
    if (this.authResolver.isAuthorized('getCompleteRichMembers_Vo_List<String>_policy', [this.vo])) {
      this.navItems.push({
        cssIcon: 'perun-user',
        url: `/organizations/${this.vo.id}/members`,
        label: 'MENU_ITEMS.VO.MEMBERS',
        style: 'vo-btn'
      });
    }

    // Groups
    if (this.authResolver.isAuthorized('getAllRichGroupsWithAttributesByNames_Vo_List<String>_policy', [this.vo])) {
      this.navItems.push({
        cssIcon: 'perun-group',
        url: `/organizations/${this.vo.id}/groups`,
        label: 'MENU_ITEMS.VO.GROUPS',
        style: 'vo-btn'
      });
    }

    // Resource management
    if (this.authResolver.isAuthorized('getRichResources_Vo_policy', [this.vo])) {
      this.navItems.push({
        cssIcon: 'perun-manage-facility',
        url: `/organizations/${this.vo.id}/resources`,
        label: 'MENU_ITEMS.VO.RESOURCES',
        style: 'vo-btn'
      });
    }

    // Applications
    if (this.authResolver.isAuthorized('getApplicationsForVo_Vo_List<String>_policy',[this.vo])) {
      this.navItems.push({
        cssIcon: 'perun-applications',
        url: `/organizations/${this.vo.id}/applications`,
        label: 'MENU_ITEMS.VO.APPLICATIONS',
        style: 'vo-btn'
      });
    }

    // Settings
    if (this.authResolver.isAuthorized('getRichAdmins_Vo_String_List<String>_boolean_boolean_policy', [this.vo]) ||
    this.authResolver.isAuthorized('getVoExtSources_Vo_policy', [this.vo]) ||
    this.authResolver.isThisVoAdminOrObserver(this.vo.id)) {
      this.navItems.push({
        cssIcon: 'perun-settings2',
        url: `/organizations/${this.vo.id}/settings`,
        label: 'MENU_ITEMS.VO.SETTINGS',
        style: 'vo-btn'
      });
    }
  }

  private initItems() {
    this.items = [
      {
        cssIcon: 'perun-invite-member',
        label: 'VO_DETAIL.OVERVIEW.INVITE_MEMBER',
        style: 'vo-btn',
        url: `/organizations/${this.vo.id}/invite-member`,
        clickAction: function (dialog: MatDialog, voId: number) {
          const config = getDefaultDialogConfig();
          config.width = '450px';
          config.data = {voId: voId};

          dialog.open(InviteMemberDialogComponent, config);
        }
      },
      {
        cssIcon: 'perun-service-identity',
        label: 'VO_DETAIL.OVERVIEW.CREATE_SERVICE_MEMBER',
        style: 'vo-btn',
        url: `/organizations/${this.vo.id}/create-service-member`,
        clickAction: function (dialog: MatDialog, voId: number) {
          return;
        }
      },
      {
        cssIcon: 'perun-manager',
        label: 'VO_DETAIL.OVERVIEW.ADD_MANAGER',
        style: 'vo-btn',
        url: `/organizations/${this.vo.id}/add-manager`,
        clickAction: function (dialog: MatDialog, voId: number) {
          return;
        }
      },
      {
        cssIcon: 'perun-group',
        label: 'VO_DETAIL.OVERVIEW.CREATE_GROUP',
        style: 'vo-btn',
        url: `/organizations/${this.vo.id}/create-group`,
        clickAction: function (dialog: MatDialog, voId: number) {
          return;
        }
      },
      {
        cssIcon: 'perun-create1',
        label: 'VO_DETAIL.OVERVIEW.ADD_MEMBER',
        style: 'vo-btn',
        url: `/organizations/${this.vo.id}/invite-member`,
        clickAction: function (dialog: MatDialog, voId: number) {
          return;
        }
      }
    ];
  }
}
