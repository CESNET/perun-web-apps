import { Inject, Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpParams} from '@angular/common/http';
import { PERUN_API_SERVICE } from '@perun-web-apps/perun/tokens';
import { PerunApiService } from './perun-api-service';
import { ExtSource, MemberCandidate, Vo } from '@perun-web-apps/perun/models';

@Injectable({
  providedIn: 'root'
})
export class VoService {

  constructor(
    @Inject(PERUN_API_SERVICE) private apiService: PerunApiService
  ) { }

  getAllVos(showNotificationOnError = true): Observable<Vo[]> {
    return this.apiService.get('json/vosManager/getAllVos', new HttpParams(), showNotificationOnError);
  }

  getVos(showNotificationOnError = true): Observable<Vo[]> {
    return this.apiService.get('json/vosManager/getVos', new HttpParams(), showNotificationOnError);
  }

  getVoById(id: number, showNotificationOnError = true): Observable<Vo> {
    return this.apiService.get(`json/vosManager/getVoById?id=${id}`, new HttpParams(), showNotificationOnError);
  }

  getCompleteCandidates(id: number, entity : 'group' | 'vo', attrNames: string[], searchString: string,
                        showNotificationOnError = true): Observable<MemberCandidate[]> {
    const payload = {
      attrNames: attrNames,
      searchString: searchString
    };
    payload[entity] = id;

    return this.apiService.post('json/vosManager/getCompleteCandidates', payload, showNotificationOnError);
  }

  removeVo(voId:number, force:boolean, showNotificationOnError = true): Observable<Vo> {
    return this.apiService.post('json/vosManager/deleteVo', {
      vo: voId,
      force: force
    }, showNotificationOnError);
  }

  createVo(fullName: string, shortName:string, showNotificationOnError = true): Observable<Vo> {
    return this.apiService.post('json/vosManager/createVo', {
      name: fullName,
      shortName: shortName
    }, showNotificationOnError);
  }

  getVoExtSources(voId: number, showNotificationOnError = true): Observable<ExtSource[]> {
    return this.apiService.get(`json/extSourcesManager/getVoExtSources?vo=${voId}`, new HttpParams(), showNotificationOnError);
  }

  getExtSources(showNotificationOnError = true): Observable<ExtSource[]> {
    return this.apiService.get('json/extSourcesManager/getExtSources', new HttpParams(), showNotificationOnError);
  }

  addExtSources(voId: number, extSourceId: number, showNotificationOnError = true): Observable<void> {
    const payload = {
      vo: voId,
      source: extSourceId
    };

    return this.apiService.post('json/extSourcesManager/addExtSource', payload, showNotificationOnError);
  }

  removeExtSources(voId: number, extSourceId: number, showNotificationOnError = true): Observable<void> {
    const payload = {
      vo: voId,
      source: extSourceId
    };

    return this.apiService.post('json/extSourcesManager/removeExtSource', payload, showNotificationOnError);
  }

}
