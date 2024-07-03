import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { LoginService } from './guest-login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { CodeInputComponent } from 'angular-code-input';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../environments/environment';
import { ToasterService } from '../../../helpers/toaster.service';
import { CustomEncryption } from '../../../../config/custom-encrypt';
import { AuthenticationService } from '../../../helpers/authentication.service';
import { URLS } from '../../../../config/api.config';
import moment from 'moment';
import { CommonService } from '../../../helpers/common.service';
import { StorageServiceAAA } from '../../../helpers/aaa-storage.service';
import { SessionExpiredComponent } from '../../../components/session-expired/session-expired.component';
import { ForgotPasswordDesktopComponent } from '../../../components/forgot-password-desktop/forgot-password-desktop.component';
import { ForgotPasswordMobileComponent } from '../../../components/forgot-password-mobile/forgot-password-mobile.component';
declare var clevertap: any;
declare var SMSReceive: any;
@Component({
	selector: 'app-guest-login',
	providers: [LoginService, ToasterService, CustomEncryption, AuthenticationService, CookieService],
	templateUrl: './guest-login.page.html',
	styleUrls: ['./guest-login.page.scss'],
})
export class GuestLoginPage implements OnInit, OnDestroy {
	@ViewChild('codeInput') codeInput !: CodeInputComponent;
	@ViewChild('loginNameField') loginNameField: any;
	@ViewChild('ngConOtp', { static: false }) ngConOtp: any;

	loader = false;
	displayLoginCredential: boolean = false;

	isFocusUser: boolean = false;
	isFocusPassword: boolean = false;
	isShowRMlogin = false;

	public userType: any = null;
	public userChannel: any = null;

	public userErrorMsg: any = null;

	public passwordChangeFlag: any = null;

	public swarajCookie: any = null;
	public bckOfficeCookie: any = null;
	public fpCookie: any = null;
	public subbrokerCookie: any = null;
	public showLoader: any = false;

	public RMLoginURL = URLS.request3;
	public SBLoginURL = URLS.subBroker;

	// password visibility toggle
	public passwordVisible = false;

	public setPinVisibility: boolean = false;
	public confirmPinVisibility: boolean = false;
	public loginPinVisibility: boolean = true;

	// recently Added Variable (9/12/2021)
	UserIdFieldValidation: boolean = false;
	UserIdFieldError?: any;	//string;
	loginType?: number;

	isNextClicked = false;

	public version = environment['mobile_app_version'];
	otpData: any[] = [
		{}, {}, {}, {}, {}, {}
	]
	setPinData: any[] = [
		{}, {}, {}, {}
	]
	pinData: any[] = [
		{ value: null }, { value: null }, { value: null }, { value: null }
	]
	intialFocus: number = 0;
	isScreenLock: boolean = false;
	firstTimeLogin: boolean = true;
	optStatus: boolean = false;
	multipleIds: boolean = false;
	multipleClientCode: boolean = false;
	setPinStatus: boolean = false;
	reLogin: boolean = false;
	successfulLogin: boolean = false;
	subscribeOtp: Subscription | undefined;
	//resendOpt: boolean = false;
	resendTimer: any = "01:30";
	keyboardActiveIndex: number = 0;
	isValidSubmit: boolean = false;
	// form instance
	public validateForm!: FormGroup;
	flagValidUser: boolean = false;
	otpMsgDisplay?: string;
	// preparing validation message for form field
	clip_infl: boolean = false;
	multipleClientList: any = [];
	public validation_messages = {
		userID: [
			{ type: 'required', message: "Please enter mobile no." },
		]
	};
	public userTypeTitle: string = "Mobile No."
	public keyboardValue: any[] = [
		{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }, { value: 6 }, { value: 7 },
		{ value: 8 }, { value: 9 }, { value: '' }, { value: 0 }, { value: 'x' },
	]

	public datePipe = new DatePipe('en-US');

	userValidity: boolean = false;
	userID1: any = null;
	userName: any = null;
	profileDetails1: any;
	alreadySetMpin: boolean = false;
	receivedOtp: string = '';
	otpInput: any;
	setPinInput: any;
	confirmPinInput: any;
	loginPinInput: any;
	// otpLength:any;
	// loginPinLength:any;
	submitOtpBtn: boolean = false;
	confirmPinFocus?: number;
	submitLogin: boolean = false;
	private gatewaySubscriptionKey = environment['gatewaySubscriptionKey'];

	public subscription = new Subscription();
	mobileSetPin: boolean = false;
	mobileConSetPin: boolean = false;
	// time: number = 0;
	//   display ;
	//   interval;

	public appID = null;

	public verifiedData = null;
	clientCodeList: any[] = [];
	previousUrl: any;

	clientCodeChanges: boolean = false
	selectClientCodeValue: any;
	isInfluencerActive: boolean = false;
	isLoader = false;
	isApp: boolean = false;
	subscribeNextOtpTimer!: Subscription;
	nextOtpTimer: number = 0;

	constructor(
		public serviceFile: LoginService,
		private fb: FormBuilder,
		public modalController: ModalController,
		private toast: ToasterService,
 		private router: Router,
 		private storage: StorageServiceAAA,
 		public alertController: AlertController,
 		private commonService: CommonService,
 		private platform: Platform,
		private ciphetText: CustomEncryption,
		public faio: FingerprintAIO
 	) {
		this.platform.backButton.subscribeWithPriority(10, () => {
			if (window.location.pathname == '/login') {
				this.showExitConfirm();
			}

		})

	}

	ngOnInit() {
		if(this.commonService.isApp()) this.isApp = true;
		this.validateForm = this.fb.group({
			userID: [null, {
				validators: Validators.compose([Validators.required])
			}],
		});
	}

	// set pin visibility when click icons
	pinVisibility() {
		this.setPinVisibility = !this.setPinVisibility;
	}

	// confrim set pin visibility when click icons
	passwordVisibility() {
		this.confirmPinVisibility = !this.confirmPinVisibility;
	}

	// login pin visibility when click icons
	loginVisibility() {
		this.loginPinVisibility = !this.loginPinVisibility;
	}

	otpController(event: any, next: any, prev: any, index?: any) {
		let alphabet = /[a-zA-Z]/

		// if(!alphabet.test(event.target.value)){
		// console.log(event.target.value);
		if (index == 6) {
			console.log("submit")
		}
		if (event.target.value.length < 1 && prev) {
			prev.setFocus()
		}
		else if (next && event.target.value.length > 0) {
			next.setFocus();
		}
		else {
			return 0;
		}
		return;

	}

	changeClientCode(event: any) {
		this.clientCodeChanges = true;
		this.selectClientCodeValue = event
	}

	showExitConfirm() {
		this.alertController.create({
			message: 'Do you want to close the app?',
			backdropDismiss: false,
			buttons: [{
				text: 'Close',
				role: 'cancel',
				handler: () => {
					console.log('Application exit prevented!');
				}
			}, {
				text: 'Exit',
				handler: () => {
					(navigator as any)['app'].exitApp();
				}
			}]
		})
			.then(alert => {
				alert.present();
			});
	}

	checkValidation(event?: any, inputValue?: any) {
		this.UserIdFieldValidation = false;
		this.UserIdFieldError = null;

		const value = event !== null ? event.target.value : inputValue;
		const numericRegx = /^(\+\d{1,3}[- ]?)?\d{10}$/;
		if (numericRegx.test(value)) {
			this.UserIdFieldValidation = true;
			this.loginType = 1
			this.UserIdFieldError = null;
		}
		if (this.UserIdFieldValidation == false) {
			this.UserIdFieldError = "Please Enter the valid mobile no.";
			return;
		}
	}

	focusUser() {
		this.isFocusUser = true;
		this.flagValidUser = false;
	}

	focusOutUser(event: any) {
		this.isFocusUser = false;
		console.log('focus out')
		if (event.target.value !== null && event.target.value !== '') {
			// this.checkUser(event.target.value);
		}
	}

	focusUser1() {
		this.isFocusUser = true;
		this.flagValidUser = false;
	}

	focusOutUser1(event?: any) {
		this.isFocusUser = false;
		this.next();
	}

	focusPassword() {
		this.isFocusPassword = true;
	}

	focusOutPassword() {
		this.isFocusPassword = false;
	}
	// OTP Input field change
	onOtpChanged(event: any) {
		this.otpInput = event;
		// console.log(event.length);
		if (event.length < 6) {
			this.submitOtpBtn = false;
		}
	}

	//call on last OTP Type
	onotpFieldCompleted(event: any) {
		if (this.platform.is('mobile')) {

			console.log('event trigger')
			setTimeout(() => {
				this.submitOtp()
			}, 500);
		}

		this.submitOtpBtn = true;
	}

	// Set pin Input field change
	onSetPinChanged(event: any) {
		this.setPinInput = event;
	}

	transform(value: number): string {
		const minutes: number = Math.floor(value / 60);
		return (minutes < 10 ? '0' + minutes : minutes) + ':' + ((value - minutes * 60) < 10 ? '0' + (value - minutes * 60) : (value - minutes * 60))
	}
	start() {
		SMSReceive.startWatch(
			() => {
				document.addEventListener('onSMSArrive', (e: any) => {
					var IncomingSMS = e.data;
					this.processSMS(IncomingSMS);
				});
			},
			() => { console.log('watch start failed') }
		)
	}

	stop() {
		SMSReceive.stopWatch(
			() => { console.log('watch stopped') },
			() => { console.log('watch stop failed') }
		)
	}


	processSMS(data: any) {
		// Check SMS for a specific string sequence to identify it is you SMS
		// Design your SMS in a way so you can identify the OTP quickly i.e. first 6 letters
		// In this case, I am keeping the first 6 letters as OTP
		const message = data.body;
		if (message) {
			this.receivedOtp = this.getOtpFromMsg(data.body);
			this.otpInput = this.receivedOtp;

			this.stop();
			// console.log(this.receivedOtp);
			setTimeout(() => {
				this.submitOtp();
			}, 2000);
		}
	}

	//otp from msg in mobile
	getOtpFromMsg(str: any) {
		let match = str.match(/\b\d{6}\b/)
		return match && match[0]
	}

	// first time login on submit
	next(clicked?: any) {
		if ((this.validateForm.controls['userID']['value'] === null || this.validateForm.controls['userID']['value'] === '') || this.UserIdFieldError) {
			this.UserIdFieldError = "Please Enter the valid mobile no.";
			return;
		};
		localStorage.removeItem("GuestMobileNumber");
		// start timer
		if(this.nextOtpTimer == 0){
			this.guestNextOtpTimerStart();
		} else {
			this.toast.displayToast(`Please wait for ${this.transform(60 - this.nextOtpTimer)} seconds`);
			return;
		}
		this.loader = true;
		this.otpInput = null;
		this.isNextClicked = clicked;
		let checkSumData = this.ciphetText.encryptGuestLoginChecksum(this.validateForm.controls['userID']['value'] + '_' + moment().format('DDMMYYYY') + '_' + 'GuestOTP');
		this.subscription.add(
			this.serviceFile
				.generateGuestOtp(this.validateForm.controls['userID']['value'] ? this.validateForm.controls['userID']['value'] : '', checkSumData)
				.subscribe((res: any) => {
					if (res && res['Body'] && res['Head']['ErrorCode'] == 0) {
						let checkSumStr = this.ciphetText.decryptGuestLoginChecksum(res['Body']['Checksum'], res['Body']['CheckSumKey']);
						if (checkSumStr.includes('Success')) {
							localStorage.setItem("GuestMobileNumber", this.validateForm.controls['userID']['value']);
							this.commonService.setClevertapEvent("Guest_MobileNumber_Entered", { 'Mobile Number': this.validateForm.controls['userID']['value'] });
							//this.commonService.triggerAppsflyerLogEvent('Guest_MobileNumber_Entered', { 'Mobile Number': this.validateForm.controls['userID']['value'] });
							this.loader = false;
							this.optStatus = true;
							this.firstTimeLogin = false;
							this.otpMsgDisplay = res['Body']['Msg'];
							this.subscribeOtp = interval(1000).subscribe(res => {
								this.resendTimer = this.transform(90 - res);
								if (res === 90) {
									this.subscribeOtp?.unsubscribe();
									this.resendTimer = null
								}
							});
						} else if (checkSumStr.includes('Fail')) {
							this.loader = false;
							this.firstTimeLogin = true;
							this.optStatus = false;
							this.validateForm.reset();
							this.toast.displayToast(res?.['Body']?.['Msg'] ? res?.['Body']?.['Msg'] : res['Head']['ErrorDescription']);
						}
					}
					else {
						if (res['Head']['ErrorDescription'].includes('Mobile Number is already exist with')) {
							this.UserIdFieldError = '';
						}
						this.toast.displayToast(res['Head']['ErrorDescription']);
						this.loader = false;
						this.firstTimeLogin = true;
						this.optStatus = false;
						this.validateForm.controls['userID'].setValue(null);
						this.validateForm.reset();
					}
				},
					error => {
						if (error.error && error.error.error && error.error.error.message && error.error.error.message.includes('Rate limit exceeded. Try again in 1 minute.')) {
							this.toast.displayToast('Please try again after one minute.');
						}
						this.loader = false;
						this.firstTimeLogin = true;
						this.optStatus = false;
						this.validateForm.controls['userID'].setValue(null);
						this.validateForm.reset();
					},
				)
		)
	}

	forgotPin() {
		// this.falseAll();
		// this.firstTimeLogin = true;
		localStorage.setItem('forgetPswFlag', "true");
		this.userValidity = true;
		this.next();
		this.clearPin();
		this.otpInput = null;
	}

	// on opt submit 
	submitOtp() {
		this.loader = true;
		this.subscribeOtp?.unsubscribe();
		this.resendTimer = null;
		let checkSumObj = this.ciphetText.encryptGuestLoginChecksum(this.validateForm.controls['userID']['value'] + '_' + moment().format('DDMMYYYY') + '_' + 'ValidateOTP');
		this.subscription.add(
			this.serviceFile
				.validateGuestOtp(this.validateForm.controls['userID']['value'] ? this.validateForm.controls['userID']['value'] : '', this.otpInput, checkSumObj)
				.subscribe((response: any) => {
					if (response && response['Body'] && response['Head']['ErrorCode'] == 0) {
						let checkSumString = this.ciphetText.decryptGuestLoginChecksum(response['Body']['Checksum'], response['Body']['CheckSumKey']);
						if (checkSumString.includes('Success')) {
							this.commonService.setClevertapEvent("Guest_OTP_Validated", { 'Mobile Number': localStorage.getItem("GuestMobileNumber") });
							//this.commonService.triggerAppsflyerLogEvent('Guest_OTP_Validated', { 'Mobile Number': localStorage.getItem("GuestMobileNumber") });
							this.toast.displayToast(response['Body']['Msg']);
							this.firstTimeLogin = false;
							this.falseAll();
							this.loader = false;
							setTimeout(() => {
								this.successfulLogin = true;
								this.router.navigate(['/guest/guest-dashboard']);
							}, 1500);
						} else if (checkSumString.includes('Fail')) {
							this.toast.displayToast(response['Body']['Msg']);
							this.falseAll();
							this.loader = false;
							this.firstTimeLogin = true;
							this.resetOtpClick(true);
							this.validateForm.reset();
						}
					} else {
						this.toast.displayToast(response?.['Body']?.['Msg'] ? response?.['Body']?.['Msg'] : response['Head']['ErrorDescription']);
						this.falseAll();
						this.loader = false;
						this.firstTimeLogin = true;
						this.resetOtpClick(true);
						this.validateForm.reset();
					}
				})
		)
	}

	async goBackScreen() {
		const alert = await this.alertController.create({
			cssClass: 'my-custom-class',
			header: '',
			message: 'Are you sure you want to exit',
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					cssClass: 'secondary',
					handler: () => {
						console.log('Confirm Cancel');
					}
				}, {
					text: 'Ok',
					handler: () => {
						if (localStorage.getItem('setPinValue') == 'true') {
							this.falseAll();
							this.reLogin = true;
						}
						if (this.clip_infl) {
							this.storage.remove('infl');
							this.clip_infl = false;
							this.userTypeTitle = "Mobile No."
							this.validation_messages['userID'][0]['message'] = "Please enter mobile no.";
							this.falseAll();
							this.firstTimeLogin = true;
							this.validateForm.reset();

						}
						else {
							this.subscribeOtp?.unsubscribe();
							localStorage.clear();
							this.storage.clear();
							this.resendTimer = null;
							this.falseAll();
							this.reLogin = false;
							this.firstTimeLogin = true;
							this.userValidity = false;
							this.validateForm.reset();
							// console.log('Confirm Ok');
						}

					}
				}
			]
		});

		await alert.present();
	}

	skip() {
		this.storage.set('deviceLock', false);
	}

	async switchAccount() {
		const alert = await this.alertController.create({
			cssClass: 'my-custom-class',
			header: 'Switch Account',
			message: 'Are you sure you want to login using another account?',
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					cssClass: 'secondary',
					handler: () => {
						console.log('Confirm Cancel');
					}
				}, {
					text: 'Ok',
					handler: () => {
						localStorage.removeItem('setPinValue');
						localStorage.removeItem('userId1');
						localStorage.removeItem('userName');
						localStorage.removeItem('forgetPswFlag');
						localStorage.removeItem('appID');
						this.storage.clear();
						this.userValidity = false;
						this.firstTimeLogin = true;
						// this.validateForm.controls['userID'].patchValue(null);
						this.reLogin = false;
						this.flagValidUser = false;
						this.validateForm.reset();
						this.clearPin();
						// console.log('Confirm Ok');
					}
				}
			]
		});

		await alert.present();
	}



	// false all status
	falseAll() {
		this.firstTimeLogin = false;
		this.optStatus = false;
		this.multipleIds = false;
		this.setPinStatus = false;
		this.successfulLogin = false;
	}

	resetOtpClick(firstPage?:any) {
		this.commonService.setClevertapEvent("Guest_ResendOTP_Clicked", { 'Mobile Number': localStorage.getItem("GuestMobileNumber") });
		//this.commonService.triggerAppsflyerLogEvent('Guest_ResendOTP_Clicked', { 'Mobile Number': localStorage.getItem("GuestMobileNumber") });
		if (this.resendTimer == null) {
			this.subscribeOtp?.unsubscribe();
			this.resendTimer = "01:30";
			if (this.platform.is('mobile')) {
				this.otpInput = null;
			}
			this.submitOtpBtn = false;
			this.codeInput.reset();
			if(!firstPage){
				this.next();
			}
		}
	}

	// back from opt screen to first screen
	backFromOtop() {
		this.subscribeOtp?.unsubscribe();
		localStorage.clear();
		this.storage.clear();
		this.resendTimer = null;
		this.falseAll();
		this.reLogin = false;
		this.firstTimeLogin = true;
		this.userValidity = false;
		this.validateForm.reset();
		this.codeInput.reset();
		//this.resendOpt = false;
	}

	//  submit partner id
	nextFromPartner() {
		this.falseAll();
		this.setPinStatus = true;
	}

	// back from set pin screen to otp screen
	backFromSetPin() {
		this.falseAll();
		this.optStatus = true;
		setTimeout(() => {
			this.optStatus = false;
		}, 200);
	}

	ionViewWillEnter() {
		this.showLoader = false;
		this.loader = false;
		this.firstTimeLogin = true;
		this.successfulLogin = false;
		this.nextOtpTimer = 0;
		if(this.validateForm && this.validateForm.controls && this.validateForm.controls['userID']){
			this.validateForm.controls['userID'].setValue(null);
			this.validateForm.reset();
		}
		let guestMobile = localStorage.getItem("GuestMobileNumber");
		if(guestMobile) this.validateForm.controls['userID'].setValue(guestMobile);
	}

	// call forgot password mobile screen
	async forgotPasswordMobile() {
		const modal = await this.modalController.create({
			component: ForgotPasswordMobileComponent,
			cssClass: 'forgot-password-popup-mobile',
			componentProps: {}
		});
		return await modal.present();
	}

	// call session expired popup
	async sessionExpired() {
		const modal = await this.modalController.create({
			component: SessionExpiredComponent,
			backdropDismiss: false,
			cssClass: 'forgot-password-popup-mobile session-expired',
			componentProps: {}
		});
		return await modal.present();
	}

	// navitate with link
	navigateLink(link?: any) {
		this.commonService.analyticEvent('Login_Screen_Know_More', 'Know More');
		window.open(link, '_blank');
	}

	// call forgot password desktop screen
	async forgotPasswordDesktop() {
		const modal = await this.modalController.create({
			component: ForgotPasswordDesktopComponent,
			cssClass: 'forgot-password-popup-desktop',
			componentProps: {}
		});
		return await modal.present();
	}

	// convenience getter for easy access to form fields
	get formFields() { return this.validateForm.controls; }

	/**
	 * @param redirectFor accepts param to either redirect for new user or for support
	 */
	public redirectTo(redirectFor: any) {
		if (redirectFor === 'register') {
			this.commonService.setClevertapEvent('Guest_Onboarding_Clicked', 'New Registration');
			//this.commonService.triggerAppsflyerLogEvent('Guest_Onboarding_Clicked', 'New Registration');
			window.open('https://epartner.iifl.com/Referral');
		} else if (redirectFor === 'support') {
			this.commonService.analyticEvent('Login_Screen_Help', 'Help Screen');
			window.open('https://iiflproducts.zohosites.in/faq-app-support');
		}
	}

	public OpenWindowWithPost(url: any, name: any, params: any) {
		var form = document.createElement("form") as HTMLFormElement;
		form.setAttribute("method", "post");
		form.setAttribute("action", url);
		form.setAttribute("target", name);

		if (params) {
			for (var i in params) {
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

	}

	async keyDownFunction(event: any) {
		if (event.keyCode === 13) {
			if (this.validateForm.controls['userID']['value'] === '' || this.validateForm.controls['userID']['value'] === null) return;
			await this.checkValidation(null, this.validateForm.controls['userID']['value']);
			if (this.UserIdFieldValidation && !this.clip_infl) this.next(true);
		}
	}

	ionViewWillLeave() {
		this.showLoader = false;
		this.subscribeNextOtpTimer?.unsubscribe();
		/*Logic for after logout if user clicks browser back button */
		// if (+this.passwordChangeFlag !== 2) {
		// 	this.storage.get('token').then((token) => {
		// 		if (token) {
		// 			return true;
		// 		} else {
		// 			if (window.location.pathname == '/login') {
		// 				return true;
		// 			} else {
		// 				this.router.navigate(['/guest']);
		// 				return false;
		// 			}
		// 		}
		// 	})
		// }

	}

	/**
	 * To clear previous pin data
	 */
	clearPin() {
		this.keyboardActiveIndex = 0;
		this.loginPinInput = undefined
		this.pinData = [
			{ value: null }, { value: null }, { value: null }, { value: null }
		]
	}
	existingLogin() {
		if(this.nextOtpTimer != 0 && this.commonService.isApp()){
			this.toast.displayToast(`Please wait for ${this.transform(60 - this.nextOtpTimer)} seconds`);
			return;
		}
		this.router.navigate(['/login']);
	}

	guestNextOtpTimerStart = () => {

		this.subscribeNextOtpTimer = interval(1000).subscribe(res => {
			this.nextOtpTimer = res;
			if (res === 60) {
				this.subscribeNextOtpTimer?.unsubscribe();
				this.nextOtpTimer = 0;
			}
		});
	}

	ngOnDestroy(): void {
		if (this.subscription) {
			this.subscription.unsubscribe();
			this.subscribeNextOtpTimer?.unsubscribe();
		}
	}
}