import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { investObj } from '../../../environments/environment';
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

declare var cordova: any;

@Component({
	selector: 'app-invest-bond',
	templateUrl: './invest-bond.page.html',
	styleUrls: ['./invest-bond.page.scss'],
})
export class InvestBondPage implements OnInit {

	constructor(private router: Router,
		private commonService: CommonService,
		private platform: Platform,
		private storage: StorageServiceAAA) { }

	ngOnInit() {
	}

    goBack() {
        window.history.back();
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

	
	public openBond(value: any) {
		let userID = null;
		if (value === 'irfc') {
			const url = investObj['bondURL']['irfc'];
			if (this.commonService.isApp() && this.platform.is('ios')) {
				var ref = cordova.InAppBrowser.open(url, '_blank');

				ref.addEventListener('loadstart', this.loadstartCallback);
				ref.addEventListener('loadstop', this.loadstopCallback);
				ref.addEventListener('loaderror', this.loaderrorCallback);
				ref.addEventListener('exit', this.exitCallback);
			} else {
				window.open(url);
			}
		} else if (value === 'rec') {
			const url = investObj['bondURL']['recBond'];
			if (this.commonService.isApp() && this.platform.is('ios')) {
				var ref = cordova.InAppBrowser.open(url, '_blank');

				ref.addEventListener('loadstart', this.loadstartCallback);
				ref.addEventListener('loadstop', this.loadstopCallback);
				ref.addEventListener('loaderror', this.loaderrorCallback);
				ref.addEventListener('exit', this.exitCallback);
			} else {
				window.open(url);
			}
		} else if (value === 'pfc') {
			const params = ' utm_source=IIFL&utm_medium=SMS&utm_campaign=' + userID + '&PartnerCode=3532';
			const url = investObj['bondURL']['pfcBond'];
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
