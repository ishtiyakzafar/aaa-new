import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-table-dropdown',
  templateUrl: './table-dropdown.component.html',
  styleUrls: ['./table-dropdown.component.scss'],
})
export class TableDropdownComponent implements OnInit {
  @Input() items: any;
  constructor(
    private router: Router,
    private popoverController: PopoverController
  ) {}

  ngOnInit() {
  }

  // public onItemClick(item) {
  //   this.dismiss(item);
  // }
  async breakDown(){
    await this.popoverController.dismiss({
      result: {value : this.items[0]['value'], type: this.items[0]['type']},
      model:'breakdown'
    });
  }

  async stockDetail(){
    let stockData = {
			"stockCode" :  this.items[0]['value'],
			"currentValue" :  this.items[0]['holding']
    }
    localStorage.setItem('stockDetails', JSON.stringify(stockData))
    await this.popoverController.dismiss({
      result: {value : this.items[0]['value'], type: this.items[0]['holding']},
      model:'stockDetail'
    });
  }

}
