import { Component, OnDestroy, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ApiResponse } from 'src/app/types/api.interface';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent implements OnDestroy {

  adminService = inject(AdminService)
  authServices = inject(AuthService)
  matDialog = inject(MatDialog)
  toastr = inject(ToastrService)
  router = inject(Router)
  logoutAdminSubscription ?:Subscription
  logoutAdmin() {
  const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
    data:{title:"Confirmation",message: "Are you sure you want to logout?"
},
    disableClose:true
  }).afterClosed().subscribe((res) => {
    if (res) {
   this.logoutAdminSubscription=  this.adminService.logoutAdmin().subscribe({
        next: (response: ApiResponse) => {
          if (response.statusCode === 200) {
            this.authServices.removeAdminAccessToken()
            this.authServices.removeAdminRefreshToken()
            this.toastr.success('admin logout success');
            this.router.navigate(['/admin/login'])
          }
     
        }
      })
    }

    })
  }

  ngOnDestroy(): void {
    this.logoutAdminSubscription?.unsubscribe()
  }

}
