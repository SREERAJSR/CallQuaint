
import { AfterViewInit, Component, DoCheck, Input, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table';
import { ConnectService } from 'src/app/services/connect.service';
import { ApiResponse } from 'src/app/types/api.interface';
import { CallhistoryRespone, ICallHistory } from 'src/app/types/connect.interface';

@Component({
  selector: 'app-calls-and-history',
  templateUrl: './calls-and-history.component.html',
  styleUrls: ['./calls-and-history.component.css']
})
 
export class CallsAndHistoryComponent implements AfterViewInit   {

  @Input() matIndex?: number
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  callHistory: ICallHistory[] = [];
  dataSource :any

  constructor() { 
    this.initHistoryData()

  }

  ngAfterViewInit(): void {
    
  }

 

  connectService = inject(ConnectService);


  displayedColumns: string[] = ['id','firstname', 'callduration', 'date','action'];
  
  initHistoryData() {
    console.log('invoked');
    this.connectService.fetchCallHistory().subscribe({
      next: (res: ApiResponse) => {
          const callhistoryData: CallhistoryRespone[] = res.data;
          console.log(callhistoryData);
        this.callHistory = callhistoryData.map((item: CallhistoryRespone,index:number) => {
          return {
            id:index+1,
            callduration: item.callDuration,
            date: new Date(item.date), 
            firstname: item.remoteUserId.firstname,
            remoteId: item.remoteUserId._id,
            requestSent:item.requestSent
          }
        })
      }
        
    })
    this.dataSource = new MatTableDataSource<ICallHistory>(this.callHistory)
    this.dataSource.paginator = this.paginator
  }

  sendFriendRequest(remoteId: string) {
    this.connectService.sendFriendRequest(remoteId).subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          this.initHistoryData()
        }
      },  
      error: (err) => {
        console.log(err);
      }
    })
  }


  
}

