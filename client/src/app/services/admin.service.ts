import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { AdminLoginPayload, IsubscriptionPlanRequestBody } from '../types/admin.intefaces';
import { ApiResponse } from '../types/api.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor() { }

  authService = inject(AuthService)
  http = inject(HttpClient);
  API_URL = environment.api_Url+'/admin';

  loginAdmin(payload: AdminLoginPayload) {
  return this.http.post<ApiResponse>(this.API_URL+'/login',payload)
  }
  

  fetchDashboardData() {
    return this.http.get<ApiResponse>(this.API_URL + '/dashboard');
  }

  getAllUsers() {
    return this.http.get<ApiResponse>(this.API_URL+'/users')
  }

  blockUser(userId:string) {
    return this.http.patch<ApiResponse>(this.API_URL+`/block-user/${userId}`,{})
  }

  unblockUser(userId: string) {
    return this.http.patch<ApiResponse>(this.API_URL+`/unblock-user/${userId}`,{})
  }

  getSubscriptionPlanData() {
    return this.http.get<ApiResponse>(this.API_URL+'/susbscriptions')
  }
  createNewSubscriptionPlan(payload:IsubscriptionPlanRequestBody) {
    return this.http.post<ApiResponse>(this.API_URL+'/susbscriptions',payload)
  }

  getSalesReport(date:string) {
    return this.http.get<ApiResponse>(this.API_URL+`/sales-report?date=${date}`)
  }

  logoutAdmin() {
    return this.http.post<ApiResponse>(this.API_URL+`/logout`,{})
  }

    refreshAdminAccessToken() {
    const incomingRefreshToken = this.authService.getAdminRefreshToken()
    return this.http.post<ApiResponse>(this.API_URL+`/admin/refreshToken`,{incomingRefreshToken:incomingRefreshToken})
  }
}
