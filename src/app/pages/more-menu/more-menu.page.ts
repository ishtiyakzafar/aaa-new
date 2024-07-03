import { Component, OnDestroy, OnInit } from '@angular/core';
import { Platform, ModalController, AlertController, NavController} from '@ionic/angular';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { CommonService } from '../../helpers/common.service';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NewLoginService } from '../new-login/new-login.service';
import { Subscription } from 'rxjs';
import { InvestService } from '../invest/invest.service';
import * as CryptoJS from 'crypto-js';
import { CookieService } from 'ngx-cookie-service';
import { URLS } from '../../../config/api.config';
import { environment, investObj, researchReport } from '../../../environments/environment';
import { AuthenticationService } from '../../helpers/authentication.service';
import { ToasterService } from '../../helpers/toaster.service';
import { CustomEncryption } from '../../../config/custom-encrypt';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { AddUserComponent } from '../../components/add-user/add-user.component';
import { FormFormatComponent } from '../../components/form-format/form-format.component';
import { SupportComponent } from '../../components/support/support.component';
import { DematRequestFormsComponent } from '../../components/demat-request-forms/demat-request-forms.component';

declare var cordova: any;

@Component({
    selector: 'app-more-revamp',
    providers: [NewLoginService],
    templateUrl: './more-menu.page.html',
    styleUrls: ['./more-menu.page.scss'],
})
export class MoreRevampPage implements OnInit,OnDestroy {
    userType: any;
    userID: any;
	userIdLength = localStorage.getItem('userId1')?.length;
	fanMasterSubMenuOptions: any = [
		{ label: 'Wire Request', path: '' }, { label: 'Wire Reports', path: '' }, { label: 'Pay Details', path: '' }, { label: 'Foliowise Client Details', path: '' }
	];
	
	 fanChildSubMenuOptions: any = [
		{ label: 'Wire Request', path: '' }, { label: 'Wire Reports', path: '' }, { label: 'Foliowise Client Details', path: '' }
	];
    subMenuOptions1: any = [

        { label: 'Help', path: '' }, { label: 'Call For Support', path: '' }

    ];

	subMenuOptionsMob1: any = [

        { label: 'Call For Support', path: '' }

    ];

     subMenuOptions2: any = [

       { label: 'Help', path: '' }, { label: 'Call For Support', path: '' }

    ];
    userTypeVal: any = localStorage.getItem('userType');
    menuOptions: any[] = [
      
        {
            icon: 'calculators.svg', name: 'Calculators',
            description: 'Calculate estimated returns for clients with our built in calculators',
            subMenuOptions: [
                { label: 'EMI Calculator', path: '' }, { label: 'SIP Calculator', path: '' }, { label: 'SIP Revenue', path: '' },
                { label: 'Span Margin', path: '' }, { label: 'Goal Calculator', path: '' }
            ],
			subMenuOptionsMob: [
                { label: 'EMI Calculator', path: '' }, { label: 'SIP Calculator', path: '' }, { label: 'SIP Revenue', path: '' },
                { label: 'Span Margin', path: '' }, { label: 'Goal Calculator', path: '' }
            ]
        },
        {
            icon: 'research.svg', name: 'Research & Learning',
            description: 'Check expert opinions on Markets and learn from our Edtech platform',
            subMenuOptions: [
                { label: 'Research Reports', path: '' }, { label: 'Morning Mantra', path: '' }, { label: 'InvestorQ', path: '' },
                { label: 'Moneyversity', path: '' },{ label: 'Training Portal', path: '' },{ label: 'IIFL Model Portfolios', path: '' }
            ],
			subMenuOptionsMob: [
				{ label: 'Research Reports', path: '' }, { label: 'Morning Mantra', path: '' }, { label: 'InvestorQ', path: '' },
                { label: 'Moneyversity', path: '' },{ label: 'Training Portal', path: '' },{ label: 'IIFL Model Portfolios', path: '' }
            ]
        },
        {
            icon: 'utilities.svg', name: 'Utilities',
            description: 'Access MF back office and leads dashboard with simple click',
            subMenuOptions: [
                { label: 'ACE Backoffice', path: '' }, { label: 'Lead Dashboard (Zoho CRM)', path: '' }, { label: 'My Calendar', path: '' }, { label: 'Product Dashboard', path: '' }, { label: 'Forms & Formats', path: '' }, { label: 'Demat Request Forms', path: '' }
            ],
			subMenuOptionsMob: [
				{ label: 'ACE Backoffice', path: '' }, { label: 'Lead Dashboard (Zoho CRM)', path: '' }, { label: 'My Calendar', path: '' }, { label: 'Product Dashboard', path: '' }, { label: 'Forms & Formats', path: '' }, { label: 'Demat Request Forms', path: '' }
            ]
        },
        {
            icon: 'support.svg', name: 'Support & Feedback',
            description: 'Solve your queries with our chatbot and internal ticketing tool',
            subMenuOptions:  this.userTypeVal == 'RM' ? this.subMenuOptions2 : this.subMenuOptions1,
			subMenuOptionsMob: this.subMenuOptions1,
        },
        {
            icon: 'branding.svg', name: 'Branding',
            description: 'View digital creatives and request for branding material',
            subMenuOptions: [
                { label: 'Request Branding Material', path: '' }, { label: 'Image Branding', path: '' }
            ],
			subMenuOptionsMob: [
				{ label: 'Request Branding Material', path: '' }, { label: 'Image Branding', path: '' }
            ]
        }
    ]
    public isMobile = false;
	public subscription: any;
    public backOfficeLogout = URLS.backofficeLogout;
	private gatewaySubscriptionKey = environment['gatewaySubscriptionKey'];
    public fingerprintEnable = false;
	public md5: any;

	fanChildMenuOptions: any[] = [
        {
            icon: 'calculators.svg', name: 'Calculators',
            description: 'Calculate estimated returns for clients with our built in calculators',
            subMenuOptions: [
                { label: 'EMI Calculator', path: '' }, { label: 'SIP Calculator', path: '' }, { label: 'SIP Revenue', path: '' },
                { label: 'Span Margin', path: '' }, { label: 'Goal Calculator', path: '' }
            ],
			subMenuOptionsMob: [
                { label: 'EMI Calculator', path: '' }, { label: 'SIP Calculator', path: '' }, { label: 'SIP Revenue', path: '' },
                { label: 'Span Margin', path: '' }, { label: 'Goal Calculator', path: '' }
            ]
        },
        {
            icon: 'research.svg', name: 'Research & Learning',
            description: 'Check expert opinions on Markets and learn from our Edtech platform',
            subMenuOptions: [
                { label: 'Research Reports', path: '' }, { label: 'Morning Mantra', path: '' }, { label: 'InvestorQ', path: '' },
                { label: 'Moneyversity', path: '' },{ label: 'Training Portal', path: '' },{ label: 'IIFL Model Portfolios', path: '' }
            ],
			subMenuOptionsMob: [
                { label: 'Research Reports', path: '' }, { label: 'Morning Mantra', path: '' }, { label: 'InvestorQ', path: '' },
                { label: 'Moneyversity', path: '' },{ label: 'Training Portal', path: '' },{ label: 'IIFL Model Portfolios', path: '' }
            ]
        },
        {
            icon: 'utilities.svg', name: 'Utilities',
            description: 'Access MF back office and leads dashboard with simple click',
            subMenuOptions: [
                { label: 'ACE Backoffice', path: '' }, { label: 'Lead Dashboard (Zoho CRM)', path: '' }, { label: 'My Calendar', path: '' }, { label: 'Product Dashboard', path: '' },{ label: 'Forms & Formats', path: '' },{ label: 'Demat Request Forms', path: '' }
            ],
			subMenuOptionsMob: [
                { label: 'ACE Backoffice', path: '' }, { label: 'Lead Dashboard (Zoho CRM)', path: '' }, { label: 'My Calendar', path: '' }, { label: 'Product Dashboard', path: '' },{ label: 'Forms & Formats', path: '' },{ label: 'Demat Request Forms', path: '' }
            ]
        },
        {
            icon: 'support.svg', name: 'Support & Feedback',
            description: 'Solve your queries with our chatbot and internal ticketing tool',
            subMenuOptions:  this.userTypeVal == 'RM' ? this.subMenuOptions2 : this.subMenuOptions1,
			subMenuOptionsMob: this.subMenuOptions1,
        },
        {
            icon: 'branding.svg', name: 'Branding',
            description: 'View digital creatives and request for branding material',
            subMenuOptions: [
                { label: 'Request Branding Material', path: '' }, { label: 'Image Branding', path: '' }
            ],
			subMenuOptionsMob: [
                { label: 'Request Branding Material', path: '' }, { label: 'Image Branding', path: '' }
            ]
        }
    ]

    constructor(private platform: Platform, private router: Router, private commonService: CommonService, 
        public modalController: ModalController, 
        private storage: StorageServiceAAA,
        public faio: FingerprintAIO, public alertController: AlertController,
        private http: HttpClient, private authService: AuthenticationService,
        private navCtrl: NavController,private toast: ToasterService,
        public serviceFile: NewLoginService, private cookieService: CookieService,
        private investService: InvestService,
		private cipherText: CustomEncryption,private route: ActivatedRoute) { }

    ngOnInit() {

		this.storage.get('setClientCodes').then((clientCodes) => {
			if(clientCodes===null){
				this.commonService.getClientCodeList(localStorage.getItem('brokerageToken'));
			}
		});

		this.storage.get('isFanChild').then(isChild => {
			if(isChild == 'true'){
				this.menuOptions = [];
				this.menuOptions = this.fanChildMenuOptions;
			}
		});

		// this.route.queryParams.subscribe(params => {
		// 		if(params.route == 'from-dashboard'){
			// this.confirmLogout();
		// 			this.toast.displayToast('Back to exit / Home to minimize');
		// 		}
		// 	}
		// );

		// this.router.events.forEach((event) => {
		// 	if(event instanceof NavigationStart) {
		// 	  if (event.navigationTrigger === 'popstate') {
		// 		if(this.router.url == '/more?route=from-dashboard'){
		// 			this.router.navigate(['/dashboard']);
		// 		}
		// 	  }
		// 	}
		//   });
      
        this.storage.get('deviceLock').then( isLock => {
			this.fingerprintEnable = isLock === true ? true : false;
		})
		this.isMobile = this.commonService.isApp() ? true : false;
        this.commonService.analyticEvent('Home_More', 'Home More');
        this.storage.get('userType').then(type => {
            this.userType = type;
        })
        this.storage.get('userID').then((ID) => {
            this.userID = ID;
        })
    }

    // toggleDetail(dataObj) {
    //     dataObj['isVisible'] = !dataObj['isVisible']
    // }

    // dropClick(val, index, arr){
	dropClick(index: any, arr: any) {
		// event.preventDefault();
		arr.forEach((element: any, ind: any) => {
			if ((index) !== ind) {
				element['isVisible'] = false;
			} else {
				element['isVisible'] = element['isVisible'] ? false : true;
			}
		});
    }
    
    changeOption(event: any) {
		if (event) {
			// call finger print access function
			this.fingerPrintAccess();
		} else {
			// do nothing.
			this.storage.set('deviceLock', false);
		}
    }
    
    public fingerPrintAccess() {
		let fingerPrintAvail = this.faio.isAvailable();
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
								// this.storage.set('safetyLock', this.loginPinInput);
								this.storage.set('deviceLock', true);
								//Quick Login has successfully Enabled.
							} else {
								this.storage.set('deviceLock', false);
							}
						})
						.catch((error: any) => {
							// console.log(error);
							// this.toast.displayToast('Please enable the Fingerprint feature in your mobile');
							console.log('Please enable the Fingerprint/FaceID feature in your mobile ');
						});
				}
			}).catch(() => {
				// this.commonService.toastFuntion("Fingerprint/ FaceID authorization is not available on this device");
				console.log('Fingerprint/ FaceID authorization is not available on this device')
			});

	}

    navigateOtherPage(option: any){
        // console.log(option);
        if(option == 'Wire Request'){
            this.router.navigate(['/wire-requests/limit-change']);
        }
        // else if(option == 'Wire Reports'){
        //     this.router.navigate(['/view-reports']);
        // }
        else if(option == 'Pay Details'){
            this.commonService.setClevertapEvent('PayDetails');
            this.router.navigate(['/pay-details']);
        }
		else if (option == 'Foliowise Client Details') {
			this.commonService.setClevertapEvent('Foliowise_Clicked', { 'PartnerCode': localStorage.getItem('userId1') });
			this.router.navigate(['/folio-wise-details']);
		}
        else if(option == 'Research Reports'){
            this.router.navigate(['/research-reports']);
        }
		else if(option == 'IIFL Model Portfolios'){
            this.router.navigate(['/risk-profile']);
        }
        else if(option == 'Morning Mantra'){
            const url = researchReport['morningMantra']['url'];
                this.addEventsListenerFun(url)
        }
        else if (option === 'InvestorQ') {
			this.commonService.analyticEvent('More_IQ', 'InvestorQ');
			this.commonService.setClevertapEvent('InvestorQ');
			const url = "https://investorq.com/?utm_source=AAA&utm_medium=AAA_Tab&utm_campaign=AAA_button"
			this.addEventsListenerFun(url)
        }
        else if (option === 'Moneyversity') {
            this.commonService.analyticEvent('More_Moneyversity', 'MoneyVersity');
            this.commonService.setClevertapEvent('Moneyversity');
            const url = " http://Iiflmoneyversity.edcast.com"
            this.addEventsListenerFun(url)
        }
		else if (option === 'Training Portal') {
            this.commonService.analyticEvent('More_Training_Portal', 'Training Portal');
            this.commonService.setClevertapEvent('Training Portal');
            const url = "https://www.indiainfoline.com/business-partners/training.html?param=AAA"
            this.addEventsListenerFun(url)
        }
        // else if(option === 'Raise A Query'){
        //     this.router.navigate(['/raise-query']);
		// 	// this.commonService.setClevertapEvent('Support&Feedback_RaiseQuery');
		// 	// const url = "https://raiseaquery.iifl.com/"
		// 	// this.addEventsListenerFun(url)
        // }
        else if(option === 'Partner Queries'){
			this.commonService.setClevertapEvent('Partner_Queries_Clicked');
            this.router.navigate(['/help-partner-query']);
        }
		else if (option === 'Help') {
			if (localStorage.getItem('crmToken')) {
				this.commonService.setClevertapEvent('Help_Clicked');
				this.router.navigate(['/help-support']);
			} else {
				this.serviceFile.getCrmToken().subscribe((res:any) => {
					localStorage.setItem('crmToken', res['Body']['Token']);
					this.commonService.setClevertapEvent('Help_Clicked');
					this.router.navigate(['/help-support']);
				});
			}
		}
        else if(option == 'Raise An IT Ticket'){
            this.commonService.setClevertapEvent('Support&Feedback_RaiseTicket');
            const url = "https://techconnect.iifl.in"
            this.addEventsListenerFun(url)
        }
        else if (option === 'Call For Support') {
            this.callForSupport();
           // this.router.navigate(['/support-feedback']);
        }
        else if (option === 'EMI Calculator') {
            this.commonService.setClevertapEvent('Calculators');
            if (this.platform.is('desktop')) {
                this.router.navigate(['/calculators', 'emi']);
            }
            else{
                this.router.navigate(['/emi-calculator']);
            }
        }
        else if (option === 'SIP Calculator') {
            if (this.platform.is('desktop')) {
                this.router.navigate(['/calculators', 'sip']);
            }
            else{
                this.router.navigate(['/sip-calculator']);
            }
        }
        else if (option === 'SIP Revenue') {
            if (this.platform.is('desktop')) {
                this.router.navigate(['/calculators', 'sipRevenue']);
            }
            else{
                this.router.navigate(['/sip-revenue-calculator']);
            }
        }
        else if (option === 'Span Margin') {
            if (this.platform.is('desktop')) {
                this.router.navigate(['/calculators', 'spanMargin']);
            }
            else{
                this.router.navigate(['/span-margin-calculator']);
            }
        }
        else if (option === 'Goal Calculator') {
            if (this.platform.is('desktop')) {
                this.router.navigate(['/calculators', 'goal']);
            }
            else{
                this.router.navigate(['/goal-calculator']);
            }
        }
        else if (option === 'ACE Backoffice') {
           this.commonService.navigateToACEBackOffice();
        }
        else if (option === 'Lead Dashboard (Zoho CRM)') {
            this.commonService.setClevertapEvent('ZohoCRM');
            this.commonService.analyticEvent('More_Zoho_CRM', 'Zoho CRM in More');
            const url = "https://crm.zoho.com/"
            this.addEventsListenerFun(url)
		} else if (option === 'Forms & Formats') {
			this.openPopup();
		} else if (option === 'Demat Request Forms') {
			this.openDematPopup();
		}
        else if (option === 'My Calendar') {
			const url = 'https://calendar.zoho.com/mycalendar';
			this.addEventsListenerFun(url)	
        }
		else if (option === 'Product Dashboard') {
			const url = 'https://images.indiainfoline.com/mailers/factsheet-2023/iifl-dashboard.html';
			this.addEventsListenerFun(url)	
        }
        else if (option === 'Request Branding Material') {
            const url = 'https://zfrmz.com/PU6L7HG1fumonwZaYSlU';
            this.addEventsListenerFun(url)	
        }
        else if (option === 'Image Branding') {
			this.commonService.navigateToImageBrading();
		}
    }
	
    public openAccount() {
		this.commonService.setClevertapEvent('OpenAccount_CTA');
		this.addUser();
	}

	async openPopup() {
		const modal = await this.modalController.create({
			component: FormFormatComponent,
			cssClass: 'ipo-modal'
		});

		modal.onDidDismiss().then(data => {
			console.log(data);
		})
		return await modal.present();
	}

    async addUser() {
		const modal = await this.modalController.create({
			component: AddUserComponent,
			cssClass: 'add-user'
		});

		modal.onDidDismiss().then((data) => {
			if (data['data']) {
				const type = data['data']['type'];
				this.getClientAuthToken(type);
			}
		})
		return await modal.present();
	}

	private genCheckSum(blob: any) {
		blob = blob.trim();
		const newblob = CryptoJS.enc.Utf8.parse(blob);
		const hash = CryptoJS.MD5(newblob);
		const md5 = hash.toString(CryptoJS.enc.Hex)
		this.md5 = md5;
		this.md5 = this.md5.slice(0,this.md5.length / 2);
		return this.md5.toUpperCase();
	  }

    public getClientAuthToken(addUser: any) {
		this.subscription = new Subscription();
		this.storage.get('userID').then((ID) => {
			var todayValue: any;
			var today = new Date();
			let dd = String(today.getUTCDate());
			let ddate = today.getUTCDate();
			let mm = String(today.getUTCMonth() + 1);
			let month = today.getUTCMonth() + 1;
			let yyyy = today.getUTCFullYear().toString().substring(2, 4);
			if (ddate < 10) {
				dd = '0' + dd;
			}
			if (month < 10) {
				mm = '0' + mm;
			}
        	todayValue = dd.toString() + mm.toString() + yyyy;
			let IP = "10.150.10.1";
			let appSource = "AAA";
			let parameter = this.encryptCode(ID).trim() + IP.trim() + appSource.trim() + todayValue;
			this.storage.get('userType').then((type) => {
				let userValue:any | null = null;
				if (type === 'RM' || type === 'FAN') {
					userValue = type;
				} else if (type === 'SUB BROKER') {
					userValue = 'SubBroker';
				}
				const obj = {
					"head": {
						"checkSum": this.genCheckSum(environment['checkSumKEY'] + parameter),
						"appSource": "AAA"
					},
					"body": {
						"ip": "10.150.10.1",
    					"LoginId": this.encryptCode(ID)
					}
				}
				this.subscription.add(
					this.investService
						.getUserAuthe(obj)
						.subscribe((response: any) => {
							if (response && response['data'] && response['data'].length) {
								let paramStr = this.encryptCode(ID).trim() + appSource.trim() + todayValue;
											let param = {
												"LoginId": this.encryptCode(ID),
												"Token": response['data'],
												"AppSource": appSource,
												"Checksum": this.genCheckSum(environment['checkSumKEY'] + paramStr),
											}
										if (addUser === 'addClient') {
											this.commonService.setClevertapEvent('OpenAccount_NonIndividualClient');
											this.commonService.OpenWindowWithPost(investObj['addUser']['addClientURL'], '_blank', param);
										} else if (addUser === 'ICA') {
											this.commonService.setClevertapEvent('OpenAccount_IndividualClient');
											this.commonService.OpenWindowWithPost(investObj['addUser']['addICA'], '_blank', param);
										} else if (addUser === 'advisor') {
											this.commonService.setClevertapEvent('OpenAccount_RegisterAdvisor');
											this.commonService.OpenWindowWithPost(investObj['addUser']['addSubbrokerURL'], '_blank', param);
										} else if (addUser === 'NRI') {
											this.commonService.setClevertapEvent('OpenAccount_NRIClient');
											const url = investObj['addUser']['addNRI'];
											window.open(url);
										} else {
											return;
										}
							}
						})
				)
			})
		})
	}

	public encryptCode(clientCode: any){
		let clearText = clientCode;
			let encryptionKey = CryptoJS.enc.Utf8.parse('IIFV2AAAAP0223PD');
			let salt = CryptoJS.enc.Base64.parse('SXZhbiBNZWR2ZWRldg=='); 
			
			let iterations = 1000; 
			let keyAndIv = CryptoJS.PBKDF2(encryptionKey, salt, { keySize: 256/32 + 128/32, iterations: iterations, hasher: CryptoJS.algo.SHA1 }); 
			let hexKeyAndIv = CryptoJS.enc.Hex.stringify(keyAndIv);
			let key = CryptoJS.enc.Hex.parse(hexKeyAndIv.substring(0, 64));
			let iv = CryptoJS.enc.Hex.parse(hexKeyAndIv.substring(64, hexKeyAndIv.length));
			let encryptedStr = CryptoJS.AES.encrypt(CryptoJS.enc.Utf16LE.parse(clearText), key, {iv: iv}).toString();
			return encryptedStr;
	}

	public encryptTest(clientCode: any){
		let clearText = clientCode;
			let encryptionKey = CryptoJS.enc.Utf8.parse('IIFV2SPBNI11888');
			let salt = CryptoJS.enc.Base64.parse('SXZhbiBNZWR2ZWRldg=='); 
			let iterations = 1000; 
			let keyAndIv = CryptoJS.PBKDF2(encryptionKey, salt, { keySize: 256/32 + 128/32, iterations: iterations, hasher: CryptoJS.algo.SHA1 }); 
			let hexKeyAndIv = CryptoJS.enc.Hex.stringify(keyAndIv);
			let key = CryptoJS.enc.Hex.parse(hexKeyAndIv.substring(0, 64));
			let iv = CryptoJS.enc.Hex.parse(hexKeyAndIv.substring(64, hexKeyAndIv.length));
			let encryptedStr = CryptoJS.AES.encrypt(CryptoJS.enc.Utf16LE.parse(clearText), key, {iv: iv}).toString();
			return encryptedStr;
	}
	goToDashboard() {
		this.router.navigate(['/dashboard']);
	}
	

      //common function for addevent listner in isAPP and ios
    addEventsListenerFun(url: any){
        if (this.commonService.isApp() && this.platform.is('ios')) {
            var ref = cordova.InAppBrowser.open(url, '_blank');

            ref.addEventListener('loadstart', this.loadstartCallback);
            ref.addEventListener('loadstop', this.loadstopCallback);
            ref.addEventListener('loaderror', this.loaderrorCallback);
            ref.addEventListener('exit', this.exitCallback);
        } else {
            window.open(url, '_blank');
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

    //call for support popup 
    async callForSupport(){
        const modal = await this.modalController.create({
            component: SupportComponent,
            cssClass: 'superstars support',
            componentProps: {}
        });
        return await modal.present();
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
	goToRequest() {
        this.router.navigate(['/wire-requests/limit-change']);
    }
	goToCirculars() {
        this.router.navigate(['/circulars']);
    }

	async openDematPopup() {
		const modal = await this.modalController.create({
			component: DematRequestFormsComponent,
			cssClass: 'ipo-modal demat-modal'
		});
		modal.onDidDismiss().then(data => {
			console.log(data);
		})
		return await modal.present();
	}

	ngOnDestroy(): void {
		if(this.subscription){
			this.subscription = this.subscription.unsubscribe();
		}
	}

}
