import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificatorService } from './notificator.service';
import { AuthService } from './auth.service';
import { StoreService } from './store.service';
let ApiService = class ApiService {
    constructor(http, notificator, authService, storeService) {
        this.http = http;
        this.notificator = notificator;
        this.authService = authService;
        this.storeService = storeService;
    }
    getApiUrl() {
        if (this.api_url === undefined) {
            this.api_url = this.storeService.get('api_url');
        }
        return this.api_url + "/";
    }
    formatErrors(error, url, payload, showError) {
        const rpcError = error.error;
        rpcError.call = url;
        rpcError.payload = payload;
        if (showError) {
            this.notificator.showRPCError(error.error);
        }
        return throwError(rpcError);
    }
    getHeaders() {
        let headers = new HttpHeaders();
        headers = headers.set('Authorization', this.authService.getAuthorizationHeaderValue());
        return headers;
    }
    get(path, params = new HttpParams(), showError = true) {
        const url = `${this.getApiUrl()}${path}`;
        return this.http.get(url, { headers: this.getHeaders() })
            .pipe(catchError(err => this.formatErrors(err, url, null, showError)));
    }
    put(path, body = {}, showError = true) {
        const url = `${this.getApiUrl()}${path}`;
        const payload = JSON.stringify(body);
        return this.http.put(url, payload, { headers: this.getHeaders() }).pipe(catchError(err => this.formatErrors(err, url, payload, showError)));
    }
    post(path, body = {}, showError = true) {
        const url = `${this.getApiUrl()}${path}`;
        const payload = JSON.stringify(body);
        let headers = this.getHeaders();
        headers = headers.set('Content-Type', 'application/json; charset=utf-8');
        return this.http.post(url, payload, { headers: headers }).pipe(catchError(err => this.formatErrors(err, url, payload, showError)));
    }
    delete(path, showError = true) {
        const url = `${this.getApiUrl()}${path}`;
        return this.http.delete(url, { headers: this.getHeaders() }).pipe(catchError(err => this.formatErrors(err, url, null, showError)));
    }
};
ApiService = __decorate([
    Injectable({
        providedIn: 'root'
    }),
    __metadata("design:paramtypes", [HttpClient,
        NotificatorService,
        AuthService,
        StoreService])
], ApiService);
export { ApiService };
//# sourceMappingURL=api.service.js.map