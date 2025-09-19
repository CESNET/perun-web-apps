import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { GroupFlatNode } from '@perun-web-apps/perun/models';
import { GuiAuthResolver } from '@perun-web-apps/perun/services';
import { GroupSyncIconColorPipe } from '@perun-web-apps/perun/pipes';
import { GroupSyncToolTipPipe } from '@perun-web-apps/perun/pipes';
import { GroupSyncIconPipe } from '@perun-web-apps/perun/pipes';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    CdkCopyToClipboard,
    MatMenuModule,
    TranslateModule,
    MatTooltip,
    GroupSyncIconColorPipe,
    GroupSyncToolTipPipe,
    GroupSyncIconPipe,
  ],
  standalone: true,
  selector: 'perun-web-apps-group-menu',
  templateUrl: './group-menu.component.html',
  styleUrls: ['./group-menu.component.scss'],
})
export class GroupMenuComponent implements OnChanges {
  @Input() group: GroupFlatNode;
  @Input() disabled = false;
  @Input() displayButtons: boolean;
  @Input() nameToCopy: string;
  @Output() moveGroup: EventEmitter<void> = new EventEmitter<void>();
  @Output() syncGroup: EventEmitter<void> = new EventEmitter<void>();
  @Output() changeNameDescription: EventEmitter<void> = new EventEmitter<void>();

  syncAuth: boolean;
  editAuth: boolean;
  moveAuth: boolean;

  constructor(private authResolver: GuiAuthResolver) {}

  ngOnChanges(): void {
    this.syncAuth = this.authResolver.isAuthorized('forceGroupSynchronization_Group_policy', [
      this.group,
    ]);
    this.editAuth = this.authResolver.isAuthorized('updateGroup_Group_policy', [this.group]);
    this.moveAuth =
      this.authResolver.isAuthorized('moveGroup_Group_Group_policy', [this.group]) ||
      this.authResolver.isAuthorized('destination_null-moveGroup_Group_Group_policy', [this.group]);
  }

  onMoveGroup(): void {
    this.moveGroup.emit();
  }

  onSyncDetail(): void {
    this.syncGroup.emit();
  }

  onChangeNameDescription(): void {
    this.changeNameDescription.emit();
  }
}
