import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { User, UsersManagerService } from '@perun-web-apps/perun/openapi';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { GuiAuthResolver, NotificatorService, StoreService } from '@perun-web-apps/perun/services';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UserFullNamePipe } from '@perun-web-apps/perun/pipes';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

export interface RemoveUserServiceIdentityDialogData {
  theme: string;
  userId: number;
  specificUser: User;
  isService: boolean;
  targetTitle: 'USER' | 'SELF' | 'SERVICE';
  targetDescription: 'USER' | 'SELF' | 'SERVICE';
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    UiAlertsModule,
    LoadingDialogComponent,
    MatTableModule,
    TranslateModule,
    UserFullNamePipe,
    LoaderDirective,
  ],
  standalone: true,
  selector: 'app-disconnect-identity-dialog',
  templateUrl: './disconnect-identity-dialog.component.html',
  styleUrls: ['./disconnect-identity-dialog.component.scss'],
})
export class DisconnectIdentityDialogComponent implements OnInit {
  theme: string;
  loading: boolean = false;
  displayedColumns: string[] = ['name'];
  dataSource: MatTableDataSource<User>;
  targetTitle: string;
  targetDescription: string;
  disconnectingLastOwner: boolean;
  disconnectingSelf: boolean;
  disconnectingAnonymizedUser: boolean;
  private userId: number;
  private isService: boolean;

  constructor(
    private dialogRef: MatDialogRef<DisconnectIdentityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: RemoveUserServiceIdentityDialogData,
    public userManager: UsersManagerService,
    private notificator: NotificatorService,
    private translate: TranslateService,
    private store: StoreService,
    private authService: GuiAuthResolver,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.targetTitle = this.data.targetTitle;
    this.targetDescription = this.data.targetDescription;
    this.theme = this.data.theme;
    this.userId = Number(this.data.userId);
    this.dataSource = new MatTableDataSource<User>([this.data.specificUser]);
    this.isService = this.data.isService;

    let specificUser: number;
    let removedOwnerId: number;
    if (this.isService) {
      specificUser = this.userId;
      removedOwnerId = this.dataSource.data[0].id;
      this.disconnectingSelf =
        !this.authService.isPerunAdmin() &&
        removedOwnerId === this.store.getPerunPrincipal().userId;
    } else {
      specificUser = this.dataSource.data[0].id;
      removedOwnerId = this.userId;
      this.disconnectingSelf =
        !this.authService.isPerunAdmin() && this.userId === this.store.getPerunPrincipal().userId;
    }

    this.userManager.getUnanonymizedUsersBySpecificUser(specificUser).subscribe({
      next: (associatedUsers: Array<User>) => {
        if (associatedUsers.length === 1) {
          this.disconnectingLastOwner = associatedUsers[0].id === removedOwnerId;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onConfirm(): void {
    let owner: number;
    let specificUser: number;

    if (this.isService) {
      owner = this.dataSource.data[0].id;
      specificUser = this.userId;
    } else {
      owner = this.userId;
      specificUser = this.dataSource.data[0].id;
    }

    this.userManager.removeSpecificUserOwner(owner, specificUser).subscribe(() => {
      this.notificator.showSuccess(
        this.translate.instant('DIALOGS.DISCONNECT_IDENTITY.SUCCESS') as string,
      );
      this.dialogRef.close(true);
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
