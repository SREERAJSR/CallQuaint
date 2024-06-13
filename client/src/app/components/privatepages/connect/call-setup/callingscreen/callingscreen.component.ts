import { Component, Inject, Input, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AgoraService } from 'src/app/services/agora.service';
import { CallingScreenDialog, ConfirmDialogData } from 'src/app/types/confirm-dialog-data';

@Component({
  selector: 'app-callingscreen',
  templateUrl: './callingscreen.component.html',
  styleUrls: ['./callingscreen.component.css']
})
export class CallingscreenComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: CallingScreenDialog) {}
  // @Input() avatar?: string;
  open = false;
  agoraService = inject(AgoraService);
  remoteGender?: string
  remoteUserName?: string;
    timer: number = 0; // Initialize the timer value

  ngOnInit(): void {
    this.agoraService.strangerInfoSupplier.subscribe({
      next: (info) => {
        this.remoteGender = info.gender;
        this.remoteUserName=info.name
      }
    })

  }

  endcall() {
    this.agoraService.leaveCall()
    this.open = true;
  }



}
