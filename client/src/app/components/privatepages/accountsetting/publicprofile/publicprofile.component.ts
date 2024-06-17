import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { emailValidator, lowerCaseValidator } from 'src/app/custom-validators/auth-validators';
import { AuthService } from 'src/app/services/auth.service';
import { ApiResponse } from 'src/app/types/api.interface';
import { User } from 'src/app/types/user.inteface';

@Component({
  selector: 'app-publicprofile',
  templateUrl: './publicprofile.component.html',
  styleUrls: ['./publicprofile.component.css']
})
export class PublicprofileComponent implements OnInit ,OnDestroy{
  
  authServices = inject(AuthService)
  toaxt = inject(ToastrService)
  formbuilder = inject(FormBuilder)
  constructor() {
    
    
  }
  ngOnInit(): void {

    this.userProfileEditForm = this.formbuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email, emailValidator(), lowerCaseValidator()]],
      gender:["",[Validators.required]],
   })
    this.authServices.getUserInfo().subscribe({
      next: (response: ApiResponse) => {
        const user: User = response.data
        this.user = user
        this.imageUrl = user.avatar
        this.userProfileEditForm?.patchValue({
          firstname: this.user.firstname,
          lastname: this.user.lastname,
          email: this.user.email,
          gender:this.user.gender
        })
      }
    })

   
  }

  userProfileEditForm?:FormGroup
   
  
  imageUrl?: string
  getUserInfoSubscrition?: Subscription
  user?: User
  selectedFile?:File
  onFileSelected(event: Event) {
    console.log(event.target);
    const input = event.target as HTMLInputElement

    if (input.files && input.files[0]) {
      const file = input.files[0]
      if (!file.type.startsWith('image/')) {
        this.toaxt.error('Please select a valid image')
        input.value = ''
        return
      }

      if (file.size > 1 * 1024 * 1024) { // 1 MB in bytes
         this.toaxt.warning('Please select an image smaller than 1 MB.')
        input.value = ''; 
        return;
      }
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl =reader.result as string
      }
            reader.readAsDataURL(file);
    } 
  }


  submitForm() {
    const values = this.userProfileEditForm?.value;
    if (this.userProfileEditForm?.valid) {
      this.selectedFile = this.imageUrl !==this.selectedFile?this.selectedFile:undefined
      const payload = new FormData()
      if (this.selectedFile !== this.imageUrl) {
        payload.append('avatar',this.selectedFile!)
      }
      payload.append('firstname',values.firstname)
      payload.append('lastname',values.lastname)
      payload.append('email',values.email)
      payload.append('gender',values.gender)
      this.authServices.editProfile(payload).subscribe({
        next: (response: ApiResponse) => {
          if (response.statusCode === 200) {
            this.toaxt.success(response.message)
            console.log(response);
            this.authServices.setAccessToken(response.data.accessToken)
            this.authServices.setRefreshToken(response.data.refreshToken)
          }
        }
      })
    }
  }
  ngOnDestroy(): void {
    this.getUserInfoSubscrition?.unsubscribe()
  }

}
