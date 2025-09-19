import { Pipe, PipeTransform } from '@angular/core';
import { PerunTranslateService } from '@perun-web-apps/perun/services';
import { Member } from '@perun-web-apps/perun/openapi';

@Pipe({
  standalone: true,
  name: 'memberTypeTooltip',
})
export class MemberTypeTooltipPipe implements PipeTransform {
  constructor(private translate: PerunTranslateService) {}

  transform(member: Member): string {
    let tooltip = '';
    if (member.dualMembership) {
      tooltip = 'MEMBERS_LIST.DUAL_MEMBERSHIP';
    } else {
      tooltip =
        member.membershipType === 'DIRECT'
          ? 'MEMBERS_LIST.DIRECT_MEMBER'
          : 'MEMBERS_LIST.INDIRECT_MEMBER';
    }

    return this.translate.instant(tooltip);
  }
}
