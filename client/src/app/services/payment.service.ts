import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { ApiResponse } from '../types/api.interface';
import { Observable } from 'rxjs';
import { GpayOrderSucessReqBody, ICreateOrderRequestBody, RazorpayOrderSuccessResponse } from '../types/subscription.interfaces';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor() { }

  http: HttpClient = inject(HttpClient);
  API_URL = environment.api_Url;

  getSubscriptionPlans():Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.API_URL+'/user/subscriptions')
  }

  createOrder(payload:ICreateOrderRequestBody) {
    return this.http.post<ApiResponse>(this.API_URL+'/user/subscriptions/createrazorPayOrder',payload)
  }

  orderSuccess(payload: RazorpayOrderSuccessResponse) {
    return this.http.post<ApiResponse>(this.API_URL+'/user/subscriptions/razorPayorderSuccess',payload)
  }

  orderFailed(orderId: string) {
    const payload ={orderId:orderId}
    return this.http.post<ApiResponse>(this.API_URL+'/user/subscriptions/razorPayorderSuccess',payload)
  }
  
  gpayOrderSucess(payload: GpayOrderSucessReqBody) {
    return this.http.post<ApiResponse>(this.API_URL+'/user/subscriptions/gpayPaymentSucess',payload)
  }
}
