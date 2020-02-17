import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {SideMenuService} from '../../../../core/services/common/side-menu.service';
import {ActivatedRoute} from '@angular/router';
import {SelectionModel} from '@angular/cdk/collections';
import {MatDialog} from '@angular/material';
import {
  RemoveResourceDialogComponent} from '../../../../shared/components/dialogs/remove-resource-dialog/remove-resource-dialog.component';
import { FacilityService } from '@perun-web-apps/perun/services';
import { FacilitiesManagerService, Facility, RichResource } from '@perun-web-apps/perun/openapi';
import { CreateResourceDialogComponent } from '../../../../shared/components/dialogs/create-resource-dialog/create-resource-dialog.component';

@Component({
  selector: 'app-facility-resources',
  templateUrl: './facility-resources.component.html',
  styleUrls: ['./facility-resources.component.scss']
})
export class FacilityResourcesComponent implements OnInit {

  static id = 'FacilityResourcesComponent';

  // class used for animation
  @HostBinding('class.router-component') true;

  constructor(private dialog: MatDialog,
              private facilitiesManager: FacilitiesManagerService,
              private sideMenuService: SideMenuService,
              private facilityService: FacilityService,
              private route: ActivatedRoute) {
  }

  @Input()
  facility: Facility;
  resources: RichResource[] = [];
  selected = new SelectionModel<RichResource>(true, []);

  filterValue = '';

  loading: boolean;

  ngOnInit() {
    this.route.parent.params.subscribe(parentParams => {
      const facilityId = parentParams['facilityId'];

      this.facilityService.getFacilityById(facilityId).subscribe(facility => {
        this.facility = facility;

        this.refreshTable();
      });
    });
  }

  removeResource() {
    const dialogRef = this.dialog.open(RemoveResourceDialogComponent, {
      width: '450px',
      data: {theme: 'facility-theme', resources: this.selected.selected}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshTable();
      }
    });
  }

  refreshTable() {
    this.loading = true;
    this.facilitiesManager.getAssignedRichResourcesForFacility(this.facility.id).subscribe(resources => {
      this.resources = resources;
      this.selected.clear();
      this.loading = false;
    });
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
  }

  createResource() {
    const dialogRef = this.dialog.open(CreateResourceDialogComponent, {
      width: '600px',
      data: {facilityId: this.facility.id, theme: 'facility-theme'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshTable();
      }
    });
  }
}
