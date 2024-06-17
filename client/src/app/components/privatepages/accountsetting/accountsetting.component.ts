import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accountsetting',
  templateUrl: './accountsetting.component.html',
  styleUrls: ['./accountsetting.component.css']
})
export class AccountsettingComponent implements OnInit {

  ngOnInit(): void {
    
  }

  currentPage?:string='profile'

  setCurrentPage(page: string) {
    this.currentPage =page
  }
  scrollToSection(event: Event, sectionId: string) {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
