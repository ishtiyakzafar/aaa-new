import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController, NavParams} from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  public isDropDownVisible: boolean = false;
  checkupList:any = [];
  selectedValue: any;
  datas: any[] = [
    {clientCode: 'S0001'},
    {clientCode: 'S0002'},
    {clientCode: 'S0003'},
    {clientCode: 'S0004'}
  ]

  public isSmallCase = false;
  constructor(private popoverController: PopoverController, private modalController: ModalController, private navParams: NavParams) { }



  ngOnInit() {
    this.checkupList = this.navParams.data['HealthCheckupList'];
    if (this.navParams.data['smallCase']) this.isSmallCase = this.navParams.data['smallCase'];
  }

  dismiss(params?: any) {
    if(params == 'close'){
      this.modalController.dismiss({
        selectedValue: null
      });
    }
    else{
      this.modalController.dismiss({
        selectedValue: this.selectedValue
      });
    }
    
  }

  getValue(value: any) {
    if (this.isSmallCase) {
      this.selectedValue = value;
    } else {
      this.selectedValue = value['ClientCode'];
    }
    this.isDropDownVisible = false;
    this.dismiss();
  }

  showDropDown() {
    this.isDropDownVisible = true;
  }

  hideDropDown() {
    // this.isDropDownVisible = false;
  }

  async openPopover(ev: any) {
    const items = [
      { title: 'NSE Cash'},
      { title: 'BSE Cash'},
      { title: 'NSE & FO'},
      { title: 'BSE F&O'},
      { title: 'NSE Currency'},
      { title: 'NSE Commodity'},
      { title: 'BSE Commodity'},
      { title: 'MCX Commodity'},
      { title: 'NCDEX Commodity'}
    ];
    ev.stopPropagation();
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      componentProps: { items: items },
      cssClass: "custom-popover select-popover search-popover",
      mode: "md",
      showBackdrop: false,
      event: ev
      // translucent: true
    });

    popover.onDidDismiss().then(data => {
      if (data["data"]) {
        const response = data['data'];
        if (response['result']['title']) {
          this.selectedValue = response['result']['title'];
        }
      }
    });
    return await popover.present();
  }

}
