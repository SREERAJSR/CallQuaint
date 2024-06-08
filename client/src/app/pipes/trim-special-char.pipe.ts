import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trimSpecialChar'
})
export class TrimSpecialCharPipe implements PipeTransform {

  transform(value: string,): string {
  
    if (!value) {
      return ''
    }
        const specialCharPattern = /[^a-zA-Z0-9 ]/g;
    return value.replace(specialCharPattern,'')
  }

}
