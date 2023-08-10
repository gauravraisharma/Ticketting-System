import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-timezone';
@Pipe({
  name: 'timeZone'
})
export class TimeZonePipe implements PipeTransform {

  transform(date: string, timeZone: string, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
    if (!date) return '';
    if (timeZone === '' || timeZone === null || timeZone === undefined) {
      timeZone = 'Asia/Kolkata';
      localStorage.setItem('timeZone', timeZone);
    }
    const convertedDate = moment.utc(date).tz(timeZone);

    const formattedDate = convertedDate.format(format);

    console.log(formattedDate);
    return formattedDate;
  }

}
