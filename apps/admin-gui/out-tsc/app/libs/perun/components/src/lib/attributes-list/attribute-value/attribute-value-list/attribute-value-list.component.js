import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { AttributeValueListEditDialogComponent } from './attribute-value-list-edit-dialog/attribute-value-list-edit-dialog.component';
import { AttributeValueListDeleteDialogComponent } from './attribute-value-list-delete-dialog/attribute-value-list-delete-dialog.component';
import { IsVirtualAttributePipe } from '@perun-web-apps/perun/pipes';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
let AttributeValueListComponent = class AttributeValueListComponent {
    constructor(dialog) {
        this.dialog = dialog;
        this.selectable = false;
        this.removable = true;
        this.addOnBlur = true;
        this.dragDisabled = true;
        this.separatorKeysCodes = [ENTER, COMMA];
        this.sendEventToParent = new EventEmitter();
        this.readonly = false;
    }
    ngOnInit() {
        this.removable = !new IsVirtualAttributePipe().transform(this.attribute) && !this.readonly;
        if (this.attribute.value === undefined) {
            this.attribute.value = [];
        }
    }
    _sendEventToParent() {
        this.sendEventToParent.emit();
    }
    add(event) {
        const input = event.input;
        const valueL = event.value;
        if ((valueL || '').trim()) {
            // @ts-ignore
            this.attribute.value.push(valueL.trim());
        }
        if (input) {
            input.value = '';
        }
        this.sendEventToParent.emit();
    }
    remove(chip) {
        const config = getDefaultDialogConfig();
        config.width = '400px';
        config.data = { name: chip };
        const dialogRef = this.dialog.open(AttributeValueListDeleteDialogComponent, config);
        dialogRef.afterClosed().subscribe((success) => {
            if (success) {
                //@ts-ignore
                const index = this.attribute.value.indexOf(chip);
                // @ts-ignore
                this.attribute.value.splice(index, 1);
                this.sendEventToParent.emit();
            }
        });
    }
    drop(event) {
        this.dragDisabled = true;
        // @ts-ignore
        moveItemInArray(this.attribute.value, event.previousIndex, event.currentIndex);
    }
    edit(chip) {
        // @ts-ignore
        const index = this.attribute.value.indexOf(chip);
        const config = getDefaultDialogConfig();
        config.width = '600px';
        config.data = { attribute: this.attribute, index: index };
        const dialogRef = this.dialog.open(AttributeValueListEditDialogComponent, config);
        dialogRef.afterClosed().subscribe((success) => {
            if (success) {
                this.sendEventToParent.emit();
            }
        });
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], AttributeValueListComponent.prototype, "attribute", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], AttributeValueListComponent.prototype, "sendEventToParent", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], AttributeValueListComponent.prototype, "readonly", void 0);
AttributeValueListComponent = __decorate([
    Component({
        selector: 'perun-web-apps-attribute-value-list',
        templateUrl: './attribute-value-list.component.html',
        styleUrls: ['./attribute-value-list.component.scss']
    }),
    __metadata("design:paramtypes", [MatDialog])
], AttributeValueListComponent);
export { AttributeValueListComponent };
//# sourceMappingURL=attribute-value-list.component.js.map