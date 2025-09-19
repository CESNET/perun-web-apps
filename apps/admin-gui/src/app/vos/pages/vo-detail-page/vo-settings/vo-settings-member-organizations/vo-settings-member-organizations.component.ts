import {
  DebounceFilterComponent,
  RefreshButtonComponent,
  VosListComponent,
} from '@perun-web-apps/perun/components';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { MatDialog } from '@angular/material/dialog';
import { AddMemberOrganizationDialogComponent } from './add-member-organization-dialog/add-member-organization-dialog.component';
import { Vo, VosManagerService } from '@perun-web-apps/perun/openapi';
import {
  EntityStorageService,
  GuiAuthResolver,
  NotificatorService,
} from '@perun-web-apps/perun/services';
import { SelectionModel } from '@angular/cdk/collections';
import { ReloadEntityDetailService } from '../../../../../core/services/common/reload-entity-detail.service';
import { UniversalConfirmationItemsDialogComponent } from '@perun-web-apps/perun/dialogs';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    DebounceFilterComponent,
    RefreshButtonComponent,
    TranslateModule,
    VosListComponent,
    LoaderDirective,
    LoadingTableComponent,
  ],
  standalone: true,
  selector: 'app-vo-settings-member-organizations',
  templateUrl: './vo-settings-member-organizations.component.html',
  styleUrls: ['./vo-settings-member-organizations.component.scss'],
})
export class VoSettingsMemberOrganizationsComponent implements OnInit {
  loading = false;
  voId: number;
  voSelection = new SelectionModel<Vo>(false, [], true, (vo1, vo2) => vo1.id === vo2.id);
  cachedSubject = new BehaviorSubject(true);
  displayedColumns = ['checkbox', 'id', 'shortName', 'name'];
  filterValue = '';
  routeAuth = false;
  addAuth = false;
  removeAuth = false;
  memberVos: Vo[] = [];

  constructor(
    private dialog: MatDialog,
    private vosService: VosManagerService,
    private entityStorage: EntityStorageService,
    private authResolver: GuiAuthResolver,
    private reloadDetailService: ReloadEntityDetailService,
    private notificator: NotificatorService,
    private translator: TranslateService,
  ) {}

  ngOnInit(): void {
    const vo = this.entityStorage.getEntity();
    this.addAuth = this.authResolver.isAuthorized('result-addMemberVo_Vo_Vo_policy', [vo]);
    this.removeAuth = this.authResolver.isAuthorized('removeMemberVo_Vo_Vo_policy', [vo]);
    this.routeAuth = this.authResolver.isPerunAdminOrObserver();
    this.voId = this.entityStorage.getEntity().id;
    this.refresh();
  }

  refresh(): void {
    this.loading = true;
    this.vosService.getEnrichedVoById(this.voId).subscribe({
      next: (enrichedVo) => {
        this.voId = enrichedVo.vo.id;
        this.memberVos = enrichedVo.memberVos;
        this.voSelection.clear();
        this.cachedSubject.next(true);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  addMemberOrganization(): void {
    const config = getDefaultDialogConfig();
    config.width = '750px';

    this.dialog
      .open(AddMemberOrganizationDialogComponent, config)
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.reloadDetailService.reloadEntityDetail();
          this.refresh();
        }
      });
  }

  removeMemberVos(): void {
    this.vosService.removeMemberVo(this.voId, this.voSelection.selected[0].id).subscribe(() => {
      this.notificator.showSuccess(
        this.translator.instant(
          'VO_DETAIL.SETTINGS.MEMBER_ORGANIZATIONS.REMOVE_MEMBER_ORGANIZATION.TITLE',
        ) as string,
      );
      this.reloadDetailService.reloadEntityDetail();
      this.refresh();
    });
  }

  removeMemberOrganization(): void {
    const config = getDefaultDialogConfig();
    config.width = '550px';
    config.data = {
      items: this.voSelection.selected.map((vo) => vo.name),
      title: 'VO_DETAIL.SETTINGS.MEMBER_ORGANIZATIONS.REMOVE_MEMBER_ORGANIZATION.TITLE',
      alert: 'VO_DETAIL.SETTINGS.MEMBER_ORGANIZATIONS.REMOVE_MEMBER_ORGANIZATION.WARNING',
      theme: 'vo-theme',
      type: 'remove',
      showAsk: true,
    };

    this.dialog
      .open(UniversalConfirmationItemsDialogComponent, config)
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.removeMemberVos();
        }
      });
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.refresh();
  }
}
