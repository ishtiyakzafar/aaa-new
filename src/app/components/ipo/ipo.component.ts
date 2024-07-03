import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { SearchComponent } from '../search/search.component';
import { Subscription } from 'rxjs';
import { InvestService } from '../../pages/invest/invest.service';
import { CommonService } from '../../helpers/common.service';
import { DashBoardService } from '../../pages/dashboard/dashboard.service';
import { CustomEncryption } from '../../../config/custom-encrypt';
import { ToasterService } from '../../helpers/toaster.service';
import { investObj } from '../../../environments/environment';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';

declare var cordova: any;
@Component({
	selector: 'app-ipo',
	providers: [InvestService, CommonService, DashBoardService, WireRequestService],
	templateUrl: './ipo.component.html',
	styleUrls: ['./ipo.component.scss'],
})
export class IpoComponent implements OnInit,OnDestroy  {

	public checkupList: any = [];
	public selectedClientCode: any = null;
	public userID: any = null;
	public isRMFAN: any = false;
	public subscription: any;

	constructor(
		public modalController: ModalController,
		private storage: StorageServiceAAA,
		private platform: Platform,
		private investService: InvestService,
		private commonService: CommonService,
		private cipherText: CustomEncryption,
		private dashBoardService: DashBoardService,
		public toast: ToasterService,
		private wireRequestService: WireRequestService,
	) { }

	ngOnInit() {
		this.storage.get('userID').then(ID => {
			this.userID = ID;
		})
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.isRMFAN = true;
				this.storage.get('mappingDetails').then((details) => {
					this.checkupList = details;
				});
			}
			else if (type === 'SUB BROKER') {
				this.isRMFAN = false;
				this.storage.get('subBrokermapping').then((details) => {
					this.checkupList = details;
				});
			}
		})
	}

	public offlineIPO() {
		this.commonService.analyticEvent('Invest_Offline_IPO', 'Invest offlineIPO');
		this.commonService.setClevertapEvent('Invest_OfflineIPO');
		this.storage.get('userID').then((Id) => {
		// const userIdENC = this.cipherText.encryptionforIPO(Id);
		// const offLineENC = this.cipherText.encryptionforIPO("OFFLINE");
		// const url = investObj['offlineIPO']['url'] + '?UserId=' + userIdENC + '&Flag=' + offLineENC;

		this.investService
			.getOfflineIpo(Id)
			.subscribe((response: any) => {
				if (response.message === 'Success') {
					this.dismisss();
					if (this.commonService.isApp() && this.platform.is('ios')) {
						var ref = cordova.InAppBrowser.open(response.resultData.url, '_blank');
						ref.addEventListener('loadstart', this.loadstartCallback);
						ref.addEventListener('loadstop', this.loadstopCallback);
						ref.addEventListener('loaderror', this.loaderrorCallback);
						ref.addEventListener('exit', this.exitCallback);
					} else {
						window.open(response.resultData.url);
					}
				}
			})
		})
	}

	public onlineIPO() {
		this.commonService.analyticEvent('Invest_Online_IPO', 'Invest onlineIPO');
		this.dismisss();
		// this.openSearchOption(true);
		this.onClickIPO();
		// window.open(investObj['offlineIPO']['url']);
	}

	onClickIPO(){
		this.storage.get('userID').then((userID) => {
			this.storage.get('userType').then(type => {
				if (type === 'RM' || type === 'FAN') {
					this.storage.get('bToken').then(token => {
						this.getIpoDataLink(token, userID, null)
					})
				} else {
					this.storage.get('subToken').then(token => {
						this.getIpoDataLink(token, userID, null)
					})
				}
			})
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

	async openSearchOption(smallCase?: any) {
		const modal = await this.modalController.create({
			component: SearchComponent,
			cssClass: 'search-modal',
			componentProps: {
				HealthCheckupList: this.checkupList,
				smallCase: smallCase ? smallCase : false
			}
		});

		modal.onDidDismiss().then(data => {
			if (data["data"]) {
				const response = data['data'];
				if (response['selectedValue'] === null) return;

				this.selectedClientCode = response['selectedValue'];
				// console.log(this.selectedClientCode);
				this.subscription = new Subscription();

				if (smallCase) {
					this.commonService.setClevertapEvent('Invest_OnlineIPO/NCD');
					// console.log(response);
					// const cName = this.cipherText.aesEncrypt(response['selectedValue']['ClientName']);
					// const cName = response['selectedValue']['ClientName'];
					const code = this.cipherText.aesEncrypt(response['selectedValue']['ClientCode']);
					// const code = this.cipherText.aesEncrypt('DEVANSMO');

					const obj1 = {
						requestData: {
							SetupCookie: {
								token: 'EF0EAD9F934070D310B6C0DF54E3FF5607A29B0CB0EA94456A8F6AC53545BFF957E798F37CCDA25C431E6619B36C645592BA3AE75F63AAE0DC6BF78963EDC6EA8B0A2F933AD34CF583A2680DB823CA50A3232D33C3C7BA0EA4DFDDA803785C3F5657650348B35A094D4238BDA952EB50DF5201C94D7C157543B4DD329FF2F75A35D9E85D', // swaraj token
								Appsource: '9',
								LoginId: 'C9685',
								// clientName: cName, // smart search pop up selected ID client name (encrypted)
								ClientCode: encodeURI(code) // smart search pop up selected ID (encrypted)
							},
							URL: 'https://reports.indiainfoline.com/Myaccount/IPO.aspx',
							Module: 'ipo'
						}
					}
					// this.OpenWindowWithPost('https://portfolio.indiainfoline.com/siteredirect/Home/GetAuthorizeTest', '_blank', obj1);
					this.storage.get('userType').then(type => {
						if (type === 'RM' || type === 'FAN') {
							this.storage.get('bToken').then(token => {
								const obj = {
									token: token.replace('.ASPXAUTH=', ''), // swaraj token
									Appsource: '9',
									LoginId: this.userID,
									// clientName: cName, // smart search pop up selected ID client name (encrypted)
									ClientCode: encodeURI(code) // smart search pop up selected ID (encrypted)
								}
								this.subscription.add(
									this.investService
										.getIPOCookie(obj)
										.subscribe((response: any) => {
											if (response[0] === 'Success') {
												this.getIpoDataLink(token, this.selectedClientCode?.ClientCode, this.userID)
												// if (this.commonService.isApp()) {
												// 	const obj1 = {
												// 		requestData: {
												// 			SetupCookie: {
												// 				token: 'EF0EAD9F934070D310B6C0DF54E3FF5607A29B0CB0EA94456A8F6AC53545BFF957E798F37CCDA25C431E6619B36C645592BA3AE75F63AAE0DC6BF78963EDC6EA8B0A2F933AD34CF583A2680DB823CA50A3232D33C3C7BA0EA4DFDDA803785C3F5657650348B35A094D4238BDA952EB50DF5201C94D7C157543B4DD329FF2F75A35D9E85D', // swaraj token
												// 				Appsource: '9',
												// 				LoginId: 'C9685',
												// 				// clientName: cName, // smart search pop up selected ID client name (encrypted)
												// 				ClientCode: encodeURI(code) // smart search pop up selected ID (encrypted)
												// 			},
												// 			URL: 'https://reports.indiainfoline.com/Myaccount/IPO.aspx',
												// 			Module: 'ipo'
												// 		}
												// 	}
												// 	this.OpenWindowWithPost('https://portfolio.indiainfoline.com/siteredirect/Home/GetAuthorize', '_blank', obj);
												// } else {
												// 	this.getIpoDataLink(token, this.selectedClientCode.ClientCode, this.userID)
												// 	//window.open(investObj['onlineIPO']['url']);
												// }
											}
										})
								)
							})
						} else if (type === 'SUB BROKER') {
							this.storage.get('subToken').then(token => {
								const obj = {
									token: token.replace('.ASPXAUTH=', ''), // swaraj token
									Appsource: '9',
									LoginId: this.userID,
									// clientName: cName, // smart search pop up selected ID client name (encrypted)
									ClientCode: code // smart search pop up selected ID (encrypted)
								}
								this.subscription.add(
									this.investService
										.getIPOCookie(obj)
										.subscribe((response: any) => {
											if (response[0] === 'Success') {
												if (this.commonService.isApp() && this.platform.is('ios')) {
													var ref = cordova.InAppBrowser.open(investObj['onlineIPO']['url'], '_blank');

													ref.addEventListener('loadstart', this.loadstartCallback);
													ref.addEventListener('loadstop', this.loadstopCallback);
													ref.addEventListener('loaderror', this.loaderrorCallback);
													ref.addEventListener('exit', this.exitCallback);
												} else {
													this.getIpoDataLink(token, this.selectedClientCode.ClientCode, this.userID)
													//window.open(investObj['onlineIPO']['url']);
												}
											}
										})
								)
							})
						}
					})
				}
			}
		});
		return await modal.present();
	}

	getIpoDataLink(token: any, clientCode: any, issueCode: any) {
		this.dashBoardService.getOneUpIPOLink(token, clientCode, issueCode).subscribe((res: any) => {
			// console.log(res);
			if (res['statusCode'] == 0) {
				// console.log(res['resultData']['url'])
				this.commonService.setClevertapEvent('Investment_Opportunities');
				this.addEventsListenerFun(res['resultData']['url'])
			} else {
				if (res['resultData']) {
					this.toast.displayToast(res['resultData']);
				}
			}
		},
			// error => {
			// 		console.error(error);
			// 		this.toast.displayToast(error);
			// }
		)
	}

	addEventsListenerFun(url: any) {
		if (this.commonService.isApp()) {
			var ref = cordova.InAppBrowser.open(url, '_blank');

			ref.addEventListener('loadstart', this.loadstartCallback);
			ref.addEventListener('loadstop', this.loadstopCallback);
			ref.addEventListener('loaderror', this.loaderrorCallback);
			ref.addEventListener('exit', this.exitCallback);
		} else {
			window.open(url, '_blank');
		}
	}

	public OpenWindowWithPost(url: any, name: any, params: any) {
		var form = document.createElement("form") as HTMLFormElement;
		form.setAttribute("method", "post");
		form.setAttribute("action", url);
		form.setAttribute("target", name);

		for (var i in params) {
			if (i === 'requestData') {
				var input = document.createElement('input');
				input.type = 'hidden';
				input.name = 'requestData';
				input.value = JSON.stringify(params[i]);
				form.appendChild(input);
			} else {
				if (params.hasOwnProperty(i)) {
					var input = document.createElement('input');
					input.type = 'hidden';
					input.name = i;
					input.value = params[i];
					form.appendChild(input);
				}
			}
		}

		document.body.appendChild(form);

		//note I am using a post.htm page since I did not want to make double request to the page 
		//it might have some Page_Load call which might screw things up.
		form.submit();

		// document.body.removeChild(form);
		// window.open("post.htm", name);

	}

	public offlineNCD() {
		this.commonService.setClevertapEvent('Invest_OfflineNCD');
		this.storage.get('userID').then((Id) => {
		// const userIdENC = this.cipherText.encryptionforIPO(Id);
		// const offLineENC = this.cipherText.encryptionforIPO("OFFLINE");
		// const url = investObj['offlineNCD']['url'] + '?UserId=' + userIdENC + '&Flag=' + offLineENC;

		this.investService
			.getOfflineNcd(Id)
			.subscribe((response: any) => {
				if (response.message === 'Success') {
					this.dismisss();
					if (this.commonService.isApp() && this.platform.is('ios')) {
						var ref = cordova.InAppBrowser.open(response.resultData.url, '_blank');
						ref.addEventListener('loadstart', this.loadstartCallback);
						ref.addEventListener('loadstop', this.loadstopCallback);
						ref.addEventListener('loaderror', this.loaderrorCallback);
						ref.addEventListener('exit', this.exitCallback);
					} else {
						window.open(response.resultData.url);
					}
				}
			})
		})
	}

	downloadForm() {
		this.commonService.setClevertapEvent('NCD_Download');
		this.commonService.analyticEvent('NCD_Download', 'IPO');
		if (this.commonService.isApp() && this.platform.is('ios')) {
			var ref = cordova.InAppBrowser.open(investObj['downloadNCD']['url'], '_blank');

			ref.addEventListener('loadstart', this.loadstartCallback);
			ref.addEventListener('loadstop', this.loadstopCallback);
			ref.addEventListener('loaderror', this.loaderrorCallback);
			ref.addEventListener('exit', this.exitCallback);
		} else {
			window.open(investObj['downloadNCD']['url'], "location=no");
		}
	}

	async dismisss() {
		this.modalController.dismiss();
	}

	ngOnDestroy(): void {
		if(this.subscription){
			this.subscription = this.subscription.unsubscribe();
		}
	}

}
