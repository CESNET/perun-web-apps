import { Injectable } from '@angular/core';
import {
  Facility,
  Group,
  Member,
  Resource,
  Service,
  User,
  Vo,
} from '@perun-web-apps/perun/openapi';
import { NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged, filter, startWith } from 'rxjs/operators';
import { EntityPathParam } from '@perun-web-apps/perun/models';

type Entity = Vo | Group | Facility | Resource | Service | User | Member;

@Injectable({
  providedIn: 'root',
})
/* Service to store immutable entity information such as ids and bean name. */
export class EntityStorageService {
  entity: Entity;
  entityPathParam: EntityPathParam = null;
  url: string;

  constructor(private _router: Router) {
    this._router.events
      .pipe(
        startWith(new NavigationEnd(0, '', '')),
        filter((event) => event instanceof NavigationEnd),
        distinctUntilChanged(),
      )
      .subscribe((event: NavigationEnd) => {
        this.url = event.url;
      });
  }

  setEntityAndPathParam(entity: Entity, entityPathParam: EntityPathParam): void {
    this.entity = entity;
    this.entityPathParam = entityPathParam;
  }

  getEntity(readFromUrl = true): Entity {
    // the stored entity might wrong (e.g. nav back from the same entity with different id)
    // try to read the id from the current path and use it on disagreement
    // there is also the option of disabling this behaviour as it causes issues
    // when applied to overview components that have cached subcomponents
    const entityIdFromUrl = this.readEntityIdFromUrl(this.url, this.entityPathParam);
    if (readFromUrl && entityIdFromUrl && entityIdFromUrl !== this.entity.id) {
      this.entity.id = entityIdFromUrl;
    }
    return this.entity;
  }

  private readEntityIdFromUrl(url: string, entityPathParam: EntityPathParam): number {
    if (!entityPathParam) {
      return null;
    }
    const match = url.match(`.*\\/${entityPathParam}\\/(\\d+).*`);
    return match ? parseInt(match[1], 10) : null;
  }
}
