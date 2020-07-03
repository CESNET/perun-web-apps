import { __decorate, __metadata } from "tslib";
import { Pipe } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StoreService } from '@perun-web-apps/perun/services';
let CustomTranslatePipe = class CustomTranslatePipe {
    constructor(translate, storage) {
        this.translate = translate;
        this.storage = storage;
    }
    transform(value, lang) {
        const customLabelElements = this.storage.get('custom_labels');
        if (customLabelElements) {
            const keys = Object.keys(customLabelElements);
            for (const key of keys) {
                const element = this.storage.get('custom_labels', key);
                if (element.label === value) {
                    return this.translate.currentLang === 'en' ? element.en : element.cz;
                }
            }
        }
        return value;
    }
};
CustomTranslatePipe = __decorate([
    Pipe({
        name: 'customTranslate'
    }),
    __metadata("design:paramtypes", [TranslateService,
        StoreService])
], CustomTranslatePipe);
export { CustomTranslatePipe };
//# sourceMappingURL=custom-translate.pipe.js.map