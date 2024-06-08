import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeago'
})
export class TimeagoPipe implements PipeTransform {

  transform(value: string,): string {

    if (!value) {
      return ''
    }

    const messageTimeStamp = new Date(value)
    const currentTime = new Date();
    const timeDiff = currentTime.getTime() - messageTimeStamp.getTime();

    if (timeDiff < 60000) {
      return 'just now'
    } else if (timeDiff < 3600000) {
      const minutes = Math.floor(timeDiff / 60000);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (timeDiff < 86400000) {
      const hours = Math.floor(timeDiff / 3600000);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return messageTimeStamp.toLocaleString();
    }
    return '';
  }

}
