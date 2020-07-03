import { Component, OnInit } from '@angular/core';
import { Member, MembersManagerService, ResourcesManagerService, RichResource } from '@perun-web-apps/perun/openapi';
import { MatDialog} from '@angular/material/dialog';
import {
  TABLE_MEMBER_RESOURCE_LIST,
  TableConfigService } from '@perun-web-apps/config/table-config';
import { ActivatedRoute } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { AddMemberToResourceComponent } from '../../../../shared/components/dialogs/add-member-to-resource/add-member-to-resource.component';

@Component({
  selector: 'app-member-resources',
  templateUrl: './member-resources.component.html',
  styleUrls: ['./member-resources.component.scss']
})
export class MemberResourcesComponent implements OnInit {

  constructor(private dialog: MatDialog,
              private tableConfigService: TableConfigService,
              private memberManager: MembersManagerService,
              private resourceManager: ResourcesManagerService,
              private route: ActivatedRoute) { }


  member: Member;
  resources: RichResource[] = [];

  filterValue: String = "";
  loading = false;
  hideColumns: String[] = ["select"];

  pageSize: number;
  tableId = TABLE_MEMBER_RESOURCE_LIST;

  ngOnInit(): void {
    this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);

    this.route.parent.params.subscribe( parentParams => {
      const memberId = parentParams['memberId'];

      this.memberManager.getMemberById(memberId).subscribe(member => {
        this.member = member;
        this.refreshTable();
      });
    });
  }

  addResource(){
    const config  = getDefaultDialogConfig();
    config.width = '1200px';
    config.data = {
      memberId: this.member.id,
      voId: this.member.voId,
      theme: 'member-theme'
    };

    const dialogRef = this.dialog.open(AddMemberToResourceComponent, config);

    dialogRef.afterClosed().subscribe( result => {
      if(result){
        this.refreshTable();
      }
    });
  }

  refreshTable() {
    this.loading = true;
    this.resourceManager.getAssignedRichResourcesWithMember(this.member.id).subscribe(resources => {
      this.resources = resources;
      this.loading = false;
    });
  }

  applyFilter(filterValue: String){
    this.filterValue = filterValue;
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
  }

}
