import { Pipe, PipeTransform } from '@angular/core';
import { getAttribute } from '@perun-web-apps/perun/utils';
import { Urns } from '@perun-web-apps/perun/urns';
import { RichGroup } from '@perun-web-apps/perun/openapi';

@Pipe({
  name: 'groupSyncIconColor'
})
export class GroupSyncIconColorPipe implements PipeTransform {

  transform(richGroup: RichGroup): unknown {
    if (richGroup === undefined || richGroup === null || richGroup.groupAttributes === undefined ||
      richGroup.groupAttributes === null) {
      return 'VO_DETAIL.GROUPS.GROUP_NOT_SYNCED';
    }
    const normalSyncEnabled = getAttribute(richGroup.groupAttributes, Urns.GROUP_SYNC_ENABLED);
    const structureSyncEnabled = getAttribute(richGroup.groupAttributes, Urns.GROUP_STRUCTURE_SYNC_ENABLED);
    if (normalSyncEnabled === null && structureSyncEnabled === null) {
      return 'VO_DETAIL.GROUPS.GROUP_NOT_SYNCED';
    }
    const structureSyncEnabledValue = <boolean><unknown>structureSyncEnabled.value;
    const normalSyncEnabledValue = <string><unknown>normalSyncEnabled.value;

    if (normalSyncEnabledValue === 'true') {
      const syncLastStatus = getAttribute(richGroup.groupAttributes, Urns.GROUP_LAST_SYNC_STATE);
      const syncLastTime = getAttribute(richGroup.groupAttributes, Urns.GROUP_LAST_SYNC_TIMESTAMP);
      const lastStatusValue = <string><unknown>syncLastStatus.value;
      const lastTimeValue = <string><unknown>syncLastTime.value;
      if (lastStatusValue != null && lastStatusValue.trim().length > 0) {
        return 'red';
      } else {
        if (lastTimeValue !== null && lastTimeValue.trim().length > 0) {
          return 'green';
        }
        return '';
      }
    }

    if (structureSyncEnabledValue) {
      const syncLastStatus = getAttribute(richGroup.groupAttributes, Urns.GROUP_LAST_STRUCTURE_SYNC_STATE);
      const syncLastTime = getAttribute(richGroup.groupAttributes, Urns.GROUP_LAST_STRUCTURE_SYNC_TIMESTAMP);
      const lastStatusValue = <string><unknown>syncLastStatus.value;
      const lastTimeValue = <string><unknown>syncLastTime.value;
      if (lastStatusValue != null && lastStatusValue.trim().length > 0) {
        return 'red';
      } else {
        if (lastTimeValue !== null && lastTimeValue.trim().length > 0) {
          return 'green';
        }
        return '';
      }
    }
    return '';
  }
}
