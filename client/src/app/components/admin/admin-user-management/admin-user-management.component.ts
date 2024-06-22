
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { AdminService } from 'src/app/services/admin.service';
import { ConnectService } from 'src/app/services/connect.service';
import { UserManagement } from 'src/app/types/admin.intefaces';
import { ApiResponse } from 'src/app/types/api.interface';
import { IFriendRequests, IFriendsListDataSource, IRequestsDataSource, IfriendsList } from 'src/app/types/connect.interface';

@Component({
  selector: 'app-admin-user-management',
  templateUrl: './admin-user-management.component.html',
  styleUrls: ['./admin-user-management.component.css']
})
export class AdminUserManagementComponent {
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;
  private sortState: 'all' | 'premium' | 'standard' = 'all';
    private originalData: UserManagement[] = [];
  dataSource :any


  constructor() { 
this.initUsersList()
  }
  matDialog = inject(MatDialog)
  toaxtrService = inject(ToastrService)
  connectService = inject(ConnectService);
  adminService  = inject(AdminService)
  displayedColumns: string[] = ['index','firstname','subscription','action'];
  userList:UserManagement[] =[]
  

  initUsersList() {
    this.adminService.getAllUsers().subscribe({
      next: (response: ApiResponse) => {
        const userData = response.data as UserManagement[]

       this.originalData= this.userList = userData.map((value, index) => {
          return {
            index:index+1,
            _id: value._id,
            avatar: value.avatar,
            email: value.email,
            firstname: value.firstname,
            lastname: value.lastname,
            subscription: value.subscription,
            isBlocked:value.isBlocked
          }
        })
        this.dataSource = new MatTableDataSource<UserManagement>(this.userList)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort
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
  sortSubscription(sort: Sort) {
    if (sort.active === 'subscription') {
      if (this.sortState === 'all') {
        this.sortState = 'premium';
        this.dataSource.data = this.originalData.filter((user: UserManagement) => user.subscription);
      } else if (this.sortState==='premium') {
        this.sortState = 'standard';
        this.dataSource.data = this.originalData.filter((user: UserManagement) => !user.subscription);
      } else {
        this.sortState = 'all';
      this.dataSource.data = this.originalData;
      }
    }
}
  blockUser(userId: string) {
    this.adminService.blockUser(userId).subscribe({
      next: (response: ApiResponse) => {
        if (response.statusCode === 200) {
          this.toaxtrService.success("Blocked user successfully")
          this.initUsersList()
        }
      }
    })
  }

  unblockUser(userId: string) {
  this.adminService.unblockUser(userId).subscribe({
      next: (response: ApiResponse) => {
        if (response.statusCode === 200) {
          this.toaxtrService.success("unblocked user successfully")
          this.initUsersList()
        }
      }
    })
  }
}






