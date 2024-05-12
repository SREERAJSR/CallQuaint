import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { ApiResponse } from '../types/api.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectService {

  constructor() { }

  http: HttpClient = inject(HttpClient);
  API_URL = environment.api_Url;
  fetchCallHistory():Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.API_URL+'/user/connect/callhistory')
  }
  
  sendFriendRequest(remoteId: string) {
    return this.http.post <ApiResponse>(this.API_URL+'/user/connect/sendfriendrequest',{remoteId:remoteId})
  }
}
