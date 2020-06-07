import {Component, HostBinding, OnInit} from '@angular/core';
import {fadeIn} from '@perun-web-apps/perun/animations';

@Component({
  selector: 'app-facility-settings',
  templateUrl: './facility-settings.component.html',
  styleUrls: ['./facility-settings.component.scss'],
  animations: [
    fadeIn
  ]
})
export class FacilitySettingsComponent implements OnInit {

  @HostBinding('class.router-component') true;

  constructor() { }

  ngOnInit() {
  }
}
