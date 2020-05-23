import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { CreateResourceTagDialogComponent } from '../../../../../shared/components/dialogs/create-resource-tag-dialog/create-resource-tag-dialog.component';
import { DeleteResourceTagDialogComponent } from '../../../../../shared/components/dialogs/delete-resource-tag-dialog/delete-resource-tag-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { ResourcesManagerService, ResourceTag } from '@perun-web-apps/perun/openapi';
import { PageEvent } from '@angular/material/paginator';
import { TABLE_VO_RESOURCES_TAGS, TableConfigService } from '@perun-web-apps/config/table-config';

@Component({
  selector: 'app-vo-resources-tags',
  templateUrl: './vo-resources-tags.component.html',
  styleUrls: ['./vo-resources-tags.component.scss']
})
export class VoResourcesTagsComponent implements OnInit {
  @HostBinding('class.router-component') true;

  constructor(private route: ActivatedRoute,
              private resourceManager: ResourcesManagerService,
              private dialog: MatDialog,
              private notificator: NotificatorService,
              private tableConfigService: TableConfigService,
              private translator: TranslateService) { }

  loading = false;
  resourceTag: ResourceTag[] = [];
  voId: number;

  selection = new SelectionModel<ResourceTag>(true, []);

  filterValue: string;
  pageSize: number;
  tableId = TABLE_VO_RESOURCES_TAGS;

  ngOnInit() {
    this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
    this.route.parent.parent.params.subscribe(parentParams => {
      this.voId = parentParams['voId'];
      this.updateData();
    });
  }

  deleteTag() {
    const dialogRef = this.dialog.open(DeleteResourceTagDialogComponent, {
      width: '450px',
      data: {tagsForDelete: this.selection.selected}
    });

    dialogRef.afterClosed().subscribe( success => {
      if (success) {
        this.translator.get('VO_DETAIL.RESOURCES.TAGS.DELETE_SUCCESS').subscribe( text => {
          this.notificator.showSuccess(text);
        });
        this.updateData();
      }
    });
  }

  create() {
    const dialogRef = this.dialog.open(CreateResourceTagDialogComponent, {
      width: '450px',
      data: {voId: this.voId}
    });

    dialogRef.afterClosed().subscribe( success => {
      if (success) {
        this.translator.get('VO_DETAIL.RESOURCES.TAGS.CREATE_SUCCESS').subscribe( text => {
          this.notificator.showSuccess(text);
        });
        this.updateData();
      }
    });
  }
  updateData() {
    this.loading = true;
    this.selection.clear();
    this.resourceManager.getAllResourcesTagsForVo(this.voId).subscribe(tags => {
      this.resourceTag = tags;
      this.loading = false;
    });
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
  }
}
