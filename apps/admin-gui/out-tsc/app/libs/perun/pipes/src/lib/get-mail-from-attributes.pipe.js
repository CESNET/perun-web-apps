import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
let GetMailFromAttributesPipe = class GetMailFromAttributesPipe {
    transform(attributes, ...args) {
        const attribute = attributes.find(att => att.friendlyName === 'mail');
        return attribute ? attribute.value.toString() : 'N/A';
    }
};
GetMailFromAttributesPipe = __decorate([
    Pipe({
        name: 'getMailFromAttributes'
    })
], GetMailFromAttributesPipe);
export { GetMailFromAttributesPipe };
//# sourceMappingURL=get-mail-from-attributes.pipe.js.map