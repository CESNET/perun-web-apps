import { __decorate, __metadata } from "tslib";
import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
let StateTabComponent = class StateTabComponent {
    constructor() {
        this.propagation = [];
        this.datasources = [];
        this.displayedColumns = ['id', 'service', 'status', 'scheduled', 'started', 'ended'];
    }
    ngOnInit() {
        this.getDataSource();
    }
    getErrorCountStates(resourceStatus) {
        let counter = 0;
        for (const task of resourceStatus.taskList) {
            if (task.status === 'ERROR' || task.status === 'GENERROR' || task.status === 'SENDERROR') {
                counter++;
            }
        }
        return counter;
    }
    getDataSource() {
        for (const resourceState of this.propagation) {
            this.datasources.push(new MatTableDataSource(resourceState.taskList));
        }
    }
};
__decorate([
    Input(),
    __metadata("design:type", Array)
], StateTabComponent.prototype, "propagation", void 0);
StateTabComponent = __decorate([
    Component({
        selector: 'app-state-tab',
        templateUrl: './state-tab.component.html',
        styleUrls: ['./state-tab.component.scss']
    }),
    __metadata("design:paramtypes", [])
], StateTabComponent);
export { StateTabComponent };
//# sourceMappingURL=state-tab.component.js.map