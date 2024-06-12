import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment.development';
import { ApiResponse } from '../types/api.interface';
import { ChatEventEnum } from '../types/socketEvents';
import { Message } from '../types/message.interface';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AcceptCallPayload, Chat, IVideoCallSocketEventPayload, OnlineUsers, SendChatIdAndRecieverIdInterface } from '../types/chat.interface';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: Socket) { 
    this.socket.on(ChatEventEnum.NEW_CHAT_EVENT, (chat: Chat) => {
      this.newChatInfo$.next(chat)
    })
    this.socket.on(ChatEventEnum.LEAVE_CHAT_EVENT, (res: Chat) => {
      console.log(res,'leaveeeeeeee');
      this.leaveChatInfo$.next(res)
    })
    this.socket.on(ChatEventEnum.MESSAGE_RECEIVED_EVENT, (payload: Message) => {
       this.messageReceived$.next(payload)
    })
     this.socket.on(ChatEventEnum.TYPING_EVENT, (chatId: string) => {
      console.log(chatId);
      this.typingInfo$.next(chatId)
     })
    this.socket.on(ChatEventEnum.ONLINEUSERS, (onlineUser: OnlineUsers[]) => {
      console.log(onlineUser,'onlineee');
      this.onLineUsers$.next(onlineUser)
    })
    this.socket.on(ChatEventEnum.MESSAGE_DELETE_EVENT, (deletedMessage: Message) => {
      this.deletedMessageInfo$.next(deletedMessage)
    })

    this.socket.on(ChatEventEnum.CALL_REQUEST, (payload: AcceptCallPayload) => {
      this.incomingCall$.next(payload)
    })
    
  }


  http: HttpClient = inject(HttpClient);
  API_URL: string = environment.api_Url;
 messageReceived$ = new Subject<Message>();
typingInfo$ = new Subject<string>()
  stopTypingInfo$ = new Subject<string>()
  onLineUsers$ = new Subject<OnlineUsers[]>()
  sendChatIdAndRecieverId$ = new Subject<SendChatIdAndRecieverIdInterface>();
  sendChatInfo$ = new Subject<Chat>()
  leaveChatInfo$ = new Subject<Chat>();
  newChatInfo$ = new Subject<Chat>();
  deletedMessageInfo$ = new Subject<Message>()
  incomingCall$ = new BehaviorSubject<AcceptCallPayload | null>( null);


  sendChatInfoFn(chat: Chat) {
    this.sendChatInfo$.next(chat)
  }
  sendChatIdAndRecieverIdFn(payload: SendChatIdAndRecieverIdInterface) {
    this.sendChatIdAndRecieverId$.next(payload)
  }
  establishConnection() {
    this.socket.on(ChatEventEnum.CONNECTED_EVENT, (res:any) => {
      console.log(' socket connected connected');
    })
    
  }

  requestOnlineUsers() {
    this.socket.emit(ChatEventEnum.GETONLINEUSER)
  }

  emitJoinChatEvent(chatId: string) {

    this.socket.emit(ChatEventEnum.JOIN_CHAT_EVENT,chatId)
  }

  emitTypingEvent(chatId:string) {
  this.socket.emit(ChatEventEnum.TYPING_EVENT,chatId)
  }


  emitStopTypingEvent(chatId: string) {
    this.socket.emit(ChatEventEnum.STOP_TYPING_EVENT,chatId)
  }

  getStopTypingInfo() {

     this.socket.on(ChatEventEnum.STOP_TYPING_EVENT, (chatId: string) => {
       console.log(chatId,'typing');
      this.stopTypingInfo$.next(chatId)
    })
  }

  emitCallRequest(payload:AcceptCallPayload) {
    this.socket.emit(ChatEventEnum.CALL_REQUEST,payload)
  }


  //Api calls 
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

  
}
