import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNumberUnit'
})
export class FormatUnitNumberPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    var val, signValue
    signValue = value
    val = Math.abs(value)
    if (val >= 10000000) {
      val = this.formatNumberComma(this.displayDecimalDigits(val / 10000000)) + 'Cr';
      
    } else if (val >= 100000) {
      val = this.formatNumberComma(this.displayDecimalDigits(val / 100000)) + 'L' ;
    }
    else if(val >= 1000){
     val = this.formatNumberComma(this.displayDecimalDigits(val / 1000)) + 'K';
    }	
    else if(val < 100 )	{
      val = this.displayDecimalDigits(val);
    }	
    else if(value == '-'){
      val = "-"
    }
    if(signValue < 0){
      return '-'+val;
    }
    else{
      return val;
    }
  }


  formatNumberComma(value: any){
    var parts = value.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
     
   }

   displayDecimalDigits(value: any) {
    if(value == 0 || value == Math.round(value)){
      return value
    }
    else{
     return value.toFixed(2);
    }
   
 }

}