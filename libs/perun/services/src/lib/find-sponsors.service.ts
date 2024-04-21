import { Injectable } from '@angular/core';
import { AuthzResolverService, RichUser, User, Vo } from '@perun-web-apps/perun/openapi';
import { AuthPrivilege, Role } from '@perun-web-apps/perun/models';
import { Urns } from '@perun-web-apps/perun/urns';
import { Observable } from 'rxjs';
import { GuiAuthResolver } from './gui-auth-resolver.service';

@Injectable({
  providedIn: 'root',
})
export class FindSponsorsService {
  constructor(
    private guiAuthResolver: GuiAuthResolver,
    private authzResolver: AuthzResolverService,
  ) {}

  findSponsorsAuth(vo: Vo): boolean {
    const availableRoles = [this.guiAuthResolver.getRuleForRole('SPONSOR')];
    const availableRolesPrivileges = new Map<string, AuthPrivilege>();

    this.guiAuthResolver.setRolesAuthorization(availableRoles, vo, availableRolesPrivileges);
    return availableRolesPrivileges.get(availableRoles[0].roleName).readAuth;
  }

  someSponsorExists(voId: number): Observable<boolean> {
    return new Observable((subscriber) => {
      this.authzResolver
        .someAdminExists(Role.SPONSOR, voId, 'Vo', false)
        .subscribe((sponsorExists) => {
          this.authzResolver
            .someAdminExists(Role.SPONSORNOCREATERIGHTS, voId, 'Vo', false)
            .subscribe((sponsorNoCreateRightsExists) => {
              subscriber.next(sponsorExists || sponsorNoCreateRightsExists);
              subscriber.complete();
            });
        });
    });
  }

  getRichSponsors(voId: number): Observable<RichUser[]> {
    const attributes = [Urns.USER_DEF_PREFERRED_MAIL];
    return new Observable((subscriber) => {
      this.authzResolver
        .getAuthzRichAdmins(Role.SPONSOR, voId, 'Vo', attributes, false, false)
        .subscribe((sponsors) => {
          subscriber.next(sponsors);
          subscriber.complete();
        });
    });
  }

  getSponsors(voId: number): Observable<User[]> {
    return new Observable((subscriber) => {
      this.authzResolver.getAuthzAdmins(Role.SPONSOR, voId, 'Vo', false).subscribe((sponsors) => {
        this.authzResolver
          .getAuthzAdmins(Role.SPONSORNOCREATERIGHTS, voId, 'Vo', false)
          .subscribe((sponsorsNoCreateRights) => {
            subscriber.next(Array.from(new Set(sponsors.concat(sponsorsNoCreateRights))));
            subscriber.complete();
          });
      });
    });
  }
}
