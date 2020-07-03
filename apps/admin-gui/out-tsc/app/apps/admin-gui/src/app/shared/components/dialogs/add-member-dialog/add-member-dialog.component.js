import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MembersService } from '@perun-web-apps/perun/services';
import { GroupsManagerService, RegistrarManagerService, VosManagerService } from '@perun-web-apps/perun/openapi';
import { Urns } from '@perun-web-apps/perun/urns';
import { getCandidateEmail } from '@perun-web-apps/perun/utils';
import { TABLE_ADD_MEMBER_CANDIDATES_DIALOG, TableConfigService } from '@perun-web-apps/config/table-config';
let AddMemberDialogComponent = class AddMemberDialogComponent {
    constructor(dialogRef, data, memberService, groupService, voService, registrarManager, translate, notificator, route, tableConfigService, router) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.memberService = memberService;
        this.groupService = groupService;
        this.voService = voService;
        this.registrarManager = registrarManager;
        this.translate = translate;
        this.notificator = notificator;
        this.route = route;
        this.tableConfigService = tableConfigService;
        this.router = router;
        this.searchString = '';
        this.selection = new SelectionModel(false, []);
        this.members = [];
        this.firstSearchDone = false;
        this.tableId = TABLE_ADD_MEMBER_CANDIDATES_DIALOG;
        translate.get('DIALOGS.ADD_MEMBERS.TITLE').subscribe(value => this.title = value);
        translate.get('DIALOGS.ADD_MEMBERS.SUCCESS').subscribe(value => this.successMessage = value);
        translate.get('DIALOGS.ADD_MEMBERS.SUCCESS_INVITE').subscribe(value => this.successInviteMessage = value);
    }
    onCancel() {
        this.dialogRef.close();
    }
    onAdd() {
        this.processing = true;
        // TODO Adds only one member at the time. In the future there would be need to add more
        const selectedMemberCandidate = this.selection.selected[0];
        if (this.data.type === 'vo') {
            if (!!selectedMemberCandidate.richUser) {
                this.addUserToVo(selectedMemberCandidate);
            }
            else {
                this.addCandidateToVo(selectedMemberCandidate);
            }
        }
        else if (this.data.type === 'group') {
            if (!!selectedMemberCandidate.member) {
                this.addMemberToGroup(selectedMemberCandidate);
            }
            else if (!!selectedMemberCandidate.richUser) {
                this.addUserToGroup(selectedMemberCandidate);
            }
            else if (!!selectedMemberCandidate.candidate) {
                this.addCandidateToGroup(selectedMemberCandidate);
            }
        }
    }
    onInvite() {
        // TODO Was not tested properly. Need to be tested on devel.
        if (this.selection.selected[0].richUser) {
            if (this.data.type === 'vo') {
                this.registrarManager.sendInvitationToExistingUser(this.selection.selected[0].richUser.id, this.data.entityId).subscribe(() => {
                    this.onInviteSuccess();
                });
            }
            else if (this.data.type === 'group') {
                this.registrarManager.sendInvitationGroupToExistingUser(this.selection.selected[0].richUser.id, this.data.voId, this.data.group.id).subscribe(() => {
                    this.onInviteSuccess();
                });
            }
        }
        else {
            if (this.data.type === 'vo') {
                this.registrarManager.sendInvitation(
                // TODO allow to choose language
                getCandidateEmail(this.selection.selected[0].candidate), 'en', this.data.voId).subscribe(() => {
                    this.onInviteSuccess();
                });
            }
            else if (this.data.type === 'group') {
                // TODO allow to choose language
                this.registrarManager.sendInvitationForGroup(getCandidateEmail(this.selection.selected[0].candidate), 'en', this.data.voId, this.data.group.id).subscribe(() => {
                    this.onInviteSuccess();
                });
            }
        }
    }
    onSearchByString() {
        this.loading = true;
        this.selection.clear();
        // TODO properly test it on devel when possible.
        if (this.data.type === 'vo') {
            this.voService.getCompleteCandidatesForVo(this.data.entityId, [Urns.USER_DEF_ORGANIZATION, Urns.USER_DEF_PREFERRED_MAIL], this.searchString).subscribe(members => {
                this.members = members;
                this.loading = false;
                this.firstSearchDone = true;
            }, () => this.loading = false);
        }
        else {
            this.voService.getCompleteCandidatesForGroup(this.data.entityId, [Urns.USER_DEF_ORGANIZATION, Urns.USER_DEF_PREFERRED_MAIL], this.searchString).subscribe(members => {
                this.members = members;
                this.loading = false;
                this.firstSearchDone = true;
            }, () => this.loading = false);
        }
    }
    ngOnInit() {
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
        this.theme = this.data.theme;
    }
    addUserToVo(selectedMemberCandidate) {
        this.memberService.createMember(this.data.entityId, selectedMemberCandidate.richUser.id).subscribe(() => {
            this.onAddSuccess();
        }, () => this.onError());
    }
    addCandidateToVo(selectedMemberCandidate) {
        this.memberService.createMemberForCandidate(this.data.entityId, selectedMemberCandidate.candidate).subscribe(() => {
            this.onAddSuccess();
        }, () => this.onError());
    }
    addUserToGroup(selectedMemberCandidate) {
        this.memberService.createMemberWithGroups(this.data.voId, selectedMemberCandidate.richUser.id, [this.data.group]).subscribe(() => {
            this.onAddSuccess();
        }, () => this.onError());
    }
    addMemberToGroup(selectedMemberCandidate) {
        this.groupService.addMembers(this.data.entityId, [selectedMemberCandidate.member.id]).subscribe(() => {
            this.onAddSuccess();
        }, () => this.onError());
    }
    addCandidateToGroup(selectedMemberCandidate) {
        this.memberService.createMemberForCandidateWithGroups(this.data.voId, selectedMemberCandidate.candidate, [this.data.group]).subscribe(() => {
            this.onAddSuccess();
        }, () => this.onError());
    }
    onAddSuccess() {
        this.translate.get('DIALOGS.ADD_MEMBERS.SUCCESS').subscribe(() => {
            this.notificator.showSuccess(this.successMessage);
            this.dialogRef.close();
        });
    }
    onError() {
        this.processing = false;
    }
    onInviteSuccess() {
        this.translate.get('DIALOGS.ADD_MEMBERS.SUCCESS_INVITE').subscribe(() => {
            this.notificator.showSuccess(this.successInviteMessage);
            this.dialogRef.close();
        });
    }
    pageChanged(event) {
        this.pageSize = event.pageSize;
        this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
    }
};
AddMemberDialogComponent = __decorate([
    Component({
        selector: 'app-add-member-dialog',
        templateUrl: './add-member-dialog.component.html',
        styleUrls: ['./add-member-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, MembersService,
        GroupsManagerService,
        VosManagerService,
        RegistrarManagerService,
        TranslateService,
        NotificatorService,
        ActivatedRoute,
        TableConfigService,
        Router])
], AddMemberDialogComponent);
export { AddMemberDialogComponent };
//# sourceMappingURL=add-member-dialog.component.js.map