import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CallingscreenComponent } from './callingscreen/callingscreen.component';
import { AuthService } from 'src/app/services/auth.service';
import { AgoraService } from 'src/app/services/agora.service';
import { User } from 'src/app/types/user.inteface';
import { ApiResponse } from 'src/app/types/api.interface';
import { ConnectService } from 'src/app/services/connect.service';


@Component({
  selector: 'app-call-setup',
  templateUrl: './call-setup.component.html',
  styleUrls: ['./call-setup.component.css']
})
export class CallSetupComponent implements OnInit {

  @Output() callHistoryUpdate = new EventEmitter<string>();
  matDialog: MatDialog = inject(MatDialog);
  authService = inject(AuthService);
  agoraService = inject(AgoraService)
  connectService = inject(ConnectService)
  target: string;
  uid!: string
  gender!: string;
  isSubscriber?:boolean
  constructor() {
    this.target = 'any';
  }
ngOnInit(): void {
   const accessToken = this.authService.getAccessToken();
  const { _id,gender ,firstname} = this.authService.decodeJwtPayload(accessToken as string)
  this.uid = _id+' '+firstname+' '+gender;

  this.authService.getUserInfo().subscribe({
    next: (response: ApiResponse) => {
      const userData = response.data as User;
      this.gender = userData.gender;
      this.isSubscriber = userData.subscription  
  }
})

    this.agoraService.strangerInfoSupplier.subscribe({
      next: (info) => {
        if (info.gender === 'nouser') {
          this.callHistoryUpdate.emit('updatecallhistory')
        }
      }
    })
}


     connectToCall() {
       this.agoraService.getChannelName(this.target).subscribe((response) => {
         console.log(response,'hai hai hai hai');
         const channel = response.data.channelName;

         this.agoraService.startCall(channel,this.uid);
    })
    this.matDialog.open(CallingscreenComponent, {
      data: { title: "calling",gender:this.gender},
      disableClose:true
    }).afterClosed()
  }
  leaveCall() {
    this.agoraService.leaveCall();
  }
}
 