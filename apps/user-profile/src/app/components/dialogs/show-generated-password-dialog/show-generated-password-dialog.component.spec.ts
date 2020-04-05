import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowGeneratedPasswordDialogComponent } from './show-generated-password-dialog.component';

describe('ShowGeneratedPasswordDialogComponent', () => {
  let component: ShowGeneratedPasswordDialogComponent;
  let fixture: ComponentFixture<ShowGeneratedPasswordDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowGeneratedPasswordDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowGeneratedPasswordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
