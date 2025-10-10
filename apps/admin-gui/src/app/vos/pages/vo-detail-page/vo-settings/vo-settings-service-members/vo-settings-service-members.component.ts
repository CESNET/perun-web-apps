import { TranslateModule } from '@ngx-translate/core';
import {
  DebounceFilterComponent,
  RefreshButtonComponent,
  MembersListComponent,
} from '@perun-web-apps/perun/components';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MembersManagerService, RichMember, Vo } from '@perun-web-apps/perun/openapi';
import { TABLE_SERVICE_MEMBERS } from '@perun-web-apps/config/table-config';
import { MatDialog } from '@angular/material/dialog';
import { EntityStorageService, GuiAuthResolver } from '@perun-web-apps/perun/services';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import {
  CreateServiceMemberDialogComponent,
  CreateServiceMemberDialogResult,
} from '../../../../../shared/components/create-service-member-dialog/create-service-member-dialog.component';
import { RemoveMembersDialogComponent } from '../../../../../shared/components/dialogs/remove-members-dialog/remove-members-dialog.component';
import { SponsorExistingMemberDialogComponent } from '../../../../../shared/components/dialogs/sponsor-existing-member-dialog/sponsor-existing-member-dialog.component';
import { BehaviorSubject } from 'rxjs';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    DebounceFilterComponent,
    RefreshButtonComponent,
    MembersListComponent,
    TranslateModule,
    LoaderDirective,
    LoadingTableComponent,
  ],
  standalone: true,
  selector: 'app-vo-settings-service-members',
  templateUrl: './vo-settings-service-members.component.html',
  styleUrls: ['./vo-settings-service-members.component.scss'],
})
export class VoSettingsServiceMembersComponent implements OnInit {
  members: RichMember[] = [];
  selection = new SelectionModel<RichMember>(
    true,
    [],
    true,
    (richMember1, richMember2) => richMember1.id === richMember2.id,
  );
  searchString = '';
  loading = false;
  tableId = TABLE_SERVICE_MEMBERS;
  removeAuth: boolean;
  cacheSubject = new BehaviorSubject(true);
  private vo: Vo;

  constructor(
    private membersManager: MembersManagerService,
    private dialog: MatDialog,
    private authResolver: GuiAuthResolver,
    private authzService: GuiAuthResolver,
    private entityStorageService: EntityStorageService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.vo = this.entityStorageService.getEntity();
    this.removeAuth = this.authzService.isAuthorized('deleteMembers_List<Member>_policy', [
      this.vo,
    ]);
    this.refresh();
  }

  createServiceMember(): void {
    const config = getDefaultDialogConfig();
    config.width = '900px';
    config.data = {
      vo: this.vo,
      theme: 'vo-theme',
    };

    const dialogRef = this.dialog.open(CreateServiceMemberDialogComponent, config);

    dialogRef.afterClosed().subscribe((result: CreateServiceMemberDialogResult) => {
      if (result.result) {
        if (result.sponsor) {
          config.data = {
            voId: this.vo.id,
            theme: 'vo-theme',
            voSponsors: result.voSponsors,
            findSponsorsAuth: result.findSponsorsAuth,
            serviceMemberId: result.serviceMemberId,
          };
          const sponsorDialogRef = this.dialog.open(SponsorExistingMemberDialogComponent, config);

          sponsorDialogRef.afterClosed().subscribe(() => {
            this.refresh();
          });
        } else {
          this.refresh();
        }
      }
    });
  }

  onRemoveMembers(): void {
    const config = getDefaultDialogConfig();
    config.width = '450px';
    config.data = {
      members: this.selection.selected,
      theme: 'vo-theme',
    };

    const dialogRef = this.dialog.open(RemoveMembersDialogComponent, config);

    dialogRef.afterClosed().subscribe((wereMembersDeleted) => {
      if (wereMembersDeleted) {
        this.selection.clear();
        this.refresh();
      }
    });
  }

  applyFilter(filterValue: string): void {
    this.searchString = filterValue;
  }

  refresh(): void {
    this.cacheSubject.next(true);
    this.loading = true;
    this.membersManager.getServiceUserRichMembers(this.vo.id).subscribe((members) => {
      this.members = members.filter((member) =>
        this.authResolver.isAuthorized('getRichMemberWithAttributes_Member_policy', [member]),
      );
      this.loading = false;
      this.cd.detectChanges();
    });
  }
}
