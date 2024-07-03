import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent implements OnInit {
  public activeStatus: any = 'Scrip Code';
  @Input() orderbookFilter: any;
  // public filterOption: any[] = [
  //   {option: 'Scrip Code'},
  //   {option: 'Scrip Name'},
  //   {option: 'Status'},
  //   {option: 'Requested By'},
  //   {option: 'Quantity'},
  // ];
  constructor(private modalController: ModalController) { }

  ngOnInit() {
    // console.log(this.orderbookFilter);
  }

  selectItem(index: any, arr: any, item: any) {
    this.dismiss(item);
    arr.forEach((element: any, ind: any) => {
      if ((index) !== ind) {
        element['isSelected'] = false;
      } else {
        element['isSelected'] = true;
      }
    });
  }

  // public onItemClick(item) {
  //   this.dismiss(item);
  // }

  async dismiss(val?: any) {
    await this.modalController.dismiss({
      result: val
    });
  }

  // dismiss() {
  //   this.modalController.dismiss();
  // }

}
