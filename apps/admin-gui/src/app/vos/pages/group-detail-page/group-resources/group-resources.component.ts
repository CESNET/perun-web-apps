import {Component, HostBinding, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SelectionModel} from '@angular/cdk/collections';
import { ResourcesService } from '@perun-web-apps/perun/services';
import { RichResource } from '@perun-web-apps/perun/models';
import { Group, GroupsManagerService } from '@perun-web-apps/perun/openapi';

@Component({
  selector: 'app-group-resources',
  templateUrl: './group-resources.component.html',
  styleUrls: ['./group-resources.component.scss']
})
export class GroupResourcesComponent implements OnInit {

  static id = 'GroupResourcesComponent';

  // used for router animation
  @HostBinding('class.router-component') true;

  constructor(private resourcesService: ResourcesService,
              private groupService: GroupsManagerService,
              private route: ActivatedRoute) {
  }

  group: Group;
  resources: RichResource[] = null;
  selected = new SelectionModel<RichResource>(true, []);

  loading: boolean;
  filterValue = '';

  ngOnInit() {
    this.route.parent.params.subscribe(parentParams => {
      const groupId = parentParams['groupId'];

      this.groupService.getGroupById(groupId).subscribe(group => {
        this.group = group;

        this.refreshTable();
      });
    });
  }

  refreshTable() {
    this.loading = true;
    this.resourcesService.getResourcesByGroup(this.group.id).subscribe(resources => {
      this.resources = resources;
      this.loading = false;
    });
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
  }
}
