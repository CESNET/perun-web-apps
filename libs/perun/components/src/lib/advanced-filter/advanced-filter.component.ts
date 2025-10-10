import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  imports: [CommonModule, MatButtonModule, MatIconModule, TranslateModule],
  standalone: true,
  selector: 'perun-web-apps-advanced-filter',
  templateUrl: './advanced-filter.component.html',
  styleUrls: ['./advanced-filter.component.scss'],
})
export class AdvancedFilterComponent implements OnInit {
  @Input() filtersCount: number;
  @Input() advancedFilter: boolean;
  @Output() changeAdvancedFilter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() clearFilters: EventEmitter<void> = new EventEmitter<void>();

  ngOnInit(): void {
    this.changeAdvancedFilter.emit(this.advancedFilter);
  }

  toggleAdvancedFilter(): void {
    this.advancedFilter = !this.advancedFilter;
    this.changeAdvancedFilter.emit(this.advancedFilter);
  }
}
