import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServerDownDialogComponent } from './server-down-dialog/server-down-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  exports: [ServerDownDialogComponent],
  declarations: [ServerDownDialogComponent]
})
export class GeneralModule {}
