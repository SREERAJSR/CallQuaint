import { Component, ViewChild, inject } from '@angular/core';
import { MatTab, MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { CallsAndHistoryComponent } from './calls-and-history/calls-and-history.component';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.css']
})
export class ConnectComponent {
  selectedIndex: number = 0;
  @ViewChild('callHistoryComponent')historyComponent?: CallsAndHistoryComponent;
  constructor() {
    // this.MatTabGroup._allTabs
  }
  callHistoryTrigger:boolean= false;
  triggerHistoryUpdate(str: string) {
    if (str === 'updatecallhistory') {
      this.callHistoryTrigger=true
    }
  }

matTabIndex?:number
  onTabChanged(event: MatTabChangeEvent) {
    this.matTabIndex = event.index;
    if (this.matTabIndex === 3) {
      this.historyComponent?.initHistoryData();
    }
  }
}
