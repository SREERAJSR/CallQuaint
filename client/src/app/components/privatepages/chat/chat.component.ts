import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { SearchUserDialogComponent } from './search-user-dialog/search-user-dialog.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent  implements OnInit {
  constructor(private _bottomSheet: MatBottomSheet) { }

  chatPage: boolean = false;
 chatId:string=''
recieverId:string=''
  wantChatPage() {
    this.chatPage = !this.chatPage
  }

openDialog(){
    this._bottomSheet.open(SearchUserDialogComponent)
}
  
  ngOnInit() {

}
  
  getChatIdFromChatList(event:{chatId:string,recieverId:string}) {
    this.chatId = event.chatId,
    this.recieverId = event.recieverId
  }

}
