import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment.development';
import { ApiResponse } from '../types/api.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: Socket) { 
  }
  http: HttpClient = inject(HttpClient);
  API_URL: string = environment.api_Url;
  getAllChats() {
    return this.http.get<ApiResponse>(`${this.API_URL}/user/chat`)
  }

  searchAvailableUsers() {
    return this.http.get<ApiResponse>(`${this.API_URL}/user/chat/users`)
  }

  createOrGetAOneOnOneChat(recieverId:string) {
    return this.http.post<ApiResponse>(`${this.API_URL}/user/chat/c/${recieverId}`,{})
  }

  deleteChat(chatId: string) {
    return this.http.delete<ApiResponse>(`${this.API_URL}/user/chat/remove/${chatId}`)
  }

  getMessageById(chatId: string) {
    return this.http.get<ApiResponse>(`${this.API_URL}/user/messages/${chatId}`)
  }
  sendMessage(chatId: string,content:string) {
    return this.http.post<ApiResponse>(`${this.API_URL}/user/messages/${chatId}`,{content:content})
  }
  deleteMessage(chatId: string, messageId: string) {
    return this.http.delete<ApiResponse>(`${this.API_URL}/user/messages/${chatId}/${messageId}`)
  }

}
