import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { openClose } from '@perun-web-apps/perun/animations';
import { MatSlideToggle, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltip, TooltipPosition } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@Component({
  imports: [
    CommonModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltip,
    MatIcon,
    MatIconButton,
  ],
  standalone: true,
  selector: 'app-settings-toggle-item',
  templateUrl: './settings-toggle-item.component.html',
  styleUrls: ['./settings-toggle-item.component.scss'],
  animations: [openClose],
})
export class SettingsToggleItemComponent implements AfterViewInit {
  @ViewChild(MatSlideToggle, { static: true })
  toggle: MatSlideToggle;
  @Input()
  title: string;
  @Input()
  tooltip: string;
  @Input()
  tooltipClass: string;
  @Input()
  tooltipPosition: TooltipPosition = 'above';
  @Input()
  tooltipShowDelay = 400;

  @Output() modelChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  modelValue: boolean;

  ngAfterViewInit(): void {
    this.toggle.change.subscribe(() => this.valueChanged());
  }

  valueChanged(): void {
    this.modelChange.emit(this.toggle.checked);
  }
}
