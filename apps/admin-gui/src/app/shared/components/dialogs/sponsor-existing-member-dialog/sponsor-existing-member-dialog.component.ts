import { TranslateModule } from '@ngx-translate/core';
import { MembersListComponent } from '@perun-web-apps/perun/components';
import { ExpirationSelectComponent } from '@perun-web-apps/perun/dialogs';
import { LoadingDialogComponent, LoadingTableComponent } from '@perun-web-apps/ui/loaders';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import {
  FindSponsorsService,
  NotificatorService,
  PerunTranslateService,
  StoreService,
} from '@perun-web-apps/perun/services';
import { MembersManagerService, RichMember, User } from '@perun-web-apps/perun/openapi';
import { UntypedFormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { Urns } from '@perun-web-apps/perun/urns';
import { TABLE_ADD_SPONSORED_MEMBERS } from '@perun-web-apps/config/table-config';
import { BehaviorSubject } from 'rxjs';
import { ChooseSponsorComponent } from '../../choose-sponsor/choose-sponsor.component';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

export interface SponsorExistingMemberDialogData {
  voId: number;
  theme: string;
  findSponsorsAuth: boolean;
  serviceMemberId?: number;
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    UiAlertsModule,
    LoadingDialogComponent,
    ExpirationSelectComponent,
    MembersListComponent,
    TranslateModule,
    ChooseSponsorComponent,
    LoaderDirective,
    LoadingTableComponent,
  ],
  standalone: true,
  selector: 'app-sponsor-existing-member-dialog',
  templateUrl: './sponsor-existing-member-dialog.component.html',
  styleUrls: ['./sponsor-existing-member-dialog.component.scss'],
})
export class SponsorExistingMemberDialogComponent implements OnInit {
  dialogLoading = false;
  tableLoading = false;
  theme: string;
  tableId = TABLE_ADD_SPONSORED_MEMBERS;
  displayedColumns: string[];
  expiration = 'never';
  searchCtrl: UntypedFormControl = new UntypedFormControl('', [Validators.required]);
  firstSearchDone = false;
  members: RichMember[] = [];
  selection = new SelectionModel<RichMember>(
    true,
    [],
    true,
    (richMember1, richMember2) => richMember1.id === richMember2.id,
  );
  serviceMemberId: number;
  selectedSponsor: User = null;
  voSponsors: User[] = [];
  sponsorType = 'self';
  minDate = new Date();
  cacheSubject = new BehaviorSubject(true);

  constructor(
    private dialogRef: MatDialogRef<SponsorExistingMemberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SponsorExistingMemberDialogData,
    private store: StoreService,
    private membersService: MembersManagerService,
    private notificator: NotificatorService,
    private translate: PerunTranslateService,
    private findSponsors: FindSponsorsService,
  ) {}

  ngOnInit(): void {
    this.dialogLoading = true;
    this.theme = this.data.theme;
    this.serviceMemberId = this.data.serviceMemberId;
    this.displayedColumns = this.serviceMemberId
      ? ['checkbox', 'id', 'fullName', 'sponsored', 'email']
      : ['checkbox', 'id', 'fullName', 'status', 'sponsored', 'email'];
    this.findSponsors.getSponsors(this.data.voId).subscribe((sponsors) => {
      this.voSponsors = sponsors;
      if (this.serviceMemberId) {
        this.searchCtrl.setValue(this.serviceMemberId);
        this.onSearchByString();
      } else {
        this.dialogLoading = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  sponsor(members: RichMember[]): void {
    this.dialogLoading = true;

    const sponsor =
      this.sponsorType === 'self' ? this.store.getPerunPrincipal().user : this.selectedSponsor;

    const memberIds = members.map((member) => member.id);

    this.membersService
      .sponsorMembersBodyParams({
        members: memberIds,
        sponsor: sponsor.id,
        validityTo: this.expiration,
      })
      .subscribe({
        next: () => {
          this.notificator.showSuccess(
            this.translate.instant('DIALOGS.SPONSOR_EXISTING_MEMBER.SUCCESS'),
          );
          this.dialogLoading = false;
          this.dialogRef.close(true);
        },
        error: () => (this.dialogLoading = false),
      });
  }

  onSubmit(): void {
    this.dialogLoading = true;
    const members = Array.from(this.selection.selected);
    this.expiration = this.expiration === 'never' ? null : this.expiration;

    this.sponsor(members);
  }

  setExpiration(newExpiration: string): void {
    this.expiration = newExpiration;
  }

  onSearchByString(): void {
    if (this.searchCtrl.invalid) {
      this.searchCtrl.markAllAsTouched();
      return;
    }
    this.firstSearchDone = true;
    this.tableLoading = true;

    this.cacheSubject.next(true);
    this.selection.clear();

    const attrNames = [Urns.MEMBER_DEF_EXPIRATION, Urns.USER_DEF_PREFERRED_MAIL];
    this.membersService
      .findCompleteRichMembersForVo(
        this.data.voId,
        attrNames,
        (this.searchCtrl.value as string).trim(),
      )
      .subscribe({
        next: (members) => {
          this.members = members;
          if (this.serviceMemberId) {
            this.selection.toggle(members[0]);
          }
          this.tableLoading = false;
        },
        error: () => (this.tableLoading = false),
      });
  }
}
