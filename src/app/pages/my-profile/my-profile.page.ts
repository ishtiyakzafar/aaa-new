import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { CommonService } from '../../helpers/common.service';
import { Platform, ModalController, AlertController, NavController} from '@ionic/angular';
import { GenerateOtpComponent } from '../../components/generate-otp/generate-otp.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NewLoginService } from '../new-login/new-login.service';
import { Subscription } from 'rxjs';
import { URLS } from '../../../config/api.config';
import { environment } from '../../../environments/environment';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { ToasterService } from '../../helpers/toaster.service';
import { AuthenticationService } from '../../helpers/authentication.service';
import { IPDetailsComponent } from '../../components/ip-details/ip-details.component';
@Component({
	selector: 'app-my-profile',
	providers: [NewLoginService],
	templateUrl: './my-profile.page.html',
	styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage implements OnInit,OnDestroy  {

	profileDetails: any = {
		Name: null,
		Email: null,
		MobileNo: null,
		Address: null,
		PanNo: null,
		AccountNo: null,
		RMCode: null,
		RMName: null,
		RMEmail: null,
		RMMobileNo: null,
		HODCode: null,
		HODName: null,
		HODEmail: null,
		IRACode: null,
		IRAName: null,
		IRAEmail: null,
		TTManagerID: null,
		Segments: null,
		PartnerCode: null,
		RMAddress: null,
		BankName: null,
		BankIFSC: null,
		FANActiveSegments: null
	};
	userID = null;
	device:any;
	public modal: any;
	public payoutHistory: any[] = [
		{ ID: 'PNL00021', segment: 'NSE Cash', name:'Sujay Ramashankar', address:'F454, J J Jacob road, Ambedkar street Madhya Pradesh, 450050'},
		{ ID: 'PNL00021', segment: 'NSE Cash', name:'Sujay Ramashankar', address:'F454, J J Jacob road, Ambedkar street Madhya Pradesh, 450050'},
		{ ID: 'PNL00021', segment: 'NSE Cash', name:'Sujay Ramashankar', address:'F454, J J Jacob road, Ambedkar street Madhya Pradesh, 450050'},
		{ ID: 'PNL00021', segment: 'NSE Cash', name:'Sujay Ramashankar', address:'F454, J J Jacob road, Ambedkar street Madhya Pradesh, 450050'},
	]

	public cards: any[] = [
		{ ID: 0},
		{ ID: 1},
		{ ID: 2},
		{ ID: 3},
	]

	userType = null;
	isFanChild = false;
	public backOfficeLogout: any = URLS.backofficeLogout;
	private gatewaySubscriptionKey = environment['gatewaySubscriptionKey'];
	public subscription: any;
	
	constructor(
		private storage: StorageServiceAAA, private commonService: CommonService, 
		public alertController: AlertController,private http: HttpClient,
		private toast: ToasterService, private router: Router,
		public serviceFile: NewLoginService,
		private authService: AuthenticationService,private cookieService: CookieService,
		private modalController: ModalController, private platform: Platform
	) { 
		if (this.platform.is('desktop')) {
			this.device = 'desktop';
		}
		if (this.platform.is('mobile')) {
			this.device = 'mobile';
		}
		this.storage.get('userID').then(ID => {
			this.userID = ID;
		})

		this.storage.get('userType').then( type => {
			this.userType = type;
		})
		// this.storage.get('pDetails').then(data => {
		// 	this.profileDetails = data;
		// })
	}

	ngOnInit() {
		 this.storage.get('pDetails').then(details => {
			details.AccountNo = this.maskingAccNo(details.AccountNo)
			// details.MobileNo = this.maskingNumber(details.MobileNo)
			this.profileDetails = details
			// 	"Name": "ADARSH KUMAR PANDEY",
			// 	"Email": "ADARSHTHEBARON@YAHOO.COM123",
			// 	"MobileNo": "8898867676",
			// 	"Address": "8, LYONS RANGE MITRA BUILDING TOP FLOOR, DALHOUSE SQUARE, BEHIND RITERS BUILDING,DIST-KOLKATA",
			// 	"PanNo": "ASAPP9867A",
			// 	"AccountNo": "0092000101779949",
			// 	"RMCode": "C100450",
			// 	"RMName": "Palash Das",
			// 	"RMEmail": "IILEmail_Pala",
			// 	"RMMobileNo": "Mobile_Pala",
			// 	"HODCode": "C83654",
			// 	"HODName": "Gaurav Mishra",
			// 	"HODEmail": "IILEmail_Gaur",
			// 	"IRACode": "C70239",
			// 	"IRAName": "Joydeep Ghosh",
			// 	"IRAEmail": "IILEmail_Joyd",
			// 	"TTManagerID": "-",
			// 	"Segments": "NSE Cash",
			// 	"PartnerCode": "FD860",
			// 	"RMAddress": "Addr_Pala",
			// 	"BankName": "SBI",
			// 	"BankIFSC": "SBINM",
			// }
			// let ARNValidity = {'ARNValidityDate': '1635745216000','ArnValidation':true}
			// console.log(Object.assign(details,ARNValidity))
			// this.profileObj = Object.assign(details,ARNValidity)
			// this.arnflag = 	this.profileObj.ArnValidation;
			// console.log(this.arnflag);
		 })	
		//this.commonService.analyticEvent('My_Profile', 'Profile');
		this.storage.get('isFanChild').then(isChild => {
			if(isChild == 'true'){
				this.isFanChild = true;
			}
		});
	}

	async openMobileEmailInputModel(params: any, value: any){
		let dislayLabelType; 
		if(params == "Mobile Number"){
			dislayLabelType = this.maskingNumber(value);
		}
		else{
			dislayLabelType = value
		}
		this.modal = this.modalController.create({
			component: GenerateOtpComponent,
			componentProps: { "title": params, 'value':dislayLabelType},
			cssClass: 'superstars generate-otp'
		});
		return (await this.modal).present();
	}

	getTransformedData(data: any){
		return data.slice(0, -1);
	}

	maskingNumber(num: any){
		let displayMaskedMobileNo
		if(num !== undefined){
			if(num.length == 10){
				displayMaskedMobileNo = "******"+num.substr(num.length - 4);
			}
			else{
				displayMaskedMobileNo = num
			}
		}
		
		return displayMaskedMobileNo
	}

	maskingAccNo(value: any){
		let displayMaskedNo
		if(value !== undefined){
			let maskingAccNo = value;
			if( maskingAccNo.length > 10){
				displayMaskedNo = "********"+maskingAccNo.substr(maskingAccNo.length - 4)
			}
			else{
				displayMaskedNo = value
			}
		}
		else{
			displayMaskedNo = "-"
		}
		return displayMaskedNo;
	}
	
	dropClick(uniqueID: any, arr: any) {
		// console.log(arr)
		//this.trackByMethod(index, dataObj)
		arr.forEach((element: any, ind: any) => {
			if (uniqueID !== element.ID) {
				element['isVisible'] = false;
			} else {
				element['isVisible'] = element['isVisible'] ? false : true;
			}
		});
    }
	async confirmLogout() {
		const alert = await this.alertController.create({
			cssClass: 'confirm-logout-alert',
			// header: 'Alert',
			// subHeader: 'Subtitle',
			message: 'Are you sure you want to logout?',
			// buttons: ['No', 'Yes'],
			buttons: [
				{
					text: 'No',
					role: 'cancel',
					handler: () => {
						console.log('Cancel clicked');
					}
				},
				{
					text: 'Yes',
					handler: () => {
						this.commonService.setClevertapEvent('Logout');
						const userType = localStorage.getItem('userType');
						let obj = {
							'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
							'appID': localStorage.getItem('appID') || ''
						}
						if (userType === 'RM' || userType === 'FAN') {
							this.storage.get('bToken').then((bToken: any) => {
								const backOffice = {
									'token': bToken
								}
								const boData = {
									"EmployeeId": "",
									"Password": "",
									"AppName": "",
									"MachinId": "",
									"MacAdd": ""
								};
								this.http.post<any>(`${this.backOfficeLogout.url}`, boData, { headers: new HttpHeaders(Object.assign(bToken !== null ? backOffice : {}, obj)) }).subscribe(res => {
									const userType = localStorage.getItem('userType');
									if (userType === 'RM' || userType === 'FAN') {
										this.storage.get('userID').then((ID) => {
											this.storage.get('sToken').then((tokenValue) => {
												const obj = {
													"head": {
														"requestCode": "IIFLMarRQLO01",
														"key": URLS.swarajLogout.key,
														"appVer": "1.0.18.0",
														"appName": "AAA",
														"osName": "Android",
														"LoginId": ID,
														"userType": localStorage.getItem('userType')
													},
													"body": {
														"MachineID": "3303a03ea0e97f0d",
														"ServerIP": "155.223.53.156",
														"ClientIP": "192.168.84.196"
													}
												}
												this.authService.logout(obj, tokenValue).subscribe((response) => {
													if (response['body']['status'] === 0) {
														this.storage.clear();
														window.localStorage.clear();
														indexedDB.deleteDatabase('_ionicstorage');
														// this.authService.deleteAllCookies();
														if (window.location.hostname == 'localhost') {
															this.cookieService.deleteAll();
														} else {
															this.cookieService.deleteAll('/', '.indiainfoline.com');
														}
														this.toast.displayToast('Logout successful');
														// this.loading = false;
														this.router.navigate(['/login']);
														// this.navCtrl.navigateRoot('/login');
													}
												})
											})
										})
									} else {
										this.toast.displayToast('Logout successful');
										this.commonService.analyticEvent('Logout', 'Logout');
										// document.cookie = "WZRK_S_" + environment.clevertap_Key + "=" + "; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
										this.storage.clear();
										window.localStorage.clear();
										indexedDB.deleteDatabase('_ionicstorage');
										// this.authService.deleteAllCookies();
										if (window.location.hostname == 'localhost') {
											this.cookieService.deleteAll();
										} else {
											this.cookieService.deleteAll('/', '.indiainfoline.com');
										}
										// this.loading = false;
										this.router.navigate(['/login']);
										// this.navCtrl.navigateRoot('/login');
									}
								},
									error => {
										console.log(error, 'error');

									})
							})
						} else {
							const boData = {
								"EmployeeId": "",
								"Password": "",
								"AppName": "",
								"MachinId": "",
								"MacAdd": ""
							};
							this.http.post<any>(`${this.backOfficeLogout.url}`, boData, { headers: new HttpHeaders(Object.assign(obj)) }).subscribe(res => {
								this.toast.displayToast('Logout successful');
								// document.cookie = "WZRK_S_" + environment.clevertap_Key + "=" + "; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
								this.storage.clear();
								window.localStorage.clear();
								indexedDB.deleteDatabase('_ionicstorage');
								if (window.location.hostname == 'localhost') {
									this.cookieService.deleteAll();
								} else {
									this.cookieService.deleteAll('/', '.indiainfoline.com');
								}
								// this.authService.deleteAllCookies();
								// this.loading = false;
								this.router.navigate(['/login']);
							})
						}
					}
				}
			]
		});

		await alert.present();
	}

	async editIPDetails(){
	const modal = await this.modalController.create({
			component: IPDetailsComponent,
			componentProps: { },
			cssClass: 'superstars edit-ip-details'
		});
		return await modal.present();
	}

	public goBack() {
		window.history.back();
	}

	ngOnDestroy(): void {
		if(this.modal){
			this.modal = this.modal.unsubscribe();
		}
		if(this.subscription){
			this.subscription = this.subscription.unsubscribe();
		}
	}

}
