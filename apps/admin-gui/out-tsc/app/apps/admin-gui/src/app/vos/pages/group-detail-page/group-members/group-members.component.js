import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MembersService } from '@perun-web-apps/perun/services';
import { Urns } from '@perun-web-apps/perun/urns';
import { AddMemberDialogComponent } from '../../../../shared/components/dialogs/add-member-dialog/add-member-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { RemoveMembersDialogComponent } from '../../../../shared/components/dialogs/remove-members-dialog/remove-members-dialog.component';
import { GroupsManagerService } from '@perun-web-apps/perun/openapi';
import { TABLE_GROUP_MEMBERS, TableConfigService } from '@perun-web-apps/config/table-config';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
let GroupMembersComponent = class GroupMembersComponent {
    constructor(membersService, groupService, route, router, tableConfigService, dialog) {
        this.membersService = membersService;
        this.groupService = groupService;
        this.route = route;
        this.router = router;
        this.tableConfigService = tableConfigService;
        this.dialog = dialog;
        this.members = null;
        this.searchString = '';
        this.firstSearchDone = false;
        this.loading = false;
        this.tableId = TABLE_GROUP_MEMBERS;
        this.attrNames = [
            Urns.MEMBER_DEF_ORGANIZATION,
            Urns.MEMBER_DEF_MAIL,
            Urns.USER_DEF_ORGANIZATION,
            Urns.USER_DEF_PREFERRED_MAIL
        ];
    }
    ngOnInit() {
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
        this.selection = new SelectionModel(true, []);
        this.route.parent.params.subscribe(parentParams => {
            const groupId = parentParams['groupId'];
            this.groupService.getGroupById(groupId).subscribe(group => {
                this.group = group;
            });
        });
    }
    onSearchByString() {
        this.data = 'search';
        this.firstSearchDone = true;
        this.refreshTable();
    }
    onListAll() {
        this.data = 'all';
        this.firstSearchDone = true;
        this.refreshTable();
    }
    onAddMember() {
        const config = getDefaultDialogConfig();
        config.width = '1000px';
        config.data = {
            voId: this.group.voId,
            group: this.group,
            entityId: this.group.id,
            theme: 'group-theme',
            type: 'group',
        };
        const dialogRef = this.dialog.open(AddMemberDialogComponent, config);
        dialogRef.afterClosed().subscribe(() => {
            if (this.firstSearchDone) {
                this.refreshTable();
            }
        });
    }
    onKeyInput(event) {
        if (event.key === 'Enter' && this.searchString.length > 0) {
            this.onSearchByString();
        }
    }
    onRemoveMembers() {
        const config = getDefaultDialogConfig();
        config.width = '450px';
        config.data = {
            groupId: this.group.id,
            members: this.selection.selected
        };
        const dialogRef = this.dialog.open(RemoveMembersDialogComponent, config);
        dialogRef.afterClosed().subscribe(wereMembersDeleted => {
            if (wereMembersDeleted) {
                this.refreshTable();
            }
        });
    }
    refreshTable() {
        this.loading = true;
        this.selection.clear();
        switch (this.data) {
            case 'all': {
                this.membersService.getCompleteRichMembersForGroup(this.group.id, this.attrNames).subscribe(members => {
                    this.members = members;
                    this.loading = false;
                }, () => this.loading = false);
                break;
            }
            case 'search': {
                this.membersService.findCompleteRichMembersForGroup(this.group.id, this.searchString, this.attrNames).subscribe(members => {
                    this.members = members;
                    this.loading = false;
                }, () => this.loading = false);
                break;
            }
        }
    }
    pageChanged(event) {
        this.pageSize = event.pageSize;
        this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
    }
};
GroupMembersComponent.id = 'GroupMembersComponent';
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], GroupMembersComponent.prototype, "true", void 0);
GroupMembersComponent = __decorate([
    Component({
        selector: 'app-group-members',
        templateUrl: './group-members.component.html',
        styleUrls: ['./group-members.component.scss']
    }),
    __metadata("design:paramtypes", [MembersService,
        GroupsManagerService,
        ActivatedRoute,
        Router,
        TableConfigService,
        MatDialog])
], GroupMembersComponent);
export { GroupMembersComponent };
//# sourceMappingURL=group-members.component.js.map