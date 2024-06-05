import { Component, EventEmitter, Output, inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { ApiResponse } from 'src/app/types/api.interface';
import { Chat, IChatList } from 'src/app/types/chat.interface';
import { ChatComponent } from '../chat.component';


@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrls: ['./chatlist.component.css']
})
export class ChatlistComponent {
  chatService: ChatService = inject(ChatService)
  authService: AuthService = inject(AuthService)
  chatList: IChatList[]|[] = [];
  chatcomponent: ChatComponent = inject(ChatComponent)
  
  @Output() getChatIdEvent: EventEmitter<{chatId:string,recieverId:string}> = new EventEmitter<{chatId:string,recieverId:string}>();
  ngOnInit(): void {
    const {_id}= this.authService.decodeJwtPayload(this.authService.getAccessToken() as string)
    this.chatService.getAllChats().subscribe({
      next: (response: ApiResponse) => {
        const chats = response.data as Chat[]
const filteredParticipants = chats.map(chat => {
  return {
    ...chat,
    participants: chat.participants.filter(participant => participant._id !== _id)
  };
});
        this.chatList = filteredParticipants.map((chat) => {
          return {
            userId: chat.participants[0]._id,
            chatId: chat._id,
            avatar: chat.participants[0].avatar,
            gender: chat.participants[0].gender,
            name: chat.participants[0].firstname,
            lastMessage:chat.lastMessage
          }
        })
      }
    })

  }

  sendChatIdAndRecieverId(chatId: string,recieverId:string) {
    this.getChatIdEvent.emit({chatId:chatId,recieverId:recieverId})
  }
}
