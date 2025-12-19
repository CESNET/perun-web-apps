import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DebounceFilterComponent } from '@perun-web-apps/perun/components';
import { CustomTranslatePipe } from '@perun-web-apps/perun/pipes';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AttributesManagerService,
  Group,
  GroupsManagerService,
  MembersManagerService,
  UsersManagerService,
  Vo,
} from '@perun-web-apps/perun/openapi';
import { StoreService } from '@perun-web-apps/perun/services';
import { UntypedFormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteModule,
} from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import {
  Membership,
  MembershipListComponent,
} from '../../components/membership-list/membership-list.component';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';

@Component({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    CustomTranslatePipe,
    DebounceFilterComponent,
    MatProgressSpinnerModule,
    TranslateModule,
    MembershipListComponent,
    LoaderDirective,
    LoadingTableComponent,
  ],
  standalone: true,
  selector: 'perun-web-apps-groups-page',
  templateUrl: './groups-page.component.html',
  styleUrls: ['./groups-page.component.scss'],
})
export class GroupsPageComponent implements OnInit {
  loading = false;
  initialLoading = false;
  userId: number;
  vos: Vo[] = [];
  myControl = new UntypedFormControl();
  filteredVos: Observable<Vo[]>;

  selection = new SelectionModel<Membership>(false, []);
  displayedColumns = ['id', 'name'];

  userMemberships: Membership[] = [];
  adminMemberships: Membership[] = [];
  userMembershipsTemp: Membership[] = [];
  adminMembershipsTemp: Membership[] = [];
  filterValue = '';
  adminFilterValue = '';

  constructor(
    private usersService: UsersManagerService,
    private memberService: MembersManagerService,
    private groupService: GroupsManagerService,
    private store: StoreService,
    private attributesManagerService: AttributesManagerService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.initialLoading = true;
    this.userId = this.store.getPerunPrincipal().userId;

    this.usersService.getVosWhereUserIsMember(this.userId).subscribe((vos) => {
      this.vos = vos;
      this.filteredVos = this.myControl.valueChanges.pipe(
        startWith(''),
        map((value: string) => this._filter(value)),
      );
      this.getAllGroups();
    });
  }

  getAllGroups(): void {
    this.loading = true;
    this.userMembershipsTemp = [];
    this.adminMembershipsTemp = [];
    const allMemberIds = this.store.getPerunPrincipal().roles['SELF']['Member'];
    // finish when the user has no membership
    if (!allMemberIds?.length) {
      this.loading = false;
      this.initialLoading = false;
      return;
    }
    // One "group source" per membership + one for groups user is an admin
    // remainingGroupSources is tracked to ensure this.addToLists(true) is called exactly once
    let remainingGroupSources = allMemberIds.length + 1;
    allMemberIds.forEach((memberId) => {
      this.groupService.getMemberGroups(memberId).subscribe((groups) => {
        let remainingGroups = groups.length;
        if (remainingGroups === 0) {
          remainingGroupSources--;
          if (remainingGroupSources === 0) this.addToLists(true);
          return;
        }
        groups.forEach((group) => {
          this.attributesManagerService
            .getMemberGroupAttributes(memberId, group.id)
            .subscribe((atts) => {
              this.userMembershipsTemp.push({
                entity: group,
                expirationAttribute: atts.find(
                  (att) => att.friendlyName === 'groupMembershipExpiration',
                ),
              });
              if (--remainingGroups === 0) {
                if (--remainingGroupSources === 0) this.addToLists(true);
              }
            });
        });
      });
    });

    this.usersService.getGroupsWhereUserIsAdmin(this.userId).subscribe((adminGroups) => {
      adminGroups.forEach((group) => {
        this.adminMembershipsTemp.push({
          entity: group,
          expirationAttribute: null,
        });
      });
      if (--remainingGroupSources === 0) this.addToLists(true);
    });
  }

  displayFn(vo?: Vo): string | undefined {
    return vo ? vo.name : null;
  }

  filterByVo(event: MatAutocompleteSelectedEvent): void {
    if (event.option.value === 'all') {
      this.getAllGroups();
    } else {
      this.userMembershipsTemp = [];
      this.adminMembershipsTemp = [];
      this.loading = true;
      const vo: Vo = event.option.value as Vo;
      this.memberService.getMemberByUser(vo.id, this.userId).subscribe((member) => {
        this.groupService.getMemberGroups(member.id).subscribe((groups) => {
          // refresh displayed data for vo where user has no group membership
          if (groups.length === 0) {
            this.addToLists();
          }
          let i = groups.length;
          this.loading = i !== 0;
          groups.forEach((group) => {
            this.attributesManagerService
              .getMemberGroupAttributes(member.id, group.id)
              .subscribe((atts) => {
                i--;
                this.userMembershipsTemp.push({
                  entity: group,
                  expirationAttribute: atts.find(
                    (att) => att.friendlyName === 'groupMembershipExpiration',
                  ),
                });
                this.loading = i !== 0;
                if (!this.loading) this.addToLists();
              });
          });
        });
      });
      this.usersService
        .getGroupsInVoWhereUserIsAdmin(this.userId, vo.id)
        .subscribe((adminGroups) => {
          adminGroups.forEach((group) => {
            this.adminMembershipsTemp.push({
              entity: group,
              expirationAttribute: null,
            });
          });
        });
    }
  }

  extendMembership(membership: Membership): void {
    const registrarUrl = this.store.getProperty('registrar_base_url');
    const group: Group = membership.entity;
    const voShortname = this.vos.find((vo) => vo.id === group.voId).shortName;

    window.open(`${registrarUrl}?vo=${voShortname}&group=${membership.entity.shortName}`);
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
  }

  applyAdminFilter(filterValue: string): void {
    this.adminFilterValue = filterValue;
  }

  private _filter(value: string | Vo): Vo[] {
    const voFilterValue =
      typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase();
    return this.vos.filter((option) => option.name.toLowerCase().includes(voFilterValue));
  }

  private addToLists(disableLoading = false): void {
    this.userMemberships = [...this.userMembershipsTemp];
    this.adminMemberships = [...this.adminMembershipsTemp];
    this.initialLoading = false;
    if (disableLoading) this.loading = false;
  }
}
