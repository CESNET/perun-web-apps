import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { RichGroup, Vo } from '@perun-web-apps/perun/openapi';
import { GroupFlatNode, GroupWithStatus, TreeGroup } from '@perun-web-apps/perun/models';
import { MatDialog } from '@angular/material/dialog';
import { findParent, getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { GroupSyncDetailDialogComponent } from '@perun-web-apps/perun/dialogs';
import { GuiAuthResolver } from '@perun-web-apps/perun/services';
import {
  EditFacilityResourceGroupVoDialogComponent,
  EditFacilityResourceGroupVoDialogOptions,
} from '@perun-web-apps/perun/dialogs';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

interface EnrichedGroupNode extends GroupFlatNode {
  fullName: string;
  description: string;
}

@Component({
  selector: 'perun-web-apps-groups-tree',
  templateUrl: './groups-tree.component.html',
  styleUrls: ['./groups-tree.component.scss'],
})
export class GroupsTreeComponent implements OnChanges {
  @Input() theme = 'group-theme';
  @Output() moveGroup = new EventEmitter<GroupFlatNode>();
  @Output() refreshTable = new EventEmitter<void>();
  @Output() changeExpiration = new EventEmitter<GroupWithStatus>();
  @Input() groups: RichGroup[];
  @Input() filterValue: string;
  @Input() expandAll = false;
  @Input() disableRouting = false;
  @Input() selection = new SelectionModel<GroupFlatNode>(true, []);
  @Input() hideCheckbox = false;
  @Input() vo: Vo;
  @Input() displayedColumns = ['nameWithId', 'description', 'menu', 'expiration', 'status'];
  @ViewChild('scrollViewport', { static: false }) scrollViewport: CdkVirtualScrollViewport;

  disabledRouting = false;
  displayButtons = window.innerWidth > 600;

  removeAuth: boolean;
  filteredGroups: RichGroup[];

  treeControl = new FlatTreeControl<EnrichedGroupNode>(
    (node) => node.level,
    (node) => node.expandable,
  );

  treeFlattener: MatTreeFlattener<TreeGroup, EnrichedGroupNode>;
  dataSource: MatTreeFlatDataSource<TreeGroup, EnrichedGroupNode>;

  constructor(
    public cd: ChangeDetectorRef,
    private dialog: MatDialog,
    public authResolver: GuiAuthResolver,
  ) {
    this.treeFlattener = new MatTreeFlattener<TreeGroup, EnrichedGroupNode>(
      this.transformer,
      (node) => node.level,
      (node) => node.expandable,
      (node) => node.children,
    );
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }

  @HostListener('window:resize', ['$event'])
  shouldHideButtons(): void {
    this.displayButtons = window.innerWidth > 600;
  }

  ngOnChanges(): void {
    if (this.expandAll) {
      this.filteredGroups = this.groups.filter(
        (option) =>
          option.name?.toLowerCase().includes(this.filterValue.toLowerCase()) ||
          option.description?.toLowerCase().includes(this.filterValue.toLowerCase()) ||
          option.id.toString().includes(this.filterValue.toLowerCase()) ||
          option.uuid.toLowerCase().includes(this.filterValue.toLowerCase()),
      );
      for (const group of this.filteredGroups) {
        if (group.parentGroupId) {
          this.filteredGroups = this.filteredGroups.concat(
            findParent(group.parentGroupId, this.groups),
          );
        }
      }
    } else {
      this.filteredGroups = this.groups;
    }
    this.createGroupTrees(this.filteredGroups);
    if (this.expandAll) {
      this.treeControl.expandAll();
    }
    this.removeAuth = this.setRemoveAuth();
  }

  onSyncDetail(rg: RichGroup): void {
    const config = getDefaultDialogConfig();
    config.width = '450px';
    config.data = {
      groupId: rg.id,
      theme: this.theme,
    };
    this.dialog.open(GroupSyncDetailDialogComponent, config);
  }

  onChangeNameDescription(rg: RichGroup): void {
    const config = getDefaultDialogConfig();
    config.data = {
      theme: 'group-theme',
      group: rg,
      dialogType: EditFacilityResourceGroupVoDialogOptions.GROUP,
    };
    const dialogRef = this.dialog.open(EditFacilityResourceGroupVoDialogComponent, config);

    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.refreshTable.emit();
      }
    });
  }

  createGroupTrees(groups: RichGroup[]): void {
    const idGroupMap: Map<number, TreeGroup> = new Map<number, TreeGroup>();

    for (const group of groups) {
      idGroupMap.set(group.id, new TreeGroup(group));
    }

    // groups which have parentGroupId but the parent cannot be view in subgroups view
    const pseudoRooGroups: Set<number> = new Set<number>();

    idGroupMap.forEach((group: TreeGroup, id: number, map: Map<number, TreeGroup>) => {
      // FIXME
      const updatedParentGroup: TreeGroup = map.get(group.parentGroupId);
      if (updatedParentGroup !== undefined) {
        updatedParentGroup.addChild(group);
        map.set(group.parentGroupId, updatedParentGroup);
      }
      if (group.parentGroupId !== null && updatedParentGroup === undefined) {
        pseudoRooGroups.add(group.id);
      }
    });

    const groupTree: TreeGroup[] = [];

    idGroupMap.forEach((group) => {
      if (group.parentGroupId === null || pseudoRooGroups.has(group.id)) {
        groupTree.push(group);
      }
    });

    this.dataSource.data = groupTree;
    this.cd.detectChanges();
  }

  hasChild = (_: number, node: GroupFlatNode): boolean => node.expandable;

  getLevel = (node: GroupFlatNode): number => node.level;

  getParentNode(node: EnrichedGroupNode): EnrichedGroupNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  checkRootNodeSelection(node: EnrichedGroupNode): void {
    const nodeSelected = this.selection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every((child) => this.selection.isSelected(child));
    if (nodeSelected && !descAllSelected) {
      this.selection.deselect(node);
    }
  }

  checkAllParentsSelection(node: EnrichedGroupNode): void {
    let parent: EnrichedGroupNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
    this.removeAuth = this.setRemoveAuth();
  }

  descendantsPartiallySelected(node: EnrichedGroupNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some((child) => this.selection.isSelected(child));
    return result && !this.selection.isSelected(node);
  }

  itemSelectionToggle(node: EnrichedGroupNode): void {
    this.selection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    if (this.selection.isSelected(node)) {
      this.selection.select(...descendants);
    } else {
      this.selection.deselect(...descendants);
    }

    // Force update for the parent
    descendants.every((child) => this.selection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  setRemoveAuth(): boolean {
    if (this.vo !== undefined) {
      return this.selection.selected.reduce(
        (acc, grp) =>
          acc &&
          this.authResolver.isAuthorized('deleteGroups_List<Group>_boolean_policy', [this.vo, grp]),
        true,
      );
    }
    return this.selection.selected.reduce(
      (acc, grp) =>
        acc && this.authResolver.isAuthorized('deleteGroups_List<Group>_boolean_policy', [grp]),
      true,
    );
  }

  onMoveGroup(group: GroupFlatNode): void {
    this.moveGroup.emit(group);
  }

  getTreeViewHeight(): string {
    let count = 0;
    if (this.scrollViewport) {
      count = this.scrollViewport.getDataLength();
    }

    let height = count * 48;
    if (height > 672) {
      height = 696;
    }
    if (this.scrollViewport) {
      this.scrollViewport.checkViewportSize();
    }
    return String(height) + 'px';
  }

  private transformer = (node: TreeGroup, level: number): EnrichedGroupNode => ({
    expandable: !!node.children && node.children.length > 0,
    name: node.shortName,
    fullName: node.name,
    parentGroupId: node.parentGroupId,
    level: level,
    id: node.id,
    voId: node.voId,
    attributes: node.attributes,
    beanName: node.beanName,
    description: node.description,
  });
}
