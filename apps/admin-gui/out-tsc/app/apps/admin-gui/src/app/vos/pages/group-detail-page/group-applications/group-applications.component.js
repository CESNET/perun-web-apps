import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupsManagerService, RegistrarManagerService } from '@perun-web-apps/perun/openapi';
import { TABLE_GROUP_APPLICATIONS_DETAILED, TABLE_GROUP_APPLICATIONS_NORMAL, TableConfigService } from '@perun-web-apps/config/table-config';
let GroupApplicationsComponent = class GroupApplicationsComponent {
    constructor(groupService, registrarManager, tableConfigService, route) {
        this.groupService = groupService;
        this.registrarManager = registrarManager;
        this.tableConfigService = tableConfigService;
        this.route = route;
        this.state = 'pending';
        this.loading = false;
        this.applications = [];
        this.displayedColumns = ['id', 'createdAt', 'type', 'state', 'user', 'extSourceLoa', 'modifiedBy'];
        this.filterValue = '';
        this.showAllDetails = false;
        this.detailTableId = TABLE_GROUP_APPLICATIONS_DETAILED;
        this.tableId = TABLE_GROUP_APPLICATIONS_NORMAL;
    }
    ngOnInit() {
        this.detailPageSize = this.tableConfigService.getTablePageSize(this.detailTableId);
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
        this.loading = true;
        this.route.parent.params.subscribe(parentParams => {
            const groupId = parentParams['groupId'];
            this.groupService.getGroupById(groupId).subscribe(group => {
                this.group = group;
                this.setData(['NEW', 'VERIFIED']);
            });
        });
    }
    setData(state) {
        this.registrarManager.getApplicationsForGroup(this.group.id, state).subscribe(applications => {
            this.applications = applications;
            this.loading = false;
        });
    }
    select() {
        this.loading = true;
        switch (this.state) {
            case 'approved': {
                this.setData(['APPROVED']);
                break;
            }
            case 'rejected': {
                this.setData(['REJECTED']);
                break;
            }
            case 'wfmv': {
                this.setData(['NEW']);
                break;
            }
            case 'submited': {
                this.setData(['VERIFIED']);
                break;
            }
            case 'pending': {
                this.setData(['NEW', 'VERIFIED']);
                break;
            }
            case 'all': {
                this.registrarManager.getApplicationsForGroup(this.group.id).subscribe(applications => {
                    this.applications = applications;
                    this.loading = false;
                });
                break;
            }
            default: {
                break;
            }
        }
    }
    applyFilter(filterValue) {
        this.filterValue = filterValue;
    }
    detailPageChanged(event) {
        this.detailPageSize = event.pageSize;
        this.tableConfigService.setTablePageSize(this.detailTableId, event.pageSize);
    }
    pageChanged(event) {
        this.pageSize = event.pageSize;
        this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
    }
};
GroupApplicationsComponent.id = 'GroupApplicationsComponent';
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], GroupApplicationsComponent.prototype, "true", void 0);
GroupApplicationsComponent = __decorate([
    Component({
        selector: 'app-group-applications',
        templateUrl: './group-applications.component.html',
        styleUrls: ['./group-applications.component.scss']
    }),
    __metadata("design:paramtypes", [GroupsManagerService,
        RegistrarManagerService,
        TableConfigService,
        ActivatedRoute])
], GroupApplicationsComponent);
export { GroupApplicationsComponent };
//# sourceMappingURL=group-applications.component.js.map