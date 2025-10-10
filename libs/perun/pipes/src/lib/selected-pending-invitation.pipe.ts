import { SelectionModel } from '@angular/cdk/collections';
import { Pipe, PipeTransform } from '@angular/core';
import { InvitationWithSender } from '@perun-web-apps/perun/openapi';
import { InvitationStatus } from '@perun-web-apps/perun/openapi';

@Pipe({
  standalone: true,
  name: 'selectedPendingInvitation',
  pure: false,
})
export class SelectedPendingInvitation implements PipeTransform {
  constructor() {}
  transform(selection: SelectionModel<InvitationWithSender>): boolean {
    return (
      selection.selected.every((invitation) => invitation.status === InvitationStatus.PENDING) &&
      selection.selected.length > 0
    );
  }
}
