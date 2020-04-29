import { TestBed } from '@angular/core/testing';

import { SideMenuItemService } from './side-menu-item.service';

describe('SideMenuItemService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SideMenuItemService = TestBed.get(SideMenuItemService);
    expect(service).toBeTruthy();
  });
});
