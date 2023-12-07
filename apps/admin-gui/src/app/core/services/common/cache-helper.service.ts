import { Injectable } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouteReuseStrategy } from '@angular/router';
import { CacheRouteReuseStrategy } from './cache-route-reuse-strategy';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CacheHelperService {
  private refreshCachedData: BehaviorSubject<boolean>;

  constructor(
    private router: Router,
    private routeReuseStrategy: RouteReuseStrategy,
  ) {
    const cache = routeReuseStrategy as CacheRouteReuseStrategy;
    this.refreshCachedData = new BehaviorSubject(true);

    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (event.navigationTrigger === 'popstate') {
          cache.setLastNavigationType('back');
        } else {
          cache.setLastNavigationType('direct');
        }
      }

      if (event instanceof NavigationEnd) {
        if (cache.isRouteCached(event.url)) {
          this.refreshCachedData.next(true);
        }
      }
    });
  }

  // Do not remove. This method is used to instantiate this service.
  // eslint-disable-next-line
  init(): void {}

  refreshComponentCachedData(): Observable<boolean> {
    return this.refreshCachedData.asObservable();
  }
}
