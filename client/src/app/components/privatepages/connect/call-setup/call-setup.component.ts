import { Component, EventEmitter, Output, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CallingscreenComponent } from './callingscreen/callingscreen.component';

@Component({
  selector: 'app-call-setup',
  templateUrl: './call-setup.component.html',
  styleUrls: ['./call-setup.component.css']
})
export class CallSetupComponent {

  matDialog: MatDialog = inject(MatDialog);

  connectToCall() {
    this.matDialog.open(CallingscreenComponent, {
      data: { title: "calling", message: "hai haia" },
      disableClose:true
    }).afterClosed().subscribe((res) => {
      
    })
  }
}
