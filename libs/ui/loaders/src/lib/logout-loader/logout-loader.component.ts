import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  imports: [CommonModule],
  standalone: true,
  selector: 'perun-web-apps-logout-loader',
  templateUrl: './logout-loader.component.html',
  styleUrls: ['./logout-loader.component.scss'],
})
export class LogoutLoaderComponent {}
