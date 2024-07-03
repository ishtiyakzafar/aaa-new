import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateSorting'
})
export class DateSortingPipe implements PipeTransform {

  public moment: any = moment;

  transform(dataList: any, field: string, order: boolean): any[] {
    dataList.sort(function (first: any, next: any) {
      if(localStorage.getItem('sortValue') == 'Date' && first && first.Date){
        if(order){
          var aa = first.Date.split('/').reverse().join(), bb = next.Date.split('/').reverse().join();
        }
        else{
          var bb = first.Date.split('/').reverse().join(), aa = next.Date.split('/').reverse().join();
        }
      }
      else if(localStorage.getItem('sortValue') == 'Closed_Date' && first && first.Closed_Date){
        if(order){
          var aa = first.Closed_Date.split('/').reverse().join(), bb = next.Closed_Date.split('/').reverse().join();
        }
        else{
          var bb = first.Closed_Date.split('/').reverse().join(), aa = next.Closed_Date.split('/').reverse().join();
        }
      }
      else if(localStorage.getItem('sortValue') == 'Created_Time' && first && first.Created_Time){
        if(order){
          var aa = first.Created_Time.split('/').reverse().join(), bb = next.Created_Time.split('/').reverse().join();
        }
        else{
          var bb = first.Created_Time.split('/').reverse().join(), aa = next.Created_Time.split('/').reverse().join();
        }
      }
      return aa < bb ? -1 : (aa > bb ? 1 : 0);
    });
    return dataList;
  }
}
