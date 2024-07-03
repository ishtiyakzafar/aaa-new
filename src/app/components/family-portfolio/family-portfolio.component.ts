import { Component, OnInit, ViewChild, Input, Inject, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { DOCUMENT } from "@angular/common";
import { Subscription, Subject, interval, forkJoin } from 'rxjs';
import { ClientTradesService } from '../../pages/recently-viewed-client-list/client-trades.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import moment from 'moment';
import jsPDF from 'jspdf';
import { OrderPipe } from 'ngx-order-pipe';
import * as lodash from 'lodash';
import { debounceTime, switchMap } from 'rxjs/operators';
import {
	ApexAxisChartSeries,
	ApexDataLabels,
	ApexChart,
	ApexPlotOptions,
	ApexLegend,
	ApexStroke,
	ApexTooltip,
	ApexStates
	// ApexFill
} from "ng-apexcharts";
import { saveAs } from 'file-saver';
import { Workbook } from 'exceljs';

// import { IonSlides, ModalController, Platform } from '@ionic/angular';		review. removed IonSlides
import { LocationStrategy } from '@angular/common';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
export type ChartOptions = {
	series: ApexAxisChartSeries;
	chart: ApexChart;
	dataLabels: ApexDataLabels;
	plotOptions: ApexPlotOptions;
	legend: ApexLegend;
	colors: string[];
	stroke: ApexStroke;
	tooltip: ApexTooltip,
	states: ApexStates
	// fill: ApexFill
};
// import { PopoverController } from '@ionic/angular';
// import { ItemPopoverComponent } from './../../components/item-popover/item-popover.component';
import { Platform, PopoverController } from '@ionic/angular';
import { TableDropdownComponent } from '../table-dropdown/table-dropdown.component';
import { DashBoardService } from '../../pages/dashboard/dashboard.service';
import { CustomEncryption } from '../../../config/custom-encrypt';
import { FormatNumberDecimalPipe } from '../../helpers/decimalNumber.pipe';
import { FormatNumberDecimalCommaPipe } from '../../helpers/decimalNumberComma.pipe';
import { ShareReportService } from '../../pages/share-reports/share-report.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { ToasterService } from '../../helpers/toaster.service';
import { CommonService } from '../../helpers/common.service';
import { LedgerPopoverComponent } from '../ledger-popover/ledger-popover.component';

@Component({
	selector: 'app-family-portfolio',
	providers: [CommonService, ClientTradesService,OrderPipe, DashBoardService, CustomEncryption, FormatNumberDecimalPipe, FormatNumberDecimalCommaPipe, WireRequestService, ShareReportService],
	templateUrl: './family-portfolio.component.html',
	styleUrls: ['./family-portfolio.component.scss'],
})
export class FamilyPortfolioComponent implements OnInit {
	@ViewChild('detail') detail?: ElementRef;
	public detailHeight!: number;
	@ViewChild('chartJSContainer1') chartJSContainer1: any;
	@ViewChild('chartJSContainer2') chartJSContainer2: any;
	@ViewChild('chartJSContainer3') chartJSContainer3: any;
	@ViewChild('chartSlides') chartSlides: ElementRef | undefined;// IonSlides;		review
	
	public chartOptions!: Partial<ChartOptions>| any;
	@Input() selectedTab: any;
	@Input() tabsValue: any;
	clientTabValue = "rmView"
	clientTabTrack: any;
	dognut: any;
	dognut1: any;
	dognut2: any;
	treeChartFirst: any;
	treeChartSecond: any;
	displayBreakdown: boolean = false;
	ParentClientCode: any;
	MakerId: any;
	public cardSegments: any[] = [
		{ name: 'Stocks', segmentValue: 'equity', value: '0', pl: '0', sequence: 0, table: 'table-1' },
		{ name: 'Mutual Funds', segmentValue: 'mutualFund', value: '0', pl: '0', sequence: 1, table: 'table-2' },
		{ name: 'Fixed Deposit', segmentValue: 'fd', value: '0', pl: '0', sequence: 2, table: 'table-3' },
		{ name: 'Bonds', segmentValue: 'bonds', value: '0', pl: '0', sequence: 3, table: 'table-4' },
		{ name: 'AIF', segmentValue: 'aif', value: '0', pl: '0', sequence: 4, table: 'table-5' },
		{ name: 'PMS', segmentValue: 'pms', value: '0', pl: '0', sequence: 5, table: 'table-6' },

	]
	public equityBlockTabValue = 'equity';
	public moment: any = moment;
	portfolioData: any;
	clientCode: any;
	clientName: any;
	pnlClientCode: any;
	pnlClientName: any;
	clientEqData: any[] = [];
	mfSeg: any;
	displayClientDropDownField: boolean = true;
	clientToken: any;
	clientLoginId: any;
	mfSegment = [
		{ value: 'EquityData', type: 'Equity', check: true },
		{ value: 'elss', type: 'ELSS', check: false },
		{ value: 'debt', type: 'Debt', check: false },
		{ value: 'hybrid', type: 'Hybrid', check: false },
		{ value: 'others', type: 'Others', check: false }
	]
	clientBlockTabValue: any = "EquityData";
	mfTableDisplay: any[] = [];
	displayDonutChart: boolean = true;
	displayTreeChart: boolean = false;
	currentValue: any = 0;
	investedValue: any = 0;
	lastUpdated: any;
	unRealisePlValue: any = 0;
	unRealisePlPer: any = 0;
	clientMfData: any[] = [];
	hybridCatagory: any[] = [];
	equityCatagory: any[] = [];
	elssCatagory: any[] = [];
	debtCatagory: any[] = [];
	liquidCatagory: any[] = [];
	othersCatagory: any[] = [];
	familyMappList: any[] = [];
	memberClientCode: any;
	selectRelation: any;
	displayMemberContent: boolean = true;
	checkOtp: any;
	productAssetSummary: any[] = [];
	productSummaryData: any[] = [];
	memberData: any[] = [];
	filterProdDetail: any[] = [];
	parentClientCode: any;
	htmlData: any = null;
	clientPmsData: any;
	totalEqHoldingValue: number = 0;
	totalEqUnrealizeGl: number = 0;
	eqHoldingPer: number = 0;
	mfAllocation = 0;
	bondsAllocation = 0;
	aifAllocation = 0;
	pmsAllocation = 0;
	fdAllocation = 0;

	eqAllocation = 0;
	totalMfHoldingValue = 0;
	totalPmsHoldingValue = 0;
	totalAifHoldingValue = 0;
	totalMfUnrealizeGl = 0;
	totalBondsUnrealizeGl = 0;
	totalFdUnrealizeGl = 0;
	totalAifUnrealizeGl = 0;
	totalPmsUnrealizeGl = 0;

	mfHoldingPer = 0
	bondsHoldingPer = 0
	fdHoldingPer = 0
	aifHoldingPer = 0
	pmsHoldingPer = 0

	itemsPerPage = 7;
	itemsPerPagePl = 9;
	data: any = [];
	rmName: any = '-';
	rmEmail: any = '-';
	rmMobile: any = '-';
	dataLoad?: boolean;
	tabPanelPnlLoader!: boolean;
	pdfLoader: boolean = true;
	stocksEquityValue = null;
	mfEquityValue = null;
	displayRelation = "FAMILY";
	pnlDisplayRelation = "SELF";
	clientMappMsg: boolean = false;
	chartMemberData = [];
	chartProdData = [];
	fdData: any[] = [];
	displayReport: boolean = false;
	// portfolioRes:boolean = false;
	totalMfCurrentValue = 0;
	totalBondsCurrentValue = 0;
	totalFdCurrentValue = 0;
	totalAifCurrentValue = 0;
	totalPmsCurrentValue = 0;
	parentClientName: any;
	private subscription: Subscription = new Subscription();
	memberGraph: boolean = true;
	productChartData: any[] = [];
	aifData: any[] = [];
	totalEqCurrentValue = 0
	eqTableDisplay: any[] = [];
	fdTableDisplay: any[] = [];
	bondsTableDisplay: any[] = [];
	aifTableDisplay: any[] = [];
	pmsTableDisplay: any[] = [];
	isOpen = false;
	displayStep1: boolean = false;
	displayStep2: boolean = false;
	displayStep3: boolean = false;
	verifyBtn: boolean = true;
	familyOptionDisplay: boolean = true;
	public val: string = 'asc';

	//Sorting
	public order!: string;
	public ascending: boolean = true;
	reverse: boolean = false;
	visible?: boolean;
	dropvisible?: boolean;
	clientSearchValue: any;
	portfolioUserId:any;
	isBrokingClient: boolean = false;
	clientType!: string;
	displayClientCode?: string;
	treeMapOptionList: any[] = [
		{ 'id': 'asset', 'value': true, 'label': 'Asset Class' },
		{ 'id': 'family', 'value': false, 'label': 'Family' },
		{ 'id': 'products', 'value': false, 'label': 'Product' }
	]

	// GrandTotal Variables
	grandTotalMFpnl:any;

	public isDropDownVisible: boolean = false;
	@Input() public changeDetPage: any;
	// Anaytics Data
	eqAnalyData: any = [];
	mfAnalyData: any = [];
	clientCodeList: any[] = [];
	viewData: boolean = false;
	screenWidth:any;
	desktop: boolean;
	headerNative:  boolean = true;
	slideLeadWeb = {
		pagination: {
			el: ".swiper-pagination",
			type: "bullets",
			clickable: true
		},
		slidesPerView: 1,
		//spaceBetween: 5,
		//pager:true,
		// autoplay : true,
		// loop: true
	}
	isPortfolioDownload: boolean = false;
	isProductDownload: boolean = false;
	displayDuration: boolean = false;
	userType: any;
	private clientSearchTerms = new Subject<string>();
	dtLoad: boolean = false;
	iraName:any;
	iraEmail:any;
	iraMobile:any;
	displayMainDropDown:boolean = false;
	initUserId:any;
	subscribeOtp!: Subscription;

	commonChartOptions: any = {
		cutout: '80%',
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false
			}
		}
	}
	pdfChartOptions: any = {
		cutout: '70%',
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false
			}
		}
	}
	chart1Labels: string[] = [];
	chart1Data: any[] = [
		{ data: [], backgroundColor: ['#5E3FBE', '#A88DEB', '#84DDFC', '#f1956c'], borderWidth: 0 }
	];
	chart2Labels: string[] = [];
	chart2Data: any[] = [
		{ data: [], backgroundColor: ['#5E3FBE', '#A88DEB', '#84DDFC', '#F1956C', '#FFEA81'], borderWidth: 0 }
	];
	chart3Labels: string[] = [];
	chart3Data: any[] = [
		{ data: [], backgroundColor: ['#5E3FBE', '#A88DEB', '#84DDFC', '#F1956C', '#FFEA81', '#593CC7', '#0080B2'], borderWidth: 0 }
	];
	pdfFamilyLabels: string[] = [];
	pdfFamilyData: any[] = [
		{ data: [], backgroundColor: ['#FF4F01', '#FF9000', '#F9C501', '#8BCA01', '#00B29C'], borderWidth: 0 }
	];
	pdfproductWiseLabels: string[] = [];
	pdfproductWiseData: any[] = [
		{ data: [], backgroundColor: ['#FF4F01', '#FF9000', '#F9C501', '#8BCA01', '#00B29C', '#0080B2'], borderWidth: 0 }
	];
	reportType: any = [
		{
			title: 'Portfolio Summary',
			value: 'portfolio',
			isChecked: false,
		},
		{
			title: 'Product Wise Holdings',
			value: 'product',
			isChecked: false,
		},
		{
			title: 'Realized P&L',
			value: 'pl',
			isChecked: false,
		},
	];
	selectedReport: any = [];
	dateRangeType: any = 'yearWise';
	yearRangeValue: any;
	fromDate: any;
	toDate: any;
	financialYrList: any[] = [];
	myOptions: any = {
		dateFormat: 'dd/mm/yyyy',
		showMonthNumber: false
	}
	Loadvalue = false;
	inputattr = false;
	realizedPlData:any = [];
	familyMemberList:any = [];
	family_member_value: any;
	realizedClientCode:any;
	passDisplayAnalyticsSection: boolean = false;
	currentTab: string = "Portfolio_tab";
	clientId: any;
	selectedDropdownClient: any;
	showStartDatePicker: boolean = false;
	showEndDatePicker: boolean = false;
	ionFromDate: any;
	ionToDate: any;
	currentDate: any;
	isDownloadDatePicker: boolean = false;
	tabPanelPnlTable: string = "";
	dividendTableList: { 
		Total_Dividend_Amount: string,
		EquityDividend: {
			ClientCode: string,
			ScripName: string,
			ExDate: string,
			Dividend_Amount: string,
		}[]
	} = { Total_Dividend_Amount: "0", EquityDividend: []}
	displayPopup: boolean = false;
	storeProducts:any = [];
	productLastUpdatedDate:any;


	constructor(@Inject(DOCUMENT) private document: Document,
		private clientService: ClientTradesService, private storage: StorageServiceAAA, private ciphetText: CustomEncryption, private router: Router, public toast: ToasterService,
		private sanitize: DomSanitizer, private orderPipe: OrderPipe, private formatNumDecimal: FormatNumberDecimalPipe, private formatNumDecimalComma: FormatNumberDecimalCommaPipe, private commonService: CommonService, private popoverController: PopoverController, private dashBoardService: DashBoardService,
		private platform: Platform, private route: ActivatedRoute, private locationSt: LocationStrategy, private wireReqService: WireRequestService, private shareReportSer: ShareReportService, private elementRef: ElementRef
	) {

		if (this.platform.is('desktop')) {
			this.desktop = true
		}
		else {
			this.desktop = false
		}
		if (location.pathname == '/family-portfolio') {
			// history.pushState(null, null, window.location.href);
			history.pushState(null, "", window.location.href);
			this.locationSt.onPopState(() => {
				// history.pushState(null, null, window.location.href);
				history.pushState(null, "", window.location.href);
			});
		}
	}


	
    
	ionViewWillEnter() {
		this.clientSearchValue = null;
		this.viewData = false;
		let token = localStorage.getItem('jwt_token')
		let userId1 = localStorage.getItem('userId1');
		this.clientCodeList = [];
		this.storage.get('userType').then(type => {
			if (type === 'RM') {
				this.userType = type;
			} else if (type === 'FAN') {
				this.userType = 'FN';
			} else {
				this.userType = 'SB';
			}
		})
		this.clientSearchTerms
			.pipe(
				debounceTime(500),
				switchMap((searchValue) => this.dashBoardService.fetchGetClientCodes(this.userType, userId1, token, searchValue)))
			.subscribe(results => {
				let clientData = [].concat(...results);
				const data = clientData;
				this.setClientSearch(data);
			});
			this.setInitialDates();
		this.currentDate = moment(new Date()).format("YYYY-MM-DD");
		this.commonService.setClevertapEvent('ReportfamilyPortfolio_Clicked', { 'Login ID': localStorage.getItem('userId1') })
		if (location.pathname == '/client-portfolio') {
			localStorage.removeItem('tokenData')
			localStorage.removeItem('clientLoginId')

			this.storage.get('userType').then(type => {
				if (type === 'RM' || type === 'FAN') {
					this.storage.get('userID').then((userId) => {
						this.storage.get('sToken').then(token => {
							this.portfolioToken = token;
							this.portfolioUserId = this.ciphetText.aesEncrypt(userId);
							this.initUserId = this.ciphetText.aesEncrypt(userId);

						})
					})
				}
				else {
					this.storage.get('userID').then((userId) => {
						this.storage.get('subToken').then(token => {
							this.portfolioToken = token;
							this.portfolioUserId = this.ciphetText.aesEncrypt(userId);
							this.initUserId = this.ciphetText.aesEncrypt(userId);
						})
					})
				}
			})
			if (localStorage.getItem('saveClientId')) {
				this.viewData = false;
				this.getClientCode = localStorage.getItem('familyClientId');
				setTimeout(() => {
					this.initPortfolio();
					this.viewData = true;
				}, 1000);
			}
		}
		this.currentTab = "Portfolio_tab";
		if (location.pathname == '/family-portfolio') {
			this.displayClientDropDownField = false;
			this.route.queryParams.subscribe((params: any) => {

				//Review getting undefined for both ID and Token yet everything is working
				//suggestion: should remove all occurences in localStorage for portfolioId & portfolioToken
				localStorage.setItem('portfolioId',params.id);
				localStorage.setItem('portfolioToken',params.TOKEN);

				setTimeout(() => {
					let key = [78, 86, 69, 73, 78, 69, 38, 42, 60, 49, 64, 84, 79, 102, 46, 42];
					let iv = [83, 71, 26, 58, 54, 35, 22, 11, 83, 71, 26, 58, 54, 35, 22, 11];
					let encryClientID;
					let passToken;
					let mobileHeader;
					if(!this.desktop){
						encryClientID = localStorage.getItem('portfolioId') ? localStorage.getItem('portfolioId') : params.id;
						passToken = localStorage.getItem('portfolioToken') ? localStorage.getItem('portfolioToken') : params.TOKEN;
						mobileHeader = localStorage.getItem('mobileNative') ? localStorage.getItem('mobileNative') : params.Mobilenative;
						if(mobileHeader == "yes"){
							this.headerNative = false;
						}
						else{
							this.headerNative = true;
						}
					}
					else{
						encryClientID = localStorage.getItem('portfolioId');
						passToken = localStorage.getItem('portfolioToken');
					}
					if (!(encryClientID && passToken)) {
						this.router.navigate(['/not-found']);
						return;
					}
					let textValue = this.ciphetText.getDecryptedValue(encryClientID.replace(/\s+/g, "+"), key, iv);
					let fetchClientId = textValue.substring(0, 8);
					//this.viewData = true;
					this.portfolioUserId = "";
					this.getSessionTrToken(fetchClientId, passToken);
				}, 1000);

			})

			this.commonService.analyticEvent('Cl_Portfolio360_Clicked', 'Client Family Portfolio');


		}
		localStorage.removeItem('saveClientId')
		localStorage.removeItem('totalHoldings');
		this.eqAnalyData = [];
		this.clientMfData = [];
	}

	getCurrent_FinancialYear() {
		var financial_year = "";
		var today = new Date();
		if ((today.getMonth() + 1) <= 3) {
			financial_year = (today.getFullYear() - 1) + "-" + today.getFullYear()
		} else {
			financial_year = today.getFullYear() + "-" + (today.getFullYear() + 1)
		}
	}

	getFinancial_YearList(year1: any, year2: any) {
		var financialYear = [];
		for (var i = 0; i < 6; i++) {
			financialYear.push((year1 - i) + '-' + (year2 - i))
		}
		return financialYear
	}


	sliderIndex: number = 0;
	isLastIndex: boolean = false;

	async chartSlideChanged(event: any) {
		this.sliderIndex = await this.chartSlides?.nativeElement.swiper.activeIndex;;
 		if(this.chartSlides?.nativeElement.swiper.isEnd) {
			this.isLastIndex = true;
		};
	}

	setInitialDates(){
		this.financialYrList = this.getFinancialYearList(this.getCurrentFinancialYear().split('-')[0], this.getCurrentFinancialYear().split('-')[1])
		this.yearRangeValue = this.financialYrList[0];
		this.fromDate = new Date(this.yearRangeValue.split('-')[0] + '-' + '04' + '-' + '01');
		this.ionFromDate = this.commonService.getIonDateTimeFormat(this.fromDate);
		this.toDate = new Date();
		this.ionToDate = this.commonService.getIonDateTimeFormat(this.toDate);
		var tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		this.myOptions['disableSince'] = { year: moment(tomorrow).format('YYYY'), month: moment(tomorrow).format('MM'), day: moment(tomorrow).format('DD') }
	}
	urlParameter: any;

	ngOnInit() {
		this.segmentChangedWkMonth("1M")
		this.financialYrList = this.getFinancialYearList(this.getCurrentFinancialYear().split('-')[0], this.getCurrentFinancialYear().split('-')[1]);
		this.yearRangeValue = this.financialYrList[0];
		this.screenWidth = window.innerWidth;
		this.subscription = new Subscription();
		if(this.desktop || this.screenWidth > 1360){
			setTimeout(() => {
				location.search.replace('?id' + localStorage.getItem('portfolioId') + '?TOKEN' + localStorage.getItem('portfolioToken') + '?Mobilenative' + localStorage.getItem('mobileNative'), '');
				this.router.navigate(
					[],
					{
						relativeTo: this.route,
						queryParams: {
							'id': null,
							'TOKEN': null,
							'Mobilenative':null
						},
						queryParamsHandling: 'merge', // remove to replace all query params by provided
					});
	
			}, 1500);
		}
	}

	//  Select the financial Yr from year dropdown

	select_FamilyMember(event: any) {
		this.realizedClientCode = this.familyMappList.find((item) => item.ClientName === event).ClientCode;
	}

	getCurrentFinancialYear() {
		var financial_year = "";
		var today = new Date();
		if ((today.getMonth() + 1) <= 3) {
			financial_year = (today.getFullYear() - 1) + "-" + today.getFullYear()
		} else {
			financial_year = today.getFullYear() + "-" + (today.getFullYear() + 1)
		}
		return financial_year;
	}

	getFinancialYearList(year1: any, year2: any) {
		var financialYear = [];
		for (var i = 0; i < 6; i++) {
			financialYear.push((year1 - i) + '-' + (year2 - i))
		}
		return financialYear
	}

	portfolioToken: any;
	getSessionTrToken(userClientid: any, authToken: any) {
		this.subscription.add(
		this.clientService.getSessionToken(userClientid, authToken)
			.subscribe((res: any) => {
				// let res = {
				// 	"head": {
				// 		"responseCode": "IIFLMarRQSAFCBL01",
				// 		"status": 0,
				// 		"statusDescription": "Success"
				// 	},
				// 	"body": {
				// 		"chatBotJwtToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjMyMjA5NjIxIiwibmJmIjoxNjYzOTE5MDMyLCJleHAiOjE2NjM5MjI2MzIsImlhdCI6MTY2MzkxOTAzMn0.-p5OHx9a2pA-YqRmAByAky82JzSaSNgFldem5aH7qGI",
				// 		"Msg": "Authorization successful",
				// 		"status": 0
				// 	}
				// }
				if (res['head']['status'] == 0 && res['body']['chatBotJwtToken']) {
					this.portfolioToken = '.ASPXAUTH=' + authToken;
					this.getClientCode = userClientid;
					this.displayClientCode = userClientid;
					setTimeout(() => {
						this.isBrokingClient = true;
						this.initPortfolio();
						this.viewData = true;
					}, 1000);
				}
				else {
					// location.replace('http://localhost:4200/404')
					this.router.navigate(['/not-found'], { queryParams: { Authorization: "N" } });
				}
			})
	)

}

	setClientSearch(res: any) {
		if (res.length) {
			let data: any = [];
			for (const item of res) {
				data.push({
					ClientCode: item
				})
			}
			this.clientCodeList = data;
		} else {
			this.clientCodeList = [];
		}
		this.dtLoad = true;
	}

	searchClientValue(text: any) {
		let searchValue = text.trim();
		this.isDropDownVisible = false;
		if (searchValue && searchValue.length > 3) {
			this.dtLoad = false;
			this.isDropDownVisible = true;
			this.clientSearchTerms.next(searchValue);
		}else{
			this.clientCodeList = [];
		}
	}

	async ledgerPopover(ev: any) {
		const text = [
			"The cash component denotes your ledger balance & does not have any impact on the current or invested values in any way."
		]
		ev.stopPropagation();
		const popover = await this.popoverController.create({
			component: LedgerPopoverComponent,
			componentProps: { items: text },
			cssClass: "coming-soon-popover ledger-popover",
			// mode: "md",
			showBackdrop: false,
			event: ev
			// translucent: true
		});
		return await popover.present();
	}


	initPortfolio(){
		this.loadScript('https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js');
		this.loadScript('https://cdn-static.trendlyne.com/static/clientstatic/newsiifl/js/tl-modal-loader.min.js');
		//let clientDetails = JSON.parse(localStorage.getItem('select_client'));
		//	let clientDetails = {ClientCode: 'SURVINHA', ClientName: 'ARJUN SINGH'};		console.log(clientDetails);
		//	this.clientName = clientDetails['ClientName'];
		this.clientCode = this.getClientCode;
		this.pnlClientCode = this.getClientCode;
		this.parentClientCode = this.getClientCode;
		//	this.parentClientName = clientDetails['ClientName']
		let clientID = this.isBrokingClient ? this.ciphetText.aesEncrypt(this.clientCode) : this.clientCode;
		this.getFamilyDropdown(clientID)
		this.getClientProfileDetails()
	
		this.displayRelation = 'FAMILY';
	}

	clientDetails: any;

	getClientCode:any;

	getClientProfileDetails() {
		var obj = { "UserCode": this.getClientCode, "UserType": "4", "ClientType": this.clientType }
		this.wireReqService.getProfileDetails(this.portfolioToken, obj).subscribe((res: any) => {
			if (res['Head']['ErrorCode'] == 0) {
				this.clientDetails = res['Body'];
				this.rmName = res['Body']['RMName']
				this.rmEmail = res['Body']['RMEmail'].replaceAll(' ', '');
				this.rmMobile = res['Body']['RMMobileNo']
				this.iraName = res['Body']['IRAName']
				this.iraEmail = res['Body']['IRAEmail'].replaceAll(' ', '');
				this.iraMobile = res['Body']['IRAContactNo']
			}
		}, error => {

		})
	}
	
	displayClientDetails(data: any) {
		if(data){
			this.selectedDropdownClient = data;
			if(data.ClientCode.toString().split("-")[3].toLowerCase().trim() == "false"){
				// broking client
				this.isBrokingClient = true;
				this.clientType = "",
				this.displayClientCode = data.ClientCode.split('-')[0].trim();
				this.realizedClientCode = data.ClientCode.split('-')[0].trim();
				this.getClientCode = data.ClientCode.split('-')[0].trim();
			} else {
				// non-broking client
				this.isBrokingClient = false;
				this.clientType = "1";
				this.displayClientCode = data.ClientCode.split('-')[0].trim();
				this.realizedClientCode = data.ClientCode.split('-')[0].trim();
				this.getClientCode = data.ClientCode.split('-')[2].trim();
			}
			this.clientSearchValue = data.ClientCode.split('-')[0].trim();
		} else {
			this.isBrokingClient = true;
			this.realizedClientCode = this.displayClientCode;
			this.getClientCode = this.displayClientCode;
			this.clientSearchValue = null;
		}
		// this.getClientCode = "SURVINHA";
		//this.clientSearchValue = data.ClientCode.split('-')[0].trim();
		if (location.pathname == '/family-portfolio') {
			this.commonService.analyticEvent('Cl_Name_dropdown_clicked', 'Client Name Click Dropdown');
		}
		else{
			this.commonService.setClevertapEvent('Name_dropdown_clicked', { 'PartnerCode': localStorage.getItem('userId1') });
			this.commonService.analyticEvent('Name_dropdown_clicked', 'Family Portfolio Name Dropdown Click');
		}

		if (location.pathname == '/client-portfolio') {
			this.portfolioUserId = this.initUserId
		}
		else{
			this.portfolioUserId = "";
		}
		
		// var element = this.document.getElementById("ClientMainBox");
		// if (element != null) {
		// 	element.classList.add("d-none");
		// }
		this.resetData();
		this.initPortfolio();
		this.viewData = true;
		this.isDropDownVisible = false;
		setTimeout(() => {
			this.tabTableContentMain('Portfolio_tab');
		},500);
	}

	hideDropDown(){
		setTimeout(() => {
			this.isDropDownVisible = false;
		}, 300);
	}

	showDropDown(){
		this.clientSearchValue = null;
		this.isDropDownVisible = true;
	}

	getFamilyDropdown(id: any) {
		this.subscription.add(
			this.clientService.getFamilyMapping(this.portfolioToken, id, this.portfolioUserId, this.clientType)
				.subscribe((res: any) => {
					this.familyOptionDisplay = true;
					this.displayBreakdown = true;
					if (res['Head']['ErrorCode'] == 0) {
						if (res['Body']['FamillyMapp'].length == 1) {
							this.familyOptionDisplay = false;
							this.displayBreakdown = false;
							if (res['Body']['FamillyMapp'][0]['Successflag'] == 'N') {
								this.familyMappList = [];
								this.dataLoad = true;
								this.clientMappMsg = true
							}
							if (res['Body']['FamillyMapp'][0] && res['Body']['FamillyMapp'][0]['ParentClientCode'].length == 0) {
								this.clientName = res['Body']['FamillyMapp'][0]['ClientName'];
								this.pnlClientName =  res['Body']['FamillyMapp'][0]['ClientName'];
								if(this.isBrokingClient) this.displayClientCode = res['Body']['FamillyMapp'][0]['ClientCode'];
								this.parentClientName = res['Body']['FamillyMapp'][0]['ClientName'];
								this.familyMappList = res['Body']['FamillyMapp'];
								this.getClientPortfolio(id, '0');
								if (this.isBrokingClient) this.getEqClientTable(id, '0');
								this.getProductSummary(id, '0');
								this.getMfDetails(id, '0');
								this.getFdDetails(id, '0')
								this.getBondsDetail(id, '0')
								this.getAifDetail(id, '0')
								this.getPmsDetail(id, '0')
							}
							else {
								this.clientName = res['Body']['FamillyMapp'][0]['ClientName'] ? res['Body']['FamillyMapp'][0]['ClientName'] : "Name Not Available"
								this.pnlClientName = res['Body']['FamillyMapp'][0]['ClientName'] ? res['Body']['FamillyMapp'][0]['ClientName'] : "Name Not Available"
								if(this.isBrokingClient) this.displayClientCode = res['Body']['FamillyMapp'][0]['ClientCode'];
								this.parentClientName = res['Body']['FamillyMapp'][0]['ClientName'];
								this.familyMappList = res['Body']['FamillyMapp'];
								this.getClientPortfolio(id, '1');
								if (this.isBrokingClient) this.getEqClientTable(id, '1');
								this.getProductSummary(id, '1');
								this.getMfDetails(id, '1');
								this.getFdDetails(id, '1')
								this.getBondsDetail(id, '1')
								this.getAifDetail(id, '1')
								this.getPmsDetail(id, '1')
							}
							// if(res['Body']['FamillyMapp'][0] && res['Body']['FamillyMapp'][0]['ParentClientCode'].length > 0){
							this.displayRelation = this.familyMappList[0]['Relation'] && this.familyMappList[0]['Relation'].length > 0 ? this.familyMappList[0]['Relation'] : 'SELF';
							// }
						}
						else {
							this.familyOptionDisplay = true;
							this.familyMappList = res['Body']['FamillyMapp'];
							// this.clientName = this.familyMappList[0]['ClientName'];
							// if(this.isBrokingClient) this.displayClientCode = res['Body']['FamillyMapp'][0]['ClientCode'];
							// this.parentClientName = res['Body']['FamillyMapp'][0]['ClientName'];
							this.familyMappList.forEach((member) => {
								if(member.Relation.toString().toUpperCase() == "SELF"){
									this.clientName = member.ClientName;
									this.pnlClientName = member.ClientName;
									if(this.isBrokingClient) this.displayClientCode = member.ClientCode;
									this.parentClientName = member.ClientName;
								}
							});
							this.getClientPortfolio(id, '1');
							if (this.isBrokingClient) this.getEqClientTable(id, '1');
							this.getProductSummary(id, '1');
							this.getMfDetails(id, '1');
							this.getFdDetails(id, '1')
							this.getBondsDetail(id, '1')
							this.getAifDetail(id, '1')
							this.getPmsDetail(id, '1')
						}
						if (this.familyMappList && this.familyMappList.length > 0) {
							this.familyMappList.forEach(element => {
								element.Relation = element.Relation && element.Relation.length == 0 ? 'SELF' : element.Relation
							})
						}
						setTimeout(() => {
							this.displayReport = true;
						}, 5000);
					}
					else {
						this.familyMappList = [];
						this.clientName = null;
						this.pnlClientName = null;
						if(this.isBrokingClient) this.displayClientCode = undefined;
						this.clientMappMsg = true;
						this.dataLoad = true;
						this.parentClientName = null;
					}
				})
		)
	}

	goToFamilyPortfolio() {
		this.resetData();
		if (location.pathname == '/client-portfolio') {
			this.portfolioUserId = this.initUserId
		}
		else{
			this.portfolioUserId = "";
		}
		if(!this.desktop){
			var element: any = this.document.getElementById("ClientMainBox");
			element.classList.toggle("d-none");
		}
		this.initPortfolio();
	}

	// async openPopover(ev, message?) {
	// 	const items = [
	// 		{ title: message, value: message },
	// 	]
	// 	ev.stopPropagation();
	// 	const popover = await this.popoverController.create({
	// 		component: ItemPopoverComponent,
	// 		componentProps: { items: items },
// 		cssClass: "coming-soon-popover item-popover",
	// 		//mode: "ios",
	// 		showBackdrop: false,
	// 		event: ev
	// 		// translucent: true
	// 	});
	// 	return await popover.present();
	// }


	calculateSum(array: any, property: any) {
		const total = array.reduce((accumulator: any, object: any) => {
			return accumulator + +object[property];
		}, 0);
		return total;
	}

	calculateTotal(value: any, data: any) {
		let totalValue = 0;
		data.forEach((ele: any) => {
			totalValue += +ele[value];
		})
		return totalValue;
	}

	calculateAvgRate(value: any, data: any) {
		var totalAvgRate;
		var qty = 0;
		var rate = 0
		if (data.length > 1) {
			for (var k in data) {
				rate = rate + (data[k][value] * data[k].Qty);
				qty = qty + data[k].Qty
				totalAvgRate = rate / qty
			}
		}
		else {
			totalAvgRate = data[0][value]
		}
		return totalAvgRate;
	}


	// Function to generate the HTML for the tables
	async generateTablesHTML(itemChecked: any){
		if (location.pathname == '/family-portfolio') {
			this.commonService.analyticEvent('Cl_Download_Report_Clicked', 'Client Download Report');
		}
		else{
			this.commonService.setClevertapEvent('Download_Report_Clicked', { 'PartnerCode': localStorage.getItem('userId1') });
			this.commonService.analyticEvent('Download_Report_Clicked', 'Download Report');
		}
		
		this.pdfLoader = false;
		
		if(this.memberData.length > 0 && this.isBrokingClient){
			this.data = [
				{
					pageTitle: 'Family Distribution',
					pageNumber: '3',
					subTitle: null,
					hasTable: true,
					tableHead: ['Members', 'Current Value', 'Allocation', 'G/L Value', 'G/L%'],
					totalData: this.familyHoldingDist
				},
				{
					pageTitle: 'Product Wise Holdings',
					pageNumber: '4',
					subTitle: 'Stocks',
					hasTable: true,
					tableHead: ['Scrip Name', 'Qty', 'Purchase Price', 'Invested Value', 'Current Price', 'Current Value', '3yr Returns', 'G/L Value', 'G/L%'],
					totalData: this.clientEqData
				},
				{
					pageTitle: 'Product Wise Holdings',
					pageNumber: '5',
					subTitle: 'Mutual Funds',
					hasTable: true,
					tableHead: ['Scheme Name','Unit', 'Invested Value', 'Current Value', 'NAV', 'XIRR', 'G/L Value', 'G/L%'],
					totalData: this.clientMfData
				},
				{
					pageTitle: 'Product Wise Holdings',
					pageNumber: '6',
					subTitle: 'Bonds',
					hasTable: true,
					// tableHead: ['Bond Name', 'Tenure', 'Date of Investment', 'Invested Value', 'ROI', 'Maturity Date'],
					tableHead: ['Bond Name', 'Invested Value', 'ROI', 'Maturity Date', 'ISIN'],
					totalData: this.bondsData
				},
				{
					pageTitle: 'Product Wise Holdings',
					pageNumber: '7',
					subTitle: 'Fixed Deposit',
					hasTable: true,
					tableHead: ['Company Name', 'Tenure', 'Date of Investment', 'Invested Value', 'ROI', 'Maturity Date'],
					totalData: this.fdData
				},
				{
					pageTitle: 'Product Wise Holdings',
					pageNumber: '8',
					subTitle: 'AIF',
					hasTable: true,
					tableHead: ['Scheme Name', 'AMC Name', 'AUM Date', 'Invested Value', 'Current Value', 'Commitment Amount', 'G/L Value', 'G/L%'],
					totalData: this.aifData
				},
				{
					pageTitle: 'Product Wise Holdings',
					pageNumber: '9',
					subTitle: 'PMS',
					hasTable: true,
					tableHead: ['Scheme Name', 'AMC Name', 'AUM Date', 'Invested Value', 'Current Value', 'G/L Value', 'G/L%'],
					totalData: this.pmsData
				}
				
	
			];
		} else {
			this.data = [
				{
					pageTitle: 'Product Wise Holdings',
					pageNumber: '3',
					subTitle: 'Stocks',
					hasTable: true,
					tableHead: ['Scrip Name', 'Qty', 'Purchase Price', 'Invested Value', 'Current Price', 'Current Value', '3yr Returns', 'G/L Value', 'G/L%'],
					totalData: this.clientEqData
				},
				{
					pageTitle: 'Product Wise Holdings',
					pageNumber: '4',
					subTitle: 'Mutual Funds',
					hasTable: true,
					tableHead: ['Scheme Name', 'Unit', 'Invested Value', 'Current Value', 'NAV', 'XIRR', 'G/L Value', 'G/L%'],
					totalData: this.clientMfData
				},
				{
					pageTitle: 'Product Wise Holdings',
					pageNumber: '5',
					subTitle: 'Bonds',
					hasTable: true,
					// tableHead: ['Bond Name', 'Tenure', 'Date of Investment', 'Invested Value', 'ROI%', 'Maturity Date'],
					tableHead: ['Bond Name', 'Invested Value', 'ROI', 'Maturity Date', 'ISIN'],
					totalData: this.bondsData
				},
				{
					pageTitle: 'Product Wise Holdings',
					pageNumber: '6',
					subTitle: 'Fixed Deposit',
					hasTable: true,
					tableHead: ['Company Name', 'Tenure', 'Date of Investment', 'Invested Value', 'ROI', 'Maturity Date'],
					totalData: this.fdData
				},
				{
					pageTitle: 'Product Wise Holdings',
					pageNumber: '7',
					subTitle: 'AIF',
					hasTable: true,
					tableHead: ['Scheme Name', 'AMC Name', 'AUM Date', 'Invested Value', 'Current Value', 'Commitment Amount', 'G/L Value', 'G/L%'],
					totalData: this.aifData
				},
				{
					pageTitle: 'Product Wise Holdings',
					pageNumber: '8',
					subTitle: 'PMS',
					hasTable: true,
					tableHead: ['Scheme Name', 'AMC Name', 'AUM Date', 'Invested Value', 'Current Value', 'G/L Value', 'G/L%'],
					totalData: this.pmsData
				}
	
			];
		}

		let html = '';

		let memberList = '';

		let productList = '';

		if(!this.isBrokingClient) this.memberData = [];

		for (let index = 0; index < this.memberData.length; index++) {
			const element = this.memberData[index];

			memberList += 		'<tr style="vertical-align: top;">'
			memberList += 			'<td style="display: flex;width: 100px;padding-bottom: 5px;">'
			memberList += 				'<img src="./assets/imgs/' + element.img + '.png" style="height: 12px; margin-right: 5%; margin-top: 3%">'
			memberList += 				'<div style="display: flex;flex-direction: column;"><span>' + element['CLIENTCODE'] + '</span>'
			memberList += 				'<span style="color: #999; font-size:8px;">' + (element['Relation'] === 'No' ? '-' : element['Relation']) + '</span></div>'
			memberList += 			'</td>'
			memberList += 			'<td style="font-size: 12px;color: #000000;font-weight: 700;text-align: right;">' + this.commonService.numberFormatWithCommaUnit(element['EQUITYVALUE']) + '</td>'
			memberList += 			'<td style="font-size: 8px;color: #000000;font-weight: 700;line-height: 1.8;text-align: right; padding-left: 5px;">' + element['EQUITYPERCENTAGE'] + '%</td>'
			memberList += 		'</tr>'
		}

		for (let index = 0; index < this.productChartData.length; index++) {
			const element = this.productChartData[index];
			let eleEQUITYVALUE =  element['EQUITYVALUE'];
			if(eleEQUITYVALUE <= 999){
				eleEQUITYVALUE = this.numberFormat(eleEQUITYVALUE)
			}
			else{
				eleEQUITYVALUE = this.commonService.numberFormatWithCommaUnit(eleEQUITYVALUE)
			}
			productList += 		'<tr style="vertical-align: top;">'
			productList += 			'<td style="display: flex;padding-bottom: 5px;">'
			productList += 				'<img src="./assets/imgs/'+ element.img +'.png" style="height: 12px; margin-right: 5%;margin-top: 5%">'
			productList += 				'<div style="display: flex;flex-direction: column;"><span>'+ (element['PRODUCT'] === 'BO' || element['PRODUCT'] === 'BD' ? 'Bonds' : (element['PRODUCT'] === 'DE' ? 'Stocks' : element['PRODUCT'])) +'</span>'
			productList += 			'</td>'
			productList += 			'<td style="font-size: 12px;color: #000000;font-weight: 700;text-align: right;">' + eleEQUITYVALUE + '</td>'
			productList += 			'<td style="font-size: 8px;color: #000000;font-weight: 700;line-height: 1.8;text-align: right;padding-right: 10px;">' + this.numberFormat(element['EQUITYPERCENTAGE']) + '%</td>'
			productList += 		'</tr>'
		}

		const getPlIndex = () => {
			if (itemChecked.includes('portfolio')&& itemChecked.includes('product') && itemChecked.includes('pl')) {
				if (this.data.every((item: any) => item.totalData.length === 0)) {
					return '02';
				} else {
					let array1 = [];
					let array2 = [];
					this.data.forEach((item: any) => {
						if (item.pageTitle === 'Product Wise Holdings') {
							if (item.subTitle == 'Mutual Funds' || item.subTitle == 'Stocks') {
								array1.push(...item.totalData);
							} else {
								array2.push(...item.totalData);
							}
						}
					});
					let plIndexStart:any;
					if (this.data[0].pageTitle === 'Family Distribution') {
						plIndexStart = JSON.stringify(Math.ceil(array1.length / 5) + Math.ceil(array2.length / 7) + 1 + 3);
					}else{
						plIndexStart = JSON.stringify(Math.ceil(array1.length / 5) + Math.ceil(array2.length / 7) + 1 + 2);
					}
					return plIndexStart.length > 1 ? plIndexStart : `0${plIndexStart}`;
				}
			}
			else if (itemChecked.includes('product') && itemChecked.includes('pl') && itemChecked.length === 2) {
				if (this.data.every((item: any) => item.pageTitle === 'Product Wise Holdings' && item.totalData.length === 0)) {
					return '01';
				} else {
					let array1 = [];
					let array2 = [];
					//console.log(this.data)
					this.data.forEach((item: any) => {
						if (item.pageTitle === 'Product Wise Holdings') {
							if (item.subTitle == 'Mutual Funds' || item.subTitle == 'Stocks') {
								array1.push(...item.totalData);
							} else {
								array2.push(...item.totalData);
							}
						}
					});
					const plIndexStart = JSON.stringify(Math.ceil(array1.length / 5) + Math.ceil(array2.length / 7) + 1);
					return plIndexStart.length > 1 ? plIndexStart : `0${plIndexStart}`;
				}
			}
			else if (itemChecked.includes('portfolio') && itemChecked.includes('pl') && itemChecked.length === 2) {
				if (this.data[0].pageTitle === 'Family Distribution') {
					return '04';
				} else {
					if (this.productChartData.length > 0) {
						return '03';
					} else {
						return '02';
					}
				}
			}
			else if (itemChecked.includes('pl') && itemChecked.length === 1) {
				return '01';
			}
		}

		const getProductIndex = () => {
			if (itemChecked.includes('portfolio')&& itemChecked.includes('product') && itemChecked.includes('pl')) {
				if (this.data[0].pageTitle === 'Family Distribution') {
					return '04';
				} else {
					return '03';
				}
			}
			else if (itemChecked.includes('product') && itemChecked.includes('pl') && itemChecked.length === 2) {
				return '01';
			}
			else if (itemChecked.includes('portfolio') && itemChecked.includes('product') && itemChecked.length === 2) {
				if (this.data[0].pageTitle === 'Family Distribution') {
					return '04';
				} else {
					return '03';
				}
			}
			else if (itemChecked.includes('product') && itemChecked.length === 1) {
				return '01';
			}
			return;
		}
			

		const page1 = `<page size="A4" layout="landscape" orientation="landscape">            
		<div class="first-page" style="position: relative;overflow: hidden;margin: 0px 0px 10px 0px;padding: 0px;border: none;width: 842px;">
			<div style="height: 575px;">
				<div style="position: relative; height:250px" >
				<!-- Header Background image -->
				<img style="position: absolute; top: 0; left: 0; z-index: 1;" src="../assets/imgs/vector-heading-table.png" alt="Header Background">
				<!-- Logo Image -->
				<img style="position: absolute; top: 12px; left: 20px; z-index: 3;" src="../assets/imgs/Logo.png" alt="Logo">
				<!-- Date -->
					<!-- Date -->
					<div style="position: absolute; font-family: 'Inter', sans-serif; top: 15px; right: 15px; z-index: 4; color: #000000;">
					${moment(new Date()).format('MMM DD, YYYY')}
					</div>
				
					<!-- Text -->
					<div style="position:relative ; top: 130px; left: 50%; transform: translate(-50%, -50%); z-index: 5; color: #000000; text-align: center;">
					<span style="font-family: 'Inter', sans-serif; font-weight: 700; font-size: 38px;">PORTFOLIO 360</span>
					<br>
					<span style="font-family: 'Inter', sans-serif; font-size: 20px; font-style: normal; font-weight: 400; line-height: normal;">Analysis Report ${this.displayRelation === 'FAMILY' ? '(Family)' : '(Self)'}</span>
					</div>
				</div >
					
		
				<div style="position:relative;">
				<div style="float:right; margin-right: 60px;">
				<div>
					<span style="color: #010101;
					font-size: 20px;
					font-weight: 600;
					font-family: 'Inter', sans-serif;
					line-height: normal;">Index</span>
					<br>
					<div style="margin-top:15px;">
						<div style="display: ${itemChecked.includes('portfolio')?'flex':'none'}; align-items: center; padding-bottom: 15px;">
							<div
								style="color: #000;font-size: 12px;font-weight: 500;font-family: 'Inter', sans-serif; width: 24px; height: 24px; border-radius: 50%; line-height: 24px; text-align: center; background-color: #D3C9FB;">
								01
							</div>
							<span
								style="color: #000;font-size: 14px;font-weight: 500;font-family: 'Inter', sans-serif;line-height: normal; margin-left:10px;">
								Executive Summary
							</span>
						</div>
						<div style="display: ${itemChecked.includes('product')&&!this.data.filter((item: any) => item.pageTitle === 'Product Wise Holdings').every((ele: any) => ele.totalData.length === 0)?'flex':'none'}; align-items: center; padding-bottom: 15px;">
							<div 
								style="color: #000;font-size: 12px;font-weight: 500;font-family: 'Inter', sans-serif; width: 24px; height: 24px; border-radius: 50%; line-height: 24px; text-align: center; background-color: #D3C9FB;">
								${getProductIndex()}
							</div>
							<span
								style="color: #000;font-size: 14px;font-weight: 500;font-family: 'Inter', sans-serif;line-height: normal; margin-left:10px;">
								Product Wise Holding
							</span>
						</div>
						<div style="display: ${itemChecked.includes('pl')&&this.realizedPlData.length > 0?'flex':'none'}; align-items: center;">
							<div
								style="color: #000;font-size: 12px;font-weight: 500;font-family: 'Inter', sans-serif; width: 24px; height: 24px; border-radius: 50%; line-height: 24px; text-align: center; background-color: #D3C9FB;">
								${getPlIndex()}
							</div>
							<span
								style="color: #000;font-size: 14px;font-weight: 500;font-family: 'Inter', sans-serif;line-height: normal; margin-left:10px;">
								P&L Statement
							</span>
						</div>
					</div>
				</div>
			</div>
				
					<div style="float:left; margin-left: 20px;">
						<div>
							<span style="color: #010101;
							font-size: 20px;
							font-weight: 600;
							font-family: 'Inter', sans-serif;
							line-height: normal;">${this.clientName}</span>
							<br>
							<span style="color: #64798C;
							font-size: 14px;
							font-weight: 400;
							font-family: 'Inter', sans-serif;
							line-height: normal;">${this.isBrokingClient ? this.clientCode : this.displayClientCode}</span>
						</div>
					
				
						<div style="margin-top:30px;">
							<div> <img src="../assets/imgs/user.png" style="vertical-align: middle;"><span style="color: #434343;
							font-size: 14px;
							font-weight: 600;
							font-family: 'Inter', sans-serif;
							line-height: normal; margin-left:10px;">${this.rmName}</span>
								<br>
								<span style="color: #6E6E6E;
							font-size: 12px;
							font-weight: 400;
							font-family: 'Inter', sans-serif;
							line-height: normal; margin-left:30px;">Relationship Manager</span>
							</div>
							<div style="display: flex;align-items: end;">
							<div style="margin-left:28px; margin-top: 5px;">
								<img src="../assets/imgs/smartphone.png" style="vertical-align: middle;">&nbsp;<span style="color: #6E6E6E;
									font-size: 12px;
									font-weight: 400;
									font-family: 'Inter', sans-serif;
									line-height: 18px;">+91&nbsp; ${this.rmMobile}</span>
							</div>
							<div style="margin-left:20px; margin-top: 1px;"><img src="../assets/imgs/mail.png" style="vertical-align: middle;">&nbsp;&nbsp;<span style="color: #6E6E6E;
								font-size: 12px;
								font-weight: 400;
								font-family: 'Inter', sans-serif;
								line-height: 18px;">${this.rmEmail}</span></div>
							</div>

							<div style="margin-top:20px;"> <img src="../assets/imgs/user.png" style="vertical-align: middle;"><span style="color: #434343;
							font-size: 14px;
							font-weight: 600;
							font-family: 'Inter', sans-serif;
							line-height: normal; margin-left:10px;">${this.iraName}</span>
								<br>
								<span style="color: #6E6E6E;
							font-size: 12px;
							font-weight: 400;
							font-family: 'Inter', sans-serif;
							line-height: normal; margin-left:30px;">Business Head</span>
							</div>
							<div style="display: flex;align-items: end;">
							<div style="margin-left:28px; margin-top: 5px;">
								<img src="../assets/imgs/smartphone.png" style="vertical-align: middle;">&nbsp;<span style="color: #6E6E6E;
									font-size: 12px;
									font-weight: 400;
									font-family: 'Inter', sans-serif;
									line-height: 18px;">+91&nbsp; ${this.iraMobile}</span>
							</div>
							<div style="margin-left:20px; margin-top: 1px;"><img src="../assets/imgs/mail.png" style="vertical-align: middle;">&nbsp;&nbsp;<span style="color: #6E6E6E;
								font-size: 12px;
								font-weight: 400;
								font-family: 'Inter', sans-serif;
								line-height: 18px;">${this.iraEmail}</span></div>
							</div>
				
				
							<div style="margin-top:20px;">
								<img src="../assets/imgs/phone.png" style="vertical-align: middle;"> <span style="color: #434343;
									font-size: 14px;
									font-weight: 600;
									font-family: 'Inter', sans-serif;
									line-height: normal; margin-left: 4px;"> 022-4007-1000 </span>
				
								<img src="../assets/imgs/maili.png" style="margin-left: 35px; vertical-align: middle;"> <span style="color: #434343;
									font-size: 14px;
									font-weight: 600;
									font-family: 'Inter', sans-serif;
									line-height: normal;">cs@iifl.com</span>
							</div>
				
						</div>
					</div>
					
				</div>
				</div>	
				<div style="position: absolute;bottom: 2%;right: 2%;clear:both"><span style="color: #817A9A;
				text-align: center;
				font-family: 'Inter', sans-serif;
				font-size: 12px;
				font-style: normal;
				font-weight: 400;
				line-height: normal;">Private and Confidential</span>
		</div>							
		</div>
	</page>`;


		const successBackColor = '#D5EDCC';
		const successBorderColor = '#A6D893';
		const successColor = '#2BA400';

		const dangerBackColor = '#FBEAEA';
		const dangerBorderColor = '#F0B9B7';
		const dangerColor = '#DF514C';


		const page2 = `<page size="A4" layout="landscape">
								<div class="second-page"
									style="position: relative;overflow: hidden;margin: 20px 0px 0px 0px;padding: 0px;border: none;width: 842px;">
									<div style="height: 595px;">
										<div style="position: relative;">
											<!-- Header Background image -->
											<img style="position: absolute; top: 0; left: 0; z-index: 1;" src="../assets/imgs/vector-heading-table.png" alt="Header Background">
											<!-- Logo Image -->
											<img style="position: absolute; top: 12px; left: 20px; z-index: 3;" src="../assets/imgs/Logo.png" alt="Logo">
											<!-- Date -->
											<div style="position: absolute; top: 15px; right: 20px; z-index: 3; color: #6C638C;
												text-align: right;
												font-family: 'Inter', sans-serif;
												font-size: 18px;
												font-weight: 600;
												line-height: normal;">
												${this.clientName}
											</div>
										</div>
										<div style="position: relative;
											top: 90px;
											left: 21px;">
											<span style="color: #4733CB;
												font-size: 24px;
												font-weight: 600;
												font-family: 'Inter', sans-serif;
												line-height: normal;">Executive Summary</span>
											<br>
											<img src="../assets/imgs/RectangleBig.png">&nbsp;<img src="../assets/imgs/RectangleSmall.png">
										</div>
										<div style="position: relative; top: 120px; left: 21px;">
											<div style="width: 100%; display:flex; justify-content: space-around;">
												<div style="width: 22%;margin-right: 3%;
												background: #D5E5FC;border: 1px solid #A8C0E4;
												box-shadow: 0px 5px 10px #0000001A;
													width: 147px;
													display:flex;
													flex-direction:column;
													height: 82px;
													padding: 10px;
													justify-content: center;
													align-items: center;
													gap: 10px;  border-radius: 8px;
													background-size: cover;">
													<span style="color: #2778F1;
														font-size: 24px;
														font-weight: 700;
														font-family: 'Inter', sans-serif;
														line-height: 24px;">${this.currentValue}</span>
													<span style="color: #6E6E6E;
														text-align: center;
														font-size: 14px;
														font-weight: 400;
														font-family: 'Inter', sans-serif;
														line-height: normal;">Current Value</span>
												</div>
												<div style="width: 22%;margin-right: 3%; 
												background: #FAE8DB;
												border: 1px solid #ECC3A8;
												box-shadow: 0px 5px 10px #0000001A;
													width: 147px;
													height: 82px;
													display:flex;
													flex-direction:column;
													padding: 10px;
													justify-content: center;
													align-items: center;
													gap: 10px; border-radius: 8px;
													background-size: cover;"> <span style="color: #DE8600;
													font-size: 24px;
													font-weight: 700;
													font-family: 'Inter', sans-serif;
													line-height: 24px;">${this.investedValue}</span>
													<span style="color: #6E6E6E;
														text-align: center;
														font-size: 14px;
														font-weight: 400;
														font-family: 'Inter', sans-serif;
														line-height: normal;">Holding Cost</span>
												</div>
												<div style="width: 22%;margin-right: 3%; 
												background: ${this.unRealisePlValue > 0 ? successBackColor : (this.unRealisePlValue < 0 ? dangerBackColor : '#ccc')};
												border: 1px solid ${this.unRealisePlValue > 0 ? successBorderColor : (this.unRealisePlValue < 0 ? dangerBorderColor : '#6E6E6E')};
												box-shadow: 0px 5px 10px ${this.unRealisePlValue > 0 ? successBorderColor : (this.unRealisePlValue < 0 ? dangerBorderColor : '#6E6E6E')};
													width: 147px;
													height: 82px;
													display:flex;
													flex-direction:column;
													padding: 10px;
													justify-content: center;
													align-items: center;
													gap: 10px;
													border-radius: 8px;
													background-size: cover;">
													<span style="color: ${this.unRealisePlValue > 0 ? successColor : (this.unRealisePlValue < 0 ? dangerColor : '#6E6E6E')};
														font-size: 24px;
														font-weight: 700;
														font-family: 'Inter', sans-serif;
														line-height: 24px;">${this.commonService.numberFormatWithUnit(this.unRealisePlValue)}
													</span>
													<span style="color: #6E6E6E;
														text-align: center;
														font-size: 14px;
														font-weight: 400;
														font-family: 'Inter', sans-serif;
														line-height: normal;"> ${this.unRealisePlValue > 0 ? 'Gain' : (this.unRealisePlValue < 0 ? 'Loss' : 'Gain/Loss')}
													</span>
												</div>
												<div style="width: 22%; margin-right: 5%; 
												background: ${this.unRealisePlPer > 0 ? successBackColor : (this.unRealisePlPer < 0 ? dangerBackColor : '#ccc')};
												border: 1px solid ${this.unRealisePlPer > 0 ? successBorderColor : (this.unRealisePlPer < 0 ? dangerBorderColor : '#6E6E6E')};
												box-shadow: 0px 5px 10px ${this.unRealisePlPer > 0 ? successBorderColor : (this.unRealisePlPer < 0 ? dangerBorderColor : '#6E6E6E')};
													width: 147px;
													height: 82px;
													padding: 10px;
													justify-content: center;
													display:flex;
													flex-direction:column;
													align-items: center;
													gap: 10px; 
													border-radius: 8px;
													background-size: cover;">
													<span style="color: ${this.unRealisePlPer > 0 ? successColor : (this.unRealisePlPer < 0 ? dangerColor : '#6E6E6E')};
														font-size: 24px;
														font-weight: 700;
														font-family: 'Inter', sans-serif;
														line-height: 24px;">${this.numberFormat(this.unRealisePlPer)} %
													</span>
													<span style="color: #6E6E6E;
														text-align: center;
														font-size: 14px;
														font-weight: 400;
														font-family: 'Inter', sans-serif;
														line-height: normal;">${this.unRealisePlValue > 0 ? 'Gain Percentage' : (this.unRealisePlValue < 0 ? 'Loss Percentage' : 'Gain/Loss Percentage')}
													</span>
												</div>
											</div>
											<div style="display:flex; margin-top:6%;justify-content: center;">
												<div style="width:46%;color: #000;margin-right: 10%;
													font-size: 18px;
													font-weight: 700;
													font-family: 'Inter', sans-serif;
													line-height: normal;" class=${this.memberData.length === 0 ? 'displayNone' : ''}>
													Family Wise
													<div style="display:flex; margin-top:6%;">
														<div style="height: 180px; width: 180px;position: relative;">
															<p style="font-size: 14px;font-family: 'Inter', sans-serif;color: #000000;position: absolute;text-align: center;margin: 0;top: 33%;left: 25%;line-height: 1;"><span style="font-size: 18px;font-weight: 600;">${this.memberData.length < 10 ? '0' + this.memberData.length : this.memberData.length}</span><br>Members</p>
														</div>
														<div style="display: flex;align-items: center;">
															<table style="width: 190px;font-size:12px;font-family: 'Inter', sans-serif;font-weight:700;letter-spacing:0.01rem;">
																<tbody>
																	${memberList}
																</tbody>
															</table>
														</div>
													</div>
												</div>
												<div style="width:50%; color: #000;
													font-size: 18px;
													font-weight: 700;
													font-family: 'Inter', sans-serif;
													line-height: normal;" class=${this.productChartData.length === 0 ? 'displayNone' : ''}>
													Product Wise
													<div style="display:flex; margin-top:6%;">
														<div style=" height: 180px; width: 180px;position: relative;">
															<p style="font-size: 14px;font-family: 'Inter', sans-serif;color: #000000;position: absolute;text-align: center;margin: 0;top: 33%;left: 23%;line-height: 1;"><span style="font-size: 18px;font-weight: 600;">${this.productChartData.length < 10 ? '0' + this.productChartData.length : this.productChartData.length}</span><br>Products</p>
														</div>
														<div style="display: flex;align-items: center;">
															<table style="width: 170px;font-size:12px;font-family: 'Inter', sans-serif;font-weight:700;letter-spacing:0.01rem;">
																<tbody>
																	${productList}
																</tbody>
															</table>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div style="position: absolute;bottom: 2%;left: 2%;">
										<span style="color: #817A9A;
											text-align: center;
											font-size: 14px;
											font-family: 'Inter', sans-serif;
											font-weight: 700;
											line-height: normal;">PORTFOLIO 360</span>&nbsp;
										<span style="color: #84859E;
											font-size: 10px;
											font-weight: 400;
											font-family: 'Inter', sans-serif;
											line-height: normal;">${moment(new Date()).format('MMM DD, YYYY')}</span>
									</div>
									<div style="position: absolute;bottom: 2%;right: 2%;clear:both"><span style="color: #817A9A;
							text-align: center;
							font-family: 'Inter', sans-serif;
							font-size: 12px;
							font-style: normal;
							font-weight: 400;
							line-height: normal;">Private and Confidential | 01</span>
					</div>												
								</div>
							</page>`;

							//Page 2 - page number code
						// 	<div style="position: absolute;bottom: 2%;right: 2%;">
						// 	<span style="color: #84859E;
						// 	text-align: center;
						// 	font-size: 12px;
						// 	font-weight: 700;
						// 	line-height: normal;">01</span>
						// </div>

		// const total = ((this.totalEqUnrealizeGl + this.totalMfUnrealizeGl) / (this.totalEqHoldingValue + this.totalMfHoldingValue)) * 100
		const total = ((this.totalEqUnrealizeGl + this.totalMfUnrealizeGl + this.totalBondsUnrealizeGl + this.totalFdUnrealizeGl + this.totalAifUnrealizeGl + this.totalPmsUnrealizeGl) / (this.totalBondsCurrentValue + this.totalFdCurrentValue + this.totalPmsHoldingValue + this.totalAifHoldingValue + this.totalEqHoldingValue + this.totalMfHoldingValue) * 100);
		//const total = parseFloat(this.eqHoldingPer.toString()) + parseFloat(this.mfHoldingPer.toString());
		//familyTotalInvestment
		const page3 = `<page size="A4" layout="landscape" orientation="landscape">            
							<div class="third-page" style="position: relative;overflow: hidden;padding: 0px;border: none;width: 842px;">
								<div style="height: 595px;">
									<div style="position: relative;">
										<!-- Header Background image -->
										<img style="position: absolute; top: 0; left: 0; z-index: 1;" src="../assets/imgs/vector-heading-table.png" alt="Header Background">
										<!-- Logo Image -->
										<img style="position: absolute; top: 12px; left: 20px; z-index: 3;" src="../assets/imgs/Logo.png" alt="Logo">
										<!-- Date -->
										<div style="position: absolute; top: 15px; right: 20px; z-index: 3; color: #6C638C;
											text-align: right;
											font-family: 'Inter', sans-serif;
											font-size: 18px;
											font-style: normal;
											font-weight: 600;
											line-height: normal;">
											${this.clientName}
										</div>
									</div>
									
									<div style="position: relative;
									top: 90px;
									left: 21px;">
										<span style="color: #4733CB;
												font-family: 'Inter', sans-serif;
												font-size: 24px;
												font-style: normal;
												font-weight: 600;
												line-height: normal;">Product Wise Distribution</span>
												<br>
										<img src="../assets/imgs/RectangleBig.png">&nbsp;<img src="../assets/imgs/RectangleSmall.png">
									</div>
								
									<div style="position: relative;
									top: 120px;
									left: 21px;">
									<table class="print-table" style="width: 95%; table-layout: fixed; border-collapse: collapse;letter-spacing:0.01rem;">
										<thead>
										<tr style="color: #615F78;
											font-family: 'Inter', sans-serif;
											font-size: 12px;
											font-style: normal;
											font-weight: 500;
											line-height: normal;background: #DBDAF3; height: 31px;">
											<th style="text-align: left; padding-left: 2.5%;" colspan="2">Product</th>
											<th style="text-align: right;">Current Value</th>
											<th style="text-align: right;">Allocation</th>
											<th style="text-align: right;">G/L Value</th>
											<th style="text-align: right; padding-right: 2.5%;">G/L%</th>
										</tr>
										</thead>
										<tbody>

										${this.getStockData()}
										
										<tr style="width: 782px;
														height: 45px;
														flex-shrink: 0; background: #F0F0F0;color: #000;
												text-align: right;
												font-family: 'Inter', sans-serif;
												font-size: 11px;
												font-style: normal;
												font-weight: 500;
												line-height: normal;">
											<td style="text-align: left; padding-left: 2.5%;" colspan="2" >Mutual Funds</td>
											<td style="text-align: right;">${this.numberFormat(this.totalMfCurrentValue)}</td>
											<td style="text-align: right;">${this.numberFormat(this.mfAllocation)}%</td>
											<td style="text-align: right;color: ${(+this.totalMfUnrealizeGl > 0 ? '#009E3B' : (+this.totalMfUnrealizeGl < 0 ? '#DF514C' : '#000000')) }">${this.numberFormat(this.totalMfUnrealizeGl)}</td>
											<td style="text-align: right; padding-right: 2.5%; color: ${(+this.mfHoldingPer > 0 ? '#009E3B' : (+this.mfHoldingPer < 0 ? '#DF514C' : '#000000')) }">${this.mfHoldingPer < 0 ? '(' : ''}${this.mfHoldingPer} ${this.mfHoldingPer < 0 ? ')' : ''}</td>
										</tr>
										<tr style="width: 782px;
														height: 45px;
														flex-shrink: 0;color: #000;
												text-align: right;
												font-family: 'Inter', sans-serif;
												font-size: 11px;
												font-style: normal;
												font-weight: 500;
												line-height: normal;">
											<td style="text-align: left; padding-left: 2.5%;" colspan="2" >Bonds</td>
											<td style="text-align: right;">${this.numberFormat(this.totalBondsCurrentValue)}</td>
											<td style="text-align: right;">${this.numberFormat(this.bondsAllocation)}%</td>
											<td style="text-align: right;color: ${(+this.totalBondsUnrealizeGl > 0 ? '#009E3B' : (+this.totalBondsUnrealizeGl < 0 ? '#DF514C' : '#000000')) }">${this.numberFormat(this.totalBondsUnrealizeGl)}</td>
											<td style="text-align: right; padding-right: 2.5%; color: ${(+this.bondsHoldingPer > 0 ? '#009E3B' : (+this.bondsHoldingPer < 0 ? '#DF514C' : '#000000')) }">${this.bondsHoldingPer < 0 ? '(' : ''}${this.bondsHoldingPer} ${this.bondsHoldingPer < 0 ? ')' : ''}</td>
										</tr>
										<tr style="width: 782px;
														height: 45px;
														flex-shrink: 0; background: #F0F0F0;color: #000;
												text-align: right;
												font-family: 'Inter', sans-serif;
												font-size: 11px;
												font-style: normal;
												font-weight: 500;
												line-height: normal;">
											<td style="text-align: left; padding-left: 2.5%;" colspan="2" >Fixed Deposit</td>
											<td style="text-align: right;">${this.numberFormat(this.totalFdCurrentValue)}</td>
											<td style="text-align: right;">${this.numberFormat(this.fdAllocation)}%</td>
											<td style="text-align: right;color: ${(+this.totalFdUnrealizeGl > 0 ? '#009E3B' : (+this.totalFdUnrealizeGl < 0 ? '#DF514C' : '#000000')) }">${this.numberFormat(this.totalFdUnrealizeGl)}</td>
											<td style="text-align: right; padding-right: 2.5%; color: ${(+this.fdHoldingPer > 0 ? '#009E3B' : (+this.fdHoldingPer < 0 ? '#DF514C' : '#000000')) }">${this.fdHoldingPer < 0 ? '(' : ''}${this.fdHoldingPer} ${this.fdHoldingPer < 0 ? ')' : ''}</td>
										</tr>
										<tr style="width: 782px;
														height: 45px;
														flex-shrink: 0; color: #000;
												text-align: right;
												font-family: 'Inter', sans-serif;
												font-size: 11px;
												font-style: normal;
												font-weight: 500;
												line-height: normal;">
											<td style="text-align: left; padding-left: 2.5%;" colspan="2" >AIF</td>
											<td style="text-align: right;">${this.numberFormat(this.totalAifCurrentValue)}</td>
											<td style="text-align: right;">${this.numberFormat(this.aifAllocation)}%</td>
											<td style="text-align: right;color: ${(+this.totalAifUnrealizeGl > 0 ? '#009E3B' : (+this.totalAifUnrealizeGl < 0 ? '#DF514C' : '#000000')) }">${this.numberFormat(this.totalAifUnrealizeGl)}</td>
											<td style="text-align: right; padding-right: 2.5%; color: ${(+this.aifHoldingPer > 0 ? '#009E3B' : (+this.aifHoldingPer < 0 ? '#DF514C' : '#000000')) }">${this.aifHoldingPer < 0 ? '(' : ''}${this.aifHoldingPer}${this.aifHoldingPer < 0 ? ')' : ''}</td>	
										</tr>
										<tr style="width: 782px;
														height: 45px;
														flex-shrink: 0; background: #F0F0F0;color: #000;
												text-align: right;
												font-family: 'Inter', sans-serif;
												font-size: 11px;
												font-style: normal;
												font-weight: 500;
												line-height: normal;">	
											<td style="text-align: left; padding-left: 2.5%;" colspan="2" >PMS</td>
											<td style="text-align: right;">${this.numberFormat(this.totalPmsCurrentValue)}</td>
											<td style="text-align: right;">${this.numberFormat(this.pmsAllocation)}%</td>
											<td style="text-align: right;color: ${(+this.totalPmsUnrealizeGl > 0 ? '#009E3B' : (+this.totalPmsUnrealizeGl < 0 ? '#DF514C' : '#000000')) }">${this.numberFormat(this.totalPmsUnrealizeGl)}</td>
											<td style="text-align: right; padding-right: 2.5%; color: ${(+this.pmsHoldingPer > 0 ? '#009E3B' : (+this.pmsHoldingPer < 0 ? '#DF514C' : '#000000')) }">${this.pmsHoldingPer < 0 ? '(' : ''}${this.pmsHoldingPer}${this.pmsHoldingPer < 0 ? ')' : ''}</td>
										</tr>
										<tr style="width: 782px;
												height: 51px;
												flex-shrink: 0; background: #FFF7EC;color: #000;
										text-align: right;
										font-family: 'Inter', sans-serif;
										font-size: 12px;
										font-style: normal;
										font-weight: 600;
										line-height: normal;">
											<td style="text-align: left; padding-left: 2.5%;" colspan="2">Total</td>
											<td style="text-align: right;">${this.numberFormat(this.totalEqCurrentValue + this.totalMfCurrentValue + this.totalBondsCurrentValue + this.totalFdCurrentValue + this.totalAifCurrentValue + this.totalPmsCurrentValue)}</td>
											<td style="text-align: right;">${this.numberFormat(+this.eqAllocation + +this.mfAllocation + +this.bondsAllocation + +this.fdAllocation + +this.aifAllocation + +this.pmsAllocation)}%</td>
											<td style="text-align: right;color: ${(+this.totalEqUnrealizeGl + this.totalMfUnrealizeGl + this.totalBondsUnrealizeGl + this.totalFdUnrealizeGl + this.totalAifUnrealizeGl + this.totalPmsUnrealizeGl >= 0 ? '#009E3B' : (+this.totalEqUnrealizeGl + this.totalMfUnrealizeGl + this.totalBondsUnrealizeGl + this.totalFdUnrealizeGl + this.totalAifUnrealizeGl + this.totalPmsUnrealizeGl < 0 ? '#DF514C' : '#000000')) }">${this.numberFormat(this.totalEqUnrealizeGl + this.totalMfUnrealizeGl + this.totalBondsUnrealizeGl + this.totalFdUnrealizeGl + this.totalAifUnrealizeGl + this.totalPmsUnrealizeGl)}</td>
											<td style="text-align: right; padding-right: 2.5%; color: ${(total > 0 ? '#009E3B' : (total < 0 ? '#DF514C' : '#000000'))}">${total < 0 ? '(' : ''}${this.numberFormat(total)}${total < 0 ? ')' : ''}</td>
										</tr>
										</tbody>
									</table>
							
									</div>
									</div>
								<div style="position: absolute;bottom: 2%;left: 2%;"><span style="color: #817A9A;
									text-align: center;
									font-family: 'Inter', sans-serif;
									font-size: 14px;
									font-style: normal;
									font-weight: 700;
									line-height: normal;">PORTFOLIO 360</span>&nbsp;
									<span style="color: #84859E;
									font-family: 'Inter', sans-serif;
									font-size: 10px;
									font-style: normal;
									font-weight: 400;
									line-height: normal;">${moment(new Date()).format('MMM DD, YYYY')}</span>
							
								</div>
								<div style="position: absolute;bottom: 2%;right: 2%;clear:both"><span style="color: #817A9A;
							text-align: center;
							font-family: 'Inter', sans-serif;
							font-size: 12px;
							font-style: normal;
							font-weight: 400;
							line-height: normal;">Private and Confidential | 02</span>
					</div>	
								
							</div>
						</page>`;

						const	setDisclaimerPage=(page_No: any)=>{
							html += `<page size="A4" layout="landscape" orientation="landscape">            
						<div class="third-page" style="position: relative;overflow: hidden;padding: 0px;border: none;width: 842px;">
							<div style="height: 595px;">
								<div style="position: relative;">
									<!-- Header Background image -->
									<img style="position: absolute; top: 0; left: 0; z-index: 1;" src="../assets/imgs/vector-heading-table.png" alt="Header Background">
									<!-- Logo Image -->
									<img style="position: absolute; top: 12px; left: 20px; z-index: 3;" src="../assets/imgs/Logo.png" alt="Logo">
									<!-- Date -->
									<div style="position: absolute; top: 15px; right: 20px; z-index: 3; color: #6C638C;
										text-align: right;
										font-family: 'Inter', sans-serif;
										font-size: 18px;
										font-style: normal;
										font-weight: 600;
										line-height: normal;">
										${this.clientName}
									</div>
								</div>
								
								<div style="position: relative;
								top: 90px;
								left: 21px;">
									<span style="color: #4733CB;
											font-family: 'Inter', sans-serif;
											font-size: 24px;
											font-style: normal;
											font-weight: 600;
											line-height: normal;">Disclaimer</span>
											<br>
									<img src="../assets/imgs/RectangleBig.png">&nbsp;<img src="../assets/imgs/RectangleSmall.png">
								</div>
							
								<div style="position: relative;
								top: 95px;
								left: 21px;">

								<p style="color: #000000;
								font-family: 'Inter', sans-serif;
								font-size: 10px;
								font-weight: 400;
								width: 95%;
								line-height: 20px;">The report provided herein is in Beta version , and should not be considered as final report. This report has been provided based on the Depository and Trading accounts details mapped with us and the same is provided for your reference and ease. The information, data, and statistics presented in the Report are derived from various sources believed to be reliable. Holdings in the Stocks, FD, bonds section is as per T-1 date of generating this report. Holdings in the Mutual funds are as per T-2 if the report is generated before 12pm and T-1 if generated after 12pm. However, we do not guarantee the accuracy, completeness, or timeliness of the information. In some instances, numerical data may be rounded for presentation purposes. Users of this Report are responsible for verifying any information before making decisions based on it. The report should not be used for the purpose of calculation of income tax liability . You are requested to take professional tax advice for the same. IIFL Securities Limited should not be held responsible for erroneous gain/loss calculations , if any. Please verify your transactions with your Depository holding & contract notes and in case of any discrepancy , you may write to us at cs@iifl.com</p>
						
								</div>
								</div>
							<div style="position: absolute;bottom: 2%;left: 2%;"><span style="color: #817A9A;
								text-align: center;
								font-family: 'Inter', sans-serif;
								font-size: 14px;
								font-style: normal;
								font-weight: 700;
								line-height: normal;">PORTFOLIO 360</span>&nbsp;
								<span style="color: #84859E;
								font-family: 'Inter', sans-serif;
								font-size: 10px;
								font-style: normal;
								font-weight: 400;
								line-height: normal;">${moment(new Date()).format('MMM DD, YYYY')}</span>
						
							</div>
							<div style="position: absolute;bottom: 2%;right: 2%;clear:both"><span style="color: #817A9A;
							text-align: center;
							font-family: 'Inter', sans-serif;
							font-size: 12px;
							font-style: normal;
							font-weight: 400;
							line-height: normal;">Private and Confidential | ${this.realizedPlData.length===0 && this.data.filter((item: any) => item.pageTitle === 'Product Wise Holdings').every((ele: any) => ele.totalData.length === 0)?'02':JSON.stringify(page_No + 1).length === 1 ? `0${page_No + 1}` : page_No + 1}</span>
					</div>	
							
						</div>
					</page>`;
						}
						

//page 3 - page number code
// <div style="position: absolute;bottom: 2%;right: 2%;">
// 	<span style="color: #84859E;
// 	text-align: center;
// 	font-size: 12px;
// 	font-weight: 700;
// 	line-height: normal;">02</span>
// </div>

// =============================================================================================
	// html += page1;
	// html += page2;
	// if(this.productChartData.length > 0){
	// 	html += page3;
	// }

	// for (const singleData of this.data) {
	// 	let pageNo = 2;
	// 	for (const tableIndex of this.getTableIndexes(singleData.totalData, singleData.subTitle)) {			
	// 		pageNo++;
	// 		html += `<page size="A4" layout="landscape" orientation="landscape">`;
	// 		html += `<div class="page_${tableIndex}" style="position: relative; overflow: hidden; margin: 0px 0px 0px 0px; padding: 0px; border: none; width: 842px">`;
	// 		html += `<div style="height: 595px;">`;
	// 		html += `<img style="position: absolute; top: 0; left: 0; z-index: 1;" src="../assets/imgs/vector-heading-table.png" alt="Header Background">`;
	// 		html += `<img style="position: absolute; top: 12px; left: 20px; z-index: 3;" src="../assets/imgs/Logo.png" alt="Logo">`;
	// 		html += `<div style="position: absolute; top: 15px; right: 20px; z-index: 3; color: #6C638C; text-align: right; font-family: 'Inter', sans-serif; font-size: 18px; font-style: normal; font-weight: 600; line-height: normal;">${this.clientName}</div>`;
	// 		html += `<div style="position: relative; top: 90px; left: 21px;">`;
	// 		html += `<span style="color: #4733CB; font-family: 'Inter', sans-serif; font-size: 24px; font-style: normal; font-weight: 600; line-height: normal;">${singleData.pageTitle}</span><br>`;
	// 		html += `<img src="../assets/imgs/RectangleBig.png">&nbsp;<img src="../assets/imgs/RectangleSmall.png">`;
	// 		html += `</div>`;
	// 		if (singleData.subTitle !== null) {
	// 			html += `<div style="position: relative; top: 110px; left: 21px;">`;
	// 			html += `<img src="../assets/imgs/verticalLineRed.png">`;
	// 			html += `<span style="color: #000000; font-style: normal; margin-top: 10px; text-transform: uppercase; font-family: 'Inter', sans-serif; font-size: 18px; margin-left: 5px; line-height: normal;">${singleData.subTitle}</span><br>`;
	// 			html += `</div>`;
	// 		}
	// 		html += `<div style="position: relative; top: 120px; left: 21px;">`;
	// 		// html += `<h1>Table ${tableIndex + 1}</h1>`;
	// 		html += `<table style="width: 95%; table-layout: fixed; border-collapse: collapse;letter-spacing:0.01rem;"><thead><tr style="color: #615F78;
	// 				font-family: 'Inter', sans-serif;
	// 				font-size: 12px;
	// 				font-style: normal;
	// 				font-weight: 500;
	// 				line-height: normal;background: #DBDAF3; height: 40px;">`;

	// 		/* for (const tableHeading of singleData.tableHead) {
	// 			console.log(tableIndex , 'index')
	// 		  html += `<th>${tableHeading}</th>`;
	// 		} */

	// 		if(singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Mutual Funds'){
	// 			for (let ind = 0; ind < singleData.tableHead.length; ind++) {
	// 				const element = singleData.tableHead[ind];
	// 				if (ind === 0) html += `<th style="text-align: left; padding-left: 2.5%;width: 35%;">${element}</th>`;
	// 				//else if (ind === 1) html += `<th style="text-align: center;width: 17%;">${element}</th>`;
	// 				else if (ind === 4) html += `<th style="text-align: right;width: 9%;">${element}</th>`;
	// 				else if (ind == singleData.tableHead.length - 1) html += `<th style="text-align: right;padding-right: 2.5%;width: 11%;">${element}</th>`;
	// 				else html += `<th style="text-align: right; padding-left: 2%;width: 11%;">${element}</th>`;
	// 			}
	// 		} else if(singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Stocks'){
	// 			for (let ind = 0; ind < singleData.tableHead.length; ind++) {
	// 				const element = singleData.tableHead[ind];
	// 				if (ind === 0) html += `<th style="text-align: left; padding-left: 2.5%;width: 30%;">${element}</th>`;
	// 				else if (ind === 3 || ind === 5) html += `<th style="text-align: right;width: 13%;">${element}</th>`;
	// 				else if (ind === 4 || ind === 1) html += `<th style="text-align: right;width: 8%;">${element}</th>`;
	// 				else if (ind == singleData.tableHead.length - 1) html += `<th style="text-align: right;padding-right: 2.5%;width: 10%;">${element}</th>`;
	// 				else html += `<th style="text-align: right; padding-left: 2%;width: 10%;">${element}</th>`;
	// 			}
	// 		} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Bonds'){
	// 			for (let ind = 0; ind < singleData.tableHead.length; ind++) {
	// 				const element = singleData.tableHead[ind];
	// 				if (ind === 0) html += `<th style="text-align: left; padding-left: 2.5%;width: 37%;">${element}</th>`;
	// 				else if (ind === 2) html += `<th style="text-align: right;width: 9%;">${element}</th>`;
	// 				else if (ind == singleData.tableHead.length - 1) html += `<th style="text-align: right;padding-right: 2.5%;width: 18%;">${element}</th>`;
	// 				else html += `<th style="text-align: right; padding-left: 2%;width: 18%;">${element}</th>`;
	// 			}
	// 		} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Fixed Deposit') {
	// 			for (let ind = 0; ind < singleData.tableHead.length; ind++) {
	// 				const element = singleData.tableHead[ind];
	// 				if (ind === 0) html += `<th style="text-align: left; padding-left: 2.5%;width: 30%;">${element}</th>`;
	// 				else if (ind === 4) html += `<th style="text-align: right;width: 6%;">${element}</th>`;
	// 				else if (ind == singleData.tableHead.length - 1) html += `<th style="text-align: right;padding-right: 2.5%;width: 16%;">${element}</th>`;
	// 				else html += `<th style="text-align: right; padding-left: 2%;width: 16%;">${element}</th>`;
	// 			}
	// 		} else {
	// 			for (let ind = 0; ind < singleData.tableHead.length; ind++) {
	// 				const element = singleData.tableHead[ind];
	// 				if (ind === 0) html += `<th style="text-align: left; padding-left: 2.5%;width: 25%;">${element}</th>`;
	// 				else if (ind == singleData.tableHead.length - 1) html += `<th style="text-align: right;padding-right: 2.5%;width: 15%;">${element}</th>`;
	// 				else html += `<th style="text-align: right; padding-left: 2%;width: 15%;">${element}</th>`;
	// 			}
	// 		}

	// 		html += `</tr></thead><tbody>`;
	// 		let counter = 0;
	// 		let dataArray: any;

	// 		if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Mutual Funds') {
	// 		let dataBind = lodash.groupBy(singleData.totalData, "scheme_category");
	// 		let filerTemp = lodash.map(dataBind, arraygroup => lodash.groupBy(arraygroup, obj =>
	// 		obj.scheme_category));
	// 		let filterData = [];

	// 		filerTemp.forEach(element => {
	// 		let valuesArray: any = Object.values(element);
	// 		valuesArray[0].forEach(element2 => {
	// 		filterData.push(element2)
	// 		});
	// 		});
	// 		dataArray = filterData
	// 		} 
	// 		else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Stocks') {
	// 			let dataBind = lodash.groupBy(singleData.totalData, "SectorName");
				
	// 			let filerTemp = lodash.map(dataBind, arraygroup => lodash.groupBy(arraygroup, obj =>
	// 			obj.SectorName));
	// 			let unlistedFilterData = [];
	// 			let unlistedFilterExtraData = [];
	// 			// let listedFilterData = [];			

	// 			filerTemp.forEach(element => {
	// 				let valuesArray: any = Object.values(element);

	// 				valuesArray[0].forEach(element2 => {
	// 					// unlistedFilterData.push(element2);
	// 					if(element2.INSTRUMENTNAME != "Total" && element2.SectorName != ''){
	// 						unlistedFilterData.push(element2);
	// 						// unlistedFilterData = unlistedFilterData.reverse();
	// 					} else {
	// 						unlistedFilterExtraData.push(element2);
	// 						// unlistedFilterData.push(element2);
	// 					}
	// 				});
	// 			});
	// 			dataArray = unlistedFilterData.concat(unlistedFilterExtraData);
	// 			// dataArray = unlistedFilterData;
	// 		} else {
	// 			dataArray = singleData.totalData
	// 		}

	// 		if ((singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Mutual Funds') || (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Stocks')) {
	// 			this.itemsPerPage = 5;
	// 		} else {
	// 			this.itemsPerPage = 7;
	// 		}

	// 		const startIndex = tableIndex * this.itemsPerPage;
	// 		const endIndex = startIndex + this.itemsPerPage;

	// 		let tableData = dataArray.slice(startIndex, endIndex);
			
	// 		//for (const record of this.getTableData(tableIndex, singleData.totalData)) {
	// 			for (let i = 0; i < tableData.length; i++) {
	// 			counter++;
	// 			let record=tableData[i];
	// 			// console.log(counter, 'counter', singleData.totalData.length, 'legnth', tableIndex, 'table index');
	// 			let rowColorCode;
	// 			let profitNLossColor;
	// 			let netProfitNLossColor;
	// 			let style;
	// 			((counter % 2 == 0) ? rowColorCode = '#F0F0F0' : rowColorCode = '#fff');

	// 			/* if(tableIndex > 0) {
	// 				var totalLength = counter + 
	// 			} else {
	// 				counter === singleData.totalData.length ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: 'Inter', sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = 'color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;'
	// 			} */

	// 			if (singleData.pageTitle === 'Family Distribution' && singleData.subTitle === null) {
	// 				record.CLIENTCODE === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`
	// 				html += `<tr style="${style}">`;

	// 				(record.UNREALISEDPLVAL > 0 ? netProfitNLossColor = '#009E3B' : (record.UNREALISEDPLVAL < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));
	// 				(record.UNREALISEDPLPER > 0 ? profitNLossColor = '#009E3B' : (record.UNREALISEDPLPER < 0 ? profitNLossColor = '#DF514C' : profitNLossColor = '#000000'));
					
	// 				html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.CLIENTCODE}</td>`;
	// 				html += `<td style="text-align: right;">${this.numberFormat(record.CURRENTVALUE)}</td>`;
	// 				html += `<td style="text-align: right;">${this.numberFormat(record.HLDPERCENTAGE)}</td>`;
	// 				html += `<td style="text-align: right;color: ${netProfitNLossColor}"">${record.UNREALISEDPLVAL < 0 ? '(' : ''}${this.numberFormat(record.UNREALISEDPLVAL)}${record.UNREALISEDPLVAL < 0 ? ')' : ''}</td>`;
	// 				html += `<td style="text-align: right; padding-right: 2.5%; color: ${profitNLossColor}"> ${record.UNREALISEDPLPER < 0 ? '(' : ''}${this.numberFormat(record.UNREALISEDPLPER)}${record.UNREALISEDPLPER < 0 ? ')' : ''}</td>`;
	// 			} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Stocks') {
	// 				record.INSTRUMENTNAME === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`
							
	// 						let nameOfSector = tableData[0].SectorName;	
							
	// 						if(record.INSTRUMENTNAME != "Total"){
	// 							if(record.Unlisted_Delisted === '0'){
	// 								if (i == 0) {
	// 									html += `<tr style="background-color: #F5F4FF;"><td style="color: #000;font-family: 'Inter', sans-serif;font-size: 10px;font-style: normal;font-weight: 700;line-height: normal;text-align: left; padding: 4px 2.5%; "colspan="9">${nameOfSector ? nameOfSector : 'Others'}</td></tr>`;
	// 								}

	// 								if (i - 1 < tableData.length && nameOfSector != tableData[i].SectorName &&
	// 									tableData[i].SectorName != tableData[i - 1].SectorName) {
	// 									html += `<tr style="background-color: #F5F4FF;"><td style="color: #000;font-family: 'Inter', sans-serif;font-size: 10px;font-style: normal;font-weight: 700;line-height: normal;text-align: left; padding: 4px 2.5%; "colspan="9">${record.SectorName ? record.SectorName : 'Others'}</td></tr>`;
	// 								}
									
	// 							} else {
	// 								// html += `<tr style="background-color: #F5F4FF;"><td style="color: #000;font-family: 'Inter', sans-serif;font-size: 10px;font-style: normal;font-weight: 700;line-height: normal;text-align: left; padding: 4px 2.5%; "colspan="9">Unlisted/Delisted</td></tr>`;

	// 								if (i == 0) {
	// 									html += `<tr style="background-color: #F5F4FF;"><td style="color: #000;font-family: 'Inter', sans-serif;font-size: 10px;font-style: normal;font-weight: 700;line-height: normal;text-align: left; padding: 4px 2.5%; "colspan="9">Unlisted/Delisted</td></tr>`;
	// 								}
		
	// 								if (i - 1 < tableData.length && nameOfSector != tableData[i].SectorName &&
	// 									tableData[i].SectorName != tableData[i - 1].SectorName) {
	// 									html += `<tr style="background-color: #F5F4FF;"><td style="color: #000;font-family: 'Inter', sans-serif;font-size: 10px;font-style: normal;font-weight: 700;line-height: normal;text-align: left; padding: 4px 2.5%; "colspan="9">Unlisted/Delisted</td></tr>`;
	// 								}
	// 							}
	// 						} 

	// 						html += `<tr style="${style}">`;
							
	// 						(record.UNREALIEDGL > 0 ? netProfitNLossColor = '#009E3B' : (record.UNREALIEDGL < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));
	// 						(record.UNRLGAINLOSSPER > 0 ? profitNLossColor = '#009E3B' : (record.UNRLGAINLOSSPER < 0 ? profitNLossColor = '#DF514C' : profitNLossColor = '#000000'));
							
	// 						html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.INSTRUMENTNAME}</td>`;
	// 						html += `<td style="text-align: right;">${record.QUANTITY == '--' ? '--' : parseInt(record.QUANTITY)}</td>`;
	// 						html += `<td style="text-align: right;">${record.AVGPURCHASEPRICE == '-' ? '--' : record.AVGPURCHASEPRICE == 0 ? '--' : this.numberFormat(record.AVGPURCHASEPRICE)}</td>`;
	// 						html += `<td style="text-align: right;">${this.numberNoFormat(record.HOLDINGCOST)}</td>`;
	// 						html += `<td style="text-align: right;">${record.PreviousClosingPrice == '-' ? '--' : record.PreviousClosingPrice == 0 ? '--' : this.numberFormat(record.PreviousClosingPrice)}</td>`;
	// 						html += `<td style="text-align: right;">${this.numberNoFormat(record.MARKETVALUE)}</td>`;
	// 						html += `<td style="text-align: right;color: ${netProfitNLossColor}">${record.UNREALIEDGL < 0 ? '(' : ''}${this.numberNoFormat(record.UNREALIEDGL)}${record.UNREALIEDGL < 0 ? ')' : ''}</td>`;
	// 						html += `<td style="text-align: right; padding-right: 2.5%; color: ${profitNLossColor}">${record.UNRLGAINLOSSPER < 0 ? '(' : ''}${this.numberFormat(record.UNRLGAINLOSSPER)}${record.UNRLGAINLOSSPER < 0 ? ')' : ''}</td>`;
	// 			} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Mutual Funds') {
	// 				record.Scheme_Name === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`

	// 				let titleOfCategory = tableData[0].scheme_category;
	// 				if (i == 0) {
	// 					html += `<tr style="background-color: #F5F4FF;"><td style="color: #000;font-family: 'Inter', sans-serif;font-size: 10px;font-style: normal;font-weight: 700;line-height: normal;text-align: left; padding: 4px 2.5%; "colspan="9">${titleOfCategory}</td></tr>`;
	// 				}

	// 				if (i - 1 < tableData.length && titleOfCategory != tableData[i].scheme_category &&
	// 					tableData[i].scheme_category != tableData[i - 1].scheme_category) {
	// 					html += `<tr style="background-color: #F5F4FF;"><td style="color: #000;font-family: 'Inter', sans-serif;font-size: 10px;font-style: normal;font-weight: 700;line-height: normal;text-align: left; padding: 4px 2.5%; "colspan="9">${record.scheme_category}</td></tr>`;
	// 				}

	// 				html += `<tr style="${style}">`;
	// 				(record.Unrealized_Profit > 0 ? netProfitNLossColor = '#009E3B' : (record.Unrealized_Profit < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));

	// 				html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.Scheme_Name}</td>`
	// 				// html += `<td style="text-align: center;">${record.scheme_category}</td>`;
	// 				html += `<td style="text-align: right;">${record.Present_Units == '-' ? '--' : record.Present_Units == 0 ? '--' : this.numberFormat(+(record.Present_Units))}</td>`;
	// 				html += `<td style="text-align: right;">${this.numberNoFormat(record.Current_Investment)}</td>`;
	// 				html += `<td style="text-align: right;">${this.numberNoFormat(record.Present_Value)}</td>`;
	// 				html += `<td style="text-align: right;">${record.Present_NAV == '-' ? '--' : this.numberFormat(record.Present_NAV)}</td>`;
	// 				html += `<td style="text-align: right;color: ${netProfitNLossColor}">${record.Unrealized_Profit < 0 ? '(' : ''}${this.numberNoFormat(record.Unrealized_Profit)}${record.Unrealized_Profit < 0 ? ')' : ''}</td>`;
	// 				html += `<td style="text-align: right; padding-right: 2.5%; color: ${record['pnlValue'] > 0 ? '#009E3B' : (record['pnlValue'] < 0 ? '#DF514C' : '#000000')}">${record['pnlValue'] < 0 ? '(' : ''}${this.numberFormat(record['pnlValue'])}${record['pnlValue'] < 0 ? ')' : ''}</td>`;
	// 			} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Bonds') {
	// 				record.BondCompany === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`
	// 				html += `<tr style="${style}">`;
	// 				// (record.Unrealized_Profit > 0 ? netProfitNLossColor = '#009E3B' : (record.Unrealized_Profit < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));
					
	// 				html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.BondCompany}</td>`
	// 				// html += `<td style="text-align: right;">${record.Tenor ? record.Tenor : '--'}</td>`;
	// 				// html += `<td style="text-align: right;">${record.BondBookingDate ? moment(record.BondBookingDate).format('DD/MM/YYYY') : '--'}</td>`;
	// 				html += `<td style="text-align: right;">${this.numberNoFormat(record.BondAmount)}</td>`;
	// 				html += `<td style="text-align: right;">${record.Rateofinterest ? this.formatDecimal(record.Rateofinterest): '--'}</td>`;
	// 				html += `<td style="text-align: right;">${record.BondMaturityDate ? moment(record.BondMaturityDate).format('DD/MM/YYYY') : '--'}</td>`;
	// 				html += `<td style="text-align: right;padding-right: 2.5%;">${record.ISIN ? record.ISIN : '--'}</td>`;
					
	// 				// html += `<td style="text-align: right;color: ${netProfitNLossColor}">${record.Unrealized_Profit < 0 ? '(' : ''}${this.numberFormat(record.Unrealized_Profit)}${record.Unrealized_Profit < 0 ? ')' : ''}</td>`;
	// 				// html += `<td style="text-align: right; padding-right: 2.5%; color: ${record['pnlValue'] > 0 ? '#009E3B' : (record['pnlValue'] < 0 ? '#DF514C' : '#000000')}">${record['pnlValue'] < 0 ? '(' : ''}${this.numberFormat(record['pnlValue'])}${record['pnlValue'] < 0 ? ')' : ''}</td>`;
	// 			} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Fixed Deposit') {
	// 				record.FDCompany === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`
	// 				html += `<tr style="${style}">`;
	// 				// (record.Unrealized_Profit > 0 ? netProfitNLossColor = '#009E3B' : (record.Unrealized_Profit < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));
					
	// 				html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.FDCompany}</td>`
	// 				html += `<td style="text-align: right;">${record.Tenor ? record.Tenor : '--'}</td>`;
	// 				html += `<td style="text-align: right;">${record.FDBookingDate ? moment(record.FDBookingDate).format('DD/MM/YYYY') : '--'}</td>`;
	// 				html += `<td style="text-align: right;">${this.numberNoFormat(record.FDBookingAmount)}</td>`;
	// 				html += `<td style="text-align: right;">${record.RateOfInterest ? record.RateOfInterest : '--'}</td>`;
	// 				html += `<td style="text-align: right;padding-right: 2.5%;">${record.FDMaturityDate ? moment(record.FDMaturityDate).format('DD/MM/YYYY') : '--'}</td>`;

	// 				// html += `<td style="text-align: right;">${record.Present_NAV == '-' ? '--' : this.numberFormat(record.Present_NAV)}</td>`;
	// 				// html += `<td style="text-align: right;color: ${netProfitNLossColor}">${record.Unrealized_Profit < 0 ? '(' : ''}${this.numberFormat(record.Unrealized_Profit)}${record.Unrealized_Profit < 0 ? ')' : ''}</td>`;
	// 				// html += `<td style="text-align: right; padding-right: 2.5%; color: ${record['pnlValue'] > 0 ? '#009E3B' : (record['pnlValue'] < 0 ? '#DF514C' : '#000000')}">${record['pnlValue'] < 0 ? '(' : ''}${this.numberFormat(record['pnlValue'])}${record['pnlValue'] < 0 ? ')' : ''}</td>`;
	// 			} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'AIF') {
	// 				record.SCHEMENAME === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`
	// 				html += `<tr style="${style}">`;
	// 				(record.netpl > 0 ? netProfitNLossColor = '#009E3B' : (record.netpl < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));

	// 				html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.SCHEMENAME}</td>`
	// 				html += `<td style="text-align: right;">${record.AUMDATE ? record.AUMDATE: '--'}</td>`;
	// 				html += `<td style="text-align: right;">${this.numberNoFormat(record.NETINVESTMENT)}</td>`;
	// 				html += `<td style="text-align: right;">${this.numberNoFormat(record.CRRENTVALUE)}</td>`;
	// 				html += `<td style="text-align: right;">${record.COMMITMENTAMOUNT}</td>`;

	// 				html += `<td style="text-align: right;color: ${netProfitNLossColor}">${record.netpl < 0 ? '(' : ''}${this.numberNoFormat(record.netpl)}${record.netpl < 0 ? ')' : ''}</td>`;
	// 				html += `<td style="text-align: right; padding-right: 2.5%; color: ${ record['plPer'] == '--' ? '#000000' :  record['plPer'] > 0 ? '#009E3B' : (record['plPer'] < 0 ? '#DF514C' : '#000000')}">${record['plPer'] < 0 ? '(' : ''}${record['plPer'] == '--' ? '--' : this.numberFormat(record['plPer'])}${record['plPer'] < 0 ? ')' : ''}</td>`;
	// 			} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'PMS') {
	// 				record.SCHEMENAME === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`
	// 				html += `<tr style="${style}">`;
	// 				(record.netpl > 0 ? netProfitNLossColor = '#009E3B' : (record.netpl < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));

	// 				html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.SCHEMENAME}</td>`
	// 				html += `<td style="text-align: right;">${record.AUMDATE ? record.AUMDATE: '--'}</td>`;
	// 				html += `<td style="text-align: right;">${this.numberNoFormat(record.NETINVESTMENT)}</td>`;
	// 				html += `<td style="text-align: right;">${this.numberNoFormat(record.CRRENTVALUE)}</td>`;

	// 				html += `<td style="text-align: right;color: ${netProfitNLossColor}">${record.netpl < 0 ? '(' : ''}${this.numberNoFormat(record.netpl)}${record.netpl < 0 ? ')' : ''}</td>`;
	// 				html += `<td style="text-align: right; padding-right: 2.5%; color: ${record['plPer'] > 0 ? '#009E3B' : (record['plPer'] < 0 ? '#DF514C' : '#000000')}">${record['plPer'] < 0 ? '(' : ''}${this.numberFormat(record['plPer'])}${record['plPer'] < 0 ? ')' : ''}</td>`;
	// 			}

	// 			html += `</tr>`;
	// 		}
	// 		html += `</tbody></table></div>
	// 		</div>
	// 			<div style="position: absolute;bottom: 2%;left: 2%;clear:both"><span style="color: #817A9A;
	// 					text-align: center;
	// 					font-family: 'Inter', sans-serif;
	// 					font-size: 14px;
	// 					font-style: normal;
	// 					font-weight: 700;
	// 					line-height: normal;">PORTFOLIO 360</span>&nbsp;
	// 				<span style="color: #84859E;
	// 						font-family: 'Inter', sans-serif;
	// 						font-size: 10px;
	// 						font-style: normal;
	// 						font-weight: 400;
	// 						line-height: normal;">${moment(new Date()).format('MMM DD, YYYY')}</span>	
						
	// 			</div>
	// 			<div style="position: absolute;bottom: 2%;right: 2%;clear:both"><span style="color: #817A9A;
	// 			text-align: center;
	// 			font-family: 'Inter', sans-serif;
	// 			font-size: 12px;
	// 			font-style: normal;
	// 			font-weight: 400;
	// 			line-height: normal;">Private and Confidential</span>
	// 	</div>
				
	// 		</div></page>`;
	// 	}
	// }

	// html += page4;
// =============================================================================================

		const realizedPLReport = (pageNo: any) => {
			const result = this.realizedPlData.filter((item:any) => item.subTitle !== 'MF' && item.subTitle !== 'Dividend').map((data:any) => ({ ...data, totalData: data.totalData.sort((a:any, b:any) => a.ScripName.localeCompare(b.ScripName)) }));
			result.map((res: any) => {
				let array: any = [];
				res.totalData.forEach((ele: any) => {
					if (array.every((val: any) => val.scp_name !== ele.ScripName)) {
						const dataArr = res.totalData.filter((item: any) => item.ScripName === ele.ScripName);
						array.push({
							scp_name: ele.ScripName,
							ScripName: ele.ScripName,
							totalQty: this.calculateTotal('Qty', dataArr),
							totalBuyCharges: this.calculateTotal('BuyCharges', dataArr),
							totalBuyValue: this.calculateTotal('BuyValue', dataArr),
							totalSellValue: this.calculateTotal('SellValue', dataArr),
							totalPlValue: this.calculateTotal('TotalPL', dataArr),
							totalLongTermPL: this.calculateTotal('LongTermPL', dataArr),
							totalShortTermPL: this.calculateTotal('ShortTermPL', dataArr),
							totalSellCharges: this.calculateTotal('SellCharges', dataArr),
							totalIntradayPL: this.calculateTotal('IntradayPL', dataArr),
							totalBuyAvgRate: this.calculateAvgRate('BuyAvgRate', dataArr),
							totalSellAvgRate: this.calculateAvgRate('SellAvgRate', dataArr),
							isSumRow: true,
						});
						array.push(...dataArr);
					}
				});
				const array1 = array.filter((item: any) => item.isSumRow === true);

				let grandTotalBuyCharges = 0;
				let grandTotalBuyValue = 0;
				let grandTotalSellCharges = 0;
				let grandTotalSellValue = 0;
				let grandTotalLongTermPL = 0;
				let grandTotalShortTermPL = 0;
				let grandTotalIntradayPL = 0;
				let grandTotalPlValue = 0;

				array1.forEach((item: any) => {
					grandTotalBuyCharges += item.totalBuyCharges;
					grandTotalBuyValue += item.totalBuyValue;
					grandTotalSellCharges += item.totalSellCharges;
					grandTotalSellValue += item.totalSellValue;
					grandTotalLongTermPL += item.totalLongTermPL;
					grandTotalShortTermPL += item.totalShortTermPL;
					grandTotalIntradayPL += item.totalIntradayPL;
					grandTotalPlValue += item.totalPlValue;
				});

				res.totalData = [...array, {
					"INSTRUMENTNAME": "Total",
					"grandTotalBuyCharges": this.numberFormat(grandTotalBuyCharges).split('.')[0],
					"grandTotalBuyValue": this.numberFormat(grandTotalBuyValue).split('.')[0],
					"grandTotalSellCharges": this.numberFormat(grandTotalSellCharges).split('.')[0],
					"grandTotalSellValue": this.numberFormat(grandTotalSellValue).split('.')[0],
					"grandTotalLongTermPL": this.numberFormat(grandTotalLongTermPL).split('.')[0],
					"grandTotalShortTermPL": this.numberFormat(grandTotalShortTermPL).split('.')[0],
					"grandTotalIntradayPL": this.numberFormat(grandTotalIntradayPL).split('.')[0],
					"grandTotalPlValue": this.numberFormat(grandTotalPlValue).split('.')[0],
				}];
			});
			for (const singleData of [...result, ...this.realizedPlData.filter((item:any) => item.subTitle === 'MF'),
			 							...this.realizedPlData.filter((item:any) => item.subTitle === 'Dividend')]) {

				for (const tableIndex of this.getTableIndexesForPl(singleData.totalData)) {
					pageNo++;
					html += `<page size="A4" layout="landscape" orientation="landscape">`;
					html += `<div class="page_${tableIndex}" style="position: relative; overflow: hidden; margin: 0px 0px 0px 0px; padding: 0px; border: none; width: 842px">`;
					html += `<div style="height: 595px;">`;
					html += `<img style="position: absolute; top: 0; left: 0; z-index: 1;" src="../assets/imgs/vector-heading-table.png" alt="Header Background">`;
					html += `<img style="position: absolute; top: 12px; left: 20px; z-index: 3;" src="../assets/imgs/Logo.png" alt="Logo">`;
					html += `<div style="position: absolute; top: 15px; right: 20px; z-index: 3; color: #6C638C; text-align: right; font-family: 'Inter', sans-serif; font-size: 18px; font-style: normal; font-weight: 600; line-height: normal;">${this.family_member_value}</div>`;
					html += `<div style="position: relative; top: 90px; left: 21px;">`;
					html += `<span style="color: #4733CB; font-family: 'Inter', sans-serif; font-size: 24px; font-style: normal; font-weight: 600; line-height: normal;">${singleData.pageTitle}</span><br>`;
					html += `<img src="../assets/imgs/RectangleBig.png">&nbsp;<img src="../assets/imgs/RectangleSmall.png">`;
					html += `</div>`;
					if (singleData.subTitle !== null) {
						html += `<div style="position: relative; top: 110px; left: 21px;">`;
						html += `<img src="../assets/imgs/verticalLineRed.png">`;
						html += `<span style="color: #000000; font-style: normal; margin-top: 10px; text-transform: uppercase; font-family: 'Inter', sans-serif; font-size: 18px; margin-left: 5px; line-height: normal;">${singleData.subTitle}</span><br>`;
						html += `</div>`;
					}
					html += `<div style="position: relative; top: 120px; left: 21px;">`;
					// html += `<h1>Table ${tableIndex + 1}</h1>`;
					html += `<table style="width: 95%; table-layout: fixed; border-collapse: collapse;letter-spacing:0.01rem;"><thead><tr style="color: #615F78;
						font-family: 'Inter', sans-serif;
						font-size: 8px;
						font-style: normal;
						font-weight: 500;
						line-height: normal;background: #DBDAF3; height: 40px;">`;

					if(singleData.subTitle !== 'MF' && singleData.subTitle !== 'Dividend'){
					html += `<th style="text-align: left; padding-left: 2.5%;width: 20%;">${singleData.tableHead[0]}</th>`;
					// html += `<th style="text-align: center;width: 10%;">${singleData.tableHead[1]}</th>`;
					html += `<th style="text-align: right; padding-left: 2%;width: 10%;">${singleData.tableHead[2]}</th>`;
					html += `<th style="text-align: right;width: 13%;">${singleData.tableHead[3]}</th>`;
					html += `<th style="text-align: right;width: 13%;">${singleData.tableHead[4]}</th>`;
					html += `<th style="text-align: right;width: 13%;">${singleData.tableHead[5]}</th>`;
					html += `<th style="text-align: right; padding-left: 2%;width: 10%;">${singleData.tableHead[6]}</th>`;
					html += `<th style="text-align: right; padding-left: 2%;width: 10%;">${singleData.tableHead[7]}</th>`;
					html += `<th style="text-align: right; padding-left: 2%;width: 13%;">${singleData.tableHead[8]}</th>`;
					html += `<th style="text-align: right; padding-left: 2%;width: 10%;">${singleData.tableHead[9]}</th>`;
					html += `<th style="text-align: right; padding-left: 2%;width: 10%;">${singleData.tableHead[10]}</th>`;
					html += `<th style="text-align: right; padding-left: 2%;width: 10%;">${singleData.tableHead[11]}</th>`;
					html += `<th style="text-align: right; padding-left: 2%;padding-right:5px; width: 15%;">${singleData.tableHead[12]}</th>`;
					}
					if(singleData.subTitle === 'MF'){
						html += `<th style="text-align: left; padding-left: 2.5%;width: 20%;">${singleData.tableHead[0]}</th>`;
						html += `<th style="text-align: right;width: 10%;">${singleData.tableHead[1]}</th>`;
						html += `<th style="text-align: right; padding-left: 2%;width: 13%;">${singleData.tableHead[2]}</th>`;
						html += `<th style="text-align: right;width: 10%;">${singleData.tableHead[3]}</th>`;
						html += `<th style="text-align: right;width: 13%;">${singleData.tableHead[4]}</th>`;
						html += `<th style="text-align: right;width: 13%;">${singleData.tableHead[5]}</th>`;
						html += `<th style="text-align: right; padding-left: 2%;width: 10%;">${singleData.tableHead[6]}</th>`;
						html += `<th style="text-align: right; padding-left: 2%;width: 10%;">${singleData.tableHead[7]}</th>`;
						html += `<th style="text-align: right; padding-left: 2%;width: 10%;">${singleData.tableHead[8]}</th>`;
						html += `<th style="text-align: right; padding-left: 2%;width: 12%;">${singleData.tableHead[9]}</th>`;
						html += `<th style="text-align: right; padding-left: 2%;width: 12%;">${singleData.tableHead[10]}</th>`;
						html += `<th style="text-align: right; padding-left: 2%;width: 12%;">${singleData.tableHead[11]}</th>`;
						html += `<th style="text-align: right; padding-left: 2%;width: 12%;">${singleData.tableHead[12]}</th>`;
						html += `<th style="text-align: right; padding-left: 2%;padding-right:5px; width: 13%;">${singleData.tableHead[13]}</th>`;
					}
					if(singleData.subTitle === 'Dividend'){
						html += `<th style="text-align: left; padding-left: 2.5%;width: 20%; font-size: 12px !important;">${singleData.tableHead[0]}</th>`;
						html += `<th style="text-align: right;width: 10%; font-size: 12px !important;">${singleData.tableHead[1]}</th>`;
						html += `<th style="text-align: right; padding-left: 2%;width: 13%; padding-right:5px; font-size: 12px !important;">${singleData.tableHead[2]}</th>`;
					}
					html += `</tr></thead><tbody>`;
					let counter = 0;
					let dataArray: any;

					if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Stocks') {

					} else {
						dataArray = singleData.totalData
					}

					const startIndex = tableIndex * this.itemsPerPagePl;
					const endIndex = startIndex + this.itemsPerPagePl;
					let tableData = dataArray.slice(startIndex, endIndex);


					for (let i = 0; i < tableData.length; i++) {
						counter++;
						let record = tableData[i];
						let rowColorCode;
						let rowHeight;
						let style;
						let tdstyle;
						let TotalPLStyle;
						let titleStyle;

						(record.isSumRow ? rowColorCode = '#fff' : rowColorCode = '#F0F0F0');
						(record.isSumRow ? rowHeight = '40px' : rowHeight = '28px');

						let isTotal = record.INSTRUMENTNAME === 'Total';
						isTotal ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: ${rowHeight}; flex-shrink: 0;`

						html += `<tr style="${style}">`;

						(isTotal ? titleStyle = 'text-align: left; padding-left: 2.5%;width: 20%;font-size: 8px; font-weight: 700;':titleStyle = 'text-align: left; padding-left: 2.5%;width: 20%;font-size: 8px;');
						(isTotal ?tdstyle = 'text-align: right;font-size: 8px; font-weight: 700;': record.isSumRow ? tdstyle = 'text-align: right;font-size: 8px;' : tdstyle = 'padding-top:3px; vertical-align: top;text-align: right;font-size: 8px;');
						(record.isSumRow || isTotal ? TotalPLStyle = 'text-align: right;font-size: 8px; font-weight: 700;' : TotalPLStyle = 'padding-top:3px; font-weight:500; vertical-align: top;text-align: right;font-size: 8px;');
					if(singleData.subTitle !== 'MF' && singleData.subTitle !== 'Dividend'){
						html += `<td style="${titleStyle}">${isTotal?'Grand Total':record.isSumRow ? record.ScripName : ""}</td>`;
						// html += `<td style="text-align: center;font-size: 8px;">${record.isSumRow ? "INE021A01026" : ""}</td>`;
						html += `<td style="${tdstyle}">${isTotal?'--':this.numberFormat(parseInt(record.isSumRow ? record.totalQty : record.Qty))}</td>`;
						html += `<td style="${tdstyle}">${isTotal?'--':this.numberFormat(parseFloat(record.isSumRow ? record.totalBuyAvgRate : record.BuyAvgRate))}</td>`;
						html += `<td style="${tdstyle}">${isTotal?record.grandTotalBuyCharges:this.numberFormat(parseFloat(record.isSumRow ? record.totalBuyCharges : record.BuyCharges))}</td>`;
						html += `<td style="${tdstyle}">${isTotal?record.grandTotalBuyValue:this.numberFormat(parseFloat(record.isSumRow ? record.totalBuyValue : record.BuyValue))}${record.isSumRow || isTotal ? "" : `<br/><div style="padding-top:4px;color:#828282;font-weight:400;font-size:7px;">${moment(record.BuyDate).format('DD MMM YYYY')}</div>`}</td>`;
						html += `<td style="${tdstyle}">${isTotal?'--':this.numberFormat(parseFloat(record.isSumRow ? record.totalSellAvgRate : record.SellAvgRate))}</td>`;
						html += `<td style="${tdstyle}">${isTotal?record.grandTotalSellCharges:this.numberFormat(parseFloat(record.isSumRow ? record.totalSellCharges : record.SellCharges))}</td>`;
						html += `<td style="${tdstyle}">${isTotal?record.grandTotalSellValue:this.numberFormat(parseFloat(record.isSumRow ? record.totalSellValue : record.SellValue))}${record.isSumRow || isTotal ? "" : `<br/><div style="padding-top:4px;color:#828282;font-weight:400;font-size:7px;">${moment(JSON.stringify(record.SellDate)).format('DD MMM YYYY')}</div>`}</td>`;
						html += `<td style="${tdstyle}">${isTotal?record.grandTotalLongTermPL:this.numberFormat(parseFloat(record.isSumRow ? record.totalLongTermPL : record.LongTermPL))}</td>`;
						html += `<td style="${tdstyle}">${isTotal?record.grandTotalShortTermPL:this.numberFormat(parseFloat(record.isSumRow ? record.totalShortTermPL : record.ShortTermPL))}</td>`;
						html += `<td style="${tdstyle}">${isTotal?record.grandTotalIntradayPL:this.numberFormat(parseFloat(record.isSumRow ? record.totalIntradayPL : record.IntradayPL))}</td>`;
						html += `<td style="${TotalPLStyle} padding-right:5px;">${isTotal?record.grandTotalPlValue:this.numberFormat(parseFloat(record.isSumRow ? record.totalPlValue : record.TotalPL))}</td>`;
					}
					if(singleData.subTitle === 'MF'){
						html += `<td style="${titleStyle}">${isTotal?'Grand Total':record.isSumRow ? record.Scheme_Name : ""}</td>`;
						html += `<td style="${tdstyle}">${isTotal?'-':record.isSumRow ? '-' : record.Transaction_Type}${record.isSumRow || isTotal ? "" : `<br/><div style="padding-top:4px;color:#828282;font-weight:400;font-size:7px;">${record.Transaction_Date}</div>`}</td>`;
						html += `<td style="${tdstyle}">${isTotal?'-':record.isSumRow ? '-' : this.numberFormat(parseFloat(record.Purchase_Price))}</td>`;
						html += `<td style="${tdstyle}">${isTotal?record.Units:this.numberFormat(parseFloat(record.Units))}</td>`;
						html += `<td style="${tdstyle}">${isTotal?record.Purchase_Amount:this.numberFormat(parseFloat(record.Purchase_Amount))}</td>`;
						html += `<td style="${tdstyle}">${isTotal?'-':record.isSumRow ? '-' : record.Sell_Type}${record.isSumRow || isTotal ? "" : `<br/><div style="padding-top:4px;color:#828282;font-weight:400;font-size:7px;">${record.Sell_Date}</div>`}</td>`;
						html += `<td style="${tdstyle}">${isTotal?'-':record.isSumRow ? '-' : this.numberFormat(parseFloat(record.Sell_Rate))}</td>`;
						html += `<td style="${tdstyle}">${isTotal?record.Sell_Amount:this.numberFormat(parseFloat(record.Sell_Amount))}</td>`;
						html += `<td style="${tdstyle}">${isTotal?'-':record.isSumRow ? '-' : record.Days}</td>`;
						html += `<td style="${tdstyle}">${isTotal?record.GL_ST_Debt:this.numberFormat(parseFloat(record.GL_ST_Debt))}</td>`;
						html += `<td style="${tdstyle}">${isTotal?record.GL_ST_Equity:this.numberFormat(parseFloat(record.GL_ST_Equity))}</td>`;
						html += `<td style="${tdstyle}">${isTotal?record.GL_LT_Debt:this.numberFormat(parseFloat(record.GL_LT_Debt))}</td>`;
						html += `<td style="${tdstyle}">${isTotal?record.GL_LT_Equity:this.numberFormat(parseFloat(record.GL_LT_Equity))}</td>`;
						html += `<td style="${tdstyle} padding-right:5px;">${isTotal?'-':record.isSumRow ? '-' : record.STT}</td>`;
					}
					if(singleData.subTitle === 'Dividend'){
						html += `<td style="${titleStyle} font-size: 11px !important; ${record.isSumRow ? 'font-weight: 700' : ''}">${isTotal ?'Total':record.isSumRow ? record.clientCode : record.scripName}</td>`;
						html += `<td style="${tdstyle} font-size: 11px !important;">${isTotal?' ':record.isSumRow ? ' ' :  this.formatChange(record.exDate, "DD/MM/YYYY")}</td>`;
						html += `<td style="${TotalPLStyle} padding-right:15px; font-size: 11px !important;">${this.numberFormat(record.dividendAmount)}</td>`;
					}
						html += `</tr>`;
					}
					html += `</tbody></table></div>
				</div>
					<div style="position: absolute;bottom: 2%;left: 2%;clear:both"><span style="color: #817A9A;
							text-align: center;
							font-family: 'Inter', sans-serif;
							font-size: 14px;
							font-style: normal;
							font-weight: 700;
							line-height: normal;">PORTFOLIO 360</span>&nbsp;
						<span style="color: #84859E;
								font-family: 'Inter', sans-serif;
								font-size: 10px;
								font-style: normal;
								font-weight: 400;
								line-height: normal;">${moment(new Date()).format('MMM DD, YYYY')}</span>	
							
					</div>
					<div style="position: absolute;bottom: 2%;right: 2%;clear:both"><span style="color: #817A9A;
					text-align: center;
					font-family: 'Inter', sans-serif;
					font-size: 12px;
					font-style: normal;
					font-weight: 400;
					line-height: normal;">Private and Confidential | ${JSON.stringify(pageNo).length === 1 ? `0${pageNo}` : pageNo}</span>
			</div>
					
				</div></page>`;
				}
			}
			setDisclaimerPage(pageNo);
		}

		if (itemChecked.includes('portfolio') && itemChecked.includes('product') && itemChecked.includes('pl')) {
			html += page1;
			html += page2;
			if (this.productChartData.length > 0) {
				html += page3;
			}
			let pageNo = 2;
			for (const singleData of this.data) {

				for (const tableIndex of this.getTableIndexes(singleData.totalData, singleData.subTitle)) {
					pageNo++;
					html += `<page size="A4" layout="landscape" orientation="landscape">`;
					html += `<div class="page_${tableIndex}" style="position: relative; overflow: hidden; margin: 0px 0px 0px 0px; padding: 0px; border: none; width: 842px">`;
					html += `<div style="height: 595px;">`;
					html += `<img style="position: absolute; top: 0; left: 0; z-index: 1;" src="../assets/imgs/vector-heading-table.png" alt="Header Background">`;
					html += `<img style="position: absolute; top: 12px; left: 20px; z-index: 3;" src="../assets/imgs/Logo.png" alt="Logo">`;
					html += `<div style="position: absolute; top: 15px; right: 20px; z-index: 3; color: #6C638C; text-align: right; font-family: 'Inter', sans-serif; font-size: 18px; font-style: normal; font-weight: 600; line-height: normal;">${this.clientName}</div>`;
					html += `<div style="position: relative; top: 90px; left: 21px;">`;
					html += `<span style="color: #4733CB; font-family: 'Inter', sans-serif; font-size: 24px; font-style: normal; font-weight: 600; line-height: normal;">${singleData.pageTitle}</span><br>`;
					html += `<img src="../assets/imgs/RectangleBig.png">&nbsp;<img src="../assets/imgs/RectangleSmall.png">`;
					html += `</div>`;
					if (singleData.subTitle !== null) {
						html += `<div style="position: relative; top: 110px; left: 21px;">`;
						html += `<img src="../assets/imgs/verticalLineRed.png">`;
						html += `<span style="color: #000000; font-style: normal; margin-top: 10px; text-transform: uppercase; font-family: 'Inter', sans-serif; font-size: 18px; margin-left: 5px; line-height: normal;">${singleData.subTitle}</span><br>`;
						html += `</div>`;
					}
					html += `<div style="position: relative; top: 120px; left: 21px;">`;
					// html += `<h1>Table ${tableIndex + 1}</h1>`;
					html += `<table style="width: 95%; table-layout: fixed; border-collapse: collapse;letter-spacing:0.01rem;"><thead><tr style="color: #615F78;
				font-family: 'Inter', sans-serif;
				font-size: 11px;
				font-style: normal;
				font-weight: 500;
				line-height: normal;background: #DBDAF3; height: 40px;">`;

					/* for (const tableHeading of singleData.tableHead) {
						console.log(tableIndex , 'index')
						html += `<th>${tableHeading}</th>`;
					} */

					if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Mutual Funds') {
						for (let ind = 0; ind < singleData.tableHead.length; ind++) {
							const element = singleData.tableHead[ind];
							if (ind === 0) html += `<th style="text-align: left; padding-left: 2.5%;width: 35%;">${element}</th>`;
							//else if (ind === 1) html += `<th style="text-align: center;width: 17%;">${element}</th>`;
							else if (ind === 4) html += `<th style="text-align: right;width: 9%;">${element}</th>`;
							else if (ind == singleData.tableHead.length - 1) html += `<th style="text-align: right;padding-right: 2.5%;width: 11%;">${element}</th>`;
							else html += `<th style="text-align: right; padding-left: 2%;width: 11%;">${element}</th>`;
						}
					} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Stocks') {
						for (let ind = 0; ind < singleData.tableHead.length; ind++) {
							const element = singleData.tableHead[ind];
							if (ind === 0) html += `<th style="text-align: left; padding-left: 2.5%;width: 20%;">${element}</th>`;
							else if (ind === 3 || ind === 5) html += `<th style="text-align: right;width: 13%;">${element}</th>`;
							else if (ind === 4 || ind === 1) html += `<th style="text-align: right;width: 8%;">${element}</th>`;
							else if (ind == singleData.tableHead.length - 1) html += `<th style="text-align: right;padding-right: 2.5%;width: 10%;">${element}</th>`;
							else html += `<th style="text-align: right; padding-left: 2%;width: 10%;">${element}</th>`;
						}
					} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Bonds') {
						for (let ind = 0; ind < singleData.tableHead.length; ind++) {
							const element = singleData.tableHead[ind];
							if (ind === 0) html += `<th style="text-align: left; padding-left: 2.5%;width: 37%;">${element}</th>`;
							else if (ind === 2) html += `<th style="text-align: right;width: 9%;">${element}</th>`;
							else if (ind == singleData.tableHead.length - 1) html += `<th style="text-align: right;padding-right: 2.5%;width: 18%;">${element}</th>`;
							else html += `<th style="text-align: right; padding-left: 2%;width: 18%;">${element}</th>`;
						}
					} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Fixed Deposit') {
						for (let ind = 0; ind < singleData.tableHead.length; ind++) {
							const element = singleData.tableHead[ind];
							if (ind === 0) html += `<th style="text-align: left; padding-left: 2.5%;width: 30%;">${element}</th>`;
							else if (ind === 4) html += `<th style="text-align: right;width: 6%;">${element}</th>`;
							else if (ind == singleData.tableHead.length - 1) html += `<th style="text-align: right;padding-right: 2.5%;width: 16%;">${element}</th>`;
							else html += `<th style="text-align: right; padding-left: 2%;width: 16%;">${element}</th>`;
						}
					} else if (singleData.pageTitle === 'Product Wise Holdings' && (singleData.subTitle == 'AIF' || singleData.subTitle == 'PMS')) {
						for (let ind = 0; ind < singleData.tableHead.length; ind++) {
							const element = singleData.tableHead[ind];
							if (ind === 0) html += `<th style="text-align: left; padding-left: 2.5%;width: 29%;">${element}</th>`;
							else if (ind == singleData.tableHead.length - 1) html += `<th style="text-align: right;padding-right: 2.5%;width: 16%;">${element}</th>`;
							else html += `<th style="text-align: right; padding-left: 2%;width: 16%;">${element}</th>`;
						}
					} 
					
					else {
						for (let ind = 0; ind < singleData.tableHead.length; ind++) {
							const element = singleData.tableHead[ind];
							if (ind === 0) html += `<th style="text-align: left; padding-left: 2.5%;width: 25%;">${element}</th>`;
							else if (ind == singleData.tableHead.length - 1) html += `<th style="text-align: right;padding-right: 2.5%;width: 15%;">${element}</th>`;
							else html += `<th style="text-align: right; padding-left: 2%;width: 15%;">${element}</th>`;
						}
					}

					html += `</tr></thead><tbody>`;
					let counter = 0;
					let dataArray: any;

					if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Mutual Funds') {
						let dataBind = lodash.groupBy(singleData.totalData, "scheme_category");
						let filerTemp = lodash.map(dataBind, arraygroup => lodash.groupBy(arraygroup, obj =>
							obj.scheme_category));

						let filterData: any = [];

						filerTemp.forEach(element => {
							let valuesArray: any = Object.values(element);
							valuesArray[0].forEach((element2: any) => {
								filterData.push(element2)
							});
						});
						dataArray = filterData
					} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Stocks') {
						let dataBind = lodash.groupBy(singleData.totalData, "SectorName");

						let filerTemp = lodash.map(dataBind, arraygroup => lodash.groupBy(arraygroup, obj =>
							obj.SectorName));
						let unlistedFilterData: any = [];
						let unlistedFilterExtraData: any = [];
						// let listedFilterData = [];			

						filerTemp.forEach(element => {
							let valuesArray: any = Object.values(element);

							valuesArray[0].forEach((element2: any) => {
								// unlistedFilterData.push(element2);
								if (element2.INSTRUMENTNAME != "Total" && element2.SectorName != '') {
									unlistedFilterData.push(element2);
									// unlistedFilterData = unlistedFilterData.reverse();
								} else {
									unlistedFilterExtraData.push(element2);
									// unlistedFilterData.push(element2);
								}
							});
						});
						dataArray = unlistedFilterData.concat(unlistedFilterExtraData);
						// dataArray = unlistedFilterData;
					} else {
						dataArray = singleData.totalData
					}

					if ((singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Mutual Funds') || (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Stocks')) {
						this.itemsPerPage = 5;
					} else {
						this.itemsPerPage = 7;
					}

					const startIndex = tableIndex * this.itemsPerPage;
					const endIndex = startIndex + this.itemsPerPage;

					let tableData = dataArray.slice(startIndex, endIndex);

					//for (const record of this.getTableData(tableIndex, singleData.totalData)) {
					for (let i = 0; i < tableData.length; i++) {
						counter++;
						let record = tableData[i];
						// console.log(counter, 'counter', singleData.totalData.length, 'legnth', tableIndex, 'table index');
						let rowColorCode;
						let profitNLossColor;
						let netProfitNLossColor;
						let style;
						((counter % 2 == 0) ? rowColorCode = '#F0F0F0' : rowColorCode = '#fff');

						/* if(tableIndex > 0) {
							var totalLength = counter + 
						} else {
							counter === singleData.totalData.length ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: 'Inter', sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = 'color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;'
						} */

						if (singleData.pageTitle === 'Family Distribution' && singleData.subTitle === null) {
							record.CLIENTCODE === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`
							html += `<tr style="${style}">`;

							(record.UNREALISEDPLVAL > 0 ? netProfitNLossColor = '#009E3B' : (record.UNREALISEDPLVAL < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));
							(record.UNREALISEDPLPER > 0 ? profitNLossColor = '#009E3B' : (record.UNREALISEDPLPER < 0 ? profitNLossColor = '#DF514C' : profitNLossColor = '#000000'));

							html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.CLIENTCODE}</td>`;
							html += `<td style="text-align: right;">${this.numberFormat(record.CURRENTVALUE)}</td>`;
							html += `<td style="text-align: right;">${this.numberFormat(record.HLDPERCENTAGE)}</td>`;
							html += `<td style="text-align: right;color: ${netProfitNLossColor}"">${record.UNREALISEDPLVAL < 0 ? '(' : ''}${this.numberFormat(record.UNREALISEDPLVAL)}${record.UNREALISEDPLVAL < 0 ? ')' : ''}</td>`;
							html += `<td style="text-align: right; padding-right: 2.5%; color: ${profitNLossColor}"> ${record.UNREALISEDPLPER < 0 ? '(' : ''}${this.numberFormat(record.UNREALISEDPLPER)}${record.UNREALISEDPLPER < 0 ? ')' : ''}</td>`;
						} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Stocks') {
							record.INSTRUMENTNAME === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`

							let nameOfSector = tableData[0].SectorName;

							if (record.INSTRUMENTNAME != "Total") {
								if (record.Unlisted_Delisted === '0') {
									if (i == 0) {
										html += `<tr style="background-color: #F5F4FF;"><td style="color: #000;font-family: 'Inter', sans-serif;font-size: 10px;font-style: normal;font-weight: 700;line-height: normal;text-align: left; padding: 4px 2.5%; "colspan="9">${nameOfSector ? nameOfSector : 'Others'}</td></tr>`;
									}

									if (i - 1 < tableData.length && nameOfSector != tableData[i].SectorName &&
										tableData[i].SectorName != tableData[i - 1].SectorName) {
										html += `<tr style="background-color: #F5F4FF;"><td style="color: #000;font-family: 'Inter', sans-serif;font-size: 10px;font-style: normal;font-weight: 700;line-height: normal;text-align: left; padding: 4px 2.5%; "colspan="9">${record.SectorName ? record.SectorName : 'Others'}</td></tr>`;
									}

								} else {
									// html += `<tr style="background-color: #F5F4FF;"><td style="color: #000;font-family: 'Inter', sans-serif;font-size: 10px;font-style: normal;font-weight: 700;line-height: normal;text-align: left; padding: 4px 2.5%; "colspan="9">Unlisted/Delisted</td></tr>`;

									if (i == 0) {
										html += `<tr style="background-color: #F5F4FF;"><td style="color: #000;font-family: 'Inter', sans-serif;font-size: 10px;font-style: normal;font-weight: 700;line-height: normal;text-align: left; padding: 4px 2.5%; "colspan="9">Unlisted/Delisted</td></tr>`;
									}

									if (i - 1 < tableData.length && nameOfSector != tableData[i].SectorName &&
										tableData[i].SectorName != tableData[i - 1].SectorName) {
										html += `<tr style="background-color: #F5F4FF;"><td style="color: #000;font-family: 'Inter', sans-serif;font-size: 10px;font-style: normal;font-weight: 700;line-height: normal;text-align: left; padding: 4px 2.5%; "colspan="9">Unlisted/Delisted</td></tr>`;
									}
								}
							}

							html += `<tr style="${style}">`;

							(record.UNREALIEDGL > 0 ? netProfitNLossColor = '#009E3B' : (record.UNREALIEDGL < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));
							(record.UNRLGAINLOSSPER > 0 ? profitNLossColor = '#009E3B' : (record.UNRLGAINLOSSPER < 0 ? profitNLossColor = '#DF514C' : profitNLossColor = '#000000'));

							html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.INSTRUMENTNAME}</td>`;
							html += `<td style="text-align: right;">${record.QUANTITY == '--' ? '--' : this.numberNoFormat(parseInt(record.QUANTITY))}</td>`;
							html += `<td style="text-align: right;">${record.AVGPURCHASEPRICE == '-' ? '--' : record.AVGPURCHASEPRICE == 0 ? '--' : this.numberFormat(record.AVGPURCHASEPRICE)}</td>`;
							html += `<td style="text-align: right;">${this.numberNoFormat(record.HOLDINGCOST)}</td>`;
							html += `<td style="text-align: right;">${record.PreviousClosingPrice == '-' ? '--' : record.PreviousClosingPrice == 0 ? '--' : this.numberFormat(record.PreviousClosingPrice)}</td>`;
							html += `<td style="text-align: right;">${this.numberNoFormat(record.MARKETVALUE)}</td>`;
							// html += `<td style="text-align: right;">${this.numberNoFormat(record.DIVIDENT)}</td>`;
							html += `<td style="text-align: right; padding-right: 4px; color: ${record['Get_three_year_change'] > 0 ? '#009E3B' : (record['Get_three_year_change'] < 0 ? '#DF514C' : '#000000')}">${record['Get_three_year_change'] < 0 ? '(' : ''}${this.numberFormat(record['Get_three_year_change'])}${record['Get_three_year_change'] < 0 ? ')' : ''}</td>`;
							html += `<td style="text-align: right;color: ${netProfitNLossColor}">${record.UNREALIEDGL < 0 ? '(' : ''}${this.numberNoFormat(record.UNREALIEDGL)}${record.UNREALIEDGL < 0 ? ')' : ''}</td>`;
							html += `<td style="text-align: right; padding-right: 2.5%; color: ${profitNLossColor}">${record.UNRLGAINLOSSPER < 0 ? '(' : ''}${this.numberFormat(record.UNRLGAINLOSSPER)}${record.UNRLGAINLOSSPER < 0 ? ')' : ''}</td>`;
						} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Mutual Funds') {
							record.Scheme_Name === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`

							let titleOfCategory = tableData[0].scheme_category;
							if (i == 0) {
								html += `<tr style="background-color: #F5F4FF;"><td style="color: #000;font-family: 'Inter', sans-serif;font-size: 10px;font-style: normal;font-weight: 700;line-height: normal;text-align: left; padding: 4px 2.5%; "colspan="9">${titleOfCategory}</td></tr>`;
							}

							if (i - 1 < tableData.length && titleOfCategory != tableData[i].scheme_category &&
								tableData[i].scheme_category != tableData[i - 1].scheme_category) {
								html += `<tr style="background-color: #F5F4FF;"><td style="color: #000;font-family: 'Inter', sans-serif;font-size: 10px;font-style: normal;font-weight: 700;line-height: normal;text-align: left; padding: 4px 2.5%; "colspan="9">${record.scheme_category}</td></tr>`;
							}

							html += `<tr style="${style}">`;
							(record.Unrealized_Profit > 0 ? netProfitNLossColor = '#009E3B' : (record.Unrealized_Profit < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));

							html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.Scheme_Name}</td>`
							// html += `<td style="text-align: center;">${record.scheme_category}</td>`;
							html += `<td style="text-align: right;">${record.Present_Units == '-' ? '--' : record.Present_Units == 0 ? '--' : this.numberFormat(+(record.Present_Units))}</td>`;
							html += `<td style="text-align: right;">${this.numberNoFormat(record.Current_Investment)}</td>`;
							html += `<td style="text-align: right;">${this.numberNoFormat(record.Present_Value)}</td>`;
							html += `<td style="text-align: right;">${record.Present_NAV == '-' ? '--' : this.numberFormat(record.Present_NAV)}</td>`;
							html += `<td style="text-align: right; color: ${record['XIRR'] > 0 ? '#009E3B' : (record['XIRR'] < 0 ? '#DF514C' : '#000000')}">${record['XIRR'] < 0 ? '(' : ''}${record.XIRR == '-' ? '--' : this.numberFormat(record['XIRR'])}${record['XIRR'] < 0 ? ')' : ''}</td>`;
							html += `<td style="text-align: right;color: ${netProfitNLossColor}">${record.Unrealized_Profit < 0 ? '(' : ''}${this.numberNoFormat(record.Unrealized_Profit)}${record.Unrealized_Profit < 0 ? ')' : ''}</td>`;
							html += `<td style="text-align: right; padding-right: 2.5%; color: ${record['pnlValue'] > 0 ? '#009E3B' : (record['pnlValue'] < 0 ? '#DF514C' : '#000000')}">${record['pnlValue'] < 0 ? '(' : ''}${this.numberFormat(record['pnlValue'])}${record['pnlValue'] < 0 ? ')' : ''}</td>`;
						} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Bonds') {
							record.BondCompany === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`
							html += `<tr style="${style}">`;
							// (record.Unrealized_Profit > 0 ? netProfitNLossColor = '#009E3B' : (record.Unrealized_Profit < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));

							html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.BondCompany}</td>`
							// html += `<td style="text-align: right;">${record.Tenor ? record.Tenor : '--'}</td>`;
							// html += `<td style="text-align: right;">${record.BondBookingDate ? moment(record.BondBookingDate).format('DD/MM/YYYY') : '--'}</td>`;
							html += `<td style="text-align: right;">${this.numberNoFormat(record.BondAmount)}</td>`;
							html += `<td style="text-align: right;">${record.Rateofinterest ? this.formatDecimal(record.Rateofinterest) : '--'}</td>`;
							html += `<td style="text-align: right;">${record.BondMaturityDate ? moment(record.BondMaturityDate).format('DD/MM/YYYY') : '--'}</td>`;
							html += `<td style="text-align: right;padding-right: 2.5%;">${record.ISIN ? record.ISIN : '--'}</td>`;

							// html += `<td style="text-align: right;color: ${netProfitNLossColor}">${record.Unrealized_Profit < 0 ? '(' : ''}${this.numberFormat(record.Unrealized_Profit)}${record.Unrealized_Profit < 0 ? ')' : ''}</td>`;
							// html += `<td style="text-align: right; padding-right: 2.5%; color: ${record['pnlValue'] > 0 ? '#009E3B' : (record['pnlValue'] < 0 ? '#DF514C' : '#000000')}">${record['pnlValue'] < 0 ? '(' : ''}${this.numberFormat(record['pnlValue'])}${record['pnlValue'] < 0 ? ')' : ''}</td>`;
						} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Fixed Deposit') {
							record.FDCompany === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`
							html += `<tr style="${style}">`;
							// (record.Unrealized_Profit > 0 ? netProfitNLossColor = '#009E3B' : (record.Unrealized_Profit < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));

							html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.FDCompany}</td>`
							html += `<td style="text-align: right;">${record.Tenor ? record.Tenor : '--'}</td>`;
							html += `<td style="text-align: right;">${record.FDBookingDate ? moment(record.FDBookingDate).format('DD/MM/YYYY') : '--'}</td>`;
							html += `<td style="text-align: right;">${this.numberNoFormat(record.FDBookingAmount)}</td>`;
							html += `<td style="text-align: right;">${record.RateOfInterest ? record.RateOfInterest : '--'}</td>`;
							html += `<td style="text-align: right;padding-right: 2.5%;">${record.FDMaturityDate ? moment(record.FDMaturityDate).format('DD/MM/YYYY') : '--'}</td>`;

							// html += `<td style="text-align: right;">${record.Present_NAV == '-' ? '--' : this.numberFormat(record.Present_NAV)}</td>`;
							// html += `<td style="text-align: right;color: ${netProfitNLossColor}">${record.Unrealized_Profit < 0 ? '(' : ''}${this.numberFormat(record.Unrealized_Profit)}${record.Unrealized_Profit < 0 ? ')' : ''}</td>`;
							// html += `<td style="text-align: right; padding-right: 2.5%; color: ${record['pnlValue'] > 0 ? '#009E3B' : (record['pnlValue'] < 0 ? '#DF514C' : '#000000')}">${record['pnlValue'] < 0 ? '(' : ''}${this.numberFormat(record['pnlValue'])}${record['pnlValue'] < 0 ? ')' : ''}</td>`;
						} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'AIF') {
							record.SCHEMENAME === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`
							html += `<tr style="${style}">`;
							(record.netpl > 0 ? netProfitNLossColor = '#009E3B' : (record.netpl < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));

							html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.SCHEMENAME}</td>`
							html += `<td style="text-align: left;padding-left: 2.5%;">${record.AMCNAME ? record.AMCNAME : '--'}</td>`;
							html += `<td style="text-align: right;">${record.AUMDATE ? record.AUMDATE : '--'}</td>`;
							html += `<td style="text-align: right;">${this.numberNoFormat(record.NETINVESTMENT)}</td>`;
							html += `<td style="text-align: right;">${this.numberNoFormat(record.CRRENTVALUE)}</td>`;
							html += `<td style="text-align: right;">${record.COMMITMENTAMOUNT}</td>`;

							html += `<td style="text-align: right;color: ${netProfitNLossColor}">${record.netpl < 0 ? '(' : ''}${this.numberNoFormat(record.netpl)}${record.netpl < 0 ? ')' : ''}</td>`;
							html += `<td style="text-align: right; padding-right: 2.5%; color: ${record['plPer'] == '--' ? '#000000' : record['plPer'] > 0 ? '#009E3B' : (record['plPer'] < 0 ? '#DF514C' : '#000000')}">${record['plPer'] < 0 ? '(' : ''}${record['plPer'] == '--' ? '--' : this.numberFormat(record['plPer'])}${record['plPer'] < 0 ? ')' : ''}</td>`;
						} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'PMS') {
							record.SCHEMENAME === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`
							html += `<tr style="${style}">`;
							(record.netpl > 0 ? netProfitNLossColor = '#009E3B' : (record.netpl < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));

							html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.SCHEMENAME}</td>`
							html += `<td style="text-align: left;padding-left: 4.2%;">${record.AMCNAME ? record.AMCNAME : '--'}</td>`;
							html += `<td style="text-align: right;">${record.AUMDATE ? record.AUMDATE : '--'}</td>`;
							html += `<td style="text-align: right;">${this.numberNoFormat(record.NETINVESTMENT)}</td>`;
							html += `<td style="text-align: right;">${this.numberNoFormat(record.CRRENTVALUE)}</td>`;

							html += `<td style="text-align: right;color: ${netProfitNLossColor}">${record.netpl < 0 ? '(' : ''}${this.numberNoFormat(record.netpl)}${record.netpl < 0 ? ')' : ''}</td>`;
							html += `<td style="text-align: right; padding-right: 2.5%; color: ${record['plPer'] > 0 ? '#009E3B' : (record['plPer'] < 0 ? '#DF514C' : '#000000')}">${record['plPer'] < 0 ? '(' : ''}${this.numberFormat(record['plPer'])}${record['plPer'] < 0 ? ')' : ''}</td>`;
						}

						html += `</tr>`;
					}
					html += `</tbody></table></div>
		</div>
			<div style="position: absolute;bottom: 2%;left: 2%;clear:both"><span style="color: #817A9A;
					text-align: center;
					font-family: 'Inter', sans-serif;
					font-size: 14px;
					font-style: normal;
					font-weight: 700;
					line-height: normal;">PORTFOLIO 360</span>&nbsp;
				<span style="color: #84859E;
						font-family: 'Inter', sans-serif;
						font-size: 10px;
						font-style: normal;
						font-weight: 400;
						line-height: normal;">${moment(new Date()).format('MMM DD, YYYY')}</span>	
					
			</div>
			<div style="position: absolute;bottom: 2%;right: 2%;clear:both"><span style="color: #817A9A;
			text-align: center;
			font-family: 'Inter', sans-serif;
			font-size: 12px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;">Private and Confidential | ${JSON.stringify(pageNo).length === 1 ? `0${pageNo}` : pageNo}</span>
	</div>
			
		</div></page>`;
				}
			}
			if (this.data.every((item: any) => item.totalData.length === 0)) pageNo = 1;
			realizedPLReport(pageNo);
		}
		else if (itemChecked.includes('portfolio') && itemChecked.includes('pl')) {
			html += page1;
			html += page2;
			if (this.productChartData.length > 0) {
				html += page3;
			}
			let pageNo = 2;
			for (const singleData of this.data) {
				if (singleData.pageTitle === 'Family Distribution') {
			
					for (const tableIndex of this.getTableIndexes(singleData.totalData)) {
						pageNo++;
						html += `<page size="A4" layout="landscape" orientation="landscape">`;
						html += `<div class="page_${tableIndex}" style="position: relative; overflow: hidden; margin: 0px 0px 0px 0px; padding: 0px; border: none; width: 842px">`;
						html += `<div style="height: 595px;">`;
						html += `<img style="position: absolute; top: 0; left: 0; z-index: 1;" src="../assets/imgs/vector-heading-table.png" alt="Header Background">`;
						html += `<img style="position: absolute; top: 12px; left: 20px; z-index: 3;" src="../assets/imgs/Logo.png" alt="Logo">`;
						html += `<div style="position: absolute; top: 15px; right: 20px; z-index: 3; color: #6C638C; text-align: right; font-family: 'Inter', sans-serif; font-size: 18px; font-style: normal; font-weight: 600; line-height: normal;">${this.clientName}</div>`;
						html += `<div style="position: relative; top: 90px; left: 21px;">`;
						html += `<span style="color: #4733CB; font-family: 'Inter', sans-serif; font-size: 24px; font-style: normal; font-weight: 600; line-height: normal;">${singleData.pageTitle}</span><br>`;
						html += `<img src="../assets/imgs/RectangleBig.png">&nbsp;<img src="../assets/imgs/RectangleSmall.png">`;
						html += `</div>`;
						if (singleData.subTitle !== null) {
							html += `<div style="position: relative; top: 110px; left: 21px;">`;
							html += `<img src="../assets/imgs/verticalLineRed.png">`;
							html += `<span style="color: #000000; font-style: normal; margin-top: 10px; text-transform: uppercase; font-family: 'Inter', sans-serif; font-size: 18px; margin-left: 5px; line-height: normal;">${singleData.subTitle}</span><br>`;
							html += `</div>`;
						}
						html += `<div style="position: relative; top: 120px; left: 21px;">`;
						// html += `<h1>Table ${tableIndex + 1}</h1>`;
						html += `<table style="width: 95%; table-layout: fixed; border-collapse: collapse;letter-spacing:0.01rem;"><thead><tr style="color: #615F78;
						font-family: 'Inter', sans-serif;
						font-size: 12px;
						font-style: normal;
						font-weight: 500;
						line-height: normal;background: #DBDAF3; height: 40px;">`;
						for (let ind = 0; ind < singleData.tableHead.length; ind++) {
							const element = singleData.tableHead[ind];
							if (ind === 0) html += `<th style="text-align: left; padding-left: 2.5%;width: 25%;">${element}</th>`;
							else if (ind == singleData.tableHead.length - 1) html += `<th style="text-align: right;padding-right: 2.5%;width: 15%;">${element}</th>`;
							else html += `<th style="text-align: right; padding-left: 2%;width: 15%;">${element}</th>`;
						}

						html += `</tr></thead><tbody>`;
						let counter = 0;
						for (const record of this.getTableData(tableIndex, singleData.totalData)) {
							counter++;
							// console.log(counter, 'counter', singleData.totalData.length, 'legnth', tableIndex, 'table index');
							let rowColorCode;
							let profitNLossColor;
							let netProfitNLossColor;
							let style;
							((counter % 2 == 0) ? rowColorCode = '#F0F0F0' : rowColorCode = '#fff');

							if (singleData.pageTitle === 'Family Distribution' && singleData.subTitle === null) {
								record.CLIENTCODE === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`
								html += `<tr style="${style}">`;

								(record.UNREALISEDPLVAL > 0 ? netProfitNLossColor = '#009E3B' : (record.UNREALISEDPLVAL < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));
								(record.UNREALISEDPLPER > 0 ? profitNLossColor = '#009E3B' : (record.UNREALISEDPLPER < 0 ? profitNLossColor = '#DF514C' : profitNLossColor = '#000000'));

								html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.CLIENTCODE}</td>`;
								html += `<td style="text-align: right;">${this.numberFormat(record.CURRENTVALUE)}</td>`;
								html += `<td style="text-align: right;">${this.numberFormat(record.HLDPERCENTAGE)}</td>`;
								html += `<td style="text-align: right;color: ${netProfitNLossColor}"">${record.UNREALISEDPLVAL < 0 ? '(' : ''}${this.numberFormat(record.UNREALISEDPLVAL)}${record.UNREALISEDPLVAL < 0 ? ')' : ''}</td>`;
								html += `<td style="text-align: right; padding-right: 2.5%; color: ${profitNLossColor}"> ${record.UNREALISEDPLPER < 0 ? '(' : ''}${this.numberFormat(record.UNREALISEDPLPER)}${record.UNREALISEDPLPER < 0 ? ')' : ''}</td>`;
							}
							html += `</tr>`;
						}
						html += `</tbody></table></div>
				</div>
					<div style="position: absolute;bottom: 2%;left: 2%;clear:both"><span style="color: #817A9A;
							text-align: center;
							font-family: 'Inter', sans-serif;
							font-size: 14px;
							font-style: normal;
							font-weight: 700;
							line-height: normal;">PORTFOLIO 360</span>&nbsp;
						<span style="color: #84859E;
								font-family: 'Inter', sans-serif;
								font-size: 10px;
								font-style: normal;
								font-weight: 400;
								line-height: normal;">${moment(new Date()).format('MMM DD, YYYY')}</span>	
							
					</div>
					<div style="position: absolute;bottom: 2%;right: 2%;clear:both"><span style="color: #817A9A;
					text-align: center;
					font-family: 'Inter', sans-serif;
					font-size: 12px;
					font-style: normal;
					font-weight: 400;
					line-height: normal;">Private and Confidential | ${JSON.stringify(pageNo).length === 1 ? `0${pageNo}` : pageNo}</span>
			</div>
					
				</div></page>`;
					}
				}
			}
			if (this.data.every((item: any) => item.totalData.length === 0)) pageNo = 1;
			realizedPLReport(pageNo);
		}
		else if (itemChecked.includes('product') && itemChecked.includes('pl')) {
			if (!this.data.some((item: any) => item.totalData.length > 0) && this.realizedPlData.length === 0) {
				this.toast.displayToast('No record found');
				this.pdfLoader = true;
				return false;
			}
			html += page1;
			let pageNo = 0;
			for (const singleData of this.data) {

				if (singleData.pageTitle != 'Family Distribution') {
					for (const tableIndex of this.getTableIndexes(singleData.totalData, singleData.subTitle)) {
						pageNo++;
						html += `<page size="A4" layout="landscape" orientation="landscape">`;
						html += `<div class="page_${tableIndex}" style="position: relative; overflow: hidden; margin: 0px 0px 0px 0px; padding: 0px; border: none; width: 842px">`;
						html += `<div style="height: 595px;">`;
						html += `<img style="position: absolute; top: 0; left: 0; z-index: 1;" src="../assets/imgs/vector-heading-table.png" alt="Header Background">`;
						html += `<img style="position: absolute; top: 12px; left: 20px; z-index: 3;" src="../assets/imgs/Logo.png" alt="Logo">`;
						html += `<div style="position: absolute; top: 15px; right: 20px; z-index: 3; color: #6C638C; text-align: right; font-family: 'Inter', sans-serif; font-size: 18px; font-style: normal; font-weight: 600; line-height: normal;">${this.clientName}</div>`;
						html += `<div style="position: relative; top: 90px; left: 21px;">`;
						html += `<span style="color: #4733CB; font-family: 'Inter', sans-serif; font-size: 24px; font-style: normal; font-weight: 600; line-height: normal;">${singleData.pageTitle}</span><br>`;
						html += `<img src="../assets/imgs/RectangleBig.png">&nbsp;<img src="../assets/imgs/RectangleSmall.png">`;
						html += `</div>`;
						if (singleData.subTitle !== null) {
							html += `<div style="position: relative; top: 110px; left: 21px;">`;
							html += `<img src="../assets/imgs/verticalLineRed.png">`;
							html += `<span style="color: #000000; font-style: normal; margin-top: 10px; text-transform: uppercase; font-family: 'Inter', sans-serif; font-size: 18px; margin-left: 5px; line-height: normal;">${singleData.subTitle}</span><br>`;
							html += `</div>`;
						}
						html += `<div style="position: relative; top: 120px; left: 21px;">`;
						// html += `<h1>Table ${tableIndex + 1}</h1>`;
						html += `<table style="width: 95%; table-layout: fixed; border-collapse: collapse;letter-spacing:0.01rem;"><thead><tr style="color: #615F78;
					font-family: 'Inter', sans-serif;
					font-size: 12px;
					font-style: normal;
					font-weight: 500;
					line-height: normal;background: #DBDAF3; height: 40px;">`;

						/* for (const tableHeading of singleData.tableHead) {
							console.log(tableIndex , 'index')
							html += `<th>${tableHeading}</th>`;
						} */

						if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Mutual Funds') {
							for (let ind = 0; ind < singleData.tableHead.length; ind++) {
								const element = singleData.tableHead[ind];
								if (ind === 0) html += `<th style="text-align: left; padding-left: 2.5%;width: 35%;">${element}</th>`;
								//else if (ind === 1) html += `<th style="text-align: center;width: 17%;">${element}</th>`;
								else if (ind === 4) html += `<th style="text-align: right;width: 9%;">${element}</th>`;
								else if (ind == singleData.tableHead.length - 1) html += `<th style="text-align: right;padding-right: 2.5%;width: 11%;">${element}</th>`;
								else html += `<th style="text-align: right; padding-left: 2%;width: 11%;">${element}</th>`;
							}
						} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Stocks') {
							for (let ind = 0; ind < singleData.tableHead.length; ind++) {
								const element = singleData.tableHead[ind];
								if (ind === 0) html += `<th style="text-align: left; padding-left: 2.5%;width: 20%;">${element}</th>`;
								else if (ind === 3 || ind === 5) html += `<th style="text-align: right;width: 13%;">${element}</th>`;
								else if (ind === 4 || ind === 1) html += `<th style="text-align: right;width: 8%;">${element}</th>`;
								else if (ind == singleData.tableHead.length - 1) html += `<th style="text-align: right;padding-right: 2.5%;width: 10%;">${element}</th>`;
								else html += `<th style="text-align: right; padding-left: 2%;width: 10%;">${element}</th>`;
							}
						} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Bonds') {
							for (let ind = 0; ind < singleData.tableHead.length; ind++) {
								const element = singleData.tableHead[ind];
								if (ind === 0) html += `<th style="text-align: left; padding-left: 2.5%;width: 37%;">${element}</th>`;
								else if (ind === 2) html += `<th style="text-align: right;width: 9%;">${element}</th>`;
								else if (ind == singleData.tableHead.length - 1) html += `<th style="text-align: right;padding-right: 2.5%;width: 18%;">${element}</th>`;
								else html += `<th style="text-align: right; padding-left: 2%;width: 18%;">${element}</th>`;
							}
						} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Fixed Deposit') {
							for (let ind = 0; ind < singleData.tableHead.length; ind++) {
								const element = singleData.tableHead[ind];
								if (ind === 0) html += `<th style="text-align: left; padding-left: 2.5%;width: 30%;">${element}</th>`;
								else if (ind === 4) html += `<th style="text-align: right;width: 6%;">${element}</th>`;
								else if (ind == singleData.tableHead.length - 1) html += `<th style="text-align: right;padding-right: 2.5%;width: 16%;">${element}</th>`;
								else html += `<th style="text-align: right; padding-left: 2%;width: 16%;">${element}</th>`;
							}
						} else {
							for (let ind = 0; ind < singleData.tableHead.length; ind++) {
								const element = singleData.tableHead[ind];
								if (ind === 0) html += `<th style="text-align: left; padding-left: 2.5%;width: 25%;">${element}</th>`;
								else if (ind == singleData.tableHead.length - 1) html += `<th style="text-align: right;padding-right: 2.5%;width: 15%;">${element}</th>`;
								else html += `<th style="text-align: right; padding-left: 2%;width: 15%;">${element}</th>`;
							}
						}

						html += `</tr></thead><tbody>`;
						let counter = 0;
						let dataArray: any;

						if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Mutual Funds') {
							let dataBind = lodash.groupBy(singleData.totalData, "scheme_category");
							let filerTemp = lodash.map(dataBind, arraygroup => lodash.groupBy(arraygroup, obj =>
								obj.scheme_category));

							let filterData: any = [];

							filerTemp.forEach(element => {
								let valuesArray: any = Object.values(element);
								valuesArray[0].forEach((element2: any) => {
									filterData.push(element2)
								});
							});
							dataArray = filterData
						} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Stocks') {
							let dataBind = lodash.groupBy(singleData.totalData, "SectorName");

							let filerTemp = lodash.map(dataBind, arraygroup => lodash.groupBy(arraygroup, obj =>
								obj.SectorName));
							let unlistedFilterData: any = [];
							let unlistedFilterExtraData: any = [];
							// let listedFilterData = [];			

							filerTemp.forEach(element => {
								let valuesArray: any = Object.values(element);

								valuesArray[0].forEach((element2: any) => {
									// unlistedFilterData.push(element2);
									if (element2.INSTRUMENTNAME != "Total" && element2.SectorName != '') {
										unlistedFilterData.push(element2);
										// unlistedFilterData = unlistedFilterData.reverse();
									} else {
										unlistedFilterExtraData.push(element2);
										// unlistedFilterData.push(element2);
									}
								});
							});
							dataArray = unlistedFilterData.concat(unlistedFilterExtraData);
							// dataArray = unlistedFilterData;
						} else {
							dataArray = singleData.totalData
						}

						if ((singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Mutual Funds') || (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Stocks')) {
							this.itemsPerPage = 5;
						} else {
							this.itemsPerPage = 7;
						}

						const startIndex = tableIndex * this.itemsPerPage;
						const endIndex = startIndex + this.itemsPerPage;

						let tableData = dataArray.slice(startIndex, endIndex);

						//for (const record of this.getTableData(tableIndex, singleData.totalData)) {
						for (let i = 0; i < tableData.length; i++) {
							counter++;
							let record = tableData[i];
							// console.log(counter, 'counter', singleData.totalData.length, 'legnth', tableIndex, 'table index');
							let rowColorCode;
							let profitNLossColor;
							let netProfitNLossColor;
							let style;
							((counter % 2 == 0) ? rowColorCode = '#F0F0F0' : rowColorCode = '#fff');

							/* if(tableIndex > 0) {
								var totalLength = counter + 
							} else {
								counter === singleData.totalData.length ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: 'Inter', sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = 'color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;'
							} */

							if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Stocks') {
								record.INSTRUMENTNAME === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`

								let nameOfSector = tableData[0].SectorName;

								if (record.INSTRUMENTNAME != "Total") {
									if (record.Unlisted_Delisted === '0') {
										if (i == 0) {
											html += `<tr style="background-color: #F5F4FF;"><td style="color: #000;font-family: 'Inter', sans-serif;font-size: 10px;font-style: normal;font-weight: 700;line-height: normal;text-align: left; padding: 4px 2.5%; "colspan="9">${nameOfSector ? nameOfSector : 'Others'}</td></tr>`;
										}

										if (i - 1 < tableData.length && nameOfSector != tableData[i].SectorName &&
											tableData[i].SectorName != tableData[i - 1].SectorName) {
											html += `<tr style="background-color: #F5F4FF;"><td style="color: #000;font-family: 'Inter', sans-serif;font-size: 10px;font-style: normal;font-weight: 700;line-height: normal;text-align: left; padding: 4px 2.5%; "colspan="9">${record.SectorName ? record.SectorName : 'Others'}</td></tr>`;
										}

									} else {
										// html += `<tr style="background-color: #F5F4FF;"><td style="color: #000;font-family: 'Inter', sans-serif;font-size: 10px;font-style: normal;font-weight: 700;line-height: normal;text-align: left; padding: 4px 2.5%; "colspan="9">Unlisted/Delisted</td></tr>`;

										if (i == 0) {
											html += `<tr style="background-color: #F5F4FF;"><td style="color: #000;font-family: 'Inter', sans-serif;font-size: 10px;font-style: normal;font-weight: 700;line-height: normal;text-align: left; padding: 4px 2.5%; "colspan="9">Unlisted/Delisted</td></tr>`;
										}

										if (i - 1 < tableData.length && nameOfSector != tableData[i].SectorName &&
											tableData[i].SectorName != tableData[i - 1].SectorName) {
											html += `<tr style="background-color: #F5F4FF;"><td style="color: #000;font-family: 'Inter', sans-serif;font-size: 10px;font-style: normal;font-weight: 700;line-height: normal;text-align: left; padding: 4px 2.5%; "colspan="9">Unlisted/Delisted</td></tr>`;
										}
									}
								}

								html += `<tr style="${style}">`;

								(record.UNREALIEDGL > 0 ? netProfitNLossColor = '#009E3B' : (record.UNREALIEDGL < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));
								(record.UNRLGAINLOSSPER > 0 ? profitNLossColor = '#009E3B' : (record.UNRLGAINLOSSPER < 0 ? profitNLossColor = '#DF514C' : profitNLossColor = '#000000'));

								html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.INSTRUMENTNAME}</td>`;
								html += `<td style="text-align: right;">${record.QUANTITY == '--' ? '--' : this.numberNoFormat(parseInt(record.QUANTITY))}</td>`;
								html += `<td style="text-align: right;">${record.AVGPURCHASEPRICE == '-' ? '--' : record.AVGPURCHASEPRICE == 0 ? '--' : this.numberFormat(record.AVGPURCHASEPRICE)}</td>`;
								html += `<td style="text-align: right;">${this.numberNoFormat(record.HOLDINGCOST)}</td>`;
								html += `<td style="text-align: right;">${record.PreviousClosingPrice == '-' ? '--' : record.PreviousClosingPrice == 0 ? '--' : this.numberFormat(record.PreviousClosingPrice)}</td>`;
								html += `<td style="text-align: right;">${this.numberNoFormat(record.MARKETVALUE)}</td>`;
								// html += `<td style="text-align: right;">${this.numberNoFormat(record.DIVIDENT)}</td>`;
								html += `<td style="text-align: right; padding-right: 4px; color: ${record['Get_three_year_change'] > 0 ? '#009E3B' : (record['Get_three_year_change'] < 0 ? '#DF514C' : '#000000')}">${record['Get_three_year_change'] < 0 ? '(' : ''}${this.numberFormat(record['Get_three_year_change'])}${record['Get_three_year_change'] < 0 ? ')' : ''}</td>`;
								html += `<td style="text-align: right;color: ${netProfitNLossColor}">${record.UNREALIEDGL < 0 ? '(' : ''}${this.numberNoFormat(record.UNREALIEDGL)}${record.UNREALIEDGL < 0 ? ')' : ''}</td>`;
								html += `<td style="text-align: right; padding-right: 2.5%; color: ${profitNLossColor}">${record.UNRLGAINLOSSPER < 0 ? '(' : ''}${this.numberFormat(record.UNRLGAINLOSSPER)}${record.UNRLGAINLOSSPER < 0 ? ')' : ''}</td>`;
							} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Mutual Funds') {
								record.Scheme_Name === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`

								let titleOfCategory = tableData[0].scheme_category;
								if (i == 0) {
									html += `<tr style="background-color: #F5F4FF;"><td style="color: #000;font-family: 'Inter', sans-serif;font-size: 10px;font-style: normal;font-weight: 700;line-height: normal;text-align: left; padding: 4px 2.5%; "colspan="9">${titleOfCategory}</td></tr>`;
								}

								if (i - 1 < tableData.length && titleOfCategory != tableData[i].scheme_category &&
									tableData[i].scheme_category != tableData[i - 1].scheme_category) {
									html += `<tr style="background-color: #F5F4FF;"><td style="color: #000;font-family: 'Inter', sans-serif;font-size: 10px;font-style: normal;font-weight: 700;line-height: normal;text-align: left; padding: 4px 2.5%; "colspan="9">${record.scheme_category}</td></tr>`;
								}

								html += `<tr style="${style}">`;
								(record.Unrealized_Profit > 0 ? netProfitNLossColor = '#009E3B' : (record.Unrealized_Profit < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));

								html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.Scheme_Name}</td>`
								// html += `<td style="text-align: center;">${record.scheme_category}</td>`;
								html += `<td style="text-align: right;">${record.Present_Units == '-' ? '--' : record.Present_Units == 0 ? '--' : this.numberFormat(+(record.Present_Units))}</td>`;
								html += `<td style="text-align: right;">${this.numberNoFormat(record.Current_Investment)}</td>`;
								html += `<td style="text-align: right;">${this.numberNoFormat(record.Present_Value)}</td>`;
								html += `<td style="text-align: right;">${record.Present_NAV == '-' ? '--' : this.numberFormat(record.Present_NAV)}</td>`;
								html += `<td style="text-align: right; color: ${record['XIRR'] > 0 ? '#009E3B' : (record['XIRR'] < 0 ? '#DF514C' : '#000000')}">${record['XIRR'] < 0 ? '(' : ''}${record.XIRR == '-' ? '--' : this.numberFormat(record['XIRR'])}${record['XIRR'] < 0 ? ')' : ''}</td>`;
								html += `<td style="text-align: right;color: ${netProfitNLossColor}">${record.Unrealized_Profit < 0 ? '(' : ''}${this.numberNoFormat(record.Unrealized_Profit)}${record.Unrealized_Profit < 0 ? ')' : ''}</td>`;
								html += `<td style="text-align: right; padding-right: 2.5%; color: ${record['pnlValue'] > 0 ? '#009E3B' : (record['pnlValue'] < 0 ? '#DF514C' : '#000000')}">${record['pnlValue'] < 0 ? '(' : ''}${this.numberFormat(record['pnlValue'])}${record['pnlValue'] < 0 ? ')' : ''}</td>`;
							} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Bonds') {
								record.BondCompany === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`
								html += `<tr style="${style}">`;
								// (record.Unrealized_Profit > 0 ? netProfitNLossColor = '#009E3B' : (record.Unrealized_Profit < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));

								html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.BondCompany}</td>`
								// html += `<td style="text-align: right;">${record.Tenor ? record.Tenor : '--'}</td>`;
								// html += `<td style="text-align: right;">${record.BondBookingDate ? moment(record.BondBookingDate).format('DD/MM/YYYY') : '--'}</td>`;
								html += `<td style="text-align: right;">${this.numberNoFormat(record.BondAmount)}</td>`;
								html += `<td style="text-align: right;">${record.Rateofinterest ? this.formatDecimal(record.Rateofinterest) : '--'}</td>`;
								html += `<td style="text-align: right;">${record.BondMaturityDate ? moment(record.BondMaturityDate).format('DD/MM/YYYY') : '--'}</td>`;
								html += `<td style="text-align: right;padding-right: 2.5%;">${record.ISIN ? record.ISIN : '--'}</td>`;

								// html += `<td style="text-align: right;color: ${netProfitNLossColor}">${record.Unrealized_Profit < 0 ? '(' : ''}${this.numberFormat(record.Unrealized_Profit)}${record.Unrealized_Profit < 0 ? ')' : ''}</td>`;
								// html += `<td style="text-align: right; padding-right: 2.5%; color: ${record['pnlValue'] > 0 ? '#009E3B' : (record['pnlValue'] < 0 ? '#DF514C' : '#000000')}">${record['pnlValue'] < 0 ? '(' : ''}${this.numberFormat(record['pnlValue'])}${record['pnlValue'] < 0 ? ')' : ''}</td>`;
							} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Fixed Deposit') {
								record.FDCompany === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`
								html += `<tr style="${style}">`;
								// (record.Unrealized_Profit > 0 ? netProfitNLossColor = '#009E3B' : (record.Unrealized_Profit < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));

								html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.FDCompany}</td>`
								html += `<td style="text-align: right;">${record.Tenor ? record.Tenor : '--'}</td>`;
								html += `<td style="text-align: right;">${record.FDBookingDate ? moment(record.FDBookingDate).format('DD/MM/YYYY') : '--'}</td>`;
								html += `<td style="text-align: right;">${this.numberNoFormat(record.FDBookingAmount)}</td>`;
								html += `<td style="text-align: right;">${record.RateOfInterest ? record.RateOfInterest : '--'}</td>`;
								html += `<td style="text-align: right;padding-right: 2.5%;">${record.FDMaturityDate ? moment(record.FDMaturityDate).format('DD/MM/YYYY') : '--'}</td>`;

								// html += `<td style="text-align: right;">${record.Present_NAV == '-' ? '--' : this.numberFormat(record.Present_NAV)}</td>`;
								// html += `<td style="text-align: right;color: ${netProfitNLossColor}">${record.Unrealized_Profit < 0 ? '(' : ''}${this.numberFormat(record.Unrealized_Profit)}${record.Unrealized_Profit < 0 ? ')' : ''}</td>`;
								// html += `<td style="text-align: right; padding-right: 2.5%; color: ${record['pnlValue'] > 0 ? '#009E3B' : (record['pnlValue'] < 0 ? '#DF514C' : '#000000')}">${record['pnlValue'] < 0 ? '(' : ''}${this.numberFormat(record['pnlValue'])}${record['pnlValue'] < 0 ? ')' : ''}</td>`;
							} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'AIF') {
								record.SCHEMENAME === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`
								html += `<tr style="${style}">`;
								(record.netpl > 0 ? netProfitNLossColor = '#009E3B' : (record.netpl < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));

								html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.SCHEMENAME}</td>`
								html += `<td style="text-align: right;">${record.AUMDATE ? record.AUMDATE : '--'}</td>`;
								html += `<td style="text-align: right;">${this.numberNoFormat(record.NETINVESTMENT)}</td>`;
								html += `<td style="text-align: right;">${this.numberNoFormat(record.CRRENTVALUE)}</td>`;
								html += `<td style="text-align: right;">${record.COMMITMENTAMOUNT}</td>`;

								html += `<td style="text-align: right;color: ${netProfitNLossColor}">${record.netpl < 0 ? '(' : ''}${this.numberNoFormat(record.netpl)}${record.netpl < 0 ? ')' : ''}</td>`;
								html += `<td style="text-align: right; padding-right: 2.5%; color: ${record['plPer'] == '--' ? '#000000' : record['plPer'] > 0 ? '#009E3B' : (record['plPer'] < 0 ? '#DF514C' : '#000000')}">${record['plPer'] < 0 ? '(' : ''}${record['plPer'] == '--' ? '--' : this.numberFormat(record['plPer'])}${record['plPer'] < 0 ? ')' : ''}</td>`;
							} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'PMS') {
								record.SCHEMENAME === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`
								html += `<tr style="${style}">`;
								(record.netpl > 0 ? netProfitNLossColor = '#009E3B' : (record.netpl < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));

								html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.SCHEMENAME}</td>`
								html += `<td style="text-align: right;">${record.AUMDATE ? record.AUMDATE : '--'}</td>`;
								html += `<td style="text-align: right;">${this.numberNoFormat(record.NETINVESTMENT)}</td>`;
								html += `<td style="text-align: right;">${this.numberNoFormat(record.CRRENTVALUE)}</td>`;

								html += `<td style="text-align: right;color: ${netProfitNLossColor}">${record.netpl < 0 ? '(' : ''}${this.numberNoFormat(record.netpl)}${record.netpl < 0 ? ')' : ''}</td>`;
								html += `<td style="text-align: right; padding-right: 2.5%; color: ${record['plPer'] > 0 ? '#009E3B' : (record['plPer'] < 0 ? '#DF514C' : '#000000')}">${record['plPer'] < 0 ? '(' : ''}${this.numberFormat(record['plPer'])}${record['plPer'] < 0 ? ')' : ''}</td>`;
							}

							html += `</tr>`;
						}
						html += `</tbody></table></div>
			</div>
				<div style="position: absolute;bottom: 2%;left: 2%;clear:both"><span style="color: #817A9A;
						text-align: center;
						font-family: 'Inter', sans-serif;
						font-size: 14px;
						font-style: normal;
						font-weight: 700;
						line-height: normal;">PORTFOLIO 360</span>&nbsp;
					<span style="color: #84859E;
							font-family: 'Inter', sans-serif;
							font-size: 10px;
							font-style: normal;
							font-weight: 400;
							line-height: normal;">${moment(new Date()).format('MMM DD, YYYY')}</span>	
						
				</div>
				<div style="position: absolute;bottom: 2%;right: 2%;clear:both"><span style="color: #817A9A;
				text-align: center;
				font-family: 'Inter', sans-serif;
				font-size: 12px;
				font-style: normal;
				font-weight: 400;
				line-height: normal;">Private and Confidential | ${JSON.stringify(pageNo).length === 1 ? `0${pageNo}` : pageNo}</span>
		</div>
				
			</div></page>`;
					}
				}
			}
			realizedPLReport(pageNo);

		}
		else if (itemChecked.includes('portfolio') && itemChecked.includes('product')) {
			html += page1;
			html += page2;
			if (this.productChartData.length > 0) {
				html += page3;
			}
			let pageNo = 2;
			for (const singleData of this.data) {
			
				for (const tableIndex of this.getTableIndexes(singleData.totalData, singleData.subTitle)) {
					pageNo++;
					html += `<page size="A4" layout="landscape" orientation="landscape">`;
					html += `<div class="page_${tableIndex}" style="position: relative; overflow: hidden; margin: 0px 0px 0px 0px; padding: 0px; border: none; width: 842px">`;
					html += `<div style="height: 595px;">`;
					html += `<img style="position: absolute; top: 0; left: 0; z-index: 1;" src="../assets/imgs/vector-heading-table.png" alt="Header Background">`;
					html += `<img style="position: absolute; top: 12px; left: 20px; z-index: 3;" src="../assets/imgs/Logo.png" alt="Logo">`;
					html += `<div style="position: absolute; top: 15px; right: 20px; z-index: 3; color: #6C638C; text-align: right; font-family: 'Inter', sans-serif; font-size: 18px; font-style: normal; font-weight: 600; line-height: normal;">${this.clientName}</div>`;
					html += `<div style="position: relative; top: 90px; left: 21px;">`;
					html += `<span style="color: #4733CB; font-family: 'Inter', sans-serif; font-size: 24px; font-style: normal; font-weight: 600; line-height: normal;">${singleData.pageTitle}</span><br>`;
					html += `<img src="../assets/imgs/RectangleBig.png">&nbsp;<img src="../assets/imgs/RectangleSmall.png">`;
					html += `</div>`;
					if (singleData.subTitle !== null) {
						html += `<div style="position: relative; top: 110px; left: 21px;">`;
						html += `<img src="../assets/imgs/verticalLineRed.png">`;
						html += `<span style="color: #000000; font-style: normal; margin-top: 10px; text-transform: uppercase; font-family: 'Inter', sans-serif; font-size: 18px; margin-left: 5px; line-height: normal;">${singleData.subTitle}</span><br>`;
						html += `</div>`;
					}
					html += `<div style="position: relative; top: 120px; left: 21px;">`;
					// html += `<h1>Table ${tableIndex + 1}</h1>`;
					html += `<table style="width: 95%; table-layout: fixed; border-collapse: collapse;letter-spacing:0.01rem;"><thead><tr style="color: #615F78;
				font-family: 'Inter', sans-serif;
				font-size: 12px;
				font-style: normal;
				font-weight: 500;
				line-height: normal;background: #DBDAF3; height: 40px;">`;

					/* for (const tableHeading of singleData.tableHead) {
						console.log(tableIndex , 'index')
						html += `<th>${tableHeading}</th>`;
					} */

					if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Mutual Funds') {
						for (let ind = 0; ind < singleData.tableHead.length; ind++) {
							const element = singleData.tableHead[ind];
							if (ind === 0) html += `<th style="text-align: left; padding-left: 2.5%;width: 35%;">${element}</th>`;
							//else if (ind === 1) html += `<th style="text-align: center;width: 17%;">${element}</th>`;
							else if (ind === 4) html += `<th style="text-align: right;width: 9%;">${element}</th>`;
							else if (ind == singleData.tableHead.length - 1) html += `<th style="text-align: right;padding-right: 2.5%;width: 11%;">${element}</th>`;
							else html += `<th style="text-align: right; padding-left: 2%;width: 11%;">${element}</th>`;
						}
					} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Stocks') {
						for (let ind = 0; ind < singleData.tableHead.length; ind++) {
							const element = singleData.tableHead[ind];
							if (ind === 0) html += `<th style="text-align: left; padding-left: 2.5%;width: 20%;">${element}</th>`;
							else if (ind === 3 || ind === 5) html += `<th style="text-align: right;width: 13%;">${element}</th>`;
							else if (ind === 4 || ind === 1) html += `<th style="text-align: right;width: 8%;">${element}</th>`;
							else if (ind == singleData.tableHead.length - 1) html += `<th style="text-align: right;padding-right: 2.5%;width: 10%;">${element}</th>`;
							else html += `<th style="text-align: right; padding-left: 2%;width: 10%;">${element}</th>`;
						}
					} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Bonds') {
						for (let ind = 0; ind < singleData.tableHead.length; ind++) {
							const element = singleData.tableHead[ind];
							if (ind === 0) html += `<th style="text-align: left; padding-left: 2.5%;width: 37%;">${element}</th>`;
							else if (ind === 2) html += `<th style="text-align: right;width: 9%;">${element}</th>`;
							else if (ind == singleData.tableHead.length - 1) html += `<th style="text-align: right;padding-right: 2.5%;width: 18%;">${element}</th>`;
							else html += `<th style="text-align: right; padding-left: 2%;width: 18%;">${element}</th>`;
						}
					} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Fixed Deposit') {
						for (let ind = 0; ind < singleData.tableHead.length; ind++) {
							const element = singleData.tableHead[ind];
							if (ind === 0) html += `<th style="text-align: left; padding-left: 2.5%;width: 30%;">${element}</th>`;
							else if (ind === 4) html += `<th style="text-align: right;width: 6%;">${element}</th>`;
							else if (ind == singleData.tableHead.length - 1) html += `<th style="text-align: right;padding-right: 2.5%;width: 16%;">${element}</th>`;
							else html += `<th style="text-align: right; padding-left: 2%;width: 16%;">${element}</th>`;
						}
					}else if (singleData.pageTitle === 'Product Wise Holdings' && (singleData.subTitle == 'AIF' || singleData.subTitle == 'PMS')) {
						for (let ind = 0; ind < singleData.tableHead.length; ind++) {
							const element = singleData.tableHead[ind];
							if (ind === 0) html += `<th style="text-align: left; padding-left: 2.5%;width: 29%;">${element}</th>`;
							else if (ind == singleData.tableHead.length - 1) html += `<th style="text-align: right;padding-right: 2%;width: 16%;">${element}</th>`;
							else html += `<th style="text-align: right; padding-left: 2%;width: 16%;">${element}</th>`;
						}
					}  
					else {
						for (let ind = 0; ind < singleData.tableHead.length; ind++) {
							const element = singleData.tableHead[ind];
							if (ind === 0) html += `<th style="text-align: left; padding-left: 2.5%;width: 25%;">${element}</th>`;
							else if (ind == singleData.tableHead.length - 1) html += `<th style="text-align: right;padding-right: 2.5%;width: 15%;">${element}</th>`;
							else html += `<th style="text-align: right; padding-left: 2%;width: 15%;">${element}</th>`;
						}
					}

					html += `</tr></thead><tbody>`;
					let counter = 0;
					let dataArray: any;

					if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Mutual Funds') {
						let dataBind = lodash.groupBy(singleData.totalData, "scheme_category");
						let filerTemp = lodash.map(dataBind, arraygroup => lodash.groupBy(arraygroup, obj =>
							obj.scheme_category));

						let filterData: any = [];

						filerTemp.forEach(element => {
							let valuesArray: any = Object.values(element);
							valuesArray[0].forEach((element2: any) => {
								filterData.push(element2)
							});
						});
						dataArray = filterData
					} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Stocks') {
						let dataBind = lodash.groupBy(singleData.totalData, "SectorName");

						let filerTemp = lodash.map(dataBind, arraygroup => lodash.groupBy(arraygroup, obj =>
							obj.SectorName));
						let unlistedFilterData: any = [];
						let unlistedFilterExtraData: any = [];
						// let listedFilterData = [];			

						filerTemp.forEach(element => {
							let valuesArray: any = Object.values(element);

							valuesArray[0].forEach((element2: any) => {
								// unlistedFilterData.push(element2);
								if (element2.INSTRUMENTNAME != "Total" && element2.SectorName != '') {
									unlistedFilterData.push(element2);
									// unlistedFilterData = unlistedFilterData.reverse();
								} else {
									unlistedFilterExtraData.push(element2);
									// unlistedFilterData.push(element2);
								}
							});
						});
						dataArray = unlistedFilterData.concat(unlistedFilterExtraData);
						// dataArray = unlistedFilterData;
					} else {
						dataArray = singleData.totalData
					}

					if ((singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Mutual Funds') || (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Stocks')) {
						this.itemsPerPage = 5;
					} else {
						this.itemsPerPage = 7;
					}

					const startIndex = tableIndex * this.itemsPerPage;
					const endIndex = startIndex + this.itemsPerPage;

					let tableData = dataArray.slice(startIndex, endIndex);

					//for (const record of this.getTableData(tableIndex, singleData.totalData)) {
					for (let i = 0; i < tableData.length; i++) {
						counter++;
						let record = tableData[i];
						// console.log(counter, 'counter', singleData.totalData.length, 'legnth', tableIndex, 'table index');
						let rowColorCode;
						let profitNLossColor;
						let netProfitNLossColor;
						let style;
						((counter % 2 == 0) ? rowColorCode = '#F0F0F0' : rowColorCode = '#fff');

						/* if(tableIndex > 0) {
							var totalLength = counter + 
						} else {
							counter === singleData.totalData.length ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: 'Inter', sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = 'color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;'
						} */

						if (singleData.pageTitle === 'Family Distribution' && singleData.subTitle === null) {
							record.CLIENTCODE === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`
							html += `<tr style="${style}">`;

							(record.UNREALISEDPLVAL > 0 ? netProfitNLossColor = '#009E3B' : (record.UNREALISEDPLVAL < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));
							(record.UNREALISEDPLPER > 0 ? profitNLossColor = '#009E3B' : (record.UNREALISEDPLPER < 0 ? profitNLossColor = '#DF514C' : profitNLossColor = '#000000'));

							html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.CLIENTCODE}</td>`;
							html += `<td style="text-align: right;">${this.numberFormat(record.CURRENTVALUE)}</td>`;
							html += `<td style="text-align: right;">${this.numberFormat(record.HLDPERCENTAGE)}</td>`;
							html += `<td style="text-align: right;color: ${netProfitNLossColor}"">${record.UNREALISEDPLVAL < 0 ? '(' : ''}${this.numberFormat(record.UNREALISEDPLVAL)}${record.UNREALISEDPLVAL < 0 ? ')' : ''}</td>`;
							html += `<td style="text-align: right; padding-right: 2.5%; color: ${profitNLossColor}"> ${record.UNREALISEDPLPER < 0 ? '(' : ''}${this.numberFormat(record.UNREALISEDPLPER)}${record.UNREALISEDPLPER < 0 ? ')' : ''}</td>`;
						} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Stocks') {
							record.INSTRUMENTNAME === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`

							let nameOfSector = tableData[0].SectorName;

							if (record.INSTRUMENTNAME != "Total") {
								if (record.Unlisted_Delisted === '0') {
									if (i == 0) {
										html += `<tr style="background-color: #F5F4FF;"><td style="color: #000;font-family: 'Inter', sans-serif;font-size: 10px;font-style: normal;font-weight: 700;line-height: normal;text-align: left; padding: 4px 2.5%; "colspan="9">${nameOfSector ? nameOfSector : 'Others'}</td></tr>`;
									}

									if (i - 1 < tableData.length && nameOfSector != tableData[i].SectorName &&
										tableData[i].SectorName != tableData[i - 1].SectorName) {
										html += `<tr style="background-color: #F5F4FF;"><td style="color: #000;font-family: 'Inter', sans-serif;font-size: 10px;font-style: normal;font-weight: 700;line-height: normal;text-align: left; padding: 4px 2.5%; "colspan="9">${record.SectorName ? record.SectorName : 'Others'}</td></tr>`;
									}

								} else {
									// html += `<tr style="background-color: #F5F4FF;"><td style="color: #000;font-family: 'Inter', sans-serif;font-size: 10px;font-style: normal;font-weight: 700;line-height: normal;text-align: left; padding: 4px 2.5%; "colspan="9">Unlisted/Delisted</td></tr>`;

									if (i == 0) {
										html += `<tr style="background-color: #F5F4FF;"><td style="color: #000;font-family: 'Inter', sans-serif;font-size: 10px;font-style: normal;font-weight: 700;line-height: normal;text-align: left; padding: 4px 2.5%; "colspan="9">Unlisted/Delisted</td></tr>`;
									}

									if (i - 1 < tableData.length && nameOfSector != tableData[i].SectorName &&
										tableData[i].SectorName != tableData[i - 1].SectorName) {
										html += `<tr style="background-color: #F5F4FF;"><td style="color: #000;font-family: 'Inter', sans-serif;font-size: 10px;font-style: normal;font-weight: 700;line-height: normal;text-align: left; padding: 4px 2.5%; "colspan="9">Unlisted/Delisted</td></tr>`;
									}
								}
							}

							html += `<tr style="${style}">`;

							(record.UNREALIEDGL > 0 ? netProfitNLossColor = '#009E3B' : (record.UNREALIEDGL < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));
							(record.UNRLGAINLOSSPER > 0 ? profitNLossColor = '#009E3B' : (record.UNRLGAINLOSSPER < 0 ? profitNLossColor = '#DF514C' : profitNLossColor = '#000000'));

							html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.INSTRUMENTNAME}</td>`;
							html += `<td style="text-align: right;">${record.QUANTITY == '--' ? '--' : this.numberNoFormat(parseInt(record.QUANTITY))}</td>`;
							html += `<td style="text-align: right;">${record.AVGPURCHASEPRICE == '-' ? '--' : record.AVGPURCHASEPRICE == 0 ? '--' : this.numberFormat(record.AVGPURCHASEPRICE)}</td>`;
							html += `<td style="text-align: right;">${this.numberNoFormat(record.HOLDINGCOST)}</td>`;
							html += `<td style="text-align: right;">${record.PreviousClosingPrice == '-' ? '--' : record.PreviousClosingPrice == 0 ? '--' : this.numberFormat(record.PreviousClosingPrice)}</td>`;
							html += `<td style="text-align: right;">${this.numberNoFormat(record.MARKETVALUE)}</td>`;
							// html += `<td style="text-align: right;">${this.numberNoFormat(record.DIVIDENT)}</td>`;
							html += `<td style="text-align: right; padding-right: 4px; color: ${record['Get_three_year_change'] > 0 ? '#009E3B' : (record['Get_three_year_change'] < 0 ? '#DF514C' : '#000000')}">${record['Get_three_year_change'] < 0 ? '(' : ''}${this.numberFormat(record['Get_three_year_change'])}${record['Get_three_year_change'] < 0 ? ')' : ''}</td>`;
							html += `<td style="text-align: right;color: ${netProfitNLossColor}">${record.UNREALIEDGL < 0 ? '(' : ''}${this.numberNoFormat(record.UNREALIEDGL)}${record.UNREALIEDGL < 0 ? ')' : ''}</td>`;
							html += `<td style="text-align: right; padding-right: 2.5%; color: ${profitNLossColor}">${record.UNRLGAINLOSSPER < 0 ? '(' : ''}${this.numberFormat(record.UNRLGAINLOSSPER)}${record.UNRLGAINLOSSPER < 0 ? ')' : ''}</td>`;
						} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Mutual Funds') {
							record.Scheme_Name === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`

							let titleOfCategory = tableData[0].scheme_category;
							if (i == 0) {
								html += `<tr style="background-color: #F5F4FF;"><td style="color: #000;font-family: 'Inter', sans-serif;font-size: 10px;font-style: normal;font-weight: 700;line-height: normal;text-align: left; padding: 4px 2.5%; "colspan="9">${titleOfCategory}</td></tr>`;
							}

							if (i - 1 < tableData.length && titleOfCategory != tableData[i].scheme_category &&
								tableData[i].scheme_category != tableData[i - 1].scheme_category) {
								html += `<tr style="background-color: #F5F4FF;"><td style="color: #000;font-family: 'Inter', sans-serif;font-size: 10px;font-style: normal;font-weight: 700;line-height: normal;text-align: left; padding: 4px 2.5%; "colspan="9">${record.scheme_category}</td></tr>`;
							}

							html += `<tr style="${style}">`;
							(record.Unrealized_Profit > 0 ? netProfitNLossColor = '#009E3B' : (record.Unrealized_Profit < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));

							html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.Scheme_Name}</td>`
							// html += `<td style="text-align: center;">${record.scheme_category}</td>`;
							html += `<td style="text-align: right;">${record.Present_Units == '-' ? '--' : record.Present_Units == 0 ? '--' : this.numberFormat(+(record.Present_Units))}</td>`;
							html += `<td style="text-align: right;">${this.numberNoFormat(record.Current_Investment)}</td>`;
							html += `<td style="text-align: right;">${this.numberNoFormat(record.Present_Value)}</td>`;
							html += `<td style="text-align: right;">${record.Present_NAV == '-' ? '--' : this.numberFormat(record.Present_NAV)}</td>`;
							html += `<td style="text-align: right; color: ${record['XIRR'] > 0 ? '#009E3B' : (record['XIRR'] < 0 ? '#DF514C' : '#000000')}">${record['XIRR'] < 0 ? '(' : ''}${record.XIRR == '-' ? '--' : this.numberFormat(record['XIRR'])}${record['XIRR'] < 0 ? ')' : ''}</td>`;
							html += `<td style="text-align: right;color: ${netProfitNLossColor}">${record.Unrealized_Profit < 0 ? '(' : ''}${this.numberNoFormat(record.Unrealized_Profit)}${record.Unrealized_Profit < 0 ? ')' : ''}</td>`;
							html += `<td style="text-align: right; padding-right: 2.5%; color: ${record['pnlValue'] > 0 ? '#009E3B' : (record['pnlValue'] < 0 ? '#DF514C' : '#000000')}">${record['pnlValue'] < 0 ? '(' : ''}${this.numberFormat(record['pnlValue'])}${record['pnlValue'] < 0 ? ')' : ''}</td>`;
						} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Bonds') {
							record.BondCompany === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`
							html += `<tr style="${style}">`;
							// (record.Unrealized_Profit > 0 ? netProfitNLossColor = '#009E3B' : (record.Unrealized_Profit < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));

							html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.BondCompany}</td>`
							// html += `<td style="text-align: right;">${record.Tenor ? record.Tenor : '--'}</td>`;
							// html += `<td style="text-align: right;">${record.BondBookingDate ? moment(record.BondBookingDate).format('DD/MM/YYYY') : '--'}</td>`;
							html += `<td style="text-align: right;">${this.numberNoFormat(record.BondAmount)}</td>`;
							html += `<td style="text-align: right;">${record.Rateofinterest ? this.formatDecimal(record.Rateofinterest) : '--'}</td>`;
							html += `<td style="text-align: right;">${record.BondMaturityDate ? moment(record.BondMaturityDate).format('DD/MM/YYYY') : '--'}</td>`;
							html += `<td style="text-align: right;padding-right: 2.5%;">${record.ISIN ? record.ISIN : '--'}</td>`;

							// html += `<td style="text-align: right;color: ${netProfitNLossColor}">${record.Unrealized_Profit < 0 ? '(' : ''}${this.numberFormat(record.Unrealized_Profit)}${record.Unrealized_Profit < 0 ? ')' : ''}</td>`;
							// html += `<td style="text-align: right; padding-right: 2.5%; color: ${record['pnlValue'] > 0 ? '#009E3B' : (record['pnlValue'] < 0 ? '#DF514C' : '#000000')}">${record['pnlValue'] < 0 ? '(' : ''}${this.numberFormat(record['pnlValue'])}${record['pnlValue'] < 0 ? ')' : ''}</td>`;
						} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Fixed Deposit') {
							record.FDCompany === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`
							html += `<tr style="${style}">`;
							// (record.Unrealized_Profit > 0 ? netProfitNLossColor = '#009E3B' : (record.Unrealized_Profit < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));

							html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.FDCompany}</td>`
							html += `<td style="text-align: right;">${record.Tenor ? record.Tenor : '--'}</td>`;
							html += `<td style="text-align: right;">${record.FDBookingDate ? moment(record.FDBookingDate).format('DD/MM/YYYY') : '--'}</td>`;
							html += `<td style="text-align: right;">${this.numberNoFormat(record.FDBookingAmount)}</td>`;
							html += `<td style="text-align: right;">${record.RateOfInterest ? record.RateOfInterest : '--'}</td>`;
							html += `<td style="text-align: right;padding-right: 2.5%;">${record.FDMaturityDate ? moment(record.FDMaturityDate).format('DD/MM/YYYY') : '--'}</td>`;

							// html += `<td style="text-align: right;">${record.Present_NAV == '-' ? '--' : this.numberFormat(record.Present_NAV)}</td>`;
							// html += `<td style="text-align: right;color: ${netProfitNLossColor}">${record.Unrealized_Profit < 0 ? '(' : ''}${this.numberFormat(record.Unrealized_Profit)}${record.Unrealized_Profit < 0 ? ')' : ''}</td>`;
							// html += `<td style="text-align: right; padding-right: 2.5%; color: ${record['pnlValue'] > 0 ? '#009E3B' : (record['pnlValue'] < 0 ? '#DF514C' : '#000000')}">${record['pnlValue'] < 0 ? '(' : ''}${this.numberFormat(record['pnlValue'])}${record['pnlValue'] < 0 ? ')' : ''}</td>`;
						} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'AIF') {
							record.SCHEMENAME === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`
							html += `<tr style="${style}">`;
							(record.netpl > 0 ? netProfitNLossColor = '#009E3B' : (record.netpl < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));

							html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.SCHEMENAME}</td>`
							html += `<td style="text-align: left;padding-left: 2.5%;">${record.AMCNAME ? record.AMCNAME : '--'}</td>`;
							html += `<td style="text-align: right;">${record.AUMDATE ? record.AUMDATE : '--'}</td>`;
							html += `<td style="text-align: right;">${this.numberNoFormat(record.NETINVESTMENT)}</td>`;
							html += `<td style="text-align: right;">${this.numberNoFormat(record.CRRENTVALUE)}</td>`;
							html += `<td style="text-align: right;">${record.COMMITMENTAMOUNT}</td>`;

							html += `<td style="text-align: right;color: ${netProfitNLossColor}">${record.netpl < 0 ? '(' : ''}${this.numberNoFormat(record.netpl)}${record.netpl < 0 ? ')' : ''}</td>`;
							html += `<td style="text-align: right; padding-right: 2.5%; color: ${record['plPer'] == '--' ? '#000000' : record['plPer'] > 0 ? '#009E3B' : (record['plPer'] < 0 ? '#DF514C' : '#000000')}">${record['plPer'] < 0 ? '(' : ''}${record['plPer'] == '--' ? '--' : this.numberFormat(record['plPer'])}${record['plPer'] < 0 ? ')' : ''}</td>`;
						} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'PMS') {
							record.SCHEMENAME === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`
							html += `<tr style="${style}">`;
							(record.netpl > 0 ? netProfitNLossColor = '#009E3B' : (record.netpl < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));

							html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.SCHEMENAME}</td>`
							html += `<td style="text-align: left;padding-left: 4.2%;">${record.AMCNAME ? record.AMCNAME : '--'}</td>`;
							html += `<td style="text-align: right;">${record.AUMDATE ? record.AUMDATE : '--'}</td>`;
							html += `<td style="text-align: right;">${this.numberNoFormat(record.NETINVESTMENT)}</td>`;
							html += `<td style="text-align: right;">${this.numberNoFormat(record.CRRENTVALUE)}</td>`;

							html += `<td style="text-align: right;color: ${netProfitNLossColor}">${record.netpl < 0 ? '(' : ''}${this.numberNoFormat(record.netpl)}${record.netpl < 0 ? ')' : ''}</td>`;
							html += `<td style="text-align: right; padding-right: 2.5%; color: ${record['plPer'] > 0 ? '#009E3B' : (record['plPer'] < 0 ? '#DF514C' : '#000000')}">${record['plPer'] < 0 ? '(' : ''}${this.numberFormat(record['plPer'])}${record['plPer'] < 0 ? ')' : ''}</td>`;
						}

						html += `</tr>`;
					}
					html += `</tbody></table></div>
		</div>
			<div style="position: absolute;bottom: 2%;left: 2%;clear:both"><span style="color: #817A9A;
					text-align: center;
					font-family: 'Inter', sans-serif;
					font-size: 14px;
					font-style: normal;
					font-weight: 700;
					line-height: normal;">PORTFOLIO 360</span>&nbsp;
				<span style="color: #84859E;
						font-family: 'Inter', sans-serif;
						font-size: 10px;
						font-style: normal;
						font-weight: 400;
						line-height: normal;">${moment(new Date()).format('MMM DD, YYYY')}</span>	
					
			</div>
			<div style="position: absolute;bottom: 2%;right: 2%;clear:both"><span style="color: #817A9A;
			text-align: center;
			font-family: 'Inter', sans-serif;
			font-size: 12px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;">Private and Confidential | ${JSON.stringify(pageNo).length === 1 ? `0${pageNo}` : pageNo}</span>
	</div>
			
		</div></page>`;
				}
			}
			if (this.data.every((item: any) => item.totalData.length === 0)) pageNo = 1;
			setDisclaimerPage(pageNo)
		}
		else if (itemChecked.includes('portfolio')) {
			html += page1;
			html += page2;
			if (this.productChartData.length > 0) {
				html += page3;
			}
			let pageNo = 2;
			for (const singleData of this.data) {
				if (singleData.pageTitle === 'Family Distribution') {
	
					for (const tableIndex of this.getTableIndexes(singleData.totalData)) {
						pageNo++;
						html += `<page size="A4" layout="landscape" orientation="landscape">`;
						html += `<div class="page_${tableIndex}" style="position: relative; overflow: hidden; margin: 0px 0px 0px 0px; padding: 0px; border: none; width: 842px">`;
						html += `<div style="height: 595px;">`;
						html += `<img style="position: absolute; top: 0; left: 0; z-index: 1;" src="../assets/imgs/vector-heading-table.png" alt="Header Background">`;
						html += `<img style="position: absolute; top: 12px; left: 20px; z-index: 3;" src="../assets/imgs/Logo.png" alt="Logo">`;
						html += `<div style="position: absolute; top: 15px; right: 20px; z-index: 3; color: #6C638C; text-align: right; font-family: 'Inter', sans-serif; font-size: 18px; font-style: normal; font-weight: 600; line-height: normal;">${this.clientName}</div>`;
						html += `<div style="position: relative; top: 90px; left: 21px;">`;
						html += `<span style="color: #4733CB; font-family: 'Inter', sans-serif; font-size: 24px; font-style: normal; font-weight: 600; line-height: normal;">${singleData.pageTitle}</span><br>`;
						html += `<img src="../assets/imgs/RectangleBig.png">&nbsp;<img src="../assets/imgs/RectangleSmall.png">`;
						html += `</div>`;
						if (singleData.subTitle !== null) {
							html += `<div style="position: relative; top: 110px; left: 21px;">`;
							html += `<img src="../assets/imgs/verticalLineRed.png">`;
							html += `<span style="color: #000000; font-style: normal; margin-top: 10px; text-transform: uppercase; font-family: 'Inter', sans-serif; font-size: 18px; margin-left: 5px; line-height: normal;">${singleData.subTitle}</span><br>`;
							html += `</div>`;
						}
						html += `<div style="position: relative; top: 120px; left: 21px;">`;
						// html += `<h1>Table ${tableIndex + 1}</h1>`;
						html += `<table style="width: 95%; table-layout: fixed; border-collapse: collapse;letter-spacing:0.01rem;"><thead><tr style="color: #615F78;
						font-family: 'Inter', sans-serif;
						font-size: 12px;
						font-style: normal;
						font-weight: 500;
						line-height: normal;background: #DBDAF3; height: 40px;">`;
						for (let ind = 0; ind < singleData.tableHead.length; ind++) {
							const element = singleData.tableHead[ind];
							if (ind === 0) html += `<th style="text-align: left; padding-left: 2.5%;width: 25%;">${element}</th>`;
							else if (ind == singleData.tableHead.length - 1) html += `<th style="text-align: right;padding-right: 2.5%;width: 15%;">${element}</th>`;
							else html += `<th style="text-align: right; padding-left: 2%;width: 15%;">${element}</th>`;
						}

						html += `</tr></thead><tbody>`;
						let counter = 0;
						for (const record of this.getTableData(tableIndex, singleData.totalData)) {
							counter++;
							// console.log(counter, 'counter', singleData.totalData.length, 'legnth', tableIndex, 'table index');
							let rowColorCode;
							let profitNLossColor;
							let netProfitNLossColor;
							let style;
							((counter % 2 == 0) ? rowColorCode = '#F0F0F0' : rowColorCode = '#fff');

							if (singleData.pageTitle === 'Family Distribution' && singleData.subTitle === null) {
								record.CLIENTCODE === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`
								html += `<tr style="${style}">`;

								(record.UNREALISEDPLVAL > 0 ? netProfitNLossColor = '#009E3B' : (record.UNREALISEDPLVAL < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));
								(record.UNREALISEDPLPER > 0 ? profitNLossColor = '#009E3B' : (record.UNREALISEDPLPER < 0 ? profitNLossColor = '#DF514C' : profitNLossColor = '#000000'));

								html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.CLIENTCODE}</td>`;
								html += `<td style="text-align: right;">${this.numberFormat(record.CURRENTVALUE)}</td>`;
								html += `<td style="text-align: right;">${this.numberFormat(record.HLDPERCENTAGE)}</td>`;
								html += `<td style="text-align: right;color: ${netProfitNLossColor}"">${record.UNREALISEDPLVAL < 0 ? '(' : ''}${this.numberFormat(record.UNREALISEDPLVAL)}${record.UNREALISEDPLVAL < 0 ? ')' : ''}</td>`;
								html += `<td style="text-align: right; padding-right: 2.5%; color: ${profitNLossColor}"> ${record.UNREALISEDPLPER < 0 ? '(' : ''}${this.numberFormat(record.UNREALISEDPLPER)}${record.UNREALISEDPLPER < 0 ? ')' : ''}</td>`;
							}
							html += `</tr>`;
						}
						html += `</tbody></table></div>
				</div>
					<div style="position: absolute;bottom: 2%;left: 2%;clear:both"><span style="color: #817A9A;
							text-align: center;
							font-family: 'Inter', sans-serif;
							font-size: 14px;
							font-style: normal;
							font-weight: 700;
							line-height: normal;">PORTFOLIO 360</span>&nbsp;
						<span style="color: #84859E;
								font-family: 'Inter', sans-serif;
								font-size: 10px;
								font-style: normal;
								font-weight: 400;
								line-height: normal;">${moment(new Date()).format('MMM DD, YYYY')}</span>	
							
					</div>
					<div style="position: absolute;bottom: 2%;right: 2%;clear:both"><span style="color: #817A9A;
					text-align: center;
					font-family: 'Inter', sans-serif;
					font-size: 12px;
					font-style: normal;
					font-weight: 400;
					line-height: normal;">Private and Confidential | ${JSON.stringify(pageNo).length === 1 ? `0${pageNo}` : pageNo}</span>
			</div>
					
				</div></page>`;
					}
				}
			}
			if (this.data.every((item: any) => item.totalData.length === 0)) pageNo = 1;
			setDisclaimerPage(pageNo)
		}
		else if (itemChecked.includes('product')) {
			if (!this.data.some((item: any) => item.totalData.length > 0)) {
				this.toast.displayToast('No record found');
				this.pdfLoader = true;
				return false;
			}
			html += page1;
			let pageNo = 0;
			for (const singleData of this.data) {

				if (singleData.pageTitle != 'Family Distribution') {
					for (const tableIndex of this.getTableIndexes(singleData.totalData, singleData.subTitle)) {
						pageNo++;
						html += `<page size="A4" layout="landscape" orientation="landscape">`;
						html += `<div class="page_${tableIndex}" style="position: relative; overflow: hidden; margin: 0px 0px 0px 0px; padding: 0px; border: none; width: 842px">`;
						html += `<div style="height: 595px;">`;
						html += `<img style="position: absolute; top: 0; left: 0; z-index: 1;" src="../assets/imgs/vector-heading-table.png" alt="Header Background">`;
						html += `<img style="position: absolute; top: 12px; left: 20px; z-index: 3;" src="../assets/imgs/Logo.png" alt="Logo">`;
						html += `<div style="position: absolute; top: 15px; right: 20px; z-index: 3; color: #6C638C; text-align: right; font-family: 'Inter', sans-serif; font-size: 18px; font-style: normal; font-weight: 600; line-height: normal;">${this.clientName}</div>`;
						html += `<div style="position: relative; top: 90px; left: 21px;">`;
						html += `<span style="color: #4733CB; font-family: 'Inter', sans-serif; font-size: 24px; font-style: normal; font-weight: 600; line-height: normal;">${singleData.pageTitle}</span><br>`;
						html += `<img src="../assets/imgs/RectangleBig.png">&nbsp;<img src="../assets/imgs/RectangleSmall.png">`;
						html += `</div>`;
						if (singleData.subTitle !== null) {
							html += `<div style="position: relative; top: 110px; left: 21px;">`;
							html += `<img src="../assets/imgs/verticalLineRed.png">`;
							html += `<span style="color: #000000; font-style: normal; margin-top: 10px; text-transform: uppercase; font-family: 'Inter', sans-serif; font-size: 18px; margin-left: 5px; line-height: normal;">${singleData.subTitle}</span><br>`;
							html += `</div>`;
						}
						html += `<div style="position: relative; top: 120px; left: 21px;">`;
						// html += `<h1>Table ${tableIndex + 1}</h1>`;
						html += `<table style="width: 95%; table-layout: fixed; border-collapse: collapse;letter-spacing:0.01rem;"><thead><tr style="color: #615F78;
					font-family: 'Inter', sans-serif;
					font-size: 12px;
					font-style: normal;
					font-weight: 500;
					line-height: normal;background: #DBDAF3; height: 40px;">`;

						/* for (const tableHeading of singleData.tableHead) {
							console.log(tableIndex , 'index')
							html += `<th>${tableHeading}</th>`;
						} */

						if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Mutual Funds') {
							for (let ind = 0; ind < singleData.tableHead.length; ind++) {
								const element = singleData.tableHead[ind];
								if (ind === 0) html += `<th style="text-align: left; padding-left: 2.5%;width: 35%;">${element}</th>`;
								//else if (ind === 1) html += `<th style="text-align: center;width: 17%;">${element}</th>`;
								else if (ind === 4) html += `<th style="text-align: right;width: 9%;">${element}</th>`;
								else if (ind == singleData.tableHead.length - 1) html += `<th style="text-align: right;padding-right: 2.5%;width: 11%;">${element}</th>`;
								else html += `<th style="text-align: right; padding-left: 2%;width: 11%;">${element}</th>`;
							}
						} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Stocks') {
							for (let ind = 0; ind < singleData.tableHead.length; ind++) {
								const element = singleData.tableHead[ind];
								if (ind === 0) html += `<th style="text-align: left; padding-left: 2.5%;width: 20%;">${element}</th>`;
								else if (ind === 3 || ind === 5) html += `<th style="text-align: right;width: 13%;">${element}</th>`;
								else if (ind === 4 || ind === 1) html += `<th style="text-align: right;width: 8%;">${element}</th>`;
								else if (ind == singleData.tableHead.length - 1) html += `<th style="text-align: right;padding-right: 2.5%;width: 10%;">${element}</th>`;
								else html += `<th style="text-align: right; padding-left: 2%;width: 10%;">${element}</th>`;
							}
						} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Bonds') {
							for (let ind = 0; ind < singleData.tableHead.length; ind++) {
								const element = singleData.tableHead[ind];
								if (ind === 0) html += `<th style="text-align: left; padding-left: 2.5%;width: 37%;">${element}</th>`;
								else if (ind === 2) html += `<th style="text-align: right;width: 9%;">${element}</th>`;
								else if (ind == singleData.tableHead.length - 1) html += `<th style="text-align: right;padding-right: 2.5%;width: 18%;">${element}</th>`;
								else html += `<th style="text-align: right; padding-left: 2%;width: 18%;">${element}</th>`;
							}
						} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Fixed Deposit') {
							for (let ind = 0; ind < singleData.tableHead.length; ind++) {
								const element = singleData.tableHead[ind];
								if (ind === 0) html += `<th style="text-align: left; padding-left: 2.5%;width: 30%;">${element}</th>`;
								else if (ind === 4) html += `<th style="text-align: right;width: 6%;">${element}</th>`;
								else if (ind == singleData.tableHead.length - 1) html += `<th style="text-align: right;padding-right: 2.5%;width: 16%;">${element}</th>`;
								else html += `<th style="text-align: right; padding-left: 2%;width: 16%;">${element}</th>`;
							}
						} else {
							for (let ind = 0; ind < singleData.tableHead.length; ind++) {
								const element = singleData.tableHead[ind];
								if (ind === 0) html += `<th style="text-align: left; padding-left: 2.5%;width: 25%;">${element}</th>`;
								else if (ind == singleData.tableHead.length - 1) html += `<th style="text-align: right;padding-right: 2.5%;width: 15%;">${element}</th>`;
								else html += `<th style="text-align: right; padding-left: 2%;width: 15%;">${element}</th>`;
							}
						}

						html += `</tr></thead><tbody>`;
						let counter = 0;
						let dataArray: any;

						if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Mutual Funds') {
							let dataBind = lodash.groupBy(singleData.totalData, "scheme_category");
							let filerTemp = lodash.map(dataBind, arraygroup => lodash.groupBy(arraygroup, obj =>
								obj.scheme_category));

							let filterData: any = [];

							filerTemp.forEach(element => {
								let valuesArray: any = Object.values(element);
								valuesArray[0].forEach((element2: any) => {
									filterData.push(element2)
								});
							});
							dataArray = filterData
						} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Stocks') {
							let dataBind = lodash.groupBy(singleData.totalData, "SectorName");

							let filerTemp = lodash.map(dataBind, arraygroup => lodash.groupBy(arraygroup, obj =>
								obj.SectorName));
							let unlistedFilterData: any = [];
							let unlistedFilterExtraData: any = [];
							// let listedFilterData = [];			

							filerTemp.forEach(element => {
								let valuesArray: any = Object.values(element);

								valuesArray[0].forEach((element2: any) => {
									// unlistedFilterData.push(element2);
									if (element2.INSTRUMENTNAME != "Total" && element2.SectorName != '') {
										unlistedFilterData.push(element2);
										// unlistedFilterData = unlistedFilterData.reverse();
									} else {
										unlistedFilterExtraData.push(element2);
										// unlistedFilterData.push(element2);
									}
								});
							});
							dataArray = unlistedFilterData.concat(unlistedFilterExtraData);
							// dataArray = unlistedFilterData;
						} else {
							dataArray = singleData.totalData
						}

						if ((singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Mutual Funds') || (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Stocks')) {
							this.itemsPerPage = 5;
						} else {
							this.itemsPerPage = 7;
						}

						const startIndex = tableIndex * this.itemsPerPage;
						const endIndex = startIndex + this.itemsPerPage;

						let tableData = dataArray.slice(startIndex, endIndex);

						//for (const record of this.getTableData(tableIndex, singleData.totalData)) {
						for (let i = 0; i < tableData.length; i++) {
							counter++;
							let record = tableData[i];
							// console.log(counter, 'counter', singleData.totalData.length, 'legnth', tableIndex, 'table index');
							let rowColorCode;
							let profitNLossColor;
							let netProfitNLossColor;
							let style;
							((counter % 2 == 0) ? rowColorCode = '#F0F0F0' : rowColorCode = '#fff');

							/* if(tableIndex > 0) {
								var totalLength = counter + 
							} else {
								counter === singleData.totalData.length ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: 'Inter', sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = 'color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;'
							} */

							if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Stocks') {
								record.INSTRUMENTNAME === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`

								let nameOfSector = tableData[0].SectorName;

								if (record.INSTRUMENTNAME != "Total") {
									if (record.Unlisted_Delisted === '0') {
										if (i == 0) {
											html += `<tr style="background-color: #F5F4FF;"><td style="color: #000;font-family: 'Inter', sans-serif;font-size: 10px;font-style: normal;font-weight: 700;line-height: normal;text-align: left; padding: 4px 2.5%; "colspan="9">${nameOfSector ? nameOfSector : 'Others'}</td></tr>`;
										}

										if (i - 1 < tableData.length && nameOfSector != tableData[i].SectorName &&
											tableData[i].SectorName != tableData[i - 1].SectorName) {
											html += `<tr style="background-color: #F5F4FF;"><td style="color: #000;font-family: 'Inter', sans-serif;font-size: 10px;font-style: normal;font-weight: 700;line-height: normal;text-align: left; padding: 4px 2.5%; "colspan="9">${record.SectorName ? record.SectorName : 'Others'}</td></tr>`;
										}

									} else {
										// html += `<tr style="background-color: #F5F4FF;"><td style="color: #000;font-family: 'Inter', sans-serif;font-size: 10px;font-style: normal;font-weight: 700;line-height: normal;text-align: left; padding: 4px 2.5%; "colspan="9">Unlisted/Delisted</td></tr>`;

										if (i == 0) {
											html += `<tr style="background-color: #F5F4FF;"><td style="color: #000;font-family: 'Inter', sans-serif;font-size: 10px;font-style: normal;font-weight: 700;line-height: normal;text-align: left; padding: 4px 2.5%; "colspan="9">Unlisted/Delisted</td></tr>`;
										}

										if (i - 1 < tableData.length && nameOfSector != tableData[i].SectorName &&
											tableData[i].SectorName != tableData[i - 1].SectorName) {
											html += `<tr style="background-color: #F5F4FF;"><td style="color: #000;font-family: 'Inter', sans-serif;font-size: 10px;font-style: normal;font-weight: 700;line-height: normal;text-align: left; padding: 4px 2.5%; "colspan="9">Unlisted/Delisted</td></tr>`;
										}
									}
								}

								html += `<tr style="${style}">`;

								(record.UNREALIEDGL > 0 ? netProfitNLossColor = '#009E3B' : (record.UNREALIEDGL < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));
								(record.UNRLGAINLOSSPER > 0 ? profitNLossColor = '#009E3B' : (record.UNRLGAINLOSSPER < 0 ? profitNLossColor = '#DF514C' : profitNLossColor = '#000000'));

								html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.INSTRUMENTNAME}</td>`;
								html += `<td style="text-align: right;">${record.QUANTITY == '--' ? '--' : this.numberNoFormat(parseInt(record.QUANTITY))}</td>`;
								html += `<td style="text-align: right;">${record.AVGPURCHASEPRICE == '-' ? '--' : record.AVGPURCHASEPRICE == 0 ? '--' : this.numberFormat(record.AVGPURCHASEPRICE)}</td>`;
								html += `<td style="text-align: right;">${this.numberNoFormat(record.HOLDINGCOST)}</td>`;
								html += `<td style="text-align: right;">${record.PreviousClosingPrice == '-' ? '--' : record.PreviousClosingPrice == 0 ? '--' : this.numberFormat(record.PreviousClosingPrice)}</td>`;
								html += `<td style="text-align: right;">${this.numberNoFormat(record.MARKETVALUE)}</td>`;
								// html += `<td style="text-align: right;">${this.numberNoFormat(record.DIVIDENT)}</td>`;
								html += `<td style="text-align: right; padding-right: 4px; color: ${record['Get_three_year_change'] > 0 ? '#009E3B' : (record['Get_three_year_change'] < 0 ? '#DF514C' : '#000000')}">${record['Get_three_year_change'] < 0 ? '(' : ''}${this.numberFormat(record['Get_three_year_change'])}${record['Get_three_year_change'] < 0 ? ')' : ''}</td>`;
								html += `<td style="text-align: right;color: ${netProfitNLossColor}">${record.UNREALIEDGL < 0 ? '(' : ''}${this.numberNoFormat(record.UNREALIEDGL)}${record.UNREALIEDGL < 0 ? ')' : ''}</td>`;
								html += `<td style="text-align: right; padding-right: 2.5%; color: ${profitNLossColor}">${record.UNRLGAINLOSSPER < 0 ? '(' : ''}${this.numberFormat(record.UNRLGAINLOSSPER)}${record.UNRLGAINLOSSPER < 0 ? ')' : ''}</td>`;
							} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Mutual Funds') {
								record.Scheme_Name === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`

								let titleOfCategory = tableData[0].scheme_category;
								if (i == 0) {
									html += `<tr style="background-color: #F5F4FF;"><td style="color: #000;font-family: 'Inter', sans-serif;font-size: 10px;font-style: normal;font-weight: 700;line-height: normal;text-align: left; padding: 4px 2.5%; "colspan="9">${titleOfCategory}</td></tr>`;
								}

								if (i - 1 < tableData.length && titleOfCategory != tableData[i].scheme_category &&
									tableData[i].scheme_category != tableData[i - 1].scheme_category) {
									html += `<tr style="background-color: #F5F4FF;"><td style="color: #000;font-family: 'Inter', sans-serif;font-size: 10px;font-style: normal;font-weight: 700;line-height: normal;text-align: left; padding: 4px 2.5%; "colspan="9">${record.scheme_category}</td></tr>`;
								}

								html += `<tr style="${style}">`;
								(record.Unrealized_Profit > 0 ? netProfitNLossColor = '#009E3B' : (record.Unrealized_Profit < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));

								html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.Scheme_Name}</td>`
								// html += `<td style="text-align: center;">${record.scheme_category}</td>`;
								html += `<td style="text-align: right;">${record.Present_Units == '-' ? '--' : record.Present_Units == 0 ? '--' : this.numberFormat(+(record.Present_Units))}</td>`;
								html += `<td style="text-align: right;">${this.numberNoFormat(record.Current_Investment)}</td>`;
								html += `<td style="text-align: right;">${this.numberNoFormat(record.Present_Value)}</td>`;
								html += `<td style="text-align: right;">${record.Present_NAV == '-' ? '--' : this.numberFormat(record.Present_NAV)}</td>`;
								html += `<td style="text-align: right; color: ${record['XIRR'] > 0 ? '#009E3B' : (record['XIRR'] < 0 ? '#DF514C' : '#000000')}">${record['XIRR'] < 0 ? '(' : ''}${record.XIRR == '-' ? '--' : this.numberFormat(record['XIRR'])}${record['XIRR'] < 0 ? ')' : ''}</td>`;
								html += `<td style="text-align: right;color: ${netProfitNLossColor}">${record.Unrealized_Profit < 0 ? '(' : ''}${this.numberNoFormat(record.Unrealized_Profit)}${record.Unrealized_Profit < 0 ? ')' : ''}</td>`;
								html += `<td style="text-align: right; padding-right: 2.5%; color: ${record['pnlValue'] > 0 ? '#009E3B' : (record['pnlValue'] < 0 ? '#DF514C' : '#000000')}">${record['pnlValue'] < 0 ? '(' : ''}${this.numberFormat(record['pnlValue'])}${record['pnlValue'] < 0 ? ')' : ''}</td>`;
							} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Bonds') {
								record.BondCompany === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`
								html += `<tr style="${style}">`;
								// (record.Unrealized_Profit > 0 ? netProfitNLossColor = '#009E3B' : (record.Unrealized_Profit < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));

								html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.BondCompany}</td>`
								// html += `<td style="text-align: right;">${record.Tenor ? record.Tenor : '--'}</td>`;
								// html += `<td style="text-align: right;">${record.BondBookingDate ? moment(record.BondBookingDate).format('DD/MM/YYYY') : '--'}</td>`;
								html += `<td style="text-align: right;">${this.numberNoFormat(record.BondAmount)}</td>`;
								html += `<td style="text-align: right;">${record.Rateofinterest ? this.formatDecimal(record.Rateofinterest) : '--'}</td>`;
								html += `<td style="text-align: right;">${record.BondMaturityDate ? moment(record.BondMaturityDate).format('DD/MM/YYYY') : '--'}</td>`;
								html += `<td style="text-align: right;padding-right: 2.5%;">${record.ISIN ? record.ISIN : '--'}</td>`;

								// html += `<td style="text-align: right;color: ${netProfitNLossColor}">${record.Unrealized_Profit < 0 ? '(' : ''}${this.numberFormat(record.Unrealized_Profit)}${record.Unrealized_Profit < 0 ? ')' : ''}</td>`;
								// html += `<td style="text-align: right; padding-right: 2.5%; color: ${record['pnlValue'] > 0 ? '#009E3B' : (record['pnlValue'] < 0 ? '#DF514C' : '#000000')}">${record['pnlValue'] < 0 ? '(' : ''}${this.numberFormat(record['pnlValue'])}${record['pnlValue'] < 0 ? ')' : ''}</td>`;
							} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Fixed Deposit') {
								record.FDCompany === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`
								html += `<tr style="${style}">`;
								// (record.Unrealized_Profit > 0 ? netProfitNLossColor = '#009E3B' : (record.Unrealized_Profit < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));

								html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.FDCompany}</td>`
								html += `<td style="text-align: right;">${record.Tenor ? record.Tenor : '--'}</td>`;
								html += `<td style="text-align: right;">${record.FDBookingDate ? moment(record.FDBookingDate).format('DD/MM/YYYY') : '--'}</td>`;
								html += `<td style="text-align: right;">${this.numberNoFormat(record.FDBookingAmount)}</td>`;
								html += `<td style="text-align: right;">${record.RateOfInterest ? record.RateOfInterest : '--'}</td>`;
								html += `<td style="text-align: right;padding-right: 2.5%;">${record.FDMaturityDate ? moment(record.FDMaturityDate).format('DD/MM/YYYY') : '--'}</td>`;

								// html += `<td style="text-align: right;">${record.Present_NAV == '-' ? '--' : this.numberFormat(record.Present_NAV)}</td>`;
								// html += `<td style="text-align: right;color: ${netProfitNLossColor}">${record.Unrealized_Profit < 0 ? '(' : ''}${this.numberFormat(record.Unrealized_Profit)}${record.Unrealized_Profit < 0 ? ')' : ''}</td>`;
								// html += `<td style="text-align: right; padding-right: 2.5%; color: ${record['pnlValue'] > 0 ? '#009E3B' : (record['pnlValue'] < 0 ? '#DF514C' : '#000000')}">${record['pnlValue'] < 0 ? '(' : ''}${this.numberFormat(record['pnlValue'])}${record['pnlValue'] < 0 ? ')' : ''}</td>`;
							} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'AIF') {
								record.SCHEMENAME === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`
								html += `<tr style="${style}">`;
								(record.netpl > 0 ? netProfitNLossColor = '#009E3B' : (record.netpl < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));

								html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.SCHEMENAME}</td>`
								html += `<td style="text-align: right;">${record.AUMDATE ? record.AUMDATE : '--'}</td>`;
								html += `<td style="text-align: right;">${this.numberNoFormat(record.NETINVESTMENT)}</td>`;
								html += `<td style="text-align: right;">${this.numberNoFormat(record.CRRENTVALUE)}</td>`;
								html += `<td style="text-align: right;">${record.COMMITMENTAMOUNT}</td>`;

								html += `<td style="text-align: right;color: ${netProfitNLossColor}">${record.netpl < 0 ? '(' : ''}${this.numberNoFormat(record.netpl)}${record.netpl < 0 ? ')' : ''}</td>`;
								html += `<td style="text-align: right; padding-right: 2.5%; color: ${record['plPer'] == '--' ? '#000000' : record['plPer'] > 0 ? '#009E3B' : (record['plPer'] < 0 ? '#DF514C' : '#000000')}">${record['plPer'] < 0 ? '(' : ''}${record['plPer'] == '--' ? '--' : this.numberFormat(record['plPer'])}${record['plPer'] < 0 ? ')' : ''}</td>`;
							} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'PMS') {
								record.SCHEMENAME === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`
								html += `<tr style="${style}">`;
								(record.netpl > 0 ? netProfitNLossColor = '#009E3B' : (record.netpl < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));

								html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.SCHEMENAME}</td>`
								html += `<td style="text-align: right;">${record.AUMDATE ? record.AUMDATE : '--'}</td>`;
								html += `<td style="text-align: right;">${this.numberNoFormat(record.NETINVESTMENT)}</td>`;
								html += `<td style="text-align: right;">${this.numberNoFormat(record.CRRENTVALUE)}</td>`;

								html += `<td style="text-align: right;color: ${netProfitNLossColor}">${record.netpl < 0 ? '(' : ''}${this.numberNoFormat(record.netpl)}${record.netpl < 0 ? ')' : ''}</td>`;
								html += `<td style="text-align: right; padding-right: 2.5%; color: ${record['plPer'] > 0 ? '#009E3B' : (record['plPer'] < 0 ? '#DF514C' : '#000000')}">${record['plPer'] < 0 ? '(' : ''}${this.numberFormat(record['plPer'])}${record['plPer'] < 0 ? ')' : ''}</td>`;
							}

							html += `</tr>`;
						}
						html += `</tbody></table></div>
			</div>
				<div style="position: absolute;bottom: 2%;left: 2%;clear:both"><span style="color: #817A9A;
						text-align: center;
						font-family: 'Inter', sans-serif;
						font-size: 14px;
						font-style: normal;
						font-weight: 700;
						line-height: normal;">PORTFOLIO 360</span>&nbsp;
					<span style="color: #84859E;
							font-family: 'Inter', sans-serif;
							font-size: 10px;
							font-style: normal;
							font-weight: 400;
							line-height: normal;">${moment(new Date()).format('MMM DD, YYYY')}</span>	
						
				</div>
				<div style="position: absolute;bottom: 2%;right: 2%;clear:both"><span style="color: #817A9A;
				text-align: center;
				font-family: 'Inter', sans-serif;
				font-size: 12px;
				font-style: normal;
				font-weight: 400;
				line-height: normal;">Private and Confidential | ${JSON.stringify(pageNo).length === 1 ? `0${pageNo}` : pageNo}</span>
		</div>
				
			</div></page>`;
					}
				}
			}
			setDisclaimerPage(pageNo)
		}
		else if (itemChecked.includes('pl')) {
			html += page1;
			let pageNo = 0;
			realizedPLReport(pageNo);
		}


		//Total page number code
		// <div style="position: absolute;bottom: 2%;right: 2%;">
		// 	<span style="color: #84859E;
		// 	text-align: center;
		// 	font-size: 12px;
		// 	font-weight: 700;
		// 	line-height: normal;">${singleData.pageNumber < 10 ? '0' + (+singleData.pageNumber + +tableIndex) : (+singleData.pageNumber + +tableIndex)}</span>
		// </div>

		this.htmlData = await this.sanitize.bypassSecurityTrustHtml(html);


		let productData = ['DE', 'MF'];
		// let productPer = [eqDisplayChart, mfDisplayChart];
		// this.chartProdData = [eqDisplayChart, mfDisplayChart];
		let memberPer: any = []

		if(this.memberData.length > 0){
			this.memberData.forEach((element, i) => {
				memberPer.push(parseInt(element.EQUITYPERCENTAGE))
				element.img = 'img' + i;
			})
		}
		setTimeout(() => {
			if (itemChecked.includes('portfolio')) {
				this.familyMemberPdfGraphDisplay(this.chartMemberData, memberPer);
				this.productPDFGraph(productData, this.chartProdData)
			}
			setTimeout(() => {
				this.downloadPDF(this.memberData, this.productChartData, this.displayRelation, itemChecked);
			}, 3000);
		}, 4000);

		return;
	}

	numberFormat(value: any) {
		return this.formatNumDecimal.transform(value);

		// let currentValue = this.formatNumDecimal.transform(value);		
		// var parts = currentValue.toString().split(".");
		// parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");		
		// return parts.join(".");
	}

	formatDecimal(value: any) {
		return value.toFixed(2);
	}

	numberNoFormat(value: number) {
		return this.formatNumDecimalComma.transform(value);

		//return this.formatNumDecimal.transform(value, 0)
		// return Math.ceil(value);

		// let currentValue = Math.ceil(value);
		// var parts = currentValue.toString().split(".");
		// parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");		
		// return parts.join(".");
	}

	getTableData(pageIndex: number, data: any) {
		const startIndex = pageIndex * this.itemsPerPage;
		const endIndex = startIndex + this.itemsPerPage;
		return data.slice(startIndex, endIndex);
	}

	getTableIndexes(data: any, title?: any): number[] {
		if(title == 'Mutual Funds' || title == 'Stocks'){
			this.itemsPerPage = 5;
		}
		else {
			this.itemsPerPage = 7;
		}
		return Array.from({ length: Math.ceil(data.length / this.itemsPerPage) }, (_, i) => i);
	}

	getTableIndexesForPl(data: any): number[] {
		return Array.from({ length: Math.ceil(data.length / this.itemsPerPagePl) }, (_, i) => i);
	}

	public downloadPDF(memberGraphData: any, productGraphData: any, displayRelation: any, itemChecked: any) {

		const doc = new jsPDF({
			orientation: 'l', // landscape
			unit: 'pt', // points, pixels won't work properly
			// format: "A4" // set needed dimensions for any element
			format: [842, 595] // set needed dimensions for any element
		});
		const specialElementHandlers = {
			'#editor': function (element: any, renderer: any) {
				return true;
			}
		};


		
		//var pageCount = doc.getNumberOfPages();
		// console.log(pageCount, 'pageCount');

		var width = doc.internal.pageSize.getWidth();
		var height = doc.internal.pageSize.getHeight();

		let pageHeight = doc.internal.pageSize.height;

		// Before adding new content
		let y = 500 // Height position of new content
		let x = 30
		if (y >= pageHeight) {
			y = 0 // Restart height position
		}
		/* doc.html(elementHTML.innerHTML, {
			x,
			y,
		}); */

		// return;
		/* let canvas;
		canvas = document.querySelector('#chartJSContainer4');
		  //creates image
		//   var canvasImg = canvas.toDataURL("image/jpeg", 1.0);
		  var dataURL = canvas.toDataURL();
		
		  //creates PDF from img
		  doc.setPage(2);
		//   doc.text(15, 15, "Cool Chart");
		  doc.addImage(dataURL, 'JPEG', 0, 0, 150, 150 );
		  doc.save('canvas.pdf'); */

		var elementHTML: any = document.querySelector("#content");
		if (itemChecked.includes('portfolio')) {
			let canvas: any;
			canvas = document.querySelector('#familyMemberPDFGraph');
			//creates image
			//   var canvasImg = canvas.toDataURL("image/jpeg", 1.0);
			var dataURL = canvas.toDataURL();

			let canvas2: any;
			canvas2 = document.querySelector('#productWise');
			//creates image
			//   var canvasImg = canvas.toDataURL("image/jpeg", 1.0);
			var dataURL2 = canvas2.toDataURL();
			// document.getElementById('familyMemberPDFGraph')?.remove();
			// document.getElementById('productWise')?.remove();
		}
		const _this = this;

		setTimeout(() => {
			this.pdfLoader = true;
		}, 5000);
		
		doc.html(elementHTML.innerHTML, {
			callback: function (doc) {
				// Save the PDF
				/* let pageNo;
				pageNo = doc.getNumberOfPages().toString();
				// doc.setPage(7);
	
				// doc.setFontSize(12);//optional
				// doc.setTextColor(40);//optional
				// doc.setFont('normal');//optional
				// doc.text(pageNo, 150, doc.internal.pageSize.height - 10);
	
				for (var i = 1; i <= doc.getNumberOfPages(); i++) {
					if (i != 1) {
						doc.setPage(i);
						doc.setFontSize(14);//optional
						doc.setTextColor('#84859E');//optional
						doc.setFont('sans-serif', 'sans-serif', '900');//optional
						doc.text(i < 10 ? '0' + String(i - 1) : String(i - 1), doc.internal.pageSize.width - 40, doc.internal.pageSize.height - 20);
						// doc.text('PORTFOLIO 360', 30, doc.internal.pageSize.height - 20);
	
						// doc.addImage('../assets/imgs/portfolio.png','PNG', 30, doc.internal.pageSize.height - 40, 100, 20);
	
					}
				} */

				// doc.text(150,285, 'page ' + doc.page);
				/* let canvas;
				canvas = document.querySelector('#chartJSContainer4');
				//creates image
				//   var canvasImg = canvas.toDataURL("image/jpeg", 1.0);
				var dataURL = canvas.toDataURL();
	
				document.getElementById('chartJSContainer4').remove() */

				//creates PDF from img
				doc.setPage(2);
				//   doc.text(15, 15, "Cool Chart");
				if (itemChecked.includes('portfolio')) {
					if (memberGraphData.length > 0 && productGraphData.length > 0) {
						doc.addImage(dataURL, 'JPEG', 20, 350, 150, 150);
						doc.addImage(dataURL2, 'JPEG', 470, 350, 150, 150);
					} else if (memberGraphData.length === 0 && productGraphData.length > 0) {
						doc.addImage(dataURL2, 'JPEG', 233, 355, 150, 150);
					} else if (memberGraphData.length > 0 && productGraphData.length === 0) {
						doc.addImage(dataURL, 'JPEG', 233, 355, 150, 150);
					}
				}

				if (itemChecked.includes('portfolio') && itemChecked.includes('product') && itemChecked.includes('pl')) {
					doc.deletePage(doc.getNumberOfPages())
				}else if (itemChecked.includes('portfolio') && itemChecked.includes('pl')) {
					doc.deletePage(doc.getNumberOfPages())
				} else if (itemChecked.includes('portfolio')) {
					doc.deletePage(doc.getNumberOfPages())
				}
				// let fileName = displayRelation === 'FAMILY' ? 'Family' : 'Self';
				// doc.save(fileName + ' Portfolio ' + (_this.isBrokingClient ? _this.clientCode : _this.clientName) + '.pdf');
				setTimeout(() => {
					let pdfOutput = doc.output("blob");
					let fileName = displayRelation === 'FAMILY' ? 'Family' : 'Self';
		
					if (_this.platform.is("android") && _this.commonService.isApp() && !_this.platform.url().startsWith('http')) {
						// for Android device
						_this.commonService.downloadPdfBlobForMobileApp(pdfOutput,fileName + ' Portfolio ' + (_this.isBrokingClient ? _this.clientCode : _this.clientName));

					} else if (_this.platform.is("ios") && !_this.platform.url().startsWith('http')) {
						// for iOS device
						// console.log('ios device')
						// const directory = File.tempDirectory;
						// const fileName = `invoice-${new Date().getTime()}.pdf`
						// File.writeFile(directory, fileName, pdfOutput, true).then(success => {
						// 	FileOpener.showOpenWithDialog(directory + fileName, 'application/pdf')
						// 	.then(() => console.log('File opened'))
						// 	.catch(e => console.log('Error opening file', e));
						// },
						// err => {
						// console.log(" writing File error : ", err)
						// })
					} else {
						// for desktop
						doc.save(fileName + ' Portfolio ' + (_this.isBrokingClient ? _this.clientCode : _this.clientName) + '.pdf');
					}
				}, 400);
			},
			// width: 160, //target width in the PDF document
			// windowWidth: 675 //window width in CSS pixels
		});
	
	}


	familyDropdown(obj: any) {
		this.tabTableContentMain("Portfolio_tab");
		this.clientName = null;
		this.displayBreakdown = false;
		// var element = this.document.getElementById("ClientMainBox");
		// element.classList.toggle("d-none");
		if(!this.desktop){
			var element: any = this.document.getElementById("ClientMainBox");
			element.classList.toggle("d-none");
		}
		this.clientName = obj['ClientName'] ? obj['ClientName'] : "Name Not Available";
		this.clientCode = obj['ClientCode'];
		this.displayClientCode = this.isBrokingClient ? this.clientCode : this.displayClientCode;
		this.portfolioUserId = this.ciphetText.aesEncrypt(obj.PartnerCode);
		this.displayRelation = obj['Relation'];
		let childCode = this.ciphetText.aesEncrypt(obj['ClientCode']);
		let parentClientId = this.isBrokingClient ? this.ciphetText.aesEncrypt(this.parentClientCode) : this.parentClientCode;
		this.resetData();
		this.getClientPortfolio(parentClientId, '0', childCode)
		//this.getFamilyDropdown(clientID, this.ciphetText.aesEncrypt(this.userIdValue))
		if (this.isBrokingClient) this.getEqClientTable(parentClientId, '0', childCode);
		this.getProductSummary(parentClientId, '0', childCode);
		this.getMfDetails(parentClientId, '0', childCode)
		this.getFdDetails(parentClientId, '0', childCode)
		this.getBondsDetail(parentClientId, '0', childCode)
		this.getAifDetail(parentClientId, '0', childCode)
		this.getPmsDetail(parentClientId, '0', childCode)
		setTimeout(() => {
			this.setDefaultTableClass();
		}, 5000);
	}

	resetData() {
		this.cardSegments = [
			{ name: 'Stocks', segmentValue: 'eq', value: '0', pl: '0', sequence: 0, table: 'table-1' },
			{ name: 'Mutual Funds', segmentValue: 'mf', value: '0', pl: '0', sequence: 1, table: 'table-2' },
			{ name: 'Fixed Deposit', segmentValue: 'fd', value: '0', pl: '0', sequence: 2, table: 'table-3' },
			{ name: 'Bonds', segmentValue: 'bonds', value: '0', pl: '0', sequence: 3, table: 'table-4' },
			{ name: 'AIF', segmentValue: 'aif', value: '0', pl: '0', sequence: 4, table: 'table-5' },
			{ name: 'PMS', segmentValue: 'pms', value: '0', pl: '0', sequence: 5, table: 'table-6' },
		];
		if(!this.isBrokingClient){
			this.cardSegments = [
				{ name: 'Mutual Funds', segmentValue: 'mf', value: '0', pl: '0', sequence: 0, table: 'table-2' },
				{ name: 'Fixed Deposit', segmentValue: 'fd', value: '0', pl: '0', sequence: 1, table: 'table-3' },
				{ name: 'Bonds', segmentValue: 'bonds', value: '0', pl: '0', sequence: 2, table: 'table-4' },
				{ name: 'AIF', segmentValue: 'aif', value: '0', pl: '0', sequence: 3, table: 'table-5' },
				{ name: 'PMS', segmentValue: 'pms', value: '0', pl: '0', sequence: 4, table: 'table-6' },
			];
		}
		this.currentValue = 0;
		this.investedValue = 0;
		this.unRealisePlValue = 0;
		this.unRealisePlPer = 0;
		this.lastUpdated = null;
		this.productAssetSummary = [];
		this.productSummaryData = [];
		this.memberData = [];
		this.memberGraph = true;
		this.clientEqData = [];
		this.clientMfData = [];
		this.clientMappMsg = false;
		this.totalEqHoldingValue = 0;
		this.totalEqUnrealizeGl = 0;
		this.eqHoldingPer = 0;
		this.mfAllocation = 0;
		this.bondsAllocation = 0;
		this.aifAllocation = 0;
		this.pmsAllocation = 0;
		this.fdAllocation = 0;

		this.eqAllocation = 0;
		this.mfTableDisplay = [];
		this.hybridCatagory = [];
		this.equityCatagory = [];
		this.elssCatagory = [];
		this.debtCatagory = [];
		this.liquidCatagory = [];
		this.othersCatagory = [];
		this.eqTableDisplay = [];
		this.fdTableDisplay = [];
		this.bondsTableDisplay = [];
		this.aifTableDisplay = [];
		this.pmsTableDisplay = [];
		this.totalMfHoldingValue = 0;
		this.totalPmsHoldingValue = 0;
		this.totalAifHoldingValue = 0;
		this.totalMfUnrealizeGl = 0;

		this.totalBondsUnrealizeGl = 0;
		this.totalFdUnrealizeGl = 0;
		this.totalAifUnrealizeGl = 0;
		this.totalPmsUnrealizeGl = 0;


		this.totalEqCurrentValue = 0
		this.totalMfCurrentValue = 0;
		this.totalBondsCurrentValue = 0;
		this.totalFdCurrentValue = 0;
		this.totalAifCurrentValue = 0;
		this.totalPmsCurrentValue = 0;

		this.mfHoldingPer = 0;
		this.bondsHoldingPer = 0
		this.fdHoldingPer = 0
		this.aifHoldingPer = 0
		this.pmsHoldingPer = 0

		this.aifData = [];
		this.bondsData = [];
		this.fdData = [];
		this.pmsData = [];
		this.treeMapOptionList = [
			{ 'id': 'asset', 'value': true, 'label': 'Asset Class' },
			{ 'id': 'family', 'value': false, 'label': 'Family' },
			{ 'id': 'products', 'value': false, 'label': 'Product' }
		]

		this.treeDataRender = [];
		this.treeMapOptionList[0].value = true;

		//this.familyOptionDisplay = true;
		// Analtics Data
		this.eqAnalyData = [];
		this.mfAnalyData = [];
		this.displayDuration = false;
		this.displayTreeChart = false;		// this.clientName = "";

	}

	mfSegClick(id: any){
		const ele = document.getElementById(id) as HTMLInputElement;
		ele.checked = false;
	}

	portfolioSummary:any[] = [];
	displayPdf:boolean = true;
	familyTotalInvestment:any = 0;
	familyHoldTotalPer:any = 0;
	isPopoverOpen:boolean = false

	getClientPortfolio(id: any, consFlag: any, childCode?: any) {
		this.subscription.add(
			this.clientService.getClientPortfolio(this.portfolioToken, id, consFlag, childCode,this.portfolioUserId, this.clientType)
				.subscribe((response: any) => {
					// this.portfolioRes = true;
					if (response['Head']['ErrorCode'] == 0) {
						if (response['Body']['ClientPortfolioSummaryMapp'] && response['Body']['ClientPortfolioSummaryMapp'].length) {
							this.portfolioSummary = response['Body']['ClientPortfolioSummaryMapp'];
							this.portfolioData = response['Body']['ClientPortfolioSummaryMapp'][0];
							this.currentValue = this.commonService.numberFormatWithCommaUnit(this.portfolioData['CURRENTVALUE'] && this.portfolioData['CURRENTVALUE'].length > 0 ? parseInt(this.portfolioData['CURRENTVALUE']) : 0);
							this.investedValue = this.commonService.numberFormatWithCommaUnit (this.portfolioData['INVESTEDVALUE'] && this.portfolioData['INVESTEDVALUE'].length > 0 ? parseInt(this.portfolioData['INVESTEDVALUE']) : 0);
							this.lastUpdated = this.portfolioData['LASTUPDATEDON'];
							this.unRealisePlValue = this.portfolioData['UNREALISEDPLVAL'] && this.portfolioData['UNREALISEDPLVAL'].length > 0 ? parseInt(this.portfolioData['UNREALISEDPLVAL']) : 0;
							this.unRealisePlPer = this.portfolioData['UNREALISEDPLPER'] && this.portfolioData['UNREALISEDPLPER'].length > 0 ? parseInt(this.portfolioData['UNREALISEDPLPER']) : 0;
						}
						if (consFlag == '1' && response['Body']['ClientPortfolioSummary1Mapp'] && response['Body']['ClientPortfolioSummary1Mapp'].length) {
							this.familyHoldingDist = response['Body']['ClientPortfolioSummary1Mapp'];
							this.familyTotalInvestment = this.calculateSum(this.familyHoldingDist, 'INVESTEDVALUE')
							const obj: any = {
								"CLIENTCODE": "Total",
								"CURRENTVALUE": this.calculateSum(this.familyHoldingDist, 'CURRENTVALUE'),
								"HLDPERCENTAGE": this.calculateSum(this.familyHoldingDist, 'HLDPERCENTAGE'),
								"UNREALISEDPLVAL": this.calculateSum(this.familyHoldingDist, 'UNREALISEDPLVAL'),
								//"UNREALISEDPLPER": this.calculateSum(this.familyHoldingDist, 'UNREALISEDPLPER')
							}
							obj['UNREALISEDPLPER'] = (obj['UNREALISEDPLVAL'] / this.familyTotalInvestment) * 100;
							this.familyHoldingDist.push(obj);
						}
					}
					if (consFlag == '1' && this.currentValue == 0 && this.investedValue == 0) {
						this.clientMappMsg = true
						this.dataLoad = true;
					}
				})
		)
	}

	familyHoldingDist:any[] = [];

	displayQty(value: any){
		return parseInt(value) 
	}

	getEqClientTable(id: any, consFlag: any, childCode?: any) {
		this.subscription.add(
			this.clientService.getClientEqDetails(this.portfolioToken, id, consFlag, childCode,this.portfolioUserId, this.clientType)
				.subscribe((res: any) => {
					if (res['Head']['ErrorCode'] == 0) {
						// if(res['Body']['ClientEquityDetailsMap']['Successflag'] && res['Body']['ClientEquityDetailsMap']['Successflag'] != 'N'){
						// 	this.dataLoad = true;
						// }
						//console.log(res['Body']['ClientEquityDetailsMapp']);
						//this.eqTableDisplay = res['Body']['ClientEquityDetailsMapp'];

						this.clientEqData = res['Body']['ClientEquityDetailsMapp'];
						// Sort the data by INSTRUMENTNAME
						this.clientEqData.sort((a, b) => {
							const nameA = a.INSTRUMENTNAME.toLowerCase();
							const nameB = b.INSTRUMENTNAME.toLowerCase();
							return nameA.localeCompare(nameB);
						});
						if (this.clientEqData && this.clientEqData.length) {
							this.eqTableDisplay = this.clientEqData.filter(element => {
								return element.INSTRUMENTNAME != 'Total'
							})
							this.totalEqHoldingValue = 0;
							this.totalEqUnrealizeGl = 0;
							this.totalEqCurrentValue = 0
							this.clientEqData.forEach(element => {
								if(element.Get_three_year_change == ""){
									element.Get_three_year_change = 0;
								}
								
								if(!element.DIVIDENT){
									element.DIVIDENT = "-";
								}
								else if(element.DIVIDENT ){
									if(element.DIVIDENT == "0" || element.DIVIDENT == 0){
										element.DIVIDENT = "-";
									}else{
										element.DIVIDENT = parseFloat(element.DIVIDENT);
									}
								}

								// if (element.AVGPURCHASEPRICE.length > 0 && parseInt(element.AVGPURCHASEPRICE) != 0) {
								// 	this.eqAnalyData.push({
								// 		'qty': element.QUANTITY,
								// 		'avgPrice': element.AVGPURCHASEPRICE,
								// 		'ISIN': element.ISIN,
								// 		'stockCode': element.BSECODE,
								// 		'LTP': element.PreviousClosingPrice
								// 	})
								// }
								element.QUANTITY = parseInt(element.QUANTITY);
								element.AVGPURCHASEPRICE = parseFloat(element.AVGPURCHASEPRICE);
								element.HOLDINGCOST = parseFloat(element.HOLDINGCOST);
								element.PreviousClosingPrice = parseFloat(element.PreviousClosingPrice);
								element.MARKETVALUE = parseFloat(element.MARKETVALUE);
								element.UNREALIEDGL = parseFloat(element.UNREALIEDGL);
								element.UNRLGAINLOSSPER = parseFloat(element.UNRLGAINLOSSPER);
								element.Get_three_year_change = parseFloat(element.Get_three_year_change);

								this.totalEqCurrentValue = this.totalEqCurrentValue + parseFloat(element.MARKETVALUE);
								this.totalEqHoldingValue = this.totalEqHoldingValue + parseFloat(element.HOLDINGCOST);
								this.totalEqUnrealizeGl = this.totalEqUnrealizeGl + parseFloat(element.UNREALIEDGL)
								
							})

							this.eqHoldingPer = this.numberFormat((this.totalEqUnrealizeGl / this.totalEqHoldingValue) * 100);

							this.cardSegments[0]['value'] = this.commonService.numberFormatWithCommaUnit(this.totalEqCurrentValue);
							this.cardSegments[0]['pl'] = this.numberFormat(this.eqHoldingPer)
							const obj: any = {
								// "BSECODE": "500180",
								// "SECTORTYPE": "",
								"INSTRUMENTNAME": "Total",
								"QUANTITY": '--',
								"AVGPURCHASEPRICE": '-',
								"HOLDINGCOST": this.calculateSum(this.clientEqData, 'HOLDINGCOST'),
								"PreviousClosingPrice": '-',
								"MARKETVALUE": this.calculateSum(this.clientEqData, 'MARKETVALUE'),
								"UNREALIEDGL": this.calculateSum(this.clientEqData, 'UNREALIEDGL'),
								"Get_three_year_change": this.calculateSum(this.clientEqData, 'Get_three_year_change'),
								//"UNRLGAINLOSSPER": this.calculateSum(this.clientEqData, 'UNRLGAINLOSSPER')
							}
							obj['UNRLGAINLOSSPER'] = (obj['UNREALIEDGL'] / obj['HOLDINGCOST']) * 100
							this.clientEqData.push(obj);
						}

						if (res['Body']['ClientEquityDetailsMap'] && res['Body']['ClientEquityDetailsMap'][0]['Successflag'] == 'N') {
							this.dataLoad = true;
						}

					}

				}, error => {
					this.clientEqData = [];
					this.dataLoad = true;
				})
		)
	}

	getFdDetails(id: any, consFlag: any, childCode?: any) {
		this.subscription.add(
			this.clientService.getFixDepoDetails(this.portfolioToken, id, consFlag, childCode, this.portfolioUserId, this.clientType)
				.subscribe((res: any) => {
					if (res['Body']['FDDetail'] && res['Body']['FDDetail'].length > 0) {
						this.fdData = res['Body']['FDDetail'];
						this.fdData.sort((a, b) => {
							const nameA = a.FDCompany.toLowerCase();
							const nameB = b.FDCompany.toLowerCase();
							return nameA.localeCompare(nameB);
						});
						this.fdTableDisplay = this.fdData.filter(element => {
							return element.FDCompany != 'Total'
						})
						this.fdData.forEach(element => {
							element.FDBookingAmount = parseFloat(element.FDBookingAmount);
							element.breakDownOption = false
							element.RateOfInterest = parseFloat(element.RateOfInterest);
							element.Tenor = parseFloat(element.Tenor);

							this.totalFdCurrentValue = this.totalFdCurrentValue + parseFloat(element.FDBookingAmount);
						})
						if(this.isBrokingClient){
							this.cardSegments[2]['value'] = this.commonService.numberFormatWithCommaUnit(this.calculateSum(this.fdData, 'FDBookingAmount'));
							this.cardSegments[2]['pl'] = '-';
						} else {
							this.cardSegments[1]['value'] = this.commonService.numberFormatWithCommaUnit(this.calculateSum(this.fdData, 'FDBookingAmount'));
							this.cardSegments[1]['pl'] = '-';
						}
						

						const obj = {
							"FDCompany": "Total",
							"Tenor": '',
							"FDBookingDate": '',
							"FDBookingAmount": this.calculateSum(this.fdData, 'FDBookingAmount'),
							"RateOfInterest": '',
							//"RateOfInterest": this.calculateSum(this.fdData, 'RateOfInterest'),
							"FDMaturityDate": '',
						}
						this.fdData.push(obj);
					}
					else {
						this.isBrokingClient ? this.cardSegments[2]['pl'] = '-' : this.cardSegments[1]['pl'] = '-';
					}
				}, error => {
					this.isBrokingClient ? this.cardSegments[2]['pl'] = '-' : this.cardSegments[1]['pl'] = '-';
				})
		)
	}

	bondsData:any[] = [];

	getBondsDetail(id: any, consFlag: any, childCode?: any) {
		this.subscription.add(
			this.clientService.getBondDetails(this.portfolioToken, id, consFlag, childCode, this.portfolioUserId, this.clientType)
				.subscribe((res: any) => {
					if (res['Body']['BondDetail'] && res['Body']['BondDetail'].length > 0) {
						this.bondsData = res['Body']['BondDetail'];
						this.bondsData.sort((a, b) => {
							const nameA = a.BondCompany.toLowerCase();
							const nameB = b.BondCompany.toLowerCase();
							return nameA.localeCompare(nameB);
						});
						this.bondsTableDisplay = this.bondsData.filter(element => {
							return element.BondCompany != 'Total'
						})

						this.bondsData.forEach(element => {
							element.BondAmount = parseFloat(element.BondAmount);
							element.Rateofinterest = parseFloat(element.Rateofinterest);
							element.Tenor = parseFloat(element.Tenor);

							this.totalBondsCurrentValue = this.totalBondsCurrentValue + parseFloat(element.BondAmount);
						})

						if(this.isBrokingClient){
							this.cardSegments[3]['value'] = this.commonService.numberFormatWithCommaUnit(this.calculateSum(this.bondsData, 'BondAmount'));
							this.cardSegments[3]['pl'] = '-';
						} else {
							this.cardSegments[2]['value'] = this.commonService.numberFormatWithCommaUnit(this.calculateSum(this.bondsData, 'BondAmount'));
							this.cardSegments[2]['pl'] = '-';
						}
						

						const obj = {
							"BondCompany": "Total",
							"Tenor": '',
							"BondAmount": this.calculateSum(this.bondsData, 'BondAmount'),
							"Present_Value": this.calculateSum(this.bondsData, 'Present_Value'),
							"Rateofinterest": '',
							"BondMaturityDate": '',
						}
						this.bondsData.push(obj);

					}
					else {
						this.isBrokingClient ? this.cardSegments[3]['pl'] = '-' : this.cardSegments[2]['pl'] = '-';
					}
				}, error => {
					this.bondsData = [];
					this.isBrokingClient ? this.cardSegments[3]['pl'] = '-' : this.cardSegments[2]['pl'] = '-';

				})
		)
	}

	pmsData:any[] = [];

	getPmsDetail(id: any, consFlag: any, childCode?: any) {
		this.subscription.add(
			this.clientService.getPmsDetails(this.portfolioToken, id, consFlag, childCode, this.portfolioUserId, this.clientType)
				.subscribe((res: any) => {
					if (res['Head']['ErrorCode'] == 0) {
						this.totalPmsHoldingValue = 0;

						if (res['Body']['ClientPMSDetailsMapp'] && res['Body']['ClientPMSDetailsMapp'].length > 0) {
							this.pmsData = res['Body']['ClientPMSDetailsMapp'];
							this.pmsData.sort((a, b) => {
								const nameA = a.SCHEMENAME.toLowerCase();
								const nameB = b.SCHEMENAME.toLowerCase();
								return nameA.localeCompare(nameB);
							});
							this.pmsTableDisplay = this.pmsData.filter(element => {
								return element.SCHEMENAME != 'Total'
							})

							this.pmsData.forEach(element => {
								element.NETINVESTMENT = parseFloat(element.NETINVESTMENT);
								element.CRRENTVALUE = parseFloat(element.CRRENTVALUE);

								element.netpl = (element.CRRENTVALUE - element.NETINVESTMENT)
								element.plPer = ((element.CRRENTVALUE - element.NETINVESTMENT) / element.NETINVESTMENT) * 100
								this.totalPmsCurrentValue = this.totalPmsCurrentValue + parseFloat(element.CRRENTVALUE);
								this.totalPmsUnrealizeGl = this.totalPmsUnrealizeGl + parseFloat(element.netpl);
								this.totalPmsHoldingValue = this.totalPmsHoldingValue + parseFloat(element.NETINVESTMENT);
							})
							this.pmsHoldingPer = this.numberFormat((this.calculateSum(this.pmsData, 'netpl') / this.calculateSum(this.pmsData, 'NETINVESTMENT')) * 100);
							
							if(this.isBrokingClient){
								this.cardSegments[5]['value'] = this.commonService.numberFormatWithCommaUnit(this.calculateSum(this.pmsData, 'CRRENTVALUE'));
								this.cardSegments[5]['pl'] = this.numberFormat((this.calculateSum(this.pmsData, 'netpl') / this.calculateSum(this.pmsData, 'NETINVESTMENT')) * 100);	
							} else{
								this.cardSegments[4]['value'] = this.commonService.numberFormatWithCommaUnit(this.calculateSum(this.pmsData, 'CRRENTVALUE'));
								this.cardSegments[4]['pl'] = this.numberFormat((this.calculateSum(this.pmsData, 'netpl') / this.calculateSum(this.pmsData, 'NETINVESTMENT')) * 100);
							}
							
							const obj: any = {
								"SCHEMENAME": "Total",
								"CREATEDON": '',
								"NETINVESTMENT": this.calculateSum(this.pmsData, 'NETINVESTMENT'),
								"CRRENTVALUE": this.calculateSum(this.pmsData, 'CRRENTVALUE'),
								// "Present_Value": this.calculateSum(this.pmsData, 'Present_Value'),
								// "Present_NAV": '-',
								"netpl": this.calculateSum(this.pmsData, 'netpl'),
								"plPer": this.pmsHoldingPer
							}
							// obj['plPer'] = (obj['netpl'] / obj['NETINVESTMENT']) * 100

							this.pmsData.push(obj);
						}
					}

				})
		)
	}

	getAifDetail(id: any, consFlag: any, childCode?: any) {
		this.subscription.add(
			this.clientService.getAifDetails(this.portfolioToken, id, consFlag, childCode, this.portfolioUserId, this.clientType)
				.subscribe((res: any) => {
					if (res['Head']['ErrorCode'] == 0) {
						this.totalAifHoldingValue = 0;
						if (res['Body']['ClientAIFDetailsMapp'] && res['Body']['ClientAIFDetailsMapp'].length > 0) {
							this.aifData = res['Body']['ClientAIFDetailsMapp'];
							this.aifData.sort((a, b) => {
								const nameA = a.SCHEMENAME.toLowerCase();
								const nameB = b.SCHEMENAME.toLowerCase();
								return nameA.localeCompare(nameB);
							});
							this.aifTableDisplay = this.aifData.filter(element => {
								return element.SCHEMENAME != 'Total'
							})

							this.aifData.forEach(element => {
								element.CRRENTVALUE = element.CRRENTVALUE.length > 0 ? element.CRRENTVALUE : 0
								element.NETINVESTMENT = element.NETINVESTMENT.length > 0 ? element.NETINVESTMENT : 0
								element.COMMITMENTAMOUNT = element.COMMITMENTAMOUNT.length > 0 ? element.COMMITMENTAMOUNT : 0
								element.netpl = (element.CRRENTVALUE - element.NETINVESTMENT)
								if (element.NETINVESTMENT == 0) {
									element.plPer = '--'
								}
								else {
									element.plPer = ((element.CRRENTVALUE - element.NETINVESTMENT) / element.NETINVESTMENT) * 100
								}

								element.NETINVESTMENT = parseFloat(element.NETINVESTMENT);
								element.CRRENTVALUE = parseFloat(element.CRRENTVALUE);
								element.COMMITMENTAMOUNT = parseFloat(element.COMMITMENTAMOUNT);

								this.totalAifCurrentValue = this.totalAifCurrentValue + parseFloat(element.CRRENTVALUE);
								this.totalAifUnrealizeGl = this.totalAifUnrealizeGl + parseFloat(element.netpl);
								this.totalAifHoldingValue = this.totalAifHoldingValue + parseFloat(element.NETINVESTMENT);
							})
							this.aifHoldingPer = this.numberFormat((this.calculateSum(this.aifData, 'netpl') / this.calculateSum(this.aifData, 'NETINVESTMENT')) * 100);

							if(this.isBrokingClient){
								this.cardSegments[4]['value'] = this.commonService.numberFormatWithCommaUnit(this.calculateSum(this.aifData, 'CRRENTVALUE'));
								this.cardSegments[4]['pl'] = this.numberFormat((this.calculateSum(this.aifData, 'netpl') / this.calculateSum(this.aifData, 'NETINVESTMENT')) * 100);
							} else {
								this.cardSegments[3]['value'] = this.commonService.numberFormatWithCommaUnit(this.calculateSum(this.aifData, 'CRRENTVALUE'));
								this.cardSegments[3]['pl'] = this.numberFormat((this.calculateSum(this.aifData, 'netpl') / this.calculateSum(this.aifData, 'NETINVESTMENT')) * 100);
							}
							
							const obj = {
								"SCHEMENAME": "Total",
								"CREATEDON": '',
								"NETINVESTMENT": this.calculateSum(this.aifData, 'NETINVESTMENT'),
								"CRRENTVALUE": this.calculateSum(this.aifData, 'CRRENTVALUE'),
								"COMMITMENTAMOUNT": this.calculateSum(this.aifData, 'COMMITMENTAMOUNT'),
								// "Present_Value": this.calculateSum(this.aifData, 'Present_Value'),
								// "Present_NAV": '-',
								"netpl": this.calculateSum(this.aifData, 'netpl'),
								"plPer": this.aifHoldingPer
							}
							// obj['plPer'] = (obj['netpl'] / obj['NETINVESTMENT']) * 100

							this.aifData.push(obj);
						}
					}

				})
		)
	}

	renderTreeChart(datas: any){
		setTimeout(() => {
			this.chartOptions = {
				chart: {
					toolbar:{
						show:false
					},
					zoom :{
						enabled:true
					},
					height: 150,
					
					type: "treemap",
				},
			
				dataLabels: {
					textAnchor: 'middle',
					distributed: false,
					style: {
						fontSize: '14px',
					},
					// formatter: function (val, opts):any {
					// 	console.log(val);
					// 	console.log(opts['w']);
					// 	if(opts['value'] < 10){
					// 		opts['w']['config']['dataLabels']['style']['fontSize'] = '16px'
					// 		opts['w']['globals']['gridWidth'] = 200
					// 		return val = val.toString().charAt(0)+'..';
					// 	}
					// 	else{
					// 		return val
					// 	}
						
					// },
					background: {
						enabled: true,
						foreColor: '#fff',
						padding: 4,
						borderRadius: 2,
						borderWidth: 1,
						borderColor: '#fff',
						opacity: 0.9,
						dropShadow: {
						  enabled: false,
						  top: 1,
						  left: 1,
						  blur: 1,
						  color: '#000',
						  opacity: 0.45
						}
					  },
				},
				series: [
					{
					  data: datas
					}
				  ],
				colors: [
					"#A698F6",
					"#84B4F9",
					"#BFF1FD",
					"#F1946B",
					"#EBCE42",
				],
				states: {
					hover: {
						filter: {
							type: 'none',
							//value: 0.15,
						}
					},
				},
				stroke:{
					width: 0,
				},
				tooltip: {
					y: {
						formatter: function(value: any, { series, seriesIndex, dataPointIndex, w }: any):any{
						//	console.log(w['globals']['categoryLabels'][dataPointIndex]);
						  return value + '%'
						}
					},
				  },
				plotOptions: {
					treemap: {
					  distributed: true,
					  enableShades: false,
					  
					}
				 }
		  
			  };
		}, 500);
		
	}

	getLatestProduct(products: any) {
		return products.reduce((latest: any, product: any) => {
			const currentDate = new Date(product.ASONDATE);
			return currentDate > new Date(latest.ASONDATE) ? product : latest;
		}, products[0]);
	}

	// FUNCTION FOR HANDLING LAST UPDATED PRODUCTS
	lastUpdatedProducts(products: any) {
		this.storeProducts = [];
		let data = [];
		for (const item of products) {
			if (["EM", "HM", "OM", "DM", "CM", "LM", "BD", "FD", "DE", "AIF", "PMS"].includes(item.PRODUCT)) {
				data.push({
					PRODUCT: ["EM", "HM", "OM", "DM", "CM", "LM"].includes(item.PRODUCT)
						? "MF"
						: item.PRODUCT === "BD"
						? "Bonds"
						: item.PRODUCT === "DE"
						? "Stocks"
						: item.PRODUCT,
					ASONDATE: item.ASONDATE.split(" ")[0],
				});
			}
		}

		if (data.length > 0) {
			const mfProductData = data.filter((item: any) => item.PRODUCT === 'MF');
			const otherProductData = data.filter((item: any) => item.PRODUCT !== 'MF');
			if (mfProductData.length > 0) {
				this.storeProducts = [...otherProductData, this.getLatestProduct(mfProductData)];
			} else {
				this.storeProducts = [...otherProductData];
			}
			this.productLastUpdatedDate = this.getLatestProduct(this.storeProducts).ASONDATE;
		}
	}

	LbValue:any;

	getProductSummary(id: any, consFlag: any, childCode?: any) {
		this.dataLoad = false;
		this.subscription.add(
			this.clientService.getProductSummary(this.portfolioToken, id, consFlag, childCode, this.portfolioUserId, this.clientType)
				.subscribe((res: any) => {
					if (res['Head']['ErrorCode'] == 0) {
						if (res['Body']['AssetSummary'] || res['Body']['ProductSummary']) {
							if (res['Body']['AssetSummary'].length > 0) {
								this.productAssetSummary = res['Body']['AssetSummary'].sort((a: any, b: any) => parseFloat(b.EQUITYPERCENTAGE) - parseFloat(a.EQUITYPERCENTAGE));
							}
							this.productSummaryData = res['Body']['ProductSummary'];
							this.lastUpdatedProducts(this.productSummaryData)
							let cBObj = this.productSummaryData.find(o => o.PRODUCT == 'CB');
							if(cBObj){
								this.LbValue = cBObj['EQUITYVALUE']
								this.productSummaryData = this.productSummaryData.filter((item) =>{
								  return item.PRODUCT != 'CB'
								})
							}
							this.memberData = res['Body']['ClientSummary'];

							this.memberData.forEach(element => {
								element.Relation = 'No'
								this.familyMappList.forEach(data => {
									if (data.ClientCode.toUpperCase() == element.CLIENTCODE) {
										element.Relation = data.Relation
									}
								})
							})

							if (this.memberData.length) {
								this.memberData = this.memberData.sort((a, b) => parseFloat(b.EQUITYPERCENTAGE) - parseFloat(a.EQUITYPERCENTAGE));
							}
							else {
								this.memberGraph = false;
							}

							if (this.memberData.length == 1) {
								if (this.memberData[0].Relation.toString().toUpperCase() == 'SELF') {
									this.memberGraph = false
								}
							}

							if(!this.memberGraph){
								this.treeMapOptionList = this.treeMapOptionList.filter(function (el) {
									return el.id != 'family'
								});
							}

							let assetData: any = [];
							let assetPer: any = []
							if (this.productAssetSummary.length > 0) {
								this.productAssetSummary.forEach(element => {
									assetData.push(element.ASSET);
									assetPer.push(parseFloat(element.EQUITYPERCENTAGE))
								})
							}

							if (this.productAssetSummary.length > 0) {
								this.productAssetSummary.forEach(element => {
									this.treeDataRender.push({
										x: element.ASSET == 'E' ? 'Equity' : element.ASSET == 'H' ? 'Hybrid' : element.ASSET == 'D' ? 'Debt' : element.ASSET == 'L' ? 'Liquid' : element.ASSET,
										y: element.EQUITYPERCENTAGE
									})
								});
								this.renderTreeChart(this.treeDataRender)
							}


							let EqObj = this.productSummaryData.find(o => o.PRODUCT === 'DE');
							let eqValue = 0; let emValue = 0; let dmValue = 0;
							let eqPer = 0; let emPer = 0; let dmPer = 0;

							if (EqObj) {
								eqPer = (EqObj['EQUITYPERCENTAGE'])
								this.eqAllocation = eqPer;
								this.stocksEquityValue = EqObj['EQUITYVALUE'];
							}

							let checkMfValue = false;
							if (this.productSummaryData.length > 0) {
								let bondsObj = this.productSummaryData.find(o => o.PRODUCT === 'BO') || this.productSummaryData.find(o => o.PRODUCT === 'BD');
								let fdObj = this.productSummaryData.find(o => o.PRODUCT === 'FD');
								let aifObj = this.productSummaryData.find(o => o.PRODUCT === 'AIF');
								let pmsObj = this.productSummaryData.find(o => o.PRODUCT === 'PMS');
								this.bondsAllocation = bondsObj ? bondsObj['EQUITYPERCENTAGE'] : 0;
								this.fdAllocation = fdObj ? fdObj['EQUITYPERCENTAGE'] : 0;
								this.aifAllocation = aifObj ? aifObj['EQUITYPERCENTAGE'] : 0;
								this.pmsAllocation = pmsObj ? pmsObj['EQUITYPERCENTAGE'] : 0;

								this.productSummaryData.forEach(element => {
									if (element.PRODUCT == 'DM' || element.PRODUCT == 'EM' || element.PRODUCT == 'HM' || element.PRODUCT == 'LM' || element.PRODUCT == 'CM' || element.PRODUCT == 'OM') {
										element.type = 'MF';
										checkMfValue = true;
									}
									else {
										element.type = 'Others'
									}
								})

							}

							if (checkMfValue) {
								let mfDataObj = {
									'PRODUCT': 'MF',
									'type': 'Others',
									'EQUITYVALUE': this.productSummaryData.filter((item) => item.type == 'MF')
										.map((item) => +item.EQUITYVALUE)
										.reduce((sum, current) => sum + current),
									'EQUITYPERCENTAGE': this.productSummaryData.filter((item) => item.type == 'MF')
										.map((item) => +item.EQUITYPERCENTAGE)
										.reduce((sum, current) => sum + current),
								}
								this.productSummaryData.push(mfDataObj)
							}

							this.productSummaryData = this.productSummaryData.filter(element => {
								return element.type == 'Others'
							})

							if (checkMfValue) {
								let mfObj = this.productSummaryData.find(o => o.PRODUCT === 'MF');
								this.mfAllocation = mfObj['EQUITYPERCENTAGE'];
								this.mfEquityValue = mfObj['EQUITYVALUE'];
							}

							let memberData: any = [];
							let memberPer: any = []

							if (this.memberData.length > 0) {
								this.memberData.forEach((element, i) => {
									memberData.push(element.CLIENTCODE);
									memberPer.push(parseFloat(element.EQUITYPERCENTAGE))
									element.img = 'img' + i;
								})
							}

							let productPer: any = [];
							let productData: any = [];

							this.productChartData = this.productSummaryData.sort((a, b) => parseFloat(b.EQUITYPERCENTAGE) - parseFloat(a.EQUITYPERCENTAGE));

							if (this.productChartData.length > 0) {
								this.productChartData.forEach((element, i) => {
									element.img = 'img' + i;
									productData.push(element.PRODUCT);
									productPer.push(this.numberFormat(element.EQUITYPERCENTAGE))

								})
								this.chartProdData = productPer;
							}

							this.productChartData = this.productChartData.sort((a, b) => parseFloat(b.per) - parseFloat(a.per));
							this.dataLoad = true;

							setTimeout(() => {
								// document.querySelectorAll(".category-panel-li")[0].classList.add("active");
								this.setDefaultTableClass();
							}, 2500);

							if (this.dataLoad) {
								this.chartDisplay(assetData, assetPer)
								if (this.memberGraph) {
									this.chartDisplay1(memberData, memberPer)
								}
								this.chartDisplay2(productData, productPer)
							}
							this.chartMemberData = memberData;
						}

						if (res['Body']['ClientProductDetailsMap'] && res['Body']['ClientProductDetailsMap'][0]['Successflag'] == 'N') {
							this.dataLoad = true;
							this.displayReport = false;
						}

					}
					else {
						this.dataLoad = true;
					}

				}, error => {
					this.dataLoad = true;
				})


		)
	}

	
	tabTableContent(panel_name: any, tabItem: any, name?: any) {
		if (this.document.querySelectorAll(".category-panel-li").length > 0) {
			this.document.querySelectorAll(".category-panel-li").forEach(function (item, i) {
				document.querySelectorAll(".category-panel-li")[i].classList.remove("active");
			});
			document.querySelectorAll(".category-panel-li")[panel_name].classList.add("active");
			this.document.querySelectorAll(".tab-content-block").forEach(function (item, i) {
				document.querySelectorAll(".tab-content-block")[i].classList.remove("active");
			});
			// panel_name.classList.add("active");
			document.querySelector(".tab-content-block." + tabItem)?.classList.add("active");
		}
	}

	tabTableContentMain(tabItem: string){   
		//const elements = this.document.querySelectorAll('.ac_tap');
		this.document.querySelectorAll(".ac_tap").forEach((item,i)=>{
			document.querySelectorAll(".ac_tap")[i].classList.add("d-none");
		});
		document.querySelectorAll(".ac_tap."+tabItem)[0].classList.remove("d-none");
		if(tabItem.toLowerCase() == 'plstatement_tab'){
			this.panelActiveMobile('Cash');
			this.segmentChangedYrDate("Yearwise");
		} 
		this.currentTab = tabItem;
		if(tabItem.toLowerCase() == "analytics_tab"){
			this.passDisplayAnalyticsSection = true;
			this.goToAnalytics();
		} else {
			this.passDisplayAnalyticsSection = false;
		}
	}
	onEquityDrop() {
		this.visible = !this.visible;
		this.dropvisible = false;
	}
	onDebtDrop() {
		this.dropvisible = !this.dropvisible;
		this.visible = false;
	}
	
	getMfDetails(clientId: any, consFlag: any, childCode?: any) {
		this.subscription.add(
			this.clientService.getClientMfDetails(this.portfolioToken, clientId, consFlag, childCode, this.portfolioUserId, this.clientType)
				.subscribe((res: any) => {

					if (res['Head']['ErrorCode'] == 0) {
						this.clientMfData = res['Body']['MFDetail'];
						this.hybridCatagory = [];
						this.equityCatagory = [];
						this.elssCatagory = [];
						this.debtCatagory = [];
						this.liquidCatagory = [];
						this.othersCatagory = [];

						this.totalMfHoldingValue = 0;
						this.totalMfUnrealizeGl = 0;
						this.totalMfCurrentValue = 0;

						if (this.clientMfData && this.clientMfData.length) {
							this.clientMfData.forEach((element) => {
								// element.avgPrice = (parseFloat(element.Current_Investment) / parseFloat(element.Present_Units)).toFixed(2);
								// if (element.avgPrice && parseInt(element.avgPrice) != 0) {
								// 	this.mfAnalyData.push({
								// 		'qty': element.Present_Units,
								// 		'avgPrice': element.avgPrice,
								// 		'ISIN': element.ISIN,
								// 		'stockCode': element.BSE_Scheme_Code,
								// 		'LTP': element.Present_NAV
								// 	})
								// }
								if(element.XIRR == ""){
									element.XIRR = 0;
								}
								const pnlValue = ((element.Unrealized_Profit / element.Current_Investment) * 100);
								element['pnlValue'] = pnlValue;
								if ((element.SCHEME_CATEGORY).includes('Hybrid') == true) {
									element.scheme_category = "Hybrid";
								}
								else if ((element.SCHEME_CATEGORY).includes('Equity') == true) {
									if ((element.SCHEME_CATEGORY).includes('Equity Linked Savings Scheme') == true) {
										element.scheme_category = "ELSS";
									}
									else {
										element.scheme_category = "Equity"
										this.equityCatagory.push(element);
									}
								}
								else if ((element.SCHEME_CATEGORY).includes('Debt') == true) {
									element.scheme_category = "Debt";
									
								}
								else if ((element.SCHEME_CATEGORY).includes('Other') == true) {
									element.scheme_category = "others";
									
								}
								else {
									element.scheme_category = element.SCHEME_CATEGORY;
								}

								element.Present_Units = parseFloat(element.Present_Units);
								element.Current_Investment = parseFloat(element.Current_Investment);
								element.Present_Value = parseFloat(element.Present_Value);
								element.Present_NAV = parseFloat(element.Present_NAV);
								element.XIRR = parseFloat(element.XIRR);
								element.Unrealized_Profit = parseFloat(element.Unrealized_Profit);
								element.pnlValue = parseFloat(element.pnlValue);

								this.totalMfHoldingValue = this.totalMfHoldingValue + parseFloat(element.Current_Investment);

								this.totalMfUnrealizeGl = this.totalMfUnrealizeGl + parseFloat(element.Unrealized_Profit);
								this.totalMfCurrentValue = this.totalMfCurrentValue + parseFloat(element.Present_Value);
							})

							this.mfHoldingPer = this.numberFormat((this.totalMfUnrealizeGl / this.totalMfHoldingValue) * 100);

							if(this.isBrokingClient){
								this.cardSegments[1]['value'] = this.commonService.numberFormatWithCommaUnit(this.totalMfCurrentValue);
								this.cardSegments[1]['pl'] = this.numberFormat(this.mfHoldingPer);
							} else {
								this.cardSegments[0]['value'] = this.commonService.numberFormatWithCommaUnit(this.totalMfCurrentValue);
								this.cardSegments[0]['pl'] = this.numberFormat(this.mfHoldingPer);
							}
							
							this.hybridCatagory = this.clientMfData.filter(element => {
								return element.scheme_category == 'Hybrid'
							})

							this.equityCatagory = this.clientMfData.filter(element => {
								return element.scheme_category == 'Equity'
							})

							this.elssCatagory = this.clientMfData.filter(element => {
								return element.scheme_category == 'ELSS'
							})

							this.debtCatagory = this.clientMfData.filter(element => {
								return element.scheme_category == 'Debt'
							})

							this.othersCatagory = this.clientMfData.filter(element => {
								return element.scheme_category == 'others'
							})
							this.segmentChangeMf('EquityData');

							this.clientMfData.sort((a, b) => {
								const schemeNameA = a.Scheme_Name.toUpperCase(); // Convert to uppercase for case-insensitive sorting
								const schemeNameB = b.Scheme_Name.toUpperCase();

								if (schemeNameA < schemeNameB) {
									return -1;
								}
								if (schemeNameA > schemeNameB) {
									return 1;
								}
								return 0; // Scheme names are equal
							});

							const obj: any = {
								"Scheme_Name": "Total",
								"scheme_category": '',
								"Present_Units": '-',
								"Current_Investment": this.calculateSum(this.clientMfData, 'Current_Investment'),
								"Present_Value": this.calculateSum(this.clientMfData, 'Present_Value'),
								"Present_NAV": '-',
								"XIRR": '-',
								"Unrealized_Profit": this.calculateSum(this.clientMfData, 'Unrealized_Profit'),
								//"pnlValue": this.calculateSum(this.clientMfData, 'pnlValue')
							}
							obj['pnlValue'] = (obj['Unrealized_Profit'] / obj['Current_Investment']) * 100

							this.clientMfData.push(obj);
						}
					}
				})
		)
	}
	
	//getClientMfDetails
	segmentChangeMf(value: any){
		if(value == 'elss'){
			this.mfTableDisplay = this.elssCatagory
		}
		if(value == 'debt'){
			this.mfTableDisplay = this.debtCatagory
		}
		if(value == 'hybrid'){
			this.mfTableDisplay = this.hybridCatagory
		}
		if(value == 'others'){
			this.mfTableDisplay = this.othersCatagory
		}
		if(value == 'EquityData'){
			this.mfTableDisplay = this.equityCatagory
		}
	}

	// presentPopover1(e: Event) {
	// 	this.popover.event = e;
	// 	this.isOpen = true;
	//   }

	breakDownFun(data: any, index: any){
		this.fdTableDisplay.forEach(element =>{
			element.breakDownOption = false;
		})
		this.fdTableDisplay[index]['breakDownOption'] = true;
	}

	clientClick(){
		if(!this.desktop){
			var element: any = this.document.getElementById("ClientMainBox");
			element.classList.toggle("d-none");
		}
		
	}
	clientClickpnl(){
		if(!this.desktop){
			var element: any = this.document.getElementById("ClientMainBoxPnl");
			element.classList.toggle("d-none");
		}
		
	}
	
	removeHover(e: any){
		// this.displayMainDropDown = false;
		if(this.desktop){
			var element: any = this.document.getElementById("ClientMainBox");
			element.classList.add("d-none");
		}
	}
	removeHoverpnl(e: any){
		if(this.desktop){
			var element: any = this.document.getElementById("ClientMainBoxPnl");
			element.classList.add("d-none");
		}
		// this.displayMainDropDown = false;
		
	}

	myClientselect(e: any) {
		if(this.desktop){
			var element: any = this.document.getElementById("ClientMainBox");
			element.classList.remove("d-none");
		}
		// this.displayMainDropDown = true;
		// var element1 = this.document.getElementById("ClientMainBox");
		// element1.classList.add("h-display");
		
	}
	myClientselectpnl(e: any) {
		
		if(this.desktop){
			var element: any = this.document.getElementById("ClientMainBoxPnl");
			element.classList.remove("d-none");
		}		
	}

	breakdownTable() {
		this.document.querySelector('.breakdownTable')?.classList.remove('d-none');
		this.document.querySelector('.tableoverlay')?.classList.remove('d-none');
		this.document.querySelector('#breakDown')?.classList.toggle("d-none");
		//this.document.querySelector('.select_client_dropdown_main').classList.add('d-none');
	}

	closeBreakdown() {
		document.querySelector('.breakdownTable')?.classList.add('d-none');
		document.querySelector('.tableoverlay')?.classList.add('d-none');
	}

	removeFamilyTable(dataObj: any) {
		//console.log("DataObj", dataObj);
		this.ParentClientCode = dataObj.ParentClientCode;
		this.MakerId = dataObj.ClientCode;
		this.document.querySelector('.removeFamilyTable')?.classList.remove('d-none');
		this.document.querySelector('.tableoverlay')?.classList.remove('d-none');
	}
	closeFamilyPop() {
		document.querySelector('.removeFamilyTable')?.classList.add('d-none');
		document.querySelector('.tableoverlay')?.classList.add('d-none');
	}
	
	addMemberForm() {
		if(!this.desktop){
			var element: any = this.document.getElementById("ClientMainBox");
			element.classList.toggle("d-none");
		}
		if (location.pathname == '/family-portfolio') {
			this.commonService.analyticEvent('Cl_Add_member_clicked', 'Client Add Member');
		}
		else{
			this.commonService.setClevertapEvent('Add_member_clicked', { 'PartnerCode': localStorage.getItem('userId1') });
			this.commonService.analyticEvent('Add_member_clicked', 'Family Portfolio Add Member');
		}
		this.document.querySelector('.addmemeberForm')?.classList.remove('d-none');
		this.document.querySelector('.tableoverlay')?.classList.remove('d-none');

		if(this.isBrokingClient){
			this.document.querySelector('.AddMemberOtpModel')?.classList.remove('d-none');
			this.document.querySelector('.modal-body-non-broking')?.classList.add('d-none');
			this.displayStep1 = true;
			this.displayStep2 = false;
			this.displayStep3 = false;
			this.otpInput = null;
			this.verifyBtn = true;
		this.reloadMappingAPI = false;
		if(this.reloadMappingAPI){
			this.resetFamilyDropdown(this.portfolioToken, this.ciphetText.aesEncrypt(this.parentClientCode))
		}
		} else {
			this.document.querySelector('.modal-body-non-broking')?.classList.remove('d-none');
			this.document.querySelector('.AddMemberOtpModel')?.classList.add('d-none');
		}
	}


	closeForm() {
		document.querySelector('.addmemeberForm')?.classList.add('d-none');
		document.querySelector('.tableoverlay')?.classList.add('d-none');
		this.resetForm();
		// let passParentClientCode = this.isBrokingClient ? this.ciphetText.aesEncrypt(this.parentClientCode) : this.parentClientCode;
		// this.resetFamilyDropdown(this.portfolioToken, passParentClientCode)
	}

	resetForm() {
		// const ele1 = document.getElementById('clientIdFrom') as HTMLInputElement;
		// ele1.style.display = 'block';
		// const ele = document.getElementById('otpBox') as HTMLInputElement;
		// ele.style.display = 'none';
		this.memberClientCode = null;
		this.selectRelation = null;
		this.otpInput = null;
		this.displayStep1 = true;
		this.displayStep2 = false;
		this.displayStep3 = false;
		this.verifyBtn = true;
		const ele1 = document.getElementById('memberPop') as HTMLInputElement;
		ele1.style.display = 'block';
	}

	transform(value: number): string {
		const minutes: number = Math.floor(value / 60);
		return (minutes < 10 ? '0' + minutes : minutes) + ':' + ((value - minutes * 60) < 10 ? '0' + (value - minutes * 60) : (value - minutes * 60))
	}
	resendTimer: any = "01:00";

	resendOtpTimer(){
		this.subscribeOtp = interval(1000).subscribe(res => {
			// this.resendTimer = this.resendTimer - res;
					this.resendTimer = this.transform(60 - res);
					if (res === 60) {
						this.subscribeOtp.unsubscribe();
						this.resendTimer = null
					}
		});
	}
	addMemberFormnext() {
		if (this.memberClientCode && this.selectRelation) {
			let params = {
				"Type": "Add",
				"FamilyName": this.memberClientCode,
				"MakerID": this.clientCode,
				"Relation": this.selectRelation,
				"OTP": ""
			}
			this.subscription.add(
				this.clientService.getMemberDetails(params, this.portfolioToken)
					.subscribe((res: any) => {
						if (res['Head']['ErrorCode'] == 0) {
							if (res['Body']['ClientFamilyMappingDetailsMapp']) {
								let getOtpObj = res['Body']['ClientFamilyMappingDetailsMapp'].filter((obj: any) => obj.ClientCode == this.memberClientCode && obj.Status == 'Inactive');
								this.checkOtp = getOtpObj[0]['OTP'];
								this.resendOtpTimer()
								localStorage.setItem('saveOtp', this.checkOtp);
								this.displayStep1 = false;
								this.displayStep2 = true;
								this.displayStep3 = false;
								//    this.document.querySelector('.step2').classList.remove('d-none');
								//    const ele1 = document.getElementById('clientIdFrom') as HTMLInputElement;
								//    ele1.style.display = 'none';
							}

						}
						else if (res['Head']['ErrorCode'] == 1 && res['Head']['ErrorDescription'].includes('already exist')) {
							let alredyExistClientObj = res['Body']['ClientFamilyMappingDetailsMapp'].filter((obj: any) => obj.ClientCode == this.memberClientCode && obj.Status == 'Inactive');
							this.resendOtpTimer();
							this.resendOTP();
							//this.toast.displayToast(res['Head']['ErrorDescription']);
						}
						else {
							this.toast.displayToast(res['Head']['ErrorDescription']);
						}
					})
			)

			//this.addVerifyMember('Add')
		}
		else {
			this.toast.displayToast('Please select input value')
		}

		// const btnEle = document.getElementById('verifyMemberBtn') as HTMLInputElement;
		// btnEle.disabled = true;
	}

	resetOtpClick(){
		if (this.resendTimer == null) {
			this.resendTimer = "01:00";
			this.resendOtpTimer();
			this.resendOTP('timer');
		}
	}

	resendOTP(otpTimer?: any) {
		let params = {
			"Type": "Resend",
			"FamilyName": this.memberClientCode,
			"MakerID": this.clientCode,
			"Relation": this.selectRelation,
			"OTP": ""
		}
		this.subscription.add(
			this.clientService.getMemberDetails(params, this.portfolioToken)
				.subscribe((res: any) => {
					if (res['Head']['ErrorCode'] == 0) {
						if (res['Body']['ClientFamilyMappingDetailsMapp']) {
							//if()
							let getOtpObj = res['Body']['ClientFamilyMappingDetailsMapp'].filter((obj: any) => obj.ClientCode == this.memberClientCode && obj.Status == 'Inactive');
							this.checkOtp = getOtpObj[0]['OTP'];

							localStorage.setItem('saveOtp', this.checkOtp);
							if(!otpTimer){
								this.displayStep1 = false;
								this.displayStep2 = true;
								this.displayStep3 = false;
							}
							//    this.document.querySelector('.step2').classList.remove('d-none');
							//    const ele1 = document.getElementById('clientIdFrom') as HTMLInputElement;
							//    ele1.style.display = 'none';
						}

					}
					else {
						this.toast.displayToast(res['Head']['ErrorDescription']);
					}
				})
		)
	}
	otpInput:any;

	onOtpChanged(event: any){
		this.otpInput = event
	}

	onotpFieldCompleted(event: any){
		// const btnEle = document.getElementById('verifyMemberBtn') as HTMLInputElement;
		// btnEle.disabled = false;
		this.verifyBtn = false;
	}

	reloadMappingAPI = false;
	verifyMember() {
		// if (this.otpInput == this.checkOtp) {
			let params = {
				"Type": "Verify",
				"FamilyName": this.memberClientCode,
				"MakerID": this.clientCode,
				"Relation": this.selectRelation,
				"OTP": this.otpInput
			}
			this.subscription.add(
				this.clientService.getMemberDetails(params, this.portfolioToken)
					.subscribe((res: any) => {
						if (res['Head']['ErrorCode'] == 0) {
							this.toast.displayToast(res['Body']['SuccessMsg']);
							const ele1 = document.getElementById('memberPop') as HTMLInputElement;
							ele1.style.display = 'none';
							this.displayStep1 = false;
							this.displayStep2 = false;
							this.displayStep3 = true;
							this.reloadMappingAPI = true;
							// this.document.querySelector('.step3').classList.remove('d-none');
							// const ele1 = document.getElementById('memberPop') as HTMLInputElement;
							// ele1.style.display = 'none';
						}
						else {
							this.toast.displayToast(res['Body'] ? res['Body']['ErrorDescription'] : res['Head']['ErrorDescription'])
						}
					})
			)
			//this.addVerifyMember('Verify', this.checkOtp);

		// }
		// else {
		// 	this.toast.displayToast('Invalid OTP');
		// }

	}

	breakDownList:any[] = [];
	breakDownTitle:any;
	productTypeValue:any;

	breakDownDetails(id: any, data: any) {
		this.pdfLoader = false;
		//this.breakDownTitle = data['value']
		this.subscription.add(
			this.clientService.getClientBreakDownDetails(id, data, this.portfolioToken, this.clientType)
				.subscribe((res: any) => {
					this.pdfLoader = true;
					if (res['Head']['ErrorCode'] == 0) {
						if (res['Body'].length > 0) {
							this.breakDownList = res['Body'];
						}
					}
					else {
						this.breakDownList = [];
					}

					document.querySelector('.breakdownTable')?.classList.remove('d-none');
					document.querySelector('.tableoverlay')?.classList.remove('d-none');
					document.querySelector('.select_client_dropdown_main')?.classList.add('d-none');
				})
		)
	}

	showPopover(ev: any, symbol: any, holdingValue: any, productType: any, scripName?: any) {
		this.productTypeValue = productType;
		this.breakDownTitle = productType == 'DE' || productType == 'MF' ? scripName : symbol;
		if (productType == 'DE') {
			if(this.displayBreakdown){
				this.openPopover(ev, symbol, holdingValue, productType,true);
			} else {
				this.openPopover(ev, symbol, holdingValue, productType, false);
			}
		}
		else {
			let clientID = this.isBrokingClient ? this.ciphetText.aesEncrypt(this.clientCode) : this.clientCode;
			let data = { value: symbol, type: productType }
			this.breakDownDetails(clientID, data)
		}

	}

	async openPopover(ev: any, symbol: any, holdingValue: any, productType: any, displayBreakDown: any) {
		const items = [
			{ value: symbol, type: productType, holding: holdingValue, displayBreakDown: displayBreakDown },
		]

		ev.stopPropagation();
		const popover = await this.popoverController.create({
			component: TableDropdownComponent,
			componentProps: { items: items },
			cssClass: this.displayBreakdown ? "dropdown-popover" : "dropdown-popover-without-breakdown",
			mode: "md",
			showBackdrop: false,
			event: ev
			// translucent: true
		});

		popover.onDidDismiss().then(data => {
			if (data["data"]) {
				if (data['data']['model'] == 'breakdown') {
					let clientID = this.ciphetText.aesEncrypt(this.clientCode);
					this.breakDownDetails(clientID, data['data']['result'])
				}
				else {
					setTimeout(() => {
						this.loadScript('../assets/js/tlpopup.js');
					}, 500);
				}

			}
		})
		return await popover.present();
	}

	public loadScript(url: string) {
		const body = <HTMLDivElement>document.body;
		const script = document.createElement('script');
		script.innerHTML = '';
		script.src = url;
		script.async = false;
		script.defer = true;
		body.appendChild(script);
	}

	chartDisplay(label?: any, data?: any) {

		setTimeout(() => {			

			this.chart1Data[0].data = data;
			this.chart1Labels = label;
			// this.dognut = new Chart(ctx, {
			// 	type: 'doughnut',
			// 	data: {
			// 		labels: label,
			// 		datasets: [{
			// 			data: data,
			// 			borderWidth: 0,
			// 			backgroundColor: ['#5E3FBE', '#A88DEB', '#84DDFC', '#f1956c']
			// 		}],
			// 	},
			// 	options: {
			// 		cutout: '80%',
			// 		responsive: true,
			// 		maintainAspectRatio: false,
			// 		plugins: {
			// 			legend: {
			// 				display: false
			// 			}
			// 		}
			// 	},
			// });
		}, 1000);
		
	}

	chartDisplay1(label?: any, data?: any) {
		setTimeout(() => {
			this.chart2Data[0].data = data;
			this.chart2Labels = label;
		// 	this.dognut1 = new Chart(this.chartJSContainer2.nativeElement, {
		// 		type: 'doughnut',
		// 		data: {
		// 			labels: label,
		// 			datasets: [{
		// 				data: data,
		// 				borderWidth: 0,
		// 				backgroundColor: ['#5E3FBE', '#A88DEB', '#84DDFC', '#F1956C', '#FFEA81']
		// 			}],
		// 		},
		// 		options: {
		// 			cutout: '80%',
		// 			responsive: true,
		// 			maintainAspectRatio: false,
		// 			plugins: {
		// 				legend: {
		// 					display: false
		// 				}
		// 			}
		// 		},
		// 	});
		}, 1000);
	}

	chartDisplay2(label?: any, data?: any) {
		setTimeout(() => {
			this.chart3Data[0].data = data;
			this.chart3Labels = label;
		// 	this.dognut2 = new Chart(this.chartJSContainer3.nativeElement, {
		// 		type: 'doughnut',
		// 		data: {
		// 			labels: label,
		// 			datasets: [{
		// 				data: data,
		// 				borderWidth: 0,
		// 				backgroundColor: ['#5E3FBE', '#A88DEB', '#84DDFC', '#F1956C', '#FFEA81', '#593CC7', '#0080B2']
		// 			}],
		// 		},
		// 		options: {
		// 			cutout: '80%',
		// 			responsive: true,
		// 			maintainAspectRatio: false,
		// 			plugins: {
		// 				legend: {
		// 					display: false
		// 				}
		// 			}
		// 		},
		// 	});
		}, 1000);
	}

		familyMemberPdfGraphDisplay(label?: any, data?: any) {

			setTimeout(()=> {
				this.pdfFamilyData[0].data = data;
				this.pdfFamilyLabels = label;
			},400);
		// let ab: any;
		// ab = document.getElementById('familyMemberPDFGraph');
		// this.dognut1 = new Chart((ab), {
		// 	type: 'doughnut',
		// 	data: {
		// 		labels: label,
		// 		datasets: [{
		// 			data: data,
		// 			borderWidth: 0,
		// 			backgroundColor: ['#FF4F01', '#FF9000', '#F9C501', '#8BCA01', '#00B29C']
		// 		}],
		// 	},
		// 	options: {
		// 		cutout: '70%',
		// 		responsive: true,
		// 		maintainAspectRatio: false,
		// 		plugins: {
		// 			legend: {
		// 				display: false
		// 			}
		// 		}
				
		// 	},
		// });

	}

	productPDFGraph(label?: any, data?: any) {

		setTimeout(() => {
			this.pdfproductWiseData[0].data = data;
			this.pdfproductWiseLabels = label;
	
			// let canvas2: any = document.querySelector('#printDiv');
				//creates image
				//   var canvasImg = canvas.toDataURL("image/jpeg", 1.0);
			// var dataURL2 = canvas2.toDataURL();
	
			// let img = this.printDiv.nativeElement.toDataURL('image/png');
			// this.pdf.addImage(dataURL2, 'JPEG', 20, 350, 150, 150);
			// this.pdf.save("test-file");
		}, 400);
		
		// let ab: any;
		// ab = document.getElementById('productWise');
		// setTimeout(() => {
		// 	this.dognut2 = new Chart(ab, {
		// 		type: 'doughnut',
		// 		data: {
		// 			labels: label,
		// 			datasets: [{
		// 				data: data,
		// 				borderWidth: 0,
		// 				// backgroundColor: ['#FF4F01', '#FF9000', '#84DDFC', '#F1956C', '#FFEA81', '#593CC7']
		// 				backgroundColor: ['#FF4F01', '#FF9000', '#F9C501', '#8BCA01', '#00B29C', '#0080B2']
		// 			}],
		// 		},
		// 		options: {
		// 			cutout: '70%',
		// 			responsive: true,
		// 			maintainAspectRatio: false,
		// 			plugins: {
		// 				legend: {
		// 					display: false
		// 				}
		// 			}	
		// 		},
		// 	});
		// }, 1000);

	}
	
	// displayTreeChart:boolean = false;
	
	chartType(type: any) {

		if (type == 'tree') {
			this.displayTreeChart = true;
			const ele1 = document.getElementById('chartHide') as HTMLInputElement;
			ele1.style.display = 'none';
			this.treeMapOptionList.forEach(element => {
				element.value = false
			})
			this.treeDataRender = [];
			this.treeMapOptionList[0].value = true;
			//this.selectTreeOption('asset')
		}
		else {
			this.displayTreeChart = false;
			const ele1 = document.getElementById('chartHide') as HTMLInputElement;
			ele1.style.display = 'block';
			this.selectTreeOption('asset')
		}
	}

	
	getShortName(value: any){
		if(value && value.length){
			var shortName = value.match(/\b(\w)/g); // ['J','S','O','N']
			return shortName.join('');
		}

	}

	portfolioForm() {
		let url;
		if (location.pathname == '/client-portfolio') {
			url = 'https://forms.gle/5wJ16ssQtqCWJbtq5';
		}
		else {
			url = "https://forms.gle/mLwwZzXRmzHFYbqb6";
		}

		window.open(url, '_blank');
	}


	goToAccDetail() {
		if(!this.displayClientDropDownField)return;
	
		if (location.pathname == '/client-portfolio') {
			this.commonService.setClevertapEvent('Account_Summary_clicked', { 'PartnerCode': localStorage.getItem('userId1') });
			this.commonService.analyticEvent('Account_Summary_clicked', 'Family Portfolio Account Summary');
			localStorage.setItem('familyClientId', this.parentClientCode);
			this.router.navigate(['/client-account-details', this.clientCode]);
		}
		else {
			this.commonService.analyticEvent('Cl_Account_Summary_clicked', 'Client Account Summary Clicked');
			this.router.navigate(['/client-portfolio-details', this.clientCode]);
		}

	}

	mfSecData: any = [];

	goToAnalytics() {
		this.mfSecData = [];
        this.eqAnalyData = [];
        this.mfAnalyData = [];
		this.clientEqData.forEach(element => {
			if (element.AVGPURCHASEPRICE != '-' && parseInt(element.AVGPURCHASEPRICE) != 0) {
				this.eqAnalyData.push({
					'qty': element.QUANTITY,
					'avgPrice': element.AVGPURCHASEPRICE,
					'ISIN': element.ISIN,
					'stockCode': element.BSECODE,
					'LTP': element.PreviousClosingPrice
				})
			}   
		})
		this.mfSecData = this.clientMfData.filter(element => {
			return element.Scheme_Name != 'Total'
		})
		this.mfSecData.forEach((element: any) => {
			element.avgPrice = (parseFloat(element.Current_Investment) / parseFloat(element.Present_Units)).toFixed(2);
				 if (element.avgPrice && element.avgPrice != 0) {
					this.mfAnalyData.push({
						'qty': element.Present_Units,
						'avgPrice': element.avgPrice,
						'ISIN': element.ISIN,
						'stockCode': element.BSE_Scheme_Code,
						'LTP': element.Present_NAV
					})
				 }
		})

		let eqMfHoldings = this.mfAnalyData.concat(this.eqAnalyData);
		localStorage.setItem('totalHoldings', JSON.stringify(eqMfHoldings));
		if (location.pathname == '/client-portfolio') {
			this.commonService.setClevertapEvent('Analytics_clicked', { 'PartnerCode': localStorage.getItem('userId1') });
			this.commonService.analyticEvent('Analytics_clicked', 'Family Portfolio Analytics');
			// this.router.navigate(['/analytics']);
		}
		else {
			// this.router.navigate(['/portfolio-analytics']);
			this.commonService.analyticEvent('Cl_Analytics_clicked', 'Client Analytics');
		}

	}

	treeDataRender:any[] = [];

	selectTreeOption(option: any){
		
		this.treeMapOptionList.forEach(element => {
			element.value = false
		})
		this.treeDataRender = [];
		if(option == 'family'){
			this.treeMapOptionList[1].value = true;
			if(this.memberData.length > 0)
			this.memberData.forEach(element => {
				this.treeDataRender.push({
					x : element.CLIENTCODE,
					y: element.EQUITYPERCENTAGE
				})	
			});
			this.renderTreeChart(this.treeDataRender)
		}
		else if(option == 'products'){
			//this.treeMapOptionList[2].value = true;
			if(this.treeMapOptionList.length < 3){
				this.treeMapOptionList[1].value = true;
			}
			else{
				this.treeMapOptionList[2].value = true;
			}
			if(this.productChartData.length > 0){
				this.productChartData.forEach(element => {
					this.treeDataRender.push({
						x : element.PRODUCT == 'DE' ? 'Stocks' : element.PRODUCT,
						y: element.EQUITYPERCENTAGE
					})	
				});
				this.renderTreeChart(this.treeDataRender)
			}
		}
		else if(option == 'asset'){
			this.treeMapOptionList[0].value = true;
			if(this.productAssetSummary.length > 0){
				this.productAssetSummary.forEach(element => {
					this.treeDataRender.push({
						x : element.ASSET == 'E' ? 'Equity' : element.ASSET == 'H' ? 'Hybrid' : element.ASSET == 'D' ? 'Debt' : element.ASSET == 'L' ? 'Liquid' : element.ASSET,
						y: element.EQUITYPERCENTAGE
					})	
				});
				this.renderTreeChart(this.treeDataRender)
			}
			
			
		}

		
	}


		
	// }

	resetFamilyDropdown(token: any, id: any) {
		this.subscription.add(
			this.clientService.getFamilyMapping(token, id, this.portfolioUserId, this.clientType)
				.subscribe((res: any) => {
					if (res['Head']['ErrorCode'] == 0) {
						if (res['Body']['FamillyMapp'].length > 0) {
							if (res['Body']['FamillyMapp'][0]['Successflag'] == 'N') {
								this.familyMappList = [];
							}
							else {
								this.familyMappList = res['Body']['FamillyMapp'];
							}

						}
						else {
							this.familyMappList = [];
						}

					}
				})
		)
	}


	// PDF & Excel Download
	onPdfExcelDownload(type: any, tableTitle: any) {
		// if (this.eqTableDisplay && this.eqTableDisplay.length > 0) {
		this.dataLoad = false;
		let head: any;
		let info: any = [];

		if (tableTitle === 'stock') {
			head = [["Scrip Name ", "Qty", "Purchase Price", "Invested Value", "Current Price", "Current Value", "Dividends Announced", "3yr Returns","Net Profit/ Loss", "Profit/ Loss %"]];
			this.eqTableDisplay.forEach((element) => {
				info.push([element.INSTRUMENTNAME, this.convertFunc(element.QUANTITY), this.convertFunc(element.AVGPURCHASEPRICE), this.convertFunc(element.HOLDINGCOST), element.PreviousClosingPrice ? this.convertFunc(element.PreviousClosingPrice) : '0', this.convertFunc(element.MARKETVALUE), element.DIVIDENT == '-' ? '-' : this.convertFunc(element.DIVIDENT) , this.convertFunc(element.Get_three_year_change), this.convertFunc(element.UNREALIEDGL), this.convertFunc(element.UNRLGAINLOSSPER)]);
			});
		} else if (tableTitle === 'mf') {
			head = [["Scrip Name ", "Units", "Invested Value", "Current Value", "NAV", "XIRR", "Net Profit/ Loss", "P&L %"]];
			this.mfTableDisplay.forEach((element) => {
				info.push([element.Scheme_Name, this.convertFunc(element.Present_Units), this.convertFunc(element.Current_Investment), this.convertFunc(element.Present_Value), this.convertFunc(element.Present_NAV), this.convertFunc(element.XIRR), this.convertFunc(element.Unrealized_Profit), this.convertFunc(element.pnlValue)]);
			});
		} else if (tableTitle === 'fd') {
			head = [["Company Name", "Tenure", "Date of Investment", "Invested Value", "ROI", "Maturity Date"]];
			this.fdTableDisplay.forEach((element) => {
				info.push([element.FDCompany, element.Tenor, this.formatChange(element.FDBookingDate), this.convertFunc(element.FDBookingAmount), element.RateOfInterest, this.formatChange(element.FDMaturityDate)]);
			});
		} else if (tableTitle === 'bonds') {
			head = [["Bond Name", "Invested Value", "ROI", "Maturity Date", "ISIN"]];
			this.bondsTableDisplay.forEach((element) => {
				info.push([element.BondCompany, this.convertFunc(element.BondAmount), element.Rateofinterest, this.formatChange(element.BondMaturityDate), element.ISIN]);
			});
		} else if (tableTitle === 'aif') {
			head = [["Scheme Name", "Date of Investment", "Invested Value", "Current Value", "Commitment Amount", "Net P&L", "P&L%"]];
			this.aifTableDisplay.forEach((element) => {
				info.push([element.SCHEMENAME, this.formatChange(element.CREATEDON), this.convertFunc(element.NETINVESTMENT), this.convertFunc(element.CRRENTVALUE), this.convertFunc(element.COMMITMENTAMOUNT), this.convertFunc(element.netpl), this.convertFunc(element.plPer)]);
			});
		} else if (tableTitle === 'pms') {
			head = [["Scheme Name", "Date of Investment", "Invested Value", "Current Value", "Net P&L", "P&L%"]];
			this.pmsTableDisplay.forEach((element) => {
				info.push([element.SCHEMENAME, this.formatChange(element.CREATEDON), this.convertFunc(element.NETINVESTMENT), this.convertFunc(element.CRRENTVALUE), this.convertFunc(element.netpl), this.convertFunc(element.plPer)]);
			});
		}

		if (type === 'pdf') {
			this.commonService.savePdfFile(head, info);
			this.dataLoad = true;
		} else {
			this.commonService.exportDataToExcel(head[0], info, 'Report');
			this.dataLoad = true;
		}
		// } else {
		// 	this.toast.displayToast('No Data Found');
		// }
	}

	convertFunc(val: any){
        if(val){
            let value = parseFloat(val);
            return parseFloat(value.toFixed(2));
        }
		return val;
    }

	formatChange(date: any, format? : string){

		if(format) return moment(date).format(format);
        return moment(date).format('DD/MM/YYYY');
    }

	//Sorting
	setOrder(value: string) {
		this.reverse = !this.reverse;
		this.order = value;
		if (this.reverse) {
			this.ascending = false;
			this.val = 'desc';
		} else {
			this.ascending = true;
			this.val = 'asc';
		}
	}

	downloadPdfReport(){
		document.querySelector('.downloadReport')?.classList.remove('d-none');
		document.querySelector('.tableoverlay')?.classList.remove('d-none');
		document.querySelector('.select_client_dropdown_main')?.classList.add('d-none');

		this.selectedReport = [];
		this.reportType = this.reportType.map((item: any) => ({ ...item, isChecked: false }));
		this.displayDuration = false;
		this.dateRangeType = 'yearWise';
		this.setInitialDates();
	}

	goBack(){
		window.history.back();
	}

	toggleDateRange(value: any) {
		this.dateRangeType = value;
		if (value == 'dateWise') {
			this.fromDate = this.commonService.lastMonthISOConverted('previous');
			this.ionFromDate = this.commonService.getIonDateTimeFormat(this.fromDate);
			this.toDate = this.commonService.lastMonthISOConverted('current');
			this.ionToDate = this.commonService.getIonDateTimeFormat(this.toDate);
		}
		else {
			this.yearRangeValue = this.financialYrList[0];
			this.fromDate = new Date(this.yearRangeValue.split('-')[0] + '-' + '04' + '-' + '01');
			this.ionFromDate = this.commonService.getIonDateTimeFormat(this.fromDate);
			this.toDate = new Date();
			this.ionToDate = this.commonService.getIonDateTimeFormat(this.toDate);
		}
	}

	toogleCheck(){

	}

	closeDownloadreport() {
		document.querySelector('.downloadReport')?.classList.add('d-none');
		document.querySelector('.tableoverlay')?.classList.add('d-none');
	}

	callRealizedPlAPIs(token?: any) {
		this.pdfLoader = false;
		this.closeDownloadreport();

		let payload = {
			clientCode: this.realizedClientCode,
			fromDate: moment(this.fromDate).format('YYYYMMDD'),
			ToDate: moment(this.toDate).format('YYYYMMDD'),
			product: '',
		}
		const apiCalls = [];
		for (let i = 1; i <= 4; i++) {
			if (i === 1) {
				payload.product = 'cash';
			} else if (i === 2) {
				payload.product = 'f&o';
			} else if (i === 3) {
				payload.product = 'currency';
			} else if (i === 4) {
				payload.product = 'commodity';
			}
			const observable = this.shareReportSer.getRealizedPl(token, payload);
			apiCalls.push(observable);
		}
		forkJoin(apiCalls)
			.subscribe(
				results => {
					results.forEach((res, index) => {
						if (res['Head']['ErrorCode'] == 0) {
							if (res['Body']['Realized'].length > 0) {
								this.realizedPlData = [...this.realizedPlData, {
									"pageTitle": "P&L Statement",
									"pageNumber": "4",
									"subTitle": `${index === 0 ? 'Cash' : index === 1 ? 'f&o' : index === 2 ? 'currency' : 'commodity'}`,
									"hasTable": true,
									"tableHead": [
										"Scrip Name",
										"ISIN",
										"Qty",
										"Buy Avg Rate",
										"Buy Charges",
										"Buy Value",
										"Sell Avg Rate",
										"Sell Charges",
										"Sell Value",
										"Long Term PL",
										"Short Term PL",
										"Intraday PL",
										"Total PL",
									],
									"totalData": res['Body']['Realized'],
								}]
							}
						}
						if (index === 3) {
							this.callMFPNLStatement();
							index++;
						}
						if (index === 4) {
							this.GetTotalEquityDividend("1", true);
						}
					});
				},
				error => {
					console.error('Error in one or more API calls:', error);
				}
			);
	}

	callMFPNLStatement = () => {
		const start_date = moment(this.fromDate).format('DD/MM/YYYY'); // from_Date
		const end_date = moment(this.toDate).format('DD/MM/YYYY'); // to_Date
		this.subscription.add(
			this.clientService.getMFPNLStatement(this.portfolioToken, this.clientCode, start_date, end_date, localStorage.getItem('userId1'),
				this.clientType)
				.subscribe((res: any) => {
					if (res['Head']['ErrorCode'] == 0) {
						let consRealizedPlList = [];
						const reportArray = this.selectedReport.map((item: any) => item.value);
						if (res['Body']['Table3'] && res['Body']['Table3'].length > 0) {
							var result = this.groupBy1(res['Body']['Table3'], function (item: any) {
								return [item.Scheme_Name];
							});
							const grandTotalMFpnl = res['Body']['Table3'][res['Body']['Table3'].length - 1];
							for (var j in result) {
								if (result[j]["Scheme_Name"] !== "") { // review
									var combineObj = {
										"srNo": parseInt(Object.keys(result)[j]),
										"Scheme_Name": result[j][0].Scheme_Name,
										"TransactionType": result[j][0].Transaction_Type,
										"Transaction_Type": "",
										"Transaction_Date": "",
										"Purchase_Price": "",
										"Units": result[j].reduce((el: any, li: any) => el + parseFloat(li.Units), 0),
										"Purchase_Amount": result[j].reduce((el: any, li: any) => el + parseFloat(li.Purchase_Amount), 0),
										"Sell_Date": "",
										"Sell_Type": "",
										"Sell_Rate": "",
										"Sell_Amount": result[j].reduce((el: any, li: any) => el + parseFloat(li.Sell_Amount), 0),
										"Days": "",
										"GL_ST_Debt": result[j].reduce((el: any, li: any) => el + parseFloat(li.GL_ST_Debt), 0),
										"GL_ST_Equity": result[j].reduce((el: any, li: any) => el + parseFloat(li.GL_ST_Equity), 0),
										"GL_LT_Debt": result[j].reduce((el: any, li: any) => el + parseFloat(li.GL_LT_Debt), 0),
										"GL_LT_Equity": result[j].reduce((el: any, li: any) => el + parseFloat(li.GL_LT_Equity), 0),
										"STT": "",
										"ISIN": "",
										"RIA_FLAG": "",
										"isSumRow": true
									};
									consRealizedPlList.push(combineObj);
									consRealizedPlList.push(...result[j]);
								}
							}
							consRealizedPlList = [...consRealizedPlList.sort((a, b) => (a.ScripName > b.ScripName) ? -1 : 1), {
								...grandTotalMFpnl,
								INSTRUMENTNAME: "Total"
							}];
							this.realizedPlData = [...this.realizedPlData, {
								"pageTitle": "P&L Statement",
								"pageNumber": "4",
								"subTitle": 'MF',
								"hasTable": true,
								"tableHead": [
									"Scheme Name",
									"Transaction Type",
									"Purchase Price",
									"Units",
									"Purchase Amount",

									"Sell Type",
									"Sell Rate",
									"Sell Amount",
									"Days",
									"G/L ST(Debt)(INR)",
									"G/L ST (Equity)(INR)",
									"G/L LT(Debt)(INR)",
									"G/L LT (Equity)(INR)",
									"STT(INR)",
								],
								"totalData": consRealizedPlList,
							}]
							// this.generateTablesHTML(reportArray);
							// this.closeDownloadreport();
						} else {
							consRealizedPlList = [];
							// if (reportArray.length === 1 && reportArray.includes('pl')) {
							// 	if (this.realizedPlData.length === 0) {
							// 		this.toast.displayToast('No record found');
							// 		this.pdfLoader = true;
							// 	} else {
							// 		this.generateTablesHTML(reportArray);
							// 		this.closeDownloadreport();
							// 	}
							// } else {
							// 	this.generateTablesHTML(reportArray);
							// 	this.closeDownloadreport();
							// }
						}
					}
				})
		)
	}
		
	//submit report popup option
	downloadSelectdpdf() {
		const reportArray = this.selectedReport.map((item: any) => item.value);
		if (reportArray.includes('pl')) {
			this.realizedPlData = [];
			this.callRealizedPlAPIs(this.portfolioToken)
		} else {
			// user not choose pl
			this.generateTablesHTML(reportArray);
			this.closeDownloadreport();
		}
		//console.log(document.querySelectorAll('.report_type_list'))
	}

	selectReportType(data: any) {
		if (!data.isChecked) {
			this.selectedReport = [...this.selectedReport, data];
		} else {
			this.selectedReport = this.selectedReport.filter((item: any) => item.value !== data.value)
		}
		if (data.value === 'pl') {
			this.family_member_value = this.familyMappList[0].ClientName;
			this.realizedClientCode = this.familyMappList[0].ClientCode;
			this.familyMemberList = this.familyMappList.map((item)=>item.ClientName);
			this.dateRangeType = 'yearWise';
			this.displayDuration = !data.isChecked;
			this.setInitialDates();
		}
	}

	getStockData = () => {
		if(this.isBrokingClient){
			return `
			<tr style="color: #000;
			font-family: 'Inter', sans-serif;
			font-size: 11px;
			font-style: normal;
			font-weight: 500;
			line-height: normal; width: 782px;
			height: 45px;
			flex-shrink: 0;">
			<td style="text-align: left; padding-left: 2.5%;" colspan="2">Stocks</td>
			<td style="text-align: right;">${this.numberFormat(this.totalEqCurrentValue)}</td>
			<td style="text-align: right;">${this.numberFormat(this.eqAllocation)}%</td>
			<td style="text-align: right;">${this.numberFormat(this.totalEqUnrealizeGl)}</td>
			<td style="text-align: right; padding-right: 2.5%; color:${(+this.eqHoldingPer > 0 ? '#009E3B' : (+this.eqHoldingPer < 0 ? '#DF514C' : '#000000')) }">${this.eqHoldingPer < 0 ? '(' : ''}${this.numberFormat(this.eqHoldingPer)}${this.eqHoldingPer < 0 ? ')' : ''}</td>
			</tr>`
		}else {
			return '';
		}
	}

	setDefaultTableClass = () => {

		let stopLoop: boolean = false;
		this.cardSegments.forEach(segment => {
			if(segment.value != '0' && !stopLoop){
				this.tabTableContent(segment.sequence, segment.table, segment.segmentValue);
				stopLoop = true;
				return;
			}
		});
	}
	// pnl revamp //
	yearDateOption: string = 'yearWise';
	realizedPlObj: any
	fromDateReq: any;
	toDateReq: any;
	//  Select the value of 1month or 1week
	segmentChangedWkMonth(event: any) {
		// console.log(event)
		if (event == '1M') {
			this.fromDate = this.commonService.lastMonthISOConverted('previous');
			this.ionFromDate = this.commonService.getIonDateTimeFormat(this.fromDate);
			this.toDate = this.commonService.lastMonthISOConverted('current');
			this.ionToDate = this.commonService.getIonDateTimeFormat(this.toDate);
		}
		else {
			this.fromDate = this.commonService.lastWeekISOConverted('last');
			this.ionFromDate = this.commonService.getIonDateTimeFormat(this.fromDate);
			this.toDate = this.commonService.lastWeekISOConverted('first');
			this.ionToDate = this.commonService.getIonDateTimeFormat(this.toDate);
		}
	}
	//  Select the Segment Type
	segmentChangedYrDate(event: any) {
		if (event == 'dateWise') {
			this.fromDate = this.commonService.lastMonthISOConverted('previous');
			this.ionFromDate = this.commonService.getIonDateTimeFormat(this.fromDate);
			this.toDate = this.commonService.lastMonthISOConverted('current');
			this.ionToDate = this.commonService.getIonDateTimeFormat(this.toDate);
		}
		else {
			this.yearRangeValue = this.financialYrList[0];
			this.fromDate = new Date(this.yearRangeValue.split('-')[0] + '-' + '04' + '-' + '01');
			this.ionFromDate = this.commonService.getIonDateTimeFormat(this.fromDate);
			this.toDate = new Date();
			this.ionToDate = this.commonService.getIonDateTimeFormat(this.toDate);
		}
		if(window.innerWidth <800){
			this.realisedPnlApiCall();
			this.getMFPNLStatement();
		} else {
			this.disablePnlTabs();
		}
	}
	
	//  Select the financial Yr from year dropdown
	selectYrFromList(event: any) {
		// console.log(event);
		if (event == this.getCurrentFinancialYear()) {
			this.fromDate = new Date(this.yearRangeValue.split('-')[0] + '-' + '04' + '-' + '01');
			this.ionFromDate = this.commonService.getIonDateTimeFormat(this.fromDate);
			this.toDate = new Date();
			this.ionToDate = this.commonService.getIonDateTimeFormat(this.toDate);
		}
		else {
			this.fromDate = new Date(event.split('-')[0] + '-' + '04' + '-' + '01');
			this.ionFromDate = this.commonService.getIonDateTimeFormat(this.fromDate);
			this.toDate = new Date(event.split('-')[1] + '-' + '03' + '-' + '31');
			this.ionToDate = this.commonService.getIonDateTimeFormat(this.toDate);
		}
		this.disablePnlTabs();
	}
	productTypeList: any[] = [
		{ option: 'Cash', value: 'Cash', selected: false },					// [0]
		{ option: 'Currency', value: 'currency', selected: false },			// [1]
		{ option: 'Commodity', value: 'commodity', selected: false },		// [2]
		{ option: 'F&O', value: 'f&o', selected: false },					// [3]
		{ option: 'MF', value: 'MF', selected: false },						// [4]
		{ option: 'Dividend', value: 'dividend', selected: false },			// [5]
	]
	productValue = 'Cash';
	
	// Submit on Report Button in web view
	onDateChanged(event: any,dateType: any) {
		this.disablePnlTabs();
	}

	pnlDropdownClicked = (obj: any) => {
		this.pnlClientCode = null;
		
		this.pnlClientName = obj['ClientName'] ? obj['ClientName'] : "Name Not Available";
		this.pnlClientCode = obj['ClientCode'];
		this.pnlDisplayRelation = obj['Relation'];
		//this.realisedPnlApiCall();
		this.disablePnlTabs();
		if(!this.desktop){
			var element: any = this.document.getElementById("ClientMainBoxPnl");
			element.classList.toggle("d-none");
		}
	}
	panelActive(type: string){
		
		type = type.toLowerCase();
		this.productValue = type;
		this.productTypeList[0].selected = false;
		this.productTypeList[1].selected = false;
		this.productTypeList[2].selected = false;
		this.productTypeList[3].selected = false;
		this.productTypeList[4].selected = false;
		this.productTypeList[5].selected = false;
		setTimeout(() => {
			if(type == 'mf'){
				this.productTypeList[4].selected = true;
				// api call
				this.tabPanelPnlTable = "mf";
				this.getMFPNLStatement();
			} 
			else if(type == 'dividend'){

				this.productTypeList[5].selected = true;
				this.tabPanelPnlTable = "dividend";
				this.GetTotalEquityDividend();
			} else {
				this.tabPanelPnlTable = "realised";
				if(type == 'cash'){
					this.productTypeList[0].selected = true;
				}
				else if(type == 'currency'){
					this.productTypeList[1].selected = true;
				}
				else if(type == 'commodity'){
					this.productTypeList[2].selected = true;
				}
				else if(type == 'f&o'){
					this.productTypeList[3].selected = true;
				}
				this.realisedPnlApiCall();
			}
		},100);
	}
	panelActiveMobile(type:any){
		if(window.innerWidth <800){
			this.productValue = type;
			setTimeout(() => {
				if(type == 'MF'){
					this.tabPanelPnlTable = "mf";
					this.getMFPNLStatement();
				} else if(type == "dividend"){
					this.tabPanelPnlTable = "dividend";
					this.GetTotalEquityDividend();
				}else {
					this.productValue = type;
					this.tabPanelPnlTable = "realised";
					this.realisedPnlApiCall();
				}
			},100);
		}
	}

	realisedPnlApiCall() {
		this.fromDateReq = this.fromDate;
		this.toDateReq = this.toDate;
		if (this.pnlClientCode) {
			//if (this.selectedShareType == 'realised') {
				this.commonService.setClevertapEvent('Realised PnL', { 'Login ID': localStorage.getItem('userId1') });
				if (this.commonService.convertDateToMillisec(this.fromDateReq) > this.commonService.convertDateToMillisec(this.toDateReq)) {
					this.toast.displayToast('from Date cannot be more than To Date');
				}
				else {
					this.realizedPlObj = {}
					this.realizedPlObj.clientCode = this.pnlClientCode
					this.realizedPlObj.fromDate = moment(this.fromDateReq).format('YYYYMMDD')
					this.realizedPlObj.ToDate = moment(this.toDateReq).format('YYYYMMDD')
					this.realizedPlObj.product = this.productValue;
					this.realizedPlObj.portfolioToken = this.portfolioToken;
					this.realizedPlObj.callFrom360 = true;
					this.commonService.setClevertapEvent('Realised_PnL');
					// console.log(this.realizedPlObj);
					this.tabPanelPnlTable = "realised";
				}
		} else {
			this.toast.displayToast('Please Enter the Client Code');
		}
	}

	disablePnlTabs = () => {
		this.productValue = "Cash";
		this.productTypeList[0].selected = false;
		this.productTypeList[1].selected = false;
		this.productTypeList[2].selected = false;
		this.productTypeList[3].selected = false;
		this.productTypeList[4].selected = false;
		this.productTypeList[5].selected = false;
		this.tabPanelPnlTable = "";
		this.grandTotalMFpnl = {};
	}

	removeMember(){
		let params = {
			"Type": "Delete",
			"FamilyName": this.MakerId,
			"MakerID": this.ParentClientCode,
			"Relation": this.displayRelation,
			"OTP": ""
		}
		this.subscription.add(
			this.clientService.getMemberDetails(params,this.portfolioToken)
				.subscribe((res: any) => {
					if(res['Head']['ErrorCode'] == 0){
						this.toast.displayToast(res['Body']['SuccessMsg'])
						this.displayClientDetails(this.selectedDropdownClient);		
						this.closeFamilyPop();			
					}
					else{
						this.closeFamilyPop();
						this.toast.displayToast(res['Body']['ErrorDescription']);
					}
				})
		)
	}

	checkIfSelf = (relation: string) => {
		if(relation == "" || relation.toLowerCase() == "self"){
			return false;
		}
		return true;
	}

	toggleStartDatePicker(downloadDatePicker: boolean) {
		if(downloadDatePicker){
			this.isDownloadDatePicker = true;
		} else {
			this.isDownloadDatePicker = false;
		}
		this.showStartDatePicker = !this.showStartDatePicker;
		// Optional: Hide end date picker if shown
		this.showEndDatePicker = false;
	}
	
	toggleEndDatePicker(downloadDatePicker: boolean) {
		if(downloadDatePicker){
			this.isDownloadDatePicker = true;
		} else {
			this.isDownloadDatePicker = false;
		}
		this.showEndDatePicker = !this.showEndDatePicker;
		// Optional: Hide start date picker if shown
		this.showStartDatePicker = false;
	}
	

	hideDatePicker( type: string, event?:any) {
		// Update selectedDate with the changed value
		const datediv = this.elementRef.nativeElement.querySelector('ion-datetime');
		const isMonthYearDisplayed = datediv.classList.contains('show-month-and-year');
		
		if (!isMonthYearDisplayed) {
			if (type === 'start') {
				this.showStartDatePicker = false;
				if(event != undefined){
					this.onStartDateChanged();
				}
			} else if (type === 'end') {
				this.showEndDatePicker = false;
				if(event != undefined){
					this.onEndDateChanged1();
				}
			} else if (type.toLowerCase() == "till"){
				this.showStartDatePicker = false;
				if(event != undefined){
					this.onStartDateChanged();
				}
			}
		}
	}

	onStartDateChanged() {
		if(new Date(this.ionFromDate) > new Date(this.ionToDate)){
			this.toast.displayToast("From date cannot be greater than To Date");
			this.segmentChangedWkMonth("1M");
			return;
		}
		this.fromDate = new Date(this.ionFromDate);
	}
	// new code end date
	onEndDateChanged1() {
		if(new Date(this.ionFromDate) > new Date(this.ionToDate)){
			this.toast.displayToast("From date cannot be greater than To Date");
			this.segmentChangedWkMonth("1M");
			return;
		}
		this.toDate = new Date(this.ionToDate);
	}

	/**
	 * Download Invest Edge Excel for stocks.
	 */
	onExcelDownload() {
		this.dataLoad = false;
		let workbook = new Workbook();
		// INSTRUCTIONS SHEET
		let instInfo = [];
		instInfo.push([""]);
		instInfo.push(['1. Columns with headers marked in "Red" color shall be mandatorily filled to facilitate portfolio update on platform']);
		instInfo.push([""]);
		instInfo.push(['2. For Mutual Funds, in case of Credit Transactions like "Switch Out" or "Redemption", Purchase Units should be in negative format For example, you redeem 100 units of Parag Parikh Flexi Cap Fund-Reg(G) at NAV 66, so you shall put Purchase Units as -100 & NAV as 66']);
		instInfo.push([""]);
		instInfo.push(['3. Make sure to provide latest ISIN of the fund/Stocks for correct mapping']);
		let instWorksheet = workbook.addWorksheet('Instructions');
		let instTitleRow = instWorksheet.getRow(0);
		instTitleRow.font = {
			name: 'Calibri',
			size: 16,
			underline: 'single',
			bold: true,
			color: { argb: '0085A3' }
		}
		instTitleRow.alignment = { vertical: 'middle', horizontal: 'center' }
		let instHeaderRow = instWorksheet.addRow(["Instructions to upload excel data"]);
		instHeaderRow.eachCell((cell, number) => {
			cell.font = {
				name: 'Calibri',
				bold: true,
				color: { argb: '000000' },
				size: 12,
			}
		})
		instInfo.forEach(d => {
			instWorksheet.addRow(d).eachCell((cell) => {
				cell.font = { name: 'Calibri', family: 4, size: 12 };
				cell.alignment = { wrapText: true };
				cell.border = {
					top: { style: 'thin', color: { argb: 'FFFFFFFF' } },
					left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
					bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
					right: { style: 'thin', color: { argb: 'FFFFFFFF' } }
				};
			})
		}
		);
		instWorksheet.getColumn(1).width = 130;
		instWorksheet.getRow(5).height = 32;
		// MUTTUAL FUNDS SHEET
		let mfHead = [["ISIN", "Scheme Name", "Asset Class", "Purchase Date", "Transaction Type", "Purchase NAV", "Purchase Units", "PAN No.", "Advisor Name", "Description", "Folio Number", "Dividend rate"]];
		let mutualFundsWorksheet = workbook.addWorksheet('Mutual Funds');
		let mutualFundTitleRow = mutualFundsWorksheet.getRow(0);
		mutualFundTitleRow.font = {
			name: 'Calibri',
			size: 16,
			underline: 'single',
			bold: true,
			color: { argb: '0085A3' }
		}
		mutualFundTitleRow.alignment = { vertical: 'middle', horizontal: 'center' }
		let mutualFundHeaderRow = mutualFundsWorksheet.addRow(mfHead[0]);
		mutualFundHeaderRow.eachCell((cell, number) => {
			cell.fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: '4167B8' },
				bgColor: { argb: '' },
			}
			cell.font = {
				bold: true,
				color: { argb: 'FFFFFF' },
				size: 12,
			}
		})
		mutualFundsWorksheet.getColumn(1).width = 10;
		mutualFundsWorksheet.getColumn(2).width = 15;
		mutualFundsWorksheet.getColumn(3).width = 15;
		mutualFundsWorksheet.getColumn(4).width = 16;
		mutualFundsWorksheet.getColumn(5).width = 20;
		mutualFundsWorksheet.getColumn(6).width = 16;
		mutualFundsWorksheet.getColumn(7).width = 16;
		mutualFundsWorksheet.getColumn(8).width = 12;
		mutualFundsWorksheet.getColumn(9).width = 16;
		mutualFundsWorksheet.getColumn(10).width = 16;
		mutualFundsWorksheet.getColumn(11).width = 16;
		mutualFundsWorksheet.getColumn(12).width = 16;
		// STOCKS SHEET
		let info:any = [];
		let stocksHead = [["ISIN", "Stock Name", "Asset Class", "Purchase Date", "Purchase Quantity", "Purchase Price", "Purchase Value"]];
		this.eqTableDisplay.forEach((element) => {
			info.push([element.ISIN, element.INSTRUMENTNAME, 'Equity', '01-01-1900', this.convertFunc(element.QUANTITY), this.convertFunc(element.AVGPURCHASEPRICE), this.convertFunc(element.HOLDINGCOST)]);
		});
		
		let stocksWorksheet = workbook.addWorksheet('Stocks');
		let stocksTitleRow = stocksWorksheet.getRow(0);
		stocksTitleRow.font = {
			name: 'Calibri',
			size: 16,
			underline: 'single',
			bold: true,
			color: { argb: '0085A3' }
		}
		stocksTitleRow.alignment = { vertical: 'middle', horizontal: 'center' }
		let stocksHeaderRow = stocksWorksheet.addRow(stocksHead[0]);
		stocksHeaderRow.eachCell((cell, number) => {
			cell.fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: '4167B8' },
				bgColor: { argb: '' },
			}
			cell.font = {
				bold: true,
				color: { argb: 'FFFFFF' },
				size: 12,
			}
		})
		//Adding Data with Conditional Formatting
		info.forEach((d:any) => {
			stocksWorksheet.addRow(d).eachCell((cell) => {
				cell.font = { name: 'Calibri', family: 4, size: 11 };
			})
		}
		);
		stocksWorksheet.getColumn(1).width = 25;
		stocksWorksheet.getColumn(2).width = 20;
		stocksWorksheet.getColumn(3).width = 10;
		stocksWorksheet.getColumn(4).width = 15;
		stocksWorksheet.getColumn(5).width = 15;
		stocksWorksheet.getColumn(6).width = 15;
		stocksWorksheet.getColumn(7).width = 15;
		stocksWorksheet.getColumn(8).width = 20;
		//Generate & Save Excel File
		workbook.xlsx.writeBuffer().then((data) => {
			let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
			if (this.commonService.isApp()) {
				this.commonService.downloadXlsForMobile(blob, true);
				this.dataLoad = true;
			}
			else {
				saveAs(blob, 'Reports' + '.xlsx');
				this.dataLoad = true;
			}
		})
	}
	dropClick(sr:any, arr:any) {
		// event.preventDefault();
		arr.forEach((element:any, ind:any) => {
			if (sr !== element.srNo) {
				element['isVisible'] = false;
			} else {
				element['isVisible'] = element['isVisible'] ? false : true;
				if (element['isVisible']) {
					setTimeout(() => {
						this.detailHeight = this.detail?.nativeElement.offsetHeight;
                        // console.log('height= ' + this.detailHeight);
					}, 100);
				}
			}
		});
		// console.log(arr);
    }
	consRealizedPlList:any[] = [];
	getMFPNLStatement = () => {
        this.tabPanelPnlLoader = false;
        this.fromDateReq = this.formatChange(this.fromDate);
        this.toDateReq = this.formatChange(this.toDate);
        this.subscription.add(
            this.clientService.getMFPNLStatement(this.portfolioToken, this.clientCode,this.fromDateReq, this.toDateReq,localStorage.getItem('userId1'), this.clientType)
                .subscribe((res: any) => {
                    if (res['Head']['ErrorCode'] == 0) {
                        if(res['Body']['Table3'] && res['Body']['Table3'].length > 0){
                            var result = this.groupBy1(res['Body']['Table3'], function (item: any) {
                                return [item.Scheme_Name];
                            });
                            this.grandTotalMFpnl=res['Body']['Table3'][res['Body']['Table3'].length-1];
                            //console.log(this.grandTotalMFpnl)
                            this.consRealizedPlList = [];
                            for (var j in result) {
                                if(result[j]["Scheme_Name"] !== ""){        // review
                                var combineObj: any = {
                                    "srNo": parseInt(Object.keys(result)[j]),
                                    "Data": result[j],
                                    "Scheme_Name":result[j][0].Scheme_Name,
                                     "TransactionType":result[j][0].Transaction_Type,
                                    "Transaction_Type": "",
                                    "Transaction_Date": "",
                                    "Purchase_Price": "",
                                    "Units": result[j].reduce((el: any, li: any) => el + parseFloat(li.Units), 0),
                                    "Purchase_Amount": result[j].reduce((el: any, li: any) => el + parseFloat(li.Purchase_Amount), 0),
                                    "Sell_Date": "",
                                    "Sell_Type": "",
                                    "Sell_Rate": "",
                                    "Sell_Amount": result[j].reduce((el: any, li: any) => el + parseFloat(li.Sell_Amount), 0),
                                    "Days": "",
                                    "GL_ST_Debt": result[j].reduce((el: any, li: any) => el + parseFloat(li.GL_ST_Debt), 0),
                                    "GL_ST_Equity": result[j].reduce((el: any, li: any) => el + parseFloat(li.GL_ST_Equity), 0),
                                    "GL_LT_Debt": result[j].reduce((el: any, li: any) => el + parseFloat(li.GL_LT_Debt), 0),
                                    "GL_LT_Equity": result[j].reduce((el: any, li: any) => el + parseFloat(li.GL_LT_Equity), 0),
                                    "STT": "",
                                    "ISIN": "",
                                    "RIA_FLAG": ""
                                };
                                this.consRealizedPlList.push(combineObj);
                            }
                                
                            }
                            this.consRealizedPlList = this.consRealizedPlList.sort((a, b) => (a.ScripName > b.ScripName) ? -1 : 1);
                            
                        }  else{
                            this.consRealizedPlList = [];
                        }
                    }
                    this.tabPanelPnlLoader= true;
                    
                })
        )
    }
	groupBy1(array: any, f: any) {
		let groups: any = {};
		array.forEach(function (o: any) {
			//console.log(o)
			if(o['Scheme_Name'] != ""){
				var group = JSON.stringify(f(o));
				groups[group] = groups[group] || [];
				groups[group].push(o);
			}
		});
		return Object.keys(groups).map(function (group) {
			return groups[group];
		})
	}
	displayRealisePlValue(){
		if(this.unRealisePlValue){
			return this.commonService.numberFormatWithCommaUnit(this.unRealisePlValue);	
		}
		return 0;
		
	}
	
	private GetTotalEquityDividend = (consolidate: string = "0", downloadReport: boolean = false) => {

		let passClientCode = this.pnlClientCode;
		if(consolidate == "1") passClientCode = this.realizedClientCode;
		if(!downloadReport) this.tabPanelPnlLoader = false;
		this.fromDateReq = this.formatChange(this.fromDate, 'MM/DD/YYYY');
        this.toDateReq = this.formatChange(this.toDate, 'MM/DD/YYYY');
        this.subscription.add(
			this.clientService.GetTotalEquityDividend(this.portfolioToken, passClientCode,this.fromDateReq, this.toDateReq,consolidate)
			.subscribe({
				next: (res:any)=> { 

					if(!downloadReport){
						if(res['Head']['ErrorCode'] == 0){
							this.dividendTableList = res['Body'];
						} else{
							this.dividendTableList = { Total_Dividend_Amount: "0", EquityDividend: []};
							this.toast.displayToast(res['Head']['ErrorDescription']);
						}
						this.tabPanelPnlLoader = true;
					} else {
						const reportArray = this.selectedReport.map((item: any) => item.value);
						if(res['Head']['ErrorCode'] == 0){
							let dividendData: any[] = [];
							let reportData = res['Body'];
							let individualTotalData: any = [];
							
							for(let i in reportData.EquityDividend){
								let dividendValue = reportData.EquityDividend[i]['Dividend_Amount'] != "" && reportData.EquityDividend[i]['Dividend_Amount'] != null && reportData.EquityDividend[i]['Dividend_Amount'] != undefined ? parseFloat(reportData.EquityDividend[i]['Dividend_Amount']) : 0.00;

								// all dividend details
								dividendData.push({
									isTotal: false,
									isSumRow: false,
									scripName: reportData.EquityDividend[i].ScripName,
									exDate: reportData.EquityDividend[i].ExDate,
									dividendAmount: dividendValue,
									clientCode: reportData.EquityDividend[i].ClientCode
								});
								// total dividend details
								if(individualTotalData.length > 0){

									let createNew!: boolean;
									let existingIndex = "";
									for(let j in individualTotalData){
										if(individualTotalData[j].clientCode == reportData.EquityDividend[i].ClientCode){
											createNew = false;
											existingIndex = j;
											break;
										} else {
											createNew = true;
										}
									}

									if(createNew){
										individualTotalData.push({
											isTotal: false,
											isSumRow: true,
											scripName: "",
											exDate: "",
											dividendAmount: dividendValue,
											clientCode: reportData.EquityDividend[i].ClientCode
										});
									}
									else {
										individualTotalData[existingIndex].dividendAmount += dividendValue;
									}
								} else {
									individualTotalData.push({
										isTotal: false,
										isSumRow: true,
										scripName: "",
										exDate: "",
										dividendAmount: dividendValue,
										clientCode: reportData.EquityDividend[i].ClientCode
									});
								}
							}

							dividendData.push(...individualTotalData);
							dividendData = [...dividendData.sort((a, b) => (a.exDate < b.exDate) ? -1 : 1)]
							dividendData = [...dividendData.sort((a, b) => (a.dividendAmount > b.dividendAmount) ? -1 : 1)]
							dividendData = [...dividendData.sort((a, b) => (a.clientCode > b.clientCode) ? -1 : 1)]

							dividendData.push({
								isTotal: true,
								isSumRow: false,
								scripName: "",
								exDate: "",
								dividendAmount: reportData.Total_Dividend_Amount,
								clientCode: "",
								INSTRUMENTNAME: "Total"
							});
							this.realizedPlData = [...this.realizedPlData, {
								"pageTitle": "P&L Statement",
								"pageNumber": "5",
								"subTitle": 'Dividend',
								"hasTable": true,
								"tableHead": [
									"Scrip Name",
									"Date",
									"Amount",
								],
								"totalData": dividendData,
							}]
							this.generateTablesHTML(reportArray);
							this.closeDownloadreport();
						} else {
							if (reportArray.length === 1 && reportArray.includes('pl')) {
								if (this.realizedPlData.length === 0) {
									this.toast.displayToast('No record found');
									this.pdfLoader = true;
								} else {
									this.generateTablesHTML(reportArray);
									this.closeDownloadreport();
								}
							} else {
								this.generateTablesHTML(reportArray);
								this.closeDownloadreport();
							}
						}
					}
				},
				error: (err: any) => {
					this.tabPanelPnlLoader = true;
					this.toast.displayToast("Unable to fetch Dividend Details");
				}
		}));
	}

	// FUNCTION TO HANDLE DISPLAY LAST UPDATED PRODUCTS POPUP
	showLastUpdatedPopup(){
		this.displayPopup = !this.displayPopup;
	}

	over() {
		setTimeout(() => {
		this.document.querySelector('.table-1')?.classList.remove('equity-table-hover');
		},2000);
	}
}