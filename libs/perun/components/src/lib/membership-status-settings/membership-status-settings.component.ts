import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { MatDivider } from '@angular/material/divider';
import {
  ParseDatePipe,
  MemberStatusIconPipe,
  TransformMemberStatusPipe,
} from '@perun-web-apps/perun/pipes';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GroupStatusIconColorPipe } from '@perun-web-apps/perun/pipes';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    ParseDatePipe,
    MemberStatusIconPipe,
    TransformMemberStatusPipe,
    MatDivider,
    TranslateModule,
    MatTooltip,
    GroupStatusIconColorPipe,
  ],
  standalone: true,
  selector: 'perun-web-apps-membership-status-settings',
  templateUrl: './membership-status-settings.component.html',
  styleUrls: ['./membership-status-settings.component.scss'],
})
export class MembershipStatusSettingsComponent {
  @Input() status = '';
  @Input() expiration: string;
  @Input() showExpiration = true;
  @Input() editExpirationAuth = false;
  @Input() editStatusAuth = false;
  @Output() changeStatus = new EventEmitter<void>();
  @Output() changeExpiration = new EventEmitter<void>();

  onChangeStatus(): void {
    this.changeStatus.emit();
  }

  onChangeExpiration(): void {
    this.changeExpiration.emit();
  }
}
