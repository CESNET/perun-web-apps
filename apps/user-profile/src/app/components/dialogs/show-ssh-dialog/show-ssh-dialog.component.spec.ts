import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowSshDialogComponent } from './show-ssh-dialog.component';

describe('ShowSshDialogComponent', () => {
  let component: ShowSshDialogComponent;
  let fixture: ComponentFixture<ShowSshDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowSshDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowSshDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
