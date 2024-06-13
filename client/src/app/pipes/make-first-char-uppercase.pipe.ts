import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'makeFirstCharUppercase'
})
export class MakeFirstCharUppercasePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string{

    if (!value) return ''
    
    const firstChar: string = value.split('')[0].toUpperCase();
    const restOfString = value.slice(1).toLowerCase();

    return firstChar+restOfString
  }

}
