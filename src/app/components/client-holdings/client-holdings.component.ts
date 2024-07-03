import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { ClientTradesService } from '../../pages/recently-viewed-client-list/client-trades.service';
import { Router } from '@angular/router';
import { SplitNameDate } from '../../helpers/splitNameDate.pipe';
import { CommonService } from '../../helpers/common.service';


@Component({
  selector: 'app-client-holdings',
  providers: [ClientTradesService, SplitNameDate],
  templateUrl: './client-holdings.component.html',
  styleUrls: ['./client-holdings.component.scss'],
})
export class ClientHoldingsComponent implements OnInit, OnChanges {
  @Input() holdingData: any;
  public order: string = 'clientCode';
  public reverse: boolean = false;  
  public ascending = true;
  totalPL: any;
  totalHolding: any;
  searchTerm: any = '';
  public datas: any[] = [
    {}, {}, {}, {}
  ]
  constructor(private clientService: ClientTradesService, private commonService: CommonService, private router: Router, private splitNameFromDate: SplitNameDate) { }
  ngOnInit(): void {
    //throw new Error("Method not implemented.");
  }

  ngOnChanges() {
    this.commonService.analyticEvent('CnT_Holding', 'Client Holding');
    this.commonService.setClevertapEvent('Client&Trades_Equity_Holdings');

    if (this.holdingData.length > 0) {
      setTimeout(() => {
        this.totalPL = 0;
        this.totalHolding = 0;
        this.holdingData.forEach((element: any, index: any) => {
          this.totalPL = this.totalPL + element.CurrentPL;
          element.holdingValue = (element.Quantity) * (element.CurrentPrice)
          this.totalHolding = this.totalHolding + (element.Quantity * element.CurrentPrice)
        })
      }, 500);
    }
    else {
      this.holdingData = [];
      this.totalPL = 0;
      this.totalHolding = 0;
    }
  }

    //sorting function for column
	setOrder(value: string) {
		this.reverse = !this.reverse;
		this.order = value;
        if (this.reverse) {
            this.ascending = false;
        } else {
            this.ascending = true;
        }
	}

  percentChangeValue(quantity: any, currentPrice: any, previousClose: any, perChange: any) {
    if (quantity < 0) {
      //Sell Order
      //loss  ltp-previousClose should be positive
      if (currentPrice - previousClose > 0) {
        if (perChange > 0) {
          perChange = 0 - (perChange);
        }
        return perChange;
      } else {   //profit ltp-previousClose should be negative
        if (perChange < 0) {
          perChange = 0 - (perChange);
        }
        return perChange;
      }
    }
    return perChange;

  }
  convertNanToZero(value: any) {
    if (isNaN(value)) {
      return 0;
    }
    return value;
  }
  // go to client details page on click of scripname
  goToCompanyDetails(dataObj: any){
    localStorage.setItem('clientDetail', "true");

    if(this.splitNameFromDate.transform(dataObj.Symbol,"date").length == 0){
			this.router.navigate(['/company-details', dataObj.Exch, dataObj.ExchType, dataObj.NseCode, dataObj.Symbol.split(' ')[0] + dataObj.ExchType, dataObj.Symbol.split(' ')[0]]);
    }
    else{
			if(dataObj.Symbol.includes('CE') || dataObj.Symbol.includes('PE')){
				this.router.navigate(['/company-details', dataObj.Exch, dataObj.ExchType, dataObj.NseCode, this.splitNameFromDate.transform(dataObj.Symbol,"date").split(' ').join('-').toUpperCase().substring(1) + dataObj.ExchType, dataObj.Symbol.split(' ')[0]])
			}
			else{
				this.router.navigate(['/company-details', dataObj.Exch, dataObj.ExchType, dataObj.NseCode, this.splitNameFromDate.transform(dataObj.Symbol,"date").split(' ').join('-').toUpperCase().substring(1) + dataObj.ExchType, dataObj.Symbol.split(' ')[0]])
			}
    }
    
    
    //this.router.navigate(['/company-details', data.Exch, data.ExchType, data.NseCode, data.FullName.split(' ').join('-') + data.ExchType, data.Symbol]);
  }
}