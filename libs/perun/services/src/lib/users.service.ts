import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { PERUN_API_SERVICE } from '@perun-web-apps/perun/tokens';
import { PerunApiService } from './perun-api-service';
import { RichUser, RichUserExtSource, User, UserExtSource, Vo, Group } from '@perun-web-apps/perun/models';
import { parseUrnsToUrlParam } from '@perun-web-apps/perun/utils';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    @Inject(PERUN_API_SERVICE) private apiService: PerunApiService
  ) { }

  getUserExtSources(userId: number, showNotificationOnError = true): Observable<UserExtSource[]> {
    return this.apiService.post('json/usersManager/getUserExtSources', {
      user: userId
    }, showNotificationOnError);
  }

  getRichUserExtSources(userId: number, attrsNames: string[], showNotificationOnError = true):
    Observable<RichUserExtSource[]>
  {
    return this.apiService.post('json/usersManager/getRichUserExtSources', {
      user: userId,
      attrsNames: attrsNames
    }, showNotificationOnError);
  }

  getRichUserExtSourcesWithAllAttributes(userId: number, showNotificationOnError = true):
    Observable<RichUserExtSource[]>
  {
    return this.apiService.post('json/usersManager/getRichUserExtSources', {
      user: userId
    }, showNotificationOnError);
  }
  findRichUsersWithAttributes(searchString: string, attributes: string[], showNotificationOnError = true): Observable<RichUser[]> {
    const attrParam = parseUrnsToUrlParam('attrsNames', attributes);
    return this.apiService.get(`json/usersManager/findRichUsersWithAttributes?searchString=${searchString}${attrParam}`,
      new HttpParams(), showNotificationOnError);
  }

  getUserById(userId: number, showNotificationOnError = true): Observable<User> {
    return this.apiService.get(`json/usersManager/getUserById?id=${userId}`, new HttpParams(), showNotificationOnError);
  }

  findUsers(searchstring: string, showNotificationOnError = true): Observable<User[]> {
    return this.apiService.post('json/usersManager/findUsers', {
      'searchString': searchstring
    }, showNotificationOnError);
  }

  findRichUsers(searchString: string, showNotificationOnError = true): Observable<RichUser[]> {
    return this.apiService.post('json/usersManager/findRichUsers', {
      searchString: searchString
    }, showNotificationOnError);
  }

  getRichUser(userId: number, showNotificationOnError = true): Observable<RichUser> {
    return this.apiService.get(`json/usersManager/getRichUser?id=${userId}`, new HttpParams(), showNotificationOnError);
  }

  getVosWhereUserIsMember(userId: number, showNotificationOnError = true):Observable<Vo[]>{
    return this.apiService.post('json/usersManager/getVosWhereUserIsMember',{
      user: userId
    }, showNotificationOnError);
  }

  getVosWhereUserIsAdmin(userId: number, showNotificationOnError = true):Observable<Vo[]>{
    return this.apiService.post('json/usersManager/getVosWhereUserIsAdmin',{
      user: userId
    }, showNotificationOnError);
  }

  getGroupsWhereUserIsAdmin(userId: number, showNotificationOnError = true): Observable<Group[]> {
    return this.apiService.post('json/usersManager/getGroupsWhereUserIsAdmin', {
      'user': userId
    }, showNotificationOnError);
  }
}
