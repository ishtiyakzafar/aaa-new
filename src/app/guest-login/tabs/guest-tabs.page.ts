import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Platform, PopoverController } from '@ionic/angular';
import { ScreensizeService } from '../../helpers/screensize.service';
import { NavigationEnd, Router } from '@angular/router';
import { URLS } from '../../../config/api.config';
import { ToasterService } from '../../helpers/toaster.service';
import { PopoverComponent } from '../../components/popover/popover.component';
import { CommonService } from '../../helpers/common.service';

declare var cordova: any;
declare var clevertap: any;

@Component({
	selector: 'app-guest-tabs',
	providers: [],
	templateUrl: 'guest-tabs.page.html',
	styleUrls: ['guest-tabs.page.scss']
})
export class GuestTabsPage implements OnInit, OnDestroy {
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
	]
	public investMenuItems: any[] = [
		{
			item: 'Equity Products',
			routeTo: '/guest/guest-invest',
			innerItems: [
				{ option: 'Grobox', newWindow: false },
				{ option: 'Invest Edge', newWindow: false }
			],
			innerItemsBroker: [
				{ option: 'Invest Edge', newWindow: false }
			]
		},
		{
			item: 'Mutual Fund Products',
			routeTo: '/guest/guest-invest',
			innerItems: [
				{ option: 'Start SIP', newWindow: false },
				{ option: 'Invest Lumpsum', newWindow: false },
				{ option: 'NFO/FMP', newWindow: false },
				{ option: 'Transfer Holdings', newWindow: false },
				{ option: 'Investment Basket', newWindow: false },
			]
		},
		{
			item: 'Insurance',
			routeTo: '/guest/guest-invest',
			innerItems: [
				{ option: 'Insurance Website', newWindow: false },
				{ option: 'New Business Mapping', newWindow: false },
				{ option: 'Renewal Business Mapping', newWindow: false }
			]
		},
		{
			item: 'Bonds',
			routeTo: '/guest/guest-invest',
			innerItems: [
				{ option: 'Primary Bonds', newWindow: true },
				{ option: 'Secondary Bonds', newWindow: false },
				{ option: 'Third Party Bonds', newWindow: false },
			]
		},
		{
			item: 'Others',
			routeTo: '/guest/guest-invest',
			innerItems: [
				{ option: 'Fixed Deposits', newWindow: false },
				{ option: 'Will Writing Service', newWindow: true },
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
			routerLink: '/guest/guest-reports',
			ionIconNotSelected: './assets/svg/mob-reports.svg',
			ionIconSelected: './assets/svg/mob-reports-selected.svg',
			ionLabel: 'Reports'
		},
		{
			routerLink: '/guest/guest-markets',
			ionIconNotSelected: './assets/svg/markets.svg',
			ionIconSelected: './assets/svg/markets_selected.svg',
			ionLabel: 'Markets'
		},
		{
			routerLink: '/guest/guest-invest',
			ionIconNotSelected: './assets/svg/invest.svg',
			ionIconSelected: './assets/svg/invest_selected.svg',
			ionLabel: 'Invest'
		},
		{
			routerLink: '/guest/guest-client-trades',
			ionIconNotSelected: './assets/svg/trade.svg',
			ionIconSelected: './assets/svg/trade_selected.svg',
			ionLabel: 'Trades'
		},
		{
			routerLink: '/guest/guest-more',
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
					innerOption: [

						{ option: 'Risk Report', routeTo: '/view-reports', value: 'riskReport', newWindow: false },
						{ option: 'Real Time Margin Shortfall', routeTo: '/view-reports', value: 'realTimeMargin', newWindow: false },
						{ option: 'Scrip Summary', routeTo: '/ScriptwiseSummary', newWindow: false },
						{ option: 'Fan Payout Summary', routeTo: '/view-reports', value: 'FanPayoutSummary', newWindow: false },
						{ option: 'Foliowise Client Details', routeTo: '/folio-wise-details', newWindow: false },
						{ option: 'DP Scrip Payout', routeTo: '/view-reports', value: 'DPScripPayout', newWindow: false },
						{ option: 'Commodity Client Summary', routeTo: '/view-reports', value: 'CommodityClientSummary', newWindow: false },
						{ option: 'Deposit Ledger', routeTo: '/view-reports', value: 'DepositLedger', newWindow: false },
						{ option: 'Fan Brokerage Ledger', routeTo: '/view-reports', value: 'FanBrokerageLedger', newWindow: false },
						{ option: 'Commodity Client Scrip Summary', routeTo: '/commodity-client-scrip-summary', newWindow: false },
						{ option: 'Outstanding Position', routeTo: '/view-reports', value: 'OutstandingReport', newWindow: false },
						{ option: 'Consolidated Trade Listing', routeTo: '/view-reports', value: 'consolidatedTradeList', newWindow: false },
						{ option: 'VAS Detailed Report', routeTo: '/VasDetailedReport', newWindow: false },
						{ option: 'Freeze Details', routeTo: '/view-reports', value: 'FreezeDetails', newWindow: false },
						{ option: 'DP Modification Details', routeTo: '/view-reports', value: 'DpModificationDetails', newWindow: false },
						{ option: 'Detailed Clients Report', value: 'DetailedClientsReport', downloadFlag: true, newWindow: false },
						{ option: 'Settlement Payout Report', routeTo: '/settlement-payout-report', newWindow: false },
						{ option: 'DRF Status', routeTo: '/view-reports', value: 'DematRequestStatus', newWindow: false }
					]
				}
			]
		},
		{
			title: 'Individual Clients',
			innerItems: [
				{
					innerTitle: 'Trading',
					innerOption: [
						{ option: 'Realized PnL', routeTo: '/share-reports', newWindow: false, value: 'realised' },
						{ option: 'Unrealized PnL', routeTo: '/share-reports', newWindow: false, value: 'unrealised' },
						{ option: 'BOD Holding', routeTo: '/view-reports', newWindow: false, value: 'bodHolding' },
						{ option: 'DP Holding', routeTo: '/share-reports', newWindow: false, value: 'dpholding' }
					]
				},

				{
					innerTitle: 'Daily Reports',
					innerOption: [
						{ option: 'DP Transaction', routeTo: '/share-reports', newWindow: false, value: 'dpTransaction' },
						{ option: 'Trade Listing', routeTo: '/share-reports', newWindow: false, value: 'tradeListing' },
						{ option: 'STT Certificate', routeTo: '/share-reports', newWindow: false, value: 'sttCertificate' },
						{ option: 'Daily Bills', routeTo: '/share-reports', newWindow: false, value: 'dailyBills' },
						{ option: 'Digital Contract Notes', routeTo: '/share-reports', newWindow: false, value: 'digitalContract' },
					]
				},
				{
					innerTitle: 'MF',
					innerOption: [
						{ option: 'MF Capital Gain', routeTo: '/share-reports', newWindow: false, value: 'mfCapital' },
						{ option: 'MF Account Statement', routeTo: '/share-reports', newWindow: false, value: 'mfAccount' },
						{ option: 'AMC Statement', routeTo: '/share-reports', newWindow: false, value: 'amcStmt' },
					]
				},
				{
					innerTitle: 'Others',
					innerOption: [
						{ option: 'Commodity Realtime', routeTo: '/share-reports', newWindow: false, value: 'crtr' },
						{ option: 'Simplified Ledger', routeTo: '/share-reports', newWindow: false, value: 'simplified' },
						// {option: 'Client 360', routeTo: '/share-reports', newWindow: false ,value:'360Client'},
						{ option: 'Interest on Delayed Payment', routeTo: '/share-reports', newWindow: false, value: 'interestOnDelayedPayment' },

					]
				}

			]
		},
		{
			title: 'Others',
			innerItems: [{
				innerOption: [
					{ option: 'Scrip Master', routeTo: '/view-reports', value: 'ScripMaster', newWindow: false },
					{ option: 'Shares Deposit', routeTo: '/view-reports', value: 'SharesDeposit', newWindow: false },
					{ option: 'GST Invoice', routeTo: '/view-reports', value: 'GSTInvoice', newWindow: false },
					{ option: 'Pay Details', routeTo: '/pay-details', newWindow: false },
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
					innerOption: [

						{ option: 'Risk Report', routeTo: '/view-reports', value: 'riskReport', newWindow: false },
						{ option: 'Real Time Margin Shortfall', routeTo: '/view-reports', value: 'realTimeMargin', newWindow: false },
						{ option: 'Commodity Client Summary', routeTo: '/view-reports', value: 'CommodityClientSummary', newWindow: false },
						{ option: 'Consolidated Trade Listing', routeTo: '/view-reports', value: 'consolidatedTradeList', newWindow: false },
						{ option: 'DP Scrip Payout', routeTo: '/view-reports', value: 'DPScripPayout', newWindow: false },
						{ option: 'Scrip Summary', routeTo: '/ScriptwiseSummary', newWindow: false },
						{ option: 'Foliowise Client Details', routeTo: '/folio-wise-details', newWindow: false },
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
					innerOption: [
						{ option: 'Realized PnL', routeTo: '/share-reports', newWindow: false, value: 'realised' },
						{ option: 'Unrealized PnL', routeTo: '/share-reports', newWindow: false, value: 'unrealised' },
						{ option: 'BOD Holding', routeTo: '/view-reports', newWindow: false, value: 'bodHolding' },
					]
				},

				{
					innerTitle: 'Daily Reports',
					innerOption: [
						{ option: 'DP Transaction', routeTo: '/share-reports', newWindow: false, value: 'dpTransaction' },
						{ option: 'Trade Listing', routeTo: '/share-reports', newWindow: false, value: 'tradeListing' },
						{ option: 'STT Certificate', routeTo: '/share-reports', newWindow: false, value: 'sttCertificate' },
						{ option: 'Daily Bills', routeTo: '/share-reports', newWindow: false, value: 'dailyBills' },
						{ option: 'Digital Contract Notes', routeTo: '/share-reports', newWindow: false, value: 'digitalContract' },
					]
				},
				{
					innerTitle: 'MF',
					innerOption: [
						{ option: 'MF Capital Gain', routeTo: '/share-reports', newWindow: false, value: 'mfCapital' },
						{ option: 'MF Account Statement', routeTo: '/share-reports', newWindow: false, value: 'mfAccount' },
						{ option: 'AMC Statement', routeTo: '/share-reports', newWindow: false, value: 'amcStmt' },
					]
				},
				{
					innerTitle: 'Others',
					innerOption: [
						{ option: 'Commodity Realtime', routeTo: '/share-reports', newWindow: false, value: 'crtr' },
						{ option: 'Simplified Ledger', routeTo: '/share-reports', newWindow: false, value: 'simplified' },
						// {option: 'Client 360', routeTo: '/share-reports', newWindow: false ,value:'360Client'},
						{ option: 'Interest on Delayed Payment', routeTo: '/share-reports', newWindow: false, value: 'interestOnDelayedPayment' },

					]
				}

			]
		},
		{
			title: 'Others',
			innerItems: [{
				innerOption: [
					{ option: 'Scrip Master', routeTo: '/view-reports', value: 'ScripMaster', newWindow: false },
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
		private popoverController: PopoverController,
		private toast: ToasterService,
		private commonService: CommonService
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
	}

	setHoverState(hovered: boolean) {
		this.isHovered = hovered;
	}

	redirectReportsItem(item: any) {
		// Define the query parameters you want to pass		 
		const queryParams = { report: item.value };
		// Navigate to the desired route with the query parameters
		// this.router.navigate([item.routeTo], { queryParams });
		this.toast.displayToast("Reports are not available for Guest Login");
		this.hideReportstMenu();

	}

	initializeBack() {
		this.router.events.forEach((event: any) => {
			if ((this.router.url == '/guest/guest-markets' || this.router.url == '/guest/guest-invest' || this.router.url == '/guest/guest-client-trades' || this.router.url == '/guest/guest-more' || this.router.url == '/guest-dashboard') && event['url'] != undefined) {
				this.platform.backButton.subscribeWithPriority(10, () => {
					if (this.router.url == '/guest/guest-markets' || this.router.url == '/guest/guest-invest' || this.router.url == '/guest/guest-client-trades' || this.router.url == '/guest/guest-more') {
						this.router.navigate(['/guest/guest-dashboard']);
					}
					else if (this.router.url == '/guest/guest-dashboard') {
						this.toast.displayToast('Back to exit / Home to minimize');
						this.platform.backButton.subscribeWithPriority(10, () => {
							(navigator as any)['app'].exitApp();
						});
					}
				});
			}
		});
	}

	ngOnInit() {
	}

	ionViewWillEnter() {
		this.tabSelectedValue = null;
	}
	// Redirection Segment for Market
	goToMarketSeg(obj: any) {
		this.dashboardSegmentSelectedValue = 'markets';
		this.toast.displayToast('Markets/Trades are not available for Guest Login');
		this.hideMarketsMenu();
	}
	// Redirection Segment for dashboard
	goToDashboardSeg(objValue: any) {
		this.dashboardSegmentSelectedValue = 'dashboard';
		// console.log(objValue);
		if (objValue == 'AUM Report') {
			this.router.navigate(['/guest/guest-dashboard', 'aum']);
		}
		else if (objValue == 'SIP Book') {
			this.router.navigate(['/guest/guest-dashboard', 'sipBook']);
		}
		else if (objValue == 'AFYP Report') {
			this.router.navigate(['/guest/guest-dashboard', 'totalAfyp']);
		}
		else if (objValue == 'All Clients') {
			this.router.navigate(['/guest/guest-dashboard', 'totalClients']);
		}
		else if (objValue == 'Brokerage Report') {
			this.router.navigate(['/guest/guest-dashboard', 'brokerage']);
		}

	}
	// Redirection Segment for Client & Trades
	clientTradesMenu(value: any) {
		// console.log(value);
		this.dashboardSegmentSelectedValue = 'client';
		this.toast.displayToast('Markets/Trades are not available for Guest Login');
		this.hideClientsTradesMenu();
	}

	redirectInvest(option: any) {
		this.dashboardSegmentSelectedValue = 'invest';
		this.toast.displayToast(`${option} is not available for Guest Login`);
		this.hideInvestMenu();
	}

	redirectReports(link: any, newWindow: any, obj: any) {
		this.dashboardSegmentSelectedValue = 'reports';
		if (newWindow) {
			window.open(link, '_blank');

		}
		else {
			switch (obj['option']) {
				case 'Risk Report':
					this.router.navigate(['/view-reports'], { queryParams: { report: 'riskReport' } });
					break;
				case 'Real Time Margin Shortfall':
					this.router.navigate(['/view-reports'], { queryParams: { report: 'realTimeMargin' } });
					break;
				case 'Scrip Summary':
					this.router.navigate(['/ScriptwiseSummary']);
					break;
				case 'Fan Payout Summary':
					this.router.navigate(['/view-reports'], { queryParams: { report: 'FanPayoutSummary' } });
					break;
				case 'DP Scrip Payout':
					this.router.navigate(['/view-reports'], { queryParams: { report: 'DPScripPayout' } });
					break;
				case 'Commodity Client Summary':
					this.router.navigate(['/view-reports'], { queryParams: { report: 'CommodityClientSummary' } });
					break;
				case 'Commodity Client Scrip Summary':
					this.router.navigate(['/view-reports'], { queryParams: { report: 'CommodityClientScrip' } });
					break;
				case 'VAS Detailed Report':
					this.router.navigate(['/VasDetailedReport']);
					break;
				case 'Deposit Ledger':
					this.router.navigate(['/view-reports'], { queryParams: { report: 'DepositLedger' } });
					break;
				case 'Fan Brokerage Ledger':
					this.router.navigate(['/view-reports'], { queryParams: { report: 'FanBrokerageLedger' } });
					break;
				case 'BOD Holding':
					this.router.navigate(['/view-reports'], { queryParams: { report: 'BODHolding' } });
					break;
				case 'Commodity Realtime':
					this.router.navigate(['/view-reports'], { queryParams: { report: 'CommodityRealtime' } });
					break;
				case 'Scrip Master':
					this.router.navigate(['/view-reports'], { queryParams: { report: 'ScripMaster' } });
					break;
				case 'Shares Deposit':
					this.router.navigate(['/view-reports'], { queryParams: { report: 'SharesDeposit' } });
					break;
				case 'GST Invoice':
					this.router.navigate(['/view-reports'], { queryParams: { report: 'GSTInvoice' } });
					break;

				default:
					this.router.navigate([link], { queryParams: { type: obj['value'] } });
					this.router.navigate([link], { queryParams: { type: obj['value'] } });
			}
		}
	}

	dashboardTopMenuSegment() {
		if (this.dashboardSegmentSelectedValue === 'more') {
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
		if (this.lastPath === '/guest/guest-dashboard' || this.lastPath.split('/')[1] === 'dashboard' || this.lastPath.includes('dashboard')) {
			this.dashboardSegmentSelectedValue = 'dashboard';
			this.titleService.setTitle('IIFL AAA Dashboard');
		} else if (this.lastPath === '/guest/guest-reports' || this.lastPath === '/view-reports' || this.lastPath === '/share-reports' || this.lastPath === '/client-portfolio') {
			this.dashboardSegmentSelectedValue = 'reports';
			this.lastPath = '/guest/guest-reports';
			this.titleService.setTitle('IIFL AAA reports');
		} else if (this.lastPath === '/guest/guest-markets' || this.lastPath === '/company-details-superstars') {
			this.dashboardSegmentSelectedValue = 'markets';
			this.lastPath = '/guest/guest-markets';
			this.titleService.setTitle('IIFL AAA Markets');
		} else if (this.lastPath === '/guest/guest-invest') {
			this.dashboardSegmentSelectedValue = 'invest';
			this.titleService.setTitle('IIFL AAA Invest');
		} else if (this.lastPath === '/guest/guest-client-trades' || this.lastPath.split('/')[1] === 'client-trades' || this.lastPath === '/client-interactions') {
			// } else if (this.lastPath === '/recently-viewed-client-list') {
			this.dashboardSegmentSelectedValue = 'client';
			this.titleService.setTitle('IIFL AAA Client & Trades');
		} else if (this.lastPath === '/mobile-more-option') {
			this.dashboardSegmentSelectedValue = 'more';
			this.titleService.setTitle('IIFL AAA More');
			// this.hideIonTabBar = true;
		} else if (this.lastPath === '/guest/guest-more' || this.lastPath === '/partner-query' || this.lastPath === '/help-partner-query' || this.lastPath === '/raise-query' || this.lastPath === '/help-support' || this.lastPath === '/help-faq' || this.lastPath === '/help-faq-root' || this.lastPath === '/help-faq-subroot' || this.lastPath === '/help-search-ques' || this.lastPath === '/faq-details') {
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
		} else if (this.lastPath === '/settings' || this.otherLastPath === 'client-list' || this.lastPath === '/price-calculator' || this.lastPath === '/client-equity-commodity' || this.lastPath === '/client-details' || this.lastPath === '/detailed-news' || this.lastPath === '/guest/guest-invest-fixed-deposit' || this.lastPath === '/guest/guest-invest-bond') {
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
		if (newTitle != 'IIFL AAA Client & Trades') {
			localStorage.setItem('clientDetail', "false")
		}
		if (newTitle == 'Family Portfolio') {
			this.toast.displayToast("Family Portfolio is not available for Guest Login")
		}
		this.titleService.setTitle(newTitle);
		this.routerEvents = this.router.events.subscribe(
			(event: any) => {
				if (event instanceof NavigationEnd) {
					if (event.url == '/guest/guest-dashboard') {
					} else if (event.url == '/guest/guest-reports') {
					}
				}
			}
		)
	}

	selectTabButton(value: any) {
		this.tabSelectedValue = value;
	}

	public openProfile(ev: any) {
		let items = [
			{ title: 'Exit', value: 'logout' }
		]
		this.openPopover(ev, items);
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
					this.toast.displayToast("Successfully exited");
					this.commonService.setClevertapEvent("Guest_Exit_Clicked", { 'Mobile Number': localStorage.getItem("GuestMobileNumber") });
					//this.commonService.triggerAppsflyerLogEvent('Guest_Exit_Clicked', { 'Mobile Number': localStorage.getItem("GuestMobileNumber") });
					localStorage.clear();
					this.router.navigate(['/demo']);
				}
			}
		});
		return await this.popOverVal.present();
	}

	public refer() {
		window.open('https://www.indiainfoline.com/business-partners/refer-a-partner/fan?utm_source=Organic&utm_medium=AAA&utm_campaign=Web', '_blank');
	}

	ngOnDestroy(): void {
		if (this.popOverVal) {
			this.popOverVal.onDidDismiss();
		}
		if (this.subscription) {
			this.subscription = this.subscription.unsubscribe();
		}
	}

	// moveTabTwo() {
	//   this.navCtrl.navigateForward('/markets');
	// }
	redirectToExchReport() {
		this.quicklinkboxremove = true
		//this.storage.set('realTimeMargin',{rtm:true});
		this.router.navigate(['/view-reports'], { queryParams: { report: 'realTimeMargin' } });
		setTimeout(() => {
			this.quicklinkboxremove = false
		}, 1000);
	}
	riskReportlink() {
		this.quicklinkboxremove = true
		//this.storage.set('riskReportLink',{rpl:true});
		this.router.navigate(['/view-reports'], { queryParams: { report: 'riskReport' } });
		setTimeout(() => {
			this.quicklinkboxremove = false
		}, 1000);
	}
	helpclick() {
		this.quicklinkboxremove = true
		if (localStorage.getItem('userType') == 'RM') {
			this.router.navigate(['/help-partner-query']);
		}
		else {
			this.router.navigate(['/help-support']);
		}

		setTimeout(() => {
			this.quicklinkboxremove = false
		}, 1000);

	}
}
