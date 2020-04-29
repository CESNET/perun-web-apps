import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserExtSourcesListComponent } from './user-ext-sources-list.component';

describe('UserExtSourcesListComponent', () => {
  let component: UserExtSourcesListComponent;
  let fixture: ComponentFixture<UserExtSourcesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserExtSourcesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserExtSourcesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
