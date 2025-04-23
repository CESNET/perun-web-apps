import { Component, OnInit } from '@angular/core';
import { fadeIn } from '@perun-web-apps/perun/animations';
import {
  ConsentsManagerService,
  Service,
  ServicesManagerService,
} from '@perun-web-apps/perun/openapi';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SideMenuService } from '../../../../../core/services/common/side-menu.service';
import { SideMenuItemService } from '../../../../../shared/side-menu/side-menu-item.service';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { MatDialog } from '@angular/material/dialog';
import {
  CreateEditServiceDialogComponent,
  CreateServiceDialogData,
} from '../../../../../shared/components/dialogs/create-edit-service-dialog/create-edit-service-dialog.component';
import {
  EntityStorageService,
  GuiAuthResolver,
  NotificatorService,
} from '@perun-web-apps/perun/services';
import {
  DeleteServiceDialogComponent,
  DeleteServiceDialogData,
} from '../../../../../shared/components/dialogs/delete-service-dialog/delete-service-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import {
  UniversalConfirmationItemsDialogComponent,
  UniversalConfirmationItemsDialogData,
} from '@perun-web-apps/perun/dialogs';
import { EntityPathParam } from '@perun-web-apps/perun/models';

@Component({
  selector: 'app-service-detail-page',
  templateUrl: './service-detail-page.component.html',
  styleUrls: ['./service-detail-page.component.scss'],
  animations: [fadeIn],
})
export class ServiceDetailPageComponent implements OnInit {
  service: Service;
  loading = false;
  private serviceId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private consentsManager: ConsentsManagerService,
    private serviceManager: ServicesManagerService,
    private sideMenuService: SideMenuService,
    private sideMenuItemService: SideMenuItemService,
    private dialog: MatDialog,
    public authResolver: GuiAuthResolver,
    private translate: TranslateService,
    private notificator: NotificatorService,
    private entityStorageService: EntityStorageService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.route.params.subscribe((params: Params) => {
      this.serviceId = Number(params['serviceId']);
      this.entityStorageService.setEntityAndPathParam(
        { id: this.serviceId, beanName: 'Service' },
        EntityPathParam.Service,
      );
      this.refresh();
    });
  }

  editService(): void {
    const config = getDefaultDialogConfig<CreateServiceDialogData>();
    config.width = '600px';
    config.data = {
      theme: 'service-theme',
      service: this.service,
    };

    const dialogRef = this.dialog.open(CreateEditServiceDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refresh();
      }
    });
  }

  removeService(): void {
    const config = getDefaultDialogConfig<DeleteServiceDialogData>();
    config.width = '600px';
    config.data = {
      theme: 'service-theme',
      services: [this.service],
    };
    const dialogRef = this.dialog.open(DeleteServiceDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        void this.router.navigate(['/admin/services'], { queryParamsHandling: 'preserve' });
      }
    });
  }

  changeServiceStatus(): void {
    this.service.enabled = !this.service.enabled;
    this.serviceManager.updateService({ service: this.service }).subscribe(
      () => {
        this.notificator.showSuccess(
          this.translate.instant('SERVICE_DETAIL.STATUS_CHANGE_SUCCESS') as string,
        );
      },
      () => (this.service.enabled = !this.service.enabled),
    );
  }

  groupPropagationChange(): void {
    this.service.useExpiredMembers = !this.service.useExpiredMembers;
    this.serviceManager.updateService({ service: this.service }).subscribe({
      next: () => {
        this.notificator.showSuccess(
          this.translate.instant('SERVICE_DETAIL.PROPAGATION_CHANGE_SUCCESS') as string,
        );
      },
      error: () => (this.service.useExpiredMembers = !this.service.useExpiredMembers),
    });
  }

  voPropagationChange(): void {
    this.service.useExpiredVoMembers = !this.service.useExpiredVoMembers;
    this.serviceManager.updateService({ service: this.service }).subscribe({
      next: () => {
        this.notificator.showSuccess(
          this.translate.instant('SERVICE_DETAIL.PROPAGATION_CHANGE_SUCCESS') as string,
        );
      },
      error: () => (this.service.useExpiredVoMembers = !this.service.useExpiredVoMembers),
    });
  }

  bannedPropagationChange(): void {
    this.service.useBannedMembers = !this.service.useBannedMembers;
    this.serviceManager.updateService({ service: this.service }).subscribe({
      next: () => {
        this.notificator.showSuccess(
          this.translate.instant('SERVICE_DETAIL.PROPAGATION_CHANGE_SUCCESS_BANNED') as string,
        );
      },
      error: () => (this.service.useBannedMembers = !this.service.useBannedMembers),
    });
  }

  evaluateConsents(): void {
    const config = getDefaultDialogConfig<UniversalConfirmationItemsDialogData>();
    config.width = '500px';
    config.data = {
      title: this.translate.instant('SERVICE_DETAIL.CONFIRM_DIALOG_TITLE') as string,
      theme: 'service-theme',
      description: this.translate.instant('SERVICE_DETAIL.CONFIRM_DIALOG_DESCRIPTION') as string,
      items: [this.service.name],
      type: 'confirmation',
      showAsk: false,
    };

    const dialogRef = this.dialog.open(UniversalConfirmationItemsDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.consentsManager
          .evaluateConsentsForService(this.service.id)
          .subscribe(() =>
            this.notificator.showSuccess(
              this.translate.instant('SERVICE_DETAIL.EVALUATION_FINISH') as string,
            ),
          );
      }
    });
  }

  private refresh(): void {
    this.serviceManager.getServiceById(this.serviceId).subscribe(
      (service) => {
        this.service = service;

        const serviceItems = this.sideMenuItemService.parseService(this.service);
        this.sideMenuService.setAdminItems([serviceItems]);
        this.loading = false;
      },
      () => (this.loading = false),
    );
  }
}
