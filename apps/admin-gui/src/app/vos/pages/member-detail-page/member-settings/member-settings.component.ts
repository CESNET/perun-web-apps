import {Component, HostBinding, OnInit} from '@angular/core';
import {fadeIn} from '@perun-web-apps/perun/animations';

@Component({
  selector: 'app-member-settings',
  templateUrl: './member-settings.component.html',
  styleUrls: ['./member-settings.component.scss'],
  animations: [
    fadeIn
  ]
})
export class MemberSettingsComponent implements OnInit {

  @HostBinding('class.router-component') true;

  constructor() {
  }

  ngOnInit(): void {
  }
}
