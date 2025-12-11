import { TranslateModule } from '@ngx-translate/core';
import { DebounceFilterComponent, RefreshButtonComponent } from '@perun-web-apps/perun/components';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FacilitiesManagerService, Facility, Host } from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { AddHostDialogComponent } from '../../../../shared/components/dialogs/add-host-dialog/add-host-dialog.component';
import { RemoveHostDialogComponent } from '../../../../shared/components/dialogs/remove-host-dialog/remove-host-dialog.component';
import { EntityStorageService, GuiAuthResolver } from '@perun-web-apps/perun/services';
import { BehaviorSubject } from 'rxjs';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { HostsListComponent } from '../../../../shared/components/hosts-list/hosts-list.component';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    DebounceFilterComponent,
    RefreshButtonComponent,
    TranslateModule,
    LoaderDirective,
    HostsListComponent,
    LoadingTableComponent,
  ],
  standalone: true,
  selector: 'app-facility-hosts',
  templateUrl: './facility-hosts.component.html',
  styleUrls: ['./facility-hosts.component.scss'],
})
export class FacilityHostsComponent implements OnInit {
  @Input()
  disableRouting = false;

  @Output()
  hostEmitter: EventEmitter<Host[]> = new EventEmitter<Host[]>();

  facility: Facility;
  hosts: Host[] = [];
  selected = new SelectionModel<Host>(true, [], true, (host1, hos2) => host1.id === hos2.id);
  cachedSubject = new BehaviorSubject(true);
  loading: boolean;
  filterValue = '';
  displayedColumns: string[] = ['id', 'name'];

  addAuth: boolean;
  removeAuth: boolean;
  routeAuth: boolean;

  constructor(
    private dialog: MatDialog,
    private facilitiesManager: FacilitiesManagerService,
    private authResolver: GuiAuthResolver,
    private entityStorageService: EntityStorageService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.facility = this.entityStorageService.getEntity();
    this.setAuthRights();
    this.refreshTable();
  }

  refreshTable(): void {
    this.loading = true;
    this.facilitiesManager.getHosts(this.facility.id).subscribe((hosts) => {
      this.hosts = hosts;
      this.hostEmitter.emit(this.hosts);
      this.selected.clear();
      this.cachedSubject.next(true);
      this.setAuthRights();
      this.loading = false;
    });
  }

  setAuthRights(): void {
    this.addAuth = this.authResolver.isAuthorized('addHosts_Facility_List<String>_policy', [
      this.facility,
    ]);
    this.removeAuth = this.authResolver.isAuthorized('removeHosts_List<Host>_Facility_policy', [
      this.facility,
    ]);

    this.displayedColumns = this.removeAuth ? ['select', 'id', 'name'] : ['id', 'name'];

    if (this.hosts.length !== 0) {
      this.routeAuth = this.authResolver.isAuthorized('getHostById_int_policy', [
        this.facility,
        this.hosts[0],
      ]);
    }
  }

  addHost(): void {
    const config = getDefaultDialogConfig();
    config.width = '600px';
    config.data = {
      facilityId: this.facility.id,
      theme: 'facility-theme',
    };

    const dialogRef = this.dialog.open(AddHostDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshTable();
      }
    });
  }

  removeHost(): void {
    const config = getDefaultDialogConfig();
    config.width = '600px';
    config.data = {
      facilityId: this.facility.id,
      theme: 'facility-theme',
      hosts: this.selected.selected,
    };

    const dialogRef = this.dialog.open(RemoveHostDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshTable();
      }
    });
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.refreshTable();
  }
}
