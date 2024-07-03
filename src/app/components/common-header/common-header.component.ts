import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MarketService } from '../../pages/markets/markets.service';
import { IndicesDetailsComponent } from '../indices-details/indices-details.component';
import { ScoreComponent } from '../score/score.component';
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
	selector: 'common-header',
	templateUrl: './common-header.component.html',
	providers: [MarketService],
	styleUrls: ['./common-header.component.scss'],
})
export class CommonHeaderComponent implements OnInit {
	@Input() displayHeaderDetails: any[] = [];
	@Input() iglcScore: any;
	clearHeaderDetails: any;
	// showCommonHeader = false;
	public routeToShowHeader = [
		'/markets',
		'/invest',
		'/dashboard',
		// '/welcome/subscription',
		// '/welcome/billing-history',
		// '/welcome/purchased-history',
		// '/welcome/add-on',
		// '/welcome/change-password',
		// '/welcome/purchased-add-ons',
		// '/welcome/purchased-add-ons-detail'
	]

	public userType = null;
	// public iglcScore = null;

	constructor(public modalController: ModalController, private marService: MarketService,
		private storage: StorageServiceAAA,
		private commonService: CommonService) { 
			// setTimeout(() => {
			// 	clearTimeout(this.clearHeaderDetails);
			// }, 10000);
			/* this.commonService.eventObservable.subscribe((obj) => {
				if (obj && obj['event'] === 'destroyCommonHeaderEvent') {
					console.log('common Event', obj);
					if (obj['data'] && obj['data']['destroy'] === true) {
						// clearTimeout(this.clearHeaderDetails);
						console.log('destroyed event');
						if (this.clearHeaderDetails) {
							clearTimeout(this.clearHeaderDetails);
							this.clearHeaderDetails = null;
						}
					}
				}
			}) */
			setTimeout(() => {
				this.storage.get('userType').then( type => {
					this.userType = type;
					if (type === 'SUB BROKER') {
						this.storage.get('IGLCScore').then( score => {
							// console.log('iglc score ' ,score);
							this.iglcScore = Math.round(score);
						})
					}
				})
			}, 800);
		}

	ngOnInit() {
		this.getCommHeaderDetail()
	}

    // Score pop up 
    async score() {
        const modal = this.modalController.create({
            component: ScoreComponent,
            cssClass: 'superstars score'
        });
        return (await modal).present();
    }
    

	// ionViewWillEnter() {
	// 	console.log('common enter');

	// }

	// ngDoCheck() {
	// 	for (let i = 0; i < this.routeToShowHeader.length; i++) {
	//         if (document.location.pathname !== this.routeToShowHeader[i]) {
	//             this.showCommonHeader = true;
	// 			console.log('if common');

	//         } else {
	// 			console.log('else  common');
	// 			clearTimeout(this.clearHeaderDetails);
	// 		}
	//     }
	// 	console.log(this.showCommonHeader, 'show commo header');

	// }

	getCommHeaderDetail() {
		return;
		const __this = this;
			__this.marService.getCommonHead().subscribe((res: any) => {
				__this.displayHeaderDetails = [
					{
						"Exch": res['Data'][1].Exch,
						"ExchType": res['Data'][1].ExchType,
						"LastRate": res['Data'][1].LastRate,
						"PerChange": res['Data'][1].PerChange,
						"ScripCode": res['Data'][1].ScripCode,
						"Change": res['Data'][1].Change,
						"Symbol": res['Data'][1].Symbol
					},
					{
						"Exch": res['Data'][2].Exch,
						"ExchType": res['Data'][2].ExchType,
						"LastRate": res['Data'][2].LastRate,
						"PerChange": res['Data'][2].PerChange,
						"ScripCode": res['Data'][2].ScripCode,
						"Change": res['Data'][2].Change,
						"Symbol": res['Data'][2].Symbol
					},
					{
						"Exch": res['Data'][0].Exch,
						"ExchType": res['Data'][0].ExchType,
						"LastRate": res['Data'][0].LastRate,
						"PerChange": res['Data'][0].PerChange,
						"ScripCode": res['Data'][0].ScripCode,
						"Change": res['Data'][0].Change,
						"Symbol": res['Data'][0].Symbol,
					}
	
				]
			})
		if (this.clearHeaderDetails) clearTimeout(this.clearHeaderDetails);
		this.clearHeaderDetails = setTimeout(() => {
			this.getCommHeaderDetail();
		}, 2000);
		// clearInterval(this.clearHeaderDetails);
		// const _this = this;
		// this.clearHeaderDetails = setInterval(_this.getCommHeaderDetail, 2000, _this);
	}
	// indices detail popup
	async details(value: any) {
		var objPass = {
			symbol: value.Symbol,
			scripCode: value.ScripCode,
			exch: value.Exch,
			exchType: value.ExchType
		}
		const modal = this.modalController.create({
			component: IndicesDetailsComponent,
			componentProps: { "IndParams": objPass },
			cssClass: 'superstars indices-details'
		});
		return (await modal).present();
	}

	dissmiss() {
		this.modalController.dismiss();
	}

	ionViewWillLeave() {
		clearInterval(this.clearHeaderDetails);
		// clearTimeout(this.clearHeaderDetails);
	}
	ngOnDestroy() {
		clearInterval(this.clearHeaderDetails);
		// clearTimeout(this.clearHeaderDetails);
	}

}
