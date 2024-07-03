import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonService } from '../../helpers/common.service';
import { FormatUnitNumberPipe } from '../../helpers/formatnumberunit.pipe';
import { ClientTradesService } from '../../pages/recently-viewed-client-list/client-trades.service';
import { Platform, ModalController } from '@ionic/angular';
import { OrderPipe } from 'ngx-order-pipe';
import { Subscription } from 'rxjs';
// import * as moment from "moment";
import { ShareReportService } from '../../pages/share-reports/share-report.service';
import moment from 'moment';
import { ToasterService } from '../../helpers/toaster.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';




@Component({
	selector: 'app-simplified-ledger',
	providers: [ClientTradesService, FormatUnitNumberPipe, ToasterService, ShareReportService],
	templateUrl: './simplified-ledger.component.html',
	styleUrls: ['./simplified-ledger.component.scss'],
})
export class SimplifiedLedgerComponent implements OnInit, OnChanges {
	public monthWeekTabValue: any = 'month';

	@Input() simpLedgerParams: any;
	public order: any;
	reverse: boolean = false;
	public ascending!: boolean;

	ledgerDetailsRecords: any[] = [];
	public startDate: any = null;
	public endDate: any = null;
	openingBalance: any;
	totalBalance: any;
	unClearedBalance: any;
	clearedBalance: any;
	weekDateList: any;
	LedgerTabDetails: any;
	public datas: any[] = [
		{}, {}, {}
	]
	currentDay: any;
	tokenValue: any;
	ledgerData: any[] = [];
	dataLoad!: boolean;
	private subscription: any;
	@Input() callFromDesktop: boolean = false;
	public val: string = 'asc';

	constructor(private toast: ToasterService, private commonservice: CommonService, private storage: StorageServiceAAA, private formatNumber: FormatUnitNumberPipe, private clientService: ClientTradesService, private platform: Platform, private orderPipe: OrderPipe, private shareReportSer: ShareReportService) { }
	ngOnChanges(changes: SimpleChanges): void {
		if (this.platform.is('desktop') || this.callFromDesktop) {
			this.initSimpLedger();
		}
	}


	ngOnInit(): void {
		if (!this.platform.is('desktop') && !this.callFromDesktop) {
			this.simpLedgerParams = this.commonservice.getData();
			this.initSimpLedger();
		}
		// console.log('enter')
		// this.displayLedgerdata(this.ledgerData);
	}

	initSimpLedger() {
		this.dataLoad = false
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('sToken').then(token => {
					this.clientLedger(token)
					// this.tokenValue = token;
				})
			} else {
				this.storage.get('subToken').then(token => {
					// this.tokenValue = token;
					this.clientLedger(token)
					// console.log(this.tokenValue);
				})
			}
		})

	}


	// function call when segment change to month and week
	clientLedger(token: any) {
		// console.log(this.tokenValue);
		// this.dataLoad = false;
		this.clientService.getclientLedger1(token, this.simpLedgerParams['clientCode'], this.simpLedgerParams['fromDate'], this.simpLedgerParams['ToDate'])
		.subscribe((res: any) => {
			if (res['head']['status'] == 0) {
				this.LedgerTabDetails = res['body'];
				this.displayLedgerdata(this.LedgerTabDetails);
				setTimeout(() => {
					this.dataLoad = true;
				}, 500);
			} else {
				this.LedgerTabDetails = [];
			}
		})
	}

	goBack() {
		window.history.back();
	}

	splitwithNumberValue(num: any) {
		var number: any;
		return number.split(' ')[0]
	}


	// Rendering of list of data
	displayLedgerdata(ledgerData: any) {
		//this.dataLoad = false;
		this.openingBalance = ledgerData.OpeningBalance;
		this.totalBalance = ledgerData.TotalBalance;

		if (ledgerData.Records.length > 0) {
			this.unClearedBalance = ledgerData.UnClearedBalance;
			this.clearedBalance = Number(ledgerData.OpeningBalance.split(' ')[0]) - Number(ledgerData.UnClearedBalance.split(' ')[0]);
			(this.clearedBalance >= 0 ) ? this.clearedBalance = `${this.clearedBalance} Cr` :  this.clearedBalance = `${this.clearedBalance} Dr`;
			this.clearedBalance = this.clearedBalance.replace("-","");
			this.ledgerDetailsRecords = ledgerData.Records;
			this.ledgerDetailsRecords.forEach((element, index) => {
				element.dateValue = element.Transaction_date.slice(6, 19);
				element.amountValue = parseInt(element.Amount.split(' ')[0]);
				element.balanceValue = parseInt(element.RunningBalance.split(' ')[0]);
				element.creditValue = element.Amount.split(' ')[1] === 'Cr' ? element.Amount.split(' ')[0] + ' ' + element.Amount.split(' ')[1] : 0;
				element.debitValue = element.Amount.split(' ')[1] === 'Dr' ? element.Amount.split(' ')[0] + ' ' + element.Amount.split(' ')[1] : 0;
				element.credit = element.Amount.split(' ')[1] === 'Cr' ? parseInt(element.Amount.split(' ')[0]) : 0;
				element.debit = element.Amount.split(' ')[1] === 'Dr' ? parseInt(element.Amount.split(' ')[0]) : 0;
			})
			this.setOrder('dateValue')
			//this.ledgerDetailsRecords = this.ledgerDetailsRecords.sort((a, b) => (a.Transaction_date.slice(6, 19) > b.Transaction_date.slice(6, 19)) ? -1 : 1);
			// console.log(this.ledgerDetailsRecords);
		}
		else {
			this.ledgerDetailsRecords = [];
			this.unClearedBalance = "0";
			this.clearedBalance = 0;
		}




	}



	setOrder(value: any) {
		this.reverse = !this.reverse;
		this.order = value;

		// console.log(this.orderPipe.transform(this.ledgerDetailsRecords, "Amount", this.reverse)); 
		if (this.reverse) {
			this.ascending = false;
			this.val = 'desc';
		} else {
			this.ascending = true;
			this.val = 'asc';
		}
	}


	splitAmountValue(transData: any) {
		var transNum;
		var transUnit;
		transNum = this.formatNumber.transform(transData.split(' ')[0]);
		transUnit = transData.split(' ')[1];
		return transNum + ' ' + transUnit
	}

	splitBalance(balance: any) {
		var balanceNum;
		var balanceUnit;
		balanceNum = this.formatNumber.transform(balance.split(' ')[0]);
		balanceUnit = balance.split(' ')[1];
		return balanceNum + ' ' + balanceUnit
	}

	downloadReport() {
		this.subscription = new Subscription();
		let downloadObj: any = {
			rptId: "53",
			ClientCode: this.simpLedgerParams['clientCode'],
			Exch: "",
			FromDate: this.simpLedgerParams['fromDate'],
			ToDt: this.simpLedgerParams['ToDate'],
			SendEmail: "N",
			BnkFlag: "N",
			RoleId: "0",
			CallFrom: "AAA"
		}
		downloadObj['ReportFormat'] = 'EXCEL';
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('sToken').then(token => {
					this.getDownloadData(token, downloadObj)
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.getDownloadData(token, downloadObj)
				})
			}
		})
	}

	getDownloadData(token: any, obj: any) {
		this.dataLoad = false;
		this.subscription.add(
			this.shareReportSer
				.sharedDownloadReport(token, obj)
				.subscribe((res) => {
					this.dataLoad = true;
					this.commonservice.downLoadReportFun(res,"simplified-ledger",'excel');
				}))
	}

	formatChange(date: any){
		return moment(date).format('Do MMM YY');
	}

}


