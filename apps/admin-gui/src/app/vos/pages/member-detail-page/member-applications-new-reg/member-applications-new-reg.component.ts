import { TranslateModule } from '@ngx-translate/core';
import {
  DebounceFilterComponent,
  RefreshButtonComponent,
  SimpleApplicationsListComponent,
} from '@perun-web-apps/perun/components';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AppState,
  Group,
  GroupsManagerService,
  Member,
  RegistrarManagerService,
  Vo,
  VosManagerService,
} from '@perun-web-apps/perun/openapi';
import {
  ApplicationDTO,
  IdmObject,
  SubmissionsService,
} from '@perun-web-apps/perun/registrar-openapi';
import { forkJoin } from 'rxjs';
import { EntityStorageService, PerunTranslateService } from '@perun-web-apps/perun/services';
import {
  ApplicationWithStringId,
  downloadApplicationsData,
  getDataForExport,
} from '@perun-web-apps/perun/utils';
import { getExportDataForColumn } from '@perun-web-apps/perun/utils';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    DebounceFilterComponent,
    RefreshButtonComponent,
    TranslateModule,
    SimpleApplicationsListComponent,
    LoadingTableComponent,
    LoaderDirective,
  ],
  standalone: true,
  selector: 'app-member-applications-new-reg',
  templateUrl: './member-applications-new-reg.component.html',
  styleUrls: ['./member-applications-new-reg.component.scss'],
})
export class MemberApplicationsNewRegComponent implements OnInit {
  member: Member;
  displayedColumns: string[] = [
    'id',
    'createdAt',
    'type',
    'state',
    'user',
    'groupName',
    'modifiedBy',
  ];
  detailedDisplayedColumns: string[] = [
    'id',
    'createdAt',
    'voId',
    'voName',
    'groupId',
    'groupName',
    'type',
    'state',
    'extSourceName',
    'extSourceType',
    'user',
    'createdBy',
    'modifiedBy',
    'modifiedAt',
    'fedInfo',
  ];
  filterValue = '';
  showAllDetails = false;
  loading = false;
  idToGroupMap = new Map<number, Group>();
  vo: Vo;

  applications: ApplicationWithStringId[] = [];

  constructor(
    private entityStorageService: EntityStorageService,
    private registrarService: RegistrarManagerService,
    private submissionsService: SubmissionsService,
    private translate: PerunTranslateService,
    private groupsManager: GroupsManagerService,
    private vosManager: VosManagerService,
  ) {}

  ngOnInit(): void {
    this.member = this.entityStorageService.getEntity();
    this.loadApplications();
  }

  loadApplications(): void {
    this.loading = true;

    forkJoin({
      vo: this.vosManager.getVoById(this.member.voId),
      groups: this.groupsManager.getAllGroups(this.member.voId),
    }).subscribe({
      next: ({ vo, groups }) => {
        this.vo = vo;
        const objectsToGet: IdmObject[] = [
          { idmObjectType: 'VO', objectId: this.member.voId.toString() },
        ];
        groups.forEach((group) => {
          this.idToGroupMap.set(group.id, group);
          objectsToGet.push({ idmObjectType: 'GROUP', objectId: group.id.toString() });
        });

        forkJoin({
          oldApps: this.registrarService.getApplicationsForMember(this.member.id),
          newApps: this.submissionsService.getApplicationsForUser({ idmObjects: objectsToGet }),
        }).subscribe({
          next: ({ oldApps, newApps }) => {
            const mappedOldApps: ApplicationWithStringId[] = oldApps.map((app) => ({
              ...app,
              uuid: '',
            }));
            const mappedNewApps: ApplicationWithStringId[] = [];
            newApps.forEach((app) => {
              const ourApp: ApplicationWithStringId = {
                uuid: app.application.id,
                vo: this.vo,
                type: app.application.type.formType === 'INITIAL' ? 'INITIAL' : 'EXTENSION',
                extSourceName: app.submission.identityIssuer,
                createdBy: app.submission.submitterName,
                createdAt: app.submission.timestamp,
                modifiedAt: app.submission.timestamp,
                modifiedBy: app.submission.submitterName,
                state: this.getState(app.application),
                user: null,
                fedInfo: Object.entries(app.submission.identityAttributes)
                  .map(([key, value]) => `${key}:${value}`)
                  .join(','),
              };
              if (app.form.idmObject.idmObjectType === 'GROUP') {
                ourApp.group = this.idToGroupMap.get(Number(app.form.idmObject.objectId));
              }
              const lastDecision = app.decisions?.[app.decisions.length - 1];
              if (lastDecision) {
                ourApp.modifiedAt = lastDecision.timestamp;
                ourApp.modifiedBy = lastDecision.approverName;
              }
              mappedNewApps.push(ourApp);
            });
            this.applications = [...mappedOldApps, ...mappedNewApps];
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          },
        });
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
  }

  showDetails(): void {
    this.showAllDetails = !this.showAllDetails;
  }

  refreshTable(): void {
    this.loadApplications();
  }

  downloadAll(a: { format: string; length: number }): void {
    downloadApplicationsData(
      getDataForExport(
        this.applications,
        this.showAllDetails ? this.detailedDisplayedColumns : this.displayedColumns,
        getExportDataForColumn,
      ),
      this.translate,
      a.format,
    );
  }

  private getState(app: ApplicationDTO): AppState {
    switch (app.state) {
      case 'APPROVED':
        return 'APPROVED';
      case 'REJECTED':
        return 'REJECTED';
      case 'VERIFIED':
        return 'VERIFIED';
      case 'SUBMITTED':
        return 'NEW';
    }
  }
}
