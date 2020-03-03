import { Component, OnInit } from '@angular/core';
import {SideMenuService} from '../../../core/services/common/side-menu.service';
import { Vo, VosManagerService } from '@perun-web-apps/perun/openapi';
import { getRecentlyVisited, getRecentlyVisitedIds } from '@perun-web-apps/perun/utils';
import { AuthResolverService } from '@perun-web-apps/perun/services';
import { MatDialog } from '@angular/material/dialog';
import { RemoveVoDialogComponent } from '../../../shared/components/dialogs/remove-vo-dialog/remove-vo-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';
import { CreateVoDialogComponent } from '../../../shared/components/dialogs/create-vo-dialog/create-vo-dialog.component';

@Component({
  selector: 'app-vo-select-page',
  templateUrl: './vo-select-page.component.html',
  styleUrls: ['./vo-select-page.component.scss']
})
export class VoSelectPageComponent implements OnInit {

  constructor(
    private sideMenuService: SideMenuService,
    private voService: VosManagerService,
    private authzService: AuthResolverService,
    private dialog: MatDialog
  ) { }

  vos: Vo[] = [];
  recentIds = [];
  loading: boolean;
  filterValue = '';

  isVoAdmin: boolean;

  selection: SelectionModel<Vo>;

  displayedColumns: string[];

  ngOnInit() {
    this.loading = true;
    this.selection = new SelectionModel<Vo>(false, []);
    this.isVoAdmin = this.authzService.isVoAdmin();
    this.displayedColumns = this.isVoAdmin ? ['checkbox', 'id', 'recent', 'name'] : ['id', 'recent', 'name'];
    this.sideMenuService.setAccessMenuItems([]);
    this.refreshTable();
  }

  refreshTable() {
    this.loading = true;
    this.selection.clear();
    this.voService.getMyVos().subscribe(vos => {
      this.vos = getRecentlyVisited('vos', vos);
      this.recentIds = getRecentlyVisitedIds('vos');
      this.loading = false;
    });
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
  }

  onCreateVo() {
    const dialogRef = this.dialog.open(CreateVoDialogComponent, {
      width: '600px',
      data: { theme: 'vo-theme'}
    });

    dialogRef.afterClosed().subscribe( isVoCreated => {
      if (isVoCreated){
        this.refreshTable();
      }
    });
  }

  onRemoveVo() {
    const dialogRef = this.dialog.open(RemoveVoDialogComponent, {
      width: '600px',
      data: { theme: 'vo-theme', vos: this.selection.selected}
    });

    dialogRef.afterClosed().subscribe( isVoRemoved => {
      if (isVoRemoved){
        this.refreshTable();
      }
    });
  }

}
