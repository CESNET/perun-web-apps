import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeMemberStatusDialogComponent } from './change-member-status-dialog.component';

describe('ChangeMemberStatusDialogComponent', () => {
  let component: ChangeMemberStatusDialogComponent;
  let fixture: ComponentFixture<ChangeMemberStatusDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeMemberStatusDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeMemberStatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
