import { Component, Input, OnInit, OnChanges } from '@angular/core';
import {Platform } from '@ionic/angular';
import { CommonService } from '../../helpers/common.service';

@Component({
  selector: 'app-client-margin',
  templateUrl: './client-margin.component.html',
  styleUrls: ['./client-margin.component.scss'],
})
export class ClientMarginComponent implements OnInit, OnChanges {
  @Input() margin: any;
  public datas: any[] = [];
  equityMarginDetails: any[] = [];
  totalAvailBalance:any = 0;
  screenWidth:any;
  constructor(private platform: Platform, private commonservice: CommonService) { }

  ngOnChanges(){
    this.screenWidth = window.innerWidth;
    this.commonservice.setClevertapEvent('Client&Trades_Equity_Margin');
    this.equityMarginDetails = this.margin.EquityMargin;
    if(this.equityMarginDetails.length > 0){
      this.totalAvailBalance = this.equityMarginDetails[0].AvailableMargin ? this.equityMarginDetails[0].AvailableMargin : 0;
      if(this.platform.is('desktop') || this.screenWidth > 1360){
        this.datas = [
          {name1: 'Ledger balance', value1: this.equityMarginDetails[0].Lb, name2: 'Cash received from customer', value2: this.equityMarginDetails[0].Receipts},
          {name1: 'Uncleared cheques', value1: this.equityMarginDetails[0].UnclChq, name2: 'Cash payout done to customer', value2: this.equityMarginDetails[0].Payments},
          {name1: 'Undelivered value', value1: this.equityMarginDetails[0].Undlv, name2: 'Additional limit given', value2: this.equityMarginDetails[0].Adhoc},
          {name1: 'No delivery debt', value1: this.equityMarginDetails[0].NDDebit, name2: 'Gross margin', value2: this.equityMarginDetails[0].GrossMargin},
          {name1: 'Options MTM Loss', value1: this.equityMarginDetails[0].OptionsMtoMLoss, name2: 'MTM P&L on open position', value2: this.equityMarginDetails[0].Mgn4Position},
          {name1: 'Adjust ledger balance', value1: this.equityMarginDetails[0].ALB, name2: 'Margin blocked for pending positions', value2: this.equityMarginDetails[0].Mgn4PendOrd},
        ];
      }
      else{
        this.datas = [
          {marginType: 'Ledger balance', marginValue: this.equityMarginDetails[0].Lb},
          {marginType: 'Uncleared cheques', marginValue: this.equityMarginDetails[0].UnclChq},
          {marginType: 'Undelivered value', marginValue: this.equityMarginDetails[0].Undlv},
          {marginType: 'No delivery debt', marginValue: this.equityMarginDetails[0].NDDebit},
          {marginType: 'Options MTM Loss', marginValue: this.equityMarginDetails[0].OptionsMtoMLoss},
          {marginType: 'Adjust ledger balance', marginValue: this.equityMarginDetails[0].ALB},
          {marginType: 'Cash received from customer', marginValue: this.equityMarginDetails[0].Receipts},
          {marginType: 'Cash payout done to customer', marginValue: this.equityMarginDetails[0].Payments},
          {marginType: 'Additional limit given', marginValue: this.equityMarginDetails[0].Adhoc},
          {marginType: 'Gross margin', marginValue: this.equityMarginDetails[0].GrossMargin},
          {marginType: 'MTM P&L on open position', marginValue: this.equityMarginDetails[0].Mgn4Position},
          {marginType: 'Margin blocked for pending positions', marginValue: this.equityMarginDetails[0].Mgn4PendOrd},
        ];
      }
  
    }
    else{
      this.datas = [];
      this.totalAvailBalance = 0;
    }
  
  }
  ngOnInit() {

  }

}
