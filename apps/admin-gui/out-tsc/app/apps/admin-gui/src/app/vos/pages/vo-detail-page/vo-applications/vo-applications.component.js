import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RegistrarManagerService, VosManagerService } from '@perun-web-apps/perun/openapi';
import { TABLE_VO_APPLICATIONS_DETAILED, TABLE_VO_APPLICATIONS_NORMAL, TableConfigService } from '@perun-web-apps/config/table-config';
let VoApplicationsComponent = class VoApplicationsComponent {
    constructor(voService, registrarManager, tableConfigService, route) {
        this.voService = voService;
        this.registrarManager = registrarManager;
        this.tableConfigService = tableConfigService;
        this.route = route;
        this.state = 'pending';
        this.loading = false;
        this.applications = [];
        this.displayedColumns = ['id', 'createdAt', 'type', 'state', 'user', 'extSourceLoa', 'group', 'modifiedBy'];
        this.filterValue = '';
        this.showAllDetails = false;
        this.detailTableId = TABLE_VO_APPLICATIONS_DETAILED;
        this.tableId = TABLE_VO_APPLICATIONS_NORMAL;
    }
    ngOnInit() {
        this.detailPageSize = this.tableConfigService.getTablePageSize(this.detailTableId);
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
        this.loading = true;
        this.route.parent.params.subscribe(parentParams => {
            const voId = parentParams['voId'];
            this.voService.getVoById(voId).subscribe(vo => {
                this.vo = vo;
                this.setData(['NEW', 'VERIFIED']);
            });
        });
    }
    setData(state) {
        this.registrarManager.getApplicationsForVo(this.vo.id, state).subscribe(applications => {
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
                this.registrarManager.getApplicationsForVo(this.vo.id).subscribe(applications => {
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
VoApplicationsComponent.id = 'VoApplicationsComponent';
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], VoApplicationsComponent.prototype, "true", void 0);
VoApplicationsComponent = __decorate([
    Component({
        selector: 'app-vo-applications',
        templateUrl: './vo-applications.component.html',
        styleUrls: ['./vo-applications.component.scss']
    }),
    __metadata("design:paramtypes", [VosManagerService,
        RegistrarManagerService,
        TableConfigService,
        ActivatedRoute])
], VoApplicationsComponent);
export { VoApplicationsComponent };
//# sourceMappingURL=vo-applications.component.js.map