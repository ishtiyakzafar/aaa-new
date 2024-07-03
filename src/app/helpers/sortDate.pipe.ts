import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "sortDate"
})
export class SortDatePipe implements PipeTransform {

  transform(dataList: any, field: string, order: boolean): any[] {
    dataList.forEach((element: any) => {
      let a1 = element.DOB1.slice(0, 5).split('/');
      let a2 = a1[1] + a1[0];
      let curDate = '' + new Date().getDate().toString();
      let curMonth = '' + (new Date().getMonth()+1).toString();
  
      if(curMonth.length == 1){
        curMonth = '0' + curMonth;
      }
      if(curDate.length == 1){
        curDate = '0' + curDate;
      }

      let currDate = curMonth + curDate;
      
      if(Number(currDate) <= Number(a2)){
        element.a2 = Number(a2);
      }
      else{
        element.a3 = Number(a2);
      }
    });
    if (order) {
      let d1 = [];
      let d2 = [];
      d1 = dataList.filter((e: any) => e.a2);
      d1 = d1.sort(function(a: any, b: any) {
        let keyA = a.a2 , keyB = b.a2;
        if (keyA > keyB) return -1;
        if (keyA < keyB) return 1;
        return 0;
      });

      d2 = dataList.filter((e: any) => e.a3);
      d2 = d2.sort(function(a: any, b: any) {
        let keyA = a.a3 , keyB = b.a3;
        if (keyA > keyB) return -1;
        if (keyA < keyB) return 1;
        return 0;
      });

      let result = [...d2, ...d1];
      return result;
    } 
    else {
      let d1 = [];
      let d2 = [];
      d1 = dataList.filter((e: any) => e.a2);
      d1 = d1.sort(function(a: any, b: any) {
        let keyA = a.a2 , keyB = b.a2;
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });

      d2 = dataList.filter((e: any) => e.a3);
      d2 = d2.sort(function(a: any, b: any) {
        let keyA = a.a3 , keyB = b.a3;
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });

      let result = [...d1, ...d2];
      return result;

    }
    
  }
}