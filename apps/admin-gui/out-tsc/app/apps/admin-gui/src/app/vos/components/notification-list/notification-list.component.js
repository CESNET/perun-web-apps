import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { AddEditNotificationDialogComponent } from '../../../shared/components/dialogs/add-edit-notification-dialog/add-edit-notification-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { RegistrarManagerService } from '@perun-web-apps/perun/openapi';
import { getDefaultDialogConfig, TABLE_ITEMS_COUNT_OPTIONS } from '@perun-web-apps/perun/utils';
let NotificationListComponent = class NotificationListComponent {
    constructor(registrarService, translate, notificator, dialog) {
        this.registrarService = registrarService;
        this.translate = translate;
        this.notificator = notificator;
        this.dialog = dialog;
        this.displayedColumns = ['select', 'id', 'mailType', 'appType', 'send'];
        this.selection = new SelectionModel(true, []);
        this.pageSize = 10;
        this.selectionChange = new EventEmitter();
        this.page = new EventEmitter();
        this.pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
    }
    set matSort(ms) {
        this.sort = ms;
        this.setDataSource();
    }
    ngOnChanges() {
        this.dataSource = new MatTableDataSource(this.applicationMails);
        this.setDataSource();
    }
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
        this.selectionChange.emit(this.selection);
    }
    checkboxLabel(row) {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
    }
    changeSending(applicationMail) {
        if (applicationMail.send) {
            this.registrarService.setSendingEnabled({ mails: [applicationMail], enabled: false }).subscribe(() => {
                applicationMail.send = false;
            });
        }
        else {
            this.registrarService.setSendingEnabled({ mails: [applicationMail], enabled: true }).subscribe(() => {
                applicationMail.send = true;
            });
        }
    }
    openApplicationMailDetail(applicationMail) {
        const config = getDefaultDialogConfig();
        config.width = '1400px';
        config.height = '700px';
        config.data = { voId: this.voId, groupId: this.groupId, createMailNotification: false, applicationMail: applicationMail };
        const dialog = this.dialog.open(AddEditNotificationDialogComponent, config);
        dialog.afterClosed().subscribe(success => {
            if (success) {
                this.translate.get('VO_DETAIL.SETTINGS.NOTIFICATIONS.EDIT_SUCCESS').subscribe(text => {
                    this.notificator.showSuccess(text);
                });
                this.selection.clear();
                this.selectionChange.emit(this.selection);
                this.update();
            }
        });
    }
    getMailType(applicationMail) {
        let value = '';
        // @ts-ignore
        if (applicationMail.mailType === undefined || applicationMail.mailType === null || applicationMail.mailType === '') {
            value = '';
        }
        else {
            this.translate.get('VO_DETAIL.SETTINGS.NOTIFICATIONS.MAIL_TYPE_' + applicationMail.mailType).subscribe(text => {
                value = text;
            });
        }
        return value;
    }
    update() {
        if (this.groupId) {
            this.registrarService.getApplicationMailsForGroup(this.groupId).subscribe(mails => {
                this.updateTable(mails);
            });
        }
        else {
            this.registrarService.getApplicationMailsForVo(this.voId).subscribe(mails => {
                this.updateTable(mails);
            });
        }
    }
    toggle(row) {
        this.selection.toggle(row);
        this.selectionChange.emit(this.selection);
    }
    updateTable(mails) {
        this.applicationMails = mails;
        this.dataSource = new MatTableDataSource(this.applicationMails);
        this.setDataSource();
    }
    setDataSource() {
        if (!!this.dataSource) {
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        }
    }
};
__decorate([
    Input(),
    __metadata("design:type", Array)
], NotificationListComponent.prototype, "applicationMails", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], NotificationListComponent.prototype, "voId", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], NotificationListComponent.prototype, "groupId", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], NotificationListComponent.prototype, "selection", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], NotificationListComponent.prototype, "pageSize", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], NotificationListComponent.prototype, "selectionChange", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], NotificationListComponent.prototype, "page", void 0);
__decorate([
    ViewChild(MatSort, { static: true }),
    __metadata("design:type", MatSort),
    __metadata("design:paramtypes", [MatSort])
], NotificationListComponent.prototype, "matSort", null);
__decorate([
    ViewChild(MatPaginator),
    __metadata("design:type", MatPaginator)
], NotificationListComponent.prototype, "paginator", void 0);
NotificationListComponent = __decorate([
    Component({
        selector: 'app-notification-list',
        templateUrl: './notification-list.component.html',
        styleUrls: ['./notification-list.component.scss']
    }),
    __metadata("design:paramtypes", [RegistrarManagerService,
        TranslateService,
        NotificatorService,
        MatDialog])
], NotificationListComponent);
export { NotificationListComponent };
//# sourceMappingURL=notification-list.component.js.map