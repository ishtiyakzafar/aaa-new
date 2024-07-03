import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNumerDecimalComma'
})
export class FormatNumberDecimalCommaPipe implements PipeTransform {

  transform(val: any, args?: any): any {
    if(args == 'U' || args == 'Z' ){
      return parseFloat(val).toLocaleString('en-IN', { minimumFractionDigits: 4})
    }
    else if(isNaN(val)){
        return 0;
    }
    // else if(val == "" || val == null){
    //   return '-';
    // }
    else{
      return parseFloat(val).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits:0})
    }
  }
}