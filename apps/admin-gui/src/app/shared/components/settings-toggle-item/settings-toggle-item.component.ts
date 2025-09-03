import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { openClose } from '@perun-web-apps/perun/animations';
import { MatSlideToggle, MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  imports: [CommonModule, MatSlideToggleModule, FormsModule, ReactiveFormsModule],
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
