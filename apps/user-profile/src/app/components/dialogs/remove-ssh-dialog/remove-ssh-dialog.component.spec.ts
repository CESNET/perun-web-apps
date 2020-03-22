import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveSshDialogComponent } from './remove-ssh-dialog.component';

describe('RemoveSshDialogComponent', () => {
  let component: RemoveSshDialogComponent;
  let fixture: ComponentFixture<RemoveSshDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveSshDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveSshDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
