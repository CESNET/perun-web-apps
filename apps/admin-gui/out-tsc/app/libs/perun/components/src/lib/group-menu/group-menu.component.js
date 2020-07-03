import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
let GroupMenuComponent = class GroupMenuComponent {
    constructor() {
        this.disabled = false;
        this.moveGroup = new EventEmitter();
        this.whenClosed = new EventEmitter();
    }
    ngOnInit() {
    }
    onMoveGroup() {
        console.log('Emit menu - ' + this.group);
        this.moveGroup.emit();
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], GroupMenuComponent.prototype, "group", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], GroupMenuComponent.prototype, "disabled", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], GroupMenuComponent.prototype, "moveGroup", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], GroupMenuComponent.prototype, "whenClosed", void 0);
GroupMenuComponent = __decorate([
    Component({
        selector: 'perun-web-apps-group-menu',
        templateUrl: './group-menu.component.html',
        styleUrls: ['./group-menu.component.scss']
    }),
    __metadata("design:paramtypes", [])
], GroupMenuComponent);
export { GroupMenuComponent };
//# sourceMappingURL=group-menu.component.js.map