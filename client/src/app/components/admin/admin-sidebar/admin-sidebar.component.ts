import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ApiResponse } from 'src/app/types/api.interface';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent {

  adminService = inject(AdminService)
  matDialog = inject(MatDialog)
  toastr = inject(ToastrService)
  router = inject(Router)
  logoutAdmin() {
  const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
    data:{title:"Confirmation",message: "Are you sure you want to logout?"
},
    disableClose:true
  }).afterClosed().subscribe((res) => {
    if (res) {
      this.adminService.logoutAdmin().subscribe({
        next: (response: ApiResponse) => {
          if (response.statusCode === 200) {
          this.toastr.success('admin logout success');
    this.router.navigate(['/admin'])
          }
     
        }
      })
    }

    })
  }

}
