import { Component, OnInit } from '@angular/core';
import { MarketService } from '../../pages/markets/markets.service';
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
@Component({
	selector: 'app-market-status',
	templateUrl: './market-status.component.html',
	styleUrls: ['./market-status.component.scss'],
})
export class MarketStatusComponent implements OnInit {
	public dataLoad: boolean = false;
	marketStatusList: any[] = [];
    public skeletonHight:any [] = [
        {}, {}, {}, {}, {}, {}, {},  {}, {}, {}
    ]
	statusTable1: any[] = [];
	statusTable2: any[] = [];
	statusHalfIndex:any;

	constructor(private marService: MarketService, private storage: StorageServiceAAA, private commonService: CommonService) { }

	ngOnInit() {
		this.commonService.analyticEvent('Market_Overview', 'Market Overview');
		this.storage.get('userID').then((userID) => {
			this.marService.getMarketStatus(userID).subscribe((res: any) => {
				this.marketStatusList = res['body']['StatusData'];
				this.marketStatusList.forEach(element => {
					if(element.Exch == 'N' && element.ExchType == 'C'){
						element.MarketType = 'NSE Cash'
					}
					else if(element.Exch == 'B' && element.ExchType == 'C'){
						element.MarketType = 'BSE Cash'
					}
					else if (element.Exch == 'B' && element.ExchType == 'D') {
						element.MarketType = 'BSE Derivative'
					}
					else if (element.Exch == 'N' && element.ExchType == 'U') {
						element.MarketType = 'NSE Currency'
					}
					else if (element.Exch == 'N' && element.ExchType == 'D') {
						element.MarketType = 'NSE Derivative'
					}
					else if (element.Exch == 'B' && element.ExchType == 'U') {
						element.MarketType = 'BSE Currency'
					}
					else if (element.Exch == 'M' && element.ExchType == 'D') {
						element.MarketType = 'MCX'
					}
					else if (element.Exch == 'N' && element.ExchType == 'X') {
						element.MarketType = 'NCDEX'
					}
					else if (element.Exch == 'N' && element.ExchType == 'Y') {
						element.MarketType = 'NSE Commodity'
					}
					else if (element.Exch == 'B' && element.ExchType == 'Y') {
						element.MarketType = 'BSE Commodity'
					}
					else {
						element.MarketType = null
					}
				});
				this.marketStatusList = this.marketStatusList.filter(function (el) {
					return el.MarketType != null
				});
				this.statusHalfIndex = Math.ceil((this.marketStatusList.length / 2));
				this.statusTable1 = this.marketStatusList.slice(0, this.statusHalfIndex);
				this.statusTable2 = this.marketStatusList.slice(this.statusHalfIndex, this.marketStatusList.length);
			
				// console.log(this.statusTable1);
				// console.log(this.statusTable2);
					  setTimeout(() => {
				    this.dataLoad = true;
				}, 1000);
			})

		})
	}
	
}
