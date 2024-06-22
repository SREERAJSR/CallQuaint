import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

export const useronlyGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const toaster = inject(ToastrService)
  const authService = inject(AuthService);
  const accessToken = authService.getAccessToken();
  const refreshToken = authService.getRefreshToken()
  if (accessToken && refreshToken) {
  return true
  }
  toaster.warning("please login to access this page")
  router.navigate(['/login'])
  return false;
};
