import { Component, inject } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.css']
})
export class ConnectComponent {
  selectedIndex: number = 0;
  // MatTabGroup: MatTabGroup = inject(MatTabGroup)
  // matTab: MatTab = inject(MatTab)
  indexChangeEvent(index:number) {
    this.selectedIndex= index
  }

  console() {
    // this.MatTabGroup.color='primary'

    console.log('hai');
  }

}
