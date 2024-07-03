import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { Subscription, from, interval } from 'rxjs';
import { NewLoginService } from './new-login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController, NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
//import md5 from 'md5-hash'
import { DatePipe } from '@angular/common';
import { HTTP } from '@ionic-native/http/ngx';
import { finalize } from 'rxjs/operators';
// import * as crypto from 'crypto-js';
import { CleverTap } from '@ionic-native/clevertap/ngx';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { CodeInputComponent } from 'angular-code-input';
import { environment } from '../../../environments/environment';
import { URLS } from '../../../config/api.config';
import { CustomEncryption } from '../../../config/custom-encrypt';
import { SessionExpiredComponent } from '../../components/session-expired/session-expired.component';
import { AuthenticationService } from '../../helpers/authentication.service';
import { CommonService } from '../../helpers/common.service';
import { ToasterService } from '../../helpers/toaster.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { ForgotPasswordDesktopComponent } from '../../components/forgot-password-desktop/forgot-password-desktop.component';
import { ForgotPasswordMobileComponent } from '../../components/forgot-password-mobile/forgot-password-mobile.component';
import { AgreeComponent } from '../../components/agree/agree.component';

declare var clevertap: any;

declare var SMSReceive: any;

@Component({
	selector: 'app-new-login',
	providers: [NewLoginService, ToasterService, CustomEncryption, AuthenticationService],
	templateUrl: './new-login.page.html',
	styleUrls: ['./new-login.page.scss'],
})
export class NewLoginPage implements OnInit {
	@ViewChild('codeInput') codeInput !: CodeInputComponent;
	@ViewChild('loginNameField') loginNameField:any;
	// @ViewChild('ngOtpInput', { static: false}) ngOtpInput: any;
	// @ViewChild('ngSetOtp', { static: false}) ngSetOtp: any;
	@ViewChild('ngConOtp', { static: false }) ngConOtp: any;

	loader = false;

	isFocusUser: boolean = false;
	isFocusPassword: boolean = false;

	public userType: any = null;

	public userErrorMsg = null;

	public passwordChangeFlag: any = null;

	public swarajCookie: any = null;
	public bckOfficeCookie: any = null;
	public fpCookie: any = null;
	public subbrokerCookie: any = null;
	public showLoader: boolean = false;

	public RMLoginURL = URLS.request3;
	public SBLoginURL = URLS.subBroker;

	// password visibility toggle
	public passwordVisible = false;

	public setPinVisibility: boolean = false;
	public confirmPinVisibility: boolean = false;
	public loginPinVisibility: boolean = true;

	// recently Added Variable (9/12/2021)
	UserIdFieldValidation: boolean = false;
	UserIdFieldError?: string;
	loginType?: number;

	isNextClicked = false;

	private gatewaySubscriptionKey = environment['gatewaySubscriptionKey'];
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
	isMobileDevice = false;
	firstTimeLogin: boolean = true;
	optStatus: boolean = false;
	multipleIds: boolean = false;
	multipleClientCode:boolean = false;
	setPinStatus: boolean = false;
	reLogin: boolean = false;
	successfulLogin: boolean = false;
	subscribeOtp?: Subscription;
	//resendOpt: boolean = false;
	resendTimer: any = "01:30";
	keyboardActiveIndex: number = 0;
	isValidSubmit: boolean = false;
	// form instance
	public validateForm!: FormGroup;
	flagValidUser: boolean = false;
	otpMsgDisplay?: string;
	// preparing validation message for form field
	clip_infl:boolean = false;
	multipleClientList:any = [];
	public validation_messages = {
		userID: [
			{ type: 'required', message: "Please enter partner id"},
			{ type: 'customValidate', message: 'Invalid Char are not allowed' }
			// { type: 'email', message: 'Please enter valid email' },
			// { type: 'invalidAddress', message: 'Please enter valid email' }
		],
		// password: [
		// 	{ type: 'required', message: 'Please enter your password!' },
		// 	{ type: 'minlength', message: 'Your Password must be at least 8 characters long' },
		// 	{ type: 'maxlength', message: 'Your Password can not be more than 12 chracters' },
		// 	{ type: 'customValidate', message: 'Invalid Char are not allowed' }
		// 	// { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, one number and one special character' }
		// ],
		
	};
	public userTypeTitle:string = "Mobile No. /Email ID / Partner ID"
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


	private subscription = new Subscription();
	mobileSetPin: boolean = false;
	mobileConSetPin: boolean = false;
	// time: number = 0;
	//   display ;
	//   interval;

	public appID = null;

	public verifiedData = null;
	clientCodeList: any[] = [];
	partnerInfluencerSegValue: string = 'partners'
	partnerInfluencerData: any[] = [
		{name: 'Partners', value: 'partners'},
		{name: 'Influencers', value: 'influencers'}
	]
	clientCodeChanges:boolean = false
	selectClientCodeValue:any;
	isInfluencerActive:boolean = false;	
	constructor(
		public serviceFile: NewLoginService,
		private fb: FormBuilder,
		public modalController: ModalController,
		private toast: ToasterService,
		private ciphetText: CustomEncryption,
		private router: Router,
		private authService: AuthenticationService,
		private storage: StorageServiceAAA,
		private ngZone: NgZone,
		private navCtrl: NavController,
		public alertController: AlertController,
		private nativeHttp: HTTP,
		private commonService: CommonService,
		private mobClevertap: CleverTap,
		private platform: Platform,
		public faio: FingerprintAIO,
	) {
		// this.storage.clear();
		// console.log('constructor login');
		// this.platform.backButton.subscribeWithPriority(10, () => {
		// 	if(window.location.pathname == '/login'){
		// 		this.showExitConfirm();
		// 	}
				
		// })	
		
	}

	ngOnInit() {
		if (this.commonService.isApp()) {
			this.isMobileDevice = true;
		} else {
			this.isMobileDevice = false;
		}
		// form group instance
		// this.storage.clear();
		this.validateForm = this.fb.group({
			userID: [null, {
				validators: Validators.compose([Validators.required])
			}],
			// password: [null, {
			// 	validators: Validators.compose([
			// 		Validators.minLength(8),
			// 		Validators.maxLength(12),
			// 		Validators.required,
			// 		// Validators.pattern('^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$')
			// 	]),
			// }],
			// otp: ['',[Validators.required, 
			//     Validators.minLength(this.config.length)]],
			// otp1: [null, Validators.required],
			// otp2: [null, Validators.required],
			// otp3: [null, Validators.required],
			// otp4: [null, Validators.required],
			// otp5: [null, Validators.required],
			// otp6: [null, Validators.required],
			// setotp1: [null, Validators.required],
			// setotp2: [null, Validators.required],
			// setotp3: [null, Validators.required],
			// setotp4: [null, Validators.required],
			// conotp1: [null, Validators.required],
			// conotp2: [null, Validators.required],
			// conotp3: [null, Validators.required],
			// conotp4: [null, Validators.required],
			// loginPin1: [null, Validators.required],
			// loginPin2: [null, Validators.required],
			// loginPin3: [null, Validators.required],
			// loginPin4: [null, Validators.required]
		});


		// if (localStorage.getItem('setPinValue') == "true") {
		// 	this.alreadySetMpin = true;
		// 	this.userID1 = localStorage.getItem('userId1');
		// 	this.userName = localStorage.getItem('userName');
		// 	this.falseAll();
		// 	this.reLogin = true;
		// }

		/* this.storage.get('safetyLock').then( lock => {
			if (lock) {
			this.alreadySetMpin = true;
			this.userID1 = localStorage.getItem('userId1');
			this.userName = localStorage.getItem('userName');
			this.falseAll();
			// this.reLogin = true;
				this.fingerPrintAccess(lock,true);
			}
		}) */


	}

    // set pin visibility when click icons
    pinVisibility() {
        this.setPinVisibility = !this.setPinVisibility;
	}
	
	// changeBgImage(){
		
	// }

    // confrim set pin visibility when click icons
    passwordVisibility() {
        this.confirmPinVisibility = !this.confirmPinVisibility;
    }

    // login pin visibility when click icons
    loginVisibility() {
        this.loginPinVisibility = !this.loginPinVisibility;
	}
	
	segmentChanged(event: any){
		// console.log(event);
		localStorage.clear()
		this.storage.clear();
		this.falseAll();
		this.reLogin = false;
		this.firstTimeLogin = true;
		this.userValidity = false;
		this.validateForm?.reset();
		if(event == 'influencers'){
			this.commonService.analyticEvent('aaa_influencer', 'Influencer Tab');
			this.influncerLogin();
		}
		else{
			this.storage.remove('infl');
			this.clip_infl = false;
			this.userTypeTitle = "Mobile No. /Email ID / Partner ID"
			this.validation_messages['userID'][0]['message'] = "Please enter partner id";
			this.falseAll();
			this.firstTimeLogin = true;
			
		}
	}

	public useFingerPrint() {
		let fingerPrintAvail = this.faio.isAvailable();
		// console.log(fingerPrintAvail, 'fingerPrintAvail');
		this.faio.isAvailable()
			.then(result => {
				// console.log(result);
				if (result === "finger" || result === "face" || result === "biometric") {
					this.faio.show({
						title: 'Please verify to login',
						// clientSecret: 'password', //Only necessary for Android
						disableBackup: true,  //Only for Android(optional)
						fallbackButtonTitle: 'Use Pin', //Only for iOS
						// localizedReason: 'Please authenticate' //Only for iOS
					})
						.then((result1: any) => {
							// console.log(result1);
							if (result1 == 'biometric_success') {
								this.storage.set('safetyLock', this.loginPinInput);
								this.storage.set('deviceLock', true);
								// if (skipLogin) {
								// 	this.verifyCredential(data);
								// } 
								// else {
								// 	this.toast.displayToast('Quick Login has successfully Enabled.');
								// 	this.navigateToDashboard(this.verifiedData);
								// }
								//Quick Login has successfully Enabled.
							} else {
								this.storage.set('deviceLock', false);
							}
							// localStorage.setItem('fingerprintdata', result.withFingerprint);

							// console.log(localStorage.getItem('fingerprintdata'));
							//alert("Successfully Authenticated!")
						})
						.catch((error: any) => {
							// console.log(error);
							// this.toast.displayToast('Please enable the Fingerprint feature in your mobile');
							console.log('Please enable the Fingerprint/FaceID feature in your mobile ');

							//this.commonService.toastFuntion('Please enable the Fingerprint/FaceID feature in your mobile ');
							//alert("Match not found!")
						});
					// .then((result: any) => {
					//     console.log(result);
					//     localStorage.setItem('fingerprintdata', result.withFingerprint);

					// .catch((error: any) => {
					//     console.log(error);
					//     this.commonService.toastFuntion('Please enable the Fingerprint/FaceID feature in your mobile ');
					// });
				}
			}).catch(() => {
				// this.commonService.toastFuntion("Fingerprint/ FaceID authorization is not available on this device");
				console.log('Fingerprint/ FaceID authorization is not available on this device')
			});

	}

	public fingerPrintAccess(data?: any, skipLogin?: any) {
		let fingerPrintAvail = this.faio.isAvailable();
		// console.log(fingerPrintAvail, 'fingerPrintAvail');
		this.faio.isAvailable()
			.then(result => {
				// console.log(result);
				if (result === "finger" || result === "face" || result === "biometric") {
					this.faio.show({
						title: 'Please verify to login',
						// clientSecret: 'password', //Only necessary for Android
						disableBackup: true,  //Only for Android(optional)
						fallbackButtonTitle: 'Use Pin', //Only for iOS
						// localizedReason: 'Please authenticate' //Only for iOS
					})
						.then((result1: any) => {
							// console.log(result1);
							if (result1 == 'biometric_success') {
								this.storage.set('safetyLock', this.loginPinInput);
								this.storage.set('deviceLock', true);
								if (skipLogin) {
									this.verifyCredential(data);
								} else {
									this.toast.displayToast('Quick Login has successfully Enabled.');
									this.navigateToDashboard(this.verifiedData);
								}
								//Quick Login has successfully Enabled.
							} else {
								this.storage.set('deviceLock', false);
							}
							// localStorage.setItem('fingerprintdata', result.withFingerprint);

							// console.log(localStorage.getItem('fingerprintdata'));
							//alert("Successfully Authenticated!")
						})
						.catch((error: any) => {
							// console.log(error);
							// this.toast.displayToast('Please enable the Fingerprint feature in your mobile');
							console.log('Please enable the Fingerprint/FaceID feature in your mobile ');

							//this.commonService.toastFuntion('Please enable the Fingerprint/FaceID feature in your mobile ');
							//alert("Match not found!")
						});
					// .then((result: any) => {
					//     console.log(result);
					//     localStorage.setItem('fingerprintdata', result.withFingerprint);

					// .catch((error: any) => {
					//     console.log(error);
					//     this.commonService.toastFuntion('Please enable the Fingerprint/FaceID feature in your mobile ');
					// });
				}
			}).catch(() => {
				// this.commonService.toastFuntion("Fingerprint/ FaceID authorization is not available on this device");
				console.log('Fingerprint/ FaceID authorization is not available on this device')
			});

	}

	/* start() {
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


	  processSMS(data) {
		// Check SMS for a specific string sequence to identify it is you SMS
		// Design your SMS in a way so you can identify the OTP quickly i.e. first 6 letters
		// In this case, I am keeping the first 6 letters as OTP
		const message = data.body;
		if (message) {
			this.receivedOtp = data.body;
			this.otpInput = this.receivedOtp;

			this.stop();
			console.log(this.receivedOtp);
			setTimeout(() => {
				this.submitOtp();
			}, 2000);
			
			
		//   this.otp = data.body;
		//   this.ngOtpInput.setValue(this.otp);
		//   console.log(this.otp);
		 // this.OTPmessage = 'OTP received. Proceed to register'
		 // this.stop();
		}
	  } */




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

	changeClientCode(event: any){
		this.clientCodeChanges = true;
		this.selectClientCodeValue = event
	}

	proceedwithMultipleClient(){
		
		this.storage.get('Infltoken').then(Infltoken => {
			this.loader = true;
			this.serviceFile.InfluencerDetails(this.validateForm?.controls['userID']['value'], this.selectClientCodeValue, Infltoken).subscribe((response) => {
				this.loader = false;
				setTimeout(() => {
					window.location.href = environment['influencerUrl']['url']+"/dashboard?client_id="+this.selectClientCodeValue+'&token='+Infltoken+'&mn='+this.validateForm?.controls['userID']['value'];
					this.commonService.analyticEvent('clip_backtolanding', 'Influencer LandingPage');
					//window.location.href ="http://localhost:4200/influencer/dashboard?client_id="+this.selectClientCodeValue+'&token='+Infltoken+'&mn='+this.validateForm.controls['userID']['value'];
				}, 1000);
				
			
			})
			
		})
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
	
	checkValidation(event?: any, inputValue?: any, multipleIDsCheck?: any) {
		this.UserIdFieldValidation = false;
		this.UserIdFieldError = "";	// null;

		const value = event !== null ? event.target.value : inputValue;
		const alphabet = /[a-zA-Z]/
		const numericRegx = /[0-9]/;
		const alphaNumericRegx = /^[A-Za-z0-9 ]+$/i;
		const emailRegx = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

		if (alphaNumericRegx.test(value)) {
			if ((numericRegx.test(value) && alphabet.test(value) && value.length < 10) || multipleIDsCheck) {
				this.UserIdFieldValidation = true;
				this.loginType = 1
				// this.validateForm.controls.alphanumericValidation.setValue(true);
			}
			if ((numericRegx.test(value) && !alphabet.test(value) && value.length == 10) && !multipleIDsCheck) {
				this.UserIdFieldValidation = true;
				this.loginType = 2
				// this.validateForm.controls.alphanumericValidation.setValue(true);
			}
		}

		else {
			if (value.includes('@')) {
				if (emailRegx.test(value)) {
					this.UserIdFieldValidation = true;
					this.loginType = 3;
				}
				else {
				}

			}
			else {
			}
		}

		if (multipleIDsCheck && this.UserIdFieldValidation == false) {
			this.UserIdFieldError = "Please Enter the valid credentials";
			return;
		}
	}


	async checkValidationForMultipleID(event?: any, inputValue?: any) {
		this.UserIdFieldValidation = false;
		this.UserIdFieldError = "";	// null;

		const value = event !== null ? event.target.value : inputValue;
		const alphabet = /[a-zA-Z]/
		const numericRegx = /[0-9]/;
		const alphaNumericRegx = /^[A-Za-z0-9 ]+$/i;
		const emailRegx = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

		if (await alphaNumericRegx.test(value)) {
			if ((numericRegx.test(value) && alphabet.test(value) && value.length < 10)) {
				this.UserIdFieldValidation = true;
				this.loginType = 1
				// this.validateForm.controls.alphanumericValidation.setValue(true);
			}
		}

		// console.log(this.UserIdFieldValidation, this.validateForm);
		if (this.UserIdFieldValidation === false) this.UserIdFieldError = "Please Enter the valid credentials";
		else if (this.UserIdFieldValidation) this.next(true);
	}


	focusUser() {
		this.isFocusUser = true;
		this.flagValidUser = false;
	}

	focusOutUser(event: any) {
		this.isFocusUser = false;
		// console.log('focus out')
		if (event.target.value !== null && event.target.value !== '') {
			// this.checkUser(event.target.value);
		}
	}

	focusUser1() {
		this.isFocusUser = true;
		this.flagValidUser = false;
	}

	focusOutUser1(event?: any, isMobileScreen?: any) {
		this.isFocusUser = false;

		if (this.validateForm?.controls['userID']['value'] !== null && this.validateForm?.controls['userID']['value'] !== '') {
			this.checkValidUser(this.validateForm?.controls['userID']['value'], isMobileScreen)
		}
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

			// console.log('event trigger')
			if(!this.clip_infl){
				setTimeout(() => {
					this.submitOtp()
				}, 500);
			}
		
		}

		this.submitOtpBtn = true;
	}

	// Set pin Input field change
	onSetPinChanged(event: any) {
		this.setPinInput = event;
	}
	// confirm pin Input field change
	onSetPinCompleted(event: any, value: any) {
		this.confirmPinFocus = 0;
		this.mobileSetPin = true
		value.inputs[0].focus();
		if (this.mobileSetPin && this.mobileConSetPin && this.commonService.isApp()) {
			this.setPin();
		}
	}
	//call on last confirm pin Type
	onConPinChanged(event: any) {
		this.confirmPinInput = event;
	}

	onConPinCompleted(event: any) {
		this.mobileConSetPin = true
		if (this.mobileSetPin && this.mobileConSetPin && (this.commonService.isApp() || this.platform.is('mobileweb'))) {
			this.setPin();
		}
	}

	onLoginPinChanged(event: any) {
		this.loginPinInput = event
		// console.log(event.length);
		if (event.length < 6) {
			this.submitLogin = false;
		}
	}

	onLoginPinCompleted(event: any, value1: any) {
		this.submitLogin = true;
		// console.log(value1);
		value1.inputs[3].focus();
		
	}

	checkValidUser(event?: any, isMobileScreen?: any) {
		if (this.userValidity) return;
		if (this.validateForm?.controls['userID'].valid && this.UserIdFieldValidation) {
			this.loader = true;
			let payload = {
				'loginType': this.loginType,
				'userId': this.validateForm.controls['userID']['value']
			}
			
			this.subscription.add(
				this.serviceFile.checkUser(payload).subscribe((res: any) => {
					this.appID = null;
					if (res['Head']['ErrorCode'] == 0) {
						// console.log(res, 'res');
						localStorage.setItem("appID", res['Body']['appID']);
						this.appID = res['Body']['appID'];
						this.commonService.setClevertapEvent('Login_initiated');
						localStorage.setItem('messageMaster', JSON.stringify(res['Body']['MessageMaster']));
						this.storage.set("appID", res['Body']['appID']);
						this.userValidity = true;
						if (this.isNextClicked || isMobileScreen) {
							this.next();
						}
					}
					else {
						this.userValidity = false;
					}
					// console.log(res);
				})
			)

		}
		else {
			this.UserIdFieldError = "Please Enter the valid credentials";
		}
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


			//   this.otp = data.body;
			//   this.ngOtpInput.setValue(this.otp);
			//   console.log(this.otp);
			// this.OTPmessage = 'OTP received. Proceed to register'
			// this.stop();
		}
	}

	//otp from msg in mobile
	getOtpFromMsg(str: any) {
		let match = str.match(/\b\d{6}\b/)
		return match && match[0]
	}



	// first time login on submit
	next(clicked?: any) {
		const id2 = localStorage.getItem('userId1');
		if ((this.validateForm?.controls['userID']['value'] === null || this.validateForm?.controls['userID']['value'] === '') && (id2 === null || id2 === '')) return;
		if (clicked) {
			// this.loader = true;
			this.isNextClicked = clicked;
			this.checkValidUser();
		} else {
			const id = localStorage.getItem('userId1');
			if ((this.validateForm?.controls['userID']['value'] === null || this.validateForm?.controls['userID']['value'] === '') && (id === null || id === '')) return;
			this.loader = true;
			//    this.falseAll();

			//     this.reLogin = false;
			// 	this.optStatus = true;
			// 	if (this.platform.is('mobile')) {
			// 		this.start();
			// 	}

			// 				this.subscribeOtp = interval(1000).subscribe(res => {
			// 					// this.resendTimer = this.resendTimer - res;
			//                     this.resendTimer = this.transform(600 - res);
			// 					if (res === 600) {
			// 						this.subscribeOtp.unsubscribe();
			// 						//this.resendOpt = true;
			// 						//this.resendTimer = 0;
			// 					}
			//                 });

			setTimeout(() => {
				// console.log(this.userValidity);
				if (this.userValidity) {
					this.storage.get('appID').then((appId) => {
						if (localStorage.getItem('forgetPswFlag') == 'false' || localStorage.getItem('forgetPswFlag') == null) {
							this.subscription.add(
								this.serviceFile
									.getValidUser(this.validateForm?.controls['userID']['value'] ? this.validateForm.controls['userID']['value'] : id, appId, this.loginType)
									.subscribe(res => {
							
										this.loader = false;
										this.getValidteUserFun(res);
										localStorage.setItem('forgetPswFlag', 'false');

									})
							)
						} else {
							this.subscription.add(
								this.serviceFile
									.forgetPin(this.loginType, appId)
									.subscribe((res: any) => {
										this.loader = false;
									
										this.forgotPswCall(res)
										localStorage.setItem('forgetPswFlag', 'true');
										if (res['Head']['ErrorCode'] == 0) {
											localStorage.setItem("userId1", res['Body']['UserId']);
											this.storage.set('userID', res['Body']['UserId']);
											localStorage.setItem('userName', res['Body']['UserName']);
										} else {
											this.toast.displayToast(res['Head']['ErrorDescription'])
										}
									})
							)
						}

					})

				}

			}, 700);
		}
	}


	// startTimer() {
	//     console.log("=====>");
	//     this.interval = setInterval(() => {
	//       if (this.time === 0) {
	//         this.time++;
	//       } else {
	//         this.time++;
	//       }
	//       this.display=this.transform( this.time)
	//     }, 1000);
	//   }


	getValidteUserFun(res: any) {
		if (res['Head']['ErrorCode'] == 0) {

			// this.validateForm.patchValue({
			// 	userID: localStorage.getItem('user')
			// })

			
			localStorage.setItem("userId1", res['Body']['UserId']);
			this.storage.set('userID', res['Body']['UserId']);
			localStorage.setItem("userName", res['Body']['UserName']);
			this.userID1 = localStorage.getItem('userId1');
			this.userName = localStorage.getItem('userName');
			
			this.otpMsgDisplay = res['Body']['DisplayMsg'].replace("successfully", "");

			if (res['Body']['UserPinSet'] == false) {
				localStorage.setItem('setPinValue', "false");
				if (this.platform.is('mobile') && !this.platform.is('mobileweb')) {
					this.start();
				}
				this.falseAll();
				this.optStatus = true;

				this.subscribeOtp = interval(1000).subscribe(res => {
					// this.resendTimer = this.resendTimer - res;
					this.resendTimer = this.transform(90 - res);
					if (res === 90) {
						this.subscribeOtp?.unsubscribe();
						this.resendTimer = null
						//this.resendOpt = true;
						//this.resendTimer = 0;
					}


				});
			} else {
				localStorage.setItem('setPinValue', "true");
				this.falseAll();
				this.reLogin = true;
			}
			// this.toast.displayToast(res['Body']['DisplayMsg']);

		} else {
			if (res['Head']['ErrorCode'] === 1 && res['Head']['ErrorDescription'] === 'USR013') {
				this.validateForm?.reset();
				const getMessage = JSON.parse(localStorage.getItem('messageMaster') || "{}");
				getMessage.forEach((element: any) => {
					if (element['MsgCode'] === res['Head']['ErrorDescription']) this.otpMsgDisplay = element['MsgDescription'];
				});
				this.falseAll();
				this.userValidity = false;
				this.flagValidUser = false;
				this.multipleIds = true;
			} else {
				localStorage.clear();
				this.storage.clear();
				this.userValidity = false;
				this.flagValidUser = false;
				this.toast.displayToast(res['Head']['ErrorDescription'])
			}
		}

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

	forgotPswCall(res: any) {
		if (res['Head']['ErrorCode'] == 0) {

			localStorage.setItem('setPinValue', res['Body']['UserPinSet']);

			this.otpMsgDisplay = res['Body']['DisplayMsg'].replace("successfully", "");

			localStorage.setItem("userId1", res['Body']['UserId']);
			this.storage.set('userID', res['Body']['UserId']);
			this.userID1 = localStorage.getItem('userId1');
			this.userName = localStorage.getItem('userName');
			this.toast.displayToast(res['Body']['DisplayMsg'])
			// localStorage.setItem('setPinValue', "false");
			if (this.platform.is('mobile') && !this.platform.is('mobileweb')) {
				this.start();
			}
			this.falseAll();
			this.reLogin = false;
			this.optStatus = true;


			/* this.subscribeOtp = interval(1000).subscribe(res => {
				// this.resendTimer = this.resendTimer - res;
				this.resendTimer = 600 - res;
				if (res === 600) {
					this.subscribeOtp.unsubscribe();
					//this.resendOpt = true;
					this.resendTimer = 0;
				}
			}); */

			this.subscribeOtp = interval(1000).subscribe(res => {
				// this.resendTimer = this.resendTimer - res;
				this.resendTimer = this.transform(90 - res);
				if (res === 90) {
					this.subscribeOtp?.unsubscribe();
					this.resendTimer = null;
					//this.resendOpt = true;
					//this.resendTimer = 0;
				}
			});

		}

	}

	// on opt submit 
	submitOtp() {
			this.loader = true;
			this.subscribeOtp?.unsubscribe();
			this.resendTimer = null;
			const otpInputs = this.otpInput;
			this.storage.get('appID').then((appId) => {
				// console.log(appId);
				if (localStorage.getItem('forgetPswFlag') == 'false' || localStorage.getItem('forgetPswFlag') == null) {
	
					/* let res = {
						"Head": {
							"ResponseCode": "VerifyUserOTP",
							"ErrorCode": 0,
							"ErrorDescription": ""
						},
						"Body": {
							"UserId": "c81243",
							"DisplayMsg": "OTP Varified successfully",
							"UserPinSet": false,
							"UserPasswordSet": false
						}
					}
	
					this.getVerifyOtp(res); */
					// return; 
					this.subscription.add(
						this.serviceFile
							.validateOtp(otpInputs, appId, this.loginType)
							.subscribe((res) => {
								this.loader = false;
								this.getVerifyOtp(res);
							})
					)
	
				} else {
					//  let res = {
					// 	"Head": {
					// 		"ResponseCode": "ForgetCredentialVarifyOTP",
					// 		"ErrorCode": 0,
					// 		"ErrorDescription": ""
					// 	},
					// 	"Body": {
					// 		"UserId": "C0013",
					// 		"DisplayMsg": "OTP Varified successfully",
					// 		"UserPinSet": false,
					// 		"UserPasswordSet": false
					// 	}
					// }
					// this.getForgotVerifyOtp(res);
					// return; 
					this.subscription.add(
						this.serviceFile
							.forgetOtpVerify(otpInputs, appId)
							.subscribe((res) => {
								this.loader = false;
								//  let res = {
								//     "Head": {
								//         "ResponseCode": "ForgetCredentialVarifyOTP",
								//         "ErrorCode": 0,
								//         "ErrorDescription": ""
								//     },
								//     "Body": {
								//         "UserId": "C0013",
								//         "DisplayMsg": "OTP Varified successfully",
								//         "UserPinSet": false,
								//         "UserPasswordSet": false
								//     }
								// }
								this.getForgotVerifyOtp(res);
							})
					)
	
				}
	
			})
	
	}

	getVerifyOtp(res: any) {
		if (res['Head']['ErrorCode'] == 0) {
			if (res['Body']['UserPinSet'] == false) {

				this.toast.displayToast(res['Body']['DisplayMsg'])
				this.falseAll();
				this.setPinStatus = true;
			}
			else {
				this.falseAll();
				this.reLogin = true;
			}
		}
		else {
			this.codeInput.reset();
			this.toast.displayToast(res['Head']['ErrorDescription'])
		}
	}

	getForgotVerifyOtp(res: any) {
		if (res['Head']['ErrorCode'] == 0) {
			localStorage.setItem('setPinValue', res['Body']['UserPinSet']);
			this.toast.displayToast(res['Body']['DisplayMsg'])
			this.falseAll();
			this.setPinStatus = true;
		}
		else {
			this.codeInput.reset();
			this.otpInput = null;
			this.toast.displayToast(res['Head']['ErrorDescription'])
		}
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
						// console.log(this.clip_infl);
						if(this.clip_infl){
							this.storage.remove('infl');
							this.clip_infl = false;
							this.segmentChanged('influencers')
							// this.userTypeTitle = "Mobile No. /Email ID / Partner ID"
							// this.validation_messages['userID'][0]['message'] = "Please enter partner id";
							this.falseAll();
							this.firstTimeLogin = true;
							this.validateForm?.reset();
						
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
							this.validateForm?.reset();
							// console.log('Confirm Ok');
						}

					}
				}
			]
		});

		await alert.present();
	}

	// submit setpin
	setPin() {
		this.loader = true;
		// console.log(this.setPinValue);
		// console.log(this.confirmPinValue);

		const setPin = this.setPinInput
		const confirmPin = this.confirmPinInput
		// console.log(setPin)
		// console.log(confirmPin)
		if (setPin == confirmPin) {
			this.setPinCred(setPin)
			//this.verifyCredential(setPin,'setPinConfig')
			// this.falseAll();
			// this.successfulLogin = true;
		}
		else {
			this.loader = false;
			this.toast.displayToast("Set PIN and Confirm PIN cannot be different.");
		}


	}

	verifyCredential(pin: any, isMobile?: any) {
		this.storage.get('appID').then((appId) => {
			this.subscription.add(
				this.serviceFile
					.verifyUserCredential(pin, appId)
					.subscribe((res: any) => {
						this.loader = false;
						this.falseAll();
						this.reLogin = false;
						this.successfulLogin = true;
						// res = {
						//     "Head": {
						//         "ResponseCode": "VerifyUserCredential",
						//         "ErrorCode": 0,
						//         "ErrorDescription": ""
						//       },
						//       "Body": {
						//         "UserId": "C0001",
						//         "UserName": "Nirmal Jain",
						//         "UserEmail": "Mobile_Nirm",
						//         "UserMobile": "Email_Nirm",
						//         "UserType": "RM",
						//         "UserIsActive": "A",
						//         "DisplayMsg": "Credentail Variﬁed Successfully",
						//         "JwtToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IkMwMDAxIiwibmJmIjoxNjM3NTk5NzM5LCJleHAiOjE2Mzc2NzE3MzksImlhdCI6MTYzNzU5OTczOX0.JWAzZZ0uRyTjK-SbArQg7hDyw7oECBAajTKRKNg5NTw"
						//     }
						// }  

						if (res['Head']['ErrorCode'] == 0) {
							this.verifiedData = res;
							// localStorage.setItem('UserId', res['Body']['UserId']);
							localStorage.setItem('userType', res['Body']['UserType']);
							if (isMobile && !this.platform.is('mobileweb')) {
								this.isScreenLock = true;
                                this.successfulLogin = false;
							} else {
								this.navigateToDashboard(res);
							}
						}
						else {
							this.commonService.setClevertapEvent('Login_Failed', res['Head']['ErrorDescription']);
							this.toast.displayToast(res['Head']['ErrorDescription']);
							this.successfulLogin = false;
							this.falseAll();
							this.reLogin = true;
							setTimeout(() => {
								this.pinData[0].value = null;
								this.pinData[1].value = null;
								this.pinData[2].value = null;
								this.pinData[3].value = null;
								this.keyboardActiveIndex = 0;
							}, 1000);
							
							//this.pinData[this.keyboardActiveIndex]['value'] = null
						}
					},
					error => {
						this.commonService.setClevertapEvent('Login_Failed', error);
					}
				)
			)

		})
		// })
	}

	skip() {
		this.storage.set('deviceLock', false);
	}

	public navigateToDashboard(res: any) {
		this.profileDetails1 = res['Body'];
		// console.log(this.profileDetails1);
		this.storage.set('loginTime', new Date());
		this.storage.set('token', true);

		localStorage.setItem('profileDetails1`', this.profileDetails1);
		this.storage.set('profileDetails1', this.profileDetails1);

		this.userType = res['Body']['UserType'] === 'SUBBROKER' ? 'SUB BROKER' : res['Body']['UserType'];

		this.storage.set('userType', res['Body']['UserType'] === 'SUBBROKER' ? 'SUB BROKER' : res['Body']['UserType']);
		this.storage.set('userID', res['Body']['UserId']);

		const cookieValue = res['Body']['Cookie'].split(';');
		// console.log(cookieValue, ' <-----> cookie Value after submit');

		for (var i = 0; i < cookieValue.length; i++) {
			if (cookieValue[i].indexOf('ASPXAUTH') > -1) {
				const authValue = cookieValue[i];
				this.bckOfficeCookie = '.' + authValue.split('.')[1];
				// console.log(authValue, this.bckOfficeCookie);
				this.storage.set('bToken', this.bckOfficeCookie);
				this.storage.set('subToken', this.bckOfficeCookie);
				this.storage.set('sToken', this.bckOfficeCookie);
				this.storage.set('fpToken', this.bckOfficeCookie);
			}

		}
		setTimeout(() => {
			this.showLoader = false;
			
			this.generateToken(this.profileDetails1);
			this.getActivationMenu(this.bckOfficeCookie);
			this.getClientCodeList(this.bckOfficeCookie)
		}, 1000);
		this.commonService.setClevertapEvent('Login_completed');
		// this.serviceFile.getCrmToken().subscribe((res) => {
		// 	// console.log(res);
		// 	localStorage.setItem('crmToken', res['Body']['Token']);
		// });
		setTimeout(() => {
			if (this.userType === 'RM' || this.userType === 'FAN') {
				this.getMappingRM(this.bckOfficeCookie);
			} else {
				this.subBrokerMapping(this.bckOfficeCookie);
			}
			this.getRMProfileDetails(this.bckOfficeCookie);
			this.successfulLogin = false;
			// this.router.navigate(['/markets']);
			// this.router.navigate(['subscription']);
			// if (this.userType === 'FAN') {
			// 	this.checkSubs();
			// 	this.navCtrl.navigateRoot('/subscription');
			// 	// this.router.navigate(['/subscription']);
			// } else {
			// this.navCtrl.navigateRoot('/markets');
			this.navCtrl.navigateRoot('/dashboard');
			// this.router.navigate(['/markets']);
			// }
		}, 1500);
		// this.toast.displayToast('Logged in successfully!');

		// this.toast.displayToast(res['Body']['DisplayMsg']);
		// this.falseAll();
		// this.successfulLogin = true;
	}

	setPinCred(pin: any) {
		this.storage.get('appID').then((appId) => {
			this.subscription.add(
				this.serviceFile
					.setCredential(pin, appId)
					.subscribe((res: any) => {
						this.loader = false;
						if (res['Head']['ErrorCode'] == 0) {
							localStorage.setItem('setPinValue', res['Body']['UserPinSet']);
							this.reLogin = true;
							this.falseAll();
							// this.successfulLogin = true;
							// setTimeout(() => {
							// 	// this.successfulLogin = false;
							// }, 500);
							//this.toast.displayToast(res['Body']['DisplayMsg'])    
						}
						else {
							this.toast.displayToast(res['Head']['ErrorDescription'])
						}
					})
			)
		})
	}



	loginBtn(isMobile?: any) {
		this.loader = true;
		// console.log(this.loginPinValue)
		let consPin = this.loginPinInput;
		this.verifyCredential(consPin, isMobile);
		//console.log(consPin); 
	}
	// enter value with custom keyboard
	enterValue(keyObj: any) {
		// console.log(keyObj);
		// console.log(this.keyboardActiveIndex)
		if (this.keyboardActiveIndex <= 4) {
			if (keyObj['value'] != 'x') {
				if (this.keyboardActiveIndex <= 3) {
					this.pinData[this.keyboardActiveIndex]['value'] = keyObj['value'];
					this.keyboardActiveIndex = this.keyboardActiveIndex + 1;
				}
			} else {
				if (this.keyboardActiveIndex > 0) {
					this.keyboardActiveIndex = this.keyboardActiveIndex - 1;
					this.pinData[this.keyboardActiveIndex]['value'] = null;
				}
			}
			if (this.keyboardActiveIndex === 4) {
				setTimeout(() => {
					this.loginPinInput = this.pinData[0].value + '' + this.pinData[1].value + '' + this.pinData[2].value + '' + this.pinData[3].value
					this.loginBtn(true);
				}, 200);
			}
		}
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
						this.validateForm?.reset();
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




	resetOtpClick() {
		if (this.resendTimer == null) {
			this.subscribeOtp?.unsubscribe();
			this.resendTimer = "01:30";
			if(this.platform.is('mobile')){
				this.otpInput = null;
			}else{
				this.codeInput.reset();
			}

			this.submitOtpBtn = false;
			
			
			 this.storage.get('infl').then(infl => {
				 if(infl){
					this.loader = true;
					this.commonService.analyticEvent('clip_resendOTP', 'Influencer ResendOTP');
					this.serviceFile.sendInflOtp(this.validateForm?.controls['userID']['value']).subscribe((response: any) => {
						this.loader = false;
						if(response['isSuccess'] == true && response['message'] == "Success"){
							// this.falseAll();
							// this.reLogin = false;
							// this.optStatus = true;
							this.subscribeOtp = interval(1000).subscribe(res => {
						// this.resendTimer = this.resendTimer - res;
								this.resendTimer = this.transform(90 - res);
								if (res === 90) {
									this.subscribeOtp?.unsubscribe();
									this.resendTimer = null
								}
							});
							this.otpMsgDisplay = response['resultData']
						}
					})
				 }
				 else{
					this.next();
				 }
			
			 })
			
			/* this.subscribeOtp = interval(1000).subscribe(res => {
				// this.resendTimer = this.resendTimer - res;
				// this.resendTimer = 60 - res;
				this.resendTimer = this.transform(90 - res);
				if (res === 90) {
					this.subscribeOtp.unsubscribe();
					this.resendTimer = null;
					//this.resendOpt = true;
					//this.resendTimer = 0;
				}
			}); */
		}
		//this.resendOpt = false;
		//this.resendTimer = 0;
	}

	// back from opt screen to first screen
	backFromOtop() {
		// this.falseAll();
		// this.firstTimeLogin = true;
		this.subscribeOtp?.unsubscribe();
		localStorage.clear();
		this.storage.clear();
		this.resendTimer = null;
		this.falseAll();
		this.reLogin = false;
		this.firstTimeLogin = true;
		this.userValidity = false;
		this.otpInput = null;
		this.validateForm?.reset();
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

		this.commonService.setClevertapEvent('AAApagelanding');
		this.showLoader = false;
		// this.storage.clear();
		
		/* this.storage.get('token').then(token => {
			if (token) {
				this.navCtrl.navigateRoot(['/dashboard']);
			} else {
				this.navCtrl.navigateRoot(['/login']);
			}
		}) */
			// if(localStorage.getItem('sessionExpire')){
			// 	this.falseAll();
			// 	this.reLogin = true;
			// 	this.userID1 = localStorage.getItem('userId1');
			// 	this.userName = localStorage.getItem('userName');
			// }

			this.storage.get('token').then((token) => {
				if (token) {
					this.storage.get('deviceLock').then( isLock => {
						if ((isLock || !isLock || localStorage.getItem('sessionExpire')) && !this.platform.is('desktop')) {
							this.falseAll();
							this.reLogin = true;
							this.userID1 = localStorage.getItem('userId1');
							this.userName = localStorage.getItem('userName');
							// this.fingerPrintAccess();
						} 
						else {
							const path = window.location.pathname;
							// if (path === '/sign-in') {
							// 	this.router.navigate([path]);
							// } else {
							if (path === '/login') {
								// this.router.navigate(['/markets']);
								this.navCtrl.navigateRoot(['/dashboard']);
								// this.router.navigate(['subscription']);
							} else {
								this.navCtrl.navigateRoot([path]);
							}
						}
					})
					// }
				} else {
						this.navCtrl.navigateRoot(['/login']);
					// } 
				}
			})


		
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

	// call agree popup
	async isAgree() {
		const modal = await this.modalController.create({
			component: AgreeComponent,
			backdropDismiss: false,
			cssClass: 'agree',
			componentProps: {}
		});

		modal.onDidDismiss().then((data) => {
			this.makeAgree('RM');
		})
		return await modal.present();
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
	get formFields() { return this.validateForm?.controls; }





	public checkUser(id: any, reverse?: any) {
		if (this.commonService.inputRestriction(id)) {
			return;
		}

		if (id !== null) {
			this.userErrorMsg = null;
			this.subscription = new Subscription();
			this.subscription.add(this.serviceFile
				.getUserType(id)
				.subscribe((response: any) => {
					if (response['Body']['Status'] == 'SUCCESS' && response['Body']['ClientType'] !== 'INVALID CLIENT') {
						this.userType = response['Body']['ClientType'];
						this.userErrorMsg = response['Body']['Message'];

						if (reverse) {
							if (this.userType === 'RM' || this.userType === 'FAN') {
								const pswd = this.ciphetText.aesEncrypt(this.formFields?.['password'].value);
								const userID = this.formFields?.['userID'].value;

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
								// this.checkSubs();
								this.subBrokerLogin();
							}
						}
						// this.isAgree();
					} else {
						this.userType = null;
						this.userErrorMsg = response['Body']['Message'];
						this.flagValidUser = true;
					}
				}))

		}

	}

	public login() {
		if (!this.validateForm?.invalid) {
			if (this.userType === 'RM' || this.userType === 'FAN') {
				const pswd = this.ciphetText.aesEncrypt(this.formFields?.['password'].value);
				const userID = this.formFields?.['userID'].value;

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
				// this.checkSubs();
				this.subBrokerLogin();
			} else if (this.userType === null && this.userErrorMsg === null) {
				this.checkUser(this.formFields?.['userID'].value, true);
				// if (this.userType === 'RM' || this.userType === 'FAN') {
				// 	const pswd = this.ciphetText.aesEncrypt(this.formFields.password.value);
				// 	const userID = this.formFields.userID.value;

				// 	// this.storage.clear();
				// 	localStorage.setItem('userID', userID);
				// 	this.storage.set('userID', userID);
				// 	localStorage.setItem('userType', this.userType);
				// 	this.storage.set('userType', this.userType);

				// 	const reqOneObj = {
				// 		Password: pswd,
				// 		LocalIP: "1.0.64.100",
				// 		PublicIP: "100.64.0.1",
				// 		HDSerialNumber: "",
				// 		MACAddress: "AAAWeb",
				// 		MachineID: "864115031173488",
				// 		VersionNo: "1.0.22.0",
				// 		RequestNo: 1,
				// 		My2PIN: "",
				// 		ConnectionType: "1"
				// 	}
				// 	// this.RMLoginRequest2();
				// 	this.RMLoginRequest1(userID, reqOneObj);
				// } else if (this.userType === 'SUB BROKER') {
				// 	// this.checkSubs();
				// 	this.subBrokerLogin();
				// }
			} else {
				this.toast.displayToast(this.userErrorMsg ? this.userErrorMsg : 'Something went wrong');
			}
		} else return;
	}

	public RMLoginRequest1(userID: any, reqOneObj: any) {
		// this.subscription = new Subscription();
		this.showLoader = true;
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
						this.storage.set('sToken', this.swarajCookie);
						this.router.navigate(['/change-password']);
					} else {
						const pswd = this.ciphetText.aesEncrypt(this.formFields?.['password'].value);
						const userID = this.ciphetText.aesEncrypt(this.formFields?.['userID'].value);
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
					// console.log(response['Body']['Cookie'], ' response');

					const cookieValue = response['Body']['Cookie'].split(';');
					// console.log(cookieValue, ' <-----> cvalue');

					for (var i = 0; i < cookieValue.length; i++) {
						if (cookieValue[i].indexOf('ASPXAUTH') > -1) {
							const authValue = cookieValue[i];
							this.bckOfficeCookie = '.' + authValue.split('.')[1];
							// console.log(authValue, this.bckOfficeCookie);

						}

					}
					// const cookieValue = res['Body']['Cookie'].split(';')[3];
					// this.subbrokerCookie = '.'+cookieValue.split('.')[1];
					this.storage.set('subToken', this.subbrokerCookie);
					// this.bckOfficeCookie = '.'+cookieValue.split('.')[1];
					this.storage.set('bToken', this.bckOfficeCookie);
					localStorage.setItem('bToken', this.bckOfficeCookie);
					this.RMLoginRequest3();
					/* if (responseData['IsAgreed'].toLowerCase() === 'yes') {
						// if (this.userType == 'FAN') {
						// 	setTimeout(() => {
						// 		// this.checkSubs();
						// 	}, 500);
						// } else {
						// }
					} else {
						this.isAgree();
						// this.makeAgree('RM');
					} */
				} else {
					this.showLoader = false;
					this.toast.displayToast(response['body']['Msg']);
				}

			}))

	}

	/**
	 * @param type accepts whether to agree for RM-FAN or Sub-Broker
	 */
	public makeAgree(type: any) {

		this.storage.get('bToken').then(token => {
			const params = {
				"ClientCode": this.formFields?.['userID'].value,
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
								// this.checkSubs();
								// } else if (type === 'FAN') {
								// 	this.checkSubs();
							} else if (type === 'broker') {
								this.subBrokerMapping();
							}
						} else {
							this.showLoader = false;
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
				LoginId: this.ciphetText.aesEncrypt(this.formFields?.['userID'].value)
			},
			body: {
				loginId: this.ciphetText.aesEncrypt(this.formFields?.['userID'].value),
				Password: this.ciphetText.aesEncrypt(this.formFields?.['password'].value),
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

					this.commonService.setClevertapEvent('Login_completed');

					this.storage.set('token', true);
					this.storage.set('userID', this.formFields?.['userID'].value);
					this.storage.set('userType', this.userType);
					localStorage.setItem('userID', this.formFields?.['userID'].value);
					localStorage.setItem('userType', this.userType);

					this.fpCookie = res['body']['Cookie'].split(';')[0];
					// this.storage.clear();
					this.storage.set('sToken', this.swarajCookie);
					this.storage.set('bToken', this.bckOfficeCookie);
					localStorage.setItem('bToken', this.bckOfficeCookie);
					this.storage.set('fpToken', this.fpCookie);
					localStorage.setItem('loginTime', JSON.stringify(new Date()));
					this.storage.set('loginTime', new Date());
					// this.storage.set('loginTime', 'Mon Nov 09 2020 20:16:52 GMT+0530 (India Standard Time)');
					setTimeout(() => {
						this.showLoader = false;
						this.getMappingRM(this.swarajCookie);
					}, 200);

					setTimeout(() => {
						this.getRMProfileDetails(this.bckOfficeCookie);
						// this.router.navigate(['/markets']);
						// this.router.navigate(['subscription']);
						// if (this.userType === 'FAN') {
						// 	this.checkSubs();
						// 	this.navCtrl.navigateRoot('/subscription');
						// 	// this.router.navigate(['/subscription']);
						// } else {
						// this.navCtrl.navigateRoot('/markets');
						this.navCtrl.navigateRoot('/dashboard');
						// this.router.navigate(['/markets']);
						// }
					}, 1500);
					this.toast.displayToast('Logged in successfully!');
					this.commonService.analyticEvent('Login_Completed', 'RM FAN Login Completed');
					this.validateForm?.reset();
				} else {
					this.commonService.setClevertapEvent('Login_failed', res['Head']['ErrorDescription']);
					this.showLoader = false;
					this.toast.displayToast(res['head']['statusDescription']);
				}

				//     // loading status
				//     // this.isLoadingOne = false;
			},
				error => {
					//     // print the error to console
					this.commonService.setClevertapEvent('Login_failed', error);
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
				EmployeeId: this.ciphetText.aesEncrypt(this.formFields?.['userID'].value),
				Password: this.ciphetText.aesEncrypt(this.formFields?.['password'].value),
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
				(res) => {
					if (res && res['Head'] && +res['Head']['ErrorCode'] === 0 && res && res['Body'] && +res['Body']['Status'] === 0) {
						this.commonService.setClevertapEvent('Login_completed');
						// if (res['Body']['IsAgreed'].toLowerCase() === 'yes') {
						this.storage.set('token', true);
						this.storage.set('userID', this.formFields?.['userID'].value);
						this.storage.set('userType', this.userType);
						localStorage.setItem('userID', this.formFields?.['userID'].value);
						localStorage.setItem('userType', this.userType);

						const cookieValue = res['Body']['Cookie'].split(';');
						// let cookieValue = null;
						for (var i = 0; i < cookieValue.length; i++) {
							if (cookieValue[i].indexOf('ASPXAUTH') > -1) {
								const authValue = cookieValue[i];
								this.subbrokerCookie = '.' + authValue.split('.')[1];
							}

						}
						// const cookieValue = res['Body']['Cookie'].split(';')[3];
						// this.subbrokerCookie = '.'+cookieValue.split('.')[1];
						this.storage.set('subToken', this.subbrokerCookie);
						this.storage.set('bToken', this.bckOfficeCookie);
						localStorage.setItem('bToken', this.bckOfficeCookie);
						this.storage.set('loginTime', new Date());
						// this.storage.clear();
						this.showLoader = false;
						setTimeout(() => {
							// this.router.navigate(['/markets']);
							this.router.navigate(['/dashboard']);
							// this.checkSubs();
							// this.router.navigate(['/subscription']);
							// this.navCtrl.navigateRoot('/subscription');
							this.subBrokerMapping(this.subbrokerCookie);
							this.getRMProfileDetails(this.subbrokerCookie);
							this.getIGLScore(this.subbrokerCookie);
						}, 1000);
						this.toast.displayToast('Logged in successfully!');
						this.commonService.analyticEvent('Login_Completed', 'SUB BROKER Login Completed');
						this.validateForm?.reset();
						// } else {
						// 	this.makeAgree('broker');
						// }
					} else {
						this.commonService.setClevertapEvent('Login_failed', res['Head']['ErrorDescription']);
						this.showLoader = false;
						this.toast.displayToast(res['Head']['ErrorDescription']);
					}

					//     // loading status
					//     // this.isLoadingOne = false;
				},
				error => {
					this.commonService.setClevertapEvent('Login_failed', error);
					//     // loading status
					//     // this.isLoadingOne = false;

					//     // print the error to console
					//     console.error(error);
				});
	}

	public getRMProfileDetails(tokenValue?: any) {
		this.subscription = new Subscription();
		let usrCode: any = null;
		if (this.userType === 'RM') usrCode = 1;
		else if (this.userType === 'FAN') usrCode = 2;
		else if (this.userType === 'SUB BROKER' || this.userType === 'SUBBROKER') usrCode = 3;

		if (this.userType === 'RM' || this.userType === 'FAN') {
			this.storage.get('bToken').then((backOfficeToken) => {
				// console.log(backOfficeToken, tokenValue);

				this.storage.get('userID').then(code => {
					const params = {
						UserCode: code,
						UserType: usrCode
					}

					this.subscription.add(
						this.serviceFile
							.getRMProfile(params, backOfficeToken ? backOfficeToken : tokenValue)
							.subscribe((response: any) => {
								if (response['Head']['ErrorCode'] === 0) {
									localStorage.setItem('RMCode', response['Body']['RMCode']);
									const pDetails = response['Body'];
									this.storage.set('pDetails', pDetails);

									setTimeout(() => {
										this.storage.get('userID').then(ID => {
											if (!this.commonService.isApp()) {
												clevertap.onUserLogin.push({
													"Site": {
														"Partner Name": pDetails['Name'],            // String
														"Dealer Code": ID,              // String or number
														"Identity": ID,
														// "Partner Email": pDetails['Email'],         // Email address of the user
														// "Partner ID": ID,
														"Partner Email": pDetails['Email'],
														"MSG-push": true,                  // Enable push notifications	
														"MSG-sms": true,
													}
												})
											} else {
												this.mobClevertap.onUserLogin({
													"Partner Name": pDetails['Name'],            // String
													"Dealer Code": ID,              // String or number
													"Identity": ID,
													// "Partner Email": pDetails['Email'],         // Email address of the user
													"Partner Email": pDetails['Email'],
													"MSG-push": true,                  // Enable push notifications	
													"MSG-sms": true,
												})
											}

										})
									}, 1000);

									/* setTimeout(() => {
										this.storage.get('userID').then(ID => {
											clevertap.onUserLogin.push({
												"Site": {
													"Partner Name": pDetails['Name'],            // String
													"Dealer Code": ID,              // String or number
													"Partner Email": pDetails['Email'],         // Email address of the user
													"Partner ID": ID
												}
											})
										})
									}, 1000); */
								}
								// console.log(response);

							})
					)
				})
			})
		} else {
			this.storage.get('subToken').then((backOfficeToken) => {
				// console.log(backOfficeToken, tokenValue);

				this.storage.get('userID').then(code => {
					const params = {
						UserCode: code,
						UserType: usrCode
					}

					this.subscription.add(
						this.serviceFile
							.getRMProfile(params, backOfficeToken ? backOfficeToken : tokenValue)
							.subscribe((response: any) => {
								if (response['Head']['ErrorCode'] === 0) {
									localStorage.setItem('RMCode', response['Body']['RMCode']);
									const pDetails = response['Body'];
									this.storage.set('pDetails', pDetails);

									setTimeout(() => {
										this.storage.get('userID').then(ID => {

											if (!this.commonService.isApp()) {
												clevertap.onUserLogin.push({
													"Site": {
														"Partner Name": pDetails['Name'],            // String
														"Dealer Code": ID,              // String or number
														"Identity": ID,
														// "Partner Email": pDetails['Email'],         // Email address of the user
														// "Partner ID": ID,
														"Partner Email": pDetails['Email'],
														"MSG-push": true,                  // Enable push notifications	
														"MSG-sms": true,
													}
												})
											} else {
												this.mobClevertap.onUserLogin({
													"Partner Name": pDetails['Name'],            // String
													"Dealer Code": ID,              // String or number
													"Identity": ID,
													// "Partner Email": pDetails['Email'],         // Email address of the user
													"Partner Email": pDetails['Email'],
													"MSG-push": true,                  // Enable push notifications	
													"MSG-sms": true,
												})
											}
										})
									}, 1000);
								}
								// console.log(response);

							})
					)
				})
			})
		}
	}

	public getMappingRM(cookieValue: any) {

		this.storage.get('userID').then((token) => {
			this.subscription = new Subscription();
			const params = {
				AdminCode: token
			}
			this.subscription.add(
				this.serviceFile
					.getRMMapping(params, token, cookieValue)
					.subscribe((response: any) => {
						if (response['body'].status == 0) {
							this.storage.set('mappingDetails', response['body'].details);
							//console.log(response);
						}
					})
			)
		})
	}


	public subBrokerMapping(cookie?: any) {

		this.subscription = new Subscription();
		this.storage.get('userID').then(ID => {
			const params = {
				UserID: ID,
				Opt: "C"
			}
			this.subscription.add(
				this.serviceFile.
					getSubBrokerMap(params, cookie).
					subscribe((response: any) => {
						this.storage.set('subBrokermapping', response['Body'].Clients);
						//console.log(response);
						// console.log(response, 'map response');

					})
			);
		})
	}

	public getIGLScore(token?: any) {

		const params = {
			body: {
				PartnerCode: this.formFields?.['userID'].value
			},
			head: {
				LoginID: this.ciphetText.aesEncrypt(this.formFields?.['userID'].value),
				Password: this.ciphetText.aesEncrypt(this.formFields?.['password'].value),
				Longitude: "72.8590416",
				Latitude: "21.2354352",
				IMEI: "864115031173488",
				MacAdd: "7c:46:85:53:e6:f3",
				DOB: ""
			}
		}
		const subscription = new Subscription();

		subscription.add(
			this.serviceFile
				.getScore(params, token)
				.subscribe(response => {
					if (+response['Head']['ErrorCode'] === 0) {
						this.storage.set('IGLCScore', response['Body'][0]['IGLCScore']);
					} else {
						this.storage.set('IGLCScore', 0);
					}
				})
		)
	}

	public getActivationMenu(cookie?: any) {
		this.subscription = new Subscription();

		this.storage.get('userID').then(ID => {
			this.subscription.add(
				this.serviceFile.
					accessProductActivation(cookie, ID).
					subscribe((response) => {
						// console.log(response);
						if (response['Head']['ErrorCode'] == 0) {
							this.storage.set('setAccessChecker', response['Body']['FeatureAccessChecker']);
							this.storage.set('setAccessMaker', response['Body']['FeatureAccessMaker']);
						} else {
							this.storage.set('setAcessChecker', null);
							this.storage.set('setAcessMaker', null);
						}
						// console.log(response, 'map response');

					})
			);
		})
	}

	getClientCodeList(cookie?: any){
		this.storage.get('userID').then(ID => {
			this.subscription.add(
				this.serviceFile.
				getClientCodes(cookie, ID).
					subscribe((response: any) => {
						// console.log(response);
						if (response['Head']['ErrorCode'] == 0) {
							this.clientCodeList = response['Body']['objGetClientCodesResBody']
						} else {
							this.clientCodeList = []
						}
						this.storage.set('setClientCodes', this.clientCodeList);
					})
			);
		})
	}

	public checkSubs(cookieValue?: any) {
		this.subscription = new Subscription();

		if (this.userType === 'FAN') {
			this.storage.get('bToken').then(token => {
				this.subscription.add(
					this.serviceFile
						.checkSubs(token, this.formFields?.['userID'].value)
						.subscribe((response: any) => {
							this.showLoader = false;
							if (+response['Head']['ErrorCode'] === 0) {
								if (+response['Body']['Status'] === 1) {
									this.storage.set('subscription', true);
								} else {
									this.storage.set('subscription', false);
									if (this.userType === 'FAN') {
										this.RMLoginRequest3();
									} else {
										this.subBrokerLogin();
									}
								}
							}
						})
				)
			})
		} else {
			this.storage.get('subToken').then(token => {
				this.storage.get('userID').then(ID => {
					this.subscription.add(
						this.serviceFile
							.checkSubs(token, ID)
							.subscribe((response: any) => {
								this.showLoader = false;
								if (+response['Head']['ErrorCode'] === 0) {
									if (+response['Body']['Status'] === 1) {
										this.storage.set('subscription', true);
									} else {
										this.storage.set('subscription', false);
										if (this.userType === 'RM' || this.userType === 'FAN') {
											this.RMLoginRequest3();
										} else {
											this.subBrokerLogin();
										}
									}
								}
							})
					)
				})
			})
		}
	}


	public generateToken(profileDetails: any) {
		// console.log(profileDetails, 'profileDetails', this.profileDetails1);
		const params = {
			JwtAAAToken: profileDetails['JwtToken'],
       		userIdValue: profileDetails['UserId']
		}
		this.subscription = new Subscription();
		// this.storage.get('bToken').then(token => {
		this.subscription.add(
			this.serviceFile
				.getToken(params, profileDetails)
				.subscribe((response) => {
					// console.log(response);
					if (+response['body']['status'] === 0 && +response['head']['status'] === 0) {
						// console.log(response, 'generate token');
						this.storage.set('JwtToken', response['body']['formAuthToken']);
					} else {
						if(response && response['head'] && response['head']['ErrorDescription']){
							this.toast.displayToast(response['head']['ErrorDescription']);
						}
					}
				})
		)
		// })
	}

	/* 
		public payTmURL(data) {
			this.subscription = new Subscription();
	
			const temp = '3s@nY!mNgOH9p0Td'+this.formFields.userID.value+'App192.168.1.20'+this.datePipe.transform(new Date(), 'ddMMyy');
			// const temp = '3s@nY!mNgOH9p0Td104554App192.168.1.20050121';
			const checksumValue = (md5(temp)).toString().toUpperCase();
			const obj = {
				head: {
					AppSource: "App",
					RequestCode: "AAPAYMENTREQ2013",
					IPAddress: "192.168.1.20",
					CheckSumKey: checksumValue.substring(0, 16),
					UserType: "AAA"
				},
				body: {
					ClientCode: this.formFields.userID.value,
					BusinessId: "1",
					Amount: "500"
				}
			}
		} */

	/**
	 * @param redirectFor accepts param to either redirect for new user or for support
	 */
	public redirectTo(redirectFor: any) {
		if (redirectFor === 'register') {
			this.commonService.analyticEvent('New_User', 'New Registration');
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

		// document.body.removeChild(form);
		// window.open("post.htm", name);

	}

	async keyDownFunction(event: any) {
		if (event.keyCode === 13) {
			if (this.validateForm?.controls['userID']['value'] === '' || this.validateForm?.controls['userID']['value'] === null) return;
			await this.multipleIds ? this.checkValidationForMultipleID(null, this.validateForm?.controls['userID']['value']) : this.checkValidation(null, this.validateForm?.controls['userID']['value'], true);
			if (this.UserIdFieldValidation && !this.clip_infl) this.next(true);
			if(this.clip_infl) this.inflSendOtp();

			if(this.reLogin && this.submitLogin){
				this.loginBtn();
			}
			// this.login();
			// rest of your code
		}
	}

	ionViewWillLeave() {
		this.showLoader = false;
		/*Logic for after logout if user clicks browser back button */
		if (+this.passwordChangeFlag !== 2) {
			this.storage.get('token').then((token) => {
				if (token) {
					return true;
				} else {
					this.router.navigate(['/login']);
					return false;
				}
			})
		}

	}

	// influencer Part
	influncerLogin(){
		//this.isInfluencerActive = true;
		//Window.storage.clear();
		this.storage.set('infl', true);
		localStorage.clear();
		this.clip_infl = true;
		this.userTypeTitle = "Mobile No."
		this.validation_messages['userID'][0]['message'] = "Please Enter Mobile no"
		if(this.validateForm?.controls['userID']['value'] != null){
			this.validateForm?.patchValue({
				userID:null
			  })
		}
	}

	inflSendOtp(){
		this.commonService.analyticEvent('clip_sendOTP', 'Influencer SendOTP');
		
		if(this.validateForm?.controls['userID']['value'].length > 9){
			let mobileNumberRegx = /^(\+\d{1,3}[- ]?)?\d{10}$/
			if(mobileNumberRegx.test(this.validateForm?.controls['userID']['value'])){
				this.storage.set('infi_userID', this.validateForm?.controls['userID']['value'])
				this.loader = true;
				 this.serviceFile.sendInflOtp(this.validateForm?.controls['userID']['value']).subscribe((response: any) => {
					this.loader = false;
					if(response['isSuccess'] == true && response['message'] == "Success"){
						this.falseAll();
						this.reLogin = false;
						this.optStatus = true;
						this.subscribeOtp = interval(1000).subscribe(res => {
							this.resendTimer = this.transform(90 - res);
							if (res === 90) {
								this.subscribeOtp?.unsubscribe();
								this.resendTimer = null
							}
						});
						this.otpMsgDisplay = response['resultData']
					}
					else{
						this.toast.displayToast(response['resultData']);
					}
				})
			}
			else{
				this.toast.displayToast("Please Enter the Valid Mobile Number");
			}
	

	
		 }
	
	}

	infllogin(){
		this.commonService.analyticEvent('clip_login', 'Influencer Login');
		this.loader = true;
		this.storage.get('infi_userID').then((infi_userID) => {
			// console.log(infi_userID);
			
			this.serviceFile.verifyInflOtp(infi_userID, this.otpInput).subscribe((response: any) => {
				this.loader = false;
				// console.log(response)
				if(response['isSuccess'] == true && response['message'] == "Success"){
					this.storage.set('Infltoken', response['resultData']['token'])
					if(response['resultData']['clientCode'].length == 1){
						window.location.href = environment['influencerUrl']['url']+"/dashboard?client_id="+response['resultData']['clientCode'][0]+'&token='+response['resultData']['token']+'&mn='+this.validateForm?.controls['userID']['value'];	
						//window.location.href ="http://localhost:4200/influencer/dashboard?client_id="+response['resultData']['clientCode'][0]+'&token='+response['resultData']['token']+'&mn='+this.validateForm.controls['userID']['value'];

						this.commonService.analyticEvent('clip_backtolanding', 'Influencer LandingPage');


						// console.log('go To login Page');
						localStorage.setItem('authToken', response['resultData']['token'])
					}else if(response['resultData']['clientCode'].length > 1){
						this.falseAll();
						this.multipleClientCode = true;
						this.multipleClientList = response['resultData']['clientCode'];
					}
					else{
						this.loader = false;
					}
					
				}
				else{
					this.toast.displayToast(response['resultData']);
					setTimeout(() => {
						this.codeInput.reset();
					}, 500);
					
				}
			})
		})
	}

	/**
	 * To clear previous pin data
	 */
	 clearPin() {
		this.pinData = [
			{ value: null }, { value: null }, { value: null }, { value: null }
		]
	}
}