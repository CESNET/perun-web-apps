import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
import { getAttribute } from '@perun-web-apps/perun/utils';
import { Urns } from '@perun-web-apps/perun/urns';
let GroupSyncToolTipPipe = class GroupSyncToolTipPipe {
    transform(richGroup) {
        if (richGroup === undefined || richGroup === null || richGroup.attributes === undefined ||
            richGroup.attributes === null) {
            return 'VO_DETAIL.GROUPS.GROUP_NOT_SYNCED';
        }
        const normalSyncEnabled = getAttribute(richGroup.attributes, Urns.GROUP_SYNC_ENABLED);
        const structureSyncEnabled = getAttribute(richGroup.attributes, Urns.GROUP_STRUCTURE_SYNC_ENABLED);
        if (normalSyncEnabled === null && structureSyncEnabled === null) {
            return 'VO_DETAIL.GROUPS.GROUP_NOT_SYNCED';
        }
        const structureSyncEnabledValue = structureSyncEnabled.value;
        const normalSyncEnabledValue = normalSyncEnabled.value;
        if (normalSyncEnabledValue === 'true') {
            const syncLastStatus = getAttribute(richGroup.attributes, Urns.GROUP_LAST_SYNC_STATE);
            const syncLastTime = getAttribute(richGroup.attributes, Urns.GROUP_LAST_SYNC_TIMESTAMP);
            const lastStatusValue = syncLastStatus.value;
            const lastTimeValue = syncLastTime.value;
            if (lastStatusValue != null && lastStatusValue.trim().length > 0) {
                return 'VO_DETAIL.GROUPS.GROUP_SYNC_FAILED';
            }
            else {
                if (lastTimeValue !== null && lastTimeValue.trim().length > 0) {
                    return 'VO_DETAIL.GROUPS.GROUP_SYNCED';
                }
                return 'VO_DETAIL.GROUPS.GROUP_NOT_YET_SYNCED';
            }
        }
        if (structureSyncEnabledValue) {
            const syncLastStatus = getAttribute(richGroup.attributes, Urns.GROUP_LAST_STRUCTURE_SYNC_STATE);
            const syncLastTime = getAttribute(richGroup.attributes, Urns.GROUP_LAST_STRUCTURE_SYNC_TIMESTAMP);
            const lastStatusValue = syncLastStatus.value;
            const lastTimeValue = syncLastTime.value;
            if (lastStatusValue != null && lastStatusValue.trim().length > 0) {
                return 'VO_DETAIL.GROUPS.GROUP_SYNC_FAILED';
            }
            else {
                if (lastTimeValue !== null && lastTimeValue.trim().length > 0) {
                    return 'VO_DETAIL.GROUPS.GROUP_STRUCTURE_SYNCED';
                }
                return 'VO_DETAIL.GROUPS.GROUP_NOT_YET_SYNCED';
            }
        }
        return 'VO_DETAIL.GROUPS.GROUP_NOT_SYNCED';
    }
};
GroupSyncToolTipPipe = __decorate([
    Pipe({
        name: 'groupSyncToolTip'
    })
], GroupSyncToolTipPipe);
export { GroupSyncToolTipPipe };
//# sourceMappingURL=group-sync-tool-tip.pipe.js.map