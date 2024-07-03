import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import moment from 'moment';
import { ShareReportService } from '../../pages/share-reports/share-report.service';
import { LoginService } from '../../pages/login/login.service';
import { Subscription, Subject } from 'rxjs';
import { Platform } from '@ionic/angular';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import { PopoverController } from '@ionic/angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import * as _ from 'lodash';    
import { ClientTradesService } from '../recently-viewed-client-list/client-trades.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { DashBoardService } from '../dashboard/dashboard.service';
import { CustomEncryption } from '../../../config/custom-encrypt';
import { environment, investObj } from '../../../environments/environment';
import { CommonService } from '../../helpers/common.service';
import { ToasterService } from '../../helpers/toaster.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { ComingSoonPopoverComponent } from '../../components/coming-soon-popover/coming-soon-popover.component';
import { DPTransactionService } from '../../components/dp-transaction/dp-transaction.service';

@Component({
	selector: 'app-share-reports',
	providers: [ShareReportService, CustomEncryption, LoginService, WireRequestService, ClientTradesService,DPTransactionService, DashBoardService ],
	templateUrl: './share-reports.page.html',
	styleUrls: ['./share-reports.page.scss'],
})
export class ShareReportsPage implements OnInit {

	displayonSubmit: boolean = false
	private subscription: any;
	showAMCReport: boolean = false;
	showCrtrReport: boolean = false;
	isMobileAMC: boolean = false;
	public clientSearchValue: any = null;
	public panSearchValue: any = null;
	public isDropDownVisible: boolean = false;
	public isPanDropDownVisible: boolean = false;
	clientList: any[] = [];
	cliList: any[] = [];
	isMegaMenuRpt: boolean = false;
	dtLoad: boolean = false;
	reportTitle: any;
	clientCodeData: any[] = [];
	datas: any[] = [];
	allClients: any[] = [];
	isAMCReport: boolean = false;
	currentDate: any;
	
	// digitalProductValue: string = 'Equity / Currency / IIL Commodity';
	public isProd = environment['production'];
	settlementObj: any;
	yearRangeValue: any;
	urlParameter: any;
	yearDateOption: string = 'dateWise';
	detailedSummarisedValue: string = 'Detailed';
	clientCode: any;
	timeSpanValue: any = '1M';
	fromDate: any;
	toDate: any;
	clientName: any;
	email: any;
	mail_key: any;
	dataLoad: boolean = true;
	dpTransObj: any;
	fromDateReq: any
	toDateReq: any;
	fileType:any;
	searchValue: any;
	typeOfClient: any;
	dpHoldingObj: any;
	asOnDate:any;
	loader: boolean = false;
	// Reference of this below list on line 248 and 249 of share-report html
	shareReportTypeList: any[] = [
		{ shareType: "Realised PnL", value: 'realised', display: false },
		{ shareType: "Simplified Ledger", value: 'simplified', display: false },
		{ shareType: "Unrealised PnL", value: 'unrealised', display: false },
		{ shareType: "Commodity Realtime", value: 'crtr', display: false },
		{ shareType: "DP transaction", value: 'dpTransaction', display: false },
		{ shareType: "Trade Listing", value: 'tradeListing', display: false },
		// { shareType: "Client 360 Report", value: '360Client', display: false },
		{ shareType: "MF Capital Gain", value: 'mfCapital', display: false },
		{ shareType: "MF Account Statement", value: 'mfAccount', display: false },
		{ shareType: "AMC Statement", value: 'amcStmt', display: false },
		{ shareType: "STT Certificate", value: 'sttCertificate', display: false },
		{ shareType: "Daily Bills", value: 'dailyBills', display: false },
		{ shareType: "Digital Contract Notes", value: 'digitalContract', display: false },
		{ shareType: "Interest on Delayed Payment", value: 'interestOnDelayedPayment', display: false },
		{ shareType: "DP Holding", value: 'dpholding', display: false },
	]

	dpList: any[] = [
		{ label: "NSDL", value: 'NSDL' },
		{ label: "CDSL", value: 'CDSL' },
	]

	dpType: any = null;

	selectedShareType: any = null;

	tillDate: any;

	financialYr: any;
	financialYrList: any[] = [];
	exchangeDailyBillsList: any[] = [
		{ option: 'BSE CASH' },
		{ option: 'NSE CASH' },
		{ option: 'BSE CURRENCY' },
		{ option: 'NSE CURRENCY' },
		{ option: 'NSE FNO' },
		{ option: 'BSE FNO' },
	]
	exchangeDailyBillsValue: string = this.exchangeDailyBillsList[0].option;
	dailyBillsProductTypeList: any[] = [
		{ option: 'Equity / Currency / Commodity', value: 'EQ' },
	];
	dailyBillsProductValue: any = this.dailyBillsProductTypeList[0].value;

	sharedReportBaseUrl: any = 'https://reports.indiainfoline.com/myaccount/ReportLandingPage.aspx?'

	productTypeList: any[] = [
		{ option: 'Cash', value: 'cash' },
		{ option: 'Currency', value: 'currency' },
		{ option: 'Commodity', value: 'commodity' },
		{ option: 'F&O', value: 'f&o' },
	]
	productValue = this.productTypeList[0].value;
	tokenValue: any;

	digitalProductTypeList: any[] = [
		{ option: 'Equity / Currency / FNO', value: 'EQ' },
		{ option: 'Commodity', value: 'COM' },
	]

	digitalProductValue: any = this.digitalProductTypeList[0].value

	digitalContractExchList: any[] = [
		{ option: 'NSE-Cash', value: 'NSE-Cash' },
		{ option: 'BSE-Cash', value: 'BSE-Cash' },
		{ option: 'NSE-FNO', value: 'NSE-FNO' },
		{ option: 'BSE-FNO', value: 'BSE-FNO' },
		{ option: 'NSE-Currency', value: 'NSE-Currency' },
		{ option: 'BSE-Currency', value: 'BSE-Currency' },
		{ option: 'NSE-Buyback', value: 'C' },
		{ option: 'BSE-Buyback', value: 'C' },
		{ option: 'NSE-OFS', value: 'NSE-OFS' },
		{ option: 'BSE-OFS', value: 'BSE-OFS' },
		{ option: 'NSE-Physical', value: 'NSE-Physical'},
		{ option: 'BSE-Physical', value: 'BSE-Physical'},
		// { option: 'MCX' },
		// { option: 'NCDEX'},
	]

	tradeListExch: any[] = [
		{ option: 'All', value: "ALL" },
		{ option: 'BSE-cash', value: 'BSECASH' },
		{ option: 'NSE-cash', value: 'NSECASH' },
		{ option: 'BSE-curr', value: 'BSECURRENCY' },
		{ option: 'NSE-curr', value: 'NSECURRENCY' },
		{ option: 'BSE-FO', value: 'BSEFNO' },
		{ option: 'NSE-FO', value: 'NSEFNO' },
		{ option: 'BSE-Comm', value: 'ABD' },
		{ option: 'NSE-Comm', value: 'AND' },
		{ option: 'MCX', value: 'MCX' },
		{ option: 'NCDEX', value: 'IND' }
	]

	tradeListingExchValue: any = this.tradeListExch[0].value

	digitalContactExchValue: any = this.digitalContractExchList[0].value;

	tradeTradeList: any[] = [
		{ name: 'Scripwise Summary', value: 'ScripwiseSummary' },
		{ name: 'Datewise Summary', value: 'DatewiseSummary' },
	]

	tradeListValue = this.tradeTradeList[0].value;


	simpLedgerObj: any;
	unRealizedPlObj: any;
	digitalContractObj: any;
	dailyBillsObj: any;
	realizedPlObj: any;
	tradeListObj: any;
	Loadvalue: boolean = false;
	inputattr: boolean = false;
	//visibleDpIp:boolean = false;
	//nsdlList:any[] = [];
	//cdslList:any[] = [];
	DpIdDetails: any[] = [];
	DPIdList: any[] = [];
	dpId: any;
	//dpViewReportBtn:boolean = false;
	base64pdfData: any;
	myOptions: any = {
		dateFormat: 'dd/mm/yyyy',
		showMonthNumber: false
		// disableSince: {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()},

	}
	private clientSearchTerms = new Subject<string>();
	datePicker: any; 
	showDatePicker: boolean = false;
	date:any;
	showStartDatePicker: boolean = false;
	showEndDatePicker: boolean = false;
	ionFromDate: any;
	ionToDate: any;
	ionTillDate: any;
	ionAsOnDate: any;
	datePositionCenter: boolean = false;
	datePositionRight: boolean = false;
	datePositionLeft: boolean = false;

	constructor(
		private elementRef: ElementRef,
		private popoverController: PopoverController,private clientService: ClientTradesService, private route: ActivatedRoute,
		private router: Router, private commonService: CommonService, public toast: ToasterService, private storage: StorageServiceAAA,
		private shareReportSer: ShareReportService, private ciphetText: CustomEncryption, private LoginService: LoginService,
		private wireReqService: WireRequestService, private fileOpener: FileOpener, private file: File,
		private dPTransService: DPTransactionService, private dashBoardService: DashBoardService,private transfer: FileTransfer,
		 private platform: Platform) 
	{ }

	ngOnInit() {
		this.currentDate = moment(new Date()).format("YYYY-MM-DD");
		this.urlParameter = this.route.params.subscribe(params => {
			this.clientCode = params['id'];
			this.clientSearchValue = this.clientSearchValue ? this.clientSearchValue : this.clientCode;
			params['id1'] ? this.clientName = params['id1'].split('-').join(' ') : this.clientName = '-';
			this.financialYrList = this.getFinancialYearList(this.getCurrentFinancialYear().split('-')[0], this.getCurrentFinancialYear().split('-')[1])

			if (params && !params['id']) {
				this.isMegaMenuRpt = true;
			}

			this.yearRangeValue = this.financialYrList[0]
		});
		this.route.queryParams.subscribe((prm: any) => {
			this.clientSearchValue = null;
			this.dpId = null;
			this.dpHoldingObj = null;
			this.selectedShareType = prm.report ? prm.report : 'realised';
			this.clientCode = this.clientSearchValue ? this.clientSearchValue : this.clientCode;
			if (prm && prm.report) {
				localStorage.setItem('rpType', this.selectedShareType);
				this.reportTitle = this.shareReportTypeList.find(r => r.value === this.selectedShareType);
				this.isMegaMenuRpt = true;
				this.typeOfClient = 'iiflClients';
				this.tillDate = this.commonService.lastMonthISOConverted('current');
				this.ionTillDate = this.commonService.getIonDateTimeFormat(this.tillDate);
				this.isAMCReport = prm.report === 'amcStmt' ? true : false;
			}else{
				if (this.isMegaMenuRpt) {
					this.selectedShareType = localStorage.getItem('rpType');
					this.reportTitle = this.shareReportTypeList.find(r => r.value === this.selectedShareType);
				} else {
					this.reportTitle = null;
				}
			}
			this.changeShareReportType();
		});
		// this.fromDate = moment(this.commonService.lastWeekISOConverted('last')).format('DD-MM-YYYY');
		// this.toDate = moment(this.commonService.lastWeekISOConverted('first')).format('DD-MM-YYYY');
		this.fromDate = this.commonService.lastWeekISOConverted('last');
		this.ionFromDate = this.commonService.getIonDateTimeFormat(this.fromDate);
		this.toDate = this.commonService.lastWeekISOConverted('first');
		this.ionToDate = this.commonService.getIonDateTimeFormat(this.toDate);
		this.asOnDate = this.commonService.lastWeekISOConverted('first');
		this.ionAsOnDate = this.commonService.getIonDateTimeFormat(this.asOnDate);

		var tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		// console.log(tomorrow.getDate());

		this.myOptions['disableSince'] = { year: moment(tomorrow).format('YYYY'), month: moment(tomorrow).format('MM'), day: moment(tomorrow).format('DD') }


		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.tokenValue = token;
					
						this.getOfflineClients(token);
						this.clientApiCalls(token);
 					
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.tokenValue = token;
					
						this.getOfflineClients(token);
						this.clientApiCalls(token);
					
				})
			}
		})
		
		this.changeShareReportType();

		this.findClientEmailID(this.clientCode)

		let token = localStorage.getItem('jwt_token')
		let userId1 = localStorage.getItem('userId1');
		let userTypeValue = localStorage.getItem('userType');
		if(userTypeValue==='RM'){
			userTypeValue = 'RM';
		}else if(userTypeValue==='FAN'){
			userTypeValue = 'FN';
		}else{
			userTypeValue = 'SB';
		}
		this.clientSearchTerms
			.pipe(
				debounceTime(500),
				switchMap((searchValue) => this.dashBoardService.fetchGetClientCodes(userTypeValue, userId1, token, searchValue)))
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

	goBack() {
		window.history.back();
	}


	onDateChanged(event: any) {
		//console.log(event);
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
			} else if (type.toLowerCase() == "till"){
				this.showStartDatePicker = false;
				if(event != undefined){
					this.onStartDateChanged(type);
				}
			}
			else if (type.toLowerCase() == "ason"){
				this.showStartDatePicker = false;
				if(event != undefined){
					this.onStartDateChanged(type);
				}
			}
		  } 
	
	  }

	onStartDateChanged(condition?: string) {
		if(condition){
			this.asOnDate = new Date(this.ionAsOnDate);
			this.tillDate = new Date(this.ionTillDate);
			return;
		}
		this.fromDate = new Date(this.ionFromDate);
	}
	// new code end date
	onEndDateChanged1() {
		this.toDate = new Date(this.ionToDate);
	}

	//   show popup for coming soon when click "email to client"
	async comingSoon(ev: any) {
		if(this.selectedShareType == 'digitalContract'){
			this.commonService.setClevertapEvent('Digital contract notes', { 'Login ID': localStorage.getItem('userId1') })
		}
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

	goToNotification() {
		this.router.navigate(['/notification']);
	}
	
	goToDashboard() {
        this.router.navigate(['/dashboard']);
    }
	goToSearch() {
		//this.router.navigate(['/add-script']);
		this.router.navigate(['/dashboard-clients']);
	}

	// Select the report Type from Select Report dropdown 
	changeShareReportType() {
		this.desktopDatePosition(this.selectedShareType);
		this.showAMCReport = false;
		this.showCrtrReport = false;
		this.isAMCReport = false;
		if(!this.platform.is('desktop')){
			this.isMobileAMC = true;
		}
		this.shareReportTypeList.forEach(element => { element.display = false })
		this.yearDateOption = 'dateWise';
		this.fromDate = this.commonService.lastMonthISOConverted('previous');
		this.ionFromDate = this.commonService.getIonDateTimeFormat(this.fromDate);
		this.toDate = this.commonService.lastMonthISOConverted('current');
		this.ionToDate = this.commonService.getIonDateTimeFormat(this.toDate);
		this.productValue = this.productTypeList[0].value;
		// this.fromDate = this.commonService.lastMonthISOConverted('previous');
		// this.toDate = this.commonService.lastMonthISOConverted('current');
		//this.dpViewReportBtn = true;
		if (this.selectedShareType == 'simplified') {
			this.timeSpanValue = '1M'
		} else if (this.selectedShareType == 'amcStmt') {
			this.searchValue = this.clientCode;
			this.typeOfClient = 'iiflClients';
			this.isAMCReport = true;
			if(!this.platform.is('desktop')){
				this.isMobileAMC = true;
				this.showAMCReport = true;
			}
		}else if (this.selectedShareType == 'crtr') {
			this.searchValue = this.clientCode;
			this.typeOfClient = 'iiflClients';
			
		}else if (this.selectedShareType == 'unrealised') {
			this.tillDate = this.commonService.lastMonthISOConverted('current');
			this.ionTillDate = this.commonService.getIonDateTimeFormat(this.tillDate);

		} else if (this.selectedShareType == 'interestOnDelayedPayment') {
			this.fromDate = new Date(new Date(new Date()).getFullYear(), new Date(new Date()).getMonth() - 1, 1);
			this.ionFromDate = this.commonService.getIonDateTimeFormat(this.fromDate);
			this.toDate = new Date(new Date(new Date()).getFullYear(), new Date(new Date()).getMonth(), 0);
			this.ionToDate = this.commonService.getIonDateTimeFormat(this.toDate);
		} else if (this.selectedShareType == 'dpTransaction') {
			//this.dpType = null;
			//this.visibleDpIp = false;
			//this.dpViewReportBtn = false;
			this.storage.get('userType').then(type => {
				if (type === 'RM' || type === 'FAN') {
					this.storage.get('bToken').then(token => {
						if(this.clientCode){
							this.getDpIds(token)
						}
					})
				} else {
					this.storage.get('subToken').then(token => {
						if(this.clientCode){
							this.getDpIds(token)
						}
					})
				}

			})

		}
	}

	getDpIds(token: any) {
		var obj: any = { "UserCode": this.clientCode, "UserType": "4" }
		this.wireReqService.getProfileDetails(token, obj).subscribe((res: any) => {
			if (res['Head']['ErrorCode'] === 0) {
				this.DpIdDetails = res['Body'].DP;
			}
			//this.nsdlList = [];
			//this.cdslList = [];
			this.DPIdList = [];
			if (this.DpIdDetails.length > 0) {
				this.DpIdDetails.forEach((element, index) => {
					// this.nsdlList.push(element.DPID);
					// this.cdslList.push((element.BOID).trim());
					if (element.DPID.includes("IN")) {
						let str = element.DPID + element.BOID;
						this.DPIdList.push((str).trim());
					}
					else {
						this.DPIdList.push((element.BOID).trim())
					}
					this.dpId = this.DPIdList[0];
				});
			}
		 else {
			this.dpId = null;
			this.toast.displayToast(res['Head']['ErrorDescription'])
		}

		})
	}

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
			this.tillDate = new Date();
			this.ionTillDate = this.commonService.getIonDateTimeFormat(this.tillDate);
		}
	}

	changeDigitalConProduct(event: any){
		// console.log(event);
		if(event == 'EQ'){
			this.digitalContractExchList = [
				{ option: 'NSE-Cash', value: 'NSE-Cash' },
				{ option: 'BSE-Cash', value: 'BSE-Cash' },
				{ option: 'NSE-FNO', value: 'NSE-FNO' },
				{ option: 'BSE-FNO', value: 'BSE-FNO' },
				{ option: 'NSE-Currency', value: 'NSE-Currency' },
				{ option: 'BSE-Currency', value: 'BSE-Currency' },
				{ option: 'NSE-Buyback', value: 'C' },
				{ option: 'BSE-Buyback', value: 'C' },
				{ option: 'NSE-OFS', value: 'NSE-OFS' },
				{ option: 'BSE-OFS', value: 'BSE-OFS' },
				{ option: 'NSE-Physical', value: 'NSE-Physical'},
				{ option: 'BSE-Physical', value: 'BSE-Physical'},
			]
		}

		else if(event == 'COM'){
			this.digitalContractExchList = [
				{ option: 'MCX', value: 'MCX' },
				{ option: 'NCDEX', value: 'NCDEX'}
			]
		}

		this.digitalContactExchValue = this.digitalContractExchList[0].value
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
	}

	// Submit on view Report Button in web view
	viewReport() {
		this.shareReportTypeList.forEach(element => {
			if (element.value == this.selectedShareType) {
				element.display = true;
			}
			else {
				element.display = false;
			}
		})

		if(this.fromDate || this.toDate){
			this.fromDateReq = this.fromDate;
			this.toDateReq = this.toDate;
		}
		else{
			this.fromDateReq = this.fromDate;
			this.toDateReq = this.toDate;
		}
	
		if (this.clientCode) {
			if (this.selectedShareType == 'simplified') {
				this.commonService.setClevertapEvent('Simplified Ledger', { 'Login ID': localStorage.getItem('userId1') });
				if (this.commonService.convertDateToMillisec(this.fromDateReq) > this.commonService.convertDateToMillisec(this.toDateReq)) {
					this.toast.displayToast('from Date cannot be more than To Date');
				}
				else {
					this.simpLedgerObj = {};
					this.simpLedgerObj.clientCode = this.clientCode
					this.simpLedgerObj.fromDate = moment(this.fromDateReq).format('YYYYMMDD')
					this.simpLedgerObj.ToDate = moment(this.toDateReq).format('YYYYMMDD');

					this.commonService.setClevertapEvent('Simplified_Ledger');
					this.commonService.analyticEvent('Simplified_Ledger', 'Share Reports');

					// console.log(this.simpLedgerObj);
				}
			}
			else if (this.selectedShareType == 'dpTransaction') {
				this.commonService.setClevertapEvent('DP transactions', { 'Login ID': localStorage.getItem('userId1') });
				if (this.commonService.convertDateToMillisec(this.fromDateReq) > this.commonService.convertDateToMillisec(this.toDateReq)) {
					this.toast.displayToast('from Date cannot be more than To Date');
				}
				else {
					this.dpTransObj = {};
					this.dpTransObj.clientCode = this.clientCode
					this.dpTransObj.fromDate = moment(this.fromDateReq).format('YYYYMMDD')
					this.dpTransObj.ToDate = moment(this.toDateReq).format('YYYYMMDD')
					//this.dpTransObj.dpType = this.dpType;
					this.dpTransObj.dpId = this.dpId
					this.commonService.setClevertapEvent('DP_transactions');
					this.commonService.analyticEvent('DP_transactions', 'Share Reports');
					// console.log(this.dpTransObj);




				}
			}
			else if (this.selectedShareType == 'unrealised') {
				this.commonService.setClevertapEvent('UnRealised PnL', { 'Login ID': localStorage.getItem('userId1') });
				this.unRealizedPlObj = {}
				this.unRealizedPlObj.clientCode = this.clientCode
				this.unRealizedPlObj.product = this.productValue
				this.unRealizedPlObj.tillDate = moment(this.tillDate).format('YYYYMMDD');

				this.commonService.setClevertapEvent('Unrealised_PnL');
				this.commonService.analyticEvent('Unrealised_PnL', 'Share Reports');
				// console.log(this.unRealizedPlObj);
			}
			else if (this.selectedShareType == 'realised') {
				this.commonService.setClevertapEvent('Realised PnL', { 'Login ID': localStorage.getItem('userId1') });
				if (this.commonService.convertDateToMillisec(this.fromDateReq) > this.commonService.convertDateToMillisec(this.toDateReq)) {
					this.toast.displayToast('from Date cannot be more than To Date');
				}
				else {
					this.realizedPlObj = {}
					this.realizedPlObj.clientCode = this.clientCode
					this.realizedPlObj.fromDate = moment(this.fromDateReq).format('YYYYMMDD')
					this.realizedPlObj.ToDate = moment(this.toDateReq).format('YYYYMMDD')
					this.realizedPlObj.product = this.productValue;

					this.commonService.setClevertapEvent('Realised_PnL');
					this.commonService.analyticEvent('Realised_PnL', 'Share Reports');
					// console.log(this.realizedPlObj);
				}
			}
			else if (this.selectedShareType == '360Client') {
				if (this.commonService.convertDateToMillisec(this.fromDateReq) > this.commonService.convertDateToMillisec(this.toDateReq)) {
					this.toast.displayToast('from Date cannot be more than To Date');
				}
				else {
					this.mis360Client('N', true);
				}

			}
			else if (this.selectedShareType == 'mfCapital' || this.selectedShareType == 'mfAccount') {
				if(this.selectedShareType == 'mfCapital' ){
					this.commonService.setClevertapEvent('MF Capital Gain', { 'Login ID': localStorage.getItem('userId1') });
				}else if(this.selectedShareType == 'mfAccount' ){
					this.commonService.setClevertapEvent('MF Account Statement', { 'Login ID': localStorage.getItem('userId1') });
				}
				if (this.commonService.convertDateToMillisec(this.fromDateReq) > this.commonService.convertDateToMillisec(this.toDateReq)) {
					this.toast.displayToast('from Date cannot be more than To Date');
				}
				else {
					this.getClientPan('N', true)
				}

			}
			else if (this.selectedShareType == 'sttCertificate') {
				this.commonService.setClevertapEvent('stt certificate', { 'Login ID': localStorage.getItem('userId1') });
				if (this.commonService.convertDateToMillisec(this.fromDateReq) > this.commonService.convertDateToMillisec(this.toDateReq)) {
					this.toast.displayToast('from Date cannot be more than To Date');
				}
				else {
					this.sttCertificateCall('N', true);
				}

			}
			else if (this.selectedShareType == 'dailyBills') {
				this.commonService.setClevertapEvent('Daily Bills Viewed', { 'Login ID': localStorage.getItem('userId1') });
				this.dailyBillsObj = {};
				this.dailyBillsObj.reportType = this.selectedShareType;
				this.dailyBillsObj.clientCode = this.clientCode;
				this.dailyBillsObj.exchange = this.exchangeDailyBillsValue.replace(/ /g, "");
				this.dailyBillsObj.fromDate = moment(this.fromDateReq).format('YYYYMMDD');
				this.dailyBillsObj.ToDate = moment(this.toDateReq).format('YYYYMMDD');
			}
			else if (this.selectedShareType == 'digitalContract') {
				this.commonService.setClevertapEvent('Digital contract notes', { 'Login ID': localStorage.getItem('userId1') });
				this.digitalContractObj = {};
				this.digitalContractObj.reportType = this.selectedShareType;
				this.digitalContractObj.clientCode = this.clientCode;
				this.digitalContractObj.exchange = this.digitalContactExchValue.replace(/ /g, "");
				this.digitalContractObj.fromDate = moment(this.fromDateReq).format('YYYYMMDD');
				this.digitalContractObj.ToDate = moment(this.toDateReq).format('YYYYMMDD');
			}
			else if (this.selectedShareType == 'tradeListing') {
				this.commonService.setClevertapEvent('Trade listing', { 'Login ID': localStorage.getItem('userId1') });
				if (this.commonService.convertDateToMillisec(this.fromDateReq) > this.commonService.convertDateToMillisec(this.toDateReq)) {
					this.toast.displayToast('from Date cannot be more than To Date');
				}
				else {
					this.tradeListObj = {}
					this.tradeListObj.clientCode = this.clientCode
					this.tradeListObj.fromDate = moment(this.fromDateReq).format('YYYYMMDD')
					this.tradeListObj.ToDate = moment(this.toDateReq).format('YYYYMMDD')
					this.tradeListObj.ReportType = this.tradeListValue;
					this.tradeListObj.exch = this.tradeListingExchValue
					this.commonService.setClevertapEvent('Trade_Listing');
					this.commonService.analyticEvent('Trade_Listing', 'Share Reports');
				}

			}
			else if (this.selectedShareType == 'dpholding') {
				if (!this.dpId) return this.toast.displayToast("DP ID can't be blank");
				this.dpHoldingObj = {};
				this.dpHoldingObj.dpId = this.dpId
				this.dpHoldingObj.AsOnDate = moment(this.asOnDate).format('DD/MM/YYYY') 
				this.dpHoldingObj.DPType = this.dpId.includes('IN') ? 'NSDL' : 'CDSL'
			}
		} else {
			this.toast.displayToast('Please Enter the Client Code');
		}
		return;
	}

	searchAMCReport() {
		this.searchValue = this.typeOfClient === 'offlineClients' ? this.panSearchValue : this.clientCode;
		if(this.searchValue){
			this.showAMCReport = true;
			if(!this.platform.is('desktop')){
			this.isMobileAMC = true;
			}
		}else{
			this.toast.displayToast(this.typeOfClient === 'offlineClients' ? 'Please Enter the PAN No.': 'Please Enter the Client Code');
		}
	}
	searchCrtrReport() {
		this.showCrtrReport = true;
		this.commonService.setClevertapEvent('Commodityrealtime_clicked');
		this.commonService.setClevertapEvent('Commodity real time', { 'Login ID': localStorage.getItem('userId1') });
	}
	downloadDPCReport(event: any) {
		this.fileType = event;
		this.commonService.setClevertapEvent('Delayed_Payment_charges_download');
		this.displayValidationforDownload('download');
	}

	// changeDpType(event){
	//   this.visibleDpIp = true;
	//   this.dpViewReportBtn = true;
	//   if(event.label == 'NSDL'){
	//     this.DPIdList =  this.nsdlList
	//   }
	//   else{
	//     this.DPIdList =  this.cdslList;
	//   }
	//   this.dpId = this.DPIdList[0];
	//   //nsdlList = this.DpIdDetails.filter
	//   console.log(event.label);

	// }

	getClientPan(emailParms: any, openNewTab: any) {
		this.dataLoad = false;
		let objHeader = {
			"VID": investObj['addUser']['vid'],
			"Value": this.ciphetText.aesEncrypt(this.clientCode)
		}
		this.shareReportSer.getClientPanNo(this.tokenValue, objHeader.Value).subscribe((res: any) => {
			this.dataLoad = true;
			if (res['objHeader']['Status'] == 0) {
				let panNo = this.ciphetText.getDecryptedValue(res['Data']).substring(0, 10);
				if (this.selectedShareType == 'mfCapital') {
					this.commonService.setClevertapEvent('MF_Capital_Gain');
					this.commonService.analyticEvent('MF_Capital_Gain', 'Share Reports');
					this.mfCapitalAccount(20, panNo, emailParms, openNewTab)
				}
				else {
					this.commonService.setClevertapEvent('MF_Account_statement');
					this.commonService.analyticEvent('MF_Account_statement', 'Share Reports');
					this.mfCapitalAccount(19, panNo, emailParms, openNewTab)
				}

			}
			else {
				this.toast.displayToast('PAN No. is not found');
			}

		})
	}

	// Send Email to Client 
	emailToClient() {
		if (this.selectedShareType == '360Client') {
			if (this.commonService.convertDateToMillisec(this.fromDateReq) > this.commonService.convertDateToMillisec(this.toDateReq)) {
				this.toast.displayToast('from Date cannot be more than To Date')
			}
			else {
				this.mis360Client('Y', false);
			}

		}
		else if (this.selectedShareType == 'sttCertificate') {
			if (this.commonService.convertDateToMillisec(this.fromDateReq) > this.commonService.convertDateToMillisec(this.toDateReq)) {
				this.toast.displayToast('from Date cannot be more than To Date')
			}
			else {
				this.sttCertificateCall('Y', false);
			}

		}
		else if (this.selectedShareType == 'dailyBills') {
			this.dailyBills('Y', false);
		}
		else if (this.selectedShareType == 'digitalContract') {
			this.digitalContractNotes('Y', false);
		}
		else if (this.selectedShareType == 'mfCapital' || this.selectedShareType == 'mfAccount') {
			if (this.commonService.convertDateToMillisec(this.fromDateReq) > this.commonService.convertDateToMillisec(this.toDateReq)) {
				this.toast.displayToast('from Date cannot be more than To Date')
			}
			else {
				this.getClientPan('Y', false)
			}

		}
	}

	// Submit on view Report Button in mobile
	viewReportMobile() {
		this.displayonSubmit = true;
		this.fromDateReq = this.fromDate;
		this.toDateReq = this.toDate;
		if (this.selectedShareType == 'simplified') {
			if (this.commonService.convertDateToMillisec(this.fromDateReq) > this.commonService.convertDateToMillisec(this.toDateReq)) {
				this.toast.displayToast('from Date cannot be more than To Date')
			}
			else {
				this.simpLedgerObj = {};
				this.simpLedgerObj.clientCode = this.clientCode
				this.simpLedgerObj.fromDate = moment(this.fromDateReq).format('YYYYMMDD')
				this.simpLedgerObj.ToDate = moment(this.toDateReq).format('YYYYMMDD')
				// console.log(this.simpLedgerObj);
				this.commonService.setData(this.simpLedgerObj);

				this.commonService.setClevertapEvent('Simplified_Ledger');
				this.commonService.analyticEvent('Simplified_Ledger', 'Share Reports');

				this.router.navigate(['/simplified-ladger']);
			}
		}
		else if (this.selectedShareType == 'dailyBills') {
			let cleverPros = {
				'Client Code': this.clientCode,
				'Product': this.dailyBillsProductTypeList[0].option,
				'Exchange Type': this.exchangeDailyBillsValue
			}
			this.commonService.setClevertapEvent('Daily_Bills_Viewed', cleverPros);
			this.dailyBillsObj = {};
			this.dailyBillsObj.exchangeDailyBillsValue = this.exchangeDailyBillsValue;
			this.dailyBillsObj.reportType = this.selectedShareType;
			this.dailyBillsObj.clientCode = this.clientCode;
			this.dailyBillsObj.exchange = this.exchangeDailyBillsValue.replace(/ /g, "");
			this.dailyBillsObj.fromDate = moment(this.fromDateReq).format('YYYYMMDD');
			this.dailyBillsObj.ToDate = moment(this.toDateReq).format('YYYYMMDD');
			this.commonService.setData(this.dailyBillsObj);
			this.router.navigate(['/digital-contract-mobile']);
		}
		else if (this.selectedShareType == 'digitalContract') {
			let ctPros = {
				'Client Code': this.clientCode,
				'Product': this.digitalProductTypeList[0].option,
				'Report Format': this.detailedSummarisedValue,
				'Exchange Type': this.digitalContactExchValue
			}
			this.commonService.setClevertapEvent('Digital_Contract_Notes_Viewed', ctPros);
			this.digitalContractObj = {};
			this.digitalContractObj.digitalContactExchValue = this.digitalContactExchValue,
			this.digitalContractObj.detailedSummarisedValue = this.detailedSummarisedValue;
			this.digitalContractObj.reportType = this.selectedShareType;
			this.digitalContractObj.clientCode = this.clientCode;
			this.digitalContractObj.exchange = this.digitalContactExchValue.replace(/ /g, "");
			this.digitalContractObj.fromDate = moment(this.fromDateReq).format('YYYYMMDD');
			this.digitalContractObj.ToDate = moment(this.toDateReq).format('YYYYMMDD');
			this.commonService.setData(this.digitalContractObj);
			this.router.navigate(['/digital-contract-mobile']);
		}
		else if (this.selectedShareType == 'unrealised') {
			this.unRealizedPlObj = {}
			this.unRealizedPlObj.clientCode = this.clientCode
			this.unRealizedPlObj.product = this.productValue
			this.unRealizedPlObj.tillDate = moment(this.tillDate).format('YYYYMMDD');
			// console.log(this.unRealizedPlObj);
			this.commonService.setData(this.unRealizedPlObj);

			this.commonService.setClevertapEvent('Unrealised_PnL');
			this.commonService.analyticEvent('Unrealised_PnL', 'Share Reports');

			this.router.navigate(['/unrealised-pnl']);
		}

		else if (this.selectedShareType == 'dpTransaction') {
			if (this.commonService.convertDateToMillisec(this.fromDateReq) > this.commonService.convertDateToMillisec(this.toDateReq)) {
				this.toast.displayToast('from Date cannot be more than To Date');
			}
			else {
				this.dpTransObj = {};
				this.dpTransObj.clientCode = this.clientCode
				this.dpTransObj.fromDate = moment(this.fromDateReq).format('YYYYMMDD')
				this.dpTransObj.ToDate = moment(this.toDateReq).format('YYYYMMDD')
				//this.dpTransObj.dpType = "";
				this.dpTransObj.dpId = this.dpId;
				// console.log(this.dpTransObj);
				this.commonService.setData(this.dpTransObj);

				this.commonService.setClevertapEvent('DP_transactions');
				this.commonService.analyticEvent('DP_transactions', 'Share Reports');
				this.router.navigate(['/dp-transaction']);

			}
		}

		else if (this.selectedShareType == 'tradeListing') {
			if (this.commonService.convertDateToMillisec(this.fromDateReq) > this.commonService.convertDateToMillisec(this.toDateReq)) {
				this.toast.displayToast('from Date cannot be more than To Date');
			}
			else {
				this.tradeListObj = {}
				this.tradeListObj.clientCode = this.clientCode
				this.tradeListObj.fromDate = moment(this.fromDateReq).format('YYYYMMDD')
				this.tradeListObj.ToDate = moment(this.toDateReq).format('YYYYMMDD')
				this.tradeListObj.ReportType = this.tradeListValue;
				this.tradeListObj.exch = this.tradeListingExchValue

				this.commonService.setClevertapEvent('Trade_Listing');
				this.commonService.analyticEvent('Trade_Listing', 'Share Reports');

			}
		}

		else if (this.selectedShareType == 'realised') {
			if (this.commonService.convertDateToMillisec(this.fromDateReq) > this.commonService.convertDateToMillisec(this.toDateReq)) {
				this.toast.displayToast('from Date cannot be more than To Date')
			}
			else {
				this.realizedPlObj = {}
				this.realizedPlObj.clientCode = this.clientCode
				this.realizedPlObj.fromDate = moment(this.fromDateReq).format('YYYYMMDD')
				this.realizedPlObj.ToDate = moment(this.toDateReq).format('YYYYMMDD')
				this.realizedPlObj.product = this.productValue
				// console.log(this.realizedPlObj);
				this.commonService.setData(this.realizedPlObj);

				this.commonService.setClevertapEvent('Realised_PnL');
				this.commonService.analyticEvent('Realised_PnL', 'Share Reports');

				this.router.navigate(['/realised-pnl']);
			}

		}
		else if (this.selectedShareType == 'crtr') {
			if (this.clientCode) {
				this.commonService.setClevertapEvent('Commodityrealtime_clicked');
				this.commonService.setData(this.clientCode);
				this.router.navigate(['/commodity-realtime-report']);
			}
			else {
				this.toast.displayToast('Kindly select client code from dropdown.')
			}
		}
		else if (this.selectedShareType == 'dpholding') {
			if (!this.clientCode) {
				this.toast.displayToast('Please Enter the Client Code');
			} else {
				this.dpHoldingObj = {};
				this.dpHoldingObj.dpId = this.dpId
				this.dpHoldingObj.clientCode = this.clientCode
				this.dpHoldingObj.AsOnDate = moment(this.asOnDate).format('DD/MM/YYYY')
				this.dpHoldingObj.DPType = this.dpId.includes('IN') ? 'NSDL' : 'CDSL'
				this.commonService.setData(this.dpHoldingObj);
				localStorage.setItem('dpHoldingObjData', JSON.stringify(this.dpHoldingObj));
				this.router.navigate(['/dp-holding-report']);
			}
		}

	}
	// Validation Msg for download btn 
	displayValidationforDownload(action: any) {
		this.loader = true;
		let settlementValue = action && action.action ? action.settlementNo : undefined;
		this.settlementObj = settlementValue ? action : null;
		let actn = settlementValue ? action.action : action;
		this.fromDateReq = this.fromDate;
		this.toDateReq = this.toDate;
		if (this.commonService.convertDateToMillisec(this.fromDateReq) > this.commonService.convertDateToMillisec(this.toDateReq)) {
			this.toast.displayToast('from Date cannot be more than To Date');
		}
		else {
			this.downLoadSharedReport(actn);
		}
		this.loader = false;
	}
	// call 360 Client MIS on Click
	mis360Client(emilParams: any, openNewTab: any) {
		const obj = {
			ReportId: 26,
			ClientCode: this.clientCode,
			// ClientCode: "NISHI666",
			FromDate: moment(this.fromDateReq).format('YYYYMMDD'),
			EmailFlag: emilParams,
			ToDate: moment(this.toDateReq).format('YYYYMMDD')
		}
		// console.log(obj);
		if (openNewTab == true) {
			this.commonService.setClevertapEvent('360_Client_MIS_report');
			this.commonService.analyticEvent('360_Client_MIS_report', 'Share Reports');
			this.OpenWindowWithPost(this.sharedReportBaseUrl, '_blank', obj);
		}
		else {
			this.sendEmail()
		}
	}

	// call MF Capital Link on Click
	mfCapitalAccount(reportId: any, pan: any, emilParams: any, openNewTab: any) {
		const obj = {
			ReportId: reportId,
			ClientCode: this.clientCode,
			FromDate: moment(this.fromDateReq).format('YYYYMMDD'),
			EmailFlag: emilParams,
			ToDate: moment(this.toDateReq).format('YYYYMMDD'),
			PAN: pan
		}
		// console.log(obj);
		if (openNewTab == true) {
			this.OpenWindowWithPost(this.sharedReportBaseUrl, "_blank", obj);
		}
		else {
			this.sendEmail()
		}

	}
	// call STT Certificate on Click
	sttCertificateCall(emilParams: any, openNewTab: any) {
		const obj = {
			ReportId: 21,
			ClientCode: this.clientCode,
			FromDate: moment(this.fromDateReq).format('YYYYMMDD'),
			EmailFlag: emilParams,
			ToDate: moment(this.toDateReq).format('YYYYMMDD'),
			SubReportId: 0,
			Exchange: '&',
			Type: 2
		}
		// console.log(obj);
		if (openNewTab == true) {
			this.commonService.setClevertapEvent('STT_certificate');
			this.commonService.analyticEvent('STT_certificate', 'Share Reports');
			this.OpenWindowWithPost(this.sharedReportBaseUrl, '_blank', obj);
		}
		else {
			this.sendEmail()
		}
	}

	// call Daily Bills Record
	dailyBills(emilParams: any, openNewTab: any) {
		const obj = {
			ReportId: 24,
			ClientCode: this.clientCode,
			FromDate: moment(this.fromDateReq).format('YYYYMMDD'),
			EmailFlag: emilParams,
			SubReportId: 0,
			Exchange: this.exchangeDailyBillsValue.split(' ')[0],
			SetNo: "BW1718245",
			ExchangeType: this.exchangeDailyBillsValue.split(' ')[1]
		}
		// console.log(obj);
		if (openNewTab == true) {
			this.commonService.setClevertapEvent('Daily_bills_Listing');
			this.commonService.analyticEvent('Daily_bills_Listing', 'Share Reports');
			this.OpenWindowWithPost(this.sharedReportBaseUrl, '_blank', obj);
		}
		else {
			this.sendEmail()
		}
	}

	// To reset date on DpId change.
	changeDpId(){
		this.fromDate = this.commonService.lastMonthISOConverted('previous');
		this.ionFromDate = this.commonService.getIonDateTimeFormat(this.fromDate);
		this.toDate = this.commonService.lastMonthISOConverted('current');
		this.ionToDate = this.commonService.getIonDateTimeFormat(this.toDate);
	}


	//call Digital Contract Notes
	digitalContractNotes(emilParams: any, openNewTab: any) {
		const obj = {
			ReportId: 25,
			ClientCode: this.clientCode,
			FromDate: moment(this.fromDateReq).format('YYYYMMDD'),
			EmailFlag: emilParams,
			Product: this.digitalProductValue,
			Exchange: this.digitalContactExchValue.includes('-') == false ? this.digitalContactExchValue: this.digitalContactExchValue.split('-')[0]+this.digitalContactExchValue.toUpperCase().split('-')[1],
			SetNo: "NN2018188",
			ContractType: this.detailedSummarisedValue,
			BuySellFlag: ''
		}
		// console.log(obj)
		if (openNewTab == true) {
			this.commonService.setClevertapEvent('Digital_Contract_Notes');
			this.commonService.analyticEvent('Digital_Contract_Notes', 'Share Reports');
			this.OpenWindowWithPost(this.sharedReportBaseUrl, '_blank', obj);
		}
		else {
			this.sendEmail()
		}
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
		form.submit();
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

	min2Digits(day: any) {
		return (day < 10 ? '0' : '') + day;
	}

	findClientEmailID(clientId: any) {
		this.subscription = new Subscription();
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					if(clientId){
						this.getProfileParams(token, clientId)
					}
				})
			}
			else {
				this.storage.get('subToken').then(token => {
					if(clientId){
						this.getProfileParams(token, clientId)
					}
				})
			}
		})
	}

	getProfileParams(token: any, clientID: any) {
		const params = {
			UserCode: clientID,
			UserType: 4
		}

		this.subscription.add(
			this.LoginService
				.getRMProfile(params, token)
				.subscribe((response: any) => {
					if (response['Head']['ErrorCode'] == 0) {
						this.email = response['Body']['ClientEmail'];
						this.mail_key = '1';
						// console.log(this.email);

					}
					else {
						this.email = null;
						this.mail_key = '0';
					}

				})
		)
	}

	downLoadSharedReport(action: any) {
		if (this.selectedShareType == 'realised') {
			this.commonService.setClevertapEvent('Realised PnL', { 'Login ID': localStorage.getItem('userId1') });
		} else if (this.selectedShareType == 'unrealised') {
			this.commonService.setClevertapEvent('UnRealised PnL', { 'Login ID': localStorage.getItem('userId1') });
		} else if (this.selectedShareType == 'dpTransaction') {
			this.commonService.setClevertapEvent('DP transactions', { 'Login ID': localStorage.getItem('userId1') });
		} else if (this.selectedShareType == 'tradeListing') {
			this.commonService.setClevertapEvent('Trade listing', { 'Login ID': localStorage.getItem('userId1') });
		} else if (this.selectedShareType == 'sttCertificate') {
			this.commonService.setClevertapEvent('stt certificate', { 'Login ID': localStorage.getItem('userId1') });
		} else if (this.selectedShareType == 'mfCapital') {
			this.commonService.setClevertapEvent('MF Account Statement', { 'Login ID': localStorage.getItem('userId1') });
		} else if (this.selectedShareType == 'simplified') {
			this.commonService.setClevertapEvent('Simplified Ledger', { 'Login ID': localStorage.getItem('userId1') });
		}
		var tokenValue;
		this.dataLoad = false;
		this.storage.get('userID').then((userID) => {
			this.storage.get('userType').then(type => {
				if (type === 'RM' || type === 'FAN') {
					this.storage.get('bToken').then(token => {
						tokenValue = token;	
						if (action == 'download') {
							this.downLoadPassObj(tokenValue, userID);
						} else {
							this.sendEmailPayload(tokenValue, userID);
						}					 
					})
				} else {
					this.storage.get('subToken').then(token => {
						tokenValue = token;
						if (action == 'download') {
							this.downLoadPassObj(tokenValue, userID);
						} else {
							this.sendEmailPayload(tokenValue, userID);
						}
					})
				}
			})
		})

	}

	downLoadPassObj(token: any, userId: any,fType?: any) {
		//this.dataLoad = true;
		var downloadObj: any
		this.fromDateReq = this.fromDate;
		this.toDateReq = this.toDate;
		//this.unRealizedPlObj.tillDate = moment(this.tillDate).format('YYYYMMDD');
		if (this.clientCode) {
			if (this.selectedShareType == 'realised') {
				let rpId;
				if (this.productValue == 'cash') {
					rpId = '122';
				} else if (this.productValue == 'f&o') {
					rpId = '138';
				} else if (this.productValue == 'currency') {
					rpId = '174';
				} else if (this.productValue == 'commodity') {
					rpId = '451';
				}
				downloadObj = {
					rptId: rpId,
					Client: this.clientCode,
					Start: moment(this.fromDateReq).format('YYYYMMDD'),
					End: moment(this.toDateReq).format('YYYYMMDD'),
					SendEmail: 'N',
					CallFrom: "AAA"
 				}
				if(fType === 'excel'){
					downloadObj['ReportFormat'] = 'EXCEL';
				}
				if (this.productValue == 'cash' || this.productValue == 'f&o') {
					downloadObj['ScripCode'] = "";
				}
			}
			else if (this.selectedShareType == 'unrealised') {
				let rId;
				if (this.productValue == 'cash') {
					rId = '130';
				} else if (this.productValue == 'f&o') {
					rId = '139';
				} else if (this.productValue == 'currency') {
					rId = '175';
				} else if (this.productValue == 'commodity') {
					rId = '450';
				}
				downloadObj = {
					rptId: rId,
					Client: this.clientCode,
					End: moment(this.tillDate).format('YYYYMMDD'),
					ScripCode: "",
					SendEmail: 'N',
					CallFrom: "AAA"
				}
				if(fType === 'excel'){
					downloadObj['ReportFormat'] = 'EXCEL';
				}
			}
			else if (this.selectedShareType == '360Client') {
				downloadObj = {
					rptId: "180",
					ClientCode: this.clientCode,
					Fromdate: moment(this.fromDateReq).format('YYYYMMDD'),
					Date: moment(this.toDateReq).format('YYYYMMDD'),
					SendEmail: 'N',
					CallFrom: "AAA"
				}

			}
			else if (this.selectedShareType == 'sttCertificate') {
				downloadObj = {
					rptId: "134",
					loginid: this.clientCode,
					Exch: "",
					FromDt: moment(this.fromDateReq).format('YYYYMMDD'),
					ToDt: moment(this.toDateReq).format('YYYYMMDD'),
					SendEmail: "N",
					CallFrom: "AAA"
				}
			}
			else if (this.selectedShareType == 'simplified') {
				downloadObj = {
					rptId: "53",
					ClientCode: this.clientCode,
					Exch: "",
					FromDate: moment(this.fromDateReq).format('YYYYMMDD'),
					ToDt: moment(this.toDateReq).format('YYYYMMDD'),
					SendEmail: "N",
					BnkFlag: "N",
					RoleId: "0",
					CallFrom: "AAA"
				}
				if(fType === 'excel'){
					downloadObj['ReportFormat'] = 'EXCEL';
				}
			}
			else if (this.selectedShareType == 'tradeListing') {
				downloadObj = {
					rptId: "54",
					ClientCode: this.clientCode,
					FromDate: moment(this.fromDateReq).format('YYYYMMDD'),
					ToDate: moment(this.toDateReq).format('YYYYMMDD'),
					ReportType: this.tradeListValue,
					SendEmail: "N",
					exchange: this.tradeListingExchValue,
					ScripCode: "",
					loginid: userId,
					type: "E",
					TradeDate: '',
					CallFrom: "AAA"
				}
				if(fType === 'excel'){
					downloadObj['ReportFormat'] = 'EXCEL';
				}
			}
			else if (this.selectedShareType == 'dpTransaction') {
				downloadObj = {
					rptId: this.isProd ? "505" : "13422",
					DPID: this.dpId,
					SendEmail: "N",
					LoginID: this.clientCode,
					FromDate: moment(this.fromDateReq).format('YYYYMMDD'),
					ToDate: moment(this.toDateReq).format('YYYYMMDD'),
					CallFrom: "AAA"
				}
				if(fType === 'excel'){
					downloadObj['ReportFormat'] = 'EXCEL';
				}
			}
			else if (this.selectedShareType == 'dpholding') {
				if (!this.dpId) {
					this.dataLoad = true;
					return this.toast.displayToast("DP ID can't be blank");
				}
				let type = this.dpId.includes('IN') ? 'NSDL' : 'CDSL';
				if (type === 'CDSL') {
					downloadObj = {
						"rptId": "421",
						"clid": this.dpId,
						"dtfrom": moment(this.asOnDate).format('MM/DD/YYYY'),
						"dtto": moment(this.asOnDate).format('MM/DD/YYYY'),
						"SendEmail": "N",
						"CallFrom": "AAA"
					}
				} else {
					if (moment(this.asOnDate).format('DD/MM/YYYY') === moment().format('DD/MM/YYYY')) {
						downloadObj = {
							"rptId": "457",
							"clientCode": this.dpId.slice(8, this.dpId.length),
							"LoginId": localStorage.getItem('userId1'),
							"SendEmail": "N",
							"CallFrom": "AAA"
						}
					} else {
						downloadObj = {
							"rptId": "420",
							"FromClient": this.dpId.slice(8, this.dpId.length),
							"FromDate": moment(this.asOnDate).format('YYYYDDMM'),
							"SendEmail": "N",
							"CallFrom": "AAA"
						}
					}
				}
				if (fType === 'excel') {
					downloadObj['ReportFormat'] = 'EXCEL';
				}
			}
			else if (this.selectedShareType == 'dailyBills') {
				downloadObj = {
					rptId: this.exchangeDailyBillsValue == 'BSE CASH' || this.exchangeDailyBillsValue == 'NSE CASH' ? '187' : '183',
					SendEmail: "N",
					clientCode: this.clientCode,
					ClientCode: this.clientCode,
					Date: this.settlementObj && this.settlementObj.date ? this.settlementObj.date : undefined,
					ExchangeType: this.exchangeDailyBillsValue.split(' ')[1] == 'CASH' ? 'C' : this.exchangeDailyBillsValue.split(' ')[1] == 'CURRENCY' ? 'U' : 'D',
					Exchange: this.exchangeDailyBillsValue.split(' ')[0].charAt(0),
					Settlement: this.settlementObj && this.settlementObj.settlementNo ? this.settlementObj.settlementNo : undefined,
					CallFrom: "AAA"
				}
				downloadObj = this.exchangeDailyBillsValue == 'BSE CASH' || this.exchangeDailyBillsValue == 'NSE CASH' ? _.omit(downloadObj, ['ExchangeType', 'Exchange', 'ClientCode']) : _.omit(downloadObj, ['Settlement', 'clientCode']);
			}
			else if (this.selectedShareType == 'digitalContract') {
				if (this.digitalContactExchValue.split('-')[0] == 'MCX') {
					downloadObj = {
						rptId: this.isProd ? '448' : '13355',
						Client: this.clientCode,
						TradeDt: this.settlementObj && this.settlementObj.date ? this.settlementObj.date : undefined,
						SendEmail: 'N',
						CallFrom: "AAA"
					}
				} else if (this.digitalContactExchValue.split('-')[0] == 'NCDEX') {
					downloadObj = {
						rptId: this.isProd ? '449' : '13361',
						Client: this.clientCode,
						TradeDt: this.settlementObj && this.settlementObj.date ? this.settlementObj.date : undefined,
						SendEmail: 'N',
						CallFrom: "AAA"
					}
				}
				else{
					downloadObj = {
						rptId: this.detailedSummarisedValue == 'Detailed' ? '182' : '186',
						SendEmail: "N",
						ClientCode: this.clientCode,
						Date: this.settlementObj && this.settlementObj.date ? this.settlementObj.date : undefined,
						ExchType: this.digitalContactExchValue == 'NSE-Buyback' || this.digitalContactExchValue == 'BSE-Buyback' ? 'C' : this.digitalContactExchValue.split('-')[1].toUpperCase() == 'CASH' ? 'C' : this.digitalContactExchValue.split('-')[1].toUpperCase() == 'CURRENCY' ? 'U' : this.digitalContactExchValue.split('-')[1].toUpperCase() == 'FNO' ? 'D' : (this.digitalContactExchValue.split('-')[1].toUpperCase() == 'MCX' || this.digitalContactExchValue.split('-')[1].toUpperCase() == 'NCDEX') ? 'Y' : this.digitalContactExchValue.split('-')[1].toUpperCase(),
						Exch: this.digitalContactExchValue.toUpperCase() == "BSE-FNO" ? "N" : this.digitalContactExchValue.split('-')[0].charAt(0),
						SettlementType: this.settlementObj && this.settlementObj.type ? this.settlementObj.type : undefined,
						BuySellFlag: "",
						CallFrom: "AAA"
					}
				}
			} else if (this.selectedShareType == 'mfAccount') {
				downloadObj = {
					ClientCode: this.clientCode,
					FromDate: moment(this.fromDateReq).format('DD/MM/YYYY'),
					ToDate: moment(this.toDateReq).format('DD/MM/YYYY'),
					CallFrom: "AAA"
				}
			} else if (this.selectedShareType == 'interestOnDelayedPayment') {
				downloadObj = {
					rptId: 49,
					SendEmail: "N",
					ReportFormat: this.fileType,
					Clientid: this.clientCode,
					Fromdt: moment(this.fromDateReq).format('YYYYMMDD'),
					Todt: moment(this.toDateReq).format('YYYYMMDD'),
					CallFrom: "AAA",
				}
			}
			// console.log(downloadObj);
			if (this.selectedShareType == 'mfAccount') {
				this.downloadMfAReport(downloadObj,this.selectedShareType);
			} else if (this.selectedShareType == 'interestOnDelayedPayment' && this.fileType) {
				this.downloadDPCPdf(downloadObj,this.selectedShareType);
			} else {
				this.getDownloadData(token, downloadObj, this.selectedShareType,fType);
			}
		} else {
			this.dataLoad = true;
			this.toast.displayToast('Please Enter the Client Code');
		}
		return;
	}


	getDownloadData(token: any, obj: any, name: any,type: any) {
		if(name =='dpholding'){
			name = `DP_${this.clientCode}`;
		}
		this.subscription.add(
			this.shareReportSer
			.sharedDownloadReport(token, obj)
			.subscribe((res) => {
				this.dataLoad = true;
				this.commonService.downLoadReportFun(res,name,type);
		}))
	}
	
	/**
	 * API call to download pdf/xls files for Delayed Payment Charges
	 * @param ob 
	 */
	downloadDPCPdf(ob: any,name: any) {
		this.subscription.add(
			this.shareReportSer
				.sharedDownloadReport(this.tokenValue, ob)
				.subscribe((ob) => {
					this.dataLoad = true;
					this.commonService.downLoadDPCReportFun(ob, this.fileType, name)
				}))
	}

	/**
	 * To pass payload and call API to download report.
	 * @param obj 
	 */
	downloadMfAReport(obj:any,name:any) {
		this.subscription.add(
			this.shareReportSer
				.downloadMfAccountReport(this.tokenValue, obj)
				.subscribe((ob) => {
					this.dataLoad = true;
					this.commonService.downLoadMfReportFun(ob,name)
				}))
	}

	// send mail msg in toast
	sendEmail() {
		if (this.mail_key == '1') {
			this.toast.displayToast('Email has been send to client');
		}
		else {
			this.toast.displayToast('Email has not found');
		}
	}

	/*
	To construct payload and pass to the API call.
	*/
	sendEmailPayload(token: any, userId: any) {
		var obj: any
		this.fromDateReq = this.fromDate;
		this.toDateReq = this.toDate;
		if (this.clientCode) {
			switch (this.selectedShareType) {
				case 'realised':
					let rpId;
					if (this.productValue == 'cash') {
						rpId = '122';
					} else if (this.productValue == 'f&o') {
						rpId = '138';
					} else if (this.productValue == 'currency') {
						rpId = '174';
					} else if (this.productValue == 'commodity') {
						rpId = '451';
					}
					obj = {
						rptId: rpId,
						Client: this.clientCode,
						Start: moment(this.fromDateReq).format('YYYYMMDD'),
						End: moment(this.toDateReq).format('YYYYMMDD'),
						SendEmail: 'Y',
						Callfrom: 'AAA',
						IncludingSTT: 'yes'
					}
					if (this.productValue == 'cash' || this.productValue == 'f&o') {
						obj['ScripCode'] = "";
					}
					break;
				case 'unrealised':
					let rId;
					if (this.productValue == 'cash') {
						rId = '130';
					} else if (this.productValue == 'f&o') {
						rId = '139';
					} else if (this.productValue == 'currency') {
						rId = '175';
					} else if (this.productValue == 'commodity') {
						rId = '450';
					}
					obj = {
						rptId: rId,
						Client: this.clientCode,
						End: moment(this.tillDate).format('YYYYMMDD'),
						ScripCode: "",
						SendEmail: 'Y',
						Callfrom: 'AAA',
						IncludingSTT: 'yes'
					}
					break;
				case '360Client':
					obj = {
						rptId: "180",
						ClientCode: this.clientCode,
						Fromdate: moment(this.fromDateReq).format('YYYYMMDD'),
						Date: moment(this.toDateReq).format('YYYYMMDD'),
						SendEmail: 'Y',
						Callfrom: 'AAA'
					}
					break;
				case 'sttCertificate':
					obj = {
						rptId: "134",
						loginid: this.clientCode,
						Exch: "",
						FromDt: moment(this.fromDateReq).format('YYYYMMDD'),
						ToDt: moment(this.toDateReq).format('YYYYMMDD'),
						SendEmail: "Y",
						Callfrom: 'AAA'
					}
					break;
				case 'simplified':
					obj = {
						rptId: "53",
						ClientCode: this.clientCode,
						Exch: "",
						FromDate: moment(this.fromDateReq).format('YYYYMMDD'),
						ToDt: moment(this.toDateReq).format('YYYYMMDD'),
						SendEmail: "Y",
						BnkFlag: "N",
						RoleId: "0",
						Callfrom: 'AAA'
					}
					break;
				case 'tradeListing':
					obj = {
						rptId: "54",
						ClientCode: this.clientCode,
						FromDate: moment(this.fromDateReq).format('YYYYMMDD'),
						ToDate: moment(this.toDateReq).format('YYYYMMDD'),
						ReportType: this.tradeListValue,
						SendEmail: "Y",
						exchange: this.tradeListingExchValue,
						ScripCode: "",
						loginid: userId,
						type: "E",
						TradeDate: '',
						Callfrom: 'AAA'
					}
					break;
					case 'dpholding':
						let type = this.dpId.includes('IN') ? 'NSDL' : 'CDSL';
						if (type === 'CDSL') {
							obj = {
								"rptId": "421",
								"clid": this.dpId,
								"dtfrom": moment(this.asOnDate).format('MM/DD/YYYY'),
								"dtto": moment(this.asOnDate).format('MM/DD/YYYY'),
								"SendEmail": "Y",
								"CallFrom": "AAA"
							}
						} else {
							if (moment(this.asOnDate).format('DD/MM/YYYY') === moment().format('DD/MM/YYYY')) {
								obj = {
									"rptId": "457",
									"clientCode": this.dpId.slice(8, this.dpId.length),
									"LoginId": localStorage.getItem('userId1'),
									"SendEmail": "Y",
									"CallFrom": "AAA"
								}
							} else {
								obj = {
									"rptId": "420",
									"FromClient": this.dpId.slice(8, this.dpId.length),
									"FromDate": moment(this.asOnDate).format('YYYYDDMM'),
									"SendEmail": "Y",
									"CallFrom": "AAA"
								}
							}
						}
							break;
				case 'dpTransaction':
					obj = {
						rptId: this.isProd ? "505" : "13422",
						DPID: this.dpId,
						SendEmail: "Y",
						LoginID: this.clientCode,
						FromDate: moment(this.fromDateReq).format('YYYYMMDD'),
						ToDate: moment(this.toDateReq).format('YYYYMMDD'),
						Callfrom: 'AAA'
					}
					break;
				case 'dailyBills':
					obj = {
						rptId: this.exchangeDailyBillsValue == 'BSE CASH' || this.exchangeDailyBillsValue == 'NSE CASH' ? '187' : '183',
						SendEmail: "Y",
						clientCode: this.clientCode,
						ClientCode: this.clientCode,
						Date: this.settlementObj && this.settlementObj.date ? this.settlementObj.date : undefined,
						ExchangeType: this.exchangeDailyBillsValue.split(' ')[1] == 'CASH' ? 'C' : this.exchangeDailyBillsValue.split(' ')[1] == 'CURRENCY' ? 'U' : 'D',
						Exchange: this.exchangeDailyBillsValue.split(' ')[0].charAt(0),
						Settlement: this.settlementObj && this.settlementObj.settlementNo ? this.settlementObj.settlementNo : undefined,
						Callfrom: 'AAA'
					}
					obj = this.exchangeDailyBillsValue == 'BSE CASH' || this.exchangeDailyBillsValue == 'NSE CASH' ? _.omit(obj, ['ExchangeType', 'Exchange', 'ClientCode']) : _.omit(obj, ['Settlement', 'clientCode']);
					break;
				case 'digitalContract':
					obj = {
						rptId: this.detailedSummarisedValue == 'Detailed' ? '182' : '186',
						SendEmail: "Y",
						ClientCode: this.clientCode,
						Date: this.settlementObj && this.settlementObj.date ? this.settlementObj.date : undefined,
						ExchType: this.digitalContactExchValue == 'NSE-Buyback' || this.digitalContactExchValue == 'BSE-Buyback' ? 'C' : this.digitalContactExchValue.split('-')[1].toUpperCase() == 'CASH' ? 'C' : this.digitalContactExchValue.split('-')[1].toUpperCase() == 'CURRENCY' ? 'U' : this.digitalContactExchValue.split('-')[1].toUpperCase() == 'FNO' ? 'D' : (this.digitalContactExchValue.split('-')[1].toUpperCase() == 'MCX' || this.digitalContactExchValue.split('-')[1].toUpperCase() == 'NCDEX') ? 'Y' : this.digitalContactExchValue.split('-')[1].toUpperCase(),
						Exch: this.digitalContactExchValue.split('-')[0].charAt(0),
						SettlementType: this.settlementObj && this.settlementObj.type ? this.settlementObj.type : undefined,
						BuySellFlag: "",
						Callfrom: 'AAA'
					}
					if (this.digitalContactExchValue.split('-')[0] == 'MCX') {
						obj = {
							rptId: this.isProd ? '448' : '13355',
							Client: this.clientCode,
							TradeDt: this.settlementObj && this.settlementObj.date ? this.settlementObj.date : undefined,
							SendEmail: "Y",
						}
					} else if (this.digitalContactExchValue.split('-')[0] == 'NCDEX') {
						obj = {
							rptId: this.isProd ? '449' : '13361',
							Client: this.clientCode,
							TradeDt: this.settlementObj && this.settlementObj.date ? this.settlementObj.date : undefined,
							SendEmail: 'Y'
						}
					}
					break;
				default:
					break;
			}

			this.subscription.add(
				this.shareReportSer
					.sharedDownloadReport(token, obj)
					.subscribe((res) => {
						this.dataLoad = true;
						if (res && res.Body && res.Body.Msg) {
							this.toast.displayToast(res.Body.Msg);
						}
						else {
							this.toast.displayToast(res.Head.ErrorDescription);
						}
					}
						// ,error => {
						// 	console.error(err);
						// }
					))
		} else {
			this.dataLoad = true;
			this.toast.displayToast('Please Enter the Client Code');
		}		 
	}

	// To reset date on product change.
	onProductChange() {
		if (this.selectedShareType == 'unrealised') {
			this.tillDate = this.commonService.lastMonthISOConverted('current');
			this.ionTillDate = this.commonService.getIonDateTimeFormat(this.tillDate);
		} else {
			this.fromDate = this.commonService.lastMonthISOConverted('previous');
			this.ionFromDate = this.commonService.getIonDateTimeFormat(this.fromDate);
			this.toDate = this.commonService.lastMonthISOConverted('current');
			this.ionToDate = this.commonService.getIonDateTimeFormat(this.toDate);
		}
	}
	// To reset date on exchange change.
	tradeExchChange() {
		this.fromDate = this.commonService.lastMonthISOConverted('previous');
		this.ionFromDate = this.commonService.getIonDateTimeFormat(this.fromDate);
		this.toDate = this.commonService.lastMonthISOConverted('current');
		this.ionToDate = this.commonService.getIonDateTimeFormat(this.toDate);
	}

	// To reset date on exchange change.
	dailyBillExchChange() {
		this.fromDate = this.commonService.lastMonthISOConverted('previous');
		this.ionFromDate = this.commonService.getIonDateTimeFormat(this.fromDate);
		this.toDate = this.commonService.lastMonthISOConverted('current');
		this.ionToDate = this.commonService.getIonDateTimeFormat(this.toDate);
	}

	/**
	 * on click of excel icon
	 */
	downloadExcelReport() {
		if (this.selectedShareType == 'realised') {
			this.commonService.setClevertapEvent('Realised PnL', { 'Login ID': localStorage.getItem('userId1') });
		} else if (this.selectedShareType == 'unrealised') {
			this.commonService.setClevertapEvent('UnRealised PnL', { 'Login ID': localStorage.getItem('userId1') });
		} else if (this.selectedShareType == 'dpTransaction') {
			this.commonService.setClevertapEvent('DP transactions', { 'Login ID': localStorage.getItem('userId1') });
		} else if (this.selectedShareType == 'tradeListing') {
			this.commonService.setClevertapEvent('Trade listing', { 'Login ID': localStorage.getItem('userId1') });
		}else if (this.selectedShareType == 'simplified') {
			this.commonService.setClevertapEvent('Simplified Ledger', { 'Login ID': localStorage.getItem('userId1') });
		}
		this.dataLoad = false;
		if (this.clientCode) {
			this.storage.get('userID').then((userID) => {
				this.storage.get('userType').then(type => {
					if (type === 'RM' || type === 'FAN') {
						this.storage.get('bToken').then(token => {
							this.getReportData(token, userID);
						})
					} else {
						this.storage.get('subToken').then(token => {
							this.getReportData(token, userID);
						})
					}
				})
			})
		}
		else {
			this.dataLoad = true;
			this.toast.displayToast('Please Enter the Client Code');
		}
	}

	/**
	 * To get data from API for realised,simplified,unrealised,dpTransaction,tradeListing report.
	 * @param token 
	 */
	getReportData(token: any,userID: any) {
		this.fromDateReq = this.fromDate;
		this.toDateReq = this.toDate;
		switch (this.selectedShareType) {
			case 'realised':
			case 'tradeListing':
			case 'dpholding':
				this.downLoadPassObj(token,userID,'excel');
				break;
			case 'simplified':
			case 'unrealised':
			case 'dpTransaction':
				if (this.commonService.convertDateToMillisec(this.fromDateReq) > this.commonService.convertDateToMillisec(this.toDateReq)) {
					this.toast.displayToast('from Date cannot be more than To Date');
				} else {
					this.downLoadPassObj(token,userID,'excel');
				}
				break;
			default:
				break;
		}
	}


/**
	 * On iifl/offline tab select
	   */
onIIFLTabClick() {
	this.searchValue = null;
	this.panSearchValue = null;
	this.clientSearchValue = null;
	this.showAMCReport = false;
	this.allClients = [];
	if (this.selectedShareType === 'amcStmt') {
		this.showAMCReport = true;
	}
	if (!this.platform.is('desktop')) {
		this.clientSearchValue = ''
	}
}

showDropDown() {
	this.isDropDownVisible = true;
	this.clientSearchValue = '';
	this.dtLoad = true;
}

hideDropDown() {
	setTimeout(() => {
		this.isDropDownVisible = false;
	}, 300);
}

showPanDropDown() {
	this.isPanDropDownVisible = true;
	this.panSearchValue = '';
	this.dtLoad = true;
	this.storage.get('offlineClientList').then((list) => {
		this.cliList = list;
		if (this.cliList == null) {
			this.storage.get('userType').then(type => {
				if (type === 'RM' || type === 'FAN') {
					this.storage.get('bToken').then(token => {
						this.getOfflineClients(token);
					})
				} else {
					this.storage.get('subToken').then(token => {
						this.getOfflineClients(token);
					})
				}
			})
		}
	})
}

hidePanDropDown() {
	setTimeout(() => {
		this.isPanDropDownVisible = false;
	}, 500);
}

// select the client ID from dropdown
displayClientDetails(data: any) {
	// localStorage.setItem('select_client', JSON.stringify(data))
	this.clientSearchValue = data.ClientCode.split('-')[0].trim()//JSON.parse(localStorage.getItem('select_client'))['ClientCode'];
	this.clientCode = data.ClientCode.split('-')[0].trim();
	this.showAMCReport = false;
	localStorage.setItem('slctdClientCode', this.clientSearchValue);
	this.changeShareReportType();
	
	if (this.selectedShareType === 'dpholding') {
		this.getDpIds(this.tokenValue)
	}
}
/**
 * On click of search-bar in offline client tab.
 */
onPANSearchBarClick(value: any) {
	if (value != this.panSearchValue) {
		this.searchValue = null;
		this.panSearchValue = null;
		this.clientSearchValue = null;
	}
	this.panSearchValue = value.clientpan;
}

/**
 * To get offline client list.
 * @param token 
 */
getOfflineClients(token: any) {
	this.clientService.getOfflineMfClients(token, { 'Partnercode': localStorage.getItem('userId1') })
		.subscribe((res: any) => {
			if (res && res['Body']) {
				this.cliList = res['Body'];
				this.storage.set('offlineClientList', res['Body']);
			} else {
				this.cliList = [];
			}
			this.dtLoad = false;
		})
}

/**
 * To get all client list.
 * @param token 
 */
clientApiCalls(token: any) {
		this.storage.get('setClientCodes').then((clientCodes) => {
			this.clientCodeData = clientCodes;
		});
}

// public searchText(txt) {
// 	if (txt.length >= 4) {
// 		this.clientSearchValue = txt.trim();
// 		this.datas = [];
// 		this.allClients = [];
// 		this.datas = this.clientCodeData;
// 		this.datas = this.datas.filter((item) => {
// 			return item.ClientCode.toLowerCase().includes(this.clientSearchValue.toLowerCase());
// 		});

// 		this.datas.forEach(element => {
// 			const found = this.allClients.some(el => el.ClientCode === element.ClientCode);
// 			if (!found) this.allClients.push({ ClientCode: element.ClientCode });
// 		})

// 		// console.log('Search Result', this.allClients);
// 		this.isDropDownVisible = true;
// 	}
// 	else {
// 		this.datas = [];
// 		this.isDropDownVisible = false;
// 	}
// }

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

	searchText(text: any) {
		let searchValue = text.trim();
		this.isDropDownVisible = false;
		if (searchValue && searchValue.length > 3) {
			this.dtLoad = false;
			this.isDropDownVisible = true;
			this.clientSearchTerms.next(searchValue);
		} else {
			this.allClients = [];
		}
	}

	desktopDatePosition = (reportName: string) => {
		this.datePositionCenter = false;
		this.datePositionRight = false;
		this.datePositionLeft = false;

		if(reportName == "dpTransaction" || reportName == "dailyBills"){
			this.datePositionCenter = true;
		}
		else if(reportName == "mfAccount" || reportName == "mfCapital"){
			this.datePositionRight = true;
		}
		else if(reportName == "interestOnDelayedPayment" || reportName == "sttCertificate" || reportName == "simplified"){
			this.datePositionLeft = true;
		}
	}

}