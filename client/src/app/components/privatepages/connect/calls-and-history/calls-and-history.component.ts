
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource,} from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConnectService } from 'src/app/services/connect.service';
import { ApiResponse } from 'src/app/types/api.interface';
import { CallhistoryRespone, ICallHistory } from 'src/app/types/connect.interface';

@Component({
  selector: 'app-calls-and-history',
  templateUrl: './calls-and-history.component.html',
  styleUrls: ['./calls-and-history.component.css'],

})
 
export class CallsAndHistoryComponent implements OnDestroy{


  @ViewChild(MatPaginator) paginator?: MatPaginator;
  callHistory: ICallHistory[] = [];
  dataSource :any

  constructor() { 
    this.initHistoryData()

  }

  fetchCallhistorySubscription$?: Subscription;
  sendFriendRequstSubscription$?: Subscription;
  toaxtrService = inject(ToastrService)
  connectService = inject(ConnectService);
  displayedColumns: string[] = ['id','firstname', 'callduration', 'date','action'];
  
  initHistoryData() {
  this.fetchCallhistorySubscription$ =  this.connectService.fetchCallHistory().subscribe({
      next: (res: ApiResponse) => {
          const callhistoryData: CallhistoryRespone[] = res.data;
        this.callHistory = callhistoryData.map((item: CallhistoryRespone,index:number) => {
          return {
            id:index+1,
            callduration: item.callDuration,
            date: new Date(item.date), 
            firstname: item.remoteUserId.firstname,
            remoteId: item.remoteUserId._id,
            requestSent: item.requestSent,
            friend:item.friend

          }
        })
    this.dataSource = new MatTableDataSource<ICallHistory>(this.callHistory)
    this.dataSource.paginator = this.paginator
      }

    })
  
  }

  sendFriendRequest(remoteId: string) {
 this.sendFriendRequstSubscription$=   this.connectService.sendFriendRequest(remoteId).subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          this.initHistoryData()
          this.toaxtrService.success(response.message)
        }
      }, 
    })
  }


  ngOnDestroy(): void {
    this.fetchCallhistorySubscription$?.unsubscribe();
    this.sendFriendRequstSubscription$?.unsubscribe();
  }
}

