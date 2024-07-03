import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-commodity-contract-info',
  templateUrl: './commodity-contract-info.component.html',
  styleUrls: ['./commodity-contract-info.component.scss'],
})
export class CommodityContractInfoComponent implements OnInit {
  contractInfo:any;
  contractInfosList:any;
  contractInfosListParams:any
  msgNoData:any;

  constructor( public modalController: ModalController, private navParams: NavParams) { }

  ngOnInit() {
   this.contractInfo = this.navParams.data['contractInfoData'];
  //  console.log(this.contractInfo['body']);
  //  console.log(this.contractInfo['head'].status);
   if(this.contractInfo['head'].status == 0){
      this.contractInfosListParams =this.contractInfo['body']
      this.contractInfosList = [
        {type: 'Price Range', value: this.contractInfosListParams.PriceRange},
        {type: 'Price Unit', value:this.contractInfosListParams.PriceUnit},
        {type: 'Quantity Unit', value: this.contractInfosListParams.QtyUnit},
        {type: 'Delivery Unit', value: this.contractInfosListParams.DeliveryUnit},
        {type: 'Tick Size', value: this.contractInfosListParams.TickSize},
        {type: 'Lot Size', value: this.contractInfosListParams.LotSize},
        {type: 'Max order value', value: this.contractInfosListParams.MaxOrderValue},
        {type: 'Contract Start Date', value: this.contractInfosListParams.ContractStartDt},
        {type: 'Tender Start Date', value: this.contractInfosListParams.TenderStartDt},
        {type: 'Tender End Date', value: this.contractInfosListParams.TenderEndDt},
        {type: 'Delivery Start Date', value: this.contractInfosListParams.DelievryStartDt},
        {type: 'Delivery End Date', value: this.contractInfosListParams.DelievryEndDt}
      ];
      // console.log(this.contractInfosList);
      // console.log('1st value',this.contractInfosList.ContractStartDt);
      // console.log(this.displaydash(this.contractInfosList.ContractStartDt));
   }
   else{
     this.msgNoData = 'No Data Found';
   }
  
  }
  displaydash(value: any){
    if(value == ""){
      return "-";
    }
    else{
      return value;
    }

  }

  // close popup
  async dismiss() {
    this.modalController.dismiss();
  }

}
