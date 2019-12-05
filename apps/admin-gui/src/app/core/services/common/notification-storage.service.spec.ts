import { TestBed } from '@angular/core/testing';

import { NotificationStorageService } from './notification-storage.service';

describe('NotificationStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NotificationStorageService = TestBed.get(NotificationStorageService);
    expect(service).toBeTruthy();
  });
});
