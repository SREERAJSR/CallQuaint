import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../types/api.interface';
import { AdminService } from '../services/admin.service';

@Injectable()
export class AdminAuthInterceptor implements HttpInterceptor {

  constructor() {}
  authServices = inject(AuthService)
  adminServices = inject(AdminService)
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const accessToken = this.authServices.getAdminAccessToken()
    const refreshToken = this.authServices.getAdminRefreshToken();
    if (request.url === ('http://localhost:3000/api/v1/admin/refreshToken') && refreshToken) {
      return next.handle(request);
    } else if (request.url.startsWith('http://localhost:3000/api/v1/user')) {
      return next.handle(request)
    }

    const adminAuthReuest = request.clone({
   headers: request.headers.set('authorization', `Bearer ${accessToken}`)
    })
    if (accessToken) {
      return next.handle(adminAuthReuest).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            return this.adminServices.refreshAdminAccessToken().pipe(
              switchMap((response: ApiResponse) => {
                this.authServices.setAdminAccessToken(response.data.accessToken);
                this.authServices.setAdminRefreshToken(response.data.refresToken)
                const newAuthRequest = request.clone({
                  headers: request.headers.set('authorization', `Bearer ${response.data.accessToken}`)
                  
                })
                return next.handle(newAuthRequest)
              }),
              catchError((refreshToken) => {
                this.adminServices.logoutAdmin();
                return throwError(()=> refreshToken)
              })
            )
          }
          return throwError(()=> error)
        })
      )
    }
    return next.handle(request);
  }
}
