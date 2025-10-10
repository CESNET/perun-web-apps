import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  EnrichedBanOnResource,
  EnrichedBanOnVo,
  Resource,
  ResourcesManagerService,
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
import { AddResourceBanDialogComponent } from '../../../../../shared/components/dialogs/add-resource-ban-dialog/add-resource-ban-dialog.component';
import { Urns } from '@perun-web-apps/perun/urns';
import { UpdateResourceBanDialogComponent } from '../../../../../shared/components/dialogs/update-resource-ban-dialog/update-resource-ban-dialog.component';
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
  selector: 'app-resource-settings-bans',
  templateUrl: './resource-settings-bans.component.html',
  styleUrls: ['./resource-settings-bans.component.scss'],
  providers: [UserFullNamePipe],
})
export class ResourceSettingsBansComponent implements OnInit {
  loading = false;
  resource: Resource;
  bans: EnrichedBanOnResource[] = [];
  addAuth: boolean;
  removeAuth = false;
  filter = '';
  selection = new SelectionModel<EnrichedBanOnVo>(
    false,
    [],
    true,
    (banOnVo1, banOnVo2) => banOnVo1.ban.id === banOnVo2.ban.id,
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
    private resourceService: ResourcesManagerService,
    private entityService: EntityStorageService,
    private authResolver: GuiAuthResolver,
    private dialog: MatDialog,
    private notificator: NotificatorService,
    private store: StoreService,
    private userName: UserFullNamePipe,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.resource = this.entityService.getEntity();
    this.addAuth = this.authResolver.isAuthorized('setBan_BanOnResource_policy', [this.resource]);
    this.removeAuth = this.authResolver.isAuthorized('resource-removeBan_int_policy', [
      this.resource,
    ]);
    this.refresh();
  }

  refresh(): void {
    this.loading = true;
    this.resourceService.getEnrichedBansForResource(this.resource.id, this.attrNames).subscribe({
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
      entityId: this.resource.id,
      theme: 'resource-theme',
      bans: this.bans.map((ban) => ban.ban),
    };

    const dialogRef = this.dialog.open(AddResourceBanDialogComponent, config);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.refresh();
    });
  }

  remove(): void {
    const config = getDefaultDialogConfig();
    config.width = '550px';
    config.data = {
      theme: 'resource-theme',
      title: 'DIALOGS.REMOVE_BAN.TITLE',
      description: 'DIALOGS.REMOVE_BAN.DESCRIPTION',
      items: [this.userName.transform(this.selection.selected[0].member.user)],
      type: 'remove',
      showAsk: true,
    };

    const dialogRef = this.dialog.open(UniversalConfirmationItemsDialogComponent, config);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.resourceService
          .removeResourceBanById(this.selection.selected[0].ban.id)
          .subscribe(() => {
            this.notificator.showSuccess('DIALOGS.REMOVE_BAN.SUCCESS');
            this.refresh();
          });
      }
    });
  }

  update(ban: EnrichedBanOnResource): void {
    const config = getDefaultDialogConfig();
    config.width = '600px';
    config.data = {
      ban: ban.ban,
      theme: 'facility-theme',
    };

    const dialogRef = this.dialog.open(UpdateResourceBanDialogComponent, config);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.refresh();
    });
  }

  applyFilter(filterValue: string): void {
    this.filter = filterValue;
    this.refresh();
  }
}
