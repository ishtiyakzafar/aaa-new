import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, Platform } from '@ionic/angular';
import { FundTransferService } from '../../pages/fund-transfer/fund-transfer.service';
import * as moment from 'moment';

@Component({
  selector: 'app-payout-history',
  providers: [FundTransferService],
  templateUrl: './payout-history.component.html',
  styleUrls: ['./payout-history.component.scss'],
})
export class PayoutHistoryComponent implements OnInit {
  dataLoad:boolean = false;
  payOutData: any[] = [
    {price: '19,500.00', date: '04/05/2020', bank: 'ICICI Bank', ifsc: '003509898914', payout: '19,500.00', payoutdate: '06/02/2018'},
    {price: '19,501.00', date: '05/05/2020', bank: 'SBI Bank', ifsc: '003509898915', payout: '19,501.00', payoutdate: '07/02/2018'},
    {price: '19,504.00', date: '06/05/2020', bank: 'IDBI bank', ifsc: '003509898915', payout: '19,502.00', payoutdate: '08/02/2018'},
    {price: '19,505.00', date: '07/05/2020', bank: 'Axis Bank', ifsc: '003509898918', payout: '19,504.00', payoutdate: '07/02/2020'}
  ]
  payoutHistory:any[] = [];
  moment: any= moment;
  constructor(private modalController: ModalController, private fundTransferSer: FundTransferService) { }

  ngOnInit() {
    let clientCode = localStorage.getItem('select_client') ? JSON.parse(localStorage.getItem('select_client') || '{}')['ClientCode'] : "{}";
   
    this.fundTransferSer.getPayoutHistory(clientCode).subscribe((res: any) => {
      setTimeout(() => {
        this.dataLoad = true 
      }, 1000);
     if(res['Status'] == 0){
      this.payoutHistory = res['HistoryData'];
    }
     else{
      this.payoutHistory = [];
     }
    

  })
    
  }

  goBack(){
    window.history.back();
  }

  async dismiss() {
		await this.modalController.dismiss();
	}

}
