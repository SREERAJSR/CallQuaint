import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { SearchUserDialogComponent } from './search-user-dialog/search-user-dialog.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ChatService } from 'src/app/services/chat.service';
import { SendChatIdAndRecieverIdInterface } from 'src/app/types/chat.interface';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent  implements OnInit {
  constructor(private _bottomSheet: MatBottomSheet) { }

  chatPage: boolean = false;
 chatId:string =''
  recieverId: string = ''
  chatService  = inject(ChatService)
  wantChatPage() {
    this.chatPage = !this.chatPage
  }

openDialog(){
    this._bottomSheet.open(SearchUserDialogComponent)
}
  
  ngOnInit() {
    this.chatService.sendChatIdAndRecieverId$.subscribe({
      next: (payload: SendChatIdAndRecieverIdInterface) => {
        this.chatId = payload.chatId
        this.recieverId = payload.recieverId
      }
    })

}
  
  getChatIdFromChatList(event:{chatId:string,recieverId:string}) {
    this.chatId = event.chatId,
    this.recieverId = event.recieverId
  }

}
