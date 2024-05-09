import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CallingscreenComponent } from './callingscreen/callingscreen.component';
import { AuthService } from 'src/app/services/auth.service';
import { AgoraService } from 'src/app/services/agora.service';

@Component({
  selector: 'app-call-setup',
  templateUrl: './call-setup.component.html',
  styleUrls: ['./call-setup.component.css']
})
export class CallSetupComponent implements OnInit {

  matDialog: MatDialog = inject(MatDialog);
  authService = inject(AuthService);
  agoraService = inject(AgoraService)

ngOnInit(): void {
   const accessToken = this.authService.getAccessToken();
  const { _id } = this.authService.decodeJwtPayload(accessToken as string)
}


     connectToCall() {
       this.agoraService.getChannelName('any').subscribe((response) => {
         const channel = response.data.channelName;
         this.agoraService.startCall(channel);
    })
    // this.matDialog.open(CallingscreenComponent, {
    //   data: { title: "calling", message: "hai haia" },
    //   disableClose:true
    // }).afterClosed().subscribe((res) => {
      
    // })
  }
  leaveCall() {
    this.agoraService.leaveCall();
  }
}
