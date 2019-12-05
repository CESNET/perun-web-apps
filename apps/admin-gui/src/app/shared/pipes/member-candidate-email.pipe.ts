import { Pipe, PipeTransform } from '@angular/core';
import { MemberCandidate } from '@perun-web-apps/perun/models';
import { parseEmail, parseUserEmail } from '@perun-web-apps/perun/utils';

@Pipe({
  name: 'memberCandidateEmail'
})
export class MemberCandidateEmailPipe implements PipeTransform {

  transform(value: MemberCandidate): any {
    return !!value.member && !!value.member.memberAttributes ? parseEmail(value.member) : parseUserEmail(value.richUser);
  }

}
