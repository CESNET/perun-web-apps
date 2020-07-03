import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FacilitiesManagerService } from '@perun-web-apps/perun/openapi';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
let AddHostDialogComponent = class AddHostDialogComponent {
    constructor(dialogRef, data, facilitiesManager, notificator, translate) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.facilitiesManager = facilitiesManager;
        this.notificator = notificator;
        this.translate = translate;
        this.hosts = "";
    }
    ngOnInit() {
        this.theme = this.data.theme;
        this.facilityName = this.data.facilityName;
    }
    onAdd() {
        const hostNames = this.hosts.split("\n");
        let generatedHostNames = [];
        for (const name of hostNames) {
            generatedHostNames = generatedHostNames.concat(this.parseHostName(name));
        }
        this.facilitiesManager.addHosts(this.data.facilityId, generatedHostNames).subscribe(() => {
            this.notificator.showSuccess(this.translate.instant('DIALOGS.ADD_HOST.SUCCESS'));
            this.dialogRef.close(true);
        });
    }
    onCancel() {
        this.dialogRef.close(false);
    }
    parseHostName(name) {
        const rangeRegex = new RegExp('\[[0-9]+-[0-9]+\]', 'g');
        const prefixes = name.split(rangeRegex);
        const suffixes = name.match(rangeRegex);
        if (suffixes == null) {
            if (name === "") {
                return [];
            }
            return [name];
        }
        let nameParts = [];
        for (let i = 0; i < prefixes.length - 1; i++) {
            const [from, to] = this.parseRange(suffixes[i]);
            let parts = [];
            for (let j = from; j <= to; j++) {
                parts = parts.concat(prefixes[i].concat(j.toString()));
            }
            nameParts = nameParts.concat([parts]);
        }
        nameParts = nameParts.concat([prefixes[prefixes.length - 1]]);
        return this.joinHostNames(nameParts, 0);
    }
    parseRange(range) {
        const [lower, upper] = range.split("-");
        const from = parseInt(lower.substring(1, lower.length), 10);
        const to = parseInt(upper.substring(0, upper.length), 10);
        return [from, to];
    }
    joinHostNames(nameParts, position) {
        if (position === nameParts.length - 1) {
            return [nameParts[position]];
        }
        const suffixes = this.joinHostNames(nameParts, position + 1);
        const joinedNames = [];
        for (const name of nameParts[position]) {
            for (const suffix of suffixes) {
                joinedNames.push(name.concat(suffix));
            }
        }
        return joinedNames;
    }
};
AddHostDialogComponent = __decorate([
    Component({
        selector: 'app-add-host-dialog',
        templateUrl: './add-host-dialog.component.html',
        styleUrls: ['./add-host-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, FacilitiesManagerService,
        NotificatorService,
        TranslateService])
], AddHostDialogComponent);
export { AddHostDialogComponent };
//# sourceMappingURL=add-host-dialog.component.js.map