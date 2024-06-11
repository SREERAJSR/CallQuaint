import { Injectable, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private toaxtr:ToastrService,
    private zone:NgZone
  ) { }


  showClientError(message: string):void {
    this.zone.run(() => {
      this.snackBar.open(`Error: ${message}`, 'Okay', {
        panelClass:['error-snack']
      })
    })
  }

  openServerErrorDialog(message: string) {
    this.zone.run(() => {
   this.toaxtr.error(message)
 })
  }

  showNonErrorSnackBar(message: string, duration = 6000) {
    this.snackBar.open(message, 'Okay', {
      panelClass: ['non-error-snack'],
      duration:duration
  })
}


}
