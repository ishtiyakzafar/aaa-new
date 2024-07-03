import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { investObj } from '../../../environments/environment';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { CommonService } from '../../helpers/common.service';

declare var cordova: any;

@Component({
	selector: 'app-invest-fixed-deposit',
	templateUrl: './invest-fixed-deposit.page.html',
	styleUrls: ['./invest-fixed-deposit.page.scss'],
})
export class InvestFixedDepositPage implements OnInit {

	constructor(private router: Router,
		private storage: StorageServiceAAA,
		private commonService: CommonService,
		private platform: Platform,
		private navCtrl: NavController) {
		router.events.forEach((event) => {
			this.platform.backButton.subscribeWithPriority(10, () => {
				this.router.navigate(['/invest', 'other']);
			});
		});
	}

	ngOnInit() {
	}

	public goBack() {
		this.router.navigate(['/invest', 'other']);
		// window.history.back();
	}

    public viewMore(url: any) {
		if (this.commonService.isApp() && this.platform.is('ios')) {
			var ref = cordova.InAppBrowser.open(url, '_blank');

			ref.addEventListener('loadstart', this.loadstartCallback);
			ref.addEventListener('loadstop', this.loadstopCallback);
			ref.addEventListener('loaderror', this.loaderrorCallback);
			ref.addEventListener('exit', this.exitCallback);
		} else {
			window.open(url);
		}
    }

	public openFD(value: any) {
		let userID = null;
		this.storage.get('userID').then( (token) => {
			if (token) {
				userID = token;
			} else {
				userID = 'AAARM001';
			}
			if (value === 'icici') {
				this.commonService.setClevertapEvent('Invest_FD_ICICI');
				const params = 'Affiliatecode=C110408&SubAffiliatecode='+userID;
				// const url = investObj['fdURL'].icici + "?" + params;
				const url = investObj['fdURL'].icici;
				if (this.commonService.isApp() && this.platform.is('ios')) {
					var ref = cordova.InAppBrowser.open(url, '_blank');
	
					ref.addEventListener('loadstart', this.loadstartCallback);
					ref.addEventListener('loadstop', this.loadstopCallback);
					ref.addEventListener('loaderror', this.loaderrorCallback);
					ref.addEventListener('exit', this.exitCallback);
				} else {
					window.open(url);
				}
			} else if (value === 'bajaj') {
				this.commonService.setClevertapEvent('Invest_FD_Bajaj');
				const params = ' utm_source=IIFL&utm_medium=SMS&utm_campaign='+userID+'&PartnerCode=3532';
				const url = investObj['fdURL'].bajaj + "?" + params;
				if (this.commonService.isApp() && this.platform.is('ios')) {
					var ref = cordova.InAppBrowser.open(url, '_blank');
	
					ref.addEventListener('loadstart', this.loadstartCallback);
					ref.addEventListener('loadstop', this.loadstopCallback);
					ref.addEventListener('loaderror', this.loaderrorCallback);
					ref.addEventListener('exit', this.exitCallback);
				} else {
					window.open(url);
				}
			} else if (value === 'shriram') {
				this.commonService.setClevertapEvent('Invest_FD_Shriram');
				const params = 'Affiliatecode=DEBMUM054&SubAffiliatecode='+ userID;
				const url = investObj['fdURL'].shriram + "?" + params;
				if (this.commonService.isApp() && this.platform.is('ios')) {
					var ref = cordova.InAppBrowser.open(url, '_blank');
	
					ref.addEventListener('loadstart', this.loadstartCallback);
					ref.addEventListener('loadstop', this.loadstopCallback);
					ref.addEventListener('loaderror', this.loaderrorCallback);
					ref.addEventListener('exit', this.exitCallback);
				} else {
					window.open(url);
				}
			}
		})
	}

	public loadstartCallback(event: any) {
		console.log('Loading started: ' + event.url)
	}

	public loadstopCallback(event: any) {
		console.log('Loading finished: ' + event.url)
	}

	public loaderrorCallback(error: any) {
		console.log('Loading error: ' + error.message)
	}

	public exitCallback() {
		console.log('Browser is closed...')
	}

}
