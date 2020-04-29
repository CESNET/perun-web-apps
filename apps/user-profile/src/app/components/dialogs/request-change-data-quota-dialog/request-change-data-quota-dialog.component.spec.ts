import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestChangeDataQuotaDialogComponent } from './request-change-data-quota-dialog.component';

describe('RequestChangeDataQuotaDialogComponent', () => {
  let component: RequestChangeDataQuotaDialogComponent;
  let fixture: ComponentFixture<RequestChangeDataQuotaDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestChangeDataQuotaDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestChangeDataQuotaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
