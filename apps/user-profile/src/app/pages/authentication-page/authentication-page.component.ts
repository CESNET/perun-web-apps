import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  imports: [CommonModule, RouterModule],
  standalone: true,
  selector: 'perun-web-apps-authentication-page',
  templateUrl: './authentication-page.component.html',
  styleUrls: ['./authentication-page.component.scss'],
})
export class AuthenticationPageComponent {}
