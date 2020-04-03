import {Component, HostBinding} from '@angular/core';
import {MenuItem} from '../../../../../../../../../libs/perun/models/src/lib/MenuItem';

@Component({
  selector: 'app-visualizer-overview',
  templateUrl: './visualizer-overview.component.html',
  styleUrls: ['./visualizer-overview.component.scss']
})
export class VisualizerOverviewComponent {

  @HostBinding('class.router-component') true;

  constructor() { }

  items: MenuItem[] = [
    {
      cssIcon: 'perun-module-dependencies',
      url: `attrDependencies`,
      label: 'MENU_ITEMS.VISUALIZER.ATTR_DEPENDENCIES',
      style: 'admin-btn'
    },
    {
      cssIcon: 'perun-user-destination-relationship',
      url: `userDestinationRelationship`,
      label: 'MENU_ITEMS.VISUALIZER.USER_DESTINATION',
      style: 'admin-btn'
    }
  ];
}
