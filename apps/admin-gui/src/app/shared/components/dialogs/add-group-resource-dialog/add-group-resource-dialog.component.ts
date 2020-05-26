import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { ResourcesManagerService, RichResource } from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';

export interface AddGroupResourceDialogData {
  theme: string;
  voId: number;
  groupId: number;
  unwantedResources: number[];
}

@Component({
  selector: 'app-add-group-resource-dialog',
  templateUrl: './add-group-resource-dialog.component.html',
  styleUrls: ['./add-group-resource-dialog.component.scss']
})
export class AddGroupResourceDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddGroupResourceDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: AddGroupResourceDialogData,
              private notificator: NotificatorService,
              private translate: TranslateService,
              private resourcesManager: ResourcesManagerService) {
  }

  loading: boolean;
  filterValue = '';
  resources: RichResource[] = [];
  hiddenColumns = ['tags', 'facility'];
  selection = new SelectionModel<RichResource>(true, []);
  theme = '';

  ngOnInit(): void {
    this.theme = this.data.theme;
    this.loading = true;
    this.resourcesManager.getResources(this.data.voId).subscribe(resources => {
      this.resources = resources.filter(res => !this.data.unwantedResources.includes(res.id));
      this.loading = false;
    });
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onSubmit() {
    this.loading = true;
    const resourceIds = this.selection.selected.map(res => res.id);
    this.resourcesManager.assignGroupToResources(this.data.groupId, resourceIds).subscribe(() => {
      this.translate.get('DIALOGS.ADD_GROUP_RESOURCES.SUCCESS').subscribe(successMessage => {
        this.loading = false;
        this.notificator.showSuccess(successMessage);
        this.dialogRef.close(true);
      });
    }, () => this.loading = false);
  }
}
