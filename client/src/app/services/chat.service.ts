import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment.development';
import { ApiResponse } from '../types/api.interface';
import { ChatEventEnum } from '../types/socketEvents';
import { Message } from '../types/message.interface';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: Socket) { 
    this.socket.on(ChatEventEnum.MESSAGE_RECEIVED_EVENT, (payload: Message) => {
       this.messageReceived$.next(payload)
    })
    
  }
  http: HttpClient = inject(HttpClient);
  API_URL: string = environment.api_Url;
 messageReceived$ = new Subject<Message>();
  
  establishConnection() {
    this.socket.on('connected', (res:any) => {
      console.log(res);
    })
  }



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
  sendMessage(chatId: string,formData:FormData) {
    return this.http.post<ApiResponse>(`${this.API_URL}/user/messages/${chatId}`,formData)
  }
  deleteMessage(chatId: string, messageId: string) {
    return this.http.delete<ApiResponse>(`${this.API_URL}/user/messages/${chatId}/${messageId}`)
  }


  //events

  private recievedMessage() {
    this.socket.on(ChatEventEnum.MESSAGE_RECEIVED_EVENT, (payload: Message) => {
      console.log(payload,'recieved');
      // this.messageReceived$.next(payload)

    })

  }
  // getMessageReceived(): Observable<Message> {
  //   return this.messageReceived$;
  // }
}
