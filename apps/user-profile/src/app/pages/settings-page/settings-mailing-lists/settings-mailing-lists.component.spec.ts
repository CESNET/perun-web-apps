import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsMailingListsComponent } from './settings-mailing-lists.component';

describe('SettingsMailingListsComponent', () => {
  let component: SettingsMailingListsComponent;
  let fixture: ComponentFixture<SettingsMailingListsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsMailingListsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsMailingListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
