import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Location } from '@angular/common';

export interface PreventProxyOverloadDialogData {
  title: string;
  message: string;
  action: string;
}

@Component({
  selector: 'perun-web-apps-prevent-proxy-overload-dialog',
  templateUrl: './prevent-proxy-overload-dialog.component.html',
  styleUrls: ['./prevent-proxy-overload-dialog.component.css'],
})
export class PreventProxyOverloadDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PreventProxyOverloadDialogData,
    private location: Location
  ) {}

  redirect() {
    this.location.go('/');
    location.reload();
  }
}
