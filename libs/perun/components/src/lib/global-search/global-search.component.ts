import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, catchError, filter, finalize, of, switchMap, tap } from 'rxjs';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import {
  Group,
  PerunBean,
  SearcherService,
  Vo,
  VosManagerService,
} from '@perun-web-apps/perun/openapi';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { GlobalSearchValueService } from '@perun-web-apps/perun/services';

export interface SearchGroup {
  name: string;
  items: PerunBean[];
}

@Component({
  selector: 'perun-web-apps-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss'],
})
export class GlobalSearchComponent implements OnInit {
  @Input() adminSearch = false;
  @ViewChild('container', { read: ElementRef }) container: ElementRef;
  @ViewChild('searchIcon', { read: ElementRef }) searchIcon: ElementRef;
  @ViewChild('input', { static: true }) input: ElementRef<HTMLInputElement>;

  // TODO somehow sync this with BE
  readonly RESULTS_LIMIT = 3;
  ctrl: FormControl = new FormControl('');
  groups: SearchGroup[] = [];
  groupOptionsSubject = new BehaviorSubject<SearchGroup[]>([]);
  groupOptionsObsevable = this.groupOptionsSubject.asObservable();
  loading = false;
  emptyResult = false;
  queryShort = false;
  vosById = new Map<number, Vo>();
  focusSearch = false;
  hidden = new Map<string, boolean>();
  placeholderText = '';
  constructor(
    private searcherService: SearcherService,
    private vosManager: VosManagerService,
    private cd: ChangeDetectorRef,
    private renderer: Renderer2,
    private router: Router,
    private globalSearchValueService: GlobalSearchValueService,
  ) {}

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent): void {
    // Use '/' to focus search bar
    if (!this.focusSearch && event.key === '/') {
      event.preventDefault();
      this.input.nativeElement.focus();
      this.focusSearch = true;
    }
  }

  ngOnInit(): void {
    this.updatePlaceholder();

    this.resetGroupOptions();
    window
      .matchMedia('(pointer: fine)')
      .addEventListener('change', (event) => this.updatePlaceholder(event));
  }

  toggleSearch(): void {
    // TODO add animation to this
    this.renderer.addClass(this.container.nativeElement, 'show-search');
    this.renderer.addClass(this.searchIcon.nativeElement, 'hide-icon');
    // this.renderer.addClass(this.container.nativeElement, 'toggle-search');
    this.focusSearch = true;
    this.input.nativeElement.focus();
  }

  focusoutSearch(): void {
    // TODO add animation to this
    this.renderer.removeClass(this.container.nativeElement, 'show-search');
    this.renderer.removeClass(this.searchIcon.nativeElement, 'hide-icon');
    this.focusSearch = false;
    this.input.nativeElement.blur();
    // this.renderer.removeClass(this.container.nativeElement, 'toggle-search');
  }

  resetGroupOptions(): void {
    // has to be assigned to something otherwise doesn't trigger, dunno why
    const temp = this.ctrl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap((value: string) => {
        this.emptyResult = false;
        this.queryShort = this.adminSearch
          ? value?.trim().length < 3 && isNaN(Number(value))
          : value?.trim().length < 3;
      }),
      filter((value: string) => value?.trim().length > 0),
      filter(
        (value: string) => (this.adminSearch && !isNaN(Number(value))) || value?.trim().length > 2,
      ),
      switchMap((value) => {
        this.loading = true;
        return this.searcherService.globalSearch(value).pipe(
          switchMap((result) => {
            // Process the result from globalSearch
            if ([].concat(...Object.values(result)).length === 0) {
              this.groups = [];
              this.emptyResult = true;
              return of([]); // Return an empty array if no results
            } else {
              this.groups = [
                {
                  name: 'USERS',
                  items:
                    result['users'].length > this.RESULTS_LIMIT
                      ? result['users'].slice(0, this.RESULTS_LIMIT)
                      : result['users'],
                },
                {
                  name: 'ORGANIZATIONS',
                  items:
                    result['vos'].length > this.RESULTS_LIMIT
                      ? result['vos'].slice(0, this.RESULTS_LIMIT)
                      : result['vos'],
                },
                {
                  name: 'GROUPS',
                  items:
                    result['groups'].length > this.RESULTS_LIMIT
                      ? result['groups'].slice(0, this.RESULTS_LIMIT)
                      : result['groups'],
                },
                {
                  name: 'FACILITIES',
                  items:
                    result['facilities'].length > this.RESULTS_LIMIT
                      ? result['facilities'].slice(0, this.RESULTS_LIMIT)
                      : result['facilities'],
                },
              ];
              this.hidden.set('USERS', result['users'].length > this.RESULTS_LIMIT);
              this.hidden.set('ORGANIZATIONS', result['vos'].length > this.RESULTS_LIMIT);
              this.hidden.set('GROUPS', result['groups'].length > this.RESULTS_LIMIT);
              this.hidden.set('FACILITIES', result['facilities'].length > this.RESULTS_LIMIT);

              // Extract VO IDs and make the additional async call
              if (result['groups'].length > 0) {
                const voIds = result['groups'].map((group) => (group as Group).voId);
                return this.vosManager.getVosByIds(voIds).pipe(
                  tap((vos) => {
                    // Save the result to the vosById map
                    vos.forEach((vo) => this.vosById.set(vo.id, vo));
                  }),
                  map(() => result), // Return the original result to continue the stream
                );
              }
            }
          }),
          finalize(() => {
            this.loading = false;
            this.cd.detectChanges();
          }),
          catchError(() => {
            this.loading = false;
            this.cd.detectChanges();
            return of([]);
          }),
        );
      }),
      map(() => {
        this.groupOptionsSubject.next(this.groups);
      }),
    );
    temp.subscribe(() => this.cd.detectChanges());
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    // route to the object on selected - this is for keyboard selection, routerLink works only for clicking
    // have to change this back to blank, otherwise whole object in input value
    // can also set this to the display value, if we want to persist the search result in the bar after clicking
    this.ctrl.setValue('');
    // reset groups so that the results are not cached in the autocomplete
    this.groupOptionsSubject.next([]);
    this.resetGroupOptions();
    const bean = event.option.value as PerunBean;
    this.input.nativeElement.blur();
    switch (bean.beanName) {
      case 'User':
        void this.router.navigate(['/admin/users', bean.id]).then(() => {
          setTimeout(() => this.focusoutSearch(), 0);
        });
        return;
      case 'Vo':
        void this.router.navigate(['/organizations', bean.id]).then(() => {
          setTimeout(() => this.focusoutSearch(), 0);
        });
        return;
      case 'Group':
        void this.router
          .navigate(['/organizations', (bean as Group).voId, 'groups', bean.id])
          .then(() => {
            setTimeout(() => this.focusoutSearch(), 0);
          });
        return;
      case 'Facility':
        void this.router.navigate(['/facilities', bean.id]).then(() => {
          setTimeout(() => this.focusoutSearch(), 0);
        });
        return;
    }
    // has to be "View More" option

    const parts = (event.option.value as string).split(';');
    const entity = parts[0];
    if (entity === 'Groups') return;
    const searchString = parts[1];
    this.globalSearchValueService.updateSearchString(searchString, true);

    switch (entity) {
      case 'USERS':
        void this.router
          .navigate(['/admin', 'users'], {
            queryParamsHandling: 'preserve',
          })
          .then(() => {
            setTimeout(() => this.focusoutSearch(), 0);
          });
        break;
      case 'ORGANIZATIONS':
        void this.router
          .navigate(['/organizations'], {
            queryParamsHandling: 'preserve',
          })
          .then(() => {
            setTimeout(() => this.focusoutSearch(), 0);
          });
        break;
      case 'FACILITIES':
        void this.router.navigate(['/facilities'], { queryParamsHandling: 'preserve' }).then(() => {
          setTimeout(() => this.focusoutSearch(), 0);
        });
        break;
    }
  }

  /**
   * Updates the input placeholder depending on whether pressing '/' to focus input makes sense
   * @private
   */

  private updatePlaceholder(event?: MediaQueryListEvent): void {
    const isFinePointer = event ? event.matches : window.matchMedia('(pointer: fine)').matches;
    this.placeholderText = isFinePointer ? 'PLACEHOLDER_SLASH' : 'PLACEHOLDER';
  }
}
