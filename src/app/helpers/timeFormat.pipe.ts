import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime'
})
export class FormatTime implements PipeTransform {

  transform(val: any, args?: any): any {
    var formatedTime
    let sliceddate = val.slice(6, 19);
    let utcSeconds = sliceddate / 1000;
    let date1 = new Date(0); // The 0 there is the key, which sets the date to the epoch
    date1.setUTCSeconds(utcSeconds);
    formatedTime = date1.toLocaleTimeString();
     
    return formatedTime;

  }

}