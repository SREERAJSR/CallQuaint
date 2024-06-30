
import { Component, OnDestroy, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';
import { ConnectService } from 'src/app/services/connect.service';
import { ApiResponse } from 'src/app/types/api.interface';
import { IFriendsListDataSource, IRequestsDataSource, IfriendsList } from 'src/app/types/connect.interface';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent  implements OnDestroy{

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  friendsList: IFriendsListDataSource[] = [];
  dataSource :any

  constructor() { 
    this.initFriendsListData()

  }
  matDialog = inject(MatDialog)
  toaxtrService = inject(ToastrService)
  connectService = inject(ConnectService);
    router = inject(Router)
  chatService = inject(ChatService)
  displayedColumns: string[] = ['id','name', 'action'];
  fetchFriendListSubscription$?: Subscription;
  initFriendsListData() {
   this.fetchFriendListSubscription$= this.connectService.fetchFriendsList().subscribe({
      next: (res: ApiResponse) => {
          const friendListArray: IfriendsList[]= res.data;
        this.friendsList = friendListArray.map((friend: IfriendsList,index:number) => {
          return {
            id: index + 1,  
            name: friend.firstname,
            remoteId:friend._id
          }
        })
    this.dataSource = new MatTableDataSource<IRequestsDataSource>(this.friendsList)
    this.dataSource.paginator = this.paginator
      }

    })
  
  }

   applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



  makeChat(remoteId:string) {
    this.chatService.createOrGetAOneOnOneChat(remoteId).subscribe({
      next: (response: ApiResponse) => {
        if (response.statusCode === 200 || response.statusCode === 201) {
          this.router.navigate(['/chat'])
        }
      }
    })
  }
  ngOnDestroy(): void {
    this.fetchFriendListSubscription$?.unsubscribe();
  }
}
