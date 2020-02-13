import { Injectable } from '@angular/core';
import { PerunPrincipal } from '@perun-web-apps/perun/openapi';
import { Role } from '@perun-web-apps/perun/models';

@Injectable({
  providedIn: 'root'
})
export class AuthResolverService {

  constructor() {
  }

  private principal: PerunPrincipal;

  private principalRoles: Set<Role> = new Set<Role>();

  private editableFacilities: number[] = [];
  private editableVos: number[] = [];
  private members: number[] = [];
  private user: number;
  private editableGroups: number[] = [];
  private observableVos: number[] = [];
  private hasGroupInTheseVos: number[] = [];

  init(principal: PerunPrincipal): void {
    this.principal = principal;
    this.initData(principal);
  }
  public canManageFacilities(): boolean {
    return this.hasAtLeasOne(Role.PERUNADMIN, Role.FACILITYADMIN);
  }

  public isPerunAdmin(): boolean {
    return this.principalRoles.has(Role.PERUNADMIN);
  }

  public isVoAdmin(): boolean {
    return this.hasAtLeasOne(Role.PERUNADMIN, Role.VOADMIN);
  }

  public isThisVoAdminOrObserver(id: number): boolean {
    return (this.editableVos.includes(id) || this.observableVos.includes(id) || this.principalRoles.has(Role.PERUNADMIN));
  }

  public isThisVoAdmin(id: number): boolean {
    return (this.editableVos.includes(id) || this.principalRoles.has(Role.PERUNADMIN));
  }

  public isGroupAdmin(): boolean {
    return this.hasAtLeasOne(Role.PERUNADMIN, Role.GROUPADMIN);
  }

  public isThisGroupAdmin(id: number): boolean {
    return (this.editableGroups.includes(id) || this.principalRoles.has(Role.PERUNADMIN));
  }

  public isGroupAdminInThisVo(id: number): boolean {
    return (this.hasGroupInTheseVos.includes(id));
  }

  public isFacilityAdmin(): boolean {
    return this.hasAtLeasOne(Role.PERUNADMIN, Role.FACILITYADMIN);
  }

  public isThisFacilityAdmin(id: number): boolean {
    return (this.editableFacilities.includes(id) || this.principalRoles.has(Role.PERUNADMIN));
  }

  isVoObserver(): boolean {
    return (this.hasAtLeasOne(Role.PERUNADMIN, Role.VOOBSERVER));
  }

  isThisVoObserver(id: number): boolean {
    return (this.principalRoles.has(Role.PERUNADMIN) || this.observableVos.includes(id));
  }

  public getMemberIds(): number[] {
    return this.members;
  }

  /**
   * Initialises principal data which are used for later verification
   *
   * @param principal given principal
   */
  private initData(principal: PerunPrincipal) {
    this.user = principal.user.id;
    for (const [key, value] of Object.entries(this.principal.roles)) {
      if (principal.roles.hasOwnProperty(key)) {
        this.principalRoles.add(<Role>key);
      }
      for (const [keyInner, valueInner] of Object.entries(value)) {
        switch (key) {
          case Role.VOADMIN: {
            this.editableVos = <number[]>valueInner;
            break;
          }
          case Role.FACILITYADMIN: {
            this.editableFacilities = <number[]>valueInner;
            break;
          }
          case Role.GROUPADMIN: {
            if (keyInner === 'Group') {
              this.editableGroups = <number[]>valueInner;
            }
            if (keyInner === 'Vo') {
              this.hasGroupInTheseVos = <number[]>valueInner;
            }
            break;
          }
          case Role.SELF: {
            if (keyInner === 'Member') {
              this.members = <number[]>valueInner;
            }
            break;
          }
          case Role.VOOBSERVER: {
            this.observableVos = <number[]>valueInner;
            break;
          }
        }
      }
    }
  }

  /**
   * Returns true if the principal has at least one of the given roles.
   * Otherwise, returns false
   *
   * @param roles specified roles
   */
  private hasAtLeasOne(...roles: Role[]): boolean {
    for (const role of roles) {
      if (this.principalRoles.has(role)) {
        return true;
      }
    }
    return false;
  }
}
