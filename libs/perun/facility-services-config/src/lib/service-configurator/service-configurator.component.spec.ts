import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceConfiguratorComponent } from './service-configurator.component';

describe('ServiceConfiguratorComponent', () => {
  let component: ServiceConfiguratorComponent;
  let fixture: ComponentFixture<ServiceConfiguratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceConfiguratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
