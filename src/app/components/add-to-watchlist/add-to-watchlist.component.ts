import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { MarketService } from '../../pages/markets/markets.service';
import { Subscription } from 'rxjs';
import { CommonService } from '../../helpers/common.service';
import { map } from 'rxjs/operators'
import { ToasterService } from '../../helpers/toaster.service';
import { CompanyDetailsService } from '../../pages/company-details/company-details.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';




@Component({
	selector: 'app-add-to-watchlist',
	providers: [MarketService, CompanyDetailsService, ToasterService],
	templateUrl: './add-to-watchlist.component.html',
	styleUrls: ['./add-to-watchlist.component.scss'],
})
export class AddToWatchlistComponent implements OnInit {
	watchListname: any;
	watchLTP: any;
	watchPClose: any
	scripName!: string;
	private subscription: any;
	marketList: any[] = [];
	mwName!: string;
	addWatchScripCode: any;
	msgshown: any;


	datas: any[] = [
		{ watchlist: 'watchlist 1', addedScrip: '04', isChecked: true, value: 'wathchlist 1' },
		{ watchlist: 'watchlist 2', addedScrip: '04', isChecked: false, value: 'wathchlist 2' },
		{ watchlist: 'watchlist 3', addedScrip: '04', isChecked: false, value: 'wathchlist 3' },
	];
	constructor(public modalController: ModalController, private navParams: NavParams, private marService: MarketService, private companyService: CompanyDetailsService, public toast: ToasterService, private storage: StorageServiceAAA, private commonservice: CommonService) { }

	ngOnInit() {
		this.watchListname = this.navParams.data['addWatchName'];
		this.watchLTP = this.navParams.data['addWatchLTP'];
		this.watchPClose = this.navParams.data['addWatchPclose'];
		this.addWatchScripCode = this.navParams.data['addWatchScripCode'];

		// console.log(this.addWatchScripCode);
		this.displayMarketList();
	}

	// call market w list api to display list
	displayMarketList() {
		this.subscription = new Subscription();
		try {
			this.storage.get('userID').then((token) => {
				const params = token;
				this.subscription.add(this.marService
					.getMList(params)
					.subscribe((response: any) => {

						// console.log('Market List', this.marketList);
						this.marketList = response['MWName'].filter(function (e: any) {
							return e.CanRenMW == true;
						});
						// console.log(this.marketList);

						this.marketList.forEach((element, index) => {
							element['isChecked'] = false;
						});

					}))
			})
		}
		catch (error) {
			// console.log(error);
		}
	}
	
	toggle(selected: any) {
		this.mwName = selected.MwatchName;
	}
	// click on add strip button
	async addStrip() {
		this.msgshown = [];
		// console.log(this.marketList);
		this.marketList.forEach((element, index) => {
			if (element['isChecked']) {
				// console.log(element.MwatchName);
				this.callwithInterval(element.MwatchName);
			}
		})
	}

	callwithInterval(MwatchName: any) {
		this.storage.get('userID').then((token) => {
			var payload = {
				"MWname": MwatchName,
				"Exch": this.addWatchScripCode.exchcode,
				"ExchType": this.addWatchScripCode.exchtypecode,
				"ScripCode": this.addWatchScripCode.scripcode,
				"clientCode": token
			}
			this.addWatchListFun(payload);
		})
	}

	addWatchListFun(payload: any) {
		this.companyService.addScripData(payload).subscribe((res: any) => {
			// console.log(res);
			if (res['Status'] === 0) {
				this.modalController.dismiss();
				this.msgshown.push(payload.MWname + ' - ' + res['Message']);
				this.msgshown.sort((a: any, b: any) => (a.slice(9, 10) > b.slice(9, 10)) ? 1 : -1)
				this.toast.displayToast(this.msgshown.join(' & '));
			}
			else {
				this.toast.showToaster(res['Message']);
			}
		})

	}

	//  pushArray(array){
	//   console.log(array);
	//   var msgTotal = array.reduce(function(prev, cur) {
	//     console.log(prev.toString() + cur.msgCount.toString());
	//     console
	//   }, 0)
	//  }

	changeNumerAfterDecimal(value: any) {
		if (this.addWatchScripCode.exchtypecode == 'U') {
			return this.commonservice.formatNumberComma(parseFloat(value).toFixed(4));
		}
		else {
			return this.commonservice.formatNumberComma(parseFloat(value).toFixed(2));
		}
	}
	// close popup
	async dismiss() {
		this.modalController.dismiss();
	}
}
