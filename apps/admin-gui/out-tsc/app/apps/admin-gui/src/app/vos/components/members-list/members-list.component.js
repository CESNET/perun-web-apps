import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { getDefaultDialogConfig, parseEmail, parseFullName, TABLE_ITEMS_COUNT_OPTIONS } from '@perun-web-apps/perun/utils';
import { ChangeMemberStatusDialogComponent } from '../../../shared/components/dialogs/change-member-status-dialog/change-member-status-dialog.component';
let MembersListComponent = class MembersListComponent {
    constructor(dialog) {
        this.dialog = dialog;
        this.hideColumns = [];
        this.pageSize = 10;
        this.page = new EventEmitter();
        this.updateTable = new EventEmitter();
        this.exporting = false;
        this.displayedColumns = ['checkbox', 'id', 'fullName', 'status', 'groupStatus', 'email'];
        this.pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
    }
    set matSort(ms) {
        this.sort = ms;
        this.setDataSource();
    }
    setDataSource() {
        this.displayedColumns = this.displayedColumns.filter(x => !this.hideColumns.includes(x));
        if (!!this.dataSource) {
            this.dataSource.sort = this.sort;
            this.dataSource.sortingDataAccessor = (richMember, property) => {
                switch (property) {
                    case 'fullName':
                        return parseFullName(richMember.user);
                    case 'email':
                        return parseEmail(richMember);
                    default:
                        return richMember[property];
                }
            };
            this.dataSource.paginator = this.paginator;
        }
    }
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }
    ngOnChanges(changes) {
        this.displayedColumns = this.displayedColumns.filter(x => !this.hideColumns.includes(x));
        this.dataSource = new MatTableDataSource(this.members);
        this.setDataSource();
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
    }
    checkboxLabel(row) {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
    }
    changeStatus(event, member) {
        event.stopPropagation();
        if (member.status === 'INVALID') {
            const config = getDefaultDialogConfig();
            config.width = '500px';
            config.data = { member: member };
            const dialogRef = this.dialog.open(ChangeMemberStatusDialogComponent, config);
            dialogRef.afterClosed().subscribe(success => {
                if (success) {
                    this.updateTable.emit(true);
                }
            });
        }
    }
    pageChanged(event) {
        this.page.emit(event);
    }
};
__decorate([
    ViewChild(MatSort, { static: true }),
    __metadata("design:type", MatSort),
    __metadata("design:paramtypes", [MatSort])
], MembersListComponent.prototype, "matSort", null);
__decorate([
    ViewChild(MatPaginator),
    __metadata("design:type", MatPaginator)
], MembersListComponent.prototype, "paginator", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], MembersListComponent.prototype, "members", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], MembersListComponent.prototype, "searchString", void 0);
__decorate([
    Input(),
    __metadata("design:type", SelectionModel)
], MembersListComponent.prototype, "selection", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], MembersListComponent.prototype, "hideColumns", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], MembersListComponent.prototype, "pageSize", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], MembersListComponent.prototype, "page", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], MembersListComponent.prototype, "updateTable", void 0);
MembersListComponent = __decorate([
    Component({
        selector: 'app-members-list',
        templateUrl: './members-list.component.html',
        styleUrls: ['./members-list.component.scss']
    }),
    __metadata("design:paramtypes", [MatDialog])
], MembersListComponent);
export { MembersListComponent };
//# sourceMappingURL=members-list.component.js.map