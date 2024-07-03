import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import { Subscription } from 'rxjs';
import { PayoutSummaryReportService } from './payout-summary-report.service';
import { Platform } from '@ionic/angular';
import { jsPDF } from 'jspdf';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import autoTable from 'jspdf-autotable'
import { ToasterService } from '../../helpers/toaster.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { CommonService } from '../../helpers/common.service';

@Component({
	selector: 'app-payout-summary-report',
	providers: [ PayoutSummaryReportService ],
	templateUrl: './payout-summary-report.component.html',
	styleUrls: ['./payout-summary-report.component.scss'],
})
export class PayoutSummaryReportComponent implements OnInit, OnChanges {

	// @Input() selectedMonth;
	// @Input() selectedYear;
	@Input() fanPayoutObj:any

	public dataLoad = false;
	public partnerName: any;
	public additionsData: any;
	public deductionData: any;
	public fanCode: any;
	public panNo: any;
	public displayMonthValue: any;
	public totalPayout: any;
	public totalAddition: any;
	public totalDeduction: any;
	
	private subscription: any;
	datePipe = new DatePipe('en-US');
	reportData: any;
	constructor(
		private storage: StorageServiceAAA,
		private toast: ToasterService,
		private commonService: CommonService,
		private serviceFile: PayoutSummaryReportService,
		private platform: Platform,
		private fileOpener: FileOpener,
		private file: File
	) { }

	ngOnChanges(changes: SimpleChanges) {
		if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
			this.fanPayoutObj = this.commonService.getData() ? this.commonService.getData() : this.fanPayoutObj;
			if(this.fanPayoutObj){
				this.getDataFromStorage();
			}
		}
	}

	ngOnInit() {
		this.fanPayoutObj = this.commonService.getData() ? this.commonService.getData() : this.fanPayoutObj;
		if (this.platform.is('mobile') && !(this.fanPayoutObj && this.fanPayoutObj.isDesktopCall)) {
			if(this.fanPayoutObj){
				this.getDataFromStorage();
			}
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
			PartnerCode: (this.fanPayoutObj && this.fanPayoutObj['partnerID']) ? this.fanPayoutObj['partnerID'] : ID
		};
		// passObj['PartnerCode'] = 'F076201';
		

		// setTimeout(() => {
			var monthName = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
			if (this.fanPayoutObj['selectMonth'] === null) {
				passObj["Period"] = 'Y';
				passObj['Month'] = '';
				passObj['Year'] = this.fanPayoutObj['selectYear'];
			} else if (this.fanPayoutObj['selectYear'] === null) {
				passObj["Period"] = 'M';
				passObj['Month'] = monthName.indexOf(this.fanPayoutObj['selectMonth']) + 1;
				passObj['Year'] = '';
			} else {
				passObj["Period"] = 'M';
				passObj['Month'] = monthName.indexOf(this.fanPayoutObj['selectMonth']) + 1;
				passObj['Year'] = this.fanPayoutObj['selectYear'];
			}
			this.subscription.add(
				this.serviceFile
				.getList(token, passObj)
				.subscribe( (response: any) => {
					if (+response['Head']['ErrorCode'] === 0) {
						this.dataLoad = false;
						this.reportData = response['Body'];
						// console.log(response);
						this.additionsData = response['Body']['Additions'];
						this.deductionData = response['Body']['Deductions'];
						this.partnerName = response['Body']['PartnerName'];
						this.fanCode = response['Body']['PartnerCode'] ? response['Body']['PartnerCode'] : '-';
						this.panNo = response['Body']['PanNo'] ? response['Body']['PanNo'] : '-';
						this.displayMonthValue = response['Body']['SalaryDate'];
						this.totalPayout = response['Body']['TotalPayable'];
						this.totalAddition = response['Body']['TotalAdditions'];
						this.totalDeduction = response['Body']['TotalDeductions'];
					} else {
						this.dataLoad = false;
						this.reportData = [];
						this.additionsData = null;
						this.deductionData = null;
						this.partnerName = undefined;
						this.fanCode = undefined;
						this.panNo = undefined;
						this.displayMonthValue = undefined;
						this.totalPayout = undefined;
						this.totalAddition = undefined;
						this.totalDeduction = undefined;
						this.toast.displayToast(response['Head']['ErrorDescription'] ? response['Head']['ErrorDescription'] : 'No Data found.')
					}
				} )
			)
		// }, 100);

	}

	goBack() {
		window.history.back();
	}

	/**
   * On click of pdf icon
   */
	onPdfDownload() {
		this.commonService.setClevertapEvent('Summaries_fanpayoutsummary', { 'Login ID': localStorage.getItem('userId1') });
		this.commonService.setClevertapEvent('FanPayoutSummary', { 'PartnerCode': localStorage.getItem('userId1') });
		if (this.reportData) {
			const doc = new jsPDF('l', 'mm', 'a3');
			this.dataLoad = true;
			let topSectionRow = [];
			let h1 = [["FAN PAYOUT SUMMARY"],
			[`FAN CODE:  ${this.reportData['PartnerCode']}`],
			[`FAN NAME:  ${this.reportData['PartnerName']}`],
			[`MONTH NAME:  ${this.commonService.getToday(new Date(this.reportData['SalaryDate'])).split('-')[1]}`],
			[`PAN NO:  ${this.reportData['PanNo']}`]];
			autoTable(doc, {
				head: h1,
				body: [],
				theme: 'grid',
				styles: { overflow: 'linebreak' },
				headStyles: { fillColor: '#f2f4f4', textColor: '#000000', fontSize: 14, lineWidth: 0.25, lineColor: [0, 0, 0] },
				columnStyles: { text: { cellWidth: 'auto' } },
				bodyStyles: { fontSize: 12, fontStyle: 'bold', textColor: '#000000' },
				didParseCell: function (table) {
					if (table.cell.raw === 'FAN PAYOUT SUMMARY') {
						table.cell.styles.halign = 'center';
						table.cell.styles.fontSize = 17;
						table.cell.styles.valign = 'middle';
					}
				}
			});
			let topSectionHead = [[{ content: "ADDITIONS", colSpan: 2 }],
			[{ content: "PARTICULARS", colSpan: 1 }, { content: "Rs.", colSpan: 1 }]];
			topSectionRow = [['EQUITY GROSS BROKERAGE', this.reportData['Additions']['EquityGrossBrokerage']], ['CURRENCY GROSS BROKERAGE', this.reportData['Additions']['CurrencyGrossBrokerage']], ['VAS AMOUNT', this.reportData['Additions']['VASAmount']], ['UNUTILISED SLF SHARING', this.reportData['Additions']['UnutilisedSLFSharing']], ['PREVIOUS MONTH NEGATIVE NETWORTH', this.reportData['Additions']['PreviousMonthNegativeNetworth']], ['SERVICE TAX', this.reportData['Additions']['ServiceTax']], ['OTHERS', this.reportData['Additions']['Others']], ['TOTAL - A', this.totalAddition]];

			let header = [
				[{ content: "DEDUCTIONS", colSpan: 2 }],
				[{ content: "PARTICULARS", colSpan: 1 }, { content: "Rs.", colSpan: 1 }]];
			let rows = [['BROKERAGE REVERSAL', this.reportData['Deductions']['BrokerageReversal']], ['SLF REVERSAL', this.reportData['Deductions']['SLFReversal']], ['PREVIOUS MONTH RECOVERABLE', this.reportData['Deductions']['PreviousMonthRecoverable']], ['CURRENT NEGATIVE NETWORTH ', this.reportData['Deductions']['CurrentNegativeNetworth']], ['SALARY', this.reportData['Deductions']['Salary']], ['TDS', this.reportData['Deductions']['TDS']], ['OTHER DEDUCTION', this.reportData['Deductions']['OtherDeduction']], ['VSAT MONTHLY CHGS', this.reportData['Deductions']['VSATMonthlyCharges']], ['ADHOC PAYMENT', this.reportData['Deductions']['ADHOCPayment']], ['DEBIT ADJUSTMENT', this.reportData['Deductions']['DebitAdjustment']], ['PENALTY', this.reportData['Deductions']['Penalty']], ['VSAT CAP EXP.', this.reportData['Deductions']['VSATCapExp']], ['VOICE LOGGER CHARGES', this.reportData['Deductions']['VoiceLoggerCharges']], ['TOTAL - B', this.totalDeduction]];

			autoTable(doc, {
				head: topSectionHead,
				body: topSectionRow,
				theme: 'grid',
				styles: { overflow: 'linebreak' },
				headStyles: { fillColor: '#f2f4f4', textColor: '#000000', fontSize: 16, lineWidth: 0.25, lineColor: [0, 0, 0] },
				columnStyles: { text: { cellWidth: 'auto' } },
				bodyStyles: { fontSize: 11, fontStyle: 'bold', textColor: '#000000' },
				didParseCell: function (table: any) {
					if (table.cell.raw['content'] === 'ADDITIONS') {
						table.cell.styles.halign = 'center';
						table.cell.styles.fontSize = 17;
						table.cell.styles.valign = 'middle';
					}
				}
			});

			autoTable(doc, {
				head: header,
				body: rows,
				theme: 'grid',
				pageBreak: 'always',
				styles: { overflow: 'linebreak' },
				headStyles: { fillColor: '#f2f4f4', textColor: '#000000', fontSize: 16, lineWidth: 0.25, lineColor: [0, 0, 0] },
				bodyStyles: { fontSize: 11, fontStyle: 'bold', textColor: '#000000' },
				columnStyles: { text: { cellWidth: 'auto' } },
				didParseCell: function (table: any) {
					if (table.cell.raw['content'] === 'DEDUCTIONS') {
						table.cell.styles.halign = 'center';
						table.cell.styles.fontSize = 17;
						table.cell.styles.valign = 'middle';
					}
				}
			});
			doc.text(`PAYABLE (A-B): ${this.totalAddition - this.totalDeduction}`, 18, 160)
			var blobData = doc.output("blob");
			console.log(blobData);
			if (this.commonService.isApp()) {
				// old code
				// const writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.externalDataDirectory;
				const writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.externalRootDirectory + 'Download/';

				const filename = 'reports' + this.commonService.getRandomInt(1, 1000)
				fetch(URL.createObjectURL(blobData),
					{
						method: "GET"
					}).then(res => res.blob()).then(blob => {
						this.file.writeFile(writeDirectory, filename + '.pdf', blob, { replace: true }).then(res => {
							this.fileOpener.open(
								res.nativeURL,
								'application/pdf'
							)
						}).catch(err => {
							console.log("save error")
						});
					}).catch(err => {
						console.log("error")
					});
			} else {
				doc.save('reports.pdf');
			}
			this.dataLoad = false;
		} else {
			this.toast.displayToast('No Data Found');
		}
	}
}
