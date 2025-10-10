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
import { FacilitiesManagerService, Facility } from '@perun-web-apps/perun/openapi';
import {
  addRecentlyVisited,
  addRecentlyVisitedObject,
  getDefaultDialogConfig,
} from '@perun-web-apps/perun/utils';
import { MatDialog } from '@angular/material/dialog';
import { EntityStorageService, GuiAuthResolver } from '@perun-web-apps/perun/services';
import {
  EditFacilityResourceGroupVoDialogComponent,
  EditFacilityResourceGroupVoDialogOptions,
} from '@perun-web-apps/perun/dialogs';
import { DeleteFacilityDialogComponent } from '../../../shared/components/dialogs/delete-facility-dialog/delete-facility-dialog.component';
import { ReloadEntityDetailService } from '../../../core/services/common/reload-entity-detail.service';
import { destroyDetailMixin } from '../../../shared/destroy-entity-detail';
import { takeUntil } from 'rxjs/operators';
import { EntityPathParam } from '@perun-web-apps/perun/models';

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
  selector: 'app-facility-detail-page',
  templateUrl: './facility-detail-page.component.html',
  styleUrls: ['./facility-detail-page.component.scss'],
  animations: [fadeIn],
})
export class FacilityDetailPageComponent extends destroyDetailMixin() implements OnInit {
  facility: Facility;
  editFacilityAuth = false;
  deleteAuth = false;
  loading = false;

  constructor(
    private dialog: MatDialog,
    private facilityManager: FacilitiesManagerService,
    private route: ActivatedRoute,
    private sideMenuService: SideMenuService,
    private sideMenuItemService: SideMenuItemService,
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
    this.route.params.subscribe((params) => {
      const facilityId = Number(params['facilityId']);

      this.facilityManager.getFacilityById(facilityId).subscribe({
        next: (facility) => {
          this.facility = facility;
          this.entityStorageService.setEntityAndPathParam(
            { id: facility.id, beanName: facility.beanName },
            EntityPathParam.Facility,
          );
          this.setMenuItems();

          this.editFacilityAuth = this.guiAuthResolver.isAuthorized(
            'updateFacility_Facility_policy',
            [this.facility],
          );
          this.deleteAuth = this.guiAuthResolver.isAuthorized(
            'deleteFacility_Facility_Boolean_policy',
            [this.facility],
          );

          addRecentlyVisited('facilities', this.facility);
          addRecentlyVisitedObject(this.facility);
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
    });
  }

  setMenuItems(): void {
    const facilityItem = this.sideMenuItemService.parseFacility(this.facility);
    this.sideMenuService.setFacilityMenuItems([facilityItem]);
  }

  editFacility(): void {
    const config = getDefaultDialogConfig();
    config.width = '450px';
    config.data = {
      theme: 'facility-theme',
      facility: this.facility,
      dialogType: EditFacilityResourceGroupVoDialogOptions.FACILITY,
    };
    const dialogRef = this.dialog.open(EditFacilityResourceGroupVoDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.facilityManager.getFacilityById(this.facility.id).subscribe((facility) => {
          this.facility = facility;
          this.setMenuItems();
        });
      }
    });
  }

  deleteFacility(): void {
    const config = getDefaultDialogConfig();
    config.width = '500px';
    config.data = {
      theme: 'facility-theme',
      facility: this.facility,
    };
    const dialogRef = this.dialog.open(DeleteFacilityDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        void this.router.navigate([''], { queryParamsHandling: 'preserve' });
      }
    });
  }
}
