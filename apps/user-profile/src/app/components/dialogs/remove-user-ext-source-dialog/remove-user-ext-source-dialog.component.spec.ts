import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveUserExtSourceDialogComponent } from './remove-user-ext-source-dialog.component';

describe('RemoveUserExtSourceDialogComponent', () => {
  let component: RemoveUserExtSourceDialogComponent;
  let fixture: ComponentFixture<RemoveUserExtSourceDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveUserExtSourceDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveUserExtSourceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
