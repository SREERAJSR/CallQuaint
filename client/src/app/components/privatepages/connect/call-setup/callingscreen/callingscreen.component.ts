import { Component, inject } from '@angular/core';
import { AgoraService } from 'src/app/services/agora.service';

@Component({
  selector: 'app-callingscreen',
  templateUrl: './callingscreen.component.html',
  styleUrls: ['./callingscreen.component.css']
})
export class CallingscreenComponent {

  open = false;
  agoraService = inject(AgoraService);
  endcall() {
    this.agoraService.leaveCall()
    this.open = true;
  }
}
