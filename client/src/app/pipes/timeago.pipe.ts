import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeago'
})
export class TimeagoPipe implements PipeTransform {

  transform(value: string): string {

    if (!value) {
      return ''
    }

    const messageTimeStamp = new Date(value);
    const currentTime = new Date();
    const timeDiff = currentTime.getTime() - messageTimeStamp.getTime();

    if (timeDiff < 60000) {
      return 'just now';
    } else if (timeDiff < 3600000) {
      const minutes = Math.floor(timeDiff / 60000);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (timeDiff < 86400000) {
      const hours = Math.floor(timeDiff / 3600000);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (timeDiff < 2592000000) { // 30 days
      const days = Math.floor(timeDiff / 86400000);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (timeDiff < 31536000000) { // 365 days
      const months = Math.floor(timeDiff / 2592000000);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(timeDiff / 31536000000);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  }
}
