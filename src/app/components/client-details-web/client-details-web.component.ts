import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Chart } from 'chart.js';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform, ModalController, PopoverController } from '@ionic/angular';
import { ClientsDetailsModelComponent } from '../clients-details-model/clients-details-model.component';
import { MandatePopoverComponent } from '../mandate-popover/mandate-popover.component';
import { ClientProfileCaptureModalComponent } from '../client-profile-capture-modal/client-profile-capture-modal.component';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import { environment, investObj } from '../../../environments/environment';
import { CustomEncryption } from '../../../config/custom-encrypt';
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { ToasterService } from '../../helpers/toaster.service';
import { URLS } from '../../../config/api.config';

declare var cordova: any;
@Component({
	selector: 'app-client-details-web',
	providers: [WireRequestService],
	templateUrl: './client-details-web.component.html',
	styleUrls: ['./client-details-web.component.scss'],
})
export class ClientDetailsWebComponent implements OnInit {
	@ViewChild('dognutChart') dognutChart: any;
	@Input() clientDetails: any[] = [];
	@Input() clientName: any;
	@Input() isResponseReady: any;
	@Input() isLedgerResReady: any;
	@Input() ladgerId: any;
	@Input() marginTabClient: any[] = [];
	@Input() clientLedger: any[] = [];
	@Input() tradeBook: any[] = [];
	@Input() orderBook: any[] = [];
	@Input() holdingsData: any[] = [];
	@Input() netPosition: any[] = [];
	@Input() HoldingPLData: any[] = [];
	
	clientIdValue = localStorage.getItem('select_client') ? JSON.parse(localStorage.getItem('select_client') || "{}")['ClientCode'] : "{}";

	//holdingsData;
	riskProfileClass: any;
	riskProfileMsg: any;
	riskProfileImg: any;
	riskProfileLink: any;

	livePlData: any;
	margin: any;
	orderBookData: any;
	tradeBookData: any;
	ledgerData: any;
	newLedgerData: any;
	clientCode: any;
	clientCap: any;
	clientRiskProfile:any = 0;
	dataLoad:boolean = false;
	clientProfileData = false;

	public dognut: any;
	public fundTransferBlockValue: any = 'fundTransfer';
	public equityBlockTabValue: any = 'equity';
	public holdingsBlockTabValue: any = 'holdings';
	public equityValue: any = null;
	public commodityValue: any = null;
	public mutualFundValue: any = null;

	public env = environment;
	public isRMFAN: any;
	public isOnlyRM = localStorage.getItem('userType');

	constructor(private wireReqService: WireRequestService, private popoverController: PopoverController, private router: Router, private modalController: ModalController,
		private cipherText: CustomEncryption,
		public commonService: CommonService,
		private storage: StorageServiceAAA, private platform: Platform, public toast: ToasterService) { }

	ngOnInit() {
		// console.log("Testing")
		// if (this.isResponseReady) {
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
			},);
			if(this.clientDetails!=null || this.clientDetails!=undefined){
				

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
					// 		plugins:{
					// 			legend: {
					// 				display: false
					// 			}
					// 		}
					// 	}
					// });
					
				}, 1500);
			}
		
	}
	//    }

	ionViewWillEnter() {
		this.storage.get('userType').then( type => {
			// alert(type)
			if (type === 'RM' || type === 'FAN') {
				this.isRMFAN = true;
				// alert(this.isRMFAN);
			}
		})
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
			  if(this.clientRiskProfile <= 15){
				this.riskProfileImg ="assets/svg/risk-very-conservative.svg";
				this.riskProfileMsg = "Very Conservative";
				this.riskProfileClass = "client-visible  client-Very-Conservative"
			  }
			  else if(this.clientRiskProfile >= 16 && this.clientRiskProfile <= 25){
				this.riskProfileImg ="assets/svg/risk-conservative.svg";
				this.riskProfileMsg = "Conservative";
				this.riskProfileClass = "client-visible client-Conservative"
			  }
			  else if(this.clientRiskProfile >= 26 && this.clientRiskProfile <= 35){
				this.riskProfileImg ="assets/svg/risk-moderate.svg";
				this.riskProfileMsg = "Moderate";
				this.riskProfileClass = "client-visible  client-Moderate"
			  }
			  else if(this.clientRiskProfile >= 36 && this.clientRiskProfile <= 45){
				this.riskProfileImg ="assets/svg/risk-aggressive.svg";
				this.riskProfileMsg = "Aggressive";
				this.riskProfileClass = "client-visible  client-Aggressive"
			  }
			  else if(this.clientRiskProfile >= 46){
				this.riskProfileImg ="assets/svg/risk-very-aggressive.svg";
				this.riskProfileMsg = "Very Aggressive";
				this.riskProfileClass = "client-visible client-Very-Aggressive"
			  }
			  else if(this.clientRiskProfile == '' || this.clientRiskProfile == null || this.clientRiskProfile == undefined || this.clientCap == null){
				this.riskProfileImg ="assets/svg/risk-evaluation.svg";
				this.riskProfileClass = "client-visible"
			  }
			  
			  //console.log('ProfileData', this.clientCap['RiskProfile']);
			}
			else{this.dataLoad = false
				if(this.clientRiskProfile == '' || this.clientRiskProfile == null || this.clientRiskProfile == undefined || this.clientCap == null){
					this.riskProfileImg ="assets/svg/risk-evaluation.svg";
					this.riskProfileClass = "client-visible"
				  }
			} 
	
		  });
		})
	   
	  }

	async clientDetailsPopup() {
		// if (this.env['production']) {
		// 	const url = 'https://holi.iifl.in/PBI_Reports/report/ClientDetails?rs:Command=Render&rc:Toolbar=false&Clientcode='+ this.ladgerId;
		// 	window.open(url, '_blank');
		// } else {
		this.commonService.setClevertapEvent('Client_Details_Page');
		this.commonService.analyticEvent('Client_Details_Page', 'Client & Trades');
		const modal = this.modalController.create({
			component: ClientsDetailsModelComponent,
			componentProps: { "IndParams": '', clientID: this.clientIdValue },
			cssClass: 'superstars client-details'
		});
		return (await modal).present();
		// }
	}

	convertNanToZero(value: any) {
		if (isNaN(value)) {
			return 0;
		}
		return value;
	}

	goToFundTransfer(){
		localStorage.setItem('clientDetail', "true");		
		this.router.navigate(['/fund-transfer']);
	}

	pledge() {
		this.commonService.setClevertapEvent('Pledge_Securities');
		this.commonService.analyticEvent('Pledge_Securities', 'Client & Trades');
		this.storage.get('userID').then(ID => {
			const cnt = this.cipherText.aesEncrypt(ID);
			//const app = 2;
			const app = 3;

			const clientCode = this.cipherText.aesEncrypt(this.clientDetails[0]['ClientID']);
			const dealerID = this.cipherText.aesEncrypt(ID);
			this.storage.get('userType').then(type => {
				if (type === 'RM' || type === "FAN") {
					this.storage.get('sToken').then(token => {
						const url = URLS['pledgeSecurity']['url'] + '?cnt=' + cnt + '&app=' + app + '&clientCode=' + clientCode + '&dealerid=' + dealerID + '&authToken=' + token;
						window.open(url, '_blank');
					})
				} else if (type === 'SUB BROKER') {
					this.storage.get('subToken').then(token => {
						const url = URLS['pledgeSecurity']['url'] + '?cnt=' + cnt + '&app=' + app + '&clientCode=' + clientCode + '&dealerid=' + dealerID + '&authToken=' + token;
						window.open(url, '_blank');
					})
				}
			})
		})
	}

	goToShareReport() {
		localStorage.setItem('clientDetail', "true");
		if (this.clientName) {
			this.router.navigate(['/share-reports', this.clientIdValue, this.clientName.split(' ').join('-')]);
		}
		else {
			this.router.navigate(['/share-reports', this.clientIdValue, '-']);
		}


	}
	goToBrokeragePlan() {
		localStorage.setItem('clientDetail', "true");
		if(this.clientIdValue != ''){
			this.commonService.setClevertapEvent('Brokerage_Information');
			this.commonService.analyticEvent('Brokerage_Information', 'Wire Reports');
			this.router.navigate(['/brokerage-information',this.clientIdValue]);
		}
		else{
			this.toast.displayToast("Client Code is not available");
		}
	}
	goToClientInteractions() {
		//console.log('Clientinteractions_clicked', 'Clientinteractions_clicked');
		this.commonService.setClevertapEvent('Clientinteractions_clicked', { 'PartnerCode': localStorage.getItem('userId1') });
		this.router.navigate(['/client-interactions'],{ queryParams: {id: this.clientIdValue}});
	}
	goToRiskEvaluation() {
		this.commonService.setClevertapEvent('FinancialPlanning_Clicked', { 'Login ID': localStorage.getItem('userId1') });
		this.router.navigate(['/risk-profile'],{ queryParams: {id: this.clientIdValue, score: this.clientRiskProfile}});
	}
	goToReEvaluate() {
		this.commonService.setClevertapEvent('FinancialPlanning_Clicked', { 'Login ID': localStorage.getItem('userId1') });
		this.router.navigate(['/risk-profile'],{ queryParams: {id: this.clientIdValue, score: 0}});
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
						const codeENC = this.cipherText.aesEncrypt(this.clientIdValue);
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
						const codeENC = this.cipherText.aesEncrypt(this.clientIdValue);

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
	// getLedgerDeatails(data)
	// {
	// 	this.commonService.getLedgerDetails(data,this.clientIdValue).subscribe(res=>{
	// 		console.log(res, "Testing the data");
	// 		this.newLedgerData=res;
		
	// 	});
	// }
	async displyPopupClientProfile() {
		const modal = this.modalController.create({
			component: ClientProfileCaptureModalComponent,
			componentProps: {clientID: this.clientIdValue, clientName: this.clientName },
			cssClass: 'client_profile_modal',
		  	backdropDismiss: true
		  });
		  return (await modal).present();
		}

		trade_btn_click(type: any) {
			if (type == 'equity') {
				this.commonService.setClevertapEvent('Trades Equity Clicked', { 'Login ID': localStorage.getItem('userId1') });
			} else if (type == 'mutual') {
				this.commonService.setClevertapEvent('Trades Mutual funds Clicked', { 'Login ID': localStorage.getItem('userId1') });
			}
		}

}
