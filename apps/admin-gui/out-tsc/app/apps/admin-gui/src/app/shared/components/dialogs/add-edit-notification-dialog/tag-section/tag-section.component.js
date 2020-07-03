import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
let TagSectionComponent = class TagSectionComponent {
    constructor() {
        this.tags = [];
        this.addedTag = new EventEmitter();
    }
    ngOnChanges(changes) {
    }
    addTag(tag) {
        this.addedTag.emit(tag);
    }
};
__decorate([
    Input(),
    __metadata("design:type", Array)
], TagSectionComponent.prototype, "tags", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], TagSectionComponent.prototype, "addedTag", void 0);
TagSectionComponent = __decorate([
    Component({
        selector: 'app-tag-section',
        templateUrl: './tag-section.component.html',
        styleUrls: ['./tag-section.component.scss']
    }),
    __metadata("design:paramtypes", [])
], TagSectionComponent);
export { TagSectionComponent };
//# sourceMappingURL=tag-section.component.js.map