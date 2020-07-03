import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
let ResourceTagsToStringPipe = class ResourceTagsToStringPipe {
    transform(value, args) {
        if (value == null) {
            return null;
        }
        const tags = value;
        let result = '';
        tags.forEach(function (tag) {
            result = result.concat(tag.tagName);
        });
        return result;
    }
};
ResourceTagsToStringPipe = __decorate([
    Pipe({
        name: 'resourceTagsToString'
    })
], ResourceTagsToStringPipe);
export { ResourceTagsToStringPipe };
//# sourceMappingURL=resource-tags-to-string.pipe.js.map