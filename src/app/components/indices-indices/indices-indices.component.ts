import { Component, OnInit, Input } from '@angular/core';
import { MarketService } from '../../pages/markets/markets.service';
import { searchScripService } from '../../pages/add-script/search-scrip.service'
import { ModalController } from '@ionic/angular';
import { IndicesDetailsComponent } from '../indices-details/indices-details.component';
import { CommonService } from '../../helpers/common.service';

@Component({
	selector: 'app-indices-indices',
	templateUrl: './indices-indices.component.html',
	providers: [MarketService, searchScripService],
	styleUrls: ['./indices-indices.component.scss'],
})
export class IndicesIndicesComponent implements OnInit {
	public dataLoad: boolean = false;
	indicesList: any;
	checkUpdateIndices: any;
    // skeleton height for watchlist
    public skeletonHight:any [] = [
        {}, {}, {}, {}, {}, {}, {}
    ]
	indicesTable: any[] = [];
	constructor(private marService: MarketService, private searchService: searchScripService, private modalController: ModalController, private commonService: CommonService) { }

	ngOnInit() {
		this.commonService.analyticEvent('Market_indices', 'Market Indices');
		this.marService.getIndices().subscribe((res: any) => {
			this.indicesList = res;
			var array: any = [];
			this.indicesList.forEach((element: any, index: any) => {
				var passObj: any = {};
				passObj['Exch'] = element.Exch;
				passObj['ExchType'] = element.ExchType;
				passObj['ScripCode'] = element.IndiceID;
				array.push(passObj);
				setTimeout(() => {
					this.dataLoad = true;
				}, 1000);
			});
			this.updateIndices(this.indicesList, array)
		})
	}

	updateIndices(indcList: any, array: any) {
		this.searchService.getMarketFeedSearch(array, "/Date(0+)/").subscribe((res: any) => {
			indcList.forEach((data: any, index: any) => {
				res['Data'].forEach((element: any, index: any) => {
					if (data.IndiceID == element.Token) {
						data.LastRate = element.LastRate;
						data.PClose = element.PClose;
					}
				})
			})
			this.indicesTable = indcList
		})
		clearTimeout(this.checkUpdateIndices);
		this.checkUpdateIndices = setTimeout(() => {
			this.updateIndices(indcList, array);
		}, 2000);

	}

	// indices detail popup
	async details(value: any) {
		var objPass = {
			symbol: value.IndiceName,
			scripCode: value.IndiceID,
			exch: value.Exch,
			exchType: value.ExchType
		}
		// console.log(objPass)
		const modal = this.modalController.create({
			component: IndicesDetailsComponent,
			componentProps: { "IndParams": objPass },
			cssClass: 'superstars indices-details'
		});
		return (await modal).present();
	}

	ionViewWillLeave() {
		clearTimeout(this.checkUpdateIndices);
	}
	ngOnDestroy() {
		clearTimeout(this.checkUpdateIndices);
	}
}
