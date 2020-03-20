import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityServiceConfigComponent } from './facility-service-config.component';

describe('FacilityServiceConfigComponent', () => {
  let component: FacilityServiceConfigComponent;
  let fixture: ComponentFixture<FacilityServiceConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityServiceConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityServiceConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
