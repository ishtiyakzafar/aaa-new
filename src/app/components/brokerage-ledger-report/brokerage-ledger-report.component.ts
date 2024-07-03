import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { BrokerageLedgerReportService } from './brokerage-ledger-report.service';
import { ModalController, Platform } from '@ionic/angular';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { ToasterService } from '../../helpers/toaster.service';
import { CommonService } from '../../helpers/common.service';

@Component({
	selector: 'app-brokerage-ledger-report',
	providers: [BrokerageLedgerReportService],
	templateUrl: './brokerage-ledger-report.component.html',
	styleUrls: ['./brokerage-ledger-report.component.scss'],
})
export class BrokerageLedgerReportComponent implements OnInit, OnChanges {

	// @Input() fromDate;
	// @Input() toDate;
	@Input() fanBrokerageLedgerObj: any
	@Input() callFromDesktop: boolean = false;
	public dataLoad = false;
	public partnerName: any;
	public partnerCode: any;	

	public openingBal: any;
	public closingBal: any;
	public unClearedBal: any;

	public reportData: any = [
	];

	private subscription: any;
	datePipe = new DatePipe('en-US');
	rptData: any = [];
	constructor(
		private storage: StorageServiceAAA,
		private toast: ToasterService,
		public commonService: CommonService,
		private serviceFile: BrokerageLedgerReportService,
		private platform: Platform
	) { }

	ngOnChanges(changes: SimpleChanges): void {
		if (!this.platform.is('mobile') || this.callFromDesktop) {
			this.getDataFromStorage();
			this.dataLoad = true
		}	
	}

	ngOnInit() {
		this.fanBrokerageLedgerObj = this.commonService.getData();
		if (!this.platform.is('desktop') || this.fanBrokerageLedgerObj) {
			this.getDataFromStorage();
		}
	}

    // coming soon popup when click donwload option
    comingOption(event: any) {
        this.commonService.comingSoon(event, 'Coming Soon', 'coming')
    }

	public getDataFromStorage(optionalParams?: any) {
		this.dataLoad = true;
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.storage.get('userID').then( ID => {
						this.getData(token, ID);
					})
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.storage.get('userID').then( ID => {
						this.getData(token, ID);
					})
				})
			}
		})
	}

	public getData(token: any, ID: any) {
	
		this.subscription = new Subscription();
		
		const passObj: any = {
			PartnerCode: this.fanBrokerageLedgerObj['partnerID'] ? this.fanBrokerageLedgerObj['partnerID'] : ID
		};
		// passObj['PartnerCode'] = 'F1660';
		passObj["Exchange"] = '';
		// console.log(this.fanBrokerageLedgerObj);
		passObj['FromDate'] = this.fanBrokerageLedgerObj.fromDate;
		passObj['ToDate'] = this.fanBrokerageLedgerObj.toDate
		/* passObj['FromDate'] = moment(this.fromDate).format('YYYYMMDD');
		passObj['ToDate'] = moment(this.toDate).format('YYYYMMDD'); */
		/* passObj['FromDate'] = '20180401';
		passObj['ToDate'] = '20190824'; */
		this.subscription.add(
			this.serviceFile
			.getList(token, passObj)
			.subscribe( (response: any) => {
				if (+response['Head']['ErrorCode'] === 0) {
					this.dataLoad = false;
					this.rptData = response['Body'];
					const data = response['Body']['PartnerLedger'];
					if (response['Body']['PartnerLedger'].length) {
						data.forEach((element: any) => {
							// console.log(element['Date'].trim())
							this.reportData.push({
								closureDate: element['Date'],
								voucher: element['Voucher'],
								invoiceNo: element['InvoiceNo'] == "" ? '-': element['InvoiceNo'],
								// closureDate: moment(element['Date'].trim()).format('DD/MM/YYYY'),
								amount: element['Credit'] == 0 ? element['Debit']: element['Credit'],
								description: element['Particulars'],
								balance: +element['Balance'],
								Debit: element['Debit'],
								Credit: element['Credit'],
							})
						});
					} else {
						this.dataLoad = false;
					}
					this.openingBal = response['Body']['OpeningBalance'];
					this.closingBal = response['Body']['ClearedBalance'];
					this.unClearedBal = response['Body']['UnclearedBalance'];
					// this.openingBal = this.commonService.numberFormatWithCommaUnit(response['Body']['OpeningBalance']);
					// this.closingBal = this.commonService.numberFormatWithCommaUnit(response['Body']['ClearedBalance']);
					// this.unClearedBal = this.commonService.numberFormatWithCommaUnit(response['Body']['UnclearedBalance']);

					this.partnerCode = response['Body']['PartnerLedegerCode'];
					this.partnerName = response['Body']['PartnerName'];
				} else {
					this.dataLoad = false;
					this.toast.displayToast(response['Head']['ErrorDescription'] ? response['Head']['ErrorDescription'] : response['Body']['Message'] ? response['Body']['Message'] : 'No record found.');
				}
			} )
		)
	}

	goBack() {
		window.history.back();
	}

	/**
	 * On click of pdf/excel icon
	 */
	onPdfExcelDownload(type: any) {
		this.commonService.setClevertapEvent('Summaries_fanbrokerageledger', { 'Login ID': localStorage.getItem('userId1') });
		this.commonService.setClevertapEvent('FanBrokerageLedger', { 'PartnerCode': localStorage.getItem('userId1') });
		if (this.rptData && this.rptData['PartnerLedger'] && this.rptData['PartnerLedger'].length > 0) {
			this.dataLoad = true;
			let topSectionRow = [];
			let topSectionHead = [["Partner Name", "Partner Client Code", "Pan No", "Cleared Balance (Rs)", "Credit Cleared", "Credit Total", "Credit Uncleared", "Debit Cleared", "Debit Total", "Debit Uncleared", "Opening Balance (Rs)", "Uncleared Balance (Rs)", "Total Balance (Rs)"]];
			topSectionRow.push([this.rptData['PartnerName'], this.rptData['PartnerClientCode'], this.rptData['PanNo'], this.commonService.numberFormatWithCommaUnit(this.rptData['ClearedBalance']), this.rptData['CreditCleared'], this.rptData['CreditTotal'], this.rptData['CreditUncleared'], this.rptData['DebitCleared'], this.rptData['DebitTotal'], this.rptData['DebitUncleared'], this.commonService.numberFormatWithCommaUnit(this.rptData['OpeningBalance']), this.commonService.numberFormatWithCommaUnit(this.rptData['UnclearedBalance']), this.commonService.numberFormatWithCommaUnit(this.rptData['TotalBalance'])])
			let extra = { topSectionHead, topSectionRow };
			let info: any = [];
			let head = [["Date", "Voucher", "Particulars", "Credit", "Debit", "Balance", "InvoiceNo", "RefInvoiceNo", "Clearence Status"]];
			this.rptData['PartnerLedger'].forEach((element: any) => {
				info.push([element.Date, element.Voucher, element.Particulars, element.Credit, element.Debit, element.Balance, element.InvoiceNo, element.RefInvoiceNo, element.ClearenceStatus])
			})
			if (type === 'pdf') {
				this.commonService.savePdfFile(head, info, extra);
				this.dataLoad = false;
			} else {
				this.commonService.exportDataToExcel(head[0], info, 'FAN Brokerage Ledger', extra);
				this.dataLoad = false;
			}
		} else {
			this.toast.displayToast('No Data Found');
		}
	}
}
