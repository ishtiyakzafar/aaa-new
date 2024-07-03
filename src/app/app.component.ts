import { Component, HostListener, NgZone } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Platform, NavController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ScreensizeService } from './helpers/screensize.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { NoInternetPopupComponent } from './no-internet-popup/no-internet-popup.component';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { CleverTap } from '@ionic-native/clevertap/ngx';
import { ToasterService } from './helpers/toaster.service';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { Location } from '@angular/common';
import { StorageServiceAAA } from './helpers/aaa-storage.service';
import { SessionExpiredComponent } from './components/session-expired/session-expired.component';
import { AnalyticsService } from './helpers/analytics.service';
import { UpdateVersionService } from './helpers/updateversion.service';
import { register } from 'swiper/element/bundle';
register();

@Component({
	selector: 'app-root',
	providers: [AnalyticsService, UpdateVersionService],
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss']
})
export class AppComponent {

	public lastBack = null;
	public internetModal: any;
	public getFeed: any;
	newValue: any
	oldValue: any;
	seconds: any;
	timeDiff: any;
	timeArray: any[] = [];
	alertOpen:boolean = false;
	constructor(
		private platform: Platform,
		private splashScreen: SplashScreen,
		private statusBar: StatusBar,
		private storage: StorageServiceAAA,
		private screensize: ScreensizeService,
		private navCtrl: NavController,
		public route: Router,
		private titleService: Title,
		private ngZone: NgZone,
		private network: Network,
		private alertController: AlertController,
		public modalController: ModalController,
		private analytics: AnalyticsService,
		private updateVerSer: UpdateVersionService,
		private firebaseX: FirebaseX,
		private mobClevertap: CleverTap,
		private toast: ToasterService,
		public faio: FingerprintAIO,
		private _location: Location
	) {
		if (!localStorage.getItem('jwtToken') && window.location.href.includes('#')) {
			localStorage.setItem('jwtToken', window.location.href.split('#')[1].split("access_token=")[1].split("&")[0]);
		}
		this.platform.backButton.subscribeWithPriority(10, () => {
			
			if(window.location.pathname == '/login' || window.location.pathname == '/dashboard' ){
				if(!this.alertOpen){
					this.showExitConfirm();
				}
					
				
			}
			else{
				this._location.back();
				//window.history.back();
			}
		})
		clearTimeout(this.getFeed);
		this.initializeApp();
		// console.log(document.location.pathname);
		// // store location path last navigation
		// localStorage.setItem('path', document.location.pathname);
	}

	showExitConfirm() {
		this.alertOpen = true;
		this.alertController.create({
		  message: 'Do you want to close the app?',
		  backdropDismiss: false,
		  buttons: [{
			text: 'Close',
			role: 'cancel',
			handler: () => {
				this.alertOpen = false;
			//   console.log('Application exit prevented!');
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

	initializeApp() {
		this.platform.ready().then(() => {
			this.statusBar.styleDefault();
			this.statusBar.backgroundColorByHexString('#524091');
			this.statusBar.styleLightContent();
			this.statusBar.overlaysWebView(false);
			this.splashScreen.hide();
			this.mobClevertap.notifyDeviceReady();

			// const path = window.location.pathname;
			// if (path === '/') this.navCtrl.navigateRoot(['/markets'])
			// else this.navCtrl.navigateRoot([path]);
			this.screensize.onResize(this.platform.width());
			// window.console.log = function() {};

			this.ngZone.run(() => {
				this.storage.get('token').then((response) => {
					if (response) {
						this.storage.get('deviceLock').then( isLock => {
							if (isLock) {
								this.fingerPrintAccess();
							} else {
								// alert(response+ 'succss');
		
								const path = window.location.pathname;
								// if (path === '/sign-in') {
								//   this.route.navigateByUrl(path);
								// } else {
								// console.log(path, 'path');
		
								if (path === '/login') {
									// console.log('login');
									// if(this.platform.is('desktop')){
									// 	this.navCtrl.navigateRoot(['/dashboard'])
									// }
									// else{
									// 	this.navCtrl.navigateRoot(['/login'])
									// }
									// this.route.navigate(['/dashboard']);
									this.navCtrl.navigateRoot(['/login'])
								} else {
									if(window.location.pathname == '/family-portfolio'){
										this.route.navigate(['/dashboard']);	
									}
									else{
										//this.navCtrl.navigateRoot([path]);
									}
									// console.log('----path----');
									// this.route.navigate([path]);
									// this.navCtrl.navigateRoot([path]);
								}
							}
						})
						// }
					} else {
						const path = window.location.pathname;
						// if(location.hostname.includes('360')){
						// 	if(location.pathname == '/login'){
						// 		this.route.navigate(['/family-portfolio']);
						// 	}
						// 	else{
						// 		this.navCtrl.navigateRoot([path]);
						// 	}
						// }
						if (!this.platform.is('desktop')) {
							localStorage.clear();
						}
						
						// if (path === '/sign-in') {
						//   this.route.navigateByUrl(path);
						// } else {
						// }
						// console.log('path with no response');

						//this.route.navigate(['/login']);
						// console.log('no response');

					}

					this.checkTime();
				})
				// console.log(this.firebaseX)
				// this.firebaseX.grantPermission()
				this.firebaseX['setAnalyticsCollectionEnabled'](true);
				// this.firebaseX.logError('App crashed')
				this.fetchRemoteConfig();
			})

			// this.navCtrl.navigateRoot(['/login'])
			// if (path === '/') 
			// else this.navCtrl.navigateRoot([path]);
			this.screensize.onResize(this.platform.width());
		});
		// watch network for a disconnection
		let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
			// console.log('no internet');

			this.noInternet();
		});

		// stop disconnect watch
		// disconnectSubscription.unsubscribe();


		// watch network for a connection
		let connectSubscription = this.network.onConnect().subscribe(() => {
			// We just got a connection but we need to wait briefly
			// before we determine the connection type. Might need to wait.
			// prior to doing any api requests as well.
			// console.log('connect', this.network);

			if (this.network.type === 'wifi') {
				setTimeout(() => {
					this.internetModal.dismiss();
				}, 3000);
			} else {
				this.internetModal.dismiss();
			}
		});



		// google analytic 
		this.analytics.init();
	}
	public fingerPrintAccess(data?: any,skipLogin?: any) {
		let fingerPrintAvail = this.faio.isAvailable();
		// console.log(fingerPrintAvail, 'fingerPrintAvail');
		this.faio.isAvailable()
			.then(result => {
				if (result === "finger" || result === "face" || result === "biometric") {
					this.faio.show({
						title: 'Please verify to login',
						// clientSecret: 'password', //Only necessary for Android
						disableBackup: true,  //Only for Android(optional)
						fallbackButtonTitle: 'Use Pin', //Only for iOS
						// localizedReason: 'Please authenticate' //Only for iOS
					})
						.then((result1: any) => {
							// alert(result1 + ' Success RESULT  ');
							if (result1 == 'biometric_success') {
								// this.storage.set('safetyLock', this.loginPinInput);
								// this.storage.set('deviceLock', true);
								this.navCtrl.navigateRoot(['/dashboard']);
								//Quick Login has successfully Enabled.
							} else {
								// console.log(' Storage clear ');
								this.storage.set('deviceLock', false);
								this.storage.clear();
								this.navCtrl.navigateRoot(['/login']);
							}
							// localStorage.setItem('fingerprintdata', result.withFingerprint);

							// console.log(localStorage.getItem('fingerprintdata'));
							//alert("Successfully Authenticated!")
						})
						.catch((error: any) => {
							// console.log('Please enable the Fingerprint/FaceID feature in your mobile ' , error);
							this.navCtrl.navigateRoot(['/login']);
							// this.toast.displayToast('Please enable the Fingerprint feature in your mobile');

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
			}).catch((err) => {
				// console.log('Fingerprint/ FaceID authorization is not available on this device', err);
				// this.navCtrl.navigateRoot(['/login']);
				// this.commonService.toastFuntion("Fingerprint/ FaceID authorization is not available on this device");
			});

	}

	@HostListener('window:resize', ['$event'])
	private onResize(event: any) {
		this.screensize.onResize(event.target.innerWidth);
	}

	async presentAlert() {
		const alert = await this.alertController.create({
			header: 'No Internet Connection',
			message: 'Please Check Your Internet Connection!.',
			buttons: [
				{
					text: 'Retry',
					role: 'retry',
					cssClass: 'secondary',
					handler: () => {
						if (this.network.type === 'none') {
							this.presentAlert();
						}
					}
				}
			]
		});
		if (alert) {
			alert.dismiss();
		}
		alert.present();
	}

	// No Internet Connection Popup
	async noInternet() {
		// const element = await this.internetModal.getTop();
		// if (element !== null && element !== undefined) {
		//   element.dismiss();
		// }
		if (this.internetModal) {
			const element = await this.internetModal.getTop();
			element.dismiss();
		}
		this.internetModal = await this.modalController.create({
			backdropDismiss: false,
			component: NoInternetPopupComponent,
			cssClass: 'overlay-modal',
		});
		this.internetModal.onDidDismiss()
			.then((data: any) => {
				this.internetModal = undefined;
			}
			);
		return await this.internetModal.present();
	}

	public checkTime() {
		this.storage.get('loginTime').then(value => {
			if (value) {
				this.newValue = new Date();
				this.oldValue = new Date(value);
				var diff = (this.newValue.getTime() - this.oldValue.getTime());
				var res = Math.abs(this.newValue - this.oldValue) / 1000;
				// Epoche Time Difference
				this.timeDiff = (Math.abs(this.newValue - this.oldValue) / 1000);
				// var days = Math.floor(res / 86400);

				// // get hours        
				// var hours = Math.floor(res / 3600) % 24;

				// // get minutes
				// var minutes = Math.floor(res / 60) % 60;
				// // get seconds
				// this.seconds = res % 60;


				// calculate 8 hours (60*60*8 = 28800) after session start
				if (parseInt(this.timeDiff) > 28800) {
					
					// push the time to array which is more than 28800
					this.timeArray.push(parseInt(this.timeDiff));
					clearTimeout(this.getFeed);
					if (parseInt(this.timeDiff) == this.timeArray[this.timeArray.length-1])
						this.storage.get('userType').then(user => {
							// this.sessionExpired(user);
							if (this.platform.is('desktop')) {
								this.storage.clear();
								localStorage.clear();
								this.toast.displayToast('Session has Expired Please Login Again');
								this.route.navigateByUrl('/login')
							}
							else{
								this.storage.clear();
								localStorage.clear();
								localStorage.setItem('sessionExpire', 'true');
								this.toast.displayToast('Session has Expired Please Login Again');
								this.route.navigateByUrl('/login')
								// this.storage.get('deviceLock').then( isLock => {
								// 	this.fingerPrintAccess();
								// })
							}
						})
				}
			}
			clearTimeout(this.getFeed);
			this.getFeed = setTimeout(() => {
				this.checkTime();
			}, 1000)
		})
	}

	async sessionExpired(user: any) {
		this.modalController.dismiss();
		const modal = await this.modalController.create({
			component: SessionExpiredComponent,
			backdropDismiss: false,
			cssClass: 'forgot-password-popup-mobile session-expired',
			componentProps: {
				userType: user
			}
		});
		// this.storage.clear();

		/* modal.onDidDismiss().then((data) => {
			if (data['data']) {
				console.log(data['data']);

			}
		}) */

		return await modal.present();
	}

	async fetchRemoteConfig() {
		await this.firebaseX.fetch().then(result => {
			this.firebaseX.activateFetched().then(xyz => {
				this.firebaseX.getValue("app_update_versions").then(value => {
					// alert(value + "app_update_versions");
					// console.log("app_update_versions", value);
					if (value) {
						let app_version = JSON.parse(value);
						this.updateVerSer.checkVersionUpdate(app_version);
						// console.log(app_version);
					}
				})
			})
		})
	}

	// public setTitle( newTitle: string) {
	//   this.titleService.setTitle( newTitle );
	// }
}
