import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  EnrichedBanOnFacility,
  FacilitiesManagerService,
  Facility,
} from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import {
  EntityStorageService,
  GuiAuthResolver,
  NotificatorService,
  StoreService,
} from '@perun-web-apps/perun/services';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { UniversalConfirmationItemsDialogComponent } from '@perun-web-apps/perun/dialogs';
import { MatDialog } from '@angular/material/dialog';
import { AddFacilityBanDialogComponent } from '../../../../../shared/components/dialogs/add-facility-ban-dialog/add-facility-ban-dialog.component';
import { Urns } from '@perun-web-apps/perun/urns';
import { UpdateFacilityBanDialogComponent } from '../../../../../shared/components/dialogs/update-facility-ban-dialog/update-facility-ban-dialog.component';
import { UserFullNamePipe } from '@perun-web-apps/perun/pipes';
import {
  BanOnEntityListColumn,
  BanOnEntityListComponent,
  DebounceFilterComponent,
  RefreshButtonComponent,
} from '@perun-web-apps/perun/components';
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
    BanOnEntityListComponent,
    LoaderDirective,
    LoadingTableComponent,
  ],
  standalone: true,
  selector: 'app-facility-settings-bans',
  templateUrl: './facility-settings-bans.component.html',
  styleUrls: ['./facility-settings-bans.component.scss'],
  providers: [UserFullNamePipe],
})
export class FacilitySettingsBansComponent implements OnInit {
  loading = false;
  facility: Facility;
  bans: EnrichedBanOnFacility[] = [];
  addAuth: boolean;
  removeAuth = false;
  filter = '';
  selection = new SelectionModel<EnrichedBanOnFacility>(
    false,
    [],
    true,
    (banOnFacility1, banOnFacility2) => banOnFacility1.ban.id === banOnFacility2.ban.id,
  );
  cachedSubject = new BehaviorSubject(true);
  attrNames = [Urns.MEMBER_DEF_MAIL, Urns.USER_DEF_PREFERRED_MAIL].concat(
    this.store.getLoginAttributeNames(),
  );
  displayedColumns: BanOnEntityListColumn[] = [
    'select',
    'banId',
    'subjectId',
    'subjectName',
    'description',
    'expiration',
    'edit',
  ];

  constructor(
    private facilityService: FacilitiesManagerService,
    private entityService: EntityStorageService,
    private authResolver: GuiAuthResolver,
    private dialog: MatDialog,
    private notificator: NotificatorService,
    private store: StoreService,
    private userName: UserFullNamePipe,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.facility = this.entityService.getEntity();
    this.addAuth = this.authResolver.isAuthorized('setBan_BanOnFacility_policy', [this.facility]);
    this.removeAuth = this.authResolver.isAuthorized('removeBan_int_policy', [this.facility]);
    this.refresh();
  }

  refresh(): void {
    this.loading = true;
    this.facilityService.getEnrichedBansForFacility(this.facility.id, this.attrNames).subscribe({
      next: (bans) => {
        this.bans = bans;
        this.selection.clear();
        this.cachedSubject.next(true);
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  add(): void {
    const config = getDefaultDialogConfig();
    config.width = '850px';
    config.data = {
      entityId: this.facility.id,
      theme: 'facility-theme',
      bans: this.bans.map((ban) => ban.ban),
    };

    const dialogRef = this.dialog.open(AddFacilityBanDialogComponent, config);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.refresh();
    });
  }

  remove(): void {
    const config = getDefaultDialogConfig();
    config.width = '550px';
    config.data = {
      theme: 'facility-theme',
      title: 'DIALOGS.REMOVE_BAN.TITLE',
      description: 'DIALOGS.REMOVE_BAN.DESCRIPTION',
      items: [this.userName.transform(this.selection.selected[0].user)],
      type: 'remove',
      showAsk: true,
    };

    const dialogRef = this.dialog.open(UniversalConfirmationItemsDialogComponent, config);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loading = true;
        this.facilityService
          .removeFacilityBanById(this.selection.selected[0].ban.id)
          .subscribe(() => {
            this.notificator.showSuccess('DIALOGS.REMOVE_BAN.SUCCESS');
            this.refresh();
          });
      }
    });
  }

  update(ban: EnrichedBanOnFacility): void {
    const config = getDefaultDialogConfig();
    config.width = '600px';
    config.data = {
      ban: ban.ban,
      theme: 'facility-theme',
    };

    const dialogRef = this.dialog.open(UpdateFacilityBanDialogComponent, config);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.refresh();
    });
  }

  applyFilter(filterValue: string): void {
    this.filter = filterValue;
    this.refresh();
  }
}
