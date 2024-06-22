import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { useronlyGuard } from './useronly.guard';

describe('useronlyGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => useronlyGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
