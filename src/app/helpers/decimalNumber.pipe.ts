import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNumerDecimal'
})
export class FormatNumberDecimalPipe implements PipeTransform {

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
      return parseFloat(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits:2})
    }
  }
}




// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({
//   name: 'formatNumerDecimal'
// })
// export class FormatNumberDecimalPipe implements PipeTransform {

//   transform(val: any, args?: any): any {
//     if(args == 'U'){
//         return this.formatNumberComma(parseFloat(val).toFixed(4));
//       }
//       else if(isNaN(val)){
//           return 0;
//       }
//       else{
//         return this.formatNumberComma(parseFloat(val).toFixed(2));
//       }
//     }
//     formatNumberComma(value){
//         var parts = value.toString().split(".");
//         parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//         return parts.join(".");
//     }
// }
