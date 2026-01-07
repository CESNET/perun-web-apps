import { TranslateModule } from '@ngx-translate/core';
import {
  DebounceFilterComponent,
  RefreshButtonComponent,
  MembersListComponent,
} from '@perun-web-apps/perun/components';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Consent,
  ConsentsManagerService,
  Resource,
  ResourcesManagerService,
  RichMember,
} from '@perun-web-apps/perun/openapi';
import {
  EntityStorageService,
  GuiAuthResolver,
  StoreService,
} from '@perun-web-apps/perun/services';
import { MemberWithConsentStatus } from '@perun-web-apps/perun/models';
import { ConsentStatusIconPipe, SelectedConsentStatusesPipe } from '@perun-web-apps/perun/pipes';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';

@Component({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    DebounceFilterComponent,
    RefreshButtonComponent,
    MembersListComponent,
    TranslateModule,
    LoaderDirective,
    SelectedConsentStatusesPipe,
    LoadingTableComponent,
  ],
  standalone: true,
  selector: 'app-resource-assigned-members',
  templateUrl: './resource-assigned-members.component.html',
  styleUrls: ['./resource-assigned-members.component.scss'],
  providers: [ConsentStatusIconPipe, SelectedConsentStatusesPipe],
})
export class ResourceAssignedMembersComponent implements OnInit {
  loading = false;
  filterValue = '';

  resource: Resource;
  members: MemberWithConsentStatus[] = [];
  columns = ['id', 'fullName'];
  includeConsents = false;
  consents: Consent[] = [];
  consentStatuses = new FormControl();

  consentStatusList = ['UNSIGNED', 'GRANTED', 'REVOKED'];
  selectedConsentStatuses: string[] = [];
  selection = new SelectionModel<MemberWithConsentStatus>(true, []);

  routeAuth: boolean;

  constructor(
    private route: ActivatedRoute,
    private resourceService: ResourcesManagerService,
    private authResolver: GuiAuthResolver,
    private entityStorageService: EntityStorageService,
    private storeService: StoreService,
    private consentService: ConsentsManagerService,
    private consentStatusPipe: ConsentStatusIconPipe,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.resource = this.entityStorageService.getEntity();
    this.refreshTable();
  }

  refreshTable(): void {
    this.loading = true;
    this.resourceService.getAssignedRichMembers(this.resource.id).subscribe((members) => {
      this.setAuthRights(members);
      this.consentService.getConsentHubByResource(this.resource.id).subscribe((hub) => {
        // include consents if they are turned on and enforced
        this.includeConsents =
          this.storeService.getProperty('enforce_consents') && hub.enforceConsents;
        if (this.includeConsents) {
          this.columns = ['id', 'fullName', 'consentStatus'];
          this.consentService
            .getConsentsForConsentHubByResource(this.resource.id)
            .subscribe((consents) => {
              this.consents = consents;
              this.members = this.getConsentsForMembers(members).filter(
                (member) =>
                  !this.selectedConsentStatuses ||
                  this.selectedConsentStatuses.length === 0 ||
                  this.selectedConsentStatuses.includes(member.consent),
              );
            });
        } else {
          this.members = members as MemberWithConsentStatus[];
        }
        this.loading = false;
      });
    });
  }

  setAuthRights(members: RichMember[]): void {
    if (members.length !== 0) {
      this.routeAuth = this.authResolver.isAuthorized('getMemberById_int_policy', [members[0]]);
    }
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
  }

  getConsentsForMembers(members: RichMember[]): MemberWithConsentStatus[] {
    const result: MemberWithConsentStatus[] = [];
    members.forEach((member) => {
      const mwc: MemberWithConsentStatus = member;
      mwc.consent = this.consentStatusPipe.transform(member.userId, this.consents);
      result.push(mwc);
    });
    return result;
  }

  changeConsentStatuses(): void {
    this.selection.clear();
    this.selectedConsentStatuses = this.consentStatuses.value as string[];
    this.refreshTable();
  }
}
