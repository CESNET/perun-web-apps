import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  imports: [CommonModule, MatButtonModule, MatIconModule],
  standalone: true,
  selector: 'perun-web-apps-deselect-button',
  templateUrl: './deselect-button.component.html',
  styleUrls: ['./deselect-button.component.scss'],
})
export class DeselectButtonComponent {
  @Input() isDisabled = true;
  @Output() deselect = new EventEmitter<MouseEvent>();

  onClickButton(event: MouseEvent): void {
    this.deselect.emit(event);
  }
}
