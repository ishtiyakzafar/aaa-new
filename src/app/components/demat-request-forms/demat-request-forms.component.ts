import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CommonService } from '../../helpers/common.service';
import { ToasterService } from '../../helpers/toaster.service';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
declare var cordova: any;

@Component({
	selector: 'app-demat-request-forms',
	providers: [WireRequestService],
	templateUrl: './demat-request-forms.component.html',
	styleUrls: ['./demat-request-forms.component.scss'],
})
export class DematRequestFormsComponent implements OnInit {

	dpType: any = [
		{ value: 'NSDL' },
		{ value: 'CDSL' }
	]
	numberOfForm: any = [
		{ value: '1' },
		{ value: '2' },
		{ value: '3' },
		{ value: '4' },
		{ value: '5' }
	]
	selectedDpType!: string;
	selectedNoOfForm!: string;
	tokenValue: any;
	userId: any;
	private subscription: any;

	constructor(
		public modalController: ModalController, private platform: Platform,
		private wireReqService: WireRequestService,
		private storage: StorageServiceAAA,
		private toast: ToasterService,
		public commonService: CommonService
	) { }

	ngOnInit() {
		this.subscription = new Subscription();
		this.storage.get('userID').then((userId) => {
			this.storage.get('userType').then(type => {
				if (type === 'RM' || type === 'FAN') {
					this.storage.get('bToken').then(token => {
						this.storage.get('cookieValue').then(cookie => {
							if (cookie) {
								this.tokenValue = `${token};${cookie.split(';')[0]}`
								this.userId = userId;
							}
						})
					})
				} else {
					this.storage.get('subToken').then(token => {
						this.storage.get('cookieValue').then(cookie => {
							this.tokenValue = `${token};${cookie.split(';')[0]}`
							this.userId = userId;
						})
					})
				}
			})
		});
	}

	/**
	 * on click of partner/client form.
	 * @param type 
	 */

	downloadForm() {
		if (this.selectedDpType === 'CDSL') {
			this.commonService.setClevertapEvent('Drf_CDSL_clicked', { 'Login ID': localStorage.getItem('userId1') });
		} else {
			this.commonService.setClevertapEvent('Drf_NSDL_Clicked', { 'Login ID': localStorage.getItem('userId1') });
		}
		this.subscription.add(
			this.wireReqService
				.getDownloadDematForm(this.tokenValue, this.selectedDpType, this.selectedNoOfForm, this.userId)
				.subscribe((res: any) => {
					if (res['Head']['ErrorCode'] == 0 && res['Body'] && res['Body']['rptData']) {
						const rptDataArray = res['Body']['rptData'];
						rptDataArray.forEach((base64pdfData: any) => {
							const linkSource = 'data:application/pdf;base64,' + base64pdfData;
							const downloadLink = document.createElement("a");
							const fileName = 'DRF_' + this.selectedDpType + ".pdf";
							downloadLink.href = linkSource;
							downloadLink.download = fileName;
							downloadLink.click();
						})
					}
					else {
						this.toast.displayToast(res['Head']['ErrorDescription']);
					}
				})
		)
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

	ngOnDestroy(): void {
		if (this.subscription) {
			this.subscription = this.subscription.unsubscribe();
		}
	}

}
