import autoTable from 'jspdf-autotable';
import * as _ from 'lodash';
import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import { ModalController, Platform } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { SummaryDetailsModalComponent } from '../../../app/components/summary-details-modal/summary-details-modal.component';
import { SummaryConfirmModalComponent } from '../../../app/components/summary-confirm-modal/summary-confirm-modal.component';
import { SummaryReasonsModalComponent } from '../../../app/components/summary-reasons-modal/summary-reasons-modal.component';
import { Subject, Subscription,  } from 'rxjs';
import { ShareReportService } from '../../pages/share-reports/share-report.service';
import { DashBoardService } from '../dashboard/dashboard.service';
import { BodHoldingModalMobileComponent } from '../../../app/components/bod-holding-modal-mobile/bod-holding-modal-mobile.component';
import { BodHoldingBreakdownnModalComponent } from '../../../app/components/bod-holding-breakdownn-modal/bod-holding-breakdownn-modal.component';
import { BodCollateralModalComponent } from '../../../app/components/bod-collateral-modal/bod-collateral-modal.component';
import { LoginService } from '../login/login.service';
import jsPDF from 'jspdf';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { debounceTime, switchMap } from 'rxjs/operators';
import { FormatUnitNumberPipe } from '../../helpers/formatnumberunit.pipe';
import { environment } from '../../../environments/environment';
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { ToasterService } from '../../helpers/toaster.service';
import { ComingSoonPopoverComponent } from '../../components/coming-soon-popover/coming-soon-popover.component';
import { PhysicalFnoConfirmModalMobileComponent } from '../../physical-fno-confirm-modal-mobile/physical-fno-confirm-modal-mobile.component';
import { PhysicalFnoSuccessModalMobileComponent } from '../../physical-fno-success-modal-mobile/physical-fno-success-modal-mobile.component';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';

@Component({
	selector: 'app-view-report-list',
	providers: [WireRequestService,DashBoardService,ShareReportService, FormatUnitNumberPipe],
	templateUrl: './view-report-list.page.html',
	styleUrls: ['./view-report-list.page.scss'],
})
export class ViewReportListPage implements OnInit {
	public reportTypeData: any[] = [
		{ reportType: "Risk Report", display: false },
		{ reportType: "Real time Margin Shortfall", display: false },
		{ reportType: "Scrip Master", display: false },
		{ reportType: "Commodity Client Scrip Summary", display: false },
		{ reportType: "VAS Detailed Report", display: false },
		{ reportType: "BOD Holding", display: false },
		{ reportType: 'Commodity Client Summary', display: false },
		{ reportType: 'Outstanding Position', display: false },
		{ reportType: "Consolidated Trade Listing", display: false },
		{ reportType: "Shares Deposit Report", display: false },
		{ reportType: "Deposit Ledger", display: false },
		{ reportType: "FAN Payout Summary", display: false },
		{ reportType: "FAN Brokerage Ledger", display: false },
		{ reportType: "JV Request Status", display: false },
		{ reportType: "Limit Request Status", display: false },
		{ reportType: "Brokerage Request Status", display: false },
		{ reportType: "GST Invoice", display: false },
		{ reportType: "DP Scrip Payout", display: false },
		{ reportType: "Scrip Summary Report", display: false },
		{ reportType: "EPI Request Status", display: false }
	];
	public reportTypeFanChildData: any[] = [
		{ reportType: "Risk Report", display: false },
		{ reportType: "Real time Margin Shortfall", display: false },
		{ reportType: "Scrip Master", display: false },
		{ reportType: "Commodity Client Scrip Summary", display: false },
		{ reportType: "VAS Detailed Report", display: false },
		{ reportType: "BOD Holding", display: false },
		{ reportType: 'Commodity Client Summary', display: false },
		{ reportType: "Consolidated Trade Listing", display: false },
		{ reportType: "JV Request Status", display: false },
		{ reportType: "Limit Request Status", display: false },
		{ reportType: "Brokerage Request Status", display: false },
		{ reportType: "DP Scrip Payout", display: false },
		{ reportType: "Scrip Summary Report", display: false },
		{ reportType: "EPI Request Status", display: false }
	];

	currentDate: any;
	public clientSearchValue: any = null;
	public isListVisible: boolean = false;
	dtLoad: boolean = false;
	clientCodeData: any[] = [];
	clientCode: any;
	datas: any[] = [];
	allClients: any[] = [];
	cliList: any[] = [];
	public isReportObj: any = {};
	partnerID: any;
	scriptMasterData: any;
	public placeholderInput: string = 'Search...';
	scriptVar: any;
	riskText: any;
	bId: any;
	viewClick = false;
	scriptFilterVal: any;
	scriptMasterList:any[] = [{
		id: 1, scriptName: "ALL", scriptValue: 'all'
	  },{
		id: 1, scriptName: "Symbol", scriptValue: '0'
	  },
	  {
		id: 2, scriptName: "Script Code", scriptValue: '1'
	  },
	  {
		id: 3, scriptName: "ISIN", scriptValue: '2'
	  }];
	brokerageOrderType: any = [
		{ status: "All", value: "" },
		{ status: "Approved By IRA", value: "Approved By IRA" },
		{ status: "Approved by Back Office", value: "Approved by Back Office" },
		{ status: "Pending with IRA", value: "Pending with IRA" },
		{ status: "Pending with Back Office", value: "Pending with Back Office" },
		{ status: "Rejected by IRA", value: "Rejected by IRA" },
		{ status: "Rejected By Back Office", value: "Rejected By Back Office" },
		
	]

	jvOrderType: any = [
		{ status: "All", value: "" },
		{ status: "Pending", value: "Pending" },
		{ status: "Rejected", value: "Rejected" },
		{ status: "Approved", value: "Approved" },
	]
	epiStatusType: any = [
		{ status: "All", value: "" },
		{ status: "Pending", value: "Pending" },
		{ status: "Sent to Back Office", value: "Sent to Back Office" },
		{ status: "Approved", value: "Approved" },
	]

	riskReportTypeList: any = [
		{ nfdcReportType: "Client Summary", value: 1 },
		{ nfdcReportType: "T+5", value: 5 },
		{ nfdcReportType: "T+6", value: 6 },
		{ nfdcReportType: "30 Days", value: 30 },
		{ nfdcReportType: "90 Days", value: 90 },
		{ nfdcReportType: "Hold Physical FNO Report", value: 7 }
	]

	exchangeType: any = [
		{ status: "All", value: "All" },
		{ status: "MCX", value: "M" },
		{ status: "NCDEX", value: "NX" },
		{ status: "NSE", value: "N" },
	]

	riskReportTypeListSub: any = [
		{ nfdcReportType: "Client Summary", value: 1 },
		{ nfdcReportType: "T+5", value: 5 },
		{ nfdcReportType: "T+6", value: 6 },
		{ nfdcReportType: "30 Days", value: 30 },
		{ nfdcReportType: "90 Days", value: 90 },
		{ nfdcReportType: "Hold Physical FNO Report", value: 7 }
	]

	outstandingExchange: any = [
		{ status: "NSE", value: "N" },
		{ status: "BSE", value: "B" },
	]
	outstandingExchangeType: any = [
		{ status: "FAO", value: "D" },
		{ status: "Currency", value: "U" },
	]

	freezeReason: any = [
		{  value: '', reason: 'ALL'},
		{  value: '1' , reason: 'Regulatory Actions Debarred - SEBI/SAT Order/ UNSC List'},
		{  value: '2' , reason: 'Regulatory Actions Debarred - Exchanges/ Depositories Circular'},
		{  value: '3' , reason: 'Legal Initiated Direction from Invg Agencies-ED/ CBI/ EOW/ ACB/ Police etc.'},
		{  value: '4' , reason: 'Legal Initiated Direction from Courts- Supreme/ High/ Others'},
		{  value: '5' , reason: 'Legal Initiated Direction from Govt. Dept./ Recovery-Income Tax, Liquidators etc.'},
		{  value: '6' , reason: 'Legal Initiated Client Dispute - Arbitration / Other disputes'},
		{  value: '7' , reason: 'Business/ CS Initiated Client Dispute - Exchange/ Depository IG Compliant'},
		{  value: '8' , reason: 'Business/ CS Initiated Client Dispute - Trade Confirmation Pending/ unauthorized Trading'},
		{  value: '9' , reason: 'Business/ CS Initiated Client Dispute - Other Complaints'},
		{  value: '10' , reason: 'Business/ CS Initiated Customer Death/ Transmission in Process/ Closure in Process'},
		{  value: '11' , reason: 'Business/ CS Initiated Defaulter with Other Brokers (ANMI List)'},
		{  value: '12' , reason: 'Business/ CS Initiated Voluntary Closure request by Client/ RM'},
		{  value: '13' , reason: 'Business/ CS Initiated Account Closed'},
		{  value: '14' , reason: 'Business/Risk Initiated Client Disputes-  Outstanding Debit Balance/ Brokerage/ Charges etc'},
		{  value: '15' , reason: 'Business/Risk Initiated PMLA-Repeated Transaction Alert'},
		{  value: '16' , reason: 'Activation Initiated KYC - Incomplete or Invalid KYC documents'},
		{  value: '17' , reason: 'Activation Initiated KYC - Rejection by CKYC/ KRA'},
		{  value: '18' , reason: 'Activation Initiated KYC - Mobile no. not provided or Incorrect'},
		{  value: '19' , reason: 'Activation Initiated KYC - Email id not provided or Incorrect'},
		{  value: '20' , reason: 'Activation Initiated KYC - Verification Rejection - Bank/ PAN/Name/ Address/ IPV/OSV etc'},
		{  value: '21' , reason: 'Activation Initiated KYC - Demat Details not provided or Incorrect'},
		{  value: '22' , reason: 'Activation Initiated KYC - Minor to Major'},
		{  value: '23' , reason: 'Activation Initiated KYC - Multiple / Invalid PAN'},
		{  value: '24' , reason: 'Activation Initiated KYC - Multiple UCC'},
		{  value: '25' , reason: 'Activation Initiated KYC - Change in Status/ Constitution'},
		{  value: '26' , reason: 'Activation Initiated KYC - Incorrect Address/ Welcome Letter Undelivered'},
		{  value: '27' , reason: 'Activation Initiated KYC - 2.0 Accounts - Physical KYC Not Received/Documents Incomplete'},
		{  value: '28' , reason: 'Activation Initiated KYC - Family Declaration Required for Multiple Mobile/Email'},
		{  value: '29' , reason: 'Accounts initiated KYC - Bank Details not provided or Incorrect'},
		{  value: '30' , reason: 'Activation Initiated - New Clients UCC Response Pending'},
		{  value: '31' , reason: 'Activation Initiated - Reactivation'},
		{  value: '32' , reason: 'Client consent letter not received for COMM segment activation'},
		{  value: '33' , reason: 'Business/ CS Initiated  Temporary Suspension of trading request by Client/ RM'},
		{  value: '34' , reason: 'Activation Initiated KRA Rejections'},
	]

	dpType: any = [
		{ value: 'NSDL' },
		{ value: 'CDSL' }
	];
	dematDpType = [
		{ value: 'ALL' },
		{ value: 'NSDL' },
		{ value: 'CDSL' }
	]
	selectedDematDpType = this.dematDpType[0].value;

	// raaDepositReportList = [
	// 	{ nfdcReportType: "30 Days", value: 30 },
	// 	{ nfdcReportType: "90 Days", value: 90 },
	// ]

	public isRM = false;
	public typeChange: any;
	public showClientSummary = false;
	public showFno = false;
	public rptID = environment.gstInvoiceRptId;
	dataLoad:boolean = false;
	selectFanCode:any;
	fanCodeList:any[] = [];
	hierarchyListArr: any[] = [];
	pCodeList:any[] = [];
	hierarchyListVar: any;
	fileData: any = [];
	reportData: any = [];
	isAccountClosureReport = false;
	isDematRequestStatus = false;
	wireCodeVar: any;
	ndfcReportType: any;
	raaDepositReportType: any;
	passNfdcReport: any;
	passRaaDepositReport: any;
	fanBrokerageLedger: any;
	public isDpScriptDisplay = false;
	public isViewClick = false;
	public isWireClick = false;
	public wireCode: any;
	rtMarginShortfallObj: any;
	public isexchangView = false;
	public isTradeListing = false;
	selectMonth: any = null;
	selectYear: any = null;
	selectPartner = null;
	selectOrderType: any;
	selectOrderType1: any;

	displayReportStatus: any = {
		jvStaus: false,
		limitStaus: false,
		brokerageStatus: false
	}
	searchText: string = '';
	displayonSubmit: boolean = false;
	searchClientCodeName: any = '';
	reportType: any;
	reportCaptured:any = '';
	selectType: any;
	monthList: any = [];
	yearList: any = [];
	fromDate: any;
	toDate: any;
	brokerageReqObj: any;
	jvReqObj: any;
	epiReqObj: any;
	limitReqObj: any;
	dpScriptObj: any;
	isApp = false;
	clientCodeList: any[] = [];
	tradeListData: any = [
		{ status: "Cash", value: 'C' },
		{ status: "Fao", value: 'D' },
		{ status: "Currency", value: 'U' }
	];
	tradelist: any;
	passClientId: any;
	isDropDownVisible: boolean = false;
	passClientIdValidation!: boolean;
	passClientCode: string = '';
	Loadvalue = false;
	inputattr = false;
	isScriptExcel = false;
	raaReportTypeSelect: boolean = false;
	submitValue: any;
	selectBranch: any	;
	branchList: any[] = [];
	partnerListArr: any[] = [];
	displayFanPayout: boolean = false;
	fanPayoutObj: any;
	commSummaryObj: any;
	branchOption: any;
	monthSelectionField: boolean = true;
	myOptions: any = {
		dateFormat: 'dd/mm/yyyy',
		showSelectorArrow: true,
		showMonthNumber: false,
	}
	fromDateReq: any;
	toDateReq: any;
	userTypeVar: any;
	userTypeValue:any;
	partnerList = [];
	private subscription = new Subscription();
	tokenVal: any;
	isExchageTypeChanged = false;
	isOutstandingExchageChanged = false;
	isOutstandingExchageTypeChanged = false;
	isOutstandingBranchChanged = false;
	selectedFanCode:any;
	showFanCodeDropdown:boolean=false;
	setTextSearch:any;
	noRecord:boolean=false;
	private searchRmhierarchyTerms = new Subject<string>();
	private clientSearchTerms = new Subject<string>();

	selectedFreezeReason!: string;
	passFreezeReason!: string;
	selectedDpType!: string;
	passDpType: any;
	passDematDpType!: string;
	datePicker: any; 
	showDatePicker: boolean = false;
	date:any;
	showStartDatePicker: boolean = false;
	showEndDatePicker: boolean = false;
	ionFromDate: any;
	ionToDate: any;
	datePositionCenter: boolean = false;

	constructor(private elementRef: ElementRef,private modalController: ModalController,public serviceFile: LoginService,private dashBoardService:DashBoardService,private shareReportSer:ShareReportService, private router: Router, private commonService: CommonService, private wireReqService: WireRequestService, private storage: StorageServiceAAA, public toast: ToasterService, private platform: Platform, private popoverController: PopoverController, private route: ActivatedRoute,private fileOpener: FileOpener,private file: File) { 
		router.events.forEach((event) => {
			this.platform.backButton.subscribeWithPriority(10, () => {
				window.history.back();
			});
		  });
	}

	ngOnInit() {
		this.currentDate = moment(new Date()).format("YYYY-MM-DD");
		this.route.queryParams.subscribe((params: any) => {
			this.raaReportTypeSelect = true;
				switch (params.report) {
					case 'riskReport':
						this.reportType = "Risk Report";
						this.selectType = this.reportType;
						break;
					case 'realTimeMargin':
						this.reportType = "Real time Margin Shortfall";
						this.selectType = this.reportType;
						break;
					case 'ScripSummary':
						this.reportType = "Scrip Summary Report";
						this.selectType = this.reportType;
						break;
					case 'FanPayoutSummary':
						this.reportType = "FAN Payout Summary";
						this.selectType = this.reportType;
						break;
					case 'DPScripPayout':
						this.reportType = "DP Scrip Payout";
						this.selectType = this.reportType;
						break;
					case 'CommodityClientSummary':
						this.reportType = "Commodity Client Summary";
						this.selectType = this.reportType;
						break;
					case 'DepositLedger':
						this.reportType = "Deposit Ledger";
						this.selectType = this.reportType;
						break;
					case 'FanBrokerageLedger':
						this.reportType = "FAN Brokerage Ledger";
						this.selectType = this.reportType;
						break;
					case 'bodHolding':
						this.reportType = "BOD Holding";
						this.selectType = this.reportType;
						break;
					case 'CommodityRealtime':
						this.reportType = "Commodity Margin Summary";
						this.selectType = this.reportType;
						this.isExchageTypeChanged = true;
						break;
					case 'ScripMaster':
						this.reportType = "Scrip Master";
						this.selectType = this.reportType;
						break;
					case 'SharesDeposit':
						this.reportType = "Shares Deposit Report";
						this.selectType = this.reportType;
						break;
					case 'GSTInvoice':
						this.reportType = "GST Invoice";
						this.selectType = this.reportType;
						break;
					case 'LimitChange':
						this.reportType = "Limit Request Status";
						this.selectType = this.reportType;
						break;
					case 'JVRequest':
						this.reportType = "JV Request Status";
						this.selectType = this.reportType;
						break;
					case 'BrokerageRequest':
						this.reportType = "Brokerage Request Status";
						this.selectType = this.reportType;
						break;
					case 'OutstandingReport':
							this.reportType = "Outstanding Position";
							this.selectType = this.reportType;
							this.selectOrderType = this.outstandingExchange[0].value;
							this.selectOrderType1 = this.outstandingExchangeType[0].value;
							this.isOutstandingExchageChanged = true;
							this.isOutstandingExchageTypeChanged = true;
							this.isOutstandingBranchChanged = true;
							this.getHierarchyList();
							this.fromDate = this.commonService.lastWeekISOConverted('first');
							this.ionFromDate = this.commonService.getIonDateTimeFormat(this.fromDate);
							break;
				}
				this.desktopDatePosition(this.reportType);
			});

		this.storage.get('isFanChild').then(isChild => {
			if(isChild == 'true'){
				this.reportTypeData = [];
				this.reportTypeData = this.reportTypeFanChildData;
			}
		});
		this.getHierarchyList();
		this.userTypeVar = localStorage.getItem('userType');
		if(this.userTypeVar==='RM'){
			this.userTypeValue = 'RM';
		}else if(this.userTypeVar==='FAN'){
			this.userTypeValue = 'FN';
		}else{
			this.userTypeValue = 'SB';
		}
		if(this.userTypeVar == 'SUB BROKER'){
			this.riskReportTypeList = this.riskReportTypeListSub;
		}
		if(this.selectType == 'BOD Holding'){
			this.clientSearchValue = localStorage.getItem('slctdClientCode');
		}
		//this.reportType = undefined;
		// this.fromDate = this.datetoISO(this.last7DayaMonYrFormat("last"));
		// this.toDate = this.datetoISO(this.last7DayaMonYrFormat("first"));
		this.fromDate = new Date(this.last7DayaMonYrFormat("last"));
		this.ionFromDate = this.commonService.getIonDateTimeFormat(this.fromDate);
		this.toDate = this.commonService.lastWeekISOConverted('first');
		this.ionToDate = this.commonService.getIonDateTimeFormat(this.toDate);
		this.isApp = this.commonService.isApp();
		let tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		this.myOptions['disableSince'] = { year: moment(tomorrow).format('YYYY'), month: moment(tomorrow).format('MM'), day: moment(tomorrow).format('DD') }
		this.storage.get('mappingDetails').then(list => {
			this.partnerList = list;
		})

		let token = localStorage.getItem('jwt_token');
		let userID = localStorage.getItem('userId1');
		this.searchRmhierarchyTerms
		.pipe(
		  debounceTime(500),
		  switchMap((textSerach) => this.dashBoardService.fetchRMHierarchyNew(this.userTypeVar, userID, token, textSerach)) // Perform the search operation
		)
		.subscribe(results => {
			this.setHierarchyList(results); 
		});

		this.clientSearchTerms
		.pipe(
			debounceTime(500),
			switchMap((searchValue) => this.dashBoardService.fetchGetClientCodes(this.userTypeValue, userID, token, searchValue)))
		.subscribe(results => {
			
			let clientData = [].concat(...results);
			const data = clientData
			.filter((element: any) => element.toString().split("-")[3].toLowerCase().trim() == "false")
			.map((client: any) => {
				return `${client.toString().split("-")[0]} - ${client.toString().split("-")[1].trim()}`;	
			});
			this.setClientSearch(data);
		});
		
	}

	ionViewWillEnter() {
		// if (this.platform.is('android') || this.platform.is('mobileweb') || this.commonService.isApp()) {
		// 	this.reportTypeData = this.reportTypeData.filter((item) => item.reportType !== "Real time Margin Shortfall");
		// }

		this.route.queryParams.subscribe((params: any) => {
			this.noRecord=false;
			this.showFanCodeDropdown=false;
			this.selectedFanCode = null;
			this.selectFanCode = null;
			this.fanCodeList=[];
			this.hierarchyListVar = null;
			this.selectPartner = null;
			this.selectBranch = null;
			this.wireCodeVar = null;
			this.fromDateReq = null;
			this.toDateReq = null;
			this.fromDate = new Date(this.last7DayaMonYrFormat("last"));
			this.ionFromDate = this.commonService.getIonDateTimeFormat(this.fromDate);
			this.toDate = this.commonService.lastWeekISOConverted('first');
			this.ionToDate = this.commonService.getIonDateTimeFormat(this.toDate);	
			this.raaReportTypeSelect = true;

				switch (params.report) {
					case 'riskReport':
						this.reportType = "Risk Report";
						this.selectType = this.reportType;
						break;
					case 'realTimeMargin':
						this.reportType = "Real time Margin Shortfall";
						this.selectType = this.reportType;
						break;
					case 'consolidatedTradeList':
						this.reportType = "Consolidated Trade Listing";
						this.selectType = this.reportType;
						this.fromDate = this.commonService.lastWeekISOConverted('first');
						this.ionFromDate = this.commonService.getIonDateTimeFormat(this.fromDate);
						break;
					case 'ScripSummary':
						this.reportType = "Scrip Summary Report";
						this.selectType = this.reportType;
						this.commonService.setClevertapEvent('Scrip_Summary_Report');
						this.commonService.analyticEvent('Scrip Summary Report', 'Wire Reports');
						break;
					case 'FanPayoutSummary':
						this.reportType = "FAN Payout Summary";
						this.selectType = this.reportType;
						this.passClientIdValidation = true;
						this.yearList = this.commonService.last12Month(false, true);

						this.monthList = this.commonService.last12Month(true, false);
						this.fanPayoutObj = {};
						break;
					case 'DPScripPayout':
						this.reportType = "DP Scrip Payout";
						this.selectType = this.reportType;
						break;
					case 'CommodityClientSummary':
						this.reportType = "Commodity Client Summary";
						this.selectType = this.reportType;
						this.passClientIdValidation = true;
						this.commonService.setClevertapEvent('Client_Summary');
						this.commonService.analyticEvent('Client_Summary', 'Wire Reports');
						break;
					case 'DepositLedger':
						this.reportType = "Deposit Ledger";
						this.selectType = this.reportType;
						break;
					case 'FanBrokerageLedger':
						this.reportType = "FAN Brokerage Ledger";
						this.selectType = this.reportType;
						break;
					case 'bodHolding':
						this.reportType = "BOD Holding";
						this.selectType = this.reportType;
						this.clientSearchValue = localStorage.getItem('slctdClientCode');
						this.passClientIdValidation = true;
						this.commonService.setClevertapEvent('BOD_Holdings');
						this.commonService.analyticEvent('BOD_Holdings', 'Wire Reports');
						this.passClientCode = this.clientSearchValue;
						break;
					case 'CommodityRealtime':
						this.reportType = "Commodity Margin Summary";
						this.selectType = this.reportType;
						this.passClientIdValidation = true;
						this.selectOrderType = this.exchangeType[0].value;
						break;
					case 'ScripMaster':
						this.reportType = "Scrip Master";
						this.selectType = this.reportType;
						this.passClientIdValidation = false;
						this.passClientId = null;
						this.scriptVar = this.scriptMasterList[0].scriptValue;
						this.commonService.setClevertapEvent('Script_Master');
						this.commonService.analyticEvent('Script_Master', 'Wire Reports');
						break;
					case 'SharesDeposit':
						this.reportType = "Shares Deposit Report";
						this.selectType = this.reportType;
						break;
					case 'GSTInvoice':
						this.reportType = "GST Invoice";
						this.selectType = this.reportType;
						this.fromDate = new Date(new Date(new Date()).getFullYear(), new Date(new Date()).getMonth() - 1, 1);
						this.ionFromDate = this.commonService.getIonDateTimeFormat(this.fromDate);
						this.toDate = new Date(new Date(new Date()).getFullYear(), new Date(new Date()).getMonth(), 0);
						this.ionToDate = this.commonService.getIonDateTimeFormat(this.toDate);
						break;
					case 'LimitChange':
						this.reportType = "Limit Request Status";
						this.selectType = this.reportType;
						this.limitReqObj = {};
						break;
					case 'JVRequest':
						this.reportType = "JV Request Status";
						this.selectType = this.reportType;
						this.passClientIdValidation = true;
						this.selectOrderType = this.jvOrderType[0].value;
						this.jvReqObj = {};
						break;
					case 'EPIRequest':
						this.reportType = "EPI Request Status";
						this.selectType = this.reportType;
						this.epiReqObj = {};
						break;
					case 'CommodityClientScrip':
						this.reportType = "Commodity Client Scrip Summary";
						this.selectType = this.reportType;
						this.passClientIdValidation = false;
						this.passClientId = null;
						this.commonService.setClevertapEvent('CommodityClientScripSummary_Report_Clicked');
						break;
					case 'BrokerageRequest':
						this.reportType = "Brokerage Request Status";
						this.selectType = this.reportType;
						this.passClientIdValidation = true;
						this.selectOrderType = this.brokerageOrderType[0].value;
						this.brokerageReqObj = {};
						break;
					case 'OutstandingReport':
						this.reportType = "Outstanding Position";
						this.selectType = this.reportType;
						this.selectOrderType = this.outstandingExchange[0].value;
						this.selectOrderType1 = this.outstandingExchangeType[0].value;
						this.isOutstandingExchageChanged = true;
						this.isOutstandingExchageTypeChanged = true;
						this.isOutstandingBranchChanged = true;
						this.getHierarchyList();
						this.fromDate = this.commonService.lastWeekISOConverted('first');
						this.ionFromDate = this.commonService.getIonDateTimeFormat(this.fromDate);
						break;
					case 'FreezeDetails':
							this.reportType = "Freeze Details";
							this.selectType = this.reportType;
						break;
		
					case 'DpModificationDetails':
						this.reportType = "DP Modification Details";
						this.selectType = this.reportType;
						break;

					case 'AccountClosureStatus':
						this.reportType = "Account Closure Status";
						this.selectType = this.reportType;
						this.isAccountClosureReport = false;
						break;	
						
					case 'SettlementPayoutReport':
						this.reportType = "Settlement Payout Report";
						this.selectType = this.reportType;
						break;	
					case 'DematRequestStatus':
						this.reportType = "DRF Status";
						this.selectType = this.reportType;
						this.isDematRequestStatus = false;
						break;	
				}
				this.reportTypeData.forEach(element => {
					element.display = false;
				})
				this.desktopDatePosition(this.reportType);
			});

		this.storage.get('isFanChild').then(isChild => {
			if(isChild == 'true'){
				this.reportTypeData = [];
				this.reportTypeData = this.reportTypeFanChildData;
				// this.reportTypeData = this.reportTypeData.filter((item) => item.reportType !== "Real time Margin Shortfall");
			}
		});

		// if (this.platform.is('desktop')) {
		// 	this.reportType = undefined;
		// }

		// JUST FOR RM
		this.storage.get('userType').then(type => {
			if (type === 'RM') this.isRM = true;
			else this.isRM = false;
		})
		this.clientList()
		this.getListData();
	}

	formatReportType(type: any) {
		switch (type) {
			case 'riskReport':
				this.reportType = "Risk Report";
				this.selectType = this.reportType;
				this.typeChange ='';
				this.showFno=false;
				this.showClientSummary=false;
				this.ndfcReportType = null;
				break;
			case 'realTimeMargin':
				this.reportType = "Real time Margin Shortfall";
				this.selectType = this.reportType;
				this.passClientIdValidation = true;
				break;
			case 'ScripSummary':
				this.reportType = "Scrip Summary Report";
				this.selectType = this.reportType;
				this.commonService.setClevertapEvent('Scrip_Summary_Report');
				this.commonService.analyticEvent('Scrip Summary Report', 'Wire Reports');
				break;
			case 'FanPayoutSummary':
				this.reportType = "FAN Payout Summary";
				this.selectType = this.reportType;
				this.passClientIdValidation = true;
				this.yearList = this.commonService.last12Month(false, true);
				this.monthList = this.commonService.last12Month(true, false);
				break;
			case 'DPScripPayout':
				this.reportType = "DP Scrip Payout";
				this.selectType = this.reportType;
				break;
			case 'CommodityClientSummary':
				this.reportType = "Commodity Client Summary";
				this.selectType = this.reportType;
				this.passClientIdValidation = true;
				this.commonService.setClevertapEvent('Client_Summary');
				this.commonService.analyticEvent('Client_Summary', 'Wire Reports');
				break;
			case 'DepositLedger':
				this.reportType = "Deposit Ledger";
				this.selectType = this.reportType;
				break;
			case 'FanBrokerageLedger':
				this.reportType = "FAN Brokerage Ledger";
				this.selectType = this.reportType;
				break;
			case 'bodHolding':
				this.reportType = "BOD Holding";
				this.selectType = this.reportType;
				this.clientSearchValue = localStorage.getItem('slctdClientCode');
				this.passClientIdValidation = true;
				this.commonService.setClevertapEvent('BOD_Holdings');
				this.commonService.analyticEvent('BOD_Holdings', 'Wire Reports');
				this.passClientCode = this.clientSearchValue;
				break;
			case 'CommodityRealtime':
				this.reportType = "Commodity Margin Summary";
				this.selectType = this.reportType;
				this.passClientIdValidation = true;
				this.selectOrderType = this.exchangeType[0].value;
				break;
			case 'ScripMaster':
				this.reportType = "Scrip Master";
				this.selectType = this.reportType;
				this.passClientIdValidation = false;
				this.passClientId = null;
				this.scriptVar = this.scriptMasterList[0].scriptValue;
				this.commonService.setClevertapEvent('Script_Master');
				this.commonService.analyticEvent('Script_Master', 'Wire Reports');
				break;
			case 'SharesDeposit':
				this.reportType = "Shares Deposit Report";
				this.selectType = this.reportType;
				break;
			case 'GSTInvoice':
				this.reportType = "GST Invoice";
				this.selectType = this.reportType;
				this.fromDate = new Date(new Date(new Date()).getFullYear(), new Date(new Date()).getMonth() - 1, 1);
				this.ionFromDate = this.commonService.getIonDateTimeFormat(this.fromDate);
				this.toDate = new Date(new Date(new Date()).getFullYear(), new Date(new Date()).getMonth(), 0);
				this.ionToDate = this.commonService.getIonDateTimeFormat(this.toDate);
				break;
			case 'LimitChange':
				this.reportType = "Limit Request Status";
				this.selectType = this.reportType;
				break;
			case 'JVRequest':
				this.reportType = "JV Request Status";
				this.selectType = this.reportType;
				this.passClientIdValidation = true;
				this.selectOrderType = this.jvOrderType[0].value;
				break;
			case 'EPIRequest':
					this.reportType = "EPI Request Status";
					this.selectType = this.reportType;
					this.passClientIdValidation = true;
					this.selectOrderType = this.epiStatusType[0].value;
					break;
			case 'BrokerageRequest':
				this.reportType = "Brokerage Request Status";
				this.selectType = this.reportType;
				this.passClientIdValidation = true;
				this.selectOrderType = this.brokerageOrderType[0].value;
				break;
			case 'OutstandingReport':
					this.reportType = "Outstanding Position";
					this.selectType = this.reportType;
					this.selectOrderType = this.outstandingExchange[0].value;
					this.selectOrderType1 = this.outstandingExchangeType[0].value;
					this.isOutstandingExchageChanged = true;
					this.isOutstandingExchageTypeChanged = true;
					this.isOutstandingBranchChanged = true;
					this.getHierarchyList();
					this.fromDate = this.commonService.lastWeekISOConverted('first');
					this.ionFromDate = this.commonService.getIonDateTimeFormat(this.fromDate);
					break;
			case 'consolidatedTradeList':
				this.reportType = "Consolidated Trade Listing";
				this.selectType = this.reportType;
				this.fromDate = null;
				this.ionFromDate = null;
				break;
			case 'CommodityClientScrip':
				this.reportType = "Commodity Client Scrip Summary";
				this.selectType = this.reportType;
				this.passClientIdValidation = false;
				this.passClientId = null;
				this.commonService.setClevertapEvent('CommodityClientScripSummary_Report_Clicked');
				break;
		}

		
	}

	getListData(){
		this.storage.get('userID').then((userID) => {
			this.storage.get('userType').then(type => {
				if (type === 'RM' || type === 'FAN') {
					this.storage.get('bToken').then(token => {
						this.tokenVal = token;
						this.getBranchList(token, userID)
						this.getFANCodeList();
						this.getPartnerCodes();
						this.clientApiCalls(token);
					})
				} else {
					this.storage.get('subToken').then(token => {
						this.tokenVal = token;
						this.getBranchList(token, userID)
						this.getFANCodeList();
						this.getPartnerCodes();
						this.clientApiCalls(token);
					})
				}

			})

		})
	}

	inputTradeList(event: any){
		if(event.status == 'Cash'){
			this.commonService.setClevertapEvent('Cash_Report_Clicked', { 'Login ID': localStorage.getItem('userId1') });
		}
		else if(event.status == 'Fao'){
			this.commonService.setClevertapEvent('FAO_Report_Clicked', { 'Login ID': localStorage.getItem('userId1') });
		}
		else if(event.status == 'Currency'){
			this.commonService.setClevertapEvent('Currency_Report_clicked', { 'Login ID': localStorage.getItem('userId1') });
		}
		this.isTradeListing = false;
	}

	// last 7 days in IST Format
	last7DayaMonYrFormat(day: any) {
		var result: any = [];
		for (var i = 0; i < 8; i++) {
			var d = new Date();
			d.setDate(d.getDate() - i);
			result.push((d));
		}
		if (day == 'first') {
			return result[0];
		}
		else if (day == 'last') {
			return result[7]
		}
		return result

	}
	// convert date in ISO Format
	// datetoISO(date){
	// 	const event = new Date(date);
	// 	return event.toISOString()
	// }

	// convert date in ISO Format
	// datetoISO(date){
	// 	const event = new Date(date);
	// 	return event.toISOString()
	// }

	goBack() {
		window.history.back();
	}
	// change the report type from dropdown
	changeReportType(event: any) {
		this.isexchangView = false;
		this.isTradeListing = false;
		this.tradelist = '';
		this.scriptVar = '';
		this.scriptMasterData = '';
		this.selectType = event.reportType
		this.fromDate = new Date(this.last7DayaMonYrFormat("last"));
		this.ionFromDate = this.commonService.getIonDateTimeFormat(this.fromDate);
		this.toDate = this.commonService.lastWeekISOConverted('first');
		this.ionToDate = this.commonService.getIonDateTimeFormat(this.toDate);
		this.monthSelectionField = true;
		this.selectMonth = null;
		this.selectYear = null;
		this.selectPartner = null;
		this.bId = null;
		this.riskText = null;
		if (this.selectType == 'FAN Payout Summary') {
			this.passClientIdValidation = true;
			this.raaReportTypeSelect = true;
			this.yearList = this.commonService.last12Month(false, true);

			this.monthList = this.commonService.last12Month(true, false);

			/* this.storage.get('userID').then((userID) => {
				this.storage.get('userType').then(type => {
					if (type === 'RM' || type === 'FAN') {
						this.storage.get('bToken').then(token => {
							this.getBranchList(token, userID)
						})
					} else {
						this.storage.get('subToken').then(token => {
							this.getBranchList(token, userID)
						})
					}

				})

			}) */

		}
		/* else if (this.selectType === 'Deposit Ledger' || this.selectType === 'Shares Deposit Report' || this.selectType === 'FAN Brokerage Ledger') {
			this.storage.get('userID').then((userID) => {
				this.storage.get('userType').then(type => {
					if (type === 'RM' || type === 'FAN') {
						this.storage.get('bToken').then(token => {
							this.getBranchList(token, userID)
						})
					} else {
						this.storage.get('subToken').then(token => {
							this.getBranchList(token, userID)
						})
					}

				})

			})
		} */
		else if (this.selectType == 'Real time Margin Shortfall') {
			this.passClientIdValidation = true;
			this.raaReportTypeSelect = true;
			this.reportType = this.selectType;
		}
		else if (this.selectType == 'Brokerage Request Status') {
			this.passClientIdValidation = true;
			this.raaReportTypeSelect = true;
			this.selectOrderType = this.brokerageOrderType[0].value;
		}
		else if (this.selectType == 'JV Request Status') {
			this.passClientIdValidation = true;
			this.raaReportTypeSelect = true;
			this.selectOrderType = this.jvOrderType[0].value;
		}
		else if (this.selectType == 'EPI Request Status') {
			this.passClientIdValidation = true;
			this.raaReportTypeSelect = true;
			this.selectOrderType = this.epiStatusType[0].value;
		}
		else if (this.selectType == 'Outstanding Position') {
			//this.excType = true;
			this.passClientIdValidation = true;
			this.raaReportTypeSelect = true;
			this.selectOrderType = this.outstandingExchange[0].value;
			this.selectOrderType1 = this.outstandingExchangeType[0].value;
		}
		else if (this.selectType == 'Risk Report') {
			this.ndfcReportType = null;
			this.raaReportTypeSelect = false;
			this.typeChange ='';
			this.showFno=false;
			this.showClientSummary=false;
		}
		else if (this.selectType == 'Consolidated Trade Listing') {
			this.fromDate = null;
			this.ionFromDate = null;
			this.raaReportTypeSelect = true;
		}
		else if (this.selectType == 'Client Summary') {
			//this.Loadvalue = true;
			this.passClientIdValidation = true;
			this.raaReportTypeSelect = true;

			this.commonService.setClevertapEvent('Riskreport_ClientSummary');
			this.commonService.analyticEvent('Client_Summary', 'Wire Reports');
		}
		else if (this.selectType == 'BOD Holding') {
			//this.Loadvalue = true;

			this.passClientIdValidation = false;
			this.passClientId = null;
			this.raaReportTypeSelect = true;

			this.commonService.setClevertapEvent('BOD_Holdings');
			this.commonService.analyticEvent('BOD_Holdings', 'Wire Reports');
			this.passClientCode = this.clientSearchValue;


		} else if (this.selectType == 'Scrip Master') {
			this.passClientIdValidation = false;
			this.passClientId = null;
			this.raaReportTypeSelect = true;
			this.scriptVar = this.scriptMasterList[0].scriptValue;
			this.commonService.setClevertapEvent('Script_Master');
			this.commonService.analyticEvent('Script_Master', 'Wire Reports');
		} else if (this.selectType == 'Commodity Client Scrip Summary') {
			this.passClientIdValidation = false;
			this.passClientId = null;
			this.raaReportTypeSelect = true;
			this.commonService.setClevertapEvent('CommodityClientScripSummary_Report_Clicked');
		} else if (this.selectType == 'VAS Detailed Report') {
			this.passClientIdValidation = false;
			this.passClientId = null;
			this.raaReportTypeSelect = true;
			this.commonService.setClevertapEvent('VAS_Report_Clicked');
		} else if (this.selectType == 'GST Invoice') {
			this.fromDate = new Date(new Date(new Date()).getFullYear(), new Date(new Date()).getMonth() - 1, 1);
			this.ionFromDate = this.commonService.getIonDateTimeFormat(this.fromDate);
			this.toDate = new Date(new Date(new Date()).getFullYear(), new Date(new Date()).getMonth(), 0);
			this.ionToDate = this.commonService.getIonDateTimeFormat(this.toDate);
		} else if (this.selectType == 'Scrip Summary Report') {
			this.commonService.setClevertapEvent('Scrip_Summary_Report');
			this.commonService.analyticEvent('Scrip Summary Report', 'Wire Reports');
		}
		else {
			this.passClientIdValidation = true;
			this.raaReportTypeSelect = true;
		}

		this.reportTypeData.forEach(element => {
			element.display = false;
		})

	}
	// client List for BOD Holding in Input
	clientList() {	
		this.storage.get('setClientCodes').then((clientCodes) => {
			this.clientCodeList = clientCodes;
		})
	}

	changeMonYrValue() {
		this.reportTypeData[5].display = false;
	}

	changeWireCode(event: any){
		this.isViewClick = false;
		this.passClientIdValidation = true;
	}

	toggleStartDatePicker() {
		this.showStartDatePicker = !this.showStartDatePicker;
		// Optional: Hide end date picker if shown
		this.showEndDatePicker = false;
	  }
	
	  toggleEndDatePicker() {
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
			  }
		  } 
	
	  }

	onStartDateChanged() {
		this.fromDate = new Date(this.ionFromDate);
	}

	// new code end date
	onEndDateChanged1() {
		this.toDate = new Date(this.ionToDate);		
	}

	changeRiskReportType(event: any) {
		this.raaReportTypeSelect = true;
		this.typeChange = event.nfdcReportType;
		this.selectFanCode = null;
		this.isViewClick = false;
		this.selectedFanCode = null;
		this.fanCodeList =[];
		this.selectBranch = null;
		this.setTextSearch = "";

		if (this.typeChange == 'Client Summary' || this.typeChange == 'Hold Physical FNO Report') {
			this.showClientSummary = false;
			this.showFno = false;
		}

		if (this.typeChange == 'Client Summary') {
			this.passClientIdValidation = true;
			this.raaReportTypeSelect = true;

			this.commonService.setClevertapEvent('Riskreport_ClientSummary');
			this.commonService.analyticEvent('Client_Summary', 'Wire Reports');
			this.commonService.setClevertapEvent('Summaries_ClientSummary', { 'Login ID': localStorage.getItem('userId1') });
		}
		if (this.typeChange == 'Hold Physical FNO Report') {
			this.commonService.setClevertapEvent('Summaries_Holdphysicalfno', { 'Login ID': localStorage.getItem('userId1') });
		}
	}

	changeBranch() {
		if (this.selectType == 'Commodity Client Summary') {
			this.viewClick = false;
		}
	}

	typeRiskText() {
		if (this.selectType == 'Commodity Client Summary') {
			this.viewClick = false;
		}
	}

	wireCodeChange(event: any){
		this.isWireClick = true;
		this.passClientId = '';
		this.clientCodeList = [];
		if(event && event.EmployeeCode){
			this.wireCode = event.EmployeeCode;
		}
		this.storage.get('setClientCodes').then((clientCodes) => {
			this.clientCodeList = clientCodes;
		});
		// this.serviceFile.getClientCodes(this.tokenVal, event.EmployeeCode).subscribe((response) => {
		// if (response['Head']['ErrorCode'] == 0) {
		// 	this.clientCodeList = response['Body']['objGetClientCodesResBody']
		// } else {
		// 	this.clientCodeList = [];
		// }
		// });
	}
	
	// used in BOD Holding 
	inputClientId(event: any) {
		if (event === undefined || event == null) {
			this.passClientIdValidation = false;
		}
		else {
			this.passClientIdValidation = true;
		}
	}

	getBranchList(token: any, userId: any) {
		// this.wireReqService.getHierarchyList(token, userId).subscribe((res) => {
		// 	this.Loadvalue = false;
		// 	if (res['Head']['ErrorCode'] == 0) {
		// 		this.branchList = [];
		// 		this.branchList.push({Branch: "ALL"});
		// 		for (let i=0;i<res['Body']['Details'].length;i++){
		// 			this.branchList.push(res['Body']['Details'][i]['EmployeeCode']);
		// 		}
		// 		this.selectBranch = this.branchList[0].Branch;
		// 	}
		// })
		this.storage.get('RMHierarchy').then(data => {
			if(data != null || data != undefined){
			this.Loadvalue = false;
			this.branchList = [];
			this.branchList.push({Branch: "ALL"});
			for (let i=0;i<data.length;i++){
				this.branchList.push(data[i]['EmployeeCode']);
			}
			this.selectBranch = this.reportType == 'Risk Report' ? null : this.branchList[0].Branch;
		}
		})
	}

	// on selection of year in fan payout summary

	selectedYear(event: any) {
		this.monthSelectionField = false;
		if (event == this.yearList[0]) {
			let d = new Date();
			let currentMonthNo = d.getMonth() + 1;
			this.monthList = this.monthList.slice(0, currentMonthNo)
		}
		else {
			this.monthList = this.commonService.last12Month(true, false);
		}

	}

	scriptExcel(){
		this.isScriptExcel = true;
		if (this.scriptVar != 'all') {
			if (this.scriptFilterVal == undefined || this.scriptFilterVal.length == 0 || this.scriptFilterVal.length == null || this.scriptMasterData == undefined || this.scriptMasterData.length == 0 || this.scriptMasterData == null) {
				this.isScriptExcel = false;
				this.toast.displayToast('Kindly fill all the fields');
				return;
			}
		}
		this.scriptMasterData = this.scriptVar === 'all' ? '' : this.scriptMasterData;
		this.scriptFilterVal = this.scriptVar === 'all' ? '' : this.scriptFilterVal;
		this.wireReqService.scriptMasterExcel(this.tokenVal, this.scriptMasterData, this.scriptFilterVal).subscribe((res: any) => {
			if (res['Head']['ErrorCode'] == 0) {
			let info: any = [];
            let head = [["scripname", "scripcode", "isin", "symbol", "BMFDHaircut", "Collateralhaircut", "IILhaircut", "IsCashcomponent", "haircutcategory", "series", "RBI Approved"]];
			res['Body']['ScripMasterDetails'].forEach((element: any) => {
				info.push([element.scripname, element.scripcode, element.isin, element.symbol, element.BMFDHaircut, element.Collateralhaircut, element.IILhaircut, element.IsCashcomponent, element.haircutcategory, element.series, element.NBFC === 'YES' ? 'Y' : 'N' ])
            });
				this.commonService.exportDataToExcel(head[0], info, 'Scrip Master');
				this.isScriptExcel = false;
			}
			else if (res['Head']['ErrorCode'] == 1) {
				this.toast.displayToast(res['Head']['ErrorDescription']);
				this.isScriptExcel = false;
			}
		})
	}

	changeExchType(event: any){
		this.isExchageTypeChanged = false;
	}
	changeOutstandingExch(event: any){
		this.isOutstandingExchageChanged = false;
	}
	changeOutstandingExchType(event: any){
		this.isOutstandingExchageTypeChanged = false;
	}
	changeOutstandingBranch(event: any){
		this.isOutstandingBranchChanged = false;	
	}

	typeScriptText(event: any){
		this.scriptMasterData = event.target.value;
	}

	scriptCodeChange(event: any){
		this.scriptMasterData = '';
		if(event && event.scriptValue){
			this.scriptFilterVal = event.scriptValue;
		}
	}

	// click on view Report button in desktop view
	viewReport(report: any) {
		this.displayonSubmit = true;
		this.reportTypeData.forEach(element => {
			if (element.reportType == this.selectType) {
				//element.display = element.display ? !!element.display : true;
				element.display = true;
				this.isReportObj[element.reportType] = true;
			}
			else {
				element.display = false;
				this.isReportObj[element.reportType] = false;
			}
		});

		if (this.selectType == 'Consolidated Trade Listing') {
			this.commonService.setClevertapEvent('Summaries_consolidatedtradelisitng', { 'Login ID': localStorage.getItem('userId1') });
			if(this.fromDate == undefined || this.fromDate == null || this.fromDate == ''){
				this.toast.displayToast('Kindly select As on Date');
				return;
			}
			if(this.tradelist == undefined || this.tradelist == null || this.tradelist == ''){
				this.toast.displayToast('Kindly select Report Type');
				return;
			}
			this.isTradeListing = true;
			this.passClientCode = this.passClientId;
		}

		this.fromDateReq = this.fromDate;
		this.toDateReq = this.toDate;

		if (this.selectType == 'Brokerage Request Status') {
			if (this.commonService.convertDateToMillisec(this.fromDateReq) > this.commonService.convertDateToMillisec(this.toDateReq)) {
				this.toast.displayToast('from Date cannot be more than To Date');
			}
			else {
				this.brokerageReqObj = {};
				this.brokerageReqObj.orderType = this.selectOrderType;
				this.brokerageReqObj.fromDate = moment(this.fromDateReq).format('YYYYMMDD')
				this.brokerageReqObj.ToDate = moment(this.toDateReq).format('YYYYMMDD')
				this.brokerageReqObj.status = this.selectOrderType;
				this.brokerageReqObj.isDesktopCall = true;
				this.commonService.setData(this.brokerageReqObj);
				this.commonService.setClevertapEvent('Brokerage_Requests');
				this.commonService.analyticEvent('Brokerage_Requests', 'Wire Reports');
			}
		}
		else if(this.selectType == 'Shares Deposit Report'){
			this.commonService.setClevertapEvent('Summaries_depositLedger', { 'Login ID': localStorage.getItem('userId1') });
			this.commonService.setClevertapEvent('SharesDepositReport');
			this.partnerID = this.selectPartner;
		}
		else if(this.selectType == 'Deposit Ledger'){
			this.commonService.setClevertapEvent('DepositLedger');
			this.partnerID = this.selectPartner;
		}
		else if(this.selectType == 'Real time Margin Shortfall'){
			this.commonService.setClevertapEvent('Summaries_realtimemarginshortfall', { 'Login ID': localStorage.getItem('userId1') });
			this.commonService.setClevertapEvent('Reports_MarginShortfall_Clicked');
			this.partnerID = this.wireCodeVar;
		}
		else if (this.selectType == 'JV Request Status') {
			if (this.commonService.convertDateToMillisec(this.fromDateReq) > this.commonService.convertDateToMillisec(this.toDateReq)) {
				this.toast.displayToast('from Date cannot be more than To Date');
			}
			else {
				this.jvReqObj = {};
				this.jvReqObj.fromDate = moment(this.fromDateReq).format('YYYYMMDD')
				this.jvReqObj.toDate = moment(this.toDateReq).format('YYYYMMDD')
				this.jvReqObj.Status = this.selectOrderType;
				this.jvReqObj.isDesktopCall = true;
				this.commonService.setData(this.jvReqObj);
				this.commonService.setClevertapEvent('JV_Status_Report');
				this.commonService.analyticEvent('JV_Status_Report', 'Wire Reports');
			}
		}
		else if (this.selectType == 'EPI Request Status') {
			if (this.commonService.convertDateToMillisec(this.fromDateReq) > this.commonService.convertDateToMillisec(this.toDateReq)) {
				this.toast.displayToast('from Date cannot be more than To Date');
			}
			else {
				this.epiReqObj = {};
				this.epiReqObj.fromDate = moment(this.fromDateReq).format('MM/DD/YYYY');
				this.epiReqObj.toDate = moment(this.toDateReq).format('MM/DD/YYYY');
				this.epiReqObj.clientCode = this.clientSearchValue;
				this.epiReqObj.Status = this.selectOrderType;
				this.epiReqObj.isDesktopCall = true;
				//this.commonService.setClevertapEvent('JV_Status_Report');
				//this.commonService.analyticEvent('JV_Status_Report', 'Wire Reports');
			}
		}
		else if (this.selectType == 'Risk Report' && this.typeChange == 'Client Summary') {
			if(!this.selectBranch){
				this.toast.displayToast("Kindly select RM/Partner Code from dropdown");
				return;
			}
			this.showClientSummary = true;
			this.branchOption = this.selectBranch;
              
			this.commonService.setClevertapEvent('Riskreport_ClientSummary');
			this.commonService.analyticEvent('Client_Summary', 'Wire Reports');
		}
		else if (this.selectType == 'Limit Request Status') {
			if (this.commonService.convertDateToMillisec(this.fromDateReq) > this.commonService.convertDateToMillisec(this.toDateReq)) {
				this.toast.displayToast('from Date cannot be more than To Date');
			}
			else {
				this.limitReqObj = {};
				this.limitReqObj.fromDate = moment(this.fromDateReq).format('YYYYMMDD')
				this.limitReqObj.toDate = moment(this.toDateReq).format('YYYYMMDD');
				this.limitReqObj.isDesktopCall = true;
				this.commonService.setData(this.limitReqObj);
				this.commonService.setClevertapEvent('Limit_Status_Report');
				this.commonService.analyticEvent('Limit_Status_Report', 'Wire Reports');
			}
		}
		else if (this.selectType == 'DP Scrip Payout') {
			this.commonService.setClevertapEvent('Summaries_dpscrippayout', { 'Login ID': localStorage.getItem('userId1') });
			this.isDpScriptDisplay = true;
			this.commonService.setClevertapEvent('DPscripPayout');
			if (this.commonService.convertDateToMillisec(this.fromDateReq) > this.commonService.convertDateToMillisec(this.toDateReq)) {
				this.toast.displayToast('from Date cannot be more than To Date');
			}
			else {
				this.dpScriptObj = {};
				this.dpScriptObj.fromDate = moment(this.fromDateReq).format('YYYYMMDD')
				this.dpScriptObj.toDate = moment(this.toDateReq).format('YYYYMMDD');
			}

			// 	this.commonService.setClevertapEvent('Limit_Status_Report');
			// 	this.commonService.analyticEvent('Limit_Status_Report', 'Wire Reports');
			// }
		}
		else if (this.selectType == 'Risk Report' && this.typeChange == 'Hold Physical FNO Report') {
			if(!this.selectFanCode){
				this.toast.displayToast('Kindly select Wire Code');
				this.showFno = false;
				return;
			}
			this.showFno = true;
			this.commonService.setClevertapEvent('Riskreport_FnO');
			this.passNfdcReport = this.ndfcReportType;
		}
		else if (this.selectType == 'Risk Report') {
			// if(!this.selectFanCode){
			// 	this.toast.displayToast('Kindly select Wire Code');
			// 	return;
			// }
			this.isViewClick = true;
			this.passNfdcReport = this.ndfcReportType;
			
			if(this.typeChange == 'T+5'){
				this.commonService.setClevertapEvent('Riskreport_T5');
			}
			else if(this.typeChange == 'T+6'){
				this.commonService.setClevertapEvent('Riskreport_T6');
			}
			else if(this.typeChange == '30 Days'){
				this.commonService.setClevertapEvent('Riskreport_30');
			}
			else if(this.typeChange == '90 Days'){
				this.commonService.setClevertapEvent('Riskreport_90');
			}
		}

		else if (this.selectType == 'BOD Holding') {
			this.commonService.setClevertapEvent('BOD Holdings', { 'Login ID': localStorage.getItem('userId1') });
			//this.passClientCode = this.passClientId
			this.passClientCode = this.clientSearchValue;

		} else if (this.selectType == 'Commodity Client Summary') {
			if (!this.riskText && !this.bId) {
				this.toast.displayToast('Kindly fill all the fields');
				return;
			}
			this.commonService.setClevertapEvent('CommodityClientSummary_Clicked');
			this.riskText = this.riskText;
			this.bId = this.selectBranch;
			this.viewClick = true;
		}
		else if (this.selectType == 'Outstanding Position') {
			this.passClientCode = this.passClientId
			this.isOutstandingExchageChanged = true;
			this.isOutstandingExchageTypeChanged = true;
			this.isOutstandingBranchChanged = true;
		}
		else if (this.selectType == 'Commodity Margin Summary') {
			//this.excType = true;
			this.isexchangView = true;
			this.passClientCode = this.passClientId
		}
		else if (this.selectType == 'FAN Brokerage Ledger') {
			this.commonService.setClevertapEvent('Summaries_fanbrokerageledger', { 'Login ID': localStorage.getItem('userId1') });
			if (this.commonService.convertDateToMillisec(this.fromDateReq) > this.commonService.convertDateToMillisec(this.toDateReq)) {
				this.toast.displayToast('from Date cannot be more than To Date');
			}
			else {
				this.fanBrokerageLedger = {}
				this.fanBrokerageLedger.fromDate = moment(this.fromDateReq).format('YYYYMMDD')
				this.fanBrokerageLedger.toDate = moment(this.toDateReq).format('YYYYMMDD')
				this.fanBrokerageLedger['partnerID'] = this.selectPartner ? this.selectPartner : null;

				this.commonService.setClevertapEvent('FanBrokerageLedger');
				this.commonService.analyticEvent('Partner_Brokerage_Ledger', 'Wire Reports');
			}
		}
		else if (this.selectType == 'FAN Payout Summary') {
			this.commonService.setClevertapEvent('Summaries_fanpayoutsummary', { 'Login ID': localStorage.getItem('userId1') });
			if (this.selectMonth == null && this.selectYear == null) {
				this.toast.displayToast('Please select month or year.');
			}
			else {
				this.fanPayoutObj = {}
				this.fanPayoutObj.selectMonth = this.selectMonth ? this.selectMonth : null;
				this.fanPayoutObj.selectYear = this.selectYear ? this.selectYear : null;
				this.fanPayoutObj.partnerID = this.selectPartner ? this.selectPartner : null;
				this.fanPayoutObj.isDesktopCall = true;
				this.commonService.setClevertapEvent('FanPayoutSummary');
				this.commonService.analyticEvent('Partner_Payout_Summary', 'Wire Reports');
			}

		} else if(this.selectType == 'Freeze Details'){
			this.commonService.setClevertapEvent('Summaries_freezedetails', { 'Login ID': localStorage.getItem('userId1') });
			if(this.selectedFreezeReason === null || this.selectedFreezeReason === undefined){
				this.toast.displayToast("Kindly select a freeze reason");
			} else {
				this.passFreezeReason = this.selectedFreezeReason;
			}
		} else if(this.selectType == 'DP Modification Details'){
			this.commonService.setClevertapEvent('Summaries_DPModification', { 'Login ID': localStorage.getItem('userId1') });
			if(this.selectedDpType === null || this.selectedDpType === undefined){

				this.toast.displayToast("Kindly select a DP Type");
				this.passDpType = null;
				return;
			} else if (this.commonService.convertDateToMillisec(this.fromDateReq) > this.commonService.convertDateToMillisec(this.toDateReq)) {
				
				this.toast.displayToast('From Date cannot be more than To Date');
				this.passDpType = null;
				return;
			} else {
				
				this.passDpType = this.selectedDpType;
			}
		}else if(this.selectType == 'Account Closure Status'){
			
			if (this.commonService.convertDateToMillisec(this.fromDateReq) > this.commonService.convertDateToMillisec(this.toDateReq)) {
				this.toast.displayToast('From Date cannot be more than To Date');
				return;
			} else {
				this.isAccountClosureReport = true;
			}
		} else if(this.selectType == 'DRF Status'){
			this.isDematRequestStatus = true;
			this.passDematDpType = this.selectedDematDpType;
		}





	}
	// changeSelectedOrderType(event) {
	// 	this.selectOrderType = event;
	// }
	// click on view Report button in Mobile view	
	viewReportMobile(type: any) {
		this.reportCaptured = type;
		this.displayonSubmit = true;
		this.fromDateReq = this.fromDate;
		this.toDateReq = this.toDate;

		if (this.reportType == 'JV Request Status') {
			if (this.commonService.convertDateToMillisec(this.fromDateReq) > this.commonService.convertDateToMillisec(this.toDateReq)) {
				this.toast.displayToast('from Date cannot be more than To Date');
			}
			else {
				this.jvReqObj = {};
				this.jvReqObj.fromDate = moment(this.fromDateReq).format('YYYYMMDD');
				this.jvReqObj.toDate = moment(this.toDateReq).format('YYYYMMDD');
				this.jvReqObj.Status = this.selectOrderType;
				this.commonService.setData(this.jvReqObj);
				this.jvReqObj.isDesktopCall = false;
				this.router.navigate(['/jv-request']);

				this.commonService.setClevertapEvent('JV_Status_Report');
				this.commonService.analyticEvent('JV_Status_Report', 'Wire Reports');
			}
		}
		if (this.reportType == 'EPI Request Status') {
			if (this.commonService.convertDateToMillisec(this.fromDateReq) > this.commonService.convertDateToMillisec(this.toDateReq)) {
				this.toast.displayToast('from Date cannot be more than To Date');
			}
			else {
				this.epiReqObj = {};
				this.epiReqObj.fromDate = moment(this.fromDateReq).format('MM/DD/YYYY');
				this.epiReqObj.toDate = moment(this.toDateReq).format('MM/DD/YYYY');
				this.epiReqObj.clientCode = this.clientSearchValue;
				//this.epiReqObj.Status = this.selectOrderType;
				this.commonService.setData(this.epiReqObj);
				this.epiReqObj.isDesktopCall = false;
				this.router.navigate(['/epi-share-from']);

				//this.commonService.setClevertapEvent('JV_Status_Report');
				//this.commonService.analyticEvent('JV_Status_Report', 'Wire Reports');
			}
		}
		else if (this.reportType == 'Limit Request Status') {
			if (this.commonService.convertDateToMillisec(this.fromDateReq) > this.commonService.convertDateToMillisec(this.toDateReq)) {
				this.toast.displayToast('from Date cannot be more than To Date');
			}
			else {
				this.limitReqObj = {};
				this.limitReqObj.fromDate = moment(this.fromDateReq).format('YYYYMMDD');
				this.limitReqObj.toDate = moment(this.toDateReq).format('YYYYMMDD');
				this.commonService.setData(this.limitReqObj);
				this.limitReqObj.isDesktopCall = false;
				this.router.navigate(['/limit-request-status']);

				this.commonService.setClevertapEvent('Limit_Status_Report');
				this.commonService.analyticEvent('Limit_Status_Report', 'Wire Reports');
			}
		}
		else if (this.reportType == 'BOD Holding') {
			localStorage.setItem('clientId',JSON.stringify(this.clientSearchValue));
			this.router.navigate(['/bod-holding']);
		}
		else if (this.reportType == 'Shares Deposit Report') {
			this.router.navigate(['/share-deposit-report']);
			this.commonService.setClevertapEvent('SharesDepositReport');
			this.commonService.analyticEvent('Partner_Share_Deposit_Details', 'Wire Reports');
		}
		else if (this.selectType == 'DP Scrip Payout') {
			this.commonService.setClevertapEvent('DPscripPayout');
			if (this.commonService.convertDateToMillisec(this.fromDateReq) > this.commonService.convertDateToMillisec(this.toDateReq)) {
				this.toast.displayToast('from Date cannot be more than To Date');
			}
			else {
				this.dpScriptObj = {};
				this.dpScriptObj.fromDate = moment(this.fromDateReq).format('YYYYMMDD')
				this.dpScriptObj.toDate = moment(this.toDateReq).format('YYYYMMDD');
				this.router.navigate(['/dpc-script'],{ queryParams: {fromDate: this.dpScriptObj.fromDate, toDate: this.dpScriptObj.toDate}});
			}
		}
		else if (this.reportType == 'Brokerage Request Status') {
			this.brokerageReqObj = {};
			this.brokerageReqObj.orderType = this.selectOrderType;
			this.brokerageReqObj.fromDate = moment(this.fromDateReq).format('YYYYMMDD')
			this.brokerageReqObj.ToDate = moment(this.toDateReq).format('YYYYMMDD')
			this.brokerageReqObj.status = this.selectOrderType;
			this.brokerageReqObj.isDesktopCall = false;
			this.commonService.setData(this.brokerageReqObj);
			this.router.navigate(['/brokerage-request']);

			this.commonService.setClevertapEvent('Brokerage_Requests');
			this.commonService.analyticEvent('Brokerage_Requests', 'Wire Reports');

		} else if (this.reportType == 'Deposit Ledger') {
			if(!this.selectBranch){
				this.toast.displayToast("Kindly select RM/Partner Code from dropdown");
				return;
			}
			this.commonService.setData(this.selectBranch);
			this.commonService.setClevertapEvent('DepositLedger');
			this.router.navigate(['/equity-deposit-details']);
		} else if (this.reportType == 'FAN Brokerage Ledger') {
			if (this.commonService.convertDateToMillisec(this.fromDateReq) > this.commonService.convertDateToMillisec(this.toDateReq)) {
				this.toast.displayToast('from Date cannot be more than To Date');

				this.commonService.setClevertapEvent('FanBrokerageLedger');
				this.commonService.analyticEvent('Partner_Brokerage_Ledger', 'Wire Reports');
			}
			else {
				this.fanBrokerageLedger = {}
				this.fanBrokerageLedger.fromDate = moment(this.fromDateReq).format('YYYYMMDD')
				this.fanBrokerageLedger.toDate = moment(this.toDateReq).format('YYYYMMDD')
				this.fanBrokerageLedger['partnerID'] = this.selectPartner ? this.selectPartner : null;
				this.commonService.setData(this.fanBrokerageLedger);
				this.commonService.setClevertapEvent('FanBrokerageLedger');
				this.router.navigate(['/brokerage-ledger-report']);
			}

		} 
		else if (this.reportType == 'Risk Report' && this.typeChange == 'Hold Physical FNO Report') {
			this.commonService.setClevertapEvent('Riskreport_FnO');
			this.commonService.setData(this.ndfcReportType);
			this.router.navigate(['/physical-fno']);
		}
		else if (this.reportType == 'Risk Report' && this.ndfcReportType == 1) {
			if(!this.selectBranch){
				this.toast.displayToast("Kindly select RM/Partner Code from dropdown");
				return;
			}
			this.commonService.setClevertapEvent('Riskreport_ClientSummary');
			this.storage.set('selectedBranch', this.selectBranch);
			this.storage.set('clientToken', this.tokenVal);
			let passSelectBranch  = this.selectBranch;
			this.selectBranch = "";
			this.router.navigate(['/client-summary-mobile'],{ queryParams: { branch: passSelectBranch, token: this.tokenVal } });
		}
		else if (this.selectType == 'Risk Report') {
			if(this.typeChange == 'T+5'){
				this.commonService.setClevertapEvent('Riskreport_T5');
				this.nfdcRiskMobile();
			}
			else if(this.typeChange == 'T+6'){
				this.commonService.setClevertapEvent('Riskreport_T6');
				this.nfdcRiskMobile();
			}
			else if(this.typeChange == '30 Days'){
				this.commonService.setClevertapEvent('Riskreport_30');
				this.nfdcRiskMobile();
			}
			else if(this.typeChange == '90 Days'){
				this.commonService.setClevertapEvent('Riskreport_90');
				this.nfdcRiskMobile();
			}
		}
		else if (this.selectType == 'Risk Report' && (this.ndfcReportType == 5 || this.ndfcReportType == 6 || this.ndfcReportType == 30 || this.ndfcReportType == 90)) {
			this.nfdcRiskMobile();
		}
		else if (this.selectType == 'FAN Payout Summary') {

			if (this.selectMonth == null && this.selectYear == null) {
				this.toast.displayToast('Please select month or year.');
			}
			else {
				this.fanPayoutObj = {}
				this.fanPayoutObj.selectMonth = this.selectMonth ? this.selectMonth : null;
				this.fanPayoutObj.selectYear = this.selectYear ? this.selectYear : null;
				this.fanPayoutObj.partnerID = this.selectPartner ? this.selectPartner : null;
				this.fanPayoutObj.isDesktopCall = false;
				this.commonService.setData(this.fanPayoutObj);
				this.router.navigate(['/fan-payout-summary']);
				this.commonService.setClevertapEvent('FanPayoutSummary');
				this.commonService.analyticEvent('Partner_Payout_Summary', 'Wire Reports');
			}

		} else if (this.selectType == 'Commodity Client Summary') {
			if (!this.riskText && !this.bId) {
				this.toast.displayToast('Kindly fill all the fields');
				return;
			}
			this.commonService.setClevertapEvent('CommodityClientSummary_Clicked');
			this.commSummaryObj = {}
			this.commSummaryObj.riskText = this.riskText;
			this.commSummaryObj.bId = this.selectBranch;
			//this.commSummaryObj.viewClick = true; 
			this.commonService.setData(this.commSummaryObj);
			this.router.navigate(['/commodity-client-summary']);
			
			
		}else if (this.selectType == 'DP Modification Details') {

			this.commonService.setClevertapEvent('Summaries_DPModification', { 'Login ID': localStorage.getItem('userId1') });
			if(this.selectedDpType === null || this.selectedDpType === undefined){

				this.toast.displayToast("Kindly select a DP Type");
				this.passDpType = null;
				return;
			} else if (this.commonService.convertDateToMillisec(this.fromDateReq) > this.commonService.convertDateToMillisec(this.toDateReq)) {
				
				this.toast.displayToast('From Date cannot be more than To Date');
				this.passDpType = null;
				return;
			} else {

				let dpModificationData: any = {};
				dpModificationData.fromDate = this.fromDateReq;
				dpModificationData.toDate = this.toDateReq;
				dpModificationData.dpType = this.selectedDpType;
	
				this.commonService.setData(dpModificationData);
				this.router.navigate(['/dp-modification-details']);	
			}
		} else if (this.selectType == 'Freeze Details') {
			if(this.selectedFreezeReason === null || this.selectedFreezeReason === undefined){
				this.toast.displayToast("Kindly select a freeze reason");
				return;
			}
			this.commonService.setData(this.selectedFreezeReason);
			this.router.navigate(['/freeze-details']);
		}
		else if (this.selectType == 'Consolidated Trade Listing') {
			if(this.fromDate == undefined || this.fromDate == null || this.fromDate == ''){
				this.toast.displayToast('Kindly select As on Date');
				return;
			}
			if(this.tradelist == undefined || this.tradelist == null || this.tradelist == ''){
				this.toast.displayToast('Kindly select Report Type');
				return;
			}
			let ctlDataObj: any = { reportType: this.tradelist, asOnDate: moment(this.fromDate).format('YYYYMMDD') };
			this.commonService.setData(ctlDataObj);
			this.router.navigate(['/consolidated-trade-listing']);
		}
		else if (this.selectType == 'DRF Status') {
			localStorage.setItem('dematDpType',JSON.stringify(this.selectedDematDpType))
			this.router.navigate(['/demat-request-status']);	
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

	nfdcRiskMobile(){
		// if(!this.selectFanCode){
		// 	this.toast.displayToast('Kindly select Wire Code');
		// 	return;
		// }
		this.router.navigate(['/nfdc-risk-mobile'],{ queryParams: { reportType: this.ndfcReportType, wireCode: this.selectFanCode } });
	}

	dismiss(){
		this.modalController.dismiss();
	  }

							async displyPopupPhysicalFnoConfirmmodal() {
								const modal = this.modalController.create({
										component: PhysicalFnoConfirmModalMobileComponent,
										componentProps: {},
										cssClass: 'phy_fno_confirm_changes',
								  backdropDismiss: true
									});
									return (await modal).present();
								}

								async displyPopupPhysicalFnoSuccessmodal() {
									const modal = this.modalController.create({
											component: PhysicalFnoSuccessModalMobileComponent,
											componentProps: {},
											cssClass: 'phy_fno_success',
									  backdropDismiss: true
										});
										return (await modal).present();
									}

					
					

				equityBlockButton: any[] = [
					{ Name: 'Equity', Value: 'equity', active: 1 },
					{ Name: 'F&O', Value: 'fo', active: 0 },
					{ Name: 'SLBM', Value: 'slbm', active: 0 },
					{ Name: 'Collateral', Value: 'col', active: 0 }
				];

	searchHierarchyList(event: any) {
		const textSerach = event.target.value.toLowerCase();
		this.setTextSearch = event.target.value;
		if (textSerach && (textSerach.length > 3 || textSerach == 'all')) {
			this.noRecord = false;
			this.searchRmhierarchyTerms.next(textSerach);
		} else {
			this.selectFanCode = null;
			this.fanCodeList = [];
		}
	}

	setHierarchyList(result: any) {
		if (result[0].length || this.setTextSearch == 'all') {
			if (this.reportType == 'Outstanding Report' || (this.reportType == 'Risk Report' && this.typeChange == 'Client Summary') || this.reportType == 'Commodity Client Summary' || (this.reportType == 'Risk Report' && this.ndfcReportType == 7)) {
				let details = [];
				for (const item of result[0]) {
					details.push({
						EmployeeName: item.employeeName,
						EmployeeCode: item.employeeId,
						EmployeeLevel: item.level
					})
				}
				this.fanCodeList = [{ EmployeeCode: "All", 'EmployeeLevel': "", EmployeeName: "" }, ...details];
			} else {
				let details = [];
				for (const item of result[0]) {
					details.push({
						EmployeeName: item.employeeName,
						EmployeeCode: item.employeeId,
						EmployeeLevel: item.level
					})
				}
				this.fanCodeList = details;
			}
			this.showFanCodeDropdown = true;
		}
		if (result[0].length === 0 && this.setTextSearch !== 'all') {
			this.noRecord = true;
			this.showFanCodeDropdown = false;
		}
	}


	handleSelectFanCode(fanCode: any) {
		this.hierarchyListVar = fanCode.EmployeeCode;
		this.selectedFanCode = fanCode.EmployeeCode;
		this.selectFanCode = fanCode.EmployeeCode;
		this.selectPartner = fanCode.EmployeeCode;
		this.selectBranch = fanCode.EmployeeCode;
		this.wireCodeVar = fanCode.EmployeeCode;
		this.wireCodeChange(fanCode)
		this.changeWireCode(fanCode)
		this.showFanCodeDropdown = false;
		this.isOutstandingBranchChanged = false;
		if (this.selectType == 'Commodity Client Summary') {
			this.viewClick = false;
		}
	}
	onInputClick() {
		this.showFanCodeDropdown = !this.showFanCodeDropdown;
	}			

	/**
 	* To get FAN code list for GST Tax invoice report.
 	*/
	getFANCodeList() {
		this.storage.get('RMHierarchy').then(data => {
			// this.fanCodeList = data;
		})
	}

	getPartnerCodes() {
		this.storage.get('RMHierarchy').then(data => {
			if(data != null || data != undefined){
			this.pCodeList = data;
			this.pCodeList.unshift({ EmployeeCode: "All", 'EmployeeLevel': "", EmployeeName: "", ManagerCode: "", ManagerName: "", innerDetail: [], isChecked: false, isVisible: true, type: "Individual" });
			this.pCodeList = this.pCodeList.filter(object => {
				return object.EmployeeCode !== localStorage.getItem('userId1');
			});
		}
		})
	}
	
	/*
	On click of download pdf button
	*/
	onDownloadPdfClick() {
		this.commonService.setClevertapEvent('GST Invoice_Clicked');
		if (this.fromDate > this.toDate) {
			this.toast.displayToast('From Date should not be greater than To Date');
		} else {
			this.dataLoad = true;
			var tokenValue;
			this.storage.get('userType').then(type => {
				if (type === 'RM' || type === 'FAN') {
					this.storage.get('bToken').then(token => {
						this.downloadPDF(token);
					})
				} else {
					this.storage.get('subToken').then(token => {
						this.downloadPDF(token);
					})
				}
			})
		}
	}

	downloadPDF(token: any) {
		let dataToSend = {
			rptId: this.rptID,
			FromDate: moment(this.fromDate).format('YYYYMMDD'),
			ToDate: moment(this.toDate).format('YYYYMMDD'),
			FanCode: this.selectFanCode ? this.selectFanCode : undefined,
			SendEmail: "N",
			CallFrom:'AAA'
		}
		this.subscription.add(
			this.shareReportSer
				.sharedDownloadReport(token, dataToSend)
				.subscribe((res) => {
					this.dataLoad = false;
					this.commonService.downLoadReportFun(res)
				}, (error) => {
					this.dataLoad = false;
					console.log(error, 'error');
				}))
	}

	displayClientDetails(data: any) {
		// localStorage.setItem('select_client', JSON.stringify(data))
		this.clientSearchValue = data.ClientCode.split('-')[0].trim()//JSON.parse(localStorage.getItem('select_client'))['ClientCode'];
		this.clientCode = data.ClientCode.split('-')[0].trim();
		localStorage.setItem('slctdClientCode', this.clientSearchValue);
	}

	limitChangeMobile(){
		this.router.navigate(['/limit-insert']);
	}
	jvRequestMobile(){
		this.router.navigate(['/jv-insert']);
	}
	brokerageRequestMobile(){
		this.router.navigate(['/brok-insert-mobile']);
	}
	
	limitChangeRedirect(){
		this.router.navigate(['/wire-requests/limit-change']);
	}
	jvRequestRedirect(){
		this.router.navigate(['/wire-requests/jv-request']);
	}
	brokerageRequestRedirect(){
		this.router.navigate(['/wire-requests/brokerage-request']);
	}

	showDropDown() {
		this.isListVisible = true;
		this.clientSearchValue = '';
		this.dtLoad = true;
	}
	hideDropDown() {
		setTimeout(() => {
			this.isListVisible = false;
		}, 300);
	}
	/**
	 * To get all client list.
	 * @param token 
	 */
	clientApiCalls(token: any) {
		this.storage.get('mappingDetails').then((details) => {
			this.cliList = details;
			if (details == null) {
				this.getMappingRM(token);
			}
			this.storage.get('setClientCodes').then((clientCodes) => {
				this.clientCodeData = clientCodes;
				this.cliList.forEach(element => {
					this.clientCodeData.push({ ClientCode: element.ClientCode });
				})
			});
		});
	}
	public getMappingRM(cookieValue: any) {
		this.dataLoad = true;
		this.storage.get('userID').then((userId) => {
			this.subscription = new Subscription();
			const params = {
				AdminCode: userId
			}
			this.subscription.add(
				this.serviceFile
					.getRMMapping(params, userId, cookieValue)
					.subscribe((response: any) => {
						this.dataLoad = false;
						if (response['body'].status == 0) {
							this.cliList = response['body'].details;
							this.storage.set('mappingDetails', response['body'].details);
						}
						else {
							this.cliList = [];
						}
					}, (error) => {this.dataLoad = false;})
			)
		})
	}
	
	setClientSearch(res: any) {
		if (res.length) {
			let data = [];
			for (const item of res) {
				data.push({
					ClientCode: item
				})
			}
			this.allClients = data;
		} else {
			this.allClients = [];
		}
		this.dtLoad = true;
	}

	searchClient(text: any) {
		let searchValue = text.trim();
		this.isListVisible = false;
		if (searchValue && searchValue.length > 3) {
			this.dtLoad = false;
			this.isListVisible = true;
			this.clientSearchTerms.next(searchValue);
		} else {
			this.allClients = [];
		}
	}

	epiRequestRedirect(){
		this.router.navigate(['/wire-requests/epi-share-from']);
	}
	

	public getHierarchyList(){
		setTimeout(() => {
		this.storage.get('hierarchyList').then( list => {
			if(this.reportType == "Outstanding Position"){
				this.hierarchyListArr = [];
				this.hierarchyListArr.push({
					EmployeeCode:"ALL"
				});
			}
			if (list) {
				this.hierarchyListArr.push(...list);
			}
		})
		}, 500);
	}
	/**
	 * On click of pdf/excel icon
	 */
	onPdfExcelDownload(fileType: any) {
		this.commonService.setClevertapEvent('Summaries_Outstandingposition', { 'Login ID': localStorage.getItem('userId1') });
		if(this.hierarchyListVar == null || this.hierarchyListVar == undefined){
			this.toast.displayToast('Please provide valid parameters');
			return
		}
		this.dataLoad = true;
		this.wireReqService
			.getOutstandingReport(this.tokenVal, moment(this.fromDate).format('YYYYMMDD'), this.hierarchyListVar, this.selectOrderType, this.selectOrderType1)
			.subscribe((res: any) => {
				this.fileData = [];
				if(res['Body'] && res['Body']['objGetClientOutstandingResBody'])
				{
					this.fileData = res['Body']['objGetClientOutstandingResBody'];
				}
				if (this.fileData && this.fileData.length > 0 && this.fileData != null) {
					this.dataLoad = false;
					let info: any = [];
					let head = [["Td LoginId", "Branch", "Contract Description", "Long Qty", "Avg rate", "Short Qty", "Short Qty Avg Rate", "Net Qty", "Avg rate", "Cl.Price", "P/L"]];
					const sum = this.fileData.reduce((acc: any, currVal: any) => {
						// const item = acc.length > 0 && acc.find(({ Td_LoginId }) => Td_LoginId === currVal.Td_LoginId);
						// review. changed code
						const item = acc.length > 0 && acc.find(({ Td_LoginId }: any) => {
							return Td_LoginId === currVal.Td_LoginId;
						});

						if (item) {
							item.Long_Qty = parseInt(item.Long_Qty) + parseInt(currVal.Long_Qty);
							item.Short_Qty = parseInt(item.Short_Qty) + parseInt(currVal.Short_Qty);
						} else acc.push({ Td_LoginId: currVal.Td_LoginId, Long_Qty: parseInt(currVal.Long_Qty), Short_Qty: parseInt(currVal.Short_Qty) })
						return acc
					}, []);
					this.fileData.forEach((element: any) => {
						// let obj = sum.find(({ Td_LoginId }) => Td_LoginId === element.Td_LoginId);
						// review. changed code
						let obj = sum.find(({ Td_LoginId }: any) => {
							return Td_LoginId === element.Td_LoginId;
						});

						if (obj) {
							element['totalLong_Qty'] = obj.Long_Qty;
							element['totalShort_Qty'] = obj.Short_Qty;
						}
					})
					let groups = _.groupBy(this.fileData, 'Td_LoginId');
					Object.keys(groups).forEach((key) => {
						let lq: any, sq: any;
						groups[key].forEach((element: any) => {
							if (!groups[key]) return;
							if (groups[key].length > 1) {
								info.push([element.Td_LoginId, element.Branch, element.Contract_Description, element.Long_Qty, element.Avg_rate, element.Short_Qty, element.Short_Qty_Avg_Rate, element.Net_Qty, element.NetRate, element.Close_Price, element.PL])
								lq = element.totalLong_Qty ? element.totalLong_Qty : "";
								sq = element.totalShort_Qty ? element.totalShort_Qty : "";
							} else if (groups[key].length == 1) {
								info.push([element.Td_LoginId, element.Branch, element.Contract_Description, element.Long_Qty, element.Avg_rate, element.Short_Qty, element.Short_Qty_Avg_Rate, element.Net_Qty, element.NetRate, element.Close_Price, element.PL])
								lq = element.totalLong_Qty ? element.totalLong_Qty : "";
								sq = element.totalShort_Qty ? element.totalShort_Qty : "";
							}
						});
						if (fileType === 'pdf') {
							info.push([{ content: '', colSpan: 1 }, { content: 'Total', colSpan: 2 }, { content: lq, colSpan: 1 }, { content: '', colSpan: 1 }, { content: sq, colSpan: 1 }, { content: '', colSpan: 5 }]);
						} else {
							info.push(['', 'Total', '', lq.toString(), '', sq.toString()]);
						}
					});
					// if (fileType === 'pdf') {
					// 	this.commonService.savePdfFile(head, info);
					// 	this.dataLoad = false;
					// } else {
					// 	this.commonService.exportDataToExcel(head[0], info, 'Outstanding Position');
					// 	this.dataLoad = false;
					// }
					
					if (fileType === 'pdf') {
						const doc = new jsPDF('l', 'mm', 'a3');
						autoTable(doc, {
							head: head,
							body: info,
							theme: 'grid',
							styles: { overflow: 'linebreak' },
							headStyles: { fillColor: '#f2f4f4', textColor: '#000000', fontSize: 16, lineWidth: 0.25, lineColor: [0, 0, 0] },
							columnStyles: { text: { cellWidth: 'auto' } },
							bodyStyles: { fontSize: 11, textColor: '#000000' },
							didParseCell: function (table) {
								if (table && table.table) {
									table.table['body'].filter((item: any) => {
										if (item.raw[1].content === 'Total') {
											if (item.cells[1] || item.cells[3] || item.cells[5]) {
												item.cells[1].styles['fontSize'] = 16;
												item.cells[1].styles['fontStyle'] = 'bold'
												item.cells[3].styles['fontSize'] = 16;
												item.cells[3].styles['fontStyle'] = 'bold'
												item.cells[5].styles['fontSize'] = 16;
												item.cells[5].styles['fontStyle'] = 'bold'
											}
										}
									});
								}
							}
						});
						var blobData = doc.output("blob");
						if (this.commonService.isApp()) {

							// old code
							// const writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.externalDataDirectory;
							const writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.externalRootDirectory + 'Download/';
							const filename = 'Outstanding-Report';
							fetch(URL.createObjectURL(blobData),
							{
								method: "GET"
							}).then(res => res.blob()).then(blob => {
								this.file.writeFile(writeDirectory, filename + '.pdf', blob, { replace: true }).then((res: any) => {
									this.fileOpener.open(
										res.nativeURL,
										'application/pdf'
									)
								}).catch(err => {
									console.log("save error")
								});
							}).catch(err => {
								console.log("error");
							});
						} else {
							doc.save('reports.pdf');
						}
						this.dataLoad = false;
					} else {
						let workbook = new Workbook();
						let worksheet = workbook.addWorksheet('Outstanding Position');
						let titleRow = worksheet.getCell('C1');
						titleRow.font = {
							name: 'Calibri',
							size: 16,
							underline: 'single',
							bold: true,
							color: { argb: '0085A3' }
						}
						titleRow.alignment = { vertical: 'middle', horizontal: 'center' }
						let headerRow = worksheet.addRow(head[0]);
						headerRow.eachCell((cell, number) => {
							cell.fill = {
								type: 'pattern',
								pattern: 'solid',
								fgColor: { argb: '4167B8' },
								bgColor: { argb: '' },
							}
							cell.font = {
								bold: true,
								color: { argb: 'FFFFFF' },
								size: 12
							}
						})
						//Adding Data with Conditional Formatting
						info.forEach((d: any) => {
							let row = worksheet.addRow(d);
							row.eachCell((cell) => {
								cell.font = { name: 'Calibri', family: 4, size: 11 };
							})
							if (d[1] === 'Total') {
								row.font = { name: 'Calibri', family: 4, size: 12, bold: true };
							}
						}
						);
						worksheet.getColumn(1).width = 15;
						worksheet.getColumn(2).width = 10;
						worksheet.getColumn(3).width = 20;
						worksheet.getColumn(4).width = 10;
						worksheet.getColumn(5).width = 10;
						worksheet.getColumn(6).width = 10;
						worksheet.getColumn(7).width = 10;
						worksheet.getColumn(8).width = 10;
						worksheet.getColumn(9).width = 15;
						worksheet.getColumn(10).width = 15;
						worksheet.getColumn(11).width = 15;
						//Generate & Save Excel File
						workbook.xlsx.writeBuffer().then((data) => {
							let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
							if (this.commonService.isApp()) {
								this.commonService.downloadXlsForMobile(blob, true);
								this.dataLoad = true;
							}
							else {
								saveAs(blob, "outstanding-reports" + '.xlsx');
								this.dataLoad = false;
							}
						})
					}
				} else {
					this.dataLoad = false;
					this.toast.displayToast('No Data Found');
				}
			}, (error) => {
				this.dataLoad = false;
				console.log(error, 'error');
			})
	}

	desktopDatePosition = (reportName: string) => {
		this.datePositionCenter = false;
		if(reportName == "JV Request Status" || reportName == "Brokerage Request Status"
			|| reportName == "FAN Brokerage Ledger" || reportName == "DP Modification Details"
			|| reportName == "GST Invoice"){
			this.datePositionCenter = true;
		}
	}
}


