import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { EquityDepositDetailService } from './equity-deposit-details.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { ToasterService } from '../../helpers/toaster.service';
import { CommonService } from '../../helpers/common.service';

@Component({
	selector: 'app-equity-deposit-details',
	providers: [ EquityDepositDetailService ],
	templateUrl: './equity-deposit-details.component.html',
	styleUrls: ['./equity-deposit-details.component.scss'],
})
export class EquityDepositDetailsComponent implements OnInit {

	@Input() partnerID: any;
	public dataLoad = false;
	public partnerName: any;
	public partnerCode: any;
	public reportData: any = [];
	private subscription: any;
	datePipe = new DatePipe('en-US');
	rptData: any = [];
	private passedPartnerCodeMobile: any;

	constructor(
		private storage: StorageServiceAAA,
		private toast: ToasterService,
		public commonService: CommonService,
		private serviceFile: EquityDepositDetailService
	) { }

	ngOnChanges(changes: SimpleChanges): void {
		//Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
		//Add '${implements OnChanges}' to the class.
		this.getDataFromStorage();
	}
	ngOnInit() {
		this.passedPartnerCodeMobile = this.commonService.getData()
		this.getDataFromStorage();
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
		
		const passObj = {
			PartnerCode: this.partnerID ? this.partnerID : this.passedPartnerCodeMobile ? this.passedPartnerCodeMobile : ID
		};

		this.commonService.setClevertapEvent('Partner_Equity_Deposit_Details');
		this.commonService.analyticEvent('Partner_Equity_Deposit_Details', 'Wire Reports');
		// passObj['PartnerCode'] = 'F1660'
		this.subscription.add(
			this.serviceFile
			.getList(token, passObj)
			.subscribe( (response: any) => {
				if (+response['Head']['ErrorCode'] === 0) {
					this.dataLoad = false;
					this.rptData = response['Body'];
					const data = response['Body']['Details'];
					data.forEach((element: any) => {
						this.reportData.push({
							DebitCreditFlag: element['DebitCreditFlag'],
							closureDate: moment(element['LedgerDate'].trim()).format('DD/MM/YYYY'),
							amount: +element['Amount'],
							description: element['Particulars'],
							balance: +element['Balance']
						})
					});
					this.partnerCode = response['Body']['PartnerLedegerCode'];
					this.partnerName = response['Body']['PartnerName'];
				} else {
					this.dataLoad = false;
					this.rptData = [];
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
		this.commonService.setClevertapEvent('Summaries_depositLedger', { 'Login ID': localStorage.getItem('userId1') });
		this.commonService.setClevertapEvent('DepositLedger', { 'PartnerCode': localStorage.getItem('userId1') });
		if (this.rptData && this.rptData['Details'].length > 0) {
			this.dataLoad = true;
			let info: any = [];
			let head = [["Partner Name", "Partner Ledeger Code", "Particulars", "Ledger Date", "Amount (Rs)", "Balance (Rs)", "Debit Credit Flag"]]
			this.rptData['Details'].forEach((element: any) => {
				info.push([this.rptData['PartnerName'], this.rptData['PartnerLedegerCode'], element.Particulars, moment(element.LedgerDate.trim()).format('DD/MM/YYYY'), this.commonService.numberFormatWithCommaUnit(element.Amount), this.commonService.numberFormatWithCommaUnit(element.Balance), element.DebitCreditFlag])
			})
			if (type === 'pdf') {
				this.commonService.savePdfFile(head, info);
				this.dataLoad = false;
			} else {
				this.commonService.exportDataToExcel(head[0], info, 'Deposit Ledger');
				this.dataLoad = false;
			}
		} else {
			this.toast.displayToast('No Data Found');
		}
	}

}
