import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Chart } from 'chart.js';
import { Storage } from '@ionic/storage';
import { ClientTradesService } from '../recently-viewed-client-list/client-trades.service';
import { ModalController, Platform, PopoverController } from '@ionic/angular';
import { ClientsDetailsModelComponent } from '../../components/clients-details-model/clients-details-model.component';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import { CustomEncryption } from '../../../config/custom-encrypt';
import { CommonService } from '../../helpers/common.service';
import { ToasterService } from '../../helpers/toaster.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { investObj } from '../../../environments/environment';
import { ClientProfileCaptureModalComponent } from '../../components/client-profile-capture-modal/client-profile-capture-modal.component';
import { MandatePopoverComponent } from '../../components/mandate-popover/mandate-popover.component';
declare var cordova: any;

@Component({
	selector: 'app-client-details',
	providers: [ClientTradesService, CustomEncryption, WireRequestService],
	templateUrl: './client-details.page.html',
	styleUrls: ['./client-details.page.scss'],
})
export class ClientDetailsPage implements OnInit {
	@ViewChild('dognutChart') dognutChart: any;
	public dognut: any;
	public fundTransferBlockValue: any = 'fundTransfer';
	urlParameter: any;
	passClientID: any;
	passClientName: any;
	LoginID: any;
	public equityValue: any = null;
	public commodityValue: any = null;
	public mutualFundValue: any = null;
	clientDetails: any[] = [];
	clientCodeList:any[] = [];
	selectedClientTab:any = 'rmView'
	clientCode: any;
	clientIdValue = JSON.parse(localStorage.getItem('select_client') || "{}")['ClientCode'];
	public isOnlyRM = localStorage.getItem('userType');
	riskProfileClass: any;
	riskProfileMsg: any;
	riskProfileImg: any;
	riskProfileLink: any;
	public isRMFAN : any;
	clientName: any;
	clientCap: any;
	clientRiskProfile:any = 0;
	dataLoad:boolean = false;
	clientProfileData = false;
	newChartOptions: any = {
		responsive: true,
		plugins: {
			legend: {
				display: false
			}
		}
	}
	newChartLabels: string[] = [
		'Commodity',
		'mutual funds',
		'Equity'
	];
	newChartData: any[] = [
		{ data: [], backgroundColor: ['#25CC84', '#E8CE0F', '#145FF4'], borderWidth: 0 }
	];

	constructor(private popoverController: PopoverController, private router: Router, private route: ActivatedRoute, private storage: StorageServiceAAA, private clientService: ClientTradesService, private modalController: ModalController,
		public commonService: CommonService,
		public cipherText: CustomEncryption,
		private platform: Platform, public toast: ToasterService,
		private wireReqService: WireRequestService) { }

		ngOnInit() {
			// console.log("Testing")
			// if (this.isResponseReady) {
				if(this.clientDetails!=null || this.clientDetails!=undefined){
					setTimeout(() =>{
						this.storage.get('userType').then(type => {
							if (type === 'RM' || type === 'FAN') {
							 
							  this.storage.get('bToken').then(token => {
								this.clientProfileCap(token)
							  })
							} else {
							  this.storage.get('subToken').then(token => {
								this.clientProfileCap(token)
							  })
							}
					  
						  })
					}, 50);
					setTimeout(() => {
						this.equityValue = this.clientDetails[0]['EquityHoldingValue'];
						this.commodityValue = this.clientDetails[0]['CommodityHoldingValue'];
						this.mutualFundValue = this.clientDetails[0]['MutualFundHoldingvalue'];
						this.clientCode = this.clientDetails[0]['ClientID'];
			
						this.storage.get('userType').then( type => {
							if (type === 'RM' || type === 'FAN') {
								this.isRMFAN = true;
							}
						})
	
						
						this.newChartData[0].data = [this.commodityValue, this.mutualFundValue, this.equityValue];
						// this.dognut = new Chart(this.dognutChart.nativeElement, {
						// 	type: 'doughnut',
						// 	data: {
						// 		labels: [
						// 			'Commodity',
						// 			'mutual funds',
						// 			'Equity'
						// 		],
						// 		datasets: [{
						// 			// data: [23, 16, 61],
						// 			data: [this.commodityValue, this.mutualFundValue, this.equityValue],
						// 			backgroundColor: ['#25CC84', '#E8CE0F', '#145FF4'], // array should have same number of elements as number of dataset
						// 			// borderColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
						// 			borderWidth: 0
						// 		}],
			
						// 	},
						// 	options: {
						// 		responsive: true,
						// 		plugins: {
						// 			legend: {
						// 				display: false
						// 			}
						// 		}
						// 	}
						// });
						
					}, 1500);
				}
				
				
				
		}

	ionViewWillEnter() {
		// setTimeout(() => {
		//   this.dognut = new Chart(this.dognutChart.nativeElement, {
		//     type: 'doughnut',
		//     data: {
		//       labels: [
		//         'Commodity',
		//         'mutual funds',
		//         'Equity'
		//     ],
		//       datasets: [{
		//         data: [23, 16, 61],
		//         backgroundColor: ['#25CC84', '#E8CE0F', '#145FF4'], // array should have same number of elements as number of dataset
		//         // borderColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
		//         borderWidth: 0
		//       }],

		//     },
		//     options: {
		//       responsive: true,
		//       legend: {
		//         display: false
		//       }
		//     }
		//   });
		// }, 1500);
		this.urlParameter = this.route.params.subscribe(params => {
			this.passClientID = params['id'];
			this.passClientName = params['id1'].split('-').join(' ');
			// console.log(this.passClientName);
		});
		// console.log(this.passClientID);
		var data = {
			"ClientCode": this.passClientID,
			"ClientName": this.passClientName
		}
		localStorage.setItem('select_client', JSON.stringify(data))
		this.clientHoldingMarginList(this.passClientID);
		this.displayClientCodes()
		// this.storage.get('userID').then((userID) => {
		// 	this.storage.get('userType').then(type => {
		// 		if (type === 'RM' || type === 'FAN') {
		// 			this.storage.get('bToken').then(token => {
		// 				this.displayClientCodes(token, userID)
		// 			})
		// 		} else {
		// 			this.storage.get('subToken').then(token => {
		// 				this.displayClientCodes(token, userID)
		// 			})
		// 		}
		// 		})
		// 	})

	}

	displayClientCodes() {
		this.storage.get('setClientCodes').then((clientCodes) => {
			this.clientCodeList = clientCodes;
		})
		// this.wireReqService.getClientCodes(token, userId).subscribe((res) => {
		// 	if (res['Head']['ErrorCode'] == 0) {
		// 		this.clientCodeList = res['Body']['objGetClientCodesResBody'];
		// 		localStorage.setItem('clientListWireRequest', JSON.stringify(this.clientCodeList));

		// 		console.log(this.clientCodeList);
		// 	}
		// })
	}


	goToAddScript() {
		//this.router.navigate(['/add-script'])
		this.router.navigate(['/dashboard-clients']);
	}

	// create dognut graph
	createGraph(value1?: any, value2?: any, value3?: any) {
		setTimeout(() => {

			this.newChartData[0].data = [value1, value2, value3];
			// this.dognut = new Chart(this.dognutChart.nativeElement, {
			// 	type: 'doughnut',
			// 	data: {
			// 		labels: [
			// 			'Commodity',
			// 			'mutual funds',
			// 			'Equity'
			// 		],
			// 		datasets: [{
			// 			// data: [23, 16, 61],
			// 			data: [value1, value2, value3],
			// 			backgroundColor: ['#25CC84', '#E8CE0F', '#145FF4'], // array should have same number of elements as number of dataset
			// 			// borderColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
			// 			borderWidth: 0
			// 		}],

			// 	},
			// 	options: {
			// 		responsive: true,
			// 		plugins: {
			// 			legend: {
			// 				display: false
			// 			}
			// 		}
			// 	}
			// });
		}, 1500);
	}

	public goBack() {
		window.history.back();
	}

	clientHoldingMarginList(clientID: any) {
		this.storage.get('userID').then((token) => {
			this.LoginID = token
			var holdingMarginObj =
			{
				"UserCode": token,
				"ProductType": "",
				"ClientID": [clientID],
				"DetailSummaryView": 1
			}
			// console.log(cashScripCodeObj);

			this.clientService.getClientHoldingMargin(holdingMarginObj).subscribe((res: any) => {
				// console.log('cashstrip', res)

				//this.clientDetails = res;
				if (res['head']['status'] === '0') {
					this.clientDetails = res['body']['list_of_getclientholdingandmargin'];
					this.equityValue = this.clientDetails[0]['EquityHoldingValue'];
					this.commodityValue = this.clientDetails[0]['CommodityHoldingValue'];
					this.mutualFundValue = this.clientDetails[0]['MutualFundHoldingvalue'];
					this.createGraph(this.commodityValue, this.mutualFundValue, this.equityValue);
				}
				// // console.log(this.futureOptScripCode);
				//this.getExpiryDates(this.Exch, this.ExchType, this.ScripShortName);

			})
		})
	}



	async clientDetailsPopup() {
		this.commonService.setClevertapEvent('Client_Details_Page');
		this.commonService.analyticEvent('Client_Details_Page', 'Client & Trades');
		const modal = this.modalController.create({
			component: ClientsDetailsModelComponent,
			componentProps: { "IndParams": '', clientID: this.passClientID},
			cssClass: 'superstars client-details'
		});
		return (await modal).present();
	}

	public goToEquityCommodity() {
		this.router.navigate(['/client-equity-commodity', this.passClientID]);
	}

    public goToMutualFund() {
		this.router.navigate(['/mutual-fund', this.passClientID, this.passClientName.split(' ').join('-')]);
	}

	convertNanToZero(value: any) {
		if (isNaN(value)) {
			return 0;
		}
		return value;
	}

	goToShareReport() {
		this.router.navigate(['/share-reports', this.passClientID, this.passClientName.split(' ').join('-')]);
	}

	goToFundTransfer(){
		this.router.navigate(['/fund-transfer']);
	}

	async comingSoon() {
		const items = [
			{ title: 'Currently mandate setting functionality has been disabled from AAA. Request you to kindly visit  mf.indiainfoline.com to continue setting the mandate for clients.', 
			value: 'Currently mandate setting functionality has been disabled from AAA. Request you to kindly visit  mf.indiainfoline.com to continue setting the mandate for clients.' },
		]
		// ev.stopPropagation();
		const popover = await this.popoverController.create({
			component: MandatePopoverComponent,
			componentProps: { items: items },
			cssClass: "pop-over",
			mode: "md",
			showBackdrop: false,
			// event: ev
			// translucent: true
		});
		return await popover.present();
	}
	clientProfileCap(token: any){
		let clientId =  this.clientIdValue;
		 //console.log('clientId dd', clientId);
		this.storage.get('userID').then((userID) => {
		  //console.log('clientProfileCap', token);
		  this.wireReqService.getProfileCap(token,userID,clientId).subscribe((res: any) => {
	
			
			if(res['Head']['ErrorCode'] == 0){
				this.dataLoad = true; 
			  this.clientProfileData =	true;
			  this.clientCap = res['Body'][0];
			  this.clientCode = this.clientCap['ClientID'];
			  this.clientRiskProfile = this.clientCap['RiskProfile'];
			  if(this.clientRiskProfile == '' || this.clientRiskProfile == null || this.clientRiskProfile == undefined || this.clientCap == null){
				this.riskProfileImg ="assets/svg/risk-evaluation.svg";
				 	this.riskProfileClass = "client-visible"
			}
			if(this.clientRiskProfile <= 15){
				this.riskProfileImg ="assets/svg/risk-very-conservative.svg";
				this.riskProfileMsg = "Very Conservative";
				this.riskProfileClass = "client-visible client-Very-Conservative"
			  }
			  else if(this.clientRiskProfile >= 16 && this.clientRiskProfile <= 25){
				this.riskProfileImg ="assets/svg/risk-conservative.svg";
				this.riskProfileMsg = "Conservative";
				this.riskProfileClass = "client-visible client-Conservative"
			  }
			  else if(this.clientRiskProfile >= 26 && this.clientRiskProfile <= 35){
				this.riskProfileImg ="assets/svg/risk-moderate.svg";
				this.riskProfileMsg = "Moderate";
				this.riskProfileClass = "client-visible client-Moderate"
			  }
			  else if(this.clientRiskProfile >= 36 && this.clientRiskProfile <= 45){
				this.riskProfileImg ="assets/svg/risk-aggressive.svg";
				this.riskProfileMsg = "Aggressive";
				this.riskProfileClass = "client-visible client-Aggressive"
			  }
			  else if(this.clientRiskProfile >= 46){
				this.riskProfileImg ="assets/svg/risk-very-aggressive.svg";
				this.riskProfileMsg = "Very Aggressive";
				this.riskProfileClass = "client-visible client-Very-Aggressive"
			  }
			  
			  //console.log('ProfileData', this.clientCap['RiskProfile']);
			}
			else{this.dataLoad = false} 
	
		  });
		})
	   
	  }
	async displyPopupClientProfile() {
		this.commonService.setClevertapEvent('ClientProfile_Clicked');
		const modal = this.modalController.create({
			component: ClientProfileCaptureModalComponent,
			componentProps: {clientID: this.clientIdValue, clientName: this.clientName },
			cssClass: 'client_profile_modal',
		  	backdropDismiss: true
		  });
		  return (await modal).present();
		}
		goToClientInteractions() {
			// localStorage.setItem('clientInteractionId',this.clientIdValue);
			this.router.navigate(['/client-interactions'],{ queryParams: {id: this.clientIdValue ? this.clientIdValue : this.passClientID}});
		}
		goToRiskEvaluation() {
			this.commonService.setClevertapEvent('FinancialPlanning_clicked');
			this.router.navigate(['/risk-profile'],{ queryParams: {id: this.clientIdValue, score: this.clientRiskProfile}});
		}
		goToReEvaluate() {
			this.router.navigate(['/risk-profile'],{ queryParams: {id: this.clientIdValue, score: 0}});
		}

	mandate(flag: any) {
		// IOS:  11 
		// Android:  12   
		// AAA website :  13
		let appSource: any;
		if (this.platform.is('android')) {
			appSource = this.cipherText.aesEncrypt(12);
		} else if (this.platform.is('mobileweb') || this.platform.is('desktop')) {
			appSource = this.cipherText.aesEncrypt(13);
		} else if (this.platform.is('ios')) {
			appSource = this.cipherText.aesEncrypt(11);
		}
		const flagENC = this.cipherText.aesEncrypt(flag);
		this.storage.get('userType').then((role) => {
			if (role === 'RM' || role === 'FAN') {
				const roleENC = this.cipherText.aesEncrypt(role);
				this.storage.get('bToken').then((sCookie) => {
					const swarajCookie = sCookie.split('=');

					this.storage.get('userID').then((clientCode) => {
						const codeENC = this.cipherText.aesEncrypt(this.passClientID);
						const obj = {
							token: swarajCookie[1],
							Flag: flagENC,
							Appsource: appSource,
							ClientCode: codeENC,
							Role: roleENC
						}
						const url = investObj['mutualFund']['url'] + '?token=' + swarajCookie[1] + '&Flag=' + flagENC + '&Appsource=' + appSource + '&ClientCode=' + codeENC + '&Role=' + roleENC;
						this.comingSoon();
						// if (this.commonService.isApp()) {
						// 	// this.comingSoon();
						// 	var ref = cordova.InAppBrowser.open(url, '_blank');

						// 	ref.addEventListener('loadstart', this.loadstartCallback);
						// 	ref.addEventListener('loadstop', this.loadstopCallback);
						// 	ref.addEventListener('loaderror', this.loaderrorCallback);
						// 	ref.addEventListener('exit', this.exitCallback);
						// } else {
						// 	this.OpenWindowWithPost(investObj['mutualFund']['url'], '_blank', obj);
						// 	// this.comingSoon();
						// }
						// window.open(url);
					})
				})
			} else if (role === 'SUB BROKER') {
				this.storage.get('subToken').then((sCookie) => {
					const brokerToken = sCookie.split('=');
					const roleENC = this.cipherText.aesEncrypt('SubBroker');

					this.storage.get('userID').then((clientCode) => {
						const codeENC = this.cipherText.aesEncrypt(this.passClientID);

						const obj = {
							token: brokerToken[1],
							Flag: flagENC,
							Appsource: appSource,
							ClientCode: codeENC,
							Role: roleENC
						}

						const url = investObj['mutualFund']['url'] + '?token=' + brokerToken[1] + '&Flag=' + flagENC + '&Appsource=' + appSource + '&ClientCode=' + codeENC + '&Role=' + roleENC;
						this.comingSoon();
						// if (this.commonService.isApp()) {
						// 	var ref = cordova.InAppBrowser.open(url, '_blank');

						// 	ref.addEventListener('loadstart', this.loadstartCallback);
						// 	ref.addEventListener('loadstop', this.loadstopCallback);
						// 	ref.addEventListener('loaderror', this.loaderrorCallback);
						// 	ref.addEventListener('exit', this.exitCallback);
						// 	// this.comingSoon();
						// } else {
						// 	this.OpenWindowWithPost(investObj['mutualFund']['url'], '_blank', obj);
						// 	// this.comingSoon();
						// }
						// window.open(url);
					})
				})
			}
		})
	}

	public loadstartCallback(event: any) {
		console.log('Loading started: ' + event.url)
	}

	public loadstopCallback(event: any) {
		console.log('Loading finished: ' + event);
	}

	public loaderrorCallback(error: any) {
		console.log('Loading error: ' + error.message)
	}

	public exitCallback() {
		console.log('Browser is closed...')
	}

	public OpenWindowWithPost(url: any, name: any, params: any) {
		var form = document.createElement("form") as HTMLFormElement;
		form.setAttribute("method", "post");
		form.setAttribute("action", url);
		form.setAttribute("target", name);

		for (var i in params) {
			if (params.hasOwnProperty(i)) {
				var input = document.createElement('input');
				input.type = 'hidden';
				input.name = i;
				input.value = params[i];
				form.appendChild(input);
			}
		}

		document.body.appendChild(form);

		//note I am using a post.htm page since I did not want to make double request to the page 
		//it might have some Page_Load call which might screw things up.
		form.submit();

		// document.body.removeChild(form);
		// window.open("post.htm", name);

	}

	goToBrokeragePlan() {
		if(this.passClientID != ''){
			this.commonService.setClevertapEvent('Brokerage_Information');
			this.commonService.analyticEvent('Brokerage_Information', 'Wire Reports');
			this.router.navigate(['/brokerage-information',this.passClientID]);
		}
		else{
			this.toast.displayToast("Client Code is not available");
		}
	}

	clientTabChange(event: any){
		this.selectedClientTab = event;
	}

}
