import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { selectUserLoginState, selectUserState } from 'src/app/store/auth/selectors';
import { AppState } from 'src/app/store/store';
import { SelectGenderComponent } from './select-gender/select-gender.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  store = inject(Store<AppState>)
  matdialog: MatDialog = inject(MatDialog)
  genderState: null | undefined| string = null;
  authService = inject(AuthService)
    userLoggedIn: boolean = false;
  ngOnInit(): void {
    this.store.select(selectUserLoginState).subscribe((status) => {
      this.userLoggedIn= status
    })
    this.store.select(selectUserState).subscribe((userState) => {
      this.genderState = userState?.gender
    })
    console.log(this.genderState);
      if (this.genderState===null && this.userLoggedIn) {
        
     this.matdialog.open(SelectGenderComponent, {
          data: {
            title: "Select gender"
          },
          disableClose: true
        }).afterClosed().subscribe((res) => {
          if (res) {
          }
        })
      }
  
  }

}
