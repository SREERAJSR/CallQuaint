import { AfterViewInit, Component, ElementRef, HostListener, Renderer2, ViewChild, ViewChildren, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

import { AuthService } from 'src/app/services/auth.service';
import { NotificationComponent } from './notification/notification.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { AppState } from 'src/app/store/store';
import { Store } from '@ngrx/store';
import { logout } from 'src/app/store/auth/actions';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  renderer2 = inject(Renderer2);
  authService = inject(AuthService)
  matDialog:MatDialog = inject(MatDialog)
store:Store<AppState> = inject(Store<AppState>)
  isScrolled = false;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
console.log(scrollPosition)
    if (scrollPosition > 0  ) {
      this.isScrolled = true
      this.renderer2.addClass(document.querySelector('header'), 'scrolled')
    } else {
      this.isScrolled = false;
      this.renderer2.removeClass(document.querySelector('header'),'scroll')
    }
    }

  @ViewChild('menusection') menu?: ElementRef;
  onToggleMenu(el: MatIcon) {
  el.fontIcon = el.fontIcon === 'menu' ? 'close' : 'menu';
  if (this.menu?.nativeElement.classList.contains('top-[-1000%]')) {
    this.renderer2.removeClass(this.menu?.nativeElement, 'top-[-1000%]');
    this.renderer2.addClass(this.menu?.nativeElement, 'top-16');    
  } else {
    this.renderer2.removeClass(this.menu?.nativeElement, 'top-16');
    this.renderer2.addClass(this.menu?.nativeElement, 'top-[-1000%]');
  }
  }    
  
  notification = false;
// this.matDialog.open(component,{
//       data : data,
//       disableClose: true,
//     }).afterClosed();

logout() {
  const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
    data:{title:"Confirmation",message: "Are you sure you want to perform this action?"
},
    disableClose:true
  }).afterClosed().subscribe((res) => {
    if (res) {
      this.store.dispatch(logout())
    }
    })


}

}
                