import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { MarketService } from '../../pages/markets/markets.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { ChartLink } from '../../../environments/environment';
import { searchScripService } from '../../pages/add-script/search-scrip.service';

@Component({
	selector: 'app-indices-details',
	templateUrl: './indices-details.component.html',
	providers: [MarketService, searchScripService],
	styleUrls: ['./indices-details.component.scss'],
})
export class IndicesDetailsComponent {
	@Input() IndParams: any;
	@ViewChild('iframe') iframe!: ElementRef
    public dataLoad = false;
	indDetailsList: any[] = [];
	titleName: any;
	baseUrlChart = ChartLink['Chart']['detailIndChart'];
	displayChart: any;
	updateIndiDetails: any;
	constructor(private modalController: ModalController, private marService: MarketService, private searchService: searchScripService, private router: Router, private navParams: NavParams, protected sanitizer: DomSanitizer) { }

	ionViewWillEnter() {
        this.dataLoad = false;
		this.titleName = this.IndParams.symbol;
		this.marService.getIndiDetails(this.IndParams.symbol).subscribe((res: any) => {
			var marketFeedArray: any = [];
			this.indDetailsList = res['Data'];
		
			
			this.indDetailsList.forEach((element, index) => {
				var passObj: any = {};
				passObj['Exch'] = element.Exch;
				passObj['ExchType'] = element.ExchType;
				passObj['ScripCode'] = element.ScripCode;
				marketFeedArray.push(passObj);
			});
			this.recDetailsCall(marketFeedArray, this.indDetailsList)
            setTimeout(() => {
                this.dataLoad = true;
            }, 500);
		})
	}

	recDetailsCall(marFeedArray: any, indDetail: any) {
		this.searchService.getMarketFeedSearch(marFeedArray, "/Date(0+)/").subscribe((res: any) => {
			indDetail.forEach((data: any, index: any) => {
				res['Data'].forEach((element: any, index: any) => {
					if (data.ScripCode == element.Token) {
						data.LTP = element.LastRate;
						data.PreviousClose = element.PClose;
					}
				})
			})
		})
		clearTimeout(this.updateIndiDetails);
		this.updateIndiDetails = setTimeout(() => {
			this.recDetailsCall(marFeedArray, indDetail);
		}, 2000);
	}

	ngAfterViewInit() {
		this.displayChart = this.baseUrlChart + this.IndParams.exch.toLowerCase() + 'se&exchType=' + this.IndParams.exchType.toUpperCase() + '&range=d&symbol=' + this.IndParams.symbol + '&scripCode=' + this.IndParams.scripCode + '&appName=IIFLMarkets&appVer=5.63&osName=iOS&loginId=0';
		this.iframe.nativeElement.setAttribute('src', this.displayChart);
	}

	dismiss() {
		this.modalController.dismiss();
		clearTimeout(this.updateIndiDetails);
	}

	async goToCompanyDetails(value: any) {
		await this.modalController.dismiss();
		this.router.navigate(['/company-details', value.Exch, value.ExchType, value.ScripCode, value.ShortName + value.ExchType, value.Symbol]);
	}
	changeVolNumberFormat(value: any){
		if(value > 1000){
		 value = Math.round(value / 1000)
		}
		else {
			value = 0
		}
		return value
	}

	ionViewWillLeave() {
		clearTimeout(this.updateIndiDetails);
	}
	ngOnDestroy() {
		clearTimeout(this.updateIndiDetails);
	}
}
