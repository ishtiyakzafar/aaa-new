import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams, Platform } from '@ionic/angular';
import { MarketService } from '../../pages/markets/markets.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';


@Component({
	selector: 'app-exposure-scrip-details',
	providers: [MarketService],
	templateUrl: './exposure-scrip-details.component.html',
	styleUrls: ['./exposure-scrip-details.component.scss'],
})
export class ExposureScripDetailsComponent implements OnInit {
	@Input() expoCatagory: any;
    public dataLoad = false;
	delStatus: any;
	intraStatus: any;
	scripInfo: any[] = [];
	scripInfoHalfIndex: any;
	scripInfoTable1: any[] = [];
	scripInfoTable2: any[] = [];
	urlParameter: any;
	catagoryID: any;

	public tableData: any[] = [
		{ Scrip: 'ADANIPORTS', ScripDes: 'ADANI PORTS & SEZ LTD', Type: 'NSE CASH', LTP: '566.95' },
		{ Scrip: 'ADANIPORTS1', ScripDes: 'ADANI PORTS & SEZ LTD', Type: 'NSE CASH', LTP: '566.95' },
		{ Scrip: 'ADANIPORTS2', ScripDes: 'ADANI PORTS & SEZ LTD', Type: 'NSE CASH', LTP: '566.95' },
		{ Scrip: 'ADANIPORTS3', ScripDes: 'ADANI PORTS & SEZ LTD', Type: 'NSE CASH', LTP: '566.95' },

	];
	constructor(private modalController: ModalController, private storage: StorageServiceAAA, private marService: MarketService, private platform: Platform, private route: ActivatedRoute, private router: Router) { }

	ngOnInit() {
		this.storage.get('userID').then((userID) => {
			//Desktop View API Integration
            this.dataLoad = false;
			if (this.platform.is('desktop')) {
				this.marService.getCatagoryDesr(this.expoCatagory, userID).subscribe((res: any) => {
					this.delStatus = this.calculateValue(res['body']['Data'][0].BuyMgnDel);
					this.intraStatus = this.calculateValue(res['body']['Data'][0].BuyMgnIntra);
					this.scripInfo = res['body']['ScriptInfo'];
                    setTimeout(() => {
                        this.dataLoad = true;
                    }, 1000);
					if (this.scripInfo.length > 6) {
						this.scripInfoHalfIndex = Math.ceil((this.scripInfo.length / 2));
						this.scripInfoTable1 = this.scripInfo.slice(0, this.scripInfoHalfIndex);
						this.scripInfoTable2 = this.scripInfo.slice(this.scripInfoHalfIndex, this.scripInfo.length);
					}
					else {
						this.scripInfoTable1 = this.scripInfo;
					}
				})
			}
			// Mobile View API Integration 
			else {
				this.urlParameter = this.route.params.subscribe(params => {
					this.catagoryID = params['id'];
					this.marService.getCatagoryDesr(this.catagoryID, userID).subscribe((res: any) => {
						this.delStatus = this.calculateValue(res['body']['Data'][0].BuyMgnDel);
						this.intraStatus = this.calculateValue(res['body']['Data'][0].BuyMgnIntra);
						this.scripInfo = res['body']['ScriptInfo']
					})
				});
				setTimeout(() => {
					this.dataLoad = true;
				}, 1000);
			}

		})
	}
	async dismiss() {
		await this.modalController.dismiss();
	}
	goBackPage() {
		window.history.back();
	}
	calculateValue(value: any) {
		return Math.floor(1 / value)+' '+"Times"
	}

	goToSearch() {
		//this.router.navigate(['/add-script'])
		this.router.navigate(['/dashboard-clients']);
	}

	goToCompanyDetails(dataObj: any) {
		this.modalController.dismiss();
		if(dataObj.ScripName != ''){
			this.router.navigate(['/company-details', dataObj.Exch, 'C', dataObj.ScripCode, dataObj.ScripName.trim().split(' ').join('-').toUpperCase() + 'C', dataObj.Symbol]);
		}
		else{
			this.router.navigate(['/company-details', dataObj.Exch, 'C', dataObj.ScripCode, dataObj.Symbol.trim().split(' ').join('-').toUpperCase() + 'C', dataObj.Symbol.trim().split(' ').join('-').toUpperCase()]);
		}
		
	}
}
