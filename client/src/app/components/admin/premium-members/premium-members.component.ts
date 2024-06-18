
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { ConnectService } from 'src/app/services/connect.service';
import { ApiResponse } from 'src/app/types/api.interface';
import { IFriendRequests, IFriendsListDataSource, IRequestsDataSource, IfriendsList } from 'src/app/types/connect.interface';



@Component({
  selector: 'app-premium-members',
  templateUrl: './premium-members.component.html',
  styleUrls: ['./premium-members.component.css']
})
export class PremiumMembersComponent {
 @ViewChild(MatPaginator) paginator?: MatPaginator;
  friendsList: IFriendsListDataSource[] = [];
  dataSource :any


  constructor() { 
    this.initFriendsListData()

  }
  matDialog = inject(MatDialog)
  toaxtrService = inject(ToastrService)
  connectService = inject(ConnectService);
  displayedColumns: string[] = ['id','name', 'action'];
  
  initFriendsListData() {
    console.log('invoked');
    this.connectService.fetchFriendsList().subscribe({
      next: (res: ApiResponse) => {
          const friendListArray: IfriendsList[]= res.data;
          console.log(friendListArray);
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

  acceptFriendRequest(remoteId: string) {
    this.connectService.acceptFriendRequest(remoteId).subscribe({
      next: (response) => {
        this.initFriendsListData()
        this.toaxtrService.success(response.message)
      },
      error:(err:HttpErrorResponse)=> {
        this.toaxtrService.error(err.message)
      }
    })
  }

  rejectFriendRequest(remoteId: string) {

    this.matDialog.open(ConfirmDialogComponent, {
    data:{title:"Confirmation",message: "Are you sure you want to reject the request?"
},
    disableClose:true
  }).afterClosed().subscribe((res) => {
    if (res) {
        this.connectService.rejectFriendRequest(remoteId).subscribe({
      next: (response) => {
        this.initFriendsListData()
        this.toaxtrService.success(response.message)
      },
      error:(err:HttpErrorResponse)=> {
        this.toaxtrService.error(err.message)
      }
    }) 
    }
    })
  }
}
