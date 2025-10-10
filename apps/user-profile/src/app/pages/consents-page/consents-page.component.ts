import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  imports: [CommonModule, RouterModule],
  standalone: true,
  selector: 'perun-web-apps-consents-page',
  templateUrl: './consents-page.component.html',
  styleUrls: ['./consents-page.component.scss'],
})
export class ConsentsPageComponent {}
