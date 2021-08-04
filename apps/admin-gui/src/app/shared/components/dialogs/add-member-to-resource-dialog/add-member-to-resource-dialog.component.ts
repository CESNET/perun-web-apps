import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GuiAuthResolver, NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import {
  Group, GroupsManagerService,
  ResourcesManagerService,
  RichResource, Service
} from '@perun-web-apps/perun/openapi';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';

export interface AddMemberToResourceDialogData {
  memberId: number;
  voId: number;
  theme: string;
}

@Component({
  selector: 'app-add-member-to-resource-dialog',
  templateUrl: './add-member-to-resource-dialog.component.html',
  styleUrls: ['./add-member-to-resource-dialog.component.scss']
})
export class AddMemberToResourceDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<AddMemberToResourceDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private data: AddMemberToResourceDialogData,
              private resourceManager: ResourcesManagerService,
              private groupManager: GroupsManagerService,
              private notificator: NotificatorService,
              private translate: TranslateService,
              private authResolver: GuiAuthResolver) {
  }

  theme: string;
  loading = false;
  processing = false;
  membersGroupsId: Set<number> = new Set<number>();

  facilityCtrl: FormControl = new FormControl();

  filteredFacilities: Observable<string[]>;
  facilitiesNames: string[] = [];

  filteredResources:  Observable<RichResource[]>;
  resources: RichResource[] = [];
  selectedResource: RichResource = null;

  services: Service[] = [];
  description = "";

  groups: Group[] = [];
  selectedGroups =  new SelectionModel<Group>(false, []);


  ngOnInit(): void {
    this.loading = true;
    this.theme = this.data.theme;

    this.resourceManager.getRichResources(this.data.voId).subscribe(resources => {
      this.resources = resources;
      this.getResourceFacilities();
      this.loading = false;
    }, () => this.loading = false);
  }

  getResourceFacilities(){
    const distinctFacilities = new Set<string>();
    for(const resource of this.resources){
      distinctFacilities.add(resource.facility.name);
    }

    this.facilitiesNames = Array.from(distinctFacilities);

    this.filteredFacilities = this.facilityCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterFacilities(value))
    );

    this.filteredResources = this.facilityCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterResources(value))
    );
  }

  filterFacilities(value: string): string[] {
    const filterValue = value.toLowerCase();
    const filtered = this.facilitiesNames.filter(option => option.toLowerCase().indexOf(filterValue) >=0);
    return filtered.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  }

  filterResources(value: string): RichResource[]{
    if(value == null){
      return this.resources;
    }

    const filterValue = value.toLowerCase();
    const filtered = this.resources.filter(option => option.facility.name.toLowerCase().indexOf(filterValue) === 0);
    return filtered.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  }

  setResource(resource: RichResource){
    this.processing = true;
    this.selectedResource = resource;

    this.resourceManager.getAssignedServicesToResource(this.selectedResource.id).subscribe(services => {
      this.services = services;
      this.processing = false;
    }, () => this.processing = false);
    this.description = this.selectedResource.description;
  }

  loadGroups(){
    this.processing = true;
    this.resourceManager.getAssignedGroups(this.selectedResource.id).subscribe(assignedGroups =>{
      this.groups = assignedGroups;

      this.groupManager.getAllMemberGroups(this.data.memberId).subscribe( memberGroups => {
        this.membersGroupsId = new Set<number>(memberGroups.map(group => group.id));

        this.groups.forEach(grp => {
          if (!this.authResolver.isAuthorized('addMember_Group_Member_policy', [grp])) {
            this.membersGroupsId.add(grp.id);
          }
        });
        this.processing = false;
      }, () => this.processing = false);
    });
  }

  onFinish(){
    this.processing = true;
    const groupId = this.selectedGroups.selected[0].id;

    this.groupManager.addMembers(groupId, [this.data.memberId]).subscribe(() => {
      this.notificator.showSuccess(this.translate.instant('DIALOGS.ADD_MEMBER_TO_RESOURCE.SUCCESS'));
      this.dialogRef.close(true);
    }, () => this.processing = false);
  }

  onCancel(){
    this.dialogRef.close(false);
  }

}
