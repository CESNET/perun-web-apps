import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceTagsToStringPipe } from './resource-tags-to-string.pipe';
import { IsVirtualAttributePipe } from './is-virtual-attribute.pipe';
import { UserFullNamePipe } from './user-full-name.pipe';
import { ParseLastAccessPipe } from './parse-last-access.pipe';
import { GetMailFromAttributesPipe } from './get-mail-from-attributes.pipe';
import { CustomTranslatePipe } from './custom-translate.pipe';
import { GroupSyncIconPipe } from './group-sync-icon.pipe';
import { GroupSyncToolTipPipe } from './group-sync-tool-tip.pipe';
import { GroupSyncIconColorPipe } from './group-sync-icon-color.pipe';
let PerunPipesModule = class PerunPipesModule {
};
PerunPipesModule = __decorate([
    NgModule({
        declarations: [
            ResourceTagsToStringPipe,
            IsVirtualAttributePipe,
            UserFullNamePipe,
            ParseLastAccessPipe,
            GetMailFromAttributesPipe,
            CustomTranslatePipe,
            GroupSyncIconPipe,
            GroupSyncToolTipPipe,
            GroupSyncIconColorPipe
        ],
        exports: [
            ResourceTagsToStringPipe,
            IsVirtualAttributePipe,
            UserFullNamePipe,
            ParseLastAccessPipe,
            GetMailFromAttributesPipe,
            CustomTranslatePipe,
            GroupSyncIconPipe,
            GroupSyncToolTipPipe,
            GroupSyncIconColorPipe
        ],
        imports: [CommonModule],
    })
], PerunPipesModule);
export { PerunPipesModule };
//# sourceMappingURL=perun-pipes.module.js.map