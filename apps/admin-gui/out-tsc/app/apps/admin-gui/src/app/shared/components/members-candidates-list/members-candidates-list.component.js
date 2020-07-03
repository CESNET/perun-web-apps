import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { getCandidateEmail, getExtSourceNameOrOrganizationColumn, parseUserEmail, parseVo, parseName, TABLE_ITEMS_COUNT_OPTIONS } from '@perun-web-apps/perun/utils';
let MembersCandidatesListComponent = class MembersCandidatesListComponent {
    constructor() {
        this.pageSize = 10;
        this.page = new EventEmitter();
        this.displayedColumns = ['checkbox', 'status', 'fullName', 'voExtSource', 'email', 'logins', 'alreadyMember', 'local'];
        this.exporting = false;
        this.pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
    }
    set matSort(ms) {
        this.sort = ms;
        this.setDataSource();
    }
    setDataSource() {
        if (!!this.dataSource) {
            this.dataSource.sort = this.sort;
            this.dataSource.sortingDataAccessor = (memberCandidate, property) => {
                switch (property) {
                    case 'status':
                        return memberCandidate.member ? memberCandidate.member.status : '';
                    case 'fullName':
                        let name;
                        if (memberCandidate.richUser) {
                            name = parseName(memberCandidate.richUser);
                        }
                        else {
                            name = parseName(memberCandidate.candidate);
                        }
                        return name.toLowerCase();
                    case 'email':
                        if (memberCandidate.richUser || memberCandidate.member) {
                            return parseUserEmail(memberCandidate.richUser);
                        }
                        else {
                            return this.getEmail(memberCandidate);
                        }
                    case 'voExtSource':
                        return memberCandidate.richUser ? parseVo(memberCandidate.richUser) : this.getOrganization(memberCandidate.candidate);
                    case 'logins':
                        return this.getLogins(memberCandidate);
                    case 'alreadyMember':
                        return this.getAlreadyMember(memberCandidate);
                    case 'local':
                        return memberCandidate.richUser ? "Local" : "External identity";
                    default:
                        return memberCandidate[property];
                }
            };
            this.dataSource.paginator = this.paginator;
        }
    }
    ngAfterViewInit() {
        this.setDataSource();
    }
    ngOnChanges(changes) {
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
    getEmail(memberCandidate) {
        let email;
        if (memberCandidate.richUser) {
            for (const attribute of memberCandidate.richUser.userAttributes) {
                if (attribute.namespace + ":" + attribute.friendlyName === 'urn:perun:user:attribute-def:def:preferredMail') {
                    email = attribute;
                    break;
                }
            }
            if (email != null && email.value != null && !('null' === email.value.toString().toLowerCase())) {
                return email.value.toString().replace(",", " ");
            }
            return '';
        }
        else {
            return getCandidateEmail(memberCandidate.candidate);
        }
    }
    getOrganization(candidate) {
        return getExtSourceNameOrOrganizationColumn(candidate);
    }
    /**
     * Gets all logins stored in user attributes
     *
     * @return users logins
     */
    getLogins(memberCandidate) {
        if (memberCandidate.richUser) {
            return this.getLoginsForRichUser(memberCandidate.richUser);
        }
        else {
            let logins = this.getLoginsForCandidate(memberCandidate.candidate);
            if (logins == null || logins === '') {
                logins = memberCandidate.candidate.userExtSource.login;
            }
            return logins;
        }
    }
    getLoginsForRichUser(user) {
        let logins = '';
        for (const userAttribute of user.userAttributes) {
            if (userAttribute.friendlyName.startsWith('login-namespace')) {
                // process only logins which are not null
                if (userAttribute.value != null) {
                    // append comma
                    if (logins.length > 0) {
                        logins += ", ";
                    }
                    // parse login namespace
                    const parsedNamespace = userAttribute.friendlyName.substring(16);
                    logins += parsedNamespace + ": " + userAttribute.value;
                }
            }
        }
        return logins;
    }
    getLoginsForCandidate(candidate) {
        const attributesNamespace = 49;
        let logins = '';
        for (const prop in candidate.attributes) {
            if (candidate.attributes.hasOwnProperty(prop)) {
                if (prop.indexOf('urn:perun:user:attribute-def:def:login-namespace:') !== -1) {
                    if (candidate.attributes[prop] != null) {
                        if (logins.length > 0) {
                            logins += ", ";
                        }
                        // parse login namespace
                        const parsedNamespace = prop.substring(attributesNamespace);
                        logins += parsedNamespace + ": " + candidate.attributes[prop];
                    }
                }
            }
        }
        return logins;
    }
    getAlreadyMember(memberCandidate) {
        if (this.type === 'vo') {
            if (memberCandidate.member != null)
                return 'Member of VO';
        }
        else {
            if (memberCandidate.member != null &&
                memberCandidate.member.sourceGroupId !== 0 &&
                memberCandidate.member.membershipType === 'DIRECT')
                return 'Member of Group';
            if (memberCandidate.member != null &&
                memberCandidate.member.sourceGroupId !== 0 &&
                memberCandidate.member.membershipType === 'INDIRECT')
                return 'Indirect member of Group';
            if (memberCandidate.member != null)
                return 'Member of VO';
        }
        return '';
    }
    isCheckboxDisabled(memberCandidate) {
        if (this.type === 'vo') {
            return memberCandidate.member != null;
        }
        else {
            if (memberCandidate.member) {
                return memberCandidate.member.sourceGroupId !== 0 &&
                    memberCandidate.member.membershipType === 'DIRECT';
            }
        }
        return false;
    }
    pageChanged(event) {
        this.page.emit(event);
    }
};
__decorate([
    ViewChild(MatSort),
    __metadata("design:type", MatSort),
    __metadata("design:paramtypes", [MatSort])
], MembersCandidatesListComponent.prototype, "matSort", null);
__decorate([
    ViewChild(MatPaginator),
    __metadata("design:type", MatPaginator)
], MembersCandidatesListComponent.prototype, "paginator", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], MembersCandidatesListComponent.prototype, "members", void 0);
__decorate([
    Input(),
    __metadata("design:type", SelectionModel)
], MembersCandidatesListComponent.prototype, "selection", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], MembersCandidatesListComponent.prototype, "type", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], MembersCandidatesListComponent.prototype, "pageSize", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], MembersCandidatesListComponent.prototype, "page", void 0);
MembersCandidatesListComponent = __decorate([
    Component({
        selector: 'app-members-candidates-list',
        templateUrl: './members-candidates-list.component.html',
        styleUrls: ['./members-candidates-list.component.scss']
    }),
    __metadata("design:paramtypes", [])
], MembersCandidatesListComponent);
export { MembersCandidatesListComponent };
//# sourceMappingURL=members-candidates-list.component.js.map