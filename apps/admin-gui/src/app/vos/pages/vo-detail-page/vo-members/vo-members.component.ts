import { Component, HostBinding, OnInit } from '@angular/core';
import { SideMenuService } from '../../../../core/services/common/side-menu.service';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { RemoveMembersDialogComponent } from '../../../../shared/components/dialogs/remove-members-dialog/remove-members-dialog.component';
import { AddMemberDialogComponent } from '../../../../shared/components/dialogs/add-member-dialog/add-member-dialog.component';
import { MembersService } from '@perun-web-apps/perun/services';
import { RichMember, Vo, VosManagerService } from '@perun-web-apps/perun/openapi';
import { Urns } from '@perun-web-apps/perun/urns';
import { FormControl } from '@angular/forms';
import { TABLE_VO_MEMBERS, TableConfigService } from '@perun-web-apps/config/table-config';
import { PageEvent } from '@angular/material/paginator';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';

@Component({
  selector: 'app-vo-members',
  templateUrl: './vo-members.component.html',
  styleUrls: ['./vo-members.component.scss']
})
export class VoMembersComponent implements OnInit {

  static id = 'VoMembersComponent';

  @HostBinding('class.router-component') true;

  constructor(
    private membersService: MembersService,
    private sideMenuService: SideMenuService,
    private voService: VosManagerService,
    private route: ActivatedRoute,
    private notificator: NotificatorService,
    private translate: TranslateService,
    private tableConfigService: TableConfigService,
    private dialog: MatDialog
  ) { }

  vo: Vo;

  members: RichMember[] = null;

  selection = new SelectionModel<RichMember>(true, []);
  searchString = '';
  firstSearchDone = false;

  loading = false;

  private attrNames = [
    Urns.MEMBER_DEF_ORGANIZATION,
    Urns.MEMBER_DEF_MAIL,
    Urns.USER_DEF_ORGANIZATION,
    Urns.USER_DEF_PREFERRED_MAIL
  ];

  statuses = new FormControl();
  statusList = ['VALID', 'INVALID', 'SUSPENDED', 'EXPIRED', 'DISABLED'];
  selectedStatuses: string[] = ['VALID', 'INVALID', 'SUSPENDED', 'EXPIRED', 'DISABLED'];
  pageSize: number;
  tableId = TABLE_VO_MEMBERS;

  ngOnInit() {
    this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
    this.statuses.setValue(this.statusList);
    this.route.parent.params.subscribe(parentParams => {
      const voId = parentParams['voId'];

      this.voService.getVoById(voId).subscribe(vo => {
        this.vo = vo;
      });
    });
  }

  onSearchByString() {
    this.loading = true;
    this.firstSearchDone = true;

    this.selection.clear();

    this.membersService.findCompleteRichMembers(this.vo.id, this.searchString, this.attrNames, this.selectedStatuses).subscribe(
      members => {
        this.members = members;
        this.loading = false;
      },
      () => this.loading = false
    );
  }

  onListAll() {
    this.loading = true;
    this.firstSearchDone = true;

    this.selection.clear();
    this.membersService.getCompleteRichMembers(this.vo.id, this.attrNames, this.selectedStatuses).subscribe(
      members => {
        this.members = members;
        this.loading = false;
      },
      () => this.loading = false
    );
  }

  onAddMember() {
    const config = getDefaultDialogConfig();
    config.width = '1000px';
    config.data = {
      entityId: this.vo.id,
      voId: this.vo.id,
      theme: 'vo-theme',
      type: 'vo'
    };

    const dialogRef = this.dialog.open(AddMemberDialogComponent, config);

    dialogRef.afterClosed().subscribe(() => {
      if (this.firstSearchDone) {
        this.refreshTable();
      }
    });
  }

  onKeyInput(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.searchString.length > 0) {
      this.onSearchByString();
    }
  }

  onRemoveMembers() {
    const config = getDefaultDialogConfig();
    config.width = '450px';
    config.data = { members: this.selection.selected };

    const dialogRef = this.dialog.open(RemoveMembersDialogComponent, config);

    dialogRef.afterClosed().subscribe(wereMembersDeleted => {
      if (wereMembersDeleted) {
        this.refreshTable();
      }
    });
  }

  refreshTable() {
    if (this.searchString.trim().length > 0) {
      this.onSearchByString();
    } else {
      this.onListAll();
    }
  }

  displaySelectedStatuses(): string {
    if(this.selectedStatuses.length === this.statusList.length){
      return 'ALL';
    }
    if(this.statuses.value){
      return `${this.statuses.value[0]}  ${this.statuses.value.length > 1 ? ('(+' + (this.statuses.value.length - 1) +' '+ (this.statuses.value.length === 2 ? 'other)' : 'others)')) : ''}`;
    }
    return '';
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
  }
}
