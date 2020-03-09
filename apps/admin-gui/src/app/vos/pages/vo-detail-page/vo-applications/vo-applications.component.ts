import {Component, HostBinding, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { Application, RegistrarManagerService, Vo, VosManagerService } from '@perun-web-apps/perun/openapi';

@Component({
  selector: 'app-vo-applications',
  templateUrl: './vo-applications.component.html',
  styleUrls: ['./vo-applications.component.scss']
})
export class VoApplicationsComponent implements OnInit {

  static id = 'VoApplicationsComponent';

  @HostBinding('class.router-component') true;

  constructor(private voService: VosManagerService,
              private registrarManager: RegistrarManagerService,
              protected route: ActivatedRoute) { }

  state = 'pending';
  loading = false;
  applications: Application[] = [];
  vo: Vo;
  displayedColumns: string[] = ['id', 'createdAt', 'type', 'state', 'user', 'extSourceLoa', 'group', 'modifiedBy'];
  firstSearchDone: boolean;
  filterValue = '';

  ngOnInit() {
    this.loading = true;
    this.route.parent.params.subscribe(parentParams => {
      const voId = parentParams['voId'];
      this.voService.getVoById(voId).subscribe(vo => {
        this.vo = vo;
        this.setData(['NEW', 'VERIFIED']);
      });
    });
  }


  setData(state: string[]) {
    this.registrarManager.getApplicationsForVo(this.vo.id, state).subscribe(applications => {
      this.applications = applications;
      this.loading = false;
    });
  }

  select() {
    this.loading = true;
    switch (this.state) {
      case 'approved': {
        this.setData(['APPROVED']);
        break;
      }
      case 'rejected': {
        this.setData(['REJECTED']);
        break;
      }
      case 'wfmv': {
        this.setData(['NEW']);
        break;
      }
      case 'submited': {
        this.setData(['VERIFIED']);
        break;
      }
      case 'pending': {
        this.setData(['NEW', 'VERIFIED']);
        break;
      }
      case 'all': {
        this.registrarManager.getApplicationsForVo(this.vo.id).subscribe(applications => {
          this.applications = applications;
          this.loading = false;
        });
        break;
      }
      default: {
        break;
      }
    }
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
  }
}
