import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  imports: [CommonModule, MatButtonModule, TranslateModule],
  standalone: true,
  selector: 'perun-web-apps-not-authorized-page',
  templateUrl: './not-authorized-page.component.html',
  styleUrls: ['./not-authorized-page.component.scss'],
})
export class NotAuthorizedPageComponent {
  constructor(private router: Router) {}

  redirectToHome(): void {
    void this.router.navigate(['/home'], { queryParamsHandling: 'merge' });
  }
}
