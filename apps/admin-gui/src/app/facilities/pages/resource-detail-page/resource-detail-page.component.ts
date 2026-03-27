import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AnimatedRouterOutletComponent } from '../../../shared/components/animated-router-outlet/animated-router-outlet.component';
import { PerunSharedComponentsModule } from '@perun-web-apps/perun/components';
import { MiddleClickRouterLinkDirective } from '@perun-web-apps/perun/directives';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { fadeIn } from '@perun-web-apps/perun/animations';
import { SideMenuService } from '../../../core/services/common/side-menu.service';
import { SideMenuItemService } from '../../../shared/side-menu/side-menu-item.service';
import {
  FacilitiesManagerService,
  Facility,
  Resource,
  ResourcesManagerService,
  RichResource,
  Vo,
  VosManagerService,
} from '@perun-web-apps/perun/openapi';
import { addRecentlyVisited, getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { MatDialog } from '@angular/material/dialog';
import { EntityStorageService, GuiAuthResolver } from '@perun-web-apps/perun/services';
import { GetResourceRoutePipe } from '@perun-web-apps/perun/pipes';
import {
  EditFacilityResourceGroupVoDialogComponent,
  EditFacilityResourceGroupVoDialogOptions,
} from '@perun-web-apps/perun/dialogs';
import { RemoveResourceDialogComponent } from '../../../shared/components/dialogs/remove-resource-dialog/remove-resource-dialog.component';
import { ReloadEntityDetailService } from '../../../core/services/common/reload-entity-detail.service';
import { SideMenuItem } from '../../../shared/side-menu/side-menu.component';
import { destroyDetailMixin } from '../../../shared/destroy-entity-detail';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { EntityPathParam } from '@perun-web-apps/perun/models';
import { iif } from 'rxjs';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MiddleClickRouterLinkDirective,
    PerunSharedComponentsModule,
    AnimatedRouterOutletComponent,
    RouterModule,
    MatProgressSpinnerModule,
    TranslateModule,
    MatTooltip,
  ],
  standalone: true,
  selector: 'app-resource-detail-page',
  templateUrl: './resource-detail-page.component.html',
  styleUrls: ['./resource-detail-page.component.scss'],
  animations: [fadeIn],
})
export class ResourceDetailPageComponent extends destroyDetailMixin() implements OnInit {
  resource: RichResource;
  vo: Vo;
  facility: Facility;
  underVoUrl = false;
  facilityLinkAuth: boolean;
  editResourceAuth: boolean;
  voLinkAuth: boolean;
  deleteAuth = false;
  baseUrl = '';
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private facilityManager: FacilitiesManagerService,
    private vosManagerService: VosManagerService,
    private resourcesManager: ResourcesManagerService,
    private sideMenuService: SideMenuService,
    private sideMenuItemService: SideMenuItemService,
    private dialog: MatDialog,
    public guiAuthResolver: GuiAuthResolver,
    private router: Router,
    private entityStorageService: EntityStorageService,
    private reloadEntityDetail: ReloadEntityDetailService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.reloadData();
    this.reloadEntityDetail.entityDetailChange.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.reloadData();
    });
  }

  reloadData(): void {
    this.loading = true;

    this.route.params
      .pipe(
        map((params) => Number(params['resourceId'])),
        switchMap((resourceId) => this.resourcesManager.getRichResourceById(resourceId)),
        tap((richResource) => {
          this.resource = richResource;
          this.setAuth();
          this.entityStorageService.setEntityAndPathParam(
            {
              id: richResource.id,
              voId: richResource.voId,
              facilityId: richResource.facilityId,
              beanName: 'Resource',
            },
            EntityPathParam.Resource,
          );
          addRecentlyVisited('resources', richResource);
        }),
        switchMap((resource) => {
          const isFacilities = this.route.parent.snapshot.url[0].path === 'facilities';
          this.baseUrl = new GetResourceRoutePipe().transform(resource, !isFacilities);

          return iif(
            () => isFacilities,
            this.facilityManager
              .getFacilityById(resource.facilityId)
              .pipe(map((facility) => ({ type: 'facility', value: facility }))),
            this.vosManagerService
              .getVoById(resource.voId)
              .pipe(map((vo) => ({ type: 'vo', value: vo }))),
          );
        }),
        tap((result) => {
          if (result.type === 'facility') {
            this.facility = result.value;
            this.underVoUrl = false;
          } else {
            this.vo = result.value;
            this.underVoUrl = true;
          }
          this.setMenuItems();
          this.loading = false;
        }),
      )
      .subscribe({
        error: () => (this.loading = false),
      });
  }

  setMenuItems(): void {
    let parentItem: SideMenuItem;
    const resourceItem = this.sideMenuItemService.parseResource(this.resource, this.underVoUrl);
    if (this.underVoUrl) {
      parentItem = this.sideMenuItemService.parseVo(this.vo);
      this.sideMenuService.setAccessMenuItems([parentItem, resourceItem]);
    } else {
      parentItem = this.sideMenuItemService.parseFacility(this.facility);
      this.sideMenuService.setFacilityMenuItems([parentItem, resourceItem]);
    }
  }

  editResource(): void {
    let resourceForEdit: Resource;
    this.resourcesManager.getResourceById(this.resource.id).subscribe((resource) => {
      resourceForEdit = resource;
      const config = getDefaultDialogConfig();
      config.width = '450px';
      config.data = {
        theme: 'resource-theme',
        resource: resourceForEdit,
        dialogType: EditFacilityResourceGroupVoDialogOptions.RESOURCE,
      };
      const dialogRef = this.dialog.open(EditFacilityResourceGroupVoDialogComponent, config);

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.resourcesManager.getRichResourceById(this.resource.id).subscribe((newResource) => {
            this.resource = newResource;
            this.setMenuItems();
          });
        }
      });
    });
  }

  deleteResource(): void {
    const config = getDefaultDialogConfig();
    config.width = '500px';
    config.data = {
      theme: 'resource-theme',
      resources: [this.resource],
    };
    const dialogRef = this.dialog.open(RemoveResourceDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        void this.router.navigate(['../'], {
          relativeTo: this.route,
          queryParamsHandling: 'preserve',
        });
      }
    });
  }

  private setAuth(): void {
    this.facilityLinkAuth = this.guiAuthResolver.isAuthorized('getFacilityById_int_policy', [
      this.resource,
    ]);
    this.editResourceAuth = this.guiAuthResolver.isAuthorized('updateResource_Resource_policy', [
      this.resource,
    ]);
    this.voLinkAuth = this.guiAuthResolver.isAuthorized('getVoById_int_policy', [this.resource]);
    this.deleteAuth = this.guiAuthResolver.isAuthorized('deleteResource_Resource_policy', [
      this.resource,
    ]);
  }
}
