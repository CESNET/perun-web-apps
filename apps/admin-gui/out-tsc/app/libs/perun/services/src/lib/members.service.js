import { __decorate, __metadata, __param } from "tslib";
import { Inject, Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { PERUN_API_SERVICE } from '@perun-web-apps/perun/tokens';
let MembersService = class MembersService {
    constructor(apiService) {
        this.apiService = apiService;
    }
    getMemberById(memberId, showNotificationOnError = true) {
        return this.apiService.get(`json/membersManager/getMemberById?id=${memberId}`, new HttpParams(), showNotificationOnError);
    }
    findCompleteRichMembers(voId, searchString, attrsNames, allowedStatuses, showNotificationOnError = true) {
        return this.apiService.post('json/membersManager/findCompleteRichMembers', {
            'vo': voId,
            'searchString': searchString,
            'attrsNames': attrsNames,
            'allowedStatuses': allowedStatuses
        }, showNotificationOnError);
    }
    getCompleteRichMembers(voId, attrsNames, allowedStatuses, showNotificationOnError = true) {
        return this.apiService.post(`json/membersManager/getCompleteRichMembers`, {
            'vo': voId,
            'attrsNames': attrsNames,
            'allowedStatuses': allowedStatuses
        }, showNotificationOnError);
    }
    getRichMemberWithAttributes(memberId, showNotificationOnError = true) {
        return this.apiService.get(`json/membersManager/getRichMemberWithAttributes?id=${memberId}`, new HttpParams(), showNotificationOnError);
    }
    findCompleteRichMembersForGroup(groupId, searchString, attrsNames, showNotificationOnError = true) {
        return this.apiService.post('json/membersManager/findCompleteRichMembers', {
            'group': groupId,
            'attrsNames': attrsNames,
            'allowedStatuses': ['INVALID', 'SUSPENDED', 'EXPIRED', 'VALID', 'DISABLED'],
            'searchString': searchString,
            'lookingInParentGroup': false
        }, showNotificationOnError);
    }
    getCompleteRichMembersForGroup(groupId, attrNames, showNotificationOnError = true) {
        return this.apiService.post('json/membersManager/getCompleteRichMembers', {
            'group': groupId,
            'attrsNames': attrNames,
            'allowedStatuses': ['INVALID', 'SUSPENDED', 'VALID'],
            'lookingInParentGroup': false
        }, showNotificationOnError);
    }
    deleteMembers(memberIds, showNotificationOnError = true) {
        return this.apiService.post('json/membersManager/deleteMembers', {
            'members': memberIds
        }, showNotificationOnError);
    }
    getMembersByUser(user, showNotificationOnError = true) {
        return this.apiService.post('json/membersManager/getMembersByUser', {
            'user': user
        }, showNotificationOnError);
    }
    createMember(voId, userId, showNotificationOnError = true) {
        return this.apiService.post('json/membersManager/createMember', {
            vo: voId,
            user: userId
        }, showNotificationOnError);
    }
    createMemberWithGroups(voId, userId, groups, showNotificationOnError = true) {
        return this.apiService.post('json/membersManager/createMember', {
            vo: voId,
            user: userId,
            groups: groups
        }, showNotificationOnError);
    }
    createMemberForCandidateWithGroups(voId, candidate, groups, showNotificationOnError = true) {
        return this.apiService.post('json/membersManager/createMember', {
            vo: voId,
            candidate: candidate,
            groups: groups
        }, showNotificationOnError);
    }
    createMemberForCandidate(voId, candidate, showNotificationOnError = true) {
        return this.apiService.post('json/membersManager/createMember', {
            vo: voId,
            candidate: candidate
        }, showNotificationOnError);
    }
    getMemberByUser(voId, userId, showNotificationOnError = true) {
        return this.apiService.post('json/membersManager/getMemberByUser', {
            'vo': voId,
            'user': userId
        }, showNotificationOnError);
    }
    getRichMember(memberId, showNotificationOnError = true) {
        return this.apiService.post('json/membersManager/getRichMember', {
            'id': memberId
        }, showNotificationOnError);
    }
    setStatus(member, status, showNotificationOnError = true) {
        return this.apiService.post('json/membersManager/setStatus', {
            'member': member,
            'status': status
        }, showNotificationOnError);
    }
};
MembersService = __decorate([
    Injectable({
        providedIn: 'root'
    }),
    __param(0, Inject(PERUN_API_SERVICE)),
    __metadata("design:paramtypes", [Object])
], MembersService);
export { MembersService };
//# sourceMappingURL=members.service.js.map