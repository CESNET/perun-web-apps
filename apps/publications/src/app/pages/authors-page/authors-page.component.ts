import { TranslateModule } from '@ngx-translate/core';
import { DebounceFilterComponent, RefreshButtonComponent } from '@perun-web-apps/perun/components';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Author, CabinetManagerService } from '@perun-web-apps/perun/openapi';
import { AuthorsListComponent } from '../../components/authors-list/authors-list.component';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

@Component({
  imports: [
    CommonModule,
    MatIconModule,
    DebounceFilterComponent,
    RefreshButtonComponent,
    TranslateModule,
    AuthorsListComponent,
    LoadingTableComponent,
    LoaderDirective,
  ],
  standalone: true,
  selector: 'perun-web-apps-authors-page',
  templateUrl: './authors-page.component.html',
  styleUrls: ['./authors-page.component.scss'],
})
export class AuthorsPageComponent implements OnInit {
  filterValue = '';
  loading: boolean;
  authors: Author[] = [];

  constructor(private cabinetService: CabinetManagerService) {}

  ngOnInit(): void {
    this.refreshTable();
  }

  refreshTable(): void {
    this.loading = true;
    this.cabinetService.findAllAuthors().subscribe((authors) => {
      this.authors = authors;
      this.loading = false;
    });
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
  }
}
