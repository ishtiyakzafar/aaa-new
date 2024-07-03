import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SplitNameDate } from '../../helpers/splitNameDate.pipe';
import { ClientTradesService } from '../../pages/recently-viewed-client-list/client-trades.service';
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
  selector: 'app-client-orderbook',
  providers: [SplitNameDate, ClientTradesService],
  templateUrl: './client-orderbook.component.html',
  styleUrls: ['./client-orderbook.component.scss'],
})
export class ClientOrderbookComponent implements OnInit {
  @Input() orderBookData: any;
  public dataLoad: boolean = true;
  public datas: any[] = [
    {}, {}, {}
  ]
  constructor(private commonService: CommonService,private storage: StorageServiceAAA, private router: Router, private splitNameFromDate: SplitNameDate, private clientService: ClientTradesService) { }

  ngOnInit() {
    this.commonService.analyticEvent('CnT_Orderbook', 'Client OrderBook');
    this.commonService.setClevertapEvent('Client&Trades_Equity_Orderbook');
    this.orderBookData = this.orderBookData.sort((a: any, b: any) => (a.BrokerOrderTime.slice(6, 19) > b.BrokerOrderTime.slice(6, 19)) ? -1 : 1);
    // console.log(this.orderBookData);
  }

  doRefresh() {
    this.dataLoad = false;
    let clientID = localStorage.getItem('select_client') ? JSON.parse(localStorage.getItem('select_client') || '{}') : "{}";
    let passClientcode = clientID["ClientCode"]
  
    this.storage.get('JwtToken').then(token => {
      this.clientService.getOrderBookNow(token,passClientcode).subscribe((res: any) => {
        if(res['head']['status'] == 0){
          this.orderBookData = res['body']['OrderBookDetail'];
          this.orderBookData = this.orderBookData.sort((a: any, b: any) => (a.BrokerOrderTime.slice(6, 19) > b.BrokerOrderTime.slice(6, 19)) ? -1 : 1);
          setTimeout(() => {
            this.dataLoad = true;
          }, 500);
         
        }
    })
    })

 }

  splitDate(value: any){
    return value.slice(0, 10)
  }
  
  dropClick(index: any, arr: any) {
    // this.dropBtn = true;
    // console.log('Closing value: ', val.High);
    arr.forEach((element: any, ind: any) => {
      if ((index) !== ind) {
        element['isVisible'] = false;
      } else {
        element['isVisible'] = element['isVisible'] ? false : true;
      }
    });
    // val['isVisible'] = val['isVisible'] ? false : true;
  }
  trackByArtNo(index: number, companyProduct: any): string {
    return companyProduct.ArtNo;  
  }  


  displyOrderStatus(qty: any,pendingQty: any, orderStatus: any, SlTriggered: any):any {
		var status: any;
		if (orderStatus.includes("Pending") || orderStatus.includes("Modified")  || orderStatus.includes("SL Triggered")) {
			
			if (pendingQty == 0) {
				status = "Fully Executed";
			} else if (qty > pendingQty) {
				status = "Partially Executed";
			} 
			else if (SlTriggered.toUpperCase() == "Y") {
				status = "SL Triggered"
			} else {
				status = orderStatus;
			}
		}
		else {
			if (orderStatus == "Rejected By 5P")
				status = "Rejected By IIFL";
			else {
				status = orderStatus;
			}

		}
		return status
  }
  // click on scrip Name go to company details page
  goToCompanyDetails(dataObj: any){
    localStorage.setItem('clientDetail', "true")
    if(this.splitNameFromDate.transform(dataObj.ScripName,"date").length == 0){
			this.router.navigate(['/company-details', dataObj.Exch, dataObj.ExchType, dataObj.ScripCode, dataObj.ScripName.split(' ')[0] + dataObj.ExchType, dataObj.ScripName.split(' ')[0]]);
    }
    else{
			if(dataObj.ScripName.includes('CE') || dataObj.ScripName.includes('PE')){
				this.router.navigate(['/company-details', dataObj.Exch, dataObj.ExchType, dataObj.ScripCode, this.splitNameFromDate.transform(dataObj.ScripName,"date").split(' ').join('-').toUpperCase().substring(1) + dataObj.ExchType, dataObj.ScripName.split(' ')[0]])
			}
			else{
				this.router.navigate(['/company-details', dataObj.Exch, dataObj.ExchType, dataObj.ScripCode, this.splitNameFromDate.transform(dataObj.ScripName,"date").split(' ').join('-').toUpperCase().substring(1) + dataObj.ExchType, dataObj.ScripName.split(' ')[0]])
			}
    }
    //this.router.navigate(['/company-details', data.Exch, data.ExchType, data.ScripCode, data.ScripName + data.ExchType, data.ScripName]);
  }


}
