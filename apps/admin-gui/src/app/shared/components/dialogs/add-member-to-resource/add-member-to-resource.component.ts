import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificatorService } from '@perun-web-apps/perun/services';
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
  selector: 'app-add-member-to-resource',
  templateUrl: './add-member-to-resource.component.html',
  styleUrls: ['./add-member-to-resource.component.scss']
})
export class AddMemberToResourceComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<AddMemberToResourceComponent>,
              @Inject(MAT_DIALOG_DATA) private data: AddMemberToResourceDialogData,
              private resourceManager: ResourcesManagerService,
              private groupManager: GroupsManagerService,
              private notificator: NotificatorService,
              private translate: TranslateService) {
  }

  theme: string;
  membersGroupsId: Set<number> = new Set<number>();

  facilityCtrl: FormControl = new FormControl();

  filteredFacilities: Observable<String[]>;
  facilitiesNames: String[] = [];

  filteredResources:  Observable<RichResource[]>;
  resources: RichResource[] = [];
  selectedResource: RichResource = null;

  services: Service[] = [];
  description = "";

  groups: Group[] = [];
  selectedGroups =  new SelectionModel<Group>(false, []);


  ngOnInit(): void {
    this.theme = this.data.theme;

    this.resourceManager.getRichResources(this.data.voId).subscribe(resources => {
      this.resources = resources;
      this.getResourceFacilities();
    });
  }

  getResourceFacilities(){
    const distinctFacilities = new Set<String>();
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

  filterFacilities(value: string): String[] {
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
    this.selectedResource = resource;

    this.resourceManager.getAssignedServicesToResource(this.selectedResource.id).subscribe(services => {
      this.services = services;
    });
    this.description = this.selectedResource.description;
  }

  loadGroups(){
    this.resourceManager.getAssignedGroups(this.selectedResource.id).subscribe(groups =>{
      this.groups = groups;
    });

    this.groupManager.getAllMemberGroups(this.data.memberId).subscribe( groups => {
      this.membersGroupsId = new Set<number>(groups.map(group => group.id));
    });
  }

  onFinish(){
    const groupId = this.selectedGroups.selected[0].id;

    this.groupManager.addMembers(groupId, [this.data.memberId]).subscribe(() => {
      this.notificator.showSuccess(this.translate.instant('DIALOGS.ADD_MEMBER_TO_RESOURCE.SUCCESS'));
      this.dialogRef.close(true);
    });
  }

  onCancel(){
    this.dialogRef.close(false);
  }

}
