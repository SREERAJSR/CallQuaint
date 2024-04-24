import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatInputModule} from '@angular/material/input';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule, matFormFieldAnimations} from '@angular/material/form-field';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule
  ],
  exports: [MatSlideToggleModule, MatButtonModule, MatIconModule, MatDividerModule, MatFormFieldModule, MatInputModule],
  providers:[]

})
export class MaterialModule { }
