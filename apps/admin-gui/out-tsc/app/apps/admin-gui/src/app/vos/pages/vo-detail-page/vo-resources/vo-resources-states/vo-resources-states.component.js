import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomIconService } from '@perun-web-apps/perun/services';
import { TasksManagerService } from '@perun-web-apps/perun/openapi';
let VoResourcesStatesComponent = class VoResourcesStatesComponent {
    constructor(route, taskService, customIconService) {
        this.route = route;
        this.taskService = taskService;
        this.customIconService = customIconService;
        this.loading = false;
        this.resourceStates = [];
        this.selectedIndex = 0;
    }
    ngOnInit() {
        this.customIconService.registerPerunRefreshIcon();
        this.loading = true;
        this.route.parent.parent.params.subscribe(parentParams => {
            this.voId = parentParams['voId'];
            this.refreshTable();
        });
    }
    refreshTable() {
        console.log(this.selectedIndex);
        this.loading = true;
        this.taskService.getAllResourcesState(this.voId).subscribe(resourceStates => {
            this.resourceStates = resourceStates;
            this.okPropagation = [];
            this.errorPropagation = [];
            for (const resourceState of resourceStates) {
                let indicator = true;
                for (const task of resourceState.taskList) {
                    if (task.status === 'ERROR' || task.status === 'GENERROR' || task.status === 'SENDERROR') {
                        indicator = false;
                        break;
                    }
                }
                if (indicator) {
                    this.okPropagation.push(resourceState);
                }
                else {
                    this.errorPropagation.push(resourceState);
                }
            }
            this.loading = false;
        });
    }
};
VoResourcesStatesComponent.id = 'VoResourcesStatesComponent';
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], VoResourcesStatesComponent.prototype, "true", void 0);
VoResourcesStatesComponent = __decorate([
    Component({
        selector: 'app-vo-resources-states',
        templateUrl: './vo-resources-states.component.html',
        styleUrls: ['./vo-resources-states.component.scss']
    }),
    __metadata("design:paramtypes", [ActivatedRoute,
        TasksManagerService,
        CustomIconService])
], VoResourcesStatesComponent);
export { VoResourcesStatesComponent };
//# sourceMappingURL=vo-resources-states.component.js.map