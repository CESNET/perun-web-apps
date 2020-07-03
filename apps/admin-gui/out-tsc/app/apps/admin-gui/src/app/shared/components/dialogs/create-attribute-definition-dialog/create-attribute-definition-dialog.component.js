import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { ActionType } from '@perun-web-apps/perun/openapi';
import { AttributesManagerService } from '@perun-web-apps/perun/openapi';
import { Role } from '@perun-web-apps/perun/models';
let CreateAttributeDefinitionDialogComponent = class CreateAttributeDefinitionDialogComponent {
    constructor(dialogRef, notificator, translate, attributesManager) {
        this.dialogRef = dialogRef;
        this.notificator = notificator;
        this.translate = translate;
        this.attributesManager = attributesManager;
        this.entities = ['facility', 'resource', 'group', 'group_resource', 'host', 'member', 'member_group',
            'member_resource', 'user', 'user_ext_source', 'user_facility', 'vo', 'entityless'];
        this.definitionTypes = ['def', 'opt', 'virt'];
        this.definitionType = '';
        this.valueTypes = ['String', 'Integer', 'Boolean', 'Array', 'LinkedHashMap', 'LargeString', 'LargeArrayList'];
        this.valueType = '';
        this.readSelf = false;
        this.readSelfPublic = false;
        this.readSelfVo = false;
        this.readVo = false;
        this.readGroup = false;
        this.readFacility = false;
        this.writeSelf = false;
        this.writeSelfPublic = false;
        this.writeSelfVo = false;
        this.writeVo = false;
        this.writeGroup = false;
        this.writeFacility = false;
    }
    ngOnInit() {
        this.attDef = {
            beanName: '',
            description: '',
            displayName: '',
            entity: '',
            friendlyName: '',
            id: undefined,
            namespace: '',
            type: '',
            unique: false,
            writable: false,
        };
    }
    onSubmit() {
        this.attDef.namespace = 'urn:perun:' + this.entity + ':attribute-def:' + this.definitionType;
        this.readValueType();
        this.attributesManager.createAttributeDefinition({ attribute: this.attDef }).subscribe(attDef => {
            this.attDef = attDef;
            this.attributesManager.setAttributeRights({ rights: this.readRights() }).subscribe(() => {
                this.translate.get('DIALOGS.CREATE_ATTRIBUTE_DEFINITION.SUCCESS').subscribe(successMessage => {
                    this.notificator.showSuccess(successMessage);
                    this.dialogRef.close(true);
                });
            });
        });
    }
    onCancel() {
        this.dialogRef.close(false);
    }
    readRights() {
        const list = [];
        const rightsSELF = {};
        rightsSELF.attributeId = this.attDef.id;
        rightsSELF.role = Role.SELF;
        rightsSELF.rights = [];
        if (this.readSelf) {
            rightsSELF.rights.push('READ');
        }
        if (this.readSelfPublic) {
            rightsSELF.rights.push('READ_PUBLIC');
        }
        if (this.readSelfVo) {
            rightsSELF.rights.push('READ_VO');
        }
        if (this.writeSelf) {
            rightsSELF.rights.push('WRITE');
        }
        if (this.writeSelfPublic) {
            rightsSELF.rights.push('WRITE_PUBLIC');
        }
        if (this.writeSelfVo) {
            rightsSELF.rights.push('WRITE_VO');
        }
        list.push(rightsSELF);
        const rightsVO = {};
        rightsVO.attributeId = this.attDef.id;
        rightsVO.role = Role.VOADMIN;
        rightsVO.rights = [];
        if (this.readVo) {
            rightsVO.rights.push(ActionType.READ);
        }
        if (this.writeVo) {
            rightsVO.rights.push(ActionType.WRITE);
        }
        list.push(rightsVO);
        const rightsGROUP = {};
        rightsGROUP.attributeId = this.attDef.id;
        rightsGROUP.role = Role.GROUPADMIN;
        rightsGROUP.rights = [];
        if (this.readGroup) {
            rightsGROUP.rights.push(ActionType.READ);
        }
        if (this.writeGroup) {
            rightsGROUP.rights.push(ActionType.WRITE);
        }
        list.push(rightsGROUP);
        const rightsFACILITY = {};
        rightsFACILITY.attributeId = this.attDef.id;
        rightsFACILITY.role = Role.FACILITYADMIN;
        rightsFACILITY.rights = [];
        if (this.readFacility) {
            rightsFACILITY.rights.push(ActionType.READ);
        }
        if (this.writeFacility) {
            rightsFACILITY.rights.push(ActionType.WRITE);
        }
        list.push(rightsFACILITY);
        return list;
    }
    readValueType() {
        switch (this.valueType) {
            case 'String': {
                this.attDef.type = 'java.lang.String';
                break;
            }
            case 'Integer': {
                this.attDef.type = 'java.lang.Integer';
                break;
            }
            case 'Boolean': {
                this.attDef.type = 'java.lang.Boolean';
                break;
            }
            case 'Array': {
                this.attDef.type = 'java.util.ArrayList';
                break;
            }
            case 'LinkedHashMap': {
                this.attDef.type = 'java.util.LinkedHashMap';
                break;
            }
            case 'LargeString': {
                this.attDef.type = 'java.lang.LargeString';
                break;
            }
            case 'LargeArrayList': {
                this.attDef.type = 'java.util.LargeArrayList';
                break;
            }
        }
    }
    disableConfirmButton() {
        return (this.attDef.friendlyName === '' || this.attDef.displayName === '' || this.attDef.description === '' ||
            this.entity === '' || this.definitionType === '' || this.valueType === '');
    }
    disableUniqueToggle() {
        if (this.definitionType === 'virt' || this.entity === 'entityless') {
            this.attDef.unique = false;
            return true;
        }
        else {
            return false;
        }
    }
};
CreateAttributeDefinitionDialogComponent = __decorate([
    Component({
        selector: 'app-create-attribute-definition-dialog',
        templateUrl: './create-attribute-definition-dialog.component.html',
        styleUrls: ['./create-attribute-definition-dialog.component.scss']
    }),
    __metadata("design:paramtypes", [MatDialogRef,
        NotificatorService,
        TranslateService,
        AttributesManagerService])
], CreateAttributeDefinitionDialogComponent);
export { CreateAttributeDefinitionDialogComponent };
//# sourceMappingURL=create-attribute-definition-dialog.component.js.map