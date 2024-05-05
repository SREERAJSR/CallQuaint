import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function emailValidator(): ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null=>{
        const email = control.value;
       const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.(com|net|org|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)$/;

        if (email && !emailRegex.test(email)) {
            return {invalidEmail:true}
        }
        return null;
    }
}

export function lowerCaseValidator(): ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {
        const email = control.value as string;
        const isLowerCase = (email: string) => email === email.toLowerCase();
        if (email && !isLowerCase(email)) {
            return {notLowerCase:true}
        }
        return null
    }
}


export function confirmPasswordValidator(passsword:AbstractControl): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
      const password = passsword.value;
    const confirmPassword = control.value;
    if (!password && !confirmPassword) {
      return null;
    }
    if (!password || !confirmPassword) {
      return { passwordMismatch: true };
    }
    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  };

}