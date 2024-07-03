import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  transform(val: any, args?: any): any {
    var formattedDate;
    let sliceddate = val.slice(6, 19);
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let utcSeconds = sliceddate / 1000;
        let date1 = new Date(0); // The 0 there is the key, which sets the date to the epoch
        date1.setUTCSeconds(utcSeconds);
        let date = date1.getDate();
        let month = months[date1.getMonth()];
        let year = date1.getFullYear();
    
		return formattedDate = date + ' ' + month + ' ' + year;
  }
}