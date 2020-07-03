import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
import { Urns } from '@perun-web-apps/perun/urns';
import { getAttribute } from '@perun-web-apps/perun/utils';
let GroupSyncIconPipe = class GroupSyncIconPipe {
    transform(richGroup) {
        if (richGroup === undefined || richGroup === null || richGroup.attributes === undefined ||
            richGroup.attributes === null) {
            return '';
        }
        const normalSyncEnabled = getAttribute(richGroup.attributes, Urns.GROUP_SYNC_ENABLED);
        const structureSyncEnabled = getAttribute(richGroup.attributes, Urns.GROUP_STRUCTURE_SYNC_ENABLED);
        if (normalSyncEnabled === null && structureSyncEnabled === null) {
            return '';
        }
        const structureSyncEnabledValue = structureSyncEnabled.value;
        const normalSyncEnabledValue = normalSyncEnabled.value;
        if (normalSyncEnabledValue === 'true') {
            const syncLastStatus = getAttribute(richGroup.attributes, Urns.GROUP_LAST_SYNC_STATE);
            const syncLastTime = getAttribute(richGroup.attributes, Urns.GROUP_LAST_SYNC_TIMESTAMP);
            const lastStatusValue = syncLastStatus.value;
            const lastTimeValue = syncLastTime.value;
            if (lastStatusValue != null && lastStatusValue.trim().length > 0) {
                return 'sync_problem';
            }
            else {
                if (lastTimeValue !== null && lastTimeValue.trim().length > 0) {
                    return 'sync';
                }
                return 'sync';
            }
        }
        if (structureSyncEnabledValue) {
            const syncLastStatus = getAttribute(richGroup.attributes, Urns.GROUP_LAST_STRUCTURE_SYNC_STATE);
            const syncLastTime = getAttribute(richGroup.attributes, Urns.GROUP_LAST_STRUCTURE_SYNC_TIMESTAMP);
            const lastStatusValue = syncLastStatus.value;
            const lastTimeValue = syncLastTime.value;
            if (lastStatusValue != null && lastStatusValue.trim().length > 0) {
                return 'sync_problem';
            }
            else {
                if (lastTimeValue !== null && lastTimeValue.trim().length > 0) {
                    return 'sync';
                }
                return 'sync';
            }
        }
        return 'sync_disabled';
    }
};
GroupSyncIconPipe = __decorate([
    Pipe({
        name: 'groupSyncIcon'
    })
], GroupSyncIconPipe);
export { GroupSyncIconPipe };
//# sourceMappingURL=group-sync-icon.pipe.js.map