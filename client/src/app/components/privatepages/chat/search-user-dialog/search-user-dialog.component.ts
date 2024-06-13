import { IfStmt } from '@angular/compiler';
import { Component, OnInit, inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';
import { ApiResponse } from 'src/app/types/api.interface';
import { Chat } from 'src/app/types/chat.interface';


@Component({
  selector: 'app-search-user-dialog',
  templateUrl: './search-user-dialog.component.html',
  styleUrls: ['./search-user-dialog.component.css']
})
  


export class SearchUserDialogComponent {

  chatService = inject(ChatService)

  constructor(private bottom:MatBottomSheet) {
    console.log('invoked');
    this.initAvailableUsersData()
  }
  sendChatId(recieverId: string) {
    this.chatService.createOrGetAOneOnOneChat(recieverId).subscribe((response:ApiResponse) => {
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
        console.log(availableUsersData,'ava');
        this.AVAILABLE_USERS_DATA = availableUsersData.friends.map((friend: IFriends, index: number) => {
          return {
            _id:friend._id,
            name: friend.firstname,
            avatar: friend.avatar,
            position:index +1
          }
        })
        console.log(this.AVAILABLE_USERS_DATA);
         this.dataSource = new MatTableDataSource<IAvailableFriendsList>(this.AVAILABLE_USERS_DATA)
      }
    })
  }


AVAILABLE_USERS_DATA:IAvailableFriendsList[]=[]


  displayedColumns: string[] = ['position', 'name', '_id'];
  dataSource: any

}


  export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  }

export interface IAvailableFriendsList{
  position: number;
  name: string;
  _id: string;
  avatar: string;
}
  
export interface IAvailableUsersResponse {
  _id: string,
  friends: IFriends[] | []
}

interface IFriends{
  _id: string,
  avatar: string,
  firstname: string,
  email:string
 }