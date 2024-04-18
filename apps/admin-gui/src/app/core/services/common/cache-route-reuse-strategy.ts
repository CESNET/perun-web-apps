import { ComponentRef, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  createUrlTreeFromSnapshot,
  DetachedRouteHandle,
  RouteReuseStrategy,
  UrlSerializer,
} from '@angular/router';
import { VoMembersComponent } from '../../../vos/pages/vo-detail-page/vo-members/vo-members.component';
import { VoGroupsComponent } from '../../../vos/pages/vo-detail-page/vo-groups/vo-groups.component';
import { VoApplicationsComponent } from '../../../vos/pages/vo-detail-page/vo-applications/vo-applications.component';
import { GroupApplicationsComponent } from '../../../vos/pages/group-detail-page/group-applications/group-applications.component';
import { GroupResourcesComponent } from '../../../vos/pages/group-detail-page/group-resources/group-resources.component';
import { GroupSubgroupsComponent } from '../../../vos/pages/group-detail-page/group-subgroups/group-subgroups.component';
import { GroupMembersComponent } from '../../../vos/pages/group-detail-page/group-members/group-members.component';
import { FacilityAllowedGroupsComponent } from '../../../facilities/pages/facility-detail-page/facility-allowed-groups/facility-allowed-groups.component';
import { FacilityResourcesComponent } from '../../../facilities/pages/facility-detail-page/facility-resources/facility-resources.component';
import { MemberGroupsComponent } from '../../../vos/pages/member-detail-page/member-groups/member-groups.component';
import { VoResourcesPreviewComponent } from '../../../vos/pages/vo-detail-page/vo-resources/vo-resources-preview/vo-resources-preview.component';
import { VoResourcesStatesComponent } from '../../../vos/pages/vo-detail-page/vo-resources/vo-resources-states/vo-resources-states.component';
import { AdminUsersComponent } from '../../../admin/pages/admin-page/admin-users/admin-users.component';
import { VoSettingsApplicationFormComponent } from '../../../vos/pages/vo-detail-page/vo-settings/vo-settings-application-form/vo-settings-application-form.component';
import { GroupSettingsApplicationFormComponent } from '../../../vos/pages/group-detail-page/group-settings/group-settings-application-form/group-settings-application-form.component';
import { VoSelectPageComponent } from '../../../vos/pages/vo-select-page/vo-select-page.component';
import { FacilitySelectPageComponent } from '../../../facilities/pages/facility-select-page/facility-select-page.component';
import { VoSettingsSponsoredMembersComponent } from '../../../vos/pages/vo-detail-page/vo-settings/vo-settings-sponsored-members/vo-settings-sponsored-members.component';
import { AdminSearcherComponent } from '../../../admin/pages/admin-page/admin-searcher/admin-searcher.component';
import { AdminServicesComponent } from '../../../admin/pages/admin-page/admin-services/admin-services.component';
import { FacilityAllowedUsersComponent } from '../../../facilities/pages/facility-detail-page/facility-allowed-users/facility-allowed-users.component';
import { GroupRolesComponent } from '../../../vos/pages/group-detail-page/group-roles/group-roles.component';
import { GroupSettingsRelationsComponent } from '../../../vos/pages/group-detail-page/group-settings/group-settings-relations/group-settings-relations.component';

/**
 * This extended interface is mandatory to access the componentRef of the DetachedRouteHandle
 */
interface DetachedRouteHandleExt extends DetachedRouteHandle {
  componentRef: ComponentRef<unknown>;
}

export class CachedRoute {
  routeHandle: DetachedRouteHandleExt;
  saveTimeStamp: number;
}

@Injectable()
export class CacheRouteReuseStrategy implements RouteReuseStrategy {
  private handlers = new Map<string, CachedRoute>();
  private cachedComponents = new Set<string>([
    VoMembersComponent.id,
    VoGroupsComponent.id,
    VoApplicationsComponent.id,
    VoResourcesPreviewComponent.id,
    VoResourcesStatesComponent.id,
    VoSettingsApplicationFormComponent.id,
    VoSettingsSponsoredMembersComponent.id,
    GroupMembersComponent.id,
    GroupSubgroupsComponent.id,
    GroupResourcesComponent.id,
    GroupRolesComponent.id,
    GroupApplicationsComponent.id,
    GroupSettingsApplicationFormComponent.id,
    GroupSettingsRelationsComponent.id,
    FacilityAllowedGroupsComponent.id,
    FacilityResourcesComponent.id,
    FacilityAllowedUsersComponent.id,
    MemberGroupsComponent.id,
    AdminUsersComponent.id,
    AdminSearcherComponent.id,
    AdminServicesComponent.id,
    VoSelectPageComponent.id,
    FacilitySelectPageComponent.id,
  ]);
  private activeCachedComponentId: string;

  private cacheTimeMs = 300_000;

  private isUserNavigatingBack = false;

  constructor(private urlSerializer: UrlSerializer) {}

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  /**
   * Return handlers from cache or null if they are not cached
   *
   * @param route route
   */
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandleExt | null {
    const key = this.getKey(route);
    if (!this.handlers.has(key)) return null;

    this.activeCachedComponentId = String(
      this.handlers.get(key).routeHandle.componentRef.componentType['id'],
    );

    return this.handlers.get(key).routeHandle;
  }

  isRouteCached(routeUrl: string): boolean {
    return this.handlers.has(routeUrl);
  }

  getActiveCachedComponentId(): string {
    return this.activeCachedComponentId;
  }

  /**
   * Returns true if the route should be used from cache.
   *
   * @param route route
   */
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const cachedData = this.handlers.get(this.getKey(route));

    if (!this.isUserNavigatingBack || !route.component) {
      if (cachedData) {
        // destroy detached component which was not re-attached from cache
        // component in the cache will be replaced with the new one but the old detached component is not destroyed by default
        cachedData.routeHandle.componentRef.destroy();
      }
      return false;
    }

    return cachedData && this.getCurrentTimestamp() - cachedData.saveTimeStamp < this.cacheTimeMs;
  }

  /**
   * Returns true if the route should be cached.
   *
   * @param route route
   */
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    this.activeCachedComponentId = null;
    const componentId = this.getComponentId(route.component);
    return this.cachedComponents.has(componentId);
  }

  /**
   * Stores given handlers for given route.
   *
   * @param route route
   * @param detachedTree handlers
   */
  store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandleExt): void {
    // Removes active tooltips, so they are not cached
    while (document.getElementsByTagName('mat-tooltip-component').length > 0) {
      document.getElementsByTagName('mat-tooltip-component')[0].remove();
    }
    // Do not cache components in the overlay to prevent a bug where they would stay on screen after rerouting
    if (document.getElementsByClassName('cdk-overlay-container').length > 0) {
      while (document.getElementsByClassName('cdk-overlay-container')[0].children.length > 0) {
        document.getElementsByClassName('cdk-overlay-container')[0].children[0].remove();
      }
    }

    this.handlers.set(this.getKey(route), {
      routeHandle: detachedTree,
      saveTimeStamp: this.getCurrentTimestamp(),
    });
  }

  setLastNavigationType(type: 'back' | 'direct'): void {
    this.isUserNavigatingBack = type === 'back';
  }

  /**
   * Parses component id from its source.
   * @param component as a class
   */
  private getComponentId(component): string {
    // eslint-disable-next-line
    return component.id as string;
  }

  /**
   * Constructs full url from route snapshot, that is used as unique key
   * @param route snapshot of activated route
   */
  private getKey(route: ActivatedRouteSnapshot): string {
    return this.urlSerializer.serialize(createUrlTreeFromSnapshot(route, ['.']));
  }

  private getCurrentTimestamp(): number {
    return +Date.now();
  }
}
