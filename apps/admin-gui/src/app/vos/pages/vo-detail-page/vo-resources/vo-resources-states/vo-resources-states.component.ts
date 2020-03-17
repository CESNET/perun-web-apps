import {Component, HostBinding, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CustomIconService} from '@perun-web-apps/perun/services';
import { ResourceState, TasksManagerService } from '@perun-web-apps/perun/openapi';

@Component({
  selector: 'app-vo-resources-states',
  templateUrl: './vo-resources-states.component.html',
  styleUrls: ['./vo-resources-states.component.scss']
})
export class VoResourcesStatesComponent implements OnInit {

  static id = 'VoResourcesStatesComponent';

  @HostBinding('class.router-component') true;

  constructor(private route: ActivatedRoute,
              private taskService: TasksManagerService,
              private customIconService: CustomIconService) { }

  loading = false;
  okPropagation: ResourceState[];
  errorPropagation: ResourceState[];
  resourceStates: ResourceState[] = [];

  voId: number;
  selectedIndex = 0;

  ngOnInit() {
    this.customIconService.registerPerunRefreshIcon();
    this.loading = true;
    this.route.parent.parent.params.subscribe(parentParams => {
      this.voId = parentParams['voId'];
      this.refreshTable();
    });
  }

  refreshTable() {
    console.log(this.selectedIndex);
    this.loading = true;
    this.taskService.getAllResourcesState(this.voId).subscribe( resourceStates => {
      this.resourceStates = resourceStates;
      this.okPropagation = [];
      this.errorPropagation = [];

      for (const resourceState of resourceStates) {
        let indicator = true;
        for (const task of resourceState.taskList) {
          if (task.status === 'ERROR' || task.status === 'GENERROR' || task.status === 'SENDERROR') {
            indicator = false;
            break;
          }
        }
        if (indicator) {
          this.okPropagation.push(resourceState);
        } else {
          this.errorPropagation.push(resourceState);
        }
      }
      this.loading = false;
    });
  }
}
