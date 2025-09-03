import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Destination, Host } from '@perun-web-apps/perun/openapi';

@Component({
  imports: [CommonModule, MatButtonModule, MatIconModule, TranslateModule, MatTooltip],
  standalone: true,
  selector: 'perun-web-apps-object-list-values',
  templateUrl: './object-list-values.component.html',
  styleUrls: ['./object-list-values.component.css'],
})
export class ObjectListValuesComponent implements OnInit, OnChanges {
  @Input() objects: Destination[] | Host[] = [];
  @Input() filterValue = '';
  @Input() paramName = '';

  showMore = false;
  defaultItemsShown = 3;
  itemsShown: number;

  ngOnInit(): void {
    this.itemsShown = this.defaultItemsShown;
  }

  ngOnChanges(): void {
    this.itemsShown = this.defaultItemsShown;
    this.showMore = false;
  }

  onShowChange(): void {
    this.showMore = !this.showMore;
    if (this.showMore) {
      this.itemsShown = this.objects.length;
    } else {
      this.itemsShown = this.defaultItemsShown;
    }
  }
}
