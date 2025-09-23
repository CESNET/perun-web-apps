import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { AttributesListComponent, DebounceFilterComponent } from '@perun-web-apps/perun/components';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  Attribute,
  AttributesManagerService,
  FacilitiesManagerService,
  Facility,
  MembersManagerService,
  User,
  UsersManagerService,
  Vo,
} from '@perun-web-apps/perun/openapi';
import { StoreService } from '@perun-web-apps/perun/services';
import { UserFullNamePipe, CustomTranslatePipe } from '@perun-web-apps/perun/pipes';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [
    CommonModule,
    CustomTranslatePipe,
    DebounceFilterComponent,
    MatExpansionModule,
    MatProgressSpinnerModule,
    TranslateModule,
    AttributesListComponent,
    LoaderDirective,
    LoadingTableComponent,
    MatSlideToggle,
    FormsModule,
  ],
  standalone: true,
  selector: 'perun-web-apps-privacy-page',
  templateUrl: './privacy-page.component.html',
  styleUrls: ['./privacy-page.component.scss'],
})
export class PrivacyPageComponent implements OnInit {
  vos: Vo[] = [];
  facilities: Facility[] = [];
  userId: number;
  user: User;
  attributes: Attribute[] = [];
  username = '';
  hiddenColumns = ['select', 'id'];
  outerLoading: boolean;
  innerLoading: boolean;
  filteredVos: Vo[] = [];
  filteredFacilities: Facility[] = [];
  filterEmptyVo: boolean = true;
  filterEmptyFacility: boolean = true;

  constructor(
    private usersManagerService: UsersManagerService,
    private membersService: MembersManagerService,
    private facilitiesService: FacilitiesManagerService,
    private attributesManagerService: AttributesManagerService,
    private storage: StoreService,
  ) {}

  ngOnInit(): void {
    this.outerLoading = true;
    this.userId = this.storage.getPerunPrincipal().userId;
    this.usersManagerService.getVosWhereUserIsMember(this.userId).subscribe((vos) => {
      this.vos = vos;
      this.filteredVos = vos;
      this.facilitiesService.getAssignedFacilitiesByUser(this.userId).subscribe((facilities) => {
        this.facilities = facilities;
        this.filteredFacilities = facilities;
        this.outerLoading = false;
      });
    });
  }

  getUserData(): void {
    this.innerLoading = true;
    this.attributes = [];
    this.usersManagerService.getUserById(this.userId).subscribe((user) => {
      this.user = user;
      this.username = new UserFullNamePipe().transform(user);
      this.attributesManagerService.getUserAttributes(user.id).subscribe((attributes) => {
        this.attributes = attributes;
        this.innerLoading = false;
      });
    });
  }

  getMemberData(vo: Vo): void {
    this.innerLoading = true;
    this.attributes = [];
    this.membersService.getMemberByUser(vo.id, this.userId).subscribe((member) => {
      this.membersService.getRichMemberWithAttributes(member.id).subscribe((richMember) => {
        this.attributes = richMember.memberAttributes;
        this.innerLoading = false;
      });
    });
  }

  getUserFacilityData(facility: Facility): void {
    this.innerLoading = true;
    this.attributes = [];
    this.attributesManagerService
      .getUserFacilityAttributes(this.userId, facility.id)
      .subscribe((attrs) => {
        this.attributes = attrs;
        this.innerLoading = false;
      });
  }

  applyFilterVo(filter: string): void {
    this.filteredVos = this.vos.filter((res) =>
      res.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }

  applyFilterFacility(filter: string): void {
    this.filteredFacilities = this.facilities.filter((res) =>
      res.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }
}
