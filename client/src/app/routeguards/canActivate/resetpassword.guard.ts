import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

export const resetpasswordGuard: CanActivateFn = (route, state) => {
  const token = route.paramMap.get('token');
  const sharedService = inject(SharedService);
  console.log(token,'rout')
  if (token) {
    sharedService.sendResetPasswordToken(token)
    return true;
  }
  return false;
};
