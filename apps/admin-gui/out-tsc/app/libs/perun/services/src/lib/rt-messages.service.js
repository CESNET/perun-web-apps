import { __decorate, __metadata, __param } from "tslib";
import { Inject, Injectable } from '@angular/core';
import { PERUN_API_SERVICE } from '@perun-web-apps/perun/tokens';
let RtMessagesService = class RtMessagesService {
    constructor(apiService) {
        this.apiService = apiService;
    }
    sendMessageToRT(queue, subject, text, showNotification = true) {
        return this.apiService.post('json/rtMessagesManager/sentMessageToRT', {
            queue: queue,
            subject: subject,
            text: text
        }, showNotification);
    }
};
RtMessagesService = __decorate([
    Injectable({
        providedIn: 'root'
    }),
    __param(0, Inject(PERUN_API_SERVICE)),
    __metadata("design:paramtypes", [Object])
], RtMessagesService);
export { RtMessagesService };
//# sourceMappingURL=rt-messages.service.js.map