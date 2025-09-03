import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  imports: [CommonModule, MatButtonModule, MatIconModule, TranslateModule, MatTooltip],
  standalone: true,
  selector: 'perun-web-apps-refresh-button',
  templateUrl: './refresh-button.component.html',
  styleUrls: ['./refresh-button.component.scss'],
})
export class RefreshButtonComponent {
  @Output() refresh = new EventEmitter<MouseEvent>();
  @Input() disabled: boolean;

  onClickbutton(event: MouseEvent): void {
    this.refresh.emit(event);
  }
}
