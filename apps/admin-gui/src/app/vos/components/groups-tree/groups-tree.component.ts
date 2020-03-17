/* tslint:disable:member-ordering */
import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import {FlatTreeControl} from '@angular/cdk/tree';
import {SelectionModel} from '@angular/cdk/collections';
import { Group } from '@perun-web-apps/perun/openapi';
import { GroupFlatNode, TreeGroup } from '@perun-web-apps/perun/models';

@Component({
  selector: 'app-groups-tree',
  templateUrl: './groups-tree.component.html',
  styleUrls: ['./groups-tree.component.scss']
})
export class GroupsTreeComponent implements OnChanges {

  constructor(
  ) { }

  private transformer = (node: TreeGroup, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.shortName,
      fullName: node.name,
      parentGroupId: node.parentGroupId,
      level: level,
      id: node.id,
      voId: node.voId
    };
    // tslint:disable-next-line
  };


  @Output()
  moveGroup = new EventEmitter<GroupFlatNode>();

  @Input()
  groups: Group[];

  @Input()
  expandAll = false;

  @Input()
  selection = new SelectionModel<GroupFlatNode>(true, []);

  treeControl = new FlatTreeControl<GroupFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener<TreeGroup, GroupFlatNode>(
    this.transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  ngOnChanges(changes: SimpleChanges) {
    this.createGroupTrees(this.groups);
    if (this.expandAll) {
      this.treeControl.expandAll();
    }
  }

  createGroupTrees(groups: Group[]) {
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

    const groupTree = [];

    idGroupMap.forEach((group) => {
      if (group.parentGroupId === null || pseudoRooGroups.has(group.id)) {
        groupTree.push(group);
      }
    });

    this.dataSource.data = groupTree;
  }

  hasChild = (_: number, node: GroupFlatNode) => node.expandable;

  getLevel = (node: GroupFlatNode) => node.level;

  getParentNode(node: GroupFlatNode): GroupFlatNode | null {
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

  checkRootNodeSelection(node: GroupFlatNode): void {
    const nodeSelected = this.selection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.selection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.selection.deselect(node);
    }
  }

  checkAllParentsSelection(node: GroupFlatNode): void {
    let parent: GroupFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  leafItemSelectionToggle(node: GroupFlatNode): void {
    this.selection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  descendantsPartiallySelected(node: GroupFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.selection.isSelected(child));
    return result && !this.selection.isSelected(node);
  }

  itemSelectionToggle(node: GroupFlatNode): void {
    this.selection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.selection.isSelected(node)
      ? this.selection.select(...descendants)
      : this.selection.deselect(...descendants);

    // Force update for the parent
    descendants.every(child =>
      this.selection.isSelected(child)
    );
    this.checkAllParentsSelection(node);
  }

  onMoveGroup(group: GroupFlatNode) {
    this.moveGroup.emit(group);
  }
}
