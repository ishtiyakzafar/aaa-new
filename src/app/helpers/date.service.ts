import { Injectable, PipeTransform, Pipe } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

@Pipe({
     name: 'customDate'
   })
export class DateService extends DatePipe implements PipeTransform {  // never used

  // transform(date: Date, args?: any): any {
  //   return super.transform(date, "EEEE d MMMM y h:mm a");
  // }

}
