import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { SplitNameDate } from '../../helpers/splitNameDate.pipe';
import { ClientTradesService } from '../../pages/recently-viewed-client-list/client-trades.service';
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';


@Component({
  selector: 'app-client-tradebook',
  providers: [SplitNameDate, ClientTradesService],
  templateUrl: './client-tradebook.component.html',
  styleUrls: ['./client-tradebook.component.scss'],
})
export class ClientTradebookComponent implements OnInit, OnChanges {
  @Input() tradeBookData: any;

  public dataLoad: boolean = true;
  public datas: any[] = [
    {}, {}, {}
  ]
  constructor(private commonService: CommonService,private storage: StorageServiceAAA, private router: Router, private splitNameFromDate: SplitNameDate, private clientService: ClientTradesService) { }
  ngOnChanges(){
    
  }
  ngOnInit() {
    this.commonService.analyticEvent('CnT_Tradebook', 'Client TradeBook');
    this.commonService.setClevertapEvent('Client&Trades_Equity_Tradebook');
    this.tradeBookData = this.tradeBookData.sort((a: any, b: any) => (a.ExchangeTradeTime.slice(6, 19) > b.ExchangeTradeTime.slice(6, 19)) ? -1 : 1);
  }

  doRefresh() {
      this.dataLoad = false;
      let clientID = localStorage.getItem('select_client') ? JSON.parse(localStorage.getItem('select_client') || '{}') : "{}";
      let passClientcode = clientID["ClientCode"]
    
      this.storage.get('JwtToken').then(token => {
        this.clientService.getTradeBook(token,passClientcode).subscribe((res: any) => {
          // console.log(res);
          if(res['head']['status'] == 0){
            this.tradeBookData = res['body']['tradelist'];
            this.tradeBookData = this.tradeBookData.sort((a: any, b: any) => (a.ExchangeTradeTime.slice(6, 19) > b.ExchangeTradeTime.slice(6, 19)) ? -1 : 1);
            setTimeout(() => {
              this.dataLoad = true;
            }, 500);
           
          }
      })
      })

	 }

  // click on scrip Name go to company details page
  goToClientDetails(dataObj: any){
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

