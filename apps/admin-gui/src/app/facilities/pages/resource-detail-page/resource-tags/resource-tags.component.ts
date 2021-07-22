import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Resource, ResourcesManagerService, ResourceTag, VosManagerService } from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { TABLE_RESOURCES_TAGS, TableConfigService } from '@perun-web-apps/config/table-config';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { PageEvent } from '@angular/material/paginator';
import { GuiAuthResolver, NotificatorService } from '@perun-web-apps/perun/services';
import { UniversalRemoveItemsDialogComponent } from '@perun-web-apps/perun/dialogs';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AddResourceTagToResourceDialogComponent } from '../../../../shared/components/dialogs/add-resource-tag-to-resource-dialog/add-resource-tag-to-resource-dialog.component';

@Component({
  selector: 'app-perun-web-apps-resource-tags',
  templateUrl: './resource-tags.component.html',
  styleUrls: ['./resource-tags.component.scss']
})
export class ResourceTagsComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private authResolver: GuiAuthResolver,
              private tableConfigService: TableConfigService,
              private resourcesManager: ResourcesManagerService,
              private voService: VosManagerService,
              private dialog: MatDialog,
              private notificator: NotificatorService,
              private translate: TranslateService) { }

  loading = false;
  resourceTags: ResourceTag[] = [];
  voId: number;
  resourceId: number;
  resource: Resource;

  selection = new SelectionModel<ResourceTag>(true, []);

  filterValue: string;
  pageSize: number;
  tableId = TABLE_RESOURCES_TAGS;
  displayedColumns = [];

  addAuth: boolean;
  removeAuth: boolean;

  ngOnInit() {
    this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);

    this.route.parent.params.subscribe(params => {
      this.voId = params['voId'];
      this.resourceId = params['resourceId'];
      this.resourcesManager.getResourceById(this.resourceId).subscribe(resource => {
        this.resource = resource;
        this.updateData();
      })
    });
  }

  removeTags() {
    const config = getDefaultDialogConfig();
    config.width = '450px';
    config.data = {items: this.selection.selected.map(tag => tag.tagName),
      title: 'RESOURCE_DETAIL.TAGS.REMOVE_TAGS_DIALOG_TITLE',
      description: 'RESOURCE_DETAIL.TAGS.REMOVE_TAGS_DIALOG_DESCRIPTION',
      theme: 'resource-theme'};

    const dialogRef = this.dialog.open(UniversalRemoveItemsDialogComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeTag(this.selection.selected);
      }
    });
  }

  removeTag(tags: ResourceTag[]) {
    if(tags.length === 0) {
      this.notificator.showSuccess(this.translate.instant('RESOURCE_DETAIL.TAGS.REMOVED_SUCCESSFULLY'));
      return this.updateData();
    }
    const tag = tags.pop();
    this.resourcesManager.removeResourceTagFromResource({
      resource: this.resourceId,
      resourceTag: tag
    }).subscribe(() => {
      this.removeTag(tags);
    });
  }

  addTag() {
    const config = getDefaultDialogConfig();
    config.width = '600px';
    config.data = {voId: this.voId, resourceId: this.resourceId, assignedTags: this.resourceTags, theme: 'resource-theme'};

    const dialogRef = this.dialog.open(AddResourceTagToResourceDialogComponent, config);

    dialogRef.afterClosed().subscribe( success => {
      if (success) {
        this.notificator.showSuccess(this.translate.instant('RESOURCE_DETAIL.TAGS.ADDED_SUCCESSFULLY'));
        this.updateData();
      }
    });
  }

  updateData() {
    this.loading = true;
    this.selection.clear();
    this.resourcesManager.getAllResourcesTagsForResource(this.resourceId).subscribe(tags => {
      this.resourceTags = tags;
      this.selection.clear();
      this.setAuthRights();
      this.loading = false;
    });
  }

  setAuthRights() {
    this.displayedColumns = [];
    this.addAuth = this.authResolver.isAuthorized('assignResourceTagToResource_ResourceTag_Resource_policy', [this.resource]);
    this.removeAuth = this.authResolver.isAuthorized('removeResourceTagFromResource_ResourceTag_Resource_policy', [this.resource]);
    this.displayedColumns = this.removeAuth ? ['select', 'id', 'name'] : ['id', 'name'];
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
  }
}
