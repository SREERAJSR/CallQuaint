import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { ConnectService } from 'src/app/services/connect.service';
import { ApiResponse } from 'src/app/types/api.interface';
import {  IFriendRequests, IRequestsDataSource } from 'src/app/types/connect.interface';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnDestroy {


  @ViewChild(MatPaginator) paginator?: MatPaginator;
  friendRequests: IRequestsDataSource[] = [];
  dataSource :any

  constructor() { 
    this.initFriendRequestData()

  }
  matDialog = inject(MatDialog)
  toaxtrService = inject(ToastrService)
  connectService = inject(ConnectService);
  displayedColumns: string[] = ['id','name', 'action'];
   fetchFriendRequestListSubscription$?: Subscription;
  acceptFriendRequestSubscription$?: Subscription;
  rejectFriendRquestSubscription?: Subscription;
  initFriendRequestData() {
   this.rejectFriendRquestSubscription= this.connectService.getFriendRequests().subscribe({
      next: (res: ApiResponse) => {
          const friendRequestsArray: IFriendRequests[]= res.data;
        this.friendRequests = friendRequestsArray.map((item: IFriendRequests,index:number) => {
          return {
            id: index + 1,
            name: item.firstname,
            remoteId:item._id
          }
        })
    this.dataSource = new MatTableDataSource<IRequestsDataSource>(this.friendRequests)
    this.dataSource.paginator = this.paginator
      }

    })
  
  }

  

  acceptFriendRequest(remoteId: string) {
   this.acceptFriendRequestSubscription$ = this.connectService.acceptFriendRequest(remoteId).subscribe({
      next: (response) => {
        this.initFriendRequestData()
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
    this.rejectFriendRquestSubscription =    this.connectService.rejectFriendRequest(remoteId).subscribe({
      next: (response) => {
        this.initFriendRequestData()
        this.toaxtrService.success(response.message)
      },
      error:(err:HttpErrorResponse)=> {
        this.toaxtrService.error(err.message)
      }
    }) 
    }
    })
  }

  ngOnDestroy(): void {
    this.rejectFriendRquestSubscription?.unsubscribe();
    this.acceptFriendRequestSubscription$?.unsubscribe();
    this.fetchFriendRequestListSubscription$?.unsubscribe();
  }
}
