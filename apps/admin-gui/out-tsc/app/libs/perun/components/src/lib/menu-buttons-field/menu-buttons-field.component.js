import { __decorate, __metadata } from "tslib";
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
let MenuButtonsFieldComponent = class MenuButtonsFieldComponent {
    constructor(dialog, route) {
        this.dialog = dialog;
        this.route = route;
        this.size = 'large';
    }
    ngOnInit() {
        this.route.params.subscribe(params => {
            this.voId = params['voId'];
        });
    }
};
__decorate([
    Input(),
    __metadata("design:type", Array)
], MenuButtonsFieldComponent.prototype, "items", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], MenuButtonsFieldComponent.prototype, "size", void 0);
MenuButtonsFieldComponent = __decorate([
    Component({
        selector: 'perun-web-apps-menu-buttons-field',
        templateUrl: './menu-buttons-field.component.html',
        styleUrls: ['./menu-buttons-field.component.scss']
    }),
    __metadata("design:paramtypes", [MatDialog,
        ActivatedRoute])
], MenuButtonsFieldComponent);
export { MenuButtonsFieldComponent };
//# sourceMappingURL=menu-buttons-field.component.js.map