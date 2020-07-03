import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { MembersManagerService, ResourcesManagerService } from '@perun-web-apps/perun/openapi';
import { MatDialog } from '@angular/material/dialog';
import { TABLE_MEMBER_RESOURCE_LIST, TableConfigService } from '@perun-web-apps/config/table-config';
import { ActivatedRoute } from '@angular/router';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { AddMemberToResourceComponent } from '../../../../shared/components/dialogs/add-member-to-resource/add-member-to-resource.component';
let MemberResourcesComponent = class MemberResourcesComponent {
    constructor(dialog, tableConfigService, memberManager, resourceManager, route) {
        this.dialog = dialog;
        this.tableConfigService = tableConfigService;
        this.memberManager = memberManager;
        this.resourceManager = resourceManager;
        this.route = route;
        this.resources = [];
        this.filterValue = "";
        this.loading = false;
        this.hideColumns = ["select"];
        this.tableId = TABLE_MEMBER_RESOURCE_LIST;
    }
    ngOnInit() {
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
        this.route.parent.params.subscribe(parentParams => {
            const memberId = parentParams['memberId'];
            this.memberManager.getMemberById(memberId).subscribe(member => {
                this.member = member;
                this.refreshTable();
            });
        });
    }
    addResource() {
        const config = getDefaultDialogConfig();
        config.width = '1200px';
        config.data = {
            memberId: this.member.id,
            voId: this.member.voId,
            theme: 'member-theme'
        };
        const dialogRef = this.dialog.open(AddMemberToResourceComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
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
    applyFilter(filterValue) {
        this.filterValue = filterValue;
    }
    pageChanged(event) {
        this.pageSize = event.pageSize;
        this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
    }
};
MemberResourcesComponent = __decorate([
    Component({
        selector: 'app-member-resources',
        templateUrl: './member-resources.component.html',
        styleUrls: ['./member-resources.component.scss']
    }),
    __metadata("design:paramtypes", [MatDialog,
        TableConfigService,
        MembersManagerService,
        ResourcesManagerService,
        ActivatedRoute])
], MemberResourcesComponent);
export { MemberResourcesComponent };
//# sourceMappingURL=member-resources.component.js.map