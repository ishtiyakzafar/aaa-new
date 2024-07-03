import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitNameDate'
})
export class SplitNameDate implements PipeTransform {

  transform(val: any, args?: any): any {
    var array = [];
    //  var months = 'Jan' ||  'Feb'|| 'Mar' || 'Apr' ||'May' || 'Jun' || 'Jul'|| 'Aug'|| 'Sep'|| 'Oct'|| 'Nov'|| 'Dec';
      
            var res = val.split(' ')[0];
            var res1 = val.split(res)[1];
            array = [res,res1]
  
     
            if(args == "name"){
            return array[0];
            }
            if(args == "date"){
            return array[1];

        }
    }

}