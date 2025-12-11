import { TranslateModule } from '@ngx-translate/core';
import {
  DebounceFilterComponent,
  FacilitiesListComponent,
  RefreshButtonComponent,
} from '@perun-web-apps/perun/components';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EnrichedFacility, FacilitiesManagerService } from '@perun-web-apps/perun/openapi';
import { ActivatedRoute } from '@angular/router';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';

@Component({
  imports: [
    CommonModule,
    DebounceFilterComponent,
    RefreshButtonComponent,
    TranslateModule,
    FacilitiesListComponent,
    LoaderDirective,
    LoadingTableComponent,
  ],
  standalone: true,
  selector: 'app-user-facilities',
  templateUrl: './user-facilities.component.html',
  styleUrls: ['./user-facilities.component.scss'],
})
export class UserFacilitiesComponent implements OnInit {
  facilities: EnrichedFacility[] = [];
  userId: number;
  loading: boolean;
  filterValue = '';
  displayedColumns = ['id', 'name', 'description'];

  constructor(
    private facilityManager: FacilitiesManagerService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.route.parent.params.subscribe((params) => {
      this.userId = Number(params['userId']);
      this.refreshTable();
    });
  }

  refreshTable(): void {
    this.loading = true;
    this.facilityManager.getAssignedFacilitiesByUser(this.userId).subscribe((facilities) => {
      this.facilities = facilities.map((f) => ({ facility: f }));
      this.loading = false;
    });
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
  }
}
