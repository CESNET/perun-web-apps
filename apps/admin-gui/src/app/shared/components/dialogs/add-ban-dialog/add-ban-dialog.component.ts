import { TranslateModule } from '@ngx-translate/core';
import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BanSpecificationComponent } from '@perun-web-apps/perun/components';
import { Ban } from '@perun-web-apps/perun/openapi';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { MatStep, MatStepper } from '@angular/material/stepper';

export interface BanForm {
  description: string;
  validity: string;
}

export interface AddBanData<T extends Ban> {
  entityId: number;
  theme: string;
  bans: T[];
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    UiAlertsModule,
    LoadingDialogComponent,
    TranslateModule,
    BanSpecificationComponent,
    LoaderDirective,
    MatStep,
    MatStepper,
  ],
  standalone: true,
  selector: 'app-add-ban-dialog',
  templateUrl: './add-ban-dialog.component.html',
  styleUrls: ['./add-ban-dialog.component.scss'],
})
export class AddBanDialogComponent<T extends Ban> {
  @Input() loading = false;
  @Input() disabled = false;
  @Input() theme: string;
  @Input() ban: T;
  @Output() add = new EventEmitter<BanForm>();
  @Output() cancelled = new EventEmitter<void>();
  @ViewChild(BanSpecificationComponent) banForm: BanSpecificationComponent;

  addBan(): void {
    this.add.emit({
      description: this.banForm.getDescription(),
      validity: this.banForm.getValidity(),
    });
  }
}
