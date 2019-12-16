import {Component, HostBinding, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SelectionModel} from '@angular/cdk/collections';
import { ResourcesService, VoService } from '@perun-web-apps/perun/services';
import { RichResource, Vo } from '@perun-web-apps/perun/models';
import { RemoveResourceDialogComponent } from '../../../../../shared/components/dialogs/remove-resource-dialog/remove-resource-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-vo-resources-preview',
  templateUrl: './vo-resources-preview.component.html',
  styleUrls: ['./vo-resources-preview.component.scss']
})
export class VoResourcesPreviewComponent implements OnInit {

  static id = 'VoResourcesPreviewComponent';

  @HostBinding('class.router-component') true;

  constructor(private resourcesService: ResourcesService,
              private voService: VoService,
              private route: ActivatedRoute,
              private dialog: MatDialog) {
  }

  vo: Vo;
  resources: RichResource[] = [];
  selected = new SelectionModel<RichResource>(true, []);

  loading: boolean;
  filterValue = '';

  ngOnInit() {
    this.route.parent.parent.params.subscribe(parentParams => {
      const voId = parentParams['voId'];

      this.voService.getVoById(voId).subscribe(vo => {
        this.vo = vo;

        this.refreshTable();
      });
    });
  }

  refreshTable() {
    this.loading = true;
    this.resourcesService.getResourcesByVo(this.vo.id).subscribe(resources => {
      this.resources = resources;
      this.selected.clear();
      this.loading = false;
    });
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
  }

  deleteSelectedResources() {
    const dialogRef = this.dialog.open(RemoveResourceDialogComponent, {
      width: '450px',
      data: {theme: 'vo-theme', resources: this.selected.selected}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshTable();
      }
    });
  }
}
