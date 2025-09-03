import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule, TranslateModule],
  standalone: true,
  selector: 'perun-web-apps-create-publication-page',
  templateUrl: './create-publication-page.component.html',
  styleUrls: ['./create-publication-page.component.scss'],
})
export class CreatePublicationPageComponent {
  constructor(private router: Router) {}

  importPublications(): void {
    void this.router.navigate(['create-publication', 'import'], {
      queryParamsHandling: 'preserve',
    });
  }

  createPublication(): void {
    void this.router.navigate(['create-publication', 'create'], {
      queryParamsHandling: 'preserve',
    });
  }
}
