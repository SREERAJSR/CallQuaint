import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { ChatComponent } from '../chat.component';
import { ChatService } from 'src/app/services/chat.service';
import { ApiResponse } from 'src/app/types/api.interface';
import { Message } from 'src/app/types/message.interface';
import { Chat, Participant } from 'src/app/types/chat.interface';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-chatpage',
  templateUrl: './chatpage.component.html',
  styleUrls: ['./chatpage.component.css']
})
export class ChatpageComponent implements OnChanges {
currentUserId?:string
authServices = inject(AuthService)
  chatComponent: ChatComponent = inject(ChatComponent)
  chatServices:ChatService = inject(ChatService)
  @Input() chatId?: string
  @Input()recieverId?:string
  chatMessages: Message[] | [] = [];
  participantData?:Participant 
  ngOnChanges(changes: SimpleChanges): void {
    if (this.chatId) {
        this.chatServices.getMessageById(this.chatId).subscribe({
        next: (response: ApiResponse) => {
            const messages = response.data as Message[];
            this.chatMessages = messages
          }
        })
      
    }
    if (this.recieverId) {
      const { _id } = this.authServices.decodeJwtPayload(this.authServices.getAccessToken() as string)
      this.currentUserId = _id
      this.chatServices.createOrGetAOneOnOneChat(this.recieverId).subscribe({
        next: (response: ApiResponse) => {
          const chats = response.data as Chat
          const participantData = chats.participants.filter(participant => participant._id !== _id)
          this.participantData = participantData[0]
        }
      })
    }
    
  }
  
}
