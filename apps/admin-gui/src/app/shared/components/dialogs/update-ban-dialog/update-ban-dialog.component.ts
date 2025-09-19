import { TranslateModule } from '@ngx-translate/core';
import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Ban } from '@perun-web-apps/perun/openapi';
import { BanForm } from '../add-ban-dialog/add-ban-dialog.component';
import { BanSpecificationComponent } from '@perun-web-apps/perun/components';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

export interface UpdateBanData<T extends Ban> {
  ban: T;
  theme: string;
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    LoadingDialogComponent,
    TranslateModule,
    BanSpecificationComponent,
    LoaderDirective,
  ],
  standalone: true,
  selector: 'app-update-ban-dialog',
  templateUrl: './update-ban-dialog.component.html',
  styleUrls: ['./update-ban-dialog.component.scss'],
})
export class UpdateBanDialogComponent {
  @Input() loading = false;
  @Input() ban: Ban;
  @Input() theme: string;
  @Output() cancelled = new EventEmitter<void>();
  @Output() update = new EventEmitter<BanForm>();
  @ViewChild(BanSpecificationComponent) banForm: BanSpecificationComponent;

  updateBan(): void {
    this.update.emit({
      description: this.banForm.getDescription(),
      validity: this.banForm.getValidity(),
    });
  }
}
