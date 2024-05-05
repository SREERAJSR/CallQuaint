import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-call-setup',
  templateUrl: './call-setup.component.html',
  styleUrls: ['./call-setup.component.css']
})
export class CallSetupComponent {

  @Output() index: EventEmitter<number> = new EventEmitter<number>();
  startCall() {
    this.index.emit(1);
  }
}
