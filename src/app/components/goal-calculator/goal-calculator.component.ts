import { Component, OnInit } from '@angular/core';
import { InvestService } from '../../pages/invest/invest.service';
import { Subscription } from 'rxjs';
import { ModalController, Platform } from '@ionic/angular';
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

declare var cordova: any;
@Component({
	selector: 'app-goal-calculator',
	templateUrl: './goal-calculator.component.html',
	providers: [InvestService],
	styleUrls: ['./goal-calculator.component.scss'],
})
export class GoalCalculatorComponent implements OnInit {
	private subscription = new Subscription();
	public clientAuthObj = null;
	constructor(private investService: InvestService,
		private commonService: CommonService,
		private platform: Platform,
		private storage: StorageServiceAAA,private modalController: ModalController) { }

	ngOnInit() {
	}

	// async dismiss() {
	// 	await this.modalController.dismiss();
	// }

	public goBack() {
		window.history.back();
	}
	
	goalCalculatorLink(){

		if (this.commonService.isApp() && this.platform.is('ios')) {
			var ref = cordova.InAppBrowser.open('https://mf.indiainfoline.com/MFOnline/financial-planning-calculator', '_blank');

			ref.addEventListener('loadstart', this.loadstartCallback);
			ref.addEventListener('loadstop', this.loadstopCallback);
			ref.addEventListener('loaderror', this.loaderrorCallback);
			ref.addEventListener('exit', this.exitCallback);
		} else {
			window.open('https://mf.indiainfoline.com/MFOnline/financial-planning-calculator', '_blank');
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
