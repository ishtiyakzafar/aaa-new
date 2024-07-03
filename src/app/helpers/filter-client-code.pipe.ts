import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterClientCode'
})
export class FilterClientCodePipe implements PipeTransform {

  transform(items: any, searchText: string): any[] {
    if(!items) return [];
    if(!searchText) return items;

    searchText = searchText.toLowerCase();

    // return items.filter( item => {
    return items.filter( (item: { ClientCode: string; }) => {
      return item.ClientCode.toLowerCase().includes(searchText);
    });
  }

}
