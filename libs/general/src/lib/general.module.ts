import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServerDownDialogComponent } from './server-down-dialog/server-down-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { UserDontExistDialogComponent } from './user-dont-exist-dialog/user-dont-exist-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { PreventProxyOverloadDialogComponent } from './prevent-proxy-overload-dialog/prevent-proxy-overload-dialog.component';
import { UserNotAllowedAccessComponent } from './user-not-allowed-access/user-not-allowed-access.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [CommonModule, MatDialogModule, MatButtonModule, TranslateModule, MatIconModule],
  exports: [
    ServerDownDialogComponent,
    UserDontExistDialogComponent,
    UserNotAllowedAccessComponent,
    PreventProxyOverloadDialogComponent,
  ],
  declarations: [
    ServerDownDialogComponent,
    UserDontExistDialogComponent,
    UserNotAllowedAccessComponent,
    PreventProxyOverloadDialogComponent,
  ],
})
export class GeneralModule {}
