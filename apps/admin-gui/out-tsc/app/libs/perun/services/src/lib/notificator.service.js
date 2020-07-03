import { __decorate, __metadata } from "tslib";
import { EventEmitter, Injectable, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
let NotificatorService = class NotificatorService {
    constructor(translate) {
        this.translate = translate;
        this.defaultErrorDelayMs = 5000;
        this.defaultSuccessDelayMs = 3000;
        this.addNotification = new EventEmitter();
    }
    getDefaultActionMessage() {
        if (this.defaultAction === undefined) {
            return this.defaultAction = this.translate.instant('SHARED_LIB.PERUN.COMPONENTS.NOTIFICATOR.NOTIFICATION.DEFAULT_ACTION');
        }
        else {
            return this.defaultAction;
        }
    }
    getDefaultRpcMessage() {
        if (this.defaultRpcMessage === undefined) {
            return this.defaultRpcMessage = this.translate.instant('SHARED_LIB.PERUN.COMPONENTS.NOTIFICATOR.NOTIFICATION.DEFAULT_RPC_ERROR_MESSAGE');
        }
        else {
            return this.defaultRpcMessage;
        }
    }
    /**
     * Shows default RPC error
     *
     * @param rpcError - error returned by the backend
     * @param errorMessage - custom message that will be displayed
     */
    showRPCError(rpcError, errorMessage = this.getDefaultRpcMessage()) {
        this.showError(errorMessage + '\n' + rpcError.name, rpcError, rpcError.message);
    }
    /**
     * Shows error notification
     *
     * @param title - text that is shown on the notification
     * @param error - RPC error
     * @param description - text shown in the body of dialog which is displayed after clicking the action
     * @param actionText - clickable text shown on the notification which starts specified or default action
     * @param action - action which will be executed after clicking the actionText
     */
    showError(title, error, description, actionText, action) {
        this.addNotification.emit({
            type: 'error',
            error: error,
            description: description,
            title: title,
            actionText: actionText === undefined && description !== undefined ? this.getDefaultActionMessage() : actionText,
            delay: this.defaultErrorDelayMs,
            icon: 'error_outline',
            action: action,
            timeStamp: `${new Date().getHours()}:${new Date().getMinutes()}`
        });
    }
    /**
     * Shows success notification
     *
     * @param title - text that is shown on the notification
     * @param description - text shown in the body of dialog which is displayed after clicking the action
     * @param actionText - clickable text shown on the notification which starts specified or default action
     * @param action - action which will be executed after clicking the actionText
     */
    showSuccess(title, description, actionText, action) {
        this.addNotification.emit({
            type: 'success',
            description: description,
            title: title,
            actionText: actionText === undefined && description !== undefined ? this.getDefaultActionMessage() : actionText,
            delay: this.defaultSuccessDelayMs,
            icon: 'done',
            action: action,
            timeStamp: `${new Date().getHours()}:${new Date().getMinutes()}`
        });
    }
};
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], NotificatorService.prototype, "addNotification", void 0);
NotificatorService = __decorate([
    Injectable({
        providedIn: 'root'
    }),
    __metadata("design:paramtypes", [TranslateService])
], NotificatorService);
export { NotificatorService };
//# sourceMappingURL=notificator.service.js.map