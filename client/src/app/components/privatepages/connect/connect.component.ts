import {  Component, ViewChild } from '@angular/core';
import {  MatTabChangeEvent} from '@angular/material/tabs';
import { CallsAndHistoryComponent } from './calls-and-history/calls-and-history.component';
import { FriendsComponent } from './friends/friends.component';
import { RequestsComponent } from './requests/requests.component';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.css'],
})
export class ConnectComponent {
  selectedIndex: number = 0;
  @ViewChild('callHistoryComponent') historyComponent?: CallsAndHistoryComponent;
  @ViewChild('friendsComponent') friendsComponent?: FriendsComponent;
  @ViewChild('requestComponent') requestsComponent?:RequestsComponent
  constructor() {}
  callHistoryTrigger:boolean= false;
  triggerHistoryUpdate(str: string) {
    if (str === 'updatecallhistory') {
      this.callHistoryTrigger=true
    }
  }

matTabIndex?:number
  onTabChanged(event: MatTabChangeEvent) {
    this.matTabIndex = event.index;
    if (this.matTabIndex === 1) {
      this.friendsComponent?.initFriendsListData()
    } else if (this.matTabIndex === 2) {
      this.requestsComponent?.initFriendRequestData()
    } else if (this.matTabIndex === 3) {
      this.historyComponent?.initHistoryData()
    }
  }
}
