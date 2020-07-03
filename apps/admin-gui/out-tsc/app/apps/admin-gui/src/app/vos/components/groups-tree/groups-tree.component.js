import { __decorate, __metadata } from "tslib";
/* tslint:disable:member-ordering */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { TreeGroup } from '@perun-web-apps/perun/models';
import { MatDialog } from '@angular/material/dialog';
import { GroupSyncDetailDialogComponent } from '../../../shared/components/dialogs/group-sync-detail-dialog/group-sync-detail-dialog.component';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
let GroupsTreeComponent = class GroupsTreeComponent {
    constructor(dialog) {
        this.dialog = dialog;
        this.transformer = (node, level) => {
            return {
                expandable: !!node.children && node.children.length > 0,
                name: node.shortName,
                fullName: node.name,
                parentGroupId: node.parentGroupId,
                level: level,
                id: node.id,
                voId: node.voId,
                attributes: node.attributes
            };
        };
        this.moveGroup = new EventEmitter();
        this.expandAll = false;
        this.selection = new SelectionModel(true, []);
        this.treeControl = new FlatTreeControl(node => node.level, node => node.expandable);
        this.treeFlattener = new MatTreeFlattener(this.transformer, node => node.level, node => node.expandable, node => node.children);
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
        this.hasChild = (_, node) => node.expandable;
        this.getLevel = (node) => node.level;
    }
    ngOnChanges(changes) {
        this.createGroupTrees(this.groups);
        if (this.expandAll) {
            this.treeControl.expandAll();
        }
    }
    onSyncDetail(rg) {
        const config = getDefaultDialogConfig();
        config.data = rg;
        config.autoFocus = false;
        this.dialog.open(GroupSyncDetailDialogComponent, config);
    }
    createGroupTrees(groups) {
        const idGroupMap = new Map();
        for (const group of groups) {
            idGroupMap.set(group.id, new TreeGroup(group));
        }
        // groups which have parentGroupId but the parent cannot be view in subgroups view
        const pseudoRooGroups = new Set();
        idGroupMap.forEach((group, id, map) => {
            // FIXME
            const updatedParentGroup = map.get(group.parentGroupId);
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
    getParentNode(node) {
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
    checkRootNodeSelection(node) {
        const nodeSelected = this.selection.isSelected(node);
        const descendants = this.treeControl.getDescendants(node);
        const descAllSelected = descendants.every(child => this.selection.isSelected(child));
        if (nodeSelected && !descAllSelected) {
            this.selection.deselect(node);
        }
    }
    checkAllParentsSelection(node) {
        let parent = this.getParentNode(node);
        while (parent) {
            this.checkRootNodeSelection(parent);
            parent = this.getParentNode(parent);
        }
    }
    leafItemSelectionToggle(node) {
        this.selection.toggle(node);
        this.checkAllParentsSelection(node);
    }
    descendantsPartiallySelected(node) {
        const descendants = this.treeControl.getDescendants(node);
        const result = descendants.some(child => this.selection.isSelected(child));
        return result && !this.selection.isSelected(node);
    }
    itemSelectionToggle(node) {
        this.selection.toggle(node);
        const descendants = this.treeControl.getDescendants(node);
        this.selection.isSelected(node)
            ? this.selection.select(...descendants)
            : this.selection.deselect(...descendants);
        // Force update for the parent
        descendants.every(child => this.selection.isSelected(child));
        this.checkAllParentsSelection(node);
    }
    onMoveGroup(group) {
        this.moveGroup.emit(group);
    }
};
__decorate([
    Output(),
    __metadata("design:type", Object)
], GroupsTreeComponent.prototype, "moveGroup", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], GroupsTreeComponent.prototype, "groups", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], GroupsTreeComponent.prototype, "expandAll", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], GroupsTreeComponent.prototype, "selection", void 0);
GroupsTreeComponent = __decorate([
    Component({
        selector: 'app-groups-tree',
        templateUrl: './groups-tree.component.html',
        styleUrls: ['./groups-tree.component.scss']
    }),
    __metadata("design:paramtypes", [MatDialog])
], GroupsTreeComponent);
export { GroupsTreeComponent };
//# sourceMappingURL=groups-tree.component.js.map