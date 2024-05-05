import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatInputModule} from '@angular/material/input';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule, matFormFieldAnimations} from '@angular/material/form-field';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialogModule} from '@angular/material/dialog';


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
    MatInputModule, MatSidenavModule,
    MatTooltipModule,
    MatDialogModule
  ],
  exports: [MatSlideToggleModule, MatButtonModule, MatIconModule, MatDividerModule, MatFormFieldModule, MatInputModule,MatSidenavModule,MatTooltipModule,MatDialogModule],
  providers:[]

})
export class MaterialModule { }