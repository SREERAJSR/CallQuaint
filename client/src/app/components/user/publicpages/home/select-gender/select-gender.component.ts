import { Component, Inject, OnInit, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { setGender } from 'src/app/store/auth/actions';
import { selectUserState } from 'src/app/store/auth/selectors';
import { AppState } from 'src/app/store/store';
import { ConfirmDialogData } from 'src/app/types/confirm-dialog-data';

@Component({
  selector: 'app-select-gender',
  templateUrl: './select-gender.component.html',
  styleUrls: ['./select-gender.component.css']
})
export class SelectGenderComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData) { }
  selectedGender: string = 'male';
  genderStatus: string | null = null;
  open:boolean=false
  store = inject(Store<AppState>)
  matDialog: MatDialog = inject(MatDialog);
  genderSelectSubmit(genderForm: NgForm) {
    if (genderForm.valid) {
const payload:{gender:string}= genderForm.value
      this.store.dispatch(setGender(payload))
    }
  }

  ngOnInit(): void {
    this.store.select(selectUserState).subscribe((state) => {
      this.genderStatus = state?.gender ?? null
      if (this.genderStatus) {
        this.open = true;
      }
    })
  }
}
