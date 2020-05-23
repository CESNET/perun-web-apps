import {Component, HostBinding, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {NotificatorService} from '@perun-web-apps/perun/services';
import {TranslateService} from '@ngx-translate/core';
import {AttributesListComponent} from '@perun-web-apps/perun/components';
import {SelectionModel} from '@angular/cdk/collections';
import {
  DeleteAttributeDialogComponent
} from '../../../../../shared/components/dialogs/delete-attribute-dialog/delete-attribute-dialog.component';
import {
  CreateAttributeDialogComponent
} from '../../../../../shared/components/dialogs/create-attribute-dialog/create-attribute-dialog.component';
import { filterCoreAttributes } from '@perun-web-apps/perun/utils';
import { Attribute, AttributesManagerService } from '@perun-web-apps/perun/openapi';
import { EditAttributeDialogComponent } from '../../../../../shared/components/dialogs/edit-attribute-dialog/edit-attribute-dialog.component';
import { PageEvent } from '@angular/material/paginator';
import {
  TABLE_ATTRIBUTES_SETTINGS,
  TableConfigService
} from '@perun-web-apps/config/table-config';

@Component({
  selector: 'app-resource-settings-attributes',
  templateUrl: './resource-settings-attributes.component.html',
  styleUrls: ['./resource-settings-attributes.component.scss']
})
export class ResourceSettingsAttributesComponent implements OnInit {

  @HostBinding('class.router-component') true;

  constructor(private attributesManager: AttributesManagerService,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private notificator: NotificatorService,
              private tableConfigService: TableConfigService,
              private translate: TranslateService) {
    this.translate.get('RESOURCE_DETAIL.SETTINGS.ATTRIBUTES.SUCCESS_SAVE').subscribe(value => this.saveSuccessMessage = value);
    this.translate.get('RESOURCE_DETAIL.SETTINGS.ATTRIBUTES.SUCCESS_DELETE').subscribe(value => this.deleteSuccessMessage = value);
  }

  @ViewChild('list')
  list: AttributesListComponent;

  attributes: Attribute[] = [];
  selection = new SelectionModel<Attribute>(true, []);
  resourceId: number;
  saveSuccessMessage: string;
  deleteSuccessMessage: string;
  loading: boolean;
  filterValue = '';
  tableId = TABLE_ATTRIBUTES_SETTINGS;
  pageSize: number;

  ngOnInit() {
    this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
    this.route.parent.parent.params.subscribe(params => {
      this.resourceId = params['resourceId'];
      this.refreshTable();
    });
  }

  onDelete() {
    const dialogRef = this.dialog.open(DeleteAttributeDialogComponent, {
      width: '450px',
      data: {
        entityId: this.resourceId,
        entity: 'resource',
        attributes: this.selection.selected
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshTable();
      }
    });
  }

  onSave() {
    // have to use this to update attribute with map in it, before saving it
    this.list.updateMapAttributes();

    const dialogRef = this.dialog.open(EditAttributeDialogComponent, {
      width: '450px',
      data: {
        entityId: this.resourceId,
        entity: 'resource',
        attributes: this.selection.selected
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshTable();
      }
    });
  }

  onCreate() {
    const dialogRef = this.dialog.open(CreateAttributeDialogComponent, {
      width: '1050px',
      data: {
        entityId: this.resourceId,
        entity: 'resource',
        notEmptyAttributes: this.attributes,
        style: 'resource-theme'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
       this.refreshTable();
      }
    });
  }

  refreshTable() {
    this.loading = true;
    this.attributesManager.getResourceAttributes(this.resourceId).subscribe(attributes => {
      this.attributes = filterCoreAttributes(attributes);
      this.selection.clear();
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
