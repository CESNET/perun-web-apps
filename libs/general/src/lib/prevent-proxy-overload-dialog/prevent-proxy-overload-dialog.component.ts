import { TranslateModule } from '@ngx-translate/core';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Location, CommonModule } from '@angular/common';

export interface PreventProxyOverloadDialogData {
  title: string;
  message: string;
  action: string;
}

@Component({
  imports: [CommonModule, MatDialogModule, TranslateModule],
  standalone: true,
  selector: 'perun-web-apps-prevent-proxy-overload-dialog',
  templateUrl: './prevent-proxy-overload-dialog.component.html',
  styleUrls: ['./prevent-proxy-overload-dialog.component.css'],
})
export class PreventProxyOverloadDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PreventProxyOverloadDialogData,
    private location: Location,
  ) {}

  redirect(): void {
    this.location.go('/');
    location.reload();
  }
}
