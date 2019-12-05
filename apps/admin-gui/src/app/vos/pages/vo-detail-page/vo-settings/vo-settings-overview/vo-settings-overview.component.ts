import {Component, HostBinding, OnInit} from '@angular/core';
import {SideMenuService} from '../../../../../core/services/common/side-menu.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MenuItem} from '../../../../../shared/models/MenuItem';
import { VoService } from '@perun-web-apps/perun/services';
import { Vo } from '@perun-web-apps/perun/models';

@Component({
  selector: 'app-vo-settings-overview',
  templateUrl: './vo-settings-overview.component.html',
  styleUrls: ['./vo-settings-overview.component.scss']
})
export class VoSettingsOverviewComponent implements OnInit {

  @HostBinding('class.router-component') true;

  constructor(
    private sideMenuService: SideMenuService,
    private voService: VoService,
    protected route: ActivatedRoute,
    protected router: Router
  ) { }

  items: MenuItem[] = [];
  vo: Vo;

  ngOnInit() {
    this.route.parent.parent.params.subscribe(parentParams => {
      const voId = parentParams['voId'];

      this.voService.getVoById(voId).subscribe(vo => {
        this.vo = vo;

        this.initItems();
      });
    });
  }

  private initItems() {
    this.items = [
      {
        icon: 'attributes-white.svg',
        url: `/organizations/${this.vo.id}/settings/attributes`,
        label: 'MENU_ITEMS.VO.ATTRIBUTES',
        style: 'vo-btn'
      },
      {
        icon: 'group-white.svg',
        url: `/organizations/${this.vo.id}/settings/expiration`,
        label: 'MENU_ITEMS.VO.EXPIRATION',
        style: 'vo-btn'
      },
      {
        icon: 'manager-white.svg',
        url: `/organizations/${this.vo.id}/settings/managers`,
        label: 'MENU_ITEMS.VO.MANAGERS',
        style: 'vo-btn'
      },
      {
        icon: 'application_form-white.svg',
        url: `/organizations/${this.vo.id}/settings/applicationForm`,
        label: 'MENU_ITEMS.VO.APPLICATION_FORM',
        style: 'vo-btn'
      },
      {
        icon: 'notification-white.svg',
        url: `/organizations/${this.vo.id}/settings/notifications`,
        label: 'MENU_ITEMS.VO.NOTIFICATIONS',
        style: 'vo-btn'
      },
      {
        icon: 'external_sources-white.svg',
        url: `/organizations/${this.vo.id}/settings/extsources`,
        label: 'MENU_ITEMS.VO.EXTSOURCES',
        style: 'vo-btn'
      }
    ];
  }
}
