import { Pipe, PipeTransform } from '@angular/core';
import { orderBy } from 'lodash';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(array: any, arg2: any, order: any): any[] { 
    return orderBy(array, arg2, order); 
} 

}
