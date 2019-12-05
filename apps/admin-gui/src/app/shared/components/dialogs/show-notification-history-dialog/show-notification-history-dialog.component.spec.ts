import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowNotificationHistoryDialogComponent } from './show-notification-history-dialog.component';

describe('ShowNotificationHistoryDialogComponent', () => {
  let component: ShowNotificationHistoryDialogComponent;
  let fixture: ComponentFixture<ShowNotificationHistoryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowNotificationHistoryDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowNotificationHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
