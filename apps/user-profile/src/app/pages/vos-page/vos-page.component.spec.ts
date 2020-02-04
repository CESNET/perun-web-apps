import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VosPageComponent } from './vos-page.component';

describe('VosPageComponent', () => {
  let component: VosPageComponent;
  let fixture: ComponentFixture<VosPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VosPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VosPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
