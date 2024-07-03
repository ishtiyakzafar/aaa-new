import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { CommonService } from '../../helpers/common.service';
declare var cordova: any;
@Component({
	selector: 'app-form-format',
	providers: [CommonService],
	templateUrl: './form-format.component.html',
	styleUrls: ['./form-format.component.scss'],
})
export class FormFormatComponent implements OnInit {

	constructor(
		public modalController: ModalController, private platform: Platform,
		private commonService: CommonService
	) { }

	ngOnInit() {
	}

	/**
	 * on click of partner/client form.
	 * @param type 
	 */
	onOptionClick(type: string) {
		let url;
		if (type === 'Partners') {
			url = 'https://content.indiainfoline.com/IIFLTT/DownloadFormFormats/DownloadFormFormatsPartners.html';
			this.commonService.setClevertapEvent('Formsand Formatfor Partners_Clicked');
		} else if (type === 'Clients') {
			url = 'https://content.indiainfoline.com/IIFLTT/DownloadFormFormats/DownloadFormFormats.html';
			this.commonService.setClevertapEvent('Formsand Formatfor Clients_Clicked');
		}
		else if (type === 'MutualFunds') {
			url = 'https://content.indiainfoline.com/IIFLAAA/downloadMFForms.html';
			//this.commonService.setClevertapEvent('Formsand Formatfor Clients_Clicked');
		} 
		if (this.commonService.isApp()) {
			var ref = cordova.InAppBrowser.open(url, '_blank');
			ref.addEventListener('loadstart', this.loadstartCallback);
			ref.addEventListener('loadstop', this.loadstopCallback);
			ref.addEventListener('loaderror', this.loaderrorCallback);
			ref.addEventListener('exit', this.exitCallback);
		} else {
			window.open(url, '_blank');
		}
		this.dismisss();
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

	/**
	 * To close popup.
	 */
	async dismisss() {
		this.modalController.dismiss();
	}
}
