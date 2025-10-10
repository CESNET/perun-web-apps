import { TranslateModule } from '@ngx-translate/core';
import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import {
  Group,
  GroupsManagerService,
  RegistrarManagerService,
  Vo,
  VosManagerService,
} from '@perun-web-apps/perun/openapi';
import {
  ApiRequestConfigurationService,
  NotificatorService,
  PerunTranslateService,
} from '@perun-web-apps/perun/services';
import { RPCError } from '@perun-web-apps/perun/models';
import { compareFnName } from '@perun-web-apps/perun/utils';
import { GroupSearchSelectComponent } from '@perun-web-apps/perun/components';
import { VoSearchSelectComponent } from '@perun-web-apps/perun/components';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

export interface ApplicationFormCopyItemsDialogData {
  voId: number;
  groupId: number;
  theme: string;
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    LoadingDialogComponent,
    TranslateModule,
    GroupSearchSelectComponent,
    VoSearchSelectComponent,
    LoaderDirective,
  ],
  standalone: true,
  selector: 'app-application-form-copy-items-dialog',
  templateUrl: './application-form-copy-items-dialog.component.html',
  styleUrls: ['./application-form-copy-items-dialog.component.scss'],
})
export class ApplicationFormCopyItemsDialogComponent implements OnInit {
  vos: Vo[] = [];
  groups: Group[] = [];
  selectedVo: Vo;
  selectedGroup: Group = null;
  fakeGroup: Group;
  theme: string;
  loading = false;
  private successMessage: string;
  private privilegeMessage: string;
  private noFormMessage: string;
  private noSubmitButtonMessage: string;

  constructor(
    private dialogRef: MatDialogRef<ApplicationFormCopyItemsDialogComponent>,
    private voService: VosManagerService,
    private groupService: GroupsManagerService,
    private translateService: PerunTranslateService,
    private registrarManager: RegistrarManagerService,
    private notificatorService: NotificatorService,
    private apiRequest: ApiRequestConfigurationService,
    private cd: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: ApplicationFormCopyItemsDialogData,
  ) {
    translateService
      .get('DIALOGS.APPLICATION_FORM_COPY_ITEMS.SUCCESS')
      .subscribe((res: string) => (this.successMessage = res));
    translateService
      .get('DIALOGS.APPLICATION_FORM_COPY_ITEMS.PRIVILEGE')
      .subscribe((res: string) => (this.privilegeMessage = res));
    translateService
      .get('DIALOGS.APPLICATION_FORM_COPY_ITEMS.NO_FORM')
      .subscribe((res: string) => (this.noFormMessage = res));
    translateService
      .get('DIALOGS.APPLICATION_FORM_COPY_ITEMS.NO_SUBMIT_BUTTON')
      .subscribe((res: string) => (this.noSubmitButtonMessage = res));
  }

  nameFunction: (group: Group) => string = (group: Group) => group.name;

  ngOnInit(): void {
    this.loading = true;
    this.theme = this.data.theme;
    this.translateService.get('DIALOGS.APPLICATION_FORM_COPY_ITEMS.NO_GROUP_SELECTED').subscribe({
      next: (text: string) => {
        this.fakeGroup = {
          id: -1,
          name: text,
          voId: 0,
          parentGroupId: 0,
          shortName: '',
          description: '',
          beanName: 'group',
        };
        this.selectedGroup = this.fakeGroup;

        this.voService.getMyVos().subscribe({
          next: (vos) => {
            this.vos = vos;
            this.loading = false;
            if (this.vos.length > 0) {
              this.voSelected(this.vos.sort(compareFnName)[0]);
            }
          },
          error: () => {
            this.loading = false;
          },
        });
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  submit(): void {
    this.apiRequest.dontHandleErrorForNext();
    this.loading = true;
    if (this.data.groupId) {
      // checking if the dialog is for group or Vo
      if (this.selectedGroup === this.fakeGroup) {
        // no group selected
        this.registrarManager
          .copyFormFromVoToGroup(this.selectedVo.id, this.data.groupId)
          .subscribe({
            next: () => {
              this.notificatorService.showSuccess(this.successMessage);
              this.dialogRef.close(true);
            },
            error: (error: RPCError) => {
              if (error.name === 'FormNotExistsException') {
                this.notificatorService.showError(this.noFormMessage);
              }
              if (error.name === 'PrivilegeException') {
                this.notificatorService.showError(this.privilegeMessage);
              }
              this.loading = false;
            },
          });
      } else {
        this.registrarManager
          .copyFormFromGroupToGroup(this.selectedGroup.id, this.data.groupId)
          .subscribe({
            next: () => {
              this.notificatorService.showSuccess(this.successMessage);
              this.dialogRef.close(true);
            },
            error: (error: RPCError) => {
              if (error.name === 'FormNotExistsException') {
                this.notificatorService.showError(this.noFormMessage);
              } else if (error.name === 'PrivilegeException') {
                this.notificatorService.showError(this.privilegeMessage);
              } else if (error.name === 'MissingSubmitButtonException') {
                this.notificatorService.showError(
                  error.name,
                  error,
                  error.message + ' ' + this.noSubmitButtonMessage,
                );
              } else {
                this.notificatorService.showRPCError(error);
              }
              this.loading = false;
            },
          });
      }
    } else {
      if (this.selectedGroup === this.fakeGroup) {
        // no group selected
        this.registrarManager.copyFormFromVoToVo(this.selectedVo.id, this.data.voId).subscribe({
          next: () => {
            this.notificatorService.showSuccess(this.successMessage);
            this.dialogRef.close(true);
          },
          error: (error: RPCError) => {
            if (error.name === 'FormNotExistsException') {
              this.notificatorService.showError(this.noFormMessage);
            }
            if (error.name === 'PrivilegeException') {
              this.notificatorService.showError(this.privilegeMessage);
            }
            this.loading = false;
          },
        });
      } else {
        this.registrarManager
          .copyFormFromGroupToVo(this.selectedGroup.id, this.data.voId)
          .subscribe({
            next: () => {
              this.notificatorService.showSuccess(this.successMessage);
              this.dialogRef.close(true);
            },
            error: (error: RPCError) => {
              if (error.name === 'FormNotExistsException') {
                this.notificatorService.showError(this.noFormMessage);
              }
              if (error.name === 'PrivilegeException') {
                this.notificatorService.showError(this.privilegeMessage);
              }
              this.loading = false;
            },
          });
      }
    }
  }

  voSelected(vo: Vo): void {
    this.selectedVo = vo;
    this.cd.detectChanges();
    this.getGroups();
  }

  private getGroups(): void {
    if (this.selectedVo !== undefined) {
      this.groupService.getAllGroups(this.selectedVo.id).subscribe((groups) => {
        this.groups = [this.fakeGroup].concat(groups);
      });
    } else {
      this.groups = [this.fakeGroup];
    }
    this.selectedGroup = this.fakeGroup;
  }
}
