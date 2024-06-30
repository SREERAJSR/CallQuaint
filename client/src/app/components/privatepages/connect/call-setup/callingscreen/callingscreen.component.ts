import { Component, Inject, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AgoraService } from 'src/app/services/agora.service';
import { ConnectService } from 'src/app/services/connect.service';
import { ApiResponse } from 'src/app/types/api.interface';
import { CallingScreenDialog, } from 'src/app/types/confirm-dialog-data';

@Component({
  selector: 'app-callingscreen',
  templateUrl: './callingscreen.component.html',
  styleUrls: ['./callingscreen.component.css']
})
export class CallingscreenComponent implements OnInit ,OnDestroy {
  constructor(@Inject(MAT_DIALOG_DATA) public data: CallingScreenDialog) {}
  open = false;
  agoraService = inject(AgoraService);
  connectService  = inject(ConnectService)
  remoteGender: string|null =null
  remoteUserName: string|null =null;
  timer: number = 0; // Initialize the timer value
  strangerinfoSupplierSubscription$?: Subscription;
  removeListeneingFromSelfHostSubscription$?: Subscription;

  ngOnInit(): void {
  this.strangerinfoSupplierSubscription$=  this.agoraService.strangerInfoSupplier.subscribe({
      next: (info) => {
        this.remoteGender = info.gender;
        this.remoteUserName=info.name
      }
    })

  }
  removeFromListening() {
   this.removeListeneingFromSelfHostSubscription$= this.connectService.removeListeningFromSelfHost().subscribe({
      next: (res: ApiResponse) => {
        if (res.statusCode === 200) {
  this.agoraService.leaveWithOutCall()
        }
  }
})
}


  endcall() {
    this.agoraService.leaveCall()
    this.open = true;
    this.remoteUserName = null;
    this.remoteGender = null;
  }


ngOnDestroy(): void {
  this.strangerinfoSupplierSubscription$?.unsubscribe();
  this.removeListeneingFromSelfHostSubscription$?.unsubscribe();

}
}
