/**
 * Perun RPC API
 * Perun Remote Procedure Calls Application Programming Interface
 *
 * The version of the OpenAPI document: 3.10.0
 * Contact: perun@cesnet.cz
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */
import { __decorate, __metadata, __param } from "tslib";
import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CustomHttpParameterCodec } from '../encoder';
import { BASE_PATH } from '../variables';
import { Configuration } from '../configuration';
let ExtSourcesManagerService = class ExtSourcesManagerService {
    constructor(httpClient, basePath, configuration) {
        this.httpClient = httpClient;
        this.basePath = 'https://perun.cesnet.cz/krb/rpc';
        this.defaultHeaders = new HttpHeaders();
        this.configuration = new Configuration();
        if (configuration) {
            this.configuration = configuration;
        }
        if (typeof this.configuration.basePath !== 'string') {
            if (typeof basePath !== 'string') {
                basePath = this.basePath;
            }
            this.configuration.basePath = basePath;
        }
        this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
    }
    addExtSourceWithGroupSource(group, source, observe = 'body', reportProgress = false) {
        if (group === null || group === undefined) {
            throw new Error('Required parameter group was null or undefined when calling addExtSourceWithGroupSource.');
        }
        if (source === null || source === undefined) {
            throw new Error('Required parameter source was null or undefined when calling addExtSourceWithGroupSource.');
        }
        let queryParameters = new HttpParams({ encoder: this.encoder });
        if (group !== undefined && group !== null) {
            queryParameters = queryParameters.set('group', group);
        }
        if (source !== undefined && source !== null) {
            queryParameters = queryParameters.set('source', source);
        }
        let headers = this.defaultHeaders;
        // authentication (ApiKeyAuth) required
        if (this.configuration.apiKeys && this.configuration.apiKeys["Authorization"]) {
            headers = headers.set('Authorization', this.configuration.apiKeys["Authorization"]);
        }
        // authentication (BasicAuth) required
        if (this.configuration.username || this.configuration.password) {
            headers = headers.set('Authorization', 'Basic ' + btoa(this.configuration.username + ':' + this.configuration.password));
        }
        // authentication (BearerAuth) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }
        // to determine the Accept header
        const httpHeaderAccepts = [
            'application/json'
        ];
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        return this.httpClient.post(`${this.configuration.basePath}/urlinjsonout/extSourcesManager/addExtSource/g-s`, null, {
            params: queryParameters,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    addExtSourceWithVoSource(vo, source, observe = 'body', reportProgress = false) {
        if (vo === null || vo === undefined) {
            throw new Error('Required parameter vo was null or undefined when calling addExtSourceWithVoSource.');
        }
        if (source === null || source === undefined) {
            throw new Error('Required parameter source was null or undefined when calling addExtSourceWithVoSource.');
        }
        let queryParameters = new HttpParams({ encoder: this.encoder });
        if (vo !== undefined && vo !== null) {
            queryParameters = queryParameters.set('vo', vo);
        }
        if (source !== undefined && source !== null) {
            queryParameters = queryParameters.set('source', source);
        }
        let headers = this.defaultHeaders;
        // authentication (ApiKeyAuth) required
        if (this.configuration.apiKeys && this.configuration.apiKeys["Authorization"]) {
            headers = headers.set('Authorization', this.configuration.apiKeys["Authorization"]);
        }
        // authentication (BasicAuth) required
        if (this.configuration.username || this.configuration.password) {
            headers = headers.set('Authorization', 'Basic ' + btoa(this.configuration.username + ':' + this.configuration.password));
        }
        // authentication (BearerAuth) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }
        // to determine the Accept header
        const httpHeaderAccepts = [
            'application/json'
        ];
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        return this.httpClient.post(`${this.configuration.basePath}/urlinjsonout/extSourcesManager/addExtSource/v-s`, null, {
            params: queryParameters,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    createExtSourceFromExtSourceObject(extSourceObject, observe = 'body', reportProgress = false) {
        if (extSourceObject === null || extSourceObject === undefined) {
            throw new Error('Required parameter extSourceObject was null or undefined when calling createExtSourceFromExtSourceObject.');
        }
        let headers = this.defaultHeaders;
        // authentication (ApiKeyAuth) required
        if (this.configuration.apiKeys && this.configuration.apiKeys["Authorization"]) {
            headers = headers.set('Authorization', this.configuration.apiKeys["Authorization"]);
        }
        // authentication (BasicAuth) required
        if (this.configuration.username || this.configuration.password) {
            headers = headers.set('Authorization', 'Basic ' + btoa(this.configuration.username + ':' + this.configuration.password));
        }
        // authentication (BearerAuth) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }
        // to determine the Accept header
        const httpHeaderAccepts = [
            'application/json'
        ];
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        const consumes = [
            'application/json'
        ];
        const httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(`${this.configuration.basePath}/json/extSourcesManager/createExtSource/es`, extSourceObject, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    createExtSourceWithNameType(name, type, observe = 'body', reportProgress = false) {
        if (name === null || name === undefined) {
            throw new Error('Required parameter name was null or undefined when calling createExtSourceWithNameType.');
        }
        if (type === null || type === undefined) {
            throw new Error('Required parameter type was null or undefined when calling createExtSourceWithNameType.');
        }
        let queryParameters = new HttpParams({ encoder: this.encoder });
        if (name !== undefined && name !== null) {
            queryParameters = queryParameters.set('name', name);
        }
        if (type !== undefined && type !== null) {
            queryParameters = queryParameters.set('type', type);
        }
        let headers = this.defaultHeaders;
        // authentication (ApiKeyAuth) required
        if (this.configuration.apiKeys && this.configuration.apiKeys["Authorization"]) {
            headers = headers.set('Authorization', this.configuration.apiKeys["Authorization"]);
        }
        // authentication (BasicAuth) required
        if (this.configuration.username || this.configuration.password) {
            headers = headers.set('Authorization', 'Basic ' + btoa(this.configuration.username + ':' + this.configuration.password));
        }
        // authentication (BearerAuth) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }
        // to determine the Accept header
        const httpHeaderAccepts = [
            'application/json'
        ];
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        return this.httpClient.post(`${this.configuration.basePath}/urlinjsonout/extSourcesManager/createExtSource/n-t`, null, {
            params: queryParameters,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    deleteExtSource(id, observe = 'body', reportProgress = false) {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling deleteExtSource.');
        }
        let queryParameters = new HttpParams({ encoder: this.encoder });
        if (id !== undefined && id !== null) {
            queryParameters = queryParameters.set('id', id);
        }
        let headers = this.defaultHeaders;
        // authentication (ApiKeyAuth) required
        if (this.configuration.apiKeys && this.configuration.apiKeys["Authorization"]) {
            headers = headers.set('Authorization', this.configuration.apiKeys["Authorization"]);
        }
        // authentication (BasicAuth) required
        if (this.configuration.username || this.configuration.password) {
            headers = headers.set('Authorization', 'Basic ' + btoa(this.configuration.username + ':' + this.configuration.password));
        }
        // authentication (BearerAuth) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }
        // to determine the Accept header
        const httpHeaderAccepts = [
            'application/json'
        ];
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        return this.httpClient.post(`${this.configuration.basePath}/urlinjsonout/extSourcesManager/deleteExtSource`, null, {
            params: queryParameters,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    getExtSourceById(id, observe = 'body', reportProgress = false) {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling getExtSourceById.');
        }
        let queryParameters = new HttpParams({ encoder: this.encoder });
        if (id !== undefined && id !== null) {
            queryParameters = queryParameters.set('id', id);
        }
        let headers = this.defaultHeaders;
        // authentication (ApiKeyAuth) required
        if (this.configuration.apiKeys && this.configuration.apiKeys["Authorization"]) {
            headers = headers.set('Authorization', this.configuration.apiKeys["Authorization"]);
        }
        // authentication (BasicAuth) required
        if (this.configuration.username || this.configuration.password) {
            headers = headers.set('Authorization', 'Basic ' + btoa(this.configuration.username + ':' + this.configuration.password));
        }
        // authentication (BearerAuth) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }
        // to determine the Accept header
        const httpHeaderAccepts = [
            'application/json'
        ];
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        return this.httpClient.get(`${this.configuration.basePath}/json/extSourcesManager/getExtSourceById`, {
            params: queryParameters,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    getExtSourceByName(name, observe = 'body', reportProgress = false) {
        if (name === null || name === undefined) {
            throw new Error('Required parameter name was null or undefined when calling getExtSourceByName.');
        }
        let queryParameters = new HttpParams({ encoder: this.encoder });
        if (name !== undefined && name !== null) {
            queryParameters = queryParameters.set('name', name);
        }
        let headers = this.defaultHeaders;
        // authentication (ApiKeyAuth) required
        if (this.configuration.apiKeys && this.configuration.apiKeys["Authorization"]) {
            headers = headers.set('Authorization', this.configuration.apiKeys["Authorization"]);
        }
        // authentication (BasicAuth) required
        if (this.configuration.username || this.configuration.password) {
            headers = headers.set('Authorization', 'Basic ' + btoa(this.configuration.username + ':' + this.configuration.password));
        }
        // authentication (BearerAuth) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }
        // to determine the Accept header
        const httpHeaderAccepts = [
            'application/json'
        ];
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        return this.httpClient.get(`${this.configuration.basePath}/json/extSourcesManager/getExtSourceByName`, {
            params: queryParameters,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    getExtSources(observe = 'body', reportProgress = false) {
        let headers = this.defaultHeaders;
        // authentication (ApiKeyAuth) required
        if (this.configuration.apiKeys && this.configuration.apiKeys["Authorization"]) {
            headers = headers.set('Authorization', this.configuration.apiKeys["Authorization"]);
        }
        // authentication (BasicAuth) required
        if (this.configuration.username || this.configuration.password) {
            headers = headers.set('Authorization', 'Basic ' + btoa(this.configuration.username + ':' + this.configuration.password));
        }
        // authentication (BearerAuth) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }
        // to determine the Accept header
        const httpHeaderAccepts = [
            'application/json'
        ];
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        return this.httpClient.get(`${this.configuration.basePath}/json/extSourcesManager/getExtSources`, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    getGroupExtSources(group, observe = 'body', reportProgress = false) {
        if (group === null || group === undefined) {
            throw new Error('Required parameter group was null or undefined when calling getGroupExtSources.');
        }
        let queryParameters = new HttpParams({ encoder: this.encoder });
        if (group !== undefined && group !== null) {
            queryParameters = queryParameters.set('group', group);
        }
        let headers = this.defaultHeaders;
        // authentication (ApiKeyAuth) required
        if (this.configuration.apiKeys && this.configuration.apiKeys["Authorization"]) {
            headers = headers.set('Authorization', this.configuration.apiKeys["Authorization"]);
        }
        // authentication (BasicAuth) required
        if (this.configuration.username || this.configuration.password) {
            headers = headers.set('Authorization', 'Basic ' + btoa(this.configuration.username + ':' + this.configuration.password));
        }
        // authentication (BearerAuth) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }
        // to determine the Accept header
        const httpHeaderAccepts = [
            'application/json'
        ];
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        return this.httpClient.get(`${this.configuration.basePath}/json/extSourcesManager/getGroupExtSources`, {
            params: queryParameters,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    getVoExtSources(vo, observe = 'body', reportProgress = false) {
        if (vo === null || vo === undefined) {
            throw new Error('Required parameter vo was null or undefined when calling getVoExtSources.');
        }
        let queryParameters = new HttpParams({ encoder: this.encoder });
        if (vo !== undefined && vo !== null) {
            queryParameters = queryParameters.set('vo', vo);
        }
        let headers = this.defaultHeaders;
        // authentication (ApiKeyAuth) required
        if (this.configuration.apiKeys && this.configuration.apiKeys["Authorization"]) {
            headers = headers.set('Authorization', this.configuration.apiKeys["Authorization"]);
        }
        // authentication (BasicAuth) required
        if (this.configuration.username || this.configuration.password) {
            headers = headers.set('Authorization', 'Basic ' + btoa(this.configuration.username + ':' + this.configuration.password));
        }
        // authentication (BearerAuth) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }
        // to determine the Accept header
        const httpHeaderAccepts = [
            'application/json'
        ];
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        return this.httpClient.get(`${this.configuration.basePath}/json/extSourcesManager/getVoExtSources`, {
            params: queryParameters,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    loadExtSourcesDefinitions(observe = 'body', reportProgress = false) {
        let headers = this.defaultHeaders;
        // authentication (ApiKeyAuth) required
        if (this.configuration.apiKeys && this.configuration.apiKeys["Authorization"]) {
            headers = headers.set('Authorization', this.configuration.apiKeys["Authorization"]);
        }
        // authentication (BasicAuth) required
        if (this.configuration.username || this.configuration.password) {
            headers = headers.set('Authorization', 'Basic ' + btoa(this.configuration.username + ':' + this.configuration.password));
        }
        // authentication (BearerAuth) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }
        // to determine the Accept header
        const httpHeaderAccepts = [
            'application/json'
        ];
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        return this.httpClient.get(`${this.configuration.basePath}/json/extSourcesManager/loadExtSourcesDefinitions`, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    removeExtSourceWithGroupSource(group, source, observe = 'body', reportProgress = false) {
        if (group === null || group === undefined) {
            throw new Error('Required parameter group was null or undefined when calling removeExtSourceWithGroupSource.');
        }
        if (source === null || source === undefined) {
            throw new Error('Required parameter source was null or undefined when calling removeExtSourceWithGroupSource.');
        }
        let queryParameters = new HttpParams({ encoder: this.encoder });
        if (group !== undefined && group !== null) {
            queryParameters = queryParameters.set('group', group);
        }
        if (source !== undefined && source !== null) {
            queryParameters = queryParameters.set('source', source);
        }
        let headers = this.defaultHeaders;
        // authentication (ApiKeyAuth) required
        if (this.configuration.apiKeys && this.configuration.apiKeys["Authorization"]) {
            headers = headers.set('Authorization', this.configuration.apiKeys["Authorization"]);
        }
        // authentication (BasicAuth) required
        if (this.configuration.username || this.configuration.password) {
            headers = headers.set('Authorization', 'Basic ' + btoa(this.configuration.username + ':' + this.configuration.password));
        }
        // authentication (BearerAuth) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }
        // to determine the Accept header
        const httpHeaderAccepts = [
            'application/json'
        ];
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        return this.httpClient.post(`${this.configuration.basePath}/urlinjsonout/extSourcesManager/removeExtSource/g-s`, null, {
            params: queryParameters,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    removeExtSourceWithVoSource(vo, source, observe = 'body', reportProgress = false) {
        if (vo === null || vo === undefined) {
            throw new Error('Required parameter vo was null or undefined when calling removeExtSourceWithVoSource.');
        }
        if (source === null || source === undefined) {
            throw new Error('Required parameter source was null or undefined when calling removeExtSourceWithVoSource.');
        }
        let queryParameters = new HttpParams({ encoder: this.encoder });
        if (vo !== undefined && vo !== null) {
            queryParameters = queryParameters.set('vo', vo);
        }
        if (source !== undefined && source !== null) {
            queryParameters = queryParameters.set('source', source);
        }
        let headers = this.defaultHeaders;
        // authentication (ApiKeyAuth) required
        if (this.configuration.apiKeys && this.configuration.apiKeys["Authorization"]) {
            headers = headers.set('Authorization', this.configuration.apiKeys["Authorization"]);
        }
        // authentication (BasicAuth) required
        if (this.configuration.username || this.configuration.password) {
            headers = headers.set('Authorization', 'Basic ' + btoa(this.configuration.username + ':' + this.configuration.password));
        }
        // authentication (BearerAuth) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }
        // to determine the Accept header
        const httpHeaderAccepts = [
            'application/json'
        ];
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        return this.httpClient.post(`${this.configuration.basePath}/urlinjsonout/extSourcesManager/removeExtSource/v-s`, null, {
            params: queryParameters,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
};
ExtSourcesManagerService = __decorate([
    Injectable({
        providedIn: 'root'
    }),
    __param(1, Optional()), __param(1, Inject(BASE_PATH)), __param(2, Optional()),
    __metadata("design:paramtypes", [HttpClient, String, Configuration])
], ExtSourcesManagerService);
export { ExtSourcesManagerService };
//# sourceMappingURL=extSourcesManager.service.js.map