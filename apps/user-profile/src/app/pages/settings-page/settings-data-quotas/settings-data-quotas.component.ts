import { Component, OnInit } from '@angular/core';
import { StoreService } from '@perun-web-apps/perun/services';
import {
  AttributesManagerService,
  MembersManagerService,
  ResourcesManagerService,
  RichResource, User,
  UsersManagerService,
  Vo
} from '@perun-web-apps/perun/openapi';
import { MatDialog } from '@angular/material/dialog';
import { RequestChangeDataQuotaDialogComponent } from '../../../components/dialogs/request-change-data-quota-dialog/request-change-data-quota-dialog.component';

@Component({
  selector: 'perun-web-apps-settings-data-quotas',
  templateUrl: './settings-data-quotas.component.html',
  styleUrls: ['./settings-data-quotas.component.scss']
})
export class SettingsDataQuotasComponent implements OnInit {

  constructor(private store: StoreService,
              private usersManagerService: UsersManagerService,
              private membersService: MembersManagerService,
              private resourcesManagerService: ResourcesManagerService,
              private attributesManagerService: AttributesManagerService,
              private dialog: MatDialog) {
  }

  user: User;
  vos: Vo[] = [];
  resources: RichResource[] = [];
  currentQuota: string;
  defaultQuota: string;
  quotasMarkup = '';

  ngOnInit() {
    this.user = this.store.getPerunPrincipal().user;

    this.usersManagerService.getVosWhereUserIsMember(this.user.id).subscribe(vos => {
      this.vos = vos;
    });
  }

  getMembersResources(vo: Vo) {
    this.membersService.getMemberByUser(vo.id, this.user.id).subscribe(member => {
      this.resourcesManagerService.getAssignedRichResourcesWithMember(member.id).subscribe(resources => {
        this.resources = resources;
      });
    });
  }

  getResAttributes(id: number) {
    this.attributesManagerService.getResourceAttributes(id).subscribe(atts => {
      let quotaAttribute = atts.find(att => att.friendlyName === 'dataQuotas');
      if (quotaAttribute && quotaAttribute.value) {
        const keys = Object.keys(quotaAttribute.value);
        this.currentQuota = quotaAttribute.value[keys[0]];
      } else {
        this.currentQuota = '';
      }
      quotaAttribute = atts.find(att => att.friendlyName === 'defaultDataQuotas');
      if (quotaAttribute) {
        const keys = Object.keys(quotaAttribute.value);
        this.defaultQuota = quotaAttribute.value[keys[0]];
      } else {
        this.defaultQuota = '';
      }
      if(!this.currentQuota){
        this.currentQuota = this.defaultQuota;
      }
      this.parseMarkup();
    });
  }

  private parseMarkup() {
    let result = '';
    result += this.currentQuota;
    result += ` (default: ${this.defaultQuota})`;
    result = result.split(':').join(' : ')
      .split('K').join(' KiB')
      .split('M').join(' MiB')
      .split('G').join(' GiB')
      .split('T').join(' TiB')
      .split('E').join(' EiB');

    this.quotasMarkup = result;
  }

  requestChangeQuota(vo: Vo, resource: RichResource) {
    this.dialog.open(RequestChangeDataQuotaDialogComponent, {
      width: '600px',
      data: { vo: vo, resource: resource, user: this.user, currentQuota: this.quotasMarkup }
    });
  }
}
