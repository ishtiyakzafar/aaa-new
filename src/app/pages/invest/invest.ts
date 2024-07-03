import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
// import { IonSlides, ModalController, PopoverController, Platform } from '@ionic/angular';	review
import { ModalController, PopoverController, Platform } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { forkJoin, Subscription } from 'rxjs';
import { InvestService } from './invest.service';
import * as _ from 'lodash';    
// import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ToasterService } from '../../helpers/toaster.service';
import { WireRequestService } from '../wire-requests/wire-requests.service';
import * as CryptoJS from 'crypto-js';
import { URLS } from '../../../config/api.config';
import { AddUserComponent } from '../../components/add-user/add-user.component';
import { CustomEncryption } from '../../../config/custom-encrypt';
import { MarketService } from '../markets/markets.service';
import { environment, investObj } from '../../../environments/environment';
import { CommonService } from '../../helpers/common.service';
import { SearchComponent } from '../../components/search/search.component';
import { MutualFundProductsMoreComponent } from '../../components/mutual-fund-products-more/mutual-fund-products-more.component';
import { ComingSoonPopoverComponent } from '../../components/coming-soon-popover/coming-soon-popover.component';
import { IndicesDetailsComponent } from '../../components/indices-details/indices-details.component';
import { IpoComponent } from '../../components/ipo/ipo.component';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

declare var cordova: any;
@Component({
	selector: 'app-tab3',
	templateUrl: 'invest.html',
	providers: [CustomEncryption, InvestService, MarketService],
	styleUrls: ['invest.scss']
})
export class Tab3Page implements OnDestroy {
	//@ViewChild('Slides', { static: false }) slider: any;	//IonSlides;
	// @ViewChild('slidesUpdated', { static: false }) sliderUpdated: any;	// IonSlides;
	@ViewChild('slidesUpdated') sliderUpdated: ElementRef | undefined;	// IonSlides;
	@ViewChild('Slides') slider: ElementRef | undefined;


	sliderIndex: any = 0;
	sliderUpdatedIndex: number = 0;
	checkupList: any = [];
	goldenPiUrl?:SafeResourceUrl;
	slideOpts: any = {
		initialSlide: 0,
		slidesPerView: 1.5,
		speed: 400,
		arrow: false,
	};

	public overlayVisible = false;
	public displayHeader: any = [];
	public clearHeaderDetails: any = null;
	public profileDetails: any;

	urlParameter: any = null;
	segmentID: any = null;

	public isRMFAN = false;

	datPipe = new DatePipe('en-US');

	public selectedClientCode: any = null;

	public isProd = environment['production'];

	private subscription = new Subscription();
	public clientAuthObj: any = null;
	public equityBlockTabValue: any = null;
	public buttonData: any[] = [
		{ name: 'Equity', value: 'equity' },
		{ name: 'Mutual Funds', value: 'mutual' },
		{ name: 'Insurance', value: 'insurance' },
		{ name: 'Bonds', value: 'bonds' },
		{ name: 'Other Products', value: 'other' }
	]

	public bondData: any[] = [
		{ icon: 'primary_bonds.svg', cardName: 'Primary Bonds', key: 'PrimaryBond' },
		{ icon: 'secondary_bonds.svg', cardName: 'Secondary Bonds', key: 'secondaryBonds' },
		{ icon: 'third_party_bonds.svg', cardName: 'Third Party Bonds', key: 'bonds' }
	]
	public equityData: any[] = [
		// { icon: 'logo_fp.svg', cardName: 'Financial Plan 360', key: 'fp_360' },
		{ icon: 'small_case.svg', cardName: 'Smallcase', key: 'small_case' },
		{ icon: 'ipo_updated1.svg', cardName: 'IPO', key: 'ipo' },
		// { icon: 'financial_updated.svg', cardName: 'Financial Health Checkup', key: 'health_checkup' },
		// { icon: 'narnolia.svg', cardName: 'Narnolia', key: 'narnolia' },
		{ icon: 'grobox.svg', cardName: 'Grobox', key: 'grobox' },
		// { icon: 'wealthBaskets.svg', cardName: 'WealthBaskets', key: null },
		// { icon: 'discount.svg', cardName: 'Offer for Sale', key: null },
		// { icon: 'buyBack.svg', cardName: 'Buy Back', key: null }
		{ icon: 'InvestEdge-Logo.png', cardName: 'InvestEdge', key: 'invest_edge' }
	]

	public mutualData: any[] = [
		{ icon: 'start_sip.svg', cardName: 'Start SIP', key: 'start_sip' },
		{ icon: 'invest_lumpsum.svg', cardName: 'Invest Lumpsum', key: 'invest_lump' },
		{ icon: 'nfo_fmp_22.svg', cardName: 'NFO/FMP', key: 'nfo_fmp' },
		{ icon: 'transfer_holdings.svg', cardName: 'Transfer Holdings', key: 'trans_hold' },
		{ icon: 'mutfund_monitor.svg', cardName: 'Mutual Fund Monitor', key: 'fund_monitor' },
		{ icon: 'invest_basket.svg', cardName: 'Investment Baskets', key: 'invest_basket' },
		//{ icon: 'goal_planner.svg', cardName: 'Goal Based Investment Planner', key: 'goal_planner' },
		//{ icon: 'mutuafund_web.svg', cardName: 'Mutual Fund Website', key: 'mut_fund_web' },
	]

	public insuranceData: any[] = [
		// { icon: 'health_insu.svg', cardName: 'Health Insurance', key: 'health_insu' },
		// { icon: 'term_insu.svg', cardName: 'Term Insurance', key: 'term_insu' },
		// { icon: 'car_insu.svg', cardName: 'Car Insurance', key: 'car_insu' },
		// { icon: 'top_up_health.svg', cardName: 'Top Up Health Insurance', key: 'top_up' },
		// { icon: 'motorcycle.svg', cardName: 'Two Wheeler Insurance', key: 'two_wheeler' },
		{ icon: 'mutuafund_web.svg', cardName: 'Insurance website', key: 'web_insu' },
		{ icon: 'new_business_mapping.png', cardName: 'New Business Mapping', key: 'new-mapping' },
		{ icon: 'renew_business_mapping.png', cardName: 'Renewal Business Mapping', key: 'renewal-mapping' },
	]

	public otherData: any[] = [
		{ icon: 'fixed_depo.svg', cardName: 'Fixed Deposit', key: 'fix_deposit' }
	]

	constructor(public modalController: ModalController,
		private router: Router,
		private storage: StorageServiceAAA,
		private cipherText: CustomEncryption,
		private platform: Platform,
		private marService: MarketService,
		public investService: InvestService,
		private toast: ToasterService,
		private popoverController: PopoverController,
		private commonService: CommonService,
		private locationn: Location,
		private route: ActivatedRoute,
		private wireReqService: WireRequestService,
		public sanitizer: DomSanitizer
		// private iab: InAppBrowser
	) {
		router.events.forEach((event) => {
			this.platform.backButton.subscribeWithPriority(10, () => {
				if (this.equityBlockTabValue === 'bonds') {
					this.dismissIframe();
				}
			});
		});
	}

	segmentChange(event: any) {
		if (this.equityBlockTabValue === 'equity') {
			this.sliderUpdatedIndex = 0;
			this.sliderUpdated?.nativeElement.swiper.slideTo(this.sliderUpdatedIndex);
		} else if (this.equityBlockTabValue === 'mutual') {
			this.sliderUpdatedIndex = 1;
			this.sliderUpdated?.nativeElement.swiper.slideTo(this.sliderUpdatedIndex);
		} else if (this.equityBlockTabValue === 'insurance') {
			this.sliderUpdatedIndex = 2;
			this.sliderUpdated?.nativeElement.swiper.slideTo(this.sliderUpdatedIndex);
		} else if (this.equityBlockTabValue === 'bonds') {
			this.sliderUpdatedIndex = 3;
			this.sliderUpdated?.nativeElement.swiper.slideTo(this.sliderUpdatedIndex);
		}
		 else if (this.equityBlockTabValue === 'other') {
			this.sliderUpdatedIndex = 4;
			this.sliderUpdated?.nativeElement.swiper.slideTo(this.sliderUpdatedIndex);
		}
	}

	// for mobile when slide change get slide index value, and do functionality on base that
	async slideChanged(ev: any) {
		ev.preventDefault();
		ev.stopPropagation();
		this.sliderUpdatedIndex = await this.sliderUpdated?.nativeElement.swiper.activeIndex;

		if (this.sliderUpdatedIndex === 0) {
			this.equityBlockTabValue = 'equity';
		} else if (this.sliderUpdatedIndex === 1) {
			this.equityBlockTabValue = 'mutual';
		} else if (this.sliderUpdatedIndex === 2) {
			this.equityBlockTabValue = 'insurance';
		} else if (this.sliderUpdatedIndex === 3) {
			this.equityBlockTabValue = 'bonds';
		} else if (this.sliderUpdatedIndex === 4) {
			this.equityBlockTabValue = 'other';
		}
	}

	ionViewWillEnter() {
		this.overlayVisible = false;
		this.locationn.replaceState('/invest');
		this.commonService.analyticEvent('Home_Invest', 'Invest');
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.isRMFAN = true;
			} else this.isRMFAN = false;
		})

		this.urlParameter = this.route.params.subscribe(params => {
			this.segmentID = params['id'] || 'equity';
		});
		// console.log(this.segmentID);
		if (this.segmentID == 'equity' || this.segmentID == 'fp360' ||this.segmentID == 'narnolia'|| this.segmentID == 'grobox' || this.segmentID == 'smallCase' || this.segmentID == 'financial' || this.segmentID == 'ipo' || this.segmentID == "invest_edge") {
			setTimeout(() => {
				if (this.segmentID == 'fp360') {
					this.equityLinks('fp_360');
				} else if (this.segmentID == 'smallCase') {
					this.equityLinks('small_case');
				} else if (this.segmentID == 'financial') {
					this.equityLinks('health_checkup');
				} else if (this.segmentID == 'ipo') {
					this.equityLinks('ipo');
				} else if (this.segmentID == 'narnolia') {
					this.equityLinks('narnolia');
				} else if (this.segmentID == 'grobox') {
					this.equityLinks('grobox');
				} else if (this.segmentID == 'invest_edge') {
					this.equityLinks('invest_edge');
				}
			}, 100);
			this.equityBlockTabValue = 'equity';
		}
		else if (this.segmentID == 'mutual' || this.segmentID == 'startSIP' || this.segmentID == 'lumpsum' || this.segmentID == 'nfo' || this.segmentID == 'transferHold' || this.segmentID == 'fundMonitor' || this.segmentID == 'investBasket' || this.segmentID == 'goalPlan' || this.segmentID == 'fundWeb') {
			setTimeout(() => {
				let ev: any;		//Event; review. was getting errorr of not assigned
				if (this.segmentID == 'startSIP') {
					this.mutalFundLinks(ev, 'start_sip');
				}
				else if (this.segmentID == 'lumpsum') {
					this.mutalFundLinks(ev, 'invest_lump');
				}
				else if (this.segmentID == 'nfo') {
					this.mutalFundLinks(ev, 'nfo_fmp');
				}
				else if (this.segmentID == 'transferHold') {
					this.mutalFundLinks(ev, 'trans_hold');
				}
				else if (this.segmentID == 'fundMonitor') {
					this.mutalFundLinks(ev, 'fund_monitor');
				}
				else if (this.segmentID == 'investBasket') {
					this.mutalFundLinks(ev, 'invest_basket');
				}
				else if (this.segmentID == 'goalPlan') {
					this.getClientAuthToken('goalplanner', 'MF');
					// window.open('https://mf.indiainfoline.com/MFOnline/financial-planning-calculator', '_blank');
					// this.commonService.analyticEvent('Invest_Goal_Calculator', 'Invest Goal Planner Calculator');
				}
				else if (this.segmentID == 'fundWeb') {
					window.open('http://mf.indiainfoline.com', '_blank');
					this.commonService.analyticEvent('Invest_MF_Website', 'investService.mutualFund Website');
				}

			}, 100);
			this.equityBlockTabValue = 'mutual';
		}
		else if (this.segmentID == 'insurance' || this.segmentID == 'web' || this.segmentID == 'new-mapping' || this.segmentID == 'renewal-mapping') {
			setTimeout(() => {
				this.investService.insuranceLinks(this.segmentID);
			}, 100);
			this.equityBlockTabValue = 'insurance';
		} else if (this.segmentID == 'bonds' || this.segmentID == 'sec-bonds') {
			setTimeout(() => {
				if (this.segmentID == 'sec-bonds') {
					this.equityLinks('secondaryBonds');
				}

			}, 100);
			this.equityBlockTabValue = 'bonds';
		}
		else if (this.segmentID == 'other' || this.segmentID == 'fp360' || this.segmentID == 'smallCase'|| this.segmentID == 'narnolia' || this.segmentID == 'financial' || this.segmentID == 'ipo' || this.segmentID == 'fixed' || this.segmentID == 'bonds') {
			setTimeout(() => {
				if (this.segmentID == 'fp360') {
					this.equityLinks('fp_360');
				} else if (this.segmentID == 'smallCase') {
					this.equityLinks('small_case');
				} else if (this.segmentID == 'financial') {
					this.equityLinks('health_checkup');
				} else if (this.segmentID == 'ipo') {
					this.equityLinks('ipo');
				} else if (this.segmentID == 'narnolia') {
					this.equityLinks('narnolia');
				}

				if (this.segmentID == 'fixed') {
					this.otherLinks('fix_deposit');
				}
				else if (this.segmentID == 'bonds') {
					this.otherLinks('bonds');
				}

			}, 100);
			this.equityBlockTabValue = 'other';
		}
		this.getCommHeaderDetail();
		this.segmentChange(this.segmentID);
	}

	async changeSlide() {
		this.sliderIndex = await this.slider?.nativeElement.swiper.activeIndex;;
		// console.log(this.sliderIndex);
	}

	public viewMore(url: any) {
		if (this.commonService.isApp() && this.platform.is('ios')) {
			var ref = cordova.InAppBrowser.open(url, '_blank');

			ref.addEventListener('loadstart', this.investService.loadstartCallback);
			ref.addEventListener('loadstop', this.investService.loadstopCallback);
			ref.addEventListener('loaderror', this.investService.loaderrorCallback);
			ref.addEventListener('exit', this.investService.exitCallback);
		} else {
			window.open(url);
		}
	}

	// function for all links in Equity Tab
	equityLinks(objKey: any, ev?: any) {
		if (objKey == 'fp_360') {
			if (this.isRMFAN == true) {
				this.fp360();
				this.commonService.analyticEvent('Invest_Fp360', 'FP 360');
				this.commonService.setClevertapEvent('Invest_FP360');
			}
		}
		else if (objKey == 'small_case') {
			if (this.isRMFAN == true) {
				this.smallCase();
				this.commonService.analyticEvent('Invest_smallcase', 'smallCase');
			}
		}
		else if (objKey == 'invest_edge') {
			// this.offlineIPO();
			this.investService.investEdgeLink();
		}
		else if (objKey == 'ipo') {
			// this.offlineIPO();
			this.openIPO();
		}else if (objKey == 'narnolia') {
			this.commonService.setClevertapEvent('Narnolia_Invest');
			if (this.isRMFAN == true) {
			this.openSearchOption(false,true);
		}
    	} else if (objKey == 'grobox') {
			this.commonService.setClevertapEvent('Growbox_Clicked');
			if (this.isRMFAN == true) {
				this.openSearchOption(false, false, false, true);
			}
		} else if (objKey == 'secondaryBonds') {
			this.commonService.setClevertapEvent('GoldenPI_Clicked');
			this.openSearchOption(false, false, true);			
		}
		else if (objKey == 'health_checkup') {
			this.openSearchOption();
			this.commonService.analyticEvent('Invest_Health_Check', 'Health Checkup');
		}
		else if (objKey == 'bonds') {
			this.goToBond();
			this.commonService.analyticEvent('Invest_Bonds', 'Bonds');
		}
		else if (objKey == 'PrimaryBond') {
			this.goToPrimaryBond();
			this.commonService.analyticEvent('Invest_Bonds', 'PrimaryBond');
		}
		else {
			this.comingSoon(ev);
		}
	}


	// function for all links in Mutul Fund Tab
	mutalFundLinks(event?: any, objKey?: any) {
		if (objKey == 'start_sip') {
			// const browser = this.iab.create('https://ionicframework.com/');
			// browser.executeScript(...);
			this.investService.mutualFund('SIP');
			this.commonService.setClevertapEvent('Invest_MF_StartSIP');
			// this.commonService.analyticEvent('Invest_Start_SIP', 'Start SIP');
		}
		else if (objKey == 'invest_lump') {
			this.investService.mutualFund('LS');
			this.commonService.setClevertapEvent('Invest_MF_InvestLumpsum');
			this.commonService.analyticEvent('Invest_Lumpsum', 'Invest Lumpsum');
		}
		else if (objKey == 'nfo_fmp') {
			this.investService.mutualFund('NFO');
			this.commonService.setClevertapEvent('Invest_MF_NFO/FMP');
			this.commonService.analyticEvent('Invest_NFO', 'NFO/FMP');
		}
		else if (objKey == 'trans_hold') {
			this.investService.mutualFund('TH');
			this.commonService.setClevertapEvent('Invest_MF_TransferHoldings');
			this.commonService.analyticEvent('Invest_Transfer_Holding', 'Transfer Holding');
		}
		else if (objKey == 'fund_monitor') {
			// this.comingSoon(event);
			//window.open('http://mfapps.iifl.in/MFOnline/Home?ReturnUrl=/MFOnline/_FundScreener?Type=F&Type=F', '_blank');
			const url = 'http://mfapps.iifl.in/MFOnline/_FundScreener?Type=F';
			if (this.commonService.isApp() && this.platform.is('ios')) {
				var ref = cordova.InAppBrowser.open(url, '_blank');

				ref.addEventListener('loadstart', this.investService.loadstartCallback);
				ref.addEventListener('loadstop', this.investService.loadstopCallback);
				ref.addEventListener('loaderror', this.investService.loaderrorCallback);
				ref.addEventListener('exit', this.investService.exitCallback);
			} else {
				window.open(url, '_blank');
			}
			this.commonService.analyticEvent('Invest_MF_Monitor', 'Mutual Fund Monitor');
		}

		else if (objKey == 'invest_basket') {
			this.investService.mutualFund('SB');
			this.commonService.setClevertapEvent('Invest_MF_InvestmentBaskets');
			this.commonService.analyticEvent('Invest_SIP_Basket', 'SIP Basket');
		}
		else if (objKey == 'goal_planner') {
			this.getClientAuthToken('goalplanner', 'MF');
			// window.open('https://mf.indiainfoline.com/MFOnline/financial-planning-calculator', '_blank');
			// this.commonService.analyticEvent('Invest_Goal_Calculator', 'Invest Goal Planner Calculator');
		}
		else if (objKey == 'mut_fund_web') {
			this.commonService.setClevertapEvent('Invest_MF_MFwebsite');
			if (this.commonService.isApp() && this.platform.is('ios')) {
				var ref = cordova.InAppBrowser.open('http://mf.indiainfoline.com', '_blank');

				ref.addEventListener('loadstart', this.investService.loadstartCallback);
				ref.addEventListener('loadstop', this.investService.loadstopCallback);
				ref.addEventListener('loaderror', this.investService.loaderrorCallback);
				ref.addEventListener('exit', this.investService.exitCallback);
			} else {
				window.open('http://mf.indiainfoline.com', '_blank');
			}
			this.commonService.analyticEvent('Invest_MF_Website', 'investService.mutualFund Website');
		}
	}
	
	// function for all links in others Tab
	otherLinks(objKey: any) {
		if (objKey == 'fix_deposit') {
			this.goToFixedDeposit();
			this.commonService.analyticEvent('Invest_FD', 'Fixed Deposit');
		}
	}

	async comingSoon(ev: any) {
		const items = [
			{ title: 'Coming Soon', value: 'coming' },
		]
		ev.stopPropagation();
		const popover = await this.popoverController.create({
			component: ComingSoonPopoverComponent,
			componentProps: { items: items },
			cssClass: "coming-soon-popover",
			// mode: "md",
			showBackdrop: false,
			event: ev
			// translucent: true
		});
		return await popover.present();
	}

	async openIPO() {
		const modal = await this.modalController.create({
			component: IpoComponent,
			cssClass: 'ipo-modal'
		})


		modal.onDidDismiss().then(data => {
			console.log(data);
		})
		return await modal.present();
	}


	// open search option for financial health checkup
	async openSearchOption(smallCase?: any, narnolia?: any, secondaryBonds?: any, grobox?: any) {
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

				if (smallCase) {
					this.commonService.setClevertapEvent('Invest_Smallcase');
					// console.log(response);
					// const cName = this.cipherText.aesEncrypt(response['selectedValue']['ClientName']);
					const cName = response['selectedValue']['ClientName'];
					const code = this.cipherText.aesEncrypt(response['selectedValue']['ClientCode']);
					this.storage.get('sToken').then(token => {
						const obj = {
							token: token.replace('.ASPXAUTH=', ''), // swaraj token
							clientName: cName, // smart search pop up selected ID client name (encrypted)
							dealerID: code // smart search pop up selected ID (encrypted)
						}

						this.subscription.add(
							this.investService
								.getSmallCaseCookie(obj)
								.subscribe((response: any) => {
									if (response[0] === 'Success') {
										// console.log(investObj['smallCase']['redirectURL']);
										if (this.commonService.isApp()) {
											const url = investObj['smallCase']['redirectURL'] + '?token=' + token.replace('.ASPXAUTH=', '') + '&clientName=' + cName + '&dealerID=' + code;
											setTimeout(() => {
												/* var ref = cordova.InAppBrowser.open(investObj['smallCase']['redirectURL'], '_blank');

												ref.addEventListener('loadstart', this.investService.loadstartCallback);
												ref.addEventListener('loadstop', this.investService.loadstopCallback);
												ref.addEventListener('loaderror', this.investService.loaderrorCallback);
												ref.addEventListener('exit', this.investService.exitCallback); */
												var pageContent = '<html><head></head><body><form id="loginForm" action="'+ investObj['smallCase']['redirectURL'] +'" method="post">' +
                                                    '<input type="hidden" name="token" value="' + token.replace('.ASPXAUTH=', '') + '">' +
                                                    // '<input type="hidden" name="Appsource" value="' + '5' + '">' +
                                                    '<input type="hidden" name="clientName" value="' + cName + '">' +
                                                    '<input type="hidden" name="dealerID" value="' + encodeURI(code) + '">' +
                                                    '</form> <script type="text/javascript">document.getElementById("loginForm").submit();</script></body></html>';
                                                    var pageContentUrl = 'data:text/html;base64,' + btoa(pageContent);
                                                    var browserRef = cordova.InAppBrowser.open(
                                                        pageContentUrl ,
                                                        "_blank",
                                                        "hidden=no,location=no,clearsessioncache=yes,clearcache=yes"
                                                    );
											}, 500);
										} else {
											window.open(investObj['smallCase']['redirectURL'], '_blank');
										}

									}
								})
						)
					})

				} else if (narnolia || secondaryBonds) { 					 
					// const code = this.cipherText.aesEncrypt(response['selectedValue']['ClientCode']);
					const dealerId: any = localStorage.getItem('userId1');
					this.storage.get('userType').then(type => {
						if (type === 'RM' || type === 'FAN') {
							this.storage.get('JwtToken').then(token => {
								this.generateSession(dealerId, token, narnolia, secondaryBonds);
							})							 
						} else {
							if (secondaryBonds) {
								this.storage.get('JwtToken').then(token => {
									this.generateSession(dealerId, token,narnolia, secondaryBonds);
								})
							}
						}
					})
				} else if (grobox) {
					const dealerId: any = localStorage.getItem('userId1');
					this.storage.get('userType').then(type => {
						if (type === 'RM' || type === 'FAN') {
							this.storage.get('JwtToken').then(token => {
								this.generateSession(dealerId, token, false, false, grobox);
							})
						}
					})
				} else {
					this.commonService.setClevertapEvent('Invest_FinancialHealthCheckup');
					const encClientCode = this.cipherText.aesEncrypt(this.selectedClientCode, investObj['financialHealth']['encryptKey'], [], 'ecb');

					const newD1 = this.datPipe.transform(new Date(), 'yyyy-MM-dd');
					const t1 = new Date().toLocaleTimeString();
					const value1 = investObj['financialHealth']['appFinancialKey'] + '|' + newD1 + ' ' + t1;
					const ENCValue = this.cipherText.aesEncrypt(value1, investObj['financialHealth']['encryptKey'], [], 'ecb');

					const passObj = {
						Clientcode: encClientCode,
						AppKey: ENCValue
					}
					const url = investObj['financialHealth']['url'] + '&Clientcode=' + encClientCode + '&AppKey=' + ENCValue;
					if (this.commonService.isApp() && this.platform.is('ios')) {
						var ref = cordova.InAppBrowser.open(url, '_blank');

						ref.addEventListener('loadstart', this.investService.loadstartCallback);
						ref.addEventListener('loadstop', this.investService.loadstopCallback);
						ref.addEventListener('loaderror', this.investService.loaderrorCallback);
						ref.addEventListener('exit', this.investService.exitCallback);
					} else {
						this.OpenWindowWithPost(investObj['financialHealth']['url'], '_blank', passObj);
					}
				}
				// window.open(url);
			}
		});
		return await modal.present();
	}

	// mutual fund products more option popup
	async mutualFundProductsMore() {
		const modal = await this.modalController.create({
			component: MutualFundProductsMoreComponent,
			cssClass: 'mutual-fund-products-more'
		});

		modal.onDidDismiss().then((data) => {
			if (data['data']) {
				console.log(data['data']);
			}

		})
		return await modal.present();
	}

	ngOnInit() {
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('mappingDetails').then((details) => {
					this.checkupList = details;
				});
			}
			else if (type === 'SUB BROKER') {
				this.storage.get('subBrokermapping').then((details) => {
					this.checkupList = details;
				});
			}
		})


	}

	// navitate with link
	navigateLink(link?: any, value1?: any, value2?: any) {
		if (link && !value1 && !value2) {
			window.open(link, '_blank');
		} else if (link && value1 && !value2) {
			window.open(link + value1, '_blank');
		} else if (link && value1 && value2) {
			window.open(link + value1 + '&' + value2, '_blank');
		} else {
			return;
		}
	}

	public loanRedirect(loanType: any) {
		this.storage.get('userID').then((res) => {
			this.storage.get('userType').then((type) => {
				const user_id = this.cipherText.aesEncrypt(res, investObj['loans']['encryptKey'], investObj['loans']['ivs']);
				const user_type = this.cipherText.aesEncrypt(type, investObj['loans']['encryptKey'], investObj['loans']['ivs']);

				if (loanType === 'business') {
					const URL = investObj['loans']['businessLoan'] + '?userID=' + user_id + '&role=' + user_type + '&logo=no';
					if (this.commonService.isApp() && this.platform.is('ios')) {
						var ref = cordova.InAppBrowser.open(URL, '_blank');

						ref.addEventListener('loadstart', this.investService.loadstartCallback);
						ref.addEventListener('loadstop', this.investService.loadstopCallback);
						ref.addEventListener('loaderror', this.investService.loaderrorCallback);
						ref.addEventListener('exit', this.investService.exitCallback);
					} else {
						window.open(URL);
					}
				} else if (loanType === 'personal') {
					const URL = investObj['loans']['personalLoan'] + '?userID=' + user_id + '&role=' + user_type + '&logo=no';
					if (this.commonService.isApp() && this.platform.is('ios')) {
						var ref = cordova.InAppBrowser.open(URL, '_blank');

						ref.addEventListener('loadstart', this.investService.loadstartCallback);
						ref.addEventListener('loadstop', this.investService.loadstopCallback);
						ref.addEventListener('loaderror', this.investService.loaderrorCallback);
						ref.addEventListener('exit', this.investService.exitCallback);
					} else {
						window.open(URL);
					}
				} else if (loanType === 'home') {
					const URL = investObj['loans']['homeLoan'] + '?userID=' + user_id + '&role=' + user_type + '&logo=no';
					if (this.commonService.isApp() && this.platform.is('ios')) {
						var ref = cordova.InAppBrowser.open(URL, '_blank');

						ref.addEventListener('loadstart', this.investService.loadstartCallback);
						ref.addEventListener('loadstop', this.investService.loadstopCallback);
						ref.addEventListener('loaderror', this.investService.loaderrorCallback);
						ref.addEventListener('exit', this.investService.exitCallback);
					} else {
						window.open(URL);
					}
				}
			})
		})
	}

	/**
	 * API call to generate session and real time mapping for narnolia and implement SSO & get iframe url for goldenPi.
	 * @param dealerId 
	 * @param token 
	 */
	generateSession(dealerId: string, token: string, isNarnolia: boolean, isSecondaryBonds?: boolean, isGrobox?: boolean) {
		let sessionTransfer = this.investService.generateSessionForNarnolia(this.selectedClientCode, dealerId, token);
		let realTimeMapping = this.investService.realTimeMappingForNarnolia(this.selectedClientCode, dealerId, token, isNarnolia, isGrobox);
		forkJoin([sessionTransfer, realTimeMapping]).subscribe((results: any) => {
			const sessionResponse = results[0];
			const realTimeMapRes = results[1];
			if (sessionResponse) {
				let vCookie = sessionResponse.body.OpenAPISessionId.split(";")[0].split('=')[1];
				var obj: any = {
					username: this.encryptWithCryptoJS(dealerId),
					password: 'dTVlVDBhK2NrTzluOU50WWtVYmU1Zz09',
					brokerCode: 'IIFLD',
					vendorCookie: vCookie,
					ClientCode: this.encryptWithCryptoJS(this.selectedClientCode),
					JWTToken: sessionResponse.body.OpenAPIJWTToken
				};
				if (realTimeMapRes && realTimeMapRes.body && (realTimeMapRes.body.status === 3 || realTimeMapRes.body.status === 0)) {
					if (isNarnolia) {
						if (this.commonService.isApp()) {
							var pageContent = '<html><head></head><body><form id="loginForm" action="https://invest.narnolia.in/login/SSOlogin" method="post">' +
								'<input type="hidden" name="username" value="' + obj.username + '">' +
								'<input type="hidden" name="password" value="' + obj.password + '">' +
								'<input type="hidden" name="brokerCode" value="' + obj.brokerCode + '">' +
								'<input type="hidden" name="vendorCookie" value="' + obj.vendorCookie + '">' +
								'<input type="hidden" name="ClientCode" value="' + obj.ClientCode + '">' +
								'<input type="hidden" name="JWTToken" value="' + obj.JWTToken + '">' +
								'</form> <script type="text/javascript">document.getElementById("loginForm").submit();</script></body></html>';
							var pageContentUrl = 'data:text/html;base64,' + btoa(pageContent);
							cordova.InAppBrowser.open(
								pageContentUrl,
								"_blank",
								"hidden=no,location=no,clearsessioncache=yes,clearcache=yes"
							);
						} else {
							var mapForm = document.createElement("form");
							mapForm.target = "_blank";
							mapForm.method = "POST";
							mapForm.action = 'https://invest.narnolia.in/login/SSOlogin';
							Object.keys(obj).forEach(function (param) {
								var mapInput = document.createElement("input");
								mapInput.type = "hidden";
								mapInput.name = param;
								mapInput.setAttribute("value", obj[param]);
								mapForm.appendChild(mapInput);
							});
							document.body.appendChild(mapForm);
							mapForm.submit();
						}
					} else if (isGrobox) {
						var payloadObj: any = {
							DealerCode: this.encryptWithCryptoJS(dealerId),
							vendorCookie: vCookie,
							ClientCode: this.encryptWithCryptoJS(this.selectedClientCode),
							JWTToken: sessionResponse.body.OpenAPIJWTToken
						};
						if (this.commonService.isApp()) {
							var pageContent = '<html><head></head><body><form id="loginForm" action="' + URLS.grobox.url + '" method="post">' +
								'<input type="hidden" name="DealerCode" value="' + payloadObj.DealerCode + '">' +
								'<input type="hidden" name="vendorCookie" value="' + payloadObj.vendorCookie + '">' +
								'<input type="hidden" name="ClientCode" value="' + payloadObj.ClientCode + '">' +
								'<input type="hidden" name="JWTToken" value="' + payloadObj.JWTToken + '">' +
								'</form> <script type="text/javascript">document.getElementById("loginForm").submit();</script></body></html>';
							var pageContentUrl = 'data:text/html;base64,' + btoa(pageContent);
							cordova.InAppBrowser.open(
								pageContentUrl,
								"_blank",
								"hidden=no,location=no,clearsessioncache=yes,clearcache=yes"
							);
						} else {
							var mapForm = document.createElement("form");
							mapForm.target = "_blank";
							mapForm.method = "POST";
							mapForm.action = URLS.grobox.url;
							Object.keys(payloadObj).forEach(function (param) {
								var mapInput = document.createElement("input");
								mapInput.type = "hidden";
								mapInput.name = param;
								mapInput.setAttribute("value", payloadObj[param]);
								mapForm.appendChild(mapInput);
							});
							document.body.appendChild(mapForm);
							mapForm.submit();
						}
					} else if(isSecondaryBonds){
						this.storage.get('pDetails').then(rmDetails => {
							if (rmDetails) {
								var objToEnc: any = {
									appName: 'Dealer Portal',
									clientType: 'Dealer',
									ClientCode: this.selectedClientCode,
									JWTToken: sessionResponse.body.OpenAPIJWTToken,
									rmName: rmDetails.Name,
									rmEmail: rmDetails.RMEmail == '-' ? undefined : rmDetails.RMEmail,
									rmPhone: rmDetails.RMMobileNo == '-' ? undefined : rmDetails.RMMobileNo,
									rmCode: dealerId
								}
							}
							let key = this.encryptionForStandardBonds(JSON.stringify(objToEnc));
							this.goldenPiUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${investObj.goldenPi.url}?key=${encodeURIComponent(key)}&enc=true&pid=${investObj.goldenPi.pid}`);
						});
					}
				} else {
					this.toast.displayToast(realTimeMapRes.body.Msg);
					console.log(realTimeMapRes.body.Msg);
				}
			}
		}, (error) => {
			console.log(error);
			this.toast.displayToast(error);
		}
		);
	}

	/**
	 * to encrypt using AES ECB mode and convert into hex
	 */
	encryptWithCryptoJS(plainText: string): string {
		const key = CryptoJS.enc.Utf8.parse("NarnoliaSHA256HashAlgorithmE_asc");
		const iv1 = CryptoJS.enc.Utf8.parse("NarnoliaSHA256HashAlgorithmE_asc");
		const encrypted = CryptoJS.AES.encrypt(plainText, key, {
			keySize: 16,
			iv: iv1,
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.Pkcs7
		});
		let res = encrypted.ciphertext.toString(CryptoJS.enc.Hex);
		return res.toUpperCase();
	}

	/**
	 * to encrypt using AES CBC mode and convert into Base64
	 */
	encryptionForStandardBonds(dataToEnc: string) {
		const key = CryptoJS.enc.Utf8.parse("KbPeShVmYq3t6w9z");
		const iv1 = CryptoJS.enc.Utf8.parse("bQeThWmZq4t7w!z$");
		const encrypted = CryptoJS.AES.encrypt(dataToEnc, key, {
			keySize: 8,
			iv: iv1,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});
		return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
	}

	// go to fixed deposit page
	goToFixedDeposit() {
		this.router.navigate(['/invest-fixed-deposit']);
	}

	// go to fixed deposit page
	goToBond() {
		this.router.navigate(['/invest-bond']);
	}
	goToPrimaryBond() {
		window.open('https://www.indiainfoline.com/franchise-campaign/');
	}
	public otherProducts() {
		window.open('https://iiflproducts.zohosites.in/');
	}

	public fp360() {
		this.storage.get('userType').then((type) => {
			// const typeENC = this.cipherText.aesEncrypt(type);
			const typeENC = type;
			this.storage.get('userID').then((code) => {
				const clientCode = code;

				this.storage.get('fpToken').then((fpCookie) => {
					// const cookieValue = this.cipherText.aesEncrypt(fpCookie);
					const cookieValue = fpCookie.split('=');
					const dataToENC = clientCode + '|' + type + '|AAA';
					const encText = this.cipherText.aesEncrypt(dataToENC);

					const obj = {
						request: encText,
						alphaX: this.cipherText.aesEncrypt(cookieValue[1])
					}

					const obj1 = {  
						SetupCookie:{
							request: encText,
							alphaX: this.cipherText.aesEncrypt(cookieValue[1])
						},
						URL: investObj['fp360']['url'],
						Module: 'smallcase'
					}
					const url = investObj['fp360']['url'] + '?request=' + encText + '&alphaX=' + cookieValue[1];
					if (this.commonService.isApp()) {
						setTimeout(() => {
							var pageContent = '<html><head></head><body><form id="loginForm" action="'+ investObj['fp360']['url'] +'" method="post">' +
							'<input type="hidden" name="request" value="' + encText + '">' +
							'<input type="hidden" name="alphaX" value="' + this.cipherText.aesEncrypt(cookieValue[1]) + '">' +
							'</form> <script type="text/javascript">document.getElementById("loginForm").submit();</script></body></html>';
							var pageContentUrl = 'data:text/html;base64,' + btoa(pageContent);
							var browserRef = cordova.InAppBrowser.open(
								pageContentUrl ,
								"_blank",
								"hidden=no,location=no,clearsessioncache=yes,clearcache=yes"
							);
							/* var ref = cordova.InAppBrowser.open(url, '_blank');

							ref.addEventListener('loadstart', this.investService.loadstartCallback);
							ref.addEventListener('loadstop', this.investService.loadstopCallback);
							ref.addEventListener('loaderror', this.investService.loaderrorCallback);
							ref.addEventListener('exit', this.investService.exitCallback); */
						}, 500);
						// this.OpenWindowWithPost(investObj['fp360']['url'], '_self', obj);
					} else {
						this.OpenWindowWithPost(investObj['fp360']['url'], '_blank', obj);
						// this.OpenWindowWithPost('https://portfolio.indiainfoline.com/siteredirect/Home/GetAuthorize', '_blank', obj1);
					}
					// window.open(url);
				})
			})

		})
	}

	public smallCase() {
		const obj = {
			token: "jhjhsdjvbhs$#K235", // swaraj token
			clientName: "Duckburg", // smart search pop up selected ID client name (encrypted)
			dealerID: "jhdbssjfsb" // smart search pop up selected ID (encrypted)
		}
		this.openSearchOption(true);
		/* this.storage.get('').then(ID => {
			
		})
		this.subscription.add(
			this.investService
			.getSmallCaseCookie(obj)
			.subscribe( (response) => {
				console.log(response);
				
			})
		) */

		// x-functions-key --> hash value pass in headers

		// string lstrDate = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.fffff");
		// string rawData = "Z0nwefewfeyb#$%1234|AnandSawant|dealer123|" + lstrDate; //token|clientName|dealerId|requestDate
		// string lstrSalt = "bXPu/ZoRB0STbAnA6BjgbD6r2ekp4Uy3YgPYpqB2XbBMqLb1qt+QI3YHChL9v3sj41q+UnFun0/N3hx5GuumgQ==";
		// Rfc2898DeriveBytes rfc2898DeriveBytes = new Rfc2898DeriveBytes(rawData, Encoding.ASCII.GetBytes(lstrSalt), 2612,HashAlgorithmName.SHA512);
		// using (SHA512 sha512Hash = SHA512.Create())
		// {
		// 	byte[] bytes = sha512Hash.ComputeHash(rfc2898DeriveBytes.GetBytes(2048 / 8));
		// 	StringBuilder builder = new StringBuilder();
		// 	for (int i = 0; i < bytes.Length; i++)
		// 	{
		// 		builder.Append(bytes[i].ToString("x2"));
		// 	}
		// 	string lstrValue = builder.ToString();
		// 	Console.WriteLine(lstrValue);
		// }
	}

	public setCookie(cname: any, exdays: any) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		var expires = "expires=" + d.toUTCString();
		document.cookie = cname + "=rohan" + ";" + expires + ";path=/";
	}

	public offlineIPO() {
		this.storage.get('userID').then((Id) => {
			const userIdENC = this.cipherText.encryptionforIPO(Id);
			const offLineENC = this.cipherText.encryptionforIPO("OFFLINE");
			const url = investObj['offlineIPO']['url'] + '?UserId=' + userIdENC + '&Flag=' + offLineENC;
			window.open(url);
		})
	}

	public onlineIPO() {
		window.open(investObj['offlineIPO']['url']);
	}

	public insurance(value?: any) {
		let redirectValue: any = null;
		if (value === 'term') redirectValue = 'TI';
		else if (value === 'car') redirectValue = 'CI';
		else if (value === 'top_up') redirectValue = 'ST';
		else if (value === 'two_wheeler') redirectValue = 'BI';
		else if (value === 'health_insu') redirectValue = 'HI';

		if (this.isRMFAN) {
			this.storage.get('bToken').then((backOfcToken) => {
				const passToken = backOfcToken.split('=');
				const obj = {
					partner_code: investObj['insurance']['partnerCode'],
					token: passToken[1]
				}

				this.storage.get('userID').then(ID => {
					// const passObj = {
					// 	partner_user_id: ID,
					// 	enc: encData
					// }
					const enc = {
						partner_user_id: ID,
						token: passToken[1]
					}

					const encData = this.cipherText.aesEncrypt(enc, investObj['insurance']['encryptKey'], investObj['insurance']['ivs']);;

					let url:any = null;
					if (value === 'term' || value === 'car' || value === 'top_up' || value === 'two_wheeler' || value === 'health_insu') {
						const captureObj = {
							url: investObj['insurance']['url'],
							method: 'GET',
							values: [
								{ partner_code: investObj['insurance']['partnerCode'] },
								{ enc: encData },
								{ category_code: redirectValue }
							]
						}
						url = investObj['insurance']['url'] + '?partner_code=' + investObj['insurance']['partnerCode'] + '&enc=' + encData + '&category_code=' + redirectValue;
					}
					// else if (value === 'car') url = investObj['insurance']['url'] + '?partner_code=' + investObj['insurance']['partnerCode'] + '&enc=' + encData + '&category_code=' + redirectValue;
					// else if (value === 'top_up') url = investObj['insurance']['url'] + '?partner_code=' + investObj['insurance']['partnerCode'] + '&enc=' + encData + '&category_code=' + redirectValue;
					// else if (value === 'two_wheeler') url = investObj['insurance']['url'] + '?partner_code=' + investObj['insurance']['partnerCode'] + '&enc=' + encData + '&category_code=' + redirectValue;
					else if (value === 'dashboard') {
						const captureObj = {
							url: investObj['insurance']['url'],
							method: 'GET',
							values: [
								{ partner_code: investObj['insurance']['partnerCode'] },
								{ enc: encData },
								{ client_code: ID },
								{ redirect_url: 'partner/dashboard' }
							]
						}
						url = investObj['insurance']['url'] + '?partner_code=' + investObj['insurance']['partnerCode'] + '&enc=' + encData + '&client_code=' + ID + '&redirect_url=partner/dashboard';
					}
					else {
						const captureObj = {
							url: investObj['insurance']['url'],
							method: 'GET',
							values: [
								{ partner_code: investObj['insurance']['partnerCode'] },
								{ enc: encData },
								{ redirect_url: redirectValue }
							]
						}
						url = investObj['insurance']['url'] + '?partner_code=' + investObj['insurance']['partnerCode'] + '&enc=' + encData + '&redirect_url=' + redirectValue;
					}
					// this.OpenWindowWithPost(investObj['insurance']['url'],'_blank',passObj);
					// console.log(url);
					// console.log(url);

					if (this.commonService.isApp()) {
						var ref = cordova.InAppBrowser.open(unescape(url), '_blank', "hidden=no,clearsessioncache=yes,clearcache=yes");

						ref.addEventListener('loadstart', this.investService.loadstartCallback);
						ref.addEventListener('loadstop', this.investService.loadstopCallback);
						ref.addEventListener('loaderror', this.investService.loaderrorCallback);
						ref.addEventListener('exit', this.investService.exitCallback);
					} else {
						window.open(unescape(url));
					}
				})
			})
		} else {
			this.storage.get('subToken').then((brokerToken) => {
				const passToken = brokerToken.split('=');
				const obj = {
					partner_code: investObj['insurance']['partnerCode'],
					token: passToken[1]
				}

				this.storage.get('userID').then(ID => {
					// const passObj = {
					// 	partner_user_id: ID,
					// 	enc: encData
					// }
					const enc = {
						partner_user_id: ID,
						token: passToken[1]
					}

					const encData = this.cipherText.aesEncrypt(enc, investObj['insurance']['encryptKey'], investObj['insurance']['ivs']);;

					let url:any = null;
					if (value === 'term' || value === 'car' || value === 'top_up' || value === 'two_wheeler' || value === 'health_insu') {
						const captureObj = {
							url: investObj['insurance']['url'],
							method: 'GET',
							values: [
								{ partner_code: investObj['insurance']['partnerCode'] },
								{ enc: encData },
								{ category_code: redirectValue }
							]
						}
						url = investObj['insurance']['url'] + '?partner_code=' + investObj['insurance']['partnerCode'] + '&enc=' + encData + '&category_code=' + redirectValue;
					}
					// else if (value === 'car') url = investObj['insurance']['url'] + '?partner_code=' + investObj['insurance']['partnerCode'] + '&enc=' + encData + '&category_code=' + redirectValue;
					else if (value === 'dashboard') {
						const captureObj = {
							url: investObj['insurance']['url'],
							method: 'GET',
							values: [
								{ partner_code: investObj['insurance']['partnerCode'] },
								{ enc: encData },
								{ client_code: ID },
								{ redirect_url: 'partner/dashboard' }
							]
						}
						url = investObj['insurance']['url'] + '?partner_code=' + investObj['insurance']['partnerCode'] + '&enc=' + encData + '&client_code=' + ID;
					}
					else {
						const captureObj = {
							url: investObj['insurance']['url'],
							method: 'GET',
							values: [
								{ partner_code: investObj['insurance']['partnerCode'] },
								{ enc: encData },
								{ redirect_url: redirectValue }
							]
						}
						url = investObj['insurance']['url'] + '?partner_code=' + investObj['insurance']['partnerCode'] + '&enc=' + encData + '&redirect_url=' + redirectValue;
					}
					// const url = investObj['insurance']['url'] + '?partner_code=' + investObj['insurance']['partnerCode'] + '&enc=' + encData + '&redirect_url='+redirectValue;
					// this.OpenWindowWithPost(investObj['insurance']['url'],'_blank',passObj);
					// console.log(url);

					if (this.commonService.isApp() && this.platform.is('ios')) {
						var ref = cordova.InAppBrowser.open(url, '_blank');

						ref.addEventListener('loadstart', this.investService.loadstartCallback);
						ref.addEventListener('loadstop', this.investService.loadstopCallback);
						ref.addEventListener('loaderror', this.investService.loaderrorCallback);
						ref.addEventListener('exit', this.investService.exitCallback);
					} else {
						window.open(unescape(url));
					}

				})
			})
		}

	}

	// opne add user modal
	async addUser() {
		const modal = await this.modalController.create({
			component: AddUserComponent,
			cssClass: 'add-user'
		});

		modal.onDidDismiss().then((data) => {
			if (data['data']) {
				const type = data['data']['type'];
				this.getClientAuthToken(type, 'ACT');
			}
		})
		return await modal.present();
	}

	/* FOR ADD USER TOKEN */
	public getClientAuthToken(addUser: any, appName: any) {

		this.storage.get('userID').then((ID) => {
			this.storage.get('userType').then((type) => {
				let userValue:any = null;
				if (type === 'RM' || type === 'FAN') {
					userValue = type;
				} else if (type === 'SUB BROKER') {
					userValue = 'SubBroker';
				}
				const obj = {
					"objHeader": {
						"VID": investObj['addUser']['vid'],
						"AppName": "Website",
						"AppVersion": "1.0.18.0",
						"userType": localStorage.getItem('userType')
					},
					"body": {
						"OrderRequesterCode": ID,
						"Role": userValue,
						"AppSource": "9",
						"Flag": "1",
						"AppName": appName
					}
				}
				this.subscription.add(
					this.investService
						.getUserAuth(obj)
						.subscribe((response: any) => {
							this.clientAuthObj = null;
							if (response['objHeader']['Status'] === 0) {
								if (response['body']) {
									this.clientAuthObj = response['body'];
									this.storage.get('userID').then((clientCode) => {
										if (addUser === 'addClient') {
											const url = investObj['addUser']['addClientURL'] + '?LoginId=' + clientCode + '&Token=' + this.clientAuthObj['Token'];
											if (this.commonService.isApp() && this.platform.is('ios')) {
												var ref = cordova.InAppBrowser.open(url, '_blank');

												ref.addEventListener('loadstart', this.investService.loadstartCallback);
												ref.addEventListener('loadstop', this.investService.loadstopCallback);
												ref.addEventListener('loaderror', this.investService.loaderrorCallback);
												ref.addEventListener('exit', this.investService.exitCallback);
											} else {
												window.open(url);
											}
										} else if (addUser === 'advisor') {
											const url = investObj['addUser']['addSubbrokerURL'] + '?LoginId=' + clientCode + '&Token=' + this.clientAuthObj['Token'];
											if (this.commonService.isApp() && this.platform.is('ios')) {
												var ref = cordova.InAppBrowser.open(url, '_blank');

												ref.addEventListener('loadstart', this.investService.loadstartCallback);
												ref.addEventListener('loadstop', this.investService.loadstopCallback);
												ref.addEventListener('loaderror', this.investService.loaderrorCallback);
												ref.addEventListener('exit', this.investService.exitCallback);
											} else {
												window.open(url);
											}
										} else if (addUser === 'NRI') {
											const url = investObj['addUser']['addNRI'] + '?LoginId=' + clientCode + '&Token=' + this.clientAuthObj['Token'];
											if (this.commonService.isApp() && this.platform.is('ios')) {
												var ref = cordova.InAppBrowser.open(url, '_blank');

												ref.addEventListener('loadstart', this.investService.loadstartCallback);
												ref.addEventListener('loadstop', this.investService.loadstopCallback);
												ref.addEventListener('loaderror', this.investService.loaderrorCallback);
												ref.addEventListener('exit', this.investService.exitCallback);
											} else {
												window.open(url);
											}
										} else if (addUser === 'goalplanner') {
											this.goalCalculatorUrl(response['body']);
										} else {
											return;
										}
									})
								}
							}
						})
				)
			})
		})
	}

	goalCalculatorUrl(res: any) {
		this.commonService.setClevertapEvent('Invest_MF_GoalBasedInvestment');
		const obj = {
			WebView: 1,
			OrderRequesterCode: res['OrderRequesterCode'],
			role: res['Role'],
			Appsource: res['AppSource'],
			AppName: res['AppName'],
			Token: res['Token']
		}
		if (this.commonService.isApp() && this.platform.is('ios')) {
			var ref = cordova.InAppBrowser.open(investObj['goalCalculator']['url'], '_blank');

			ref.addEventListener('loadstart', this.investService.loadstartCallback);
			ref.addEventListener('loadstop', this.investService.loadstopCallback);
			ref.addEventListener('loaderror', this.investService.loaderrorCallback);
			ref.addEventListener('exit', this.investService.exitCallback);
		} else {
			this.OpenWindowWithPost(investObj['goalCalculator']['url'], '_blank', obj);
		}
	}

	async headerClick(event: any, value: any) {
		event.stopPropagation();
		this.overlayVisible = !this.overlayVisible;
		var objPass = {
			symbol: value.Symbol,
			scripCode: value.ScripCode,
			exch: value.Exch,
			exchType: value.ExchType
		}
		const modal = this.modalController.create({
			component: IndicesDetailsComponent,
			componentProps: { "IndParams": objPass },
			cssClass: 'superstars indices-details'
		});
		return (await modal).present();

	}

	public titleClick(event: any) {
		event.stopPropagation();
		this.overlayVisible = !this.overlayVisible;
	}

	getCommHeaderDetail() {
		this.marService.getCommonHead().subscribe((res: any) => {
			this.displayHeader = [
				{
					"Exch": res['Data'][1].Exch,
					"ExchType": res['Data'][1].ExchType,
					"LastRate": res['Data'][1].LastRate,
					"PerChange": res['Data'][1].PerChange,
					"ScripCode": res['Data'][1].ScripCode,
					"Change": res['Data'][1].Change,
					"Symbol": res['Data'][1].Symbol
				},
				{
					"Exch": res['Data'][2].Exch,
					"ExchType": res['Data'][2].ExchType,
					"LastRate": res['Data'][2].LastRate,
					"PerChange": res['Data'][2].PerChange,
					"ScripCode": res['Data'][2].ScripCode,
					"Change": res['Data'][2].Change,
					"Symbol": res['Data'][2].Symbol
				},
				{
					"Exch": res['Data'][0].Exch,
					"ExchType": res['Data'][0].ExchType,
					"LastRate": res['Data'][0].LastRate,
					"PerChange": res['Data'][0].PerChange,
					"ScripCode": res['Data'][0].ScripCode,
					"Change": res['Data'][0].Change,
					"Symbol": res['Data'][0].Symbol,
				}

			]
		})
		clearTimeout(this.clearHeaderDetails);
		this.clearHeaderDetails = setTimeout(() => {
			this.getCommHeaderDetail();
		}, 2000);
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
	goToSearch() {
		this.overlayVisible = !!this.overlayVisible;
		setTimeout(() => {
			//this.router.navigate(['/add-script'])
			this.router.navigate(['/dashboard-clients']);
		}, 300);
	}

	goToDashboard(){
		this.overlayVisible = !!this.overlayVisible;
		setTimeout(() => {
			this.router.navigate(['/dashboard'])
		}, 300);
	}
	goToNotification() {
		this.overlayVisible = !!this.overlayVisible;
		setTimeout(() => {
			this.router.navigate(['/notification'])
		}, 300);
	}

	dismissIframe() {
		this.goldenPiUrl = undefined;
	}

	ionViewWillLeave() {
		clearTimeout(this.clearHeaderDetails);
		this.overlayVisible = false;
	}

	ngOnDestroy() {
		clearTimeout(this.clearHeaderDetails);
		this.overlayVisible = false;
	}
}
