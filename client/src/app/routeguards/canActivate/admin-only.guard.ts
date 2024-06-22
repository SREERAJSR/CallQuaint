import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

export const adminOnlyGuard: CanActivateFn = (route, state) => {


  const router = inject(Router)
  const toaster = inject(ToastrService)
  const authService = inject(AuthService);
  const accessToken = authService.getAdminAccessToken();
  const refreshToken = authService.getAdminRefreshToken()

  if (accessToken && refreshToken) {
    return true
  }
  toaster.warning("please login")
  router.navigate(['/admin/login'])
  return false
};
