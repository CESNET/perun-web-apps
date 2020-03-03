import {Component, HostBinding, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Vo, VosManagerService } from '@perun-web-apps/perun/openapi';
import { Role } from '@perun-web-apps/perun/models';

@Component({
  selector: 'app-vo-settings-managers',
  templateUrl: './vo-settings-managers.component.html',
  styleUrls: ['./vo-settings-managers.component.scss']
})
export class VoSettingsManagersComponent implements OnInit {

  @HostBinding('class.router-component') true;

  constructor(
    private dialog: MatDialog,
    private voService: VosManagerService,
    private route: ActivatedRoute
  ) { }

  vo: Vo;

  availableRoles: Role[] = [ Role.VOADMIN, Role.VOOBSERVER, Role.TOPGROUPCREATOR ];

  selected = 'user';

  type = 'Vo';

  theme = 'vo-theme';

  ngOnInit() {
    this.route.parent.parent.params.subscribe(parentParentParams => {
      const voId = parentParentParams ['voId'];

      this.voService.getVoById(voId).subscribe(vo => {
        this.vo = vo;
      });
    });
  }
}
