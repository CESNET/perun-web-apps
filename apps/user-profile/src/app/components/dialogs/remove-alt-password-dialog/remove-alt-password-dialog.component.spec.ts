import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveAltPasswordDialogComponent } from './remove-alt-password-dialog.component';

describe('RemoveAltPasswordDialogComponent', () => {
  let component: RemoveAltPasswordDialogComponent;
  let fixture: ComponentFixture<RemoveAltPasswordDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveAltPasswordDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveAltPasswordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
