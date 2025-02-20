import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NavigationStart, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GlobalSearchValueService {
  private searchStringSubject = new BehaviorSubject<string>(null);
  private searchString = this.searchStringSubject.asObservable();
  private searchFromGlobal = false;

  constructor(private router: Router) {
    // clear the value when routing between select pages
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (!this.searchFromGlobal) {
          this.searchStringSubject.next(null);
        }
      }
      this.searchFromGlobal = false;
    });
  }

  updateSearchString(searchString: string, searchFromGlobal = false): void {
    this.searchStringSubject.next(searchString);
    this.searchFromGlobal = searchFromGlobal;
  }

  getSearchString(): Observable<string> {
    return this.searchString;
  }
}
