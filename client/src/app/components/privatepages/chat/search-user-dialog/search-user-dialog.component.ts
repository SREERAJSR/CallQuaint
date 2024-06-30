
import { Component, OnDestroy, inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';
import { ApiResponse } from 'src/app/types/api.interface';
import { Chat, IAvailableFriendsList, IAvailableUsersResponse, IFriends } from 'src/app/types/chat.interface';


@Component({
  selector: 'app-search-user-dialog',
  templateUrl: './search-user-dialog.component.html',
  styleUrls: ['./search-user-dialog.component.css']
})
  


export class SearchUserDialogComponent implements OnDestroy{

AVAILABLE_USERS_DATA:IAvailableFriendsList[]=[]
  displayedColumns: string[] = ['position', 'name', '_id'];
  dataSource: any
  chatService = inject(ChatService)
createOrGetAOneOnOneChatSubscription?:Subscription
  constructor(private bottom:MatBottomSheet) {
    this.initAvailableUsersData()
  }
  sendChatId(recieverId: string) {
  this.createOrGetAOneOnOneChatSubscription=  this.chatService.createOrGetAOneOnOneChat(recieverId).subscribe((response:ApiResponse) => {
      const chats = response.data as Chat
      const payload = { chatId: chats._id, recieverId: recieverId }
      this.chatService.sendChatIdAndRecieverIdFn(payload)
      this.chatService.sendChatInfoFn(chats)
    })
    this.bottom.dismiss()
}
  initAvailableUsersData() {
    this.chatService.searchAvailableUsers().subscribe({
      next: (res: ApiResponse) => {
        const availableUsersData: IAvailableUsersResponse= res.data
        this.AVAILABLE_USERS_DATA = availableUsersData.friends.map((friend: IFriends, index: number) => {
          return {
            _id:friend._id,
            name: friend.firstname,
            avatar: friend.avatar,
            position:index +1
          }
        })
         this.dataSource = new MatTableDataSource<IAvailableFriendsList>(this.AVAILABLE_USERS_DATA)
      }
    })
  }


  ngOnDestroy(): void {
    this.createOrGetAOneOnOneChatSubscription?.unsubscribe()
  }

}


  export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  }


