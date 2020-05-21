import { Component, OnInit } from '@angular/core';
import {
  AttributesManagerService,
  Group,
  GroupsManagerService,
  MembersManagerService,
  UsersManagerService, Vo, VosManagerService
} from '@perun-web-apps/perun/openapi';
import { StoreService } from '@perun-web-apps/perun/services';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { Membership } from '../../components/membership-list/membership-list.component';

@Component({
  selector: 'perun-web-apps-groups-page',
  templateUrl: './groups-page.component.html',
  styleUrls: ['./groups-page.component.scss']
})
export class GroupsPageComponent implements OnInit {

  loading = false;
  userId: number;
  vos: Vo[] = [];
  myControl = new FormControl;
  filteredVos: Observable<Vo[]>;

  selection = new SelectionModel<Membership>(false, []);
  displayedColumns = ['checkbox','id', 'name'];

  userMemberships: Membership[] = [];
  adminMemberships: Membership[] = [];

  constructor(private usersService: UsersManagerService,
              private memberService: MembersManagerService,
              private groupService: GroupsManagerService,
              private store: StoreService,
              private vosManagerService: VosManagerService,
              private attributesManagerService: AttributesManagerService
  ) {
  }

  ngOnInit() {
    this.loading = true;
    this.userId = this.store.getPerunPrincipal().userId;
    console.log(this.store.getPerunPrincipal());

    this.usersService.getVosWhereUserIsMember(this.userId).subscribe(vos => {
      this.vos = vos;
      this.filteredVos = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
      this.getAllGroups();
    });
  }

  private _filter(value: string | Vo): Vo[] {
    const filterValue = typeof (value) === 'string' ? value.toLowerCase() : value.name.toLowerCase;
    return this.vos.filter(option => option.name.toLowerCase().includes(<string>filterValue));
  }

  getAllGroups() {
    this.loading = true;
    let i = this.vos.length;
    this.userMemberships = [];
    this.adminMemberships = [];
    const allMemberIds = this.store.getPerunPrincipal().roles['SELF']['Member'];
    allMemberIds.forEach(memberId =>{
      this.groupService.getMemberGroups(memberId).subscribe(groups => {
        i--;
        let j = groups.length;
        groups.forEach(group =>{
          this.attributesManagerService.getMemberGroupAttributes(memberId, group.id).subscribe(atts =>{
            j--;
            this.userMemberships.push({
              entity: group,
              expirationAttribute: atts.find(att => att.friendlyName === 'groupMembershipExpiration')
            });
            // console.log(`${i} ${j}`);
            this.loading = i !==0 || j !== 0;
          });
        });
      });
    });

    this.usersService.getGroupsWhereUserIsAdmin(this.userId).subscribe(adminGroups => {
      adminGroups.forEach(group =>{
        this.adminMemberships.push({
          entity: group,
          expirationAttribute: null
        })
      });
    });
  }

  displayFn(vo?: Vo): string | undefined {
    return vo ? vo.name : null;
  }


  filterByVo(event: MatAutocompleteSelectedEvent) {
    if (event.option.value === 'all') {
      this.getAllGroups();
    } else {
      this.userMemberships = [];
      this.adminMemberships = [];
      this.loading = true;
      const vo: Vo = event.option.value;
      this.memberService.getMembers(vo.id).subscribe(members =>{
        const member = members.find(mem => mem.userId === this.userId);
        if(!member){
          this.loading = false;
          return
        }
        this.groupService.getMemberGroups(member.id).subscribe(groups =>{
          let i = groups.length;
          groups.forEach(group =>{
            this.attributesManagerService.getMemberGroupAttributes(member.id, group.id).subscribe(atts =>{
              i--;
              this.userMemberships.push({
                entity: group,
                expirationAttribute: atts.find(att => att.friendlyName === 'groupMembershipExpiration')
              });
              this.loading = i !== 0;
            });
          });
        })
      });
      //TODO Here should be overload that uses 2 parameters
      this.usersService.getGroupsWhereUserIsAdmin(this.userId).subscribe(adminGroups => {
        adminGroups.forEach(group =>{
          this.adminMemberships.push({
            entity: group,
            expirationAttribute: null
          })
        });
      });
    }
  }

  extendMembership() {
    const registrarUrl = this.store.get('registrar_base_url');
    const group: Group =  this.selection.selected[0].entity;
    const voShortname = this.vos.find(vo => vo.id === group.voId).shortName;
    window.location.href = `${registrarUrl}?vo=${voShortname}&group=${this.selection.selected[0].entity.shortName}`;
  }
}
