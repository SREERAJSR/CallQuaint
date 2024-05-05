import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { resetpasswordGuard } from './resetpassword.guard';

describe('resetpasswordGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => resetpasswordGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
