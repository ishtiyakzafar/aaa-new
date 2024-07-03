import { Component, OnDestroy, OnInit, Optional } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Platform, NavController, PopoverController, ModalController, IonRouterOutlet } from '@ionic/angular';
import { ScreensizeService } from '../helpers/screensize.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '../helpers/authentication.service';
import {NavigationEnd, NavigationStart, Router } from '@angular/router';
import { URLS } from '../../config/api.config';
import { CommonService } from '../helpers/common.service';
import { ToasterService } from '../helpers/toaster.service';
import { Subscription } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { CookieService } from 'ngx-cookie-service';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { environment,investObj } from '../../environments/environment';
import { CustomEncryption } from '../../config/custom-encrypt';
import { WireRequestService } from '../pages/wire-requests/wire-requests.service';
import { StorageServiceAAA } from '../helpers/aaa-storage.service';
import { PopoverComponent } from '../components/popover/popover.component';
import { OrderPipe } from 'ngx-order-pipe';
import { AddUserComponent } from '../components/add-user/add-user.component';
import { InvestService } from '../pages/invest/invest.service';
import { ClientTradesService } from '../pages/recently-viewed-client-list/client-trades.service';
import { DashBoardService } from '../pages/dashboard/dashboard.service';
import { AppLoaderService } from '../app-loader/app-loader.service';
import moment from 'moment';
import { LoginService } from '../pages/login/login.service';

declare var cordova: any;
declare var clevertap: any;

@Component({
	selector: 'app-tabs',
	// providers: [ CommonService, InvestService,WireRequestService,NgxDaterangepickerMd,ClientTradesService ],	review
	providers: [ CommonService, WireRequestService,LoginService, NgxDaterangepickerMd,OrderPipe, InvestService, ClientTradesService, DashBoardService],
	templateUrl: 'tabs.page.html',
	styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit,OnDestroy {
	public subscripOption: boolean = false;
	public subscription: any;
	public loading = false;
	public dashboardMenu = false;
	public marketsMenu = false;
	public investMenu = false;
	public reportMenu = false;
	public clientsTradesMenu = false;
	public backOfficeLogout = URLS.backofficeLogout;
    public moreOption: boolean = false;
	private gatewaySubscriptionKey = environment['gatewaySubscriptionKey'];
	public popOverVal: any;
	public md5: any;
	public quicklinkboxremove = false;
	
	hideIonTabBar: boolean = false;
	isDesktop?: boolean;
	tabsPlacement = 'bottom';
	tabsLayout = 'icon-top';
	tabSelectedValue = null;
	dashboardSegmentSelectedValue = 'markets';
	lastPath = '';
	otherLastPath: any;  // last path with some paramenters
	public dashboardMenuItems: any[] = [
		{ item: 'AUM Report' },
		{ item: 'SIP Book' },
		{ item: 'AFYP Report' },
		{ item: 'All Clients' },
		{ item: 'Brokerage Report' },
	]
	public marketsMenuItems: any[] = [
		{ item: 'Watchlist' },
		{ item: 'Snapshot' },
		{ item: 'Indices' },
		{ item: 'Market Overview' },
		{ item: 'Exposure List' },
	]
	public reportstMenuItems: any[] = [
		{
			itemHead: 'Summaries',
			item: '',
			innerItems: [
				{ option: 'Risk Report', routeTo: '/view-reports', newWindow: false },
				{ option: 'Real Time Margin Shortfall', routeTo: '/view-reports', newWindow: false },
				{ option: 'Scrip Summary', routeTo: '/ScriptwiseSummary', newWindow: false },
				{ option: 'Fan Payout Summary', routeTo: '/view-reports', newWindow: false },
				{ option: 'Foliowise Client Details', routeTo: '/folio-wise-details', newWindow: false },
				{ option: 'DP Scrip Payout', routeTo: '/view-reports', newWindow: false },
				{ option: 'Commodity Client Summary', routeTo: '/view-reports', newWindow: false },
				{ option: 'Deposit Ledger', routeTo: '/view-reports', newWindow: false },
				{ option: 'Fan Brokerage Ledger', routeTo: '/view-reports', newWindow: false },
				{ option: 'Commodity Client Scrip Summary', routeTo: '/commodity-client-scrip-summary', newWindow: false },
				{ option: 'VAS Detailed Report', routeTo: '/view-reports', newWindow: false }
			]
		},
		{
			itemHead: 'Individual Clients',
			item: 'Trading',
			innerItems: [
				{ option: 'Realized PnL', routeTo: '/share-reports', newWindow: false, value: 'realised' },
				{ option: 'Unrealized PnL', routeTo: '/share-reports', newWindow: false, value: 'unrealised' },
				{ option: 'BOD Holding', routeTo: '/view-reports', newWindow: false, value: 'bodHolding' },
			]
		},
		{
			itemHead: '',
			item: 'Daily Reports',
			innerItems: [
				{ option: 'DP Transaction', routeTo: '/share-reports', newWindow: false, value: 'dpTransaction' },
				{ option: 'Trade Listing', routeTo: '/share-reports', newWindow: false, value: 'tradeListing' },
				{ option: 'STT Certificate', routeTo: '/share-reports', newWindow: false, value: 'sttCertificate' },
				{ option: 'Daily Bills', routeTo: '/share-reports', newWindow: false, value: 'dailyBills' },
				{ option: 'Digital Contract Notes', routeTo: '/share-reports', newWindow: false, value: 'digitalContract' },
			]
		},
		{
			itemHead: ' ',
			item: 'MF',
			innerItems: [
				{ option: 'MF Capital Gain', routeTo: '/share-reports', newWindow: false, value: 'mfCapital' },
				{ option: 'MF Account Statement', routeTo: '/share-reports', newWindow: false, value: 'mfAccount' },
				{ option: 'AMC Statement', routeTo: '/share-reports', newWindow: false, value: 'amcStmt' },
				
			]
		},
	// 	{
	// 		itemHead: ' ',
	// 		item: 'Others',
	// 		innerItems: [
	// 			{ option: 'Risk Report', routeTo: '/dashboard', newWindow: false },
	// 			{ option: 'Real Time Margin Shortfall', routeTo: '/dashboard', newWindow: false },
	// 			{ option: 'Scrip Summary', routeTo: '/dashboard', newWindow: false },
	// 			{ option: 'Fan Payout Summary', routeTo: '/dashboard', newWindow: false },
	// 			{ option: 'Foliowise Client Details', routeTo: '/dashboard', newWindow: false },
	// 			{ option: 'DP Scrip Payout', routeTo: '/dashboard', newWindow: false },
	// 			{ option: 'Commodity Client Summary', routeTo: '/dashboard', newWindow: false },
	// 			{ option: 'Deposit Ledger', routeTo: '/dashboard', newWindow: false },
	// 			{ option: 'Fan Brokerage Ledger', routeTo: '/dashboard', newWindow: false },
				
	// 		]
	// 	},
		
	]
	public investMenuItems: any[] = [
		{
			item: 'Equity Products',
			routeTo: '/invest/equity',
			innerItems: [
				/* { option: 'FP 360', routeTo: '/invest/equity/fp360', newWindow: false },
				{ option: 'Smallcase', routeTo: '/invest/equity/smallCase', newWindow: false },
				{ option: 'Financial Health Checkup', routeTo: '/invest/equity/financial', newWindow: false },
				{ option: 'IPO', routeTo: '/invest/equity/ipo', newWindow: false } */
				{ option: 'Grobox', routeTo: '/invest/equity/grobox', newWindow: false },
				{ option: 'Invest Edge', routeTo: '/invest/equity/invest_edge', newWindow: false }
			],
			innerItemsBroker: [
				// { option: 'Financial Health Checkup', routeTo: '/invest/equity/financial', newWindow: false }	// removed
				{ option: 'Invest Edge', routeTo: '/invest/equity/invest_edge', newWindow: false }
			]
		},
		// {
		// 	item: 'IPO',
		// 	routeTo: '/mutual',
		// 	innerItems: [
		// 		{ option: 'Online IPO', routeTo: '' },
		// 		{ option: 'Offline IPO', routeTo: '' },
		// 	]
		// },
		{
			item: 'Mutual Fund Products',
			routeTo: '/invest/mutual',
			innerItems: [
				{ option: 'Start SIP', routeTo: '/invest/mutual/startSIP', newWindow: false },
				{ option: 'Invest Lumpsum', routeTo: '/invest/mutual/lumpsum', newWindow: false },
				{ option: 'NFO/FMP', routeTo: '/invest/mutual/nfo', newWindow: false },
				{ option: 'Transfer Holdings', routeTo: '/invest/mutual/transferHold', newWindow: false },
				//{ option: 'Mutual Fund Monitor', routeTo: '/invest/mutual/fundMonitor', newWindow: false },
				{ option: 'Investment Basket', routeTo: '/invest/mutual/investBasket', newWindow: false },
				//{ option: 'Goal Based Investment Planner', routeTo: '/invest/mutual/goalPlan', newWindow: false },
				//{ option: 'Mutual Fund Website', routeTo: '/invest/mutual/fundWeb', newWindow: false }
			]
		},
		{
			item: 'Insurance',
			routeTo: '/invest/insurance',
			innerItems: [
				// { option: 'Health Insurance', routeTo: '/invest/insurance/health', newWindow: false },
				// { option: 'Term Insurance', routeTo: '/invest/insurance/term', newWindow: false },
				// { option: 'Car Insurance', routeTo: '/invest/insurance/car', newWindow: false },
				{ option: 'Insurance Website', routeTo: '/invest/insurance/web', newWindow: false },
				{ option: 'New Business Mapping', routeTo: '/invest/insurance/new-mapping', newWindow: false },
				{ option: 'Renewal Business Mapping', routeTo: '/invest/insurance/renewal-mapping', newWindow: false }
			]
		},
		{
			item: 'Bonds',
			routeTo: '/invest/bonds',
			innerItems: [
                { option: 'Primary Bonds', routeTo: 'https://www.indiainfoline.com/franchise-campaign/', newWindow: true },
                { option: 'Secondary Bonds', routeTo: '/invest/insurance/sec-bonds', newWindow: false },
                { option: 'Third Party Bonds', routeTo: '/invest-bond', newWindow: false },
            ]
		},
		{
			item: 'Others',
			routeTo: '/invest/other',
			innerItems: [
				{ option: 'Fixed Deposits', routeTo: '/invest/other/fixed', newWindow: false },
				{ option: 'Will Writing Service', routeTo: 'https://www.indiainfoline.com/personalfinance/will-service-online', newWindow: true },
				// { option: 'Deposits', routeTo: '/invest/other/deposit' },
				// { option: 'Insurance', routeTo: '/other/insurance' },
				// { option: 'Other Products', routeTo: '/other/products' }
			]
		},
	]
	public clientsTradesMenuItems: any[] = [
		{ item: 'Clients' },
		{ item: 'Orderbook' },
		{ item: 'Tradebook' },
		{ item: 'Holdings' },
		{ item: 'Fund Payin Payout' },
	]
	ionTabButtonData: any[] = [
		{
			routerLink: '/reports',
			ionIconNotSelected: './assets/svg/mob-reports.svg',
			ionIconSelected: './assets/svg/mob-reports-selected.svg',
			ionLabel: 'Reports'
		},
		{
			routerLink: '/markets',
			ionIconNotSelected: './assets/svg/markets.svg',
			ionIconSelected: './assets/svg/markets_selected.svg',
			ionLabel: 'Markets'
		},
		{
			routerLink: '/invest',
			ionIconNotSelected: './assets/svg/invest.svg',
			ionIconSelected: './assets/svg/invest_selected.svg',
			ionLabel: 'Invest'
		},
		{
			routerLink: '/client-trades',
			ionIconNotSelected: './assets/svg/trade.svg',
			ionIconSelected: './assets/svg/trade_selected.svg',
			ionLabel: 'Trades'
		},
		{
			routerLink: '/more',
			ionIconNotSelected: './assets/svg/more_new.svg',
			ionIconSelected: './assets/svg/more_new_selected.svg',
			ionLabel: 'More'
		}
	];

	tabs: any[] = [
		{
		  title: 'Summaries',
		  innerItems: [
			{
				innerOption:[
				
					{ option: 'Risk Report', routeTo: '/view-reports', value: 'riskReport' , newWindow: false },
					{ option: 'Real Time Margin Shortfall', routeTo: '/view-reports', value: 'realTimeMargin', newWindow: false },
					{ option: 'Scrip Summary', routeTo: '/ScriptwiseSummary',  newWindow: false },
					{ option: 'Fan Payout Summary', routeTo: '/view-reports', value: 'FanPayoutSummary' , newWindow: false },
					{ option: 'Foliowise Client Details', routeTo: '/folio-wise-details',  newWindow: false },
					{ option: 'DP Scrip Payout', routeTo: '/view-reports', value: 'DPScripPayout' , newWindow: false },
					{ option: 'Commodity Client Summary', routeTo: '/view-reports', value: 'CommodityClientSummary' , newWindow: false },
					{ option: 'Deposit Ledger', routeTo: '/view-reports', value: 'DepositLedger' , newWindow: false },
					{ option: 'Fan Brokerage Ledger', routeTo: '/view-reports', value: 'FanBrokerageLedger' , newWindow: false },	
					{ option: 'Commodity Client Scrip Summary', routeTo: '/commodity-client-scrip-summary', newWindow: false },
					{ option: 'Outstanding Position', routeTo: '/view-reports', value: 'OutstandingReport' , newWindow: false },	
					{ option: 'Consolidated Trade Listing', routeTo: '/view-reports', value: 'consolidatedTradeList' , newWindow: false },
					{ option: 'VAS Detailed Report', routeTo: '/VasDetailedReport' , newWindow: false },
					{ option: 'Freeze Details', routeTo: '/view-reports', value: 'FreezeDetails',  newWindow: false },
					{ option: 'DP Modification Details', routeTo: '/view-reports', value: 'DpModificationDetails',  newWindow: false },
					{ option: 'Detailed Clients Report', value: 'DetailedClientsReport', downloadFlag: true, newWindow: false },
					{ option: 'Settlement Payout Report', routeTo: '/settlement-payout-report', newWindow: false },
					{ option: 'DRF Status', routeTo: '/view-reports', value: 'DematRequestStatus' , newWindow: false }
			  ]
			}
		  ]
		},
		{
			title: 'Individual Clients',
			innerItems: [
				{
					innerTitle: 'Trading',
					innerOption:[
						{ option: 'Realized PnL', routeTo: '/share-reports', newWindow: false, value: 'realised' },
						{ option: 'Unrealized PnL', routeTo: '/share-reports', newWindow: false, value: 'unrealised'},
						{ option: 'BOD Holding', routeTo: '/view-reports', newWindow: false, value: 'bodHolding' },
						{ option: 'DP Holding', routeTo: '/share-reports', newWindow: false, value: 'dpholding' }
					]
				},
				
				{
					innerTitle: 'Daily Reports',
					innerOption:[
						{ option: 'DP Transaction', routeTo: '/share-reports', newWindow: false, value: 'dpTransaction' },
				{ option: 'Trade Listing', routeTo: '/share-reports', newWindow: false, value: 'tradeListing' },
				{ option: 'STT Certificate', routeTo: '/share-reports', newWindow: false, value: 'sttCertificate' },
				{ option: 'Daily Bills', routeTo: '/share-reports', newWindow: false, value: 'dailyBills' },
				{ option: 'Digital Contract Notes', routeTo: '/share-reports', newWindow: false, value: 'digitalContract' },
					]
				},
				{
					innerTitle: 'MF',
					innerOption:[
						{ option: 'MF Capital Gain', routeTo: '/share-reports', newWindow: false, value: 'mfCapital' },
						{ option: 'MF Account Statement', routeTo: '/share-reports', newWindow: false, value: 'mfAccount' },
						{ option: 'AMC Statement', routeTo: '/share-reports', newWindow: false, value: 'amcStmt' },
					]
				},
				{
					innerTitle: 'Others',
					innerOption:[
						{option: 'Commodity Realtime', routeTo: '/share-reports', newWindow: false ,value:'crtr'},
				{option: 'Simplified Ledger', routeTo: '/share-reports', newWindow: false ,value:'simplified'},
				// {option: 'Client 360', routeTo: '/share-reports', newWindow: false ,value:'360Client'},
				{option: 'Interest on Delayed Payment', routeTo: '/share-reports', newWindow: false ,value:'interestOnDelayedPayment'},
						
					]
				}
				
       ]
		},
		{
			title: 'Others',
			innerItems: [{
				innerOption:[
				{option: 'Scrip Master', routeTo: '/view-reports', value: 'ScripMaster' , newWindow: false },
				{option: 'Shares Deposit', routeTo: '/view-reports',  value: 'SharesDeposit' , newWindow: false },
				{option: 'GST Invoice', routeTo: '/view-reports',  value: 'GSTInvoice' , newWindow: false },
				{option: 'Pay Details', routeTo: '/pay-details', newWindow: false },
				]
			}
			]
		}
		// Add more tabs as needed
	  ];

	tabsFanChildData: any[] = [
	{
		title: 'Summaries',
		innerItems: [
		{
			innerOption:[
			
				{ option: 'Risk Report', routeTo: '/view-reports', value: 'riskReport' , newWindow: false },
				{ option: 'Real Time Margin Shortfall', routeTo: '/view-reports', value: 'realTimeMargin', newWindow: false },
				{ option: 'Commodity Client Summary', routeTo: '/view-reports', value: 'CommodityClientSummary' , newWindow: false },
				{ option: 'Consolidated Trade Listing', routeTo: '/view-reports', value: 'consolidatedTradeList' , newWindow: false },
				{ option: 'DP Scrip Payout', routeTo: '/view-reports', value: 'DPScripPayout' , newWindow: false },
				{ option: 'Scrip Summary', routeTo: '/ScriptwiseSummary', newWindow: false },
				{ option: 'Foliowise Client Details', routeTo: '/folio-wise-details',  newWindow: false },
				{ option: 'Freeze Details', routeTo: '/view-reports', value: 'FreezeDetails', newWindow: false },
				{ option: 'DP Modification Details', routeTo: '/view-reports', value: 'DpModificationDetails', newWindow: false },
				{ option: 'Detailed Clients Report', value: 'DetailedClientsReport', downloadFlag: true, newWindow: false }
			]
		}
		]
	},
	{
		title: 'Individual Clients',
		innerItems: [
			{
				innerTitle: 'Trading',
				innerOption:[
					{ option: 'Realized PnL', routeTo: '/share-reports', newWindow: false, value: 'realised' },
					{ option: 'Unrealized PnL', routeTo: '/share-reports', newWindow: false, value: 'unrealised'},
					{ option: 'BOD Holding', routeTo: '/view-reports', newWindow: false, value: 'bodHolding' },
				]
			},
			
			{
				innerTitle: 'Daily Reports',
				innerOption:[
					{ option: 'DP Transaction', routeTo: '/share-reports', newWindow: false, value: 'dpTransaction' },
			{ option: 'Trade Listing', routeTo: '/share-reports', newWindow: false, value: 'tradeListing' },
			{ option: 'STT Certificate', routeTo: '/share-reports', newWindow: false, value: 'sttCertificate' },
			{ option: 'Daily Bills', routeTo: '/share-reports', newWindow: false, value: 'dailyBills' },
			{ option: 'Digital Contract Notes', routeTo: '/share-reports', newWindow: false, value: 'digitalContract' },
				]
			},
			{
				innerTitle: 'MF',
				innerOption:[
					{ option: 'MF Capital Gain', routeTo: '/share-reports', newWindow: false, value: 'mfCapital' },
					{ option: 'MF Account Statement', routeTo: '/share-reports', newWindow: false, value: 'mfAccount' },
					{ option: 'AMC Statement', routeTo: '/share-reports', newWindow: false, value: 'amcStmt' },
				]
			},
			{
				innerTitle: 'Others',
				innerOption:[
					{option: 'Commodity Realtime', routeTo: '/share-reports', newWindow: false ,value:'crtr'},
			{option: 'Simplified Ledger', routeTo: '/share-reports', newWindow: false ,value:'simplified'},
			// {option: 'Client 360', routeTo: '/share-reports', newWindow: false ,value:'360Client'},
			{option: 'Interest on Delayed Payment', routeTo: '/share-reports', newWindow: false ,value:'interestOnDelayedPayment'},
					
				]
			}
			
	]
	},
	{
		title: 'Others',
		innerItems: [{
			innerOption:[
			{option: 'Scrip Master', routeTo: '/view-reports', value: 'ScripMaster' , newWindow: false },
			// {option: 'Pay Details', routeTo: '/pay-details', newWindow: false },
			]
		}
		]
	}
	// Add more tabs as needed
	];  
	  activeTabIndex = 0;
	  isHovered = false; // Flag to track hover state
		routerEvents: any;

	constructor(
		public platform: Platform, private screensize: ScreensizeService,
		private router: Router,
		private titleService: Title,
		private authService: AuthenticationService,
		private popoverController: PopoverController,
		private storage: StorageServiceAAA,
		private commonService: CommonService,
		private toast: ToasterService,
		private investService: InvestService,
		private modalController: ModalController,
		private http: HttpClient,
		private navCtrl: NavController,
		private cipherText: CustomEncryption,
		private cookieService: CookieService,
		private _appLoaderService: AppLoaderService,
		public dashBoardService: DashBoardService,
		public serviceFile: LoginService, 
		@Optional() private routerOutlet?: IonRouterOutlet
	) {
		this.initializeBack();
		this.screensize.isDesktopView().subscribe(isDesktop => {
			if (this.isDesktop && !isDesktop) {
				window.location.reload();
			}
			this.isDesktop = isDesktop;
		});
	}

	selectTab(index: number) {
		this.activeTabIndex = index;
		if (index == 0) {
			this.commonService.setClevertapEvent('ReportSummaries_Clicked', { 'Login ID': localStorage.getItem('userId1') });
		} else if (index == 1) {
			this.commonService.setClevertapEvent('ReportIndiivdualClients_Clicked', { 'Login ID': localStorage.getItem('userId1') });
		} if (index == 2) {
			this.commonService.setClevertapEvent('ReportsOtherss_Clicked', { 'Login ID': localStorage.getItem('userId1') });
		}
	}
	
	  setHoverState(hovered: boolean) {
		this.isHovered = hovered;
	  }

	redirectReportsItem(item: any) {
		// Define the query parameters you want to pass
		
		if(item.downloadFlag){

			if(item.value.toString().toLowerCase() == "detailedclientsreport"){
				this._appLoaderService.showLoader();
				this.commonService.setClevertapEvent('WebwireReport_Download', { 'PartnerCode': localStorage.getItem('userId1') });
				this.storage.get('userType').then(type => {
					if (type === 'RM' || type === 'FAN') {
						this.storage.get('bToken').then(token => {
							this.downloadReport({ReportName: item.value.toString(), Token: token});
						})
					} else {
						this.storage.get('subToken').then(token => {
							this.downloadReport({ReportName: item.value.toString(), Token: token});
						})
					}
				})
			}
		} else {
			const queryParams = { report: item.value };
		
			// Navigate to the desired route with the query parameters
			this.router.navigate([item.routeTo], { queryParams });
			this.hideReportstMenu();
		}
	}
	
	initializeBack(){
		// this.backButtonSubscription = new Subscription();
		// this.backButtonSubscription.add(
			this.router.events.forEach((event: any) => {
				if((this.router.url == '/markets' || this.router.url == '/invest' || this.router.url == '/client-trades' || this.router.url == '/more' || this.router.url == '/dashboard') && event['url'] != undefined){
			this.platform.backButton.subscribeWithPriority(10, () => {
				if(this.router.url == '/markets' || this.router.url == '/invest' || this.router.url == '/client-trades' || this.router.url == '/more'){
					this.router.navigate(['/dashboard']);
				}
				else if(this.router.url == '/dashboard'){
					this.toast.displayToast('Back to exit / Home to minimize');
					this.platform.backButton.subscribeWithPriority(10, () => {
						  (navigator as any)['app'].exitApp();
					  });
				}
			});
		}
		  });
		// )
	}

	

	ngOnInit() {
		this.storage.get('isFanChild').then(isChild => {
			if(isChild == 'true'){
				this.tabs = [];
				this.tabs = this.tabsFanChildData;
			}
		});

		// this.initializeBack();
		// this.storage.remove('realTimeMargin');
		// this.storage.remove('riskReportLink');
	}

	ionViewWillEnter() {
		this.tabSelectedValue = null;

		this.storage.get('userType').then( type => {
			if (type === 'RM' || type === 'FAN') {
				const obj = [
					// { option: 'FP 360', routeTo: '/invest/equity/fp360', newWindow: false },
					{ option: 'Smallcase', routeTo: '/invest/equity/smallCase', newWindow: false },
					// { option: 'Financial Health Checkup', routeTo: '/invest/equity/financial', newWindow: false },	removed
					{ option: 'IPO', routeTo: '/invest/equity/ipo', newWindow: false },
					{ option: 'Grobox', routeTo: '/invest/equity/grobox', newWindow: false },
					{ option: 'Invest Edge', routeTo: '/invest/equity/invest_edge', newWindow: false }
					// { option: 'Narnolia', routeTo: '/invest/equity/narnolia', newWindow: false }
				];
				this.investMenuItems[0]['innerItems'] = obj;
			} else {
				const obj = [
					// { option: 'Financial Health Checkup', routeTo: '/invest/equity/financial', newWindow: false },	removed
					{ option: 'IPO', routeTo: '/invest/equity/ipo', newWindow: false },
					{ option: 'Invest Edge', routeTo: '/invest/equity/invest_edge', newWindow: false }

				];
				this.investMenuItems[0]['innerItems'] = obj;
			}
		})
	
		this.storage.get('isFanChild').then(isChild => {
			if(isChild == 'true'){
				this.tabs = [];
				this.tabs = this.tabsFanChildData;
			}
		});
	}
	// Redirection Segment for Market
	goToMarketSeg(obj: any) {
		this.dashboardSegmentSelectedValue = 'markets';
		if (obj == 'Watchlist') {
			this.router.navigate(['/markets', 'watchlist']);
		}
		else if (obj == 'Snapshot') {
			this.router.navigate(['/markets', 'snapshot']);
		}
		else if (obj == 'Indices') {
			this.router.navigate(['/markets', 'indices']);
		}
		else if (obj == 'Market Overview') {
			this.router.navigate(['/markets', 'status']);
		}
		else if (obj == 'Exposure List') {
			this.router.navigate(['/markets', 'exposure']);
		}
	}
	// Redirection Segment for dashboard
	goToDashboardSeg(objValue: any) {
		this.dashboardSegmentSelectedValue = 'dashboard';
		// console.log(objValue);
		if (objValue == 'AUM Report') {
			this.router.navigate(['/dashboard', 'aum']);
		}
		else if (objValue == 'SIP Book') {
			this.router.navigate(['/dashboard', 'sipBook']);
		}
		else if (objValue == 'AFYP Report') {
			this.router.navigate(['/dashboard', 'totalAfyp']);
		}
		else if (objValue == 'All Clients') {
			this.router.navigate(['/dashboard', 'totalClients']);
		}
		else if (objValue == 'Brokerage Report') {
			this.router.navigate(['/dashboard', 'brokerage']);
		}

	}
	// Redirection Segment for Client & Trades
	clientTradesMenu(value: any) {
		// console.log(value);
		this.dashboardSegmentSelectedValue = 'client';
		if (value == 'Clients') {
			this.router.navigate(['/client-trades', 'clients']);
		}
		else if (value == 'Orderbook') {
			this.router.navigate(['/client-trades', 'orderbook']);
		}
		else if (value == 'Tradebook') {
			this.router.navigate(['/client-trades', 'tradebook']);
		}
		else if (value == 'Holdings') {
			this.router.navigate(['/client-trades', 'holdings']);
		}
		else if(value == 'Fund Payin Payout'){
			this.router.navigate(['/client-trades', 'fundPayinOut']);
		}

	}

	redirectInvest(link: any, newWindow: any) {
		this.dashboardSegmentSelectedValue = 'invest';
		if (newWindow) {
			window.open(link, '_blank');
		} else {
			this.router.navigate([link], { skipLocationChange: true });
		}
	}

	redirectReports(link: any, newWindow: any, obj: any) {
		this.dashboardSegmentSelectedValue = 'reports';
		if (newWindow) {
			window.open(link, '_blank');
		
		} 
		else {
		switch (obj['option']) {
			case 'Risk Report':
				this.router.navigate(['/view-reports'],{ queryParams: {report: 'riskReport'}});
				break;
			case 'Real Time Margin Shortfall':
				this.router.navigate(['/view-reports'],{ queryParams: {report: 'realTimeMargin'}});
				break;
			case 'Scrip Summary':
				this.router.navigate(['/ScriptwiseSummary']);
				break;
			case 'Fan Payout Summary':
				this.router.navigate(['/view-reports'],{ queryParams: {report: 'FanPayoutSummary'}});
				break;
			case 'DP Scrip Payout':
				this.router.navigate(['/view-reports'],{ queryParams: {report: 'DPScripPayout'}});
				break;
			case 'Commodity Client Summary':
				this.router.navigate(['/view-reports'],{ queryParams: {report: 'CommodityClientSummary'}});
				break;
			case 'Commodity Client Scrip Summary':
				this.router.navigate(['/view-reports'],{ queryParams: {report: 'CommodityClientScrip'}});
				break;
			case 'VAS Detailed Report':
				this.router.navigate(['/VasDetailedReport']);
				break;
			case 'Deposit Ledger':
				this.router.navigate(['/view-reports'],{ queryParams: {report: 'DepositLedger'}});
				break;
			case 'Fan Brokerage Ledger':
				this.router.navigate(['/view-reports'],{ queryParams: {report: 'FanBrokerageLedger'}});
				break;
			case 'BOD Holding':
				this.router.navigate(['/view-reports'],{ queryParams: {report: 'BODHolding'}});
				break;
			case 'Commodity Realtime':
				this.router.navigate(['/view-reports'],{ queryParams: {report: 'CommodityRealtime'}});
				break;
			case 'Scrip Master':
				this.router.navigate(['/view-reports'],{ queryParams: {report: 'ScripMaster'}});
				break;
			case 'Shares Deposit':
				this.router.navigate(['/view-reports'],{ queryParams: {report: 'SharesDeposit'}});
				break;
			case 'GST Invoice':
				this.router.navigate(['/view-reports'],{ queryParams: {report: 'GSTInvoice'}});
				break;

			default:
				this.router.navigate([link], { queryParams: { type: obj['value'] } });
			this.router.navigate([link], { queryParams: { type: obj['value'] } });
		}
	}
	}

	// InvestItems(item){
	// 	this.dashboardSegmentSelectedValue = 'invest';
	// 	console.log(item.option);
	// 	if(item.option){
	// 		this.router.navigate(['/invest', item.option.split(' ').join('-')]);		
	// 	}
	// }

	

	
	dashboardTopMenuSegment() {
        if(this.dashboardSegmentSelectedValue === 'more') {
            this.moreOption = true
        } else {
            this.moreOption = false;
        }
		// this.lastPath = '';
	}

	showDashboardMenu() {
		setTimeout(() => {
			this.dashboardMenu = true;
		}, 100);
	}

	hideDashboardMenu() {
		setTimeout(() => {
			this.dashboardMenu = false;
		}, 100);
	}

	showMarketsMenu() {
		setTimeout(() => {
			this.marketsMenu = true;
		}, 100);
	}

	hideMarketsMenu() {
		setTimeout(() => {
			this.marketsMenu = false;
		}, 100);
	}

	showInvestMenu() {
		setTimeout(() => {
			this.investMenu = true;
		}, 100);
	}

	hideInvestMenu() {
		setTimeout(() => {
			this.investMenu = false;
		}, 100);
	}

	showReportsMenu() {
		setTimeout(() => {
			this.reportMenu = true;
		}, 100);
	}

	hideReportstMenu() {
		setTimeout(() => {
			this.reportMenu = false;
		}, 100);
	}

	showClientsTradesMenu() {
		setTimeout(() => {
			this.clientsTradesMenu = true;
		}, 100);
	}

	hideClientsTradesMenu() {
		setTimeout(() => {
			this.clientsTradesMenu = false;
		}, 100);
	}

	ngDoCheck() {
		this.tabSelectedValue = null;
		this.subscripOption = false;
		this.otherLastPath = document.location.pathname;
		this.otherLastPath = this.otherLastPath.replace(/[/]/g, ' ');
		this.otherLastPath = this.otherLastPath.split(' ');
		this.otherLastPath = this.otherLastPath[1];
		this.lastPath = document.location.pathname;
		this.hideIonTabBar = false;
		if (this.lastPath === '/dashboard' || this.lastPath.split('/')[1] === 'dashboard' || this.lastPath.includes('dashboard')) {
			this.dashboardSegmentSelectedValue = 'dashboard';
			this.titleService.setTitle('IIFL AAA Dashboard');
		}else if (this.lastPath === '/reports' || this.lastPath === '/view-reports' || this.lastPath === '/share-reports' || this.lastPath === '/client-portfolio') {
			this.dashboardSegmentSelectedValue = 'reports';
			this.lastPath = '/reports';
			this.titleService.setTitle('IIFL AAA reports');
		}else if (this.lastPath === '/markets' || this.lastPath === '/company-details-superstars') {
			this.dashboardSegmentSelectedValue = 'markets';
			this.lastPath = '/markets';
			this.titleService.setTitle('IIFL AAA Markets');
		} else if (this.lastPath === '/invest') {
			this.dashboardSegmentSelectedValue = 'invest';
			this.titleService.setTitle('IIFL AAA Invest');
		} else if (this.lastPath === '/client-trades' || this.lastPath.split('/')[1] === 'client-trades' || this.lastPath === '/client-interactions') {
			// } else if (this.lastPath === '/recently-viewed-client-list') {
			this.dashboardSegmentSelectedValue = 'client';
			this.titleService.setTitle('IIFL AAA Client & Trades');
		} else if (this.lastPath === '/mobile-more-option') {
			this.dashboardSegmentSelectedValue = 'more';
			this.titleService.setTitle('IIFL AAA More');
			// this.hideIonTabBar = true;
		} else if (this.lastPath === '/more' || this.lastPath === '/partner-query' || this.lastPath === '/help-partner-query' || this.lastPath === '/raise-query' || this.lastPath === '/help-support' || this.lastPath === '/help-faq' || this.lastPath === '/help-faq-root' || this.lastPath === '/help-faq-subroot' || this.lastPath === '/help-search-ques' || this.lastPath === '/faq-details') {
			this.dashboardSegmentSelectedValue = 'more';
			this.titleService.setTitle('IIFL AAA More');
			// this.hideIonTabBar = true;
		}
		else if (this.lastPath === '/settings') {
			this.dashboardSegmentSelectedValue = 'more';
			this.titleService.setTitle('IIFL AAA Settings');
			// this.hideIonTabBar = true;
		} else if (this.lastPath === '/change-password') {
			this.dashboardSegmentSelectedValue = 'more';
			this.titleService.setTitle('IIFL AAA Change Password');
			// this.hideIonTabBar = true;
		} else if (this.lastPath === '/add-script') {
			this.dashboardSegmentSelectedValue = 'search';
			this.titleService.setTitle('IIFL AAA More');
		} else if (this.lastPath === '/settings' || this.otherLastPath === 'client-list' || this.lastPath === '/price-calculator' || this.lastPath === '/client-equity-commodity' || this.lastPath === '/client-details' || this.lastPath === '/detailed-news' || this.lastPath === '/invest-fixed-deposit' || this.lastPath === '/invest-bond') {
			this.hideIonTabBar = true;
		} else if (this.lastPath === '/subscription') {
			this.subscripOption = true;
			this.hideIonTabBar = true;
		} else {
			this.hideIonTabBar = false;
			this.subscripOption = false;
		}
	}

	// set title for different tab
	public setTitle(newTitle: string) {
		if(newTitle !='IIFL AAA Client & Trades'){
			localStorage.setItem('clientDetail', "false")
		}
		if(newTitle == 'Family Portfolio'){
			this.commonService.setClevertapEvent('Family_Portfolio_Clicked', { 'PartnerCode': localStorage.getItem('userId1') });
			this.commonService.analyticEvent('Family_Portfolio_Clicked', 'Family Portfolio Module Click');
		}
		this.titleService.setTitle(newTitle);
			this.routerEvents = this.router.events.subscribe(
      (event:any)=>{
        if(event instanceof NavigationEnd){
					if(event.url=='/dashboard'){
						this.commonService.setClevertapEvent('Dashboard_Clicked', { 'Login ID': localStorage.getItem('userId1') });
					}else if(event.url=='/reports'){
						this.commonService.setClevertapEvent('Reports_Clicked', { 'Login ID': localStorage.getItem('userId1') });
					}
        }
      }
    )
		// this.lastPath = '';
	}

	selectTabButton(value: any) {
		this.tabSelectedValue = value;
		// console.log(this.tabSelectedValue);
		// localStorage.removeItem('path');
		// this.lastPath = '';
	}

	public openProfile(ev: any) {
		let userTypeVal = localStorage.getItem('userType');
		let items = [
			{ title: 'My Profile', value: 'profile' },
			// { title: 'Change Password', value: 'chg_psw' },
            // { title: 'Partner Code', value: 'partnerCode' },
			// { title: 'Terms & Conditions', value: 'terms' },
			{ title: 'Logout', value: 'logout' }
		]
		if (userTypeVal == 'RM' || userTypeVal == 'FAN') {
			items.unshift({ title: 'TT Manager Download', value: 'ttManagerDownload' });
		}
		this.storage.get('userID').then(ID => {
			this.storage.get('pDetails').then(details => {
				const obj1 = {
					profileName: details && details['Name'] ? details['Name'] : localStorage.getItem('userName'),
					value: 'profileDetail',
					clientCode: ID,
					// clientType: 'Gold'
				}

				const obj2 = {
					title: 'Partner Code',
					value: ID
				}

				const newItems = [obj1, ...items];
				this.openPopover(ev, newItems);
			})
		})
	}

	async openPopover(ev: any, items: any) {
		ev.stopPropagation();
		this.popOverVal = await this.popoverController.create({
			component: PopoverComponent,
			componentProps: { items: items },
			cssClass: "custom-popover",
			mode: "md",
			showBackdrop: false,
			event: ev
			// translucent: true
		});

		this.popOverVal.onDidDismiss().then((data: any) => {
			if (data["data"]) {
				const response = data['data'];

				if (response['result']['value'] === 'logout') {
					this.commonService.setClevertapEvent('Logout');
					this.commonService.setEvent('logout', null);
					let obj = {
						'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
						'appID': localStorage.getItem('appID') || ''
					}
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
									this.storage.get('subToken').then((tokenValue) => {
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
											if(response){
											if (window.location.hostname == 'localhost') {
                                                this.cookieService.deleteAll();
                                            } else {
                                                this.cookieService.deleteAll('/', '.indiainfoline.com');
                                            }
                                            this.storage.clear();
                                            localStorage.clear();
											this.storage.remove('hierarchyList');
                                            this.commonService.analyticEvent('Logout', 'logout');
											this.router.navigate(['/login']);
                                            this.toast.displayToast('Logout successful');
										}
										})
									})
								})
							} else {
								if (window.location.hostname == 'localhost') {
                                    this.cookieService.deleteAll();
                                } else {
                                    this.cookieService.deleteAll('/', '.indiainfoline.com');
                                }
                                // this.authService.deleteAllCookies();
                                this.storage.clear();
                                localStorage.clear();
								this.storage.remove('hierarchyList');
                                indexedDB.deleteDatabase('_ionicstorage');
                                // this.navCtrl.navigateRoot('/login');
								this.router.navigate(['/login']);
                                this.toast.displayToast('Logout successful');
							}
						},
							error => {
								console.log(error, 'error');

							})
					})
					// this.loading = true;
				} else if (response['result']['value'] === 'profile') {
					this.commonService.setClevertapEvent('MyProfile');
					this.router.navigate(['/my-profile']);
				} else if (response['result']['value'] === 'ttManagerDownload') {
					this.ttManagerDownload();
				} else if (response['result']['value'] === 'partnerCode') {
					// this.commonService.setClevertapEvent('MyProfile');
					this.router.navigate(['/partner-code']);
				}
				else if (response['result']['value'] === 'terms') {
					const url = 'https://images.indiainfoline.com/mailers/aaa-tnc/tnc.html';
					window.open(url, '_blank');
				}
				else if (response['result']['value'] === 'chg_psw') {
					const userType = localStorage.getItem('userType');
					this.storage.get('userType').then( value => {
					  if (value === 'RM' || value === 'FAN') {
						this.router.navigate(['/change-password']);
					  } else {
						const params = 'RqtpAs=R4TYPEF5T';
						const URL = environment['forgotPasswordURL'] + '?' + params;
						window.open(URL);
					  }
					})
				}
			}
		});
		return await this.popOverVal.present();
	}

	/**
	 * To download .exe file after click on TT Manager Download menu.
	 */
	public ttManagerDownload() {
		this.commonService.setClevertapEvent('TT Manager_Download');
		var link = document.createElement("a");
		link.setAttribute('download', '');
		link.href = 'https://content.indiainfoline.com/IIFLTT/EXE4/IIFLTTManager.msi';
		document.body.appendChild(link);
		link.click();
		link.remove();
	}

	public openAccount() {
		this.commonService.setClevertapEvent('OpenAccount_CTA');
		this.addUser();
	}

	//add new User Function
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
				let userValue = null;
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
											this.OpenWindowWithPost(investObj['addUser']['addClientURL'], '_blank', param);
										} else if (addUser === 'ICA') {
											this.commonService.setClevertapEvent('OpenAccount_IndividualClient');
											this.OpenWindowWithPost(investObj['addUser']['addICA'], '_blank', param);
										} else if (addUser === 'advisor') {
											this.commonService.setClevertapEvent('OpenAccount_RegisterAdvisor');
											this.OpenWindowWithPost(investObj['addUser']['addSubbrokerURL'], '_blank', param);
										} else if (addUser === 'NRI') {
											this.commonService.setClevertapEvent('OpenAccount_NRIClient');
											const url = investObj['addUser']['addNRI'];
											window.open(url);
										} else {
											return;
										}
			}})
		
						)
				
			})
		})
	}

	OpenWindowWithPost(url: any, name: any, params: any) {
		if (this.commonService.isApp()) {
			var pageContent = '<html><head></head><body><form id="loginForm1" action="'+ url +'" method="post">' +
				'<input type="hidden" name="LoginId" value="' + params.LoginId + '">' +
				'<input type="hidden" name="Token" value="' + params.Token + '">' +
				'<input type="hidden" name="AppSource" value="' + params.AppSource + '">' +
				'<input type="hidden" name="Checksum" value="' + params.Checksum + '">' +
				'</form> <script type="text/javascript">document.getElementById("loginForm1").submit();</script></body></html>';
			var pageContentUrl = 'data:text/html;base64,' + btoa(pageContent);
			var ref = cordova.InAppBrowser.open(
				pageContentUrl,
				"_blank",
				"hidden=no,location=no,clearsessioncache=yes,clearcache=yes"
			);
		}
		else{
							var mapForm = document.createElement("form");
                            mapForm.target = "_blank";
                            mapForm.method = "POST";
                            mapForm.action = url;
                            Object.keys(params).forEach(function (param) {
                                var mapInput = document.createElement("input");
                                mapInput.type = "hidden";
                                mapInput.name = param;
                                mapInput.setAttribute("value", params[param]);
                                mapForm.appendChild(mapInput);
                            });
                            document.body.appendChild(mapForm);
                            mapForm.submit();
	}
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

	public refer() {
		this.commonService.setClevertapEvent('Refer&Earn_Clicked');
		window.open('https://www.indiainfoline.com/business-partners/refer-a-partner/fan?utm_source=Organic&utm_medium=AAA&utm_campaign=Web', '_blank');
	}

	ngOnDestroy(): void {
		if(this.popOverVal){
			this.popOverVal.onDidDismiss();
		}
		if(this.subscription){
			this.subscription = this.subscription.unsubscribe();
		}
	}

	// moveTabTwo() {
	//   this.navCtrl.navigateForward('/markets');
	// }
	redirectToExchReport() {
		this.quicklinkboxremove = true
		this.commonService.setClevertapEvent('Dashboard_MarginShortfall_Clicked');
		//this.storage.set('realTimeMargin',{rtm:true});
		this.router.navigate(['/view-reports'],{ queryParams: {report: 'realTimeMargin'}});
		setTimeout(() => {
			this.quicklinkboxremove = false
		}, 1000);
	}
	riskReportlink() {
		this.quicklinkboxremove = true
		//this.storage.set('riskReportLink',{rpl:true});
		this.router.navigate(['/view-reports'],{ queryParams: {report: 'riskReport'}});
		setTimeout(() => {
			this.quicklinkboxremove = false
		}, 1000);
	}
  helpclick(){
	this.quicklinkboxremove = true
		if(localStorage.getItem('userType') == 'RM'){
			this.router.navigate(['/help-partner-query']);
		}
		else{
			this.router.navigate(['/help-support']);
		}
		
		setTimeout(() => {
			this.quicklinkboxremove = false
		}, 1000);
			
	}

	private downloadReport = (reportDeatails: any) => {

		if(reportDeatails.ReportName && reportDeatails.ReportName.toString().toLowerCase() == "detailedclientsreport"){
			this.downloadDetailedClientsReport(reportDeatails);
		}
	}

	private downloadDetailedClientsReport = (reportDeatails: any) => {

		this.dashBoardService.clientWireDashboardReport(reportDeatails.Token, { PartnerCode: localStorage.getItem("userId1") })
			.subscribe((res: any) => {
				if (res && res.Body && res.Body.length > 0) {
					let unzippedData = this.commonService.getGzipData(res['Body']);
					let reportData = unzippedData;
					let info: any = [];
					let head = [["Login Id", "Name", "BRANCH", "Category", "Unclear Chque", "Undelivered", "ALB", "Gross", "BMFD Balance", "AGHV", "GHV", "GHVC", "AHV", "AHVC", "ZHV", "THV", "THVC",  "SPAN", "Net worth", "FD and BG", "Collateral Value", "Short Option Premium Value", "FO Value", "Currency Value", "BMFD Funded Stock", "BMFD Earmarked Stock", "DPC frequency", "MF Ledger", "Margin THV", "Margin AHV", "Margin GHV", "Cash Coll", "NonCash Coll", "ApplblNonCash", "Coll Benefit", "Cashbalanceincludingunsettledbills", "PMUL Loan Amount", "Trading Exch Selected", "IsDormant", "account open date", "Nominee", "Freeze", "LTD"]];
					reportData.forEach((element: any) => {
						info.push([element.Loginid, element.Name, element.BRANCH, element.Category, element.UnclearChque, element.Undelivered, element.ALB, element.Gross, element.BMFDBalance, element.AGHV, element.GHV, element.GHVC, element.AHV, element.AHVC, element.ZHV, element.THV, element.THVC, element.SPAN, element.Networth, element.FDandBG, element.CollateralValue, element.ShortOptionPremiumValue, element.FOValue, element.CurrencyValue, element.BMFDFundedStock, element.BMFDEarmarkedStock, element.DPCfrequency, element.MFLedger, element.MarginTHV, element.MarginAHV, element.MarginGHV, element.CashColl, element.NonCashColl, element.ApplblNonCash, element.CollBenefit, element.Cashbalanceincludingunsettledbills, element.PMULLoanAmount, element.TradingExchSelected, element.IsDormant, moment(element.accountopendate).format('DD/MM/YYYY'), element.IsNominee, element.IsFreeze, element.LTD]);
					});
					this.commonService.exportDataToExcel(head[0], info, 'Web Wire Dashboard Report');
					this._appLoaderService.hideLoader();
				} else {
					this.toast.displayToast('No Data Found');
					this._appLoaderService.hideLoader();
				}
			});
	}
	onHelpClick(){
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
	
}
