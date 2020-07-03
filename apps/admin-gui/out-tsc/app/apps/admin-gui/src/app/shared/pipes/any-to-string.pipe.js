import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
let AnyToStringPipe = class AnyToStringPipe {
    transform(attribute, args) {
        if (attribute.value === undefined) {
            return '';
        }
        switch (attribute.type) {
            case 'java.lang.String': {
                return attribute.value;
            }
            case 'java.lang.Integer': {
                return attribute.value.toString();
            }
            case 'java.util.ArrayList': {
                return this.whenValueIsArray(attribute.value);
            }
            case 'java.util.LinkedHashMap': {
                return this.whenValueIsMap(attribute.value);
            }
            case 'java.lang.Boolean': {
                return attribute.value.toString();
            }
            default: {
                return attribute.value;
            }
        }
    }
    whenValueIsArray(value) {
        let result = '';
        value.forEach(function (str) {
            result = result.concat(str + ', ');
        });
        return result;
    }
    whenValueIsMap(map) {
        let result = '';
        map.forEach((value, key) => {
            result = result.concat(key + ': ' + value + ', ');
        });
        return result;
    }
};
AnyToStringPipe = __decorate([
    Pipe({
        name: 'anyToString'
    })
], AnyToStringPipe);
export { AnyToStringPipe };
//# sourceMappingURL=any-to-string.pipe.js.map