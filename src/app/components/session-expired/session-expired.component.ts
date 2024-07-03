import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from '../../pages/login/login.service';
import { ToasterService } from '../../helpers/toaster.service';
import { CustomEncryption } from '../../../config/custom-encrypt';
import { AuthenticationService } from '../../helpers/authentication.service';
import { URLS } from '../../../config/api.config';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { AgreeComponent } from '../agree/agree.component';
import { environment } from '../../../environments/environment';


@Component({
	selector: 'app-session-expired',
	providers: [ LoginService, ToasterService, CustomEncryption, AuthenticationService ],
	templateUrl: './session-expired.component.html',
	styleUrls: ['./session-expired.component.scss'],
})
export class SessionExpiredComponent implements OnInit {
	@Input() userType: any;
	isFocusUser: boolean = false;
	isFocusPassword: boolean = false;

	firstForm: boolean = true;
	secondForm: boolean = false;

	passwordVisible: boolean = false;
	public passwordChangeFlag: any = null;

	public swarajCookie: any = null;
	public bckOfficeCookie: any = null;
	public fpCookie: any = null;
	public subbrokerCookie: any = null;

	public RMLoginURL = URLS.request3;
	public SBLoginURL = URLS.subBroker;
	private gatewaySubscriptionKey = environment['gatewaySubscriptionKey'];
	public userID: any = null;
	// public userType = null;
	public password: any = null;

	private subscription: any;

	public showLoader = false;

	constructor(public modalController: ModalController, private storage: StorageServiceAAA,
		private toast: ToasterService,
		private ciphetText: CustomEncryption,
		private router: Router,
		private authService: AuthenticationService,
		private serviceFile: LoginService
	) { }

	ngOnInit() {
		this.storage.get('userID').then((token) => {
			this.userID = token;
		})
		setTimeout(() => {
			this.storage.clear();
		}, 1000);
	}


	ngAfterViewInit() {
		setTimeout(() => {
			if (location.pathname === '/login') {
				this.modalController.dismiss();
				return;
			}
			if (this.userID === null || this.userID === undefined || this.userID === '') {
				this.modalController.dismiss();
				this.storage.clear();
				this.router.navigate(['/login']);
				return;
			}
		}, 100);
	}

	public inputChange(event: any) {
		this.userID = event.target.value;
	}

	public passwordChange(event: any) {
		this.password = event.target.value;
	}


	dismiss() {
		this.modalController.dismiss();
	}

	focusUser() {
		this.isFocusUser = true;
	}

	// focusOutUser(event: any) {		event never used
	focusOutUser() {
		this.isFocusUser = false;
		// this.checkUser(event.target.value);
	}

	focusPassword() {
		this.isFocusPassword = true;
	}

	focusOutPassword() {
		this.isFocusPassword = false;
	}

	public login() {
		if (this.password !== null && this.password !== '' && this.password !== undefined) {
			this.showLoader = true;
			if (this.userType === 'RM' || this.userType === 'FAN') {
				const pswd = this.ciphetText.aesEncrypt(this.password);
				const userID: any = this.userID;
	
				// this.storage.clear();
				localStorage.setItem('userID', userID);
				this.storage.set('userID', userID);
				localStorage.setItem('userType', this.userType);
				this.storage.set('userType', this.userType);
	
				const reqOneObj = {
					Password: pswd,
					LocalIP: "1.0.64.100",
					PublicIP: "100.64.0.1",
					HDSerialNumber: "",
					MACAddress: "AAAWeb",
					MachineID: "864115031173488",
					VersionNo: "1.0.22.0",
					RequestNo: 1,
					My2PIN: "",
					ConnectionType: "1"
				}
				// this.RMLoginRequest2();
				this.RMLoginRequest1(userID, reqOneObj);
			} else if (this.userType === 'SUB BROKER') {
				this.subBrokerLogin();
			}
		} else {
			this.toast.displayToast('Password cannot be empty');
		}
	}

	public RMLoginRequest1(userID: any, reqOneObj: any) {
		this.subscription = new Subscription();

		this.subscription.add(this.serviceFile.
			requestOne(userID, reqOneObj).
			subscribe((response: any) => {
				const responseBody = response['body'];
				// this.getHoldingData();
				this.swarajCookie = responseBody['Cookie'].split(';')[0];
				if (responseBody['status'] === 0) {
					const responseData = responseBody;
					this.passwordChangeFlag = responseData['PasswordChangeFlag'];

					if (+this.passwordChangeFlag === 2) {
						this.toast.displayToast(responseData['PasswordChangeMessage']);
						this.storage.set('subToken', this.swarajCookie);
						this.router.navigate(['/change-password']);
					} else {
						const pswd = this.ciphetText.aesEncrypt(this.password);
						const userID = this.ciphetText.aesEncrypt(this.userID);
						const obj = {
							"LoginID": userID,
							"Password": pswd,
							"Longitude": "72.8590416",
							"Latitude": "21.2354352",
							"IMEI": "864115031173488",
							// "MacAdd": "7c:46:85:53:e6:f3",
							"MacAdd": "AAAWeb",
							"DOB": ""
						}
						this.RMLoginRequest2(obj);
					}
				} else {
					this.showLoader = false;
					this.toast.displayToast(responseBody['Msg']);
				}

			}))

	}

	public RMLoginRequest2(obj: any) {
		this.subscription = new Subscription();

		this.subscription.add(this.serviceFile.
			requestTwo(obj).
			subscribe((response: any) => {
				if (response['Body']['Status'] === 0) {
					const responseData = response['Body'];
					const cookieValue = response['Body']['Cookie'].split(';');

					for (var i =0; i< cookieValue.length; i++) {
						if (cookieValue[i].indexOf('ASPXAUTH') > -1 ) {
							const authValue = cookieValue[i];
							this.bckOfficeCookie = '.'+authValue.split('.')[1];
							// console.log(authValue,this.bckOfficeCookie);
							
						}
					
					}
					// const cookieValue = res['Body']['Cookie'].split(';')[3];
					// this.subbrokerCookie = '.'+cookieValue.split('.')[1];
					this.storage.set('subToken', this.subbrokerCookie);
					// this.bckOfficeCookie = '.'+cookieValue.split('.')[1];
					this.storage.set('bToken', this.bckOfficeCookie);
					if (responseData['IsAgreed'].toLowerCase() === 'yes') {
						this.RMLoginRequest3();
					} else {
						this.isAgree();
						// this.makeAgree('RM');
					}
				} else {
					this.showLoader = false;
					this.toast.displayToast(response['body']['Msg']);
				}

			}))

	}

	// call agree popup
	async isAgree() {
		const modal = await this.modalController.create({
			component: AgreeComponent,
			backdropDismiss: false,
			cssClass: 'agree',
			componentProps: {}
		});

		modal.onDidDismiss().then( (data) => {
			this.makeAgree('RM');
		})
		return await modal.present();
	}

	/**
	 * @param type accepts whether to agree for RM-FAN or Sub-Broker
	 */
	public makeAgree(type: any) {

		this.storage.get('bToken').then( token => {
			const params = {
				"ClientCode": this.userID,
				"IMEI": "864115031173488",
				"MacAdd": "AAAWeb",
				// "MacAdd": "7c:46:85:53:e6:f3"
			}
	
			this.subscription = new Subscription();
	
			this.subscription.add(
				this.serviceFile.
					getAgree(params, token ? token : this.bckOfficeCookie).
					subscribe((response: any) => {
						if (response['Body']['Status'] === 0) {
							if (type === 'RM') {
								this.RMLoginRequest3();
							} else if (type === 'broker') {
								this.subBrokerMapping();
							}
						}
					})
			)
		})
	}

	/**
	 * RMLoginRequest3 FINAL LOGIN REQUEST FOR RM and FAN user
	 */
	public RMLoginRequest3() {
		const params = {
			head: {
				requestCode: "FP001CLG",
				key: this.RMLoginURL.key,
				appVer: "1.0.22.0",
				appName: "Miles",
				LoginId: this.ciphetText.aesEncrypt(this.userID)
			},
			body: {
				loginId: this.ciphetText.aesEncrypt(this.userID),
				Password: this.ciphetText.aesEncrypt(this.password),
				ClientIP: "",
				AuthInfo: "",
				AppName: "AAA",
				ClientType: "Dealer",
				DOB: ""
			}
		}
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa
		}
		this.authService.login(this.RMLoginURL.url, params, obj)
			.subscribe((res) => {
				if (res && res['body'] && res['body']['status'] === 0) {
					this.storage.set('userID', this.userID);
					this.storage.set('userType', this.userType);
					localStorage.setItem('userID', this.userID);
					localStorage.setItem('userType', this.userType);

					this.fpCookie = res['body']['Cookie'].split(';')[0];
					// this.storage.clear();
					this.storage.set('sToken', this.swarajCookie);
					this.storage.set('bToken', this.bckOfficeCookie);
					this.storage.set('fpToken', this.fpCookie);
					localStorage.setItem('loginTime', JSON.stringify(new Date()));
					this.storage.set('loginTime', new Date());
					this.showLoader = false;
					this.dismiss();
					// this.storage.set('loginTime', 'Mon Nov 09 2020 20:16:52 GMT+0530 (India Standard Time)');
					setTimeout(() => {
						this.getMappingRM(this.swarajCookie);
					}, 200);
					
					setTimeout(() => {
						this.getRMProfileDetails(this.bckOfficeCookie);
						// this.router.navigate(['/markets']);
						this.router.navigate(['/dashboard']);
					}, 500);
					this.toast.displayToast('Logged in successfully!');
					// this.validateForm.reset();
				} else {
					this.showLoader = false;
					this.toast.displayToast(res['head']['statusDescription']);
				}

				//     // loading status
				//     // this.isLoadingOne = false;
			},
				error => {
					//     // print the error to console
					console.error(error);
				});
	}

	public subBrokerLogin() {
		const params = {
			head: {
				RequestCode: "MFRQLO01",
				Key: this.SBLoginURL.key,
				AppName: "AAA",
				AppVer: "1.0.4.0",
				OsName: "Android"
			},
			body: {
				EmployeeId: this.ciphetText.aesEncrypt(this.userID),
				Password: this.ciphetText.aesEncrypt(this.password),
				AppName: "AAA",
				MachinId: "",
				// MacAdd: "sws66ss",
				"MacAdd": "AAAWeb",
				IMEI: "6544521454",
				Longitude: "172.8697929",
				Latitude: "119.1182604"
			}
		}
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa
		}
		this.authService.login(this.SBLoginURL.url, params, obj)
			.subscribe(
				res => {
					if (res && res['Head'] && +res['Head']['ErrorCode'] === 0 && res && res['Body'] && +res['Body']['Status'] === 0) {
						// if (res['Body']['IsAgreed'].toLowerCase() === 'yes') {
							this.storage.set('userID', this.userID);
							this.storage.set('userType', this.userType);
							localStorage.setItem('userID', this.userID);
							localStorage.setItem('userType', this.userType);

							const cookieValue = res['Body']['Cookie'].split(';');
							// let cookieValue = null;
							for (var i =0; i< cookieValue.length; i++) {
								if (cookieValue[i].indexOf('ASPXAUTH') > -1 ) {
									const authValue = cookieValue[i];
									this.subbrokerCookie = '.'+authValue.split('.')[1];
								}
							
							}
							// const cookieValue = res['Body']['Cookie'].split(';')[3];
							// this.subbrokerCookie = '.'+cookieValue.split('.')[1];
							this.storage.set('subToken', this.subbrokerCookie);
							this.storage.set('bToken', this.bckOfficeCookie);
							this.storage.set('loginTime', new Date());
							this.subBrokerMapping(this.subbrokerCookie);
							this.showLoader = false;
							this.dismiss();
							// location.reload();

							// this.storage.clear();
							setTimeout(() => {
								this.router.navigate(['/dashboard']);
							}, 500);
							this.toast.displayToast('Logged in successfully!');
							// this.validateForm.reset();
						// } else {
						// 	this.makeAgree('broker');
						// }
					} else {
						this.showLoader = false;
						this.toast.displayToast(res['message'] ? res['message'] : res['Head']['ErrorDescription']);
					}

					//     // loading status
					//     // this.isLoadingOne = false;
				},
				error => {

					//     // loading status
					//     // this.isLoadingOne = false;

					//     // print the error to console
					//     console.error(error);
				});
	}

	public getRMProfileDetails(tokenValue?: any) {
		this.subscription = new Subscription();

		this.storage.get('bToken').then( (backOfficeToken) => {
			// console.log(backOfficeToken,tokenValue);
			
			this.storage.get('userID').then( code => {
				const params = {
					UserCode: code,
					UserType: 1
				}
	
				this.subscription.add(
					this.serviceFile
					.getRMProfile(params,backOfficeToken ? backOfficeToken : tokenValue)
					.subscribe( (response: any) => {
						if (response['Head']['ErrorCode'] === 0) {
							const pDetails = response['Body'];
							this.storage.set('pDetails', pDetails);
						}
						// console.log(response);
						
					})
				)		
			})
		})
	}

	public getMappingRM(cookieValue: any) {

		this.storage.get('userID').then( (token) => {
			this.subscription = new Subscription();
			const params = {
				AdminCode: token
			}
			this.subscription.add(
				this.serviceFile
				.getRMMapping(params, token, cookieValue)
				.subscribe( (response: any) => {
					if(response['body'].status == 0){
						this.storage.set('mappingDetails', response['body'].details);
							//console.log(response);
					}
				})
			)
		})
	}


	public subBrokerMapping(cookie?: any) {
		const params = {
			UserID: this.userID,
			Opt: "C"
		}

		this.subscription = new Subscription();
		
		this.subscription.add(
			this.serviceFile.
			getSubBrokerMap(params, cookie).
			subscribe( (response: any) => {
				this.storage.set('subBrokermapping', response['Body'].Clients);
						//console.log(response);
				// console.log(response, 'map response');
				
			} )
		);
	}

}
