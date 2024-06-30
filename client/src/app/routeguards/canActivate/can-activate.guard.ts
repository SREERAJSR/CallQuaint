import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SharedService } from '../../services/shared.service';

export const canActivateGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const sharedService: SharedService = inject(SharedService)
  const token = route.paramMap.get('token');
  if (token) {
 if (token) {
    authService.verifyEmail(token).subscribe((data:any) => {
      if (data.statusCode === 200) {
        sharedService.sendSucessMessge("Email verification complete")
      }
    },(error) => {
    const err = error.error.errorMessage;
      sharedService.sendErrorMessage(err)
    })   
    return true;
}
  };
  return false;
}

