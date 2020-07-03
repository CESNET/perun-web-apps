export class TreeGroup {
    constructor(group) {
        this.id = group.id;
        this.name = group.name;
        this.parentGroupId = group.parentGroupId;
        this.voId = group.voId;
        this.shortName = group.shortName;
        this.description = group.description;
        this.attributes = group.attributes;
    }
    addChild(group) {
        if (this.children == null) {
            this.children = [group];
        }
        else {
            this.children.push(group);
        }
    }
}
//# sourceMappingURL=TreeGroup.js.map