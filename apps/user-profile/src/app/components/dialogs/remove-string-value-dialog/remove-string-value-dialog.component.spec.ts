import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveStringValueDialogComponent } from './remove-string-value-dialog.component';

describe('RemoveStringValueDialogComponent', () => {
  let component: RemoveStringValueDialogComponent;
  let fixture: ComponentFixture<RemoveStringValueDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveStringValueDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveStringValueDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
