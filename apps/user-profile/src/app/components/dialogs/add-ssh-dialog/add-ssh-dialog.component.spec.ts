import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSshDialogComponent } from './add-ssh-dialog.component';

describe('AddSshDialogComponent', () => {
  let component: AddSshDialogComponent;
  let fixture: ComponentFixture<AddSshDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSshDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSshDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
