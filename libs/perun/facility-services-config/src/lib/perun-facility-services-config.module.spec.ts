import { async, TestBed } from '@angular/core/testing';
import { PerunFacilityServicesConfigModule } from './perun-facility-services-config.module';

describe('PerunFacilityServicesConfigModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PerunFacilityServicesConfigModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(PerunFacilityServicesConfigModule).toBeDefined();
  });
});
