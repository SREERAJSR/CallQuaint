import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements  AfterViewInit {
  showFiller = false; 
@ViewChild('drawer')drawer?:MatDrawer



  ngAfterViewInit(): void {
    this.toggleDrawer()
  }
    toggleDrawer() {
    this.drawer?.toggle()
} 
}
