import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificatorComponent } from './notificator.component';

describe('NotificatorComponent', () => {
  let component: NotificatorComponent;
  let fixture: ComponentFixture<NotificatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
