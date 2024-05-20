import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { ApiResponse } from '../types/api.interface';
import { Observable, catchError, throwError } from 'rxjs';

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
    return this.http.post<ApiResponse>(this.API_URL + '/user/connect/sendfriendrequest', { remoteId: remoteId }).pipe(
     catchError((error: HttpErrorResponse) => {
        const err = {
          message: error?.error?.errorMessage,
          statusCode:error.status
        } 
        return throwError(()=>err)
      })
    )
  }

  getFriendRequests():Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.API_URL+'/user/connect/getfriendrequests')
  }

  acceptFriendRequest(remoteId: string):Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(this.API_URL+'/user/connect/acceptrequest',{remoteId:remoteId}).pipe(
     catchError((error: HttpErrorResponse) => {
        const err = {
          message: error?.error?.errorMessage,
          statusCode:error.status
        } 
        return throwError(()=>err)
      })
    )
  }

  rejectFriendRequest(remoteId: string):Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(this.API_URL+`/user/connect/rejectfriendrequest?id=${remoteId}`).pipe(
     catchError((error: HttpErrorResponse) => {
        const err = {
          message: error?.error?.errorMessage,
          statusCode:error.status
        } 
        return throwError(()=>err)
      })
    )
  }

  fetchFriendsList(): Observable<ApiResponse>{
    return this.http.get<ApiResponse>(this.API_URL + '/user/connect/getFriends').pipe(
          catchError((error: HttpErrorResponse) => {
        const err = {
          message: error?.error?.errorMessage,
          statusCode:error.status
        } 
        return throwError(()=>err)
      })
    )
  }
}
