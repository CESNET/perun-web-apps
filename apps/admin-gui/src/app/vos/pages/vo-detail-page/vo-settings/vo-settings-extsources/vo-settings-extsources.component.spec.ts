import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoSettingsExtsourcesComponent } from './vo-settings-extsources.component';

describe('VoSettingsExtsourcesComponent', () => {
  let component: VoSettingsExtsourcesComponent;
  let fixture: ComponentFixture<VoSettingsExtsourcesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoSettingsExtsourcesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoSettingsExtsourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
