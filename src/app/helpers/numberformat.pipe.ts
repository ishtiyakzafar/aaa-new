import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberformat'
})
export class NumberformatPipe implements PipeTransform {

  transform(value: any): any {
    
    var x = value.toString();
    var afterPoint = '';
    if(x.indexOf('.') > 0)
       afterPoint = x.substring(x.indexOf('.'),x.length);
    x = Math.floor(x);
    x=x.toString();
    var lastThree = x.substring(x.length-3);
    var otherNumbers = x.substring(0,x.length-3);
    if(otherNumbers != '')
        lastThree = ',' + lastThree;
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint
    return res;
  }

}
