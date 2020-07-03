import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTableExporterDirective } from 'mat-table-exporter';
let TableOptionsComponent = class TableOptionsComponent {
    constructor() {
        this.exportStart = new EventEmitter();
        this.exportEnd = new EventEmitter();
    }
    ngOnInit() {
        this.exporter.exportStarted.subscribe(() => { this.exportStart.emit(); });
        this.exporter.exportCompleted.subscribe(() => this.exportEnd.emit());
    }
};
__decorate([
    Input(),
    __metadata("design:type", MatTableExporterDirective)
], TableOptionsComponent.prototype, "exporter", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], TableOptionsComponent.prototype, "exportStart", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], TableOptionsComponent.prototype, "exportEnd", void 0);
TableOptionsComponent = __decorate([
    Component({
        selector: 'perun-web-apps-table-options',
        templateUrl: './table-options.component.html',
        styleUrls: ['./table-options.component.scss']
    }),
    __metadata("design:paramtypes", [])
], TableOptionsComponent);
export { TableOptionsComponent };
//# sourceMappingURL=table-options.component.js.map