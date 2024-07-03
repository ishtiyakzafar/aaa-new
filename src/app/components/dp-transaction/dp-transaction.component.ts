import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { DPTransactionService } from './dp-transaction.service';
import { Platform, ModalController } from '@ionic/angular';
import { ShareReportService } from '../../pages/share-reports/share-report.service';
import { FormatUnitNumberPipe } from '../../helpers/formatnumberunit.pipe';
import { environment } from '../../../environments/environment';
import { ToasterService } from '../../helpers/toaster.service';
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
	selector: 'app-dp-transaction',
	providers: [ FormatUnitNumberPipe, DPTransactionService, ShareReportService],
	templateUrl: './dp-transaction.component.html',
	styleUrls: ['./dp-transaction.component.scss'],
})
export class DpTransactionComponent implements OnInit, OnChanges {
    @Input() dpTransObj:any;
	public ascending!: boolean;
	public dataLoad: boolean = false;
	public order: any;
	public isProd = environment['production'];
	reverse: boolean = false;
	public val: string = 'asc';
	public transactionData: any = [
		/* {
			"Particular": "BILL FOR NN2021133",
			"creditAmount": "124.38 Cr",
			"debitAmount": "124.38 Cr",
			"openingBalance": "663.59 Cr",
			"closingBalance": "663.59 Cr",
			"Transaction_date": "\/Date(1626287400000+0530)\/",
			"companyName": 'BAJAJFINANCE'
		},
		{
			"Particular": "BILL FOR NN2021134",
			"creditAmount": "389.03 Cr",
			"debitAmount": "389.03 Cr",
			"openingBalance": "274.56 Cr",
			"closingBalance": "274.56 Cr",
			"Transaction_date": "\/Date(1626373800000+0530)\/",
			"companyName": 'BAJAJFINANCE'
		},
		{
			"Particular": "BILL FOR NN2021135",
			"creditAmount": "28.01 Cr",
			"debitAmount": "28.01 Cr",
			"openingBalance": "246.55 Cr",
			"closingBalance": "246.55 Cr",
			"Transaction_date": "\/Date(1626633000000+0530)\/",
			"companyName": 'BAJAJFINANCE'
		},
		{
			"Particular": "BILL FOR NN2021136",
			"creditAmount": "922.02 Cr",
			"debitAmount": "922.02 Cr",
			"openingBalance": "675.47 Dr",
			"closingBalance": "675.47 Dr",
			"Transaction_date": "\/Date(1626719400000+0530)\/",
			"companyName": 'BAJAJFINANCE'
		},
		{
			"Particular": "BILL FOR NN2021133",
			"creditAmount": "124.38 Cr",
			"debitAmount": "124.38 Cr",
			"openingBalance": "663.59 Cr",
			"closingBalance": "663.59 Cr",
			"Transaction_date": "\/Date(1626287400000+0530)\/",
			"companyName": 'BAJAJFINANCE'
		},
		{
			"Particular": "BILL FOR NN2021134",
			"creditAmount": "389.03 Cr",
			"debitAmount": "389.03 Cr",
			"openingBalance": "274.56 Cr",
			"closingBalance": "274.56 Cr",
			"Transaction_date": "\/Date(1626373800000+0530)\/",
			"companyName": 'BAJAJFINANCE'
		},
		{
			"Particular": "BILL FOR NN2021135",
			"creditAmount": "28.01 Cr",
			"debitAmount": "28.01 Cr",
			"openingBalance": "246.55 Cr",
			"closingBalance": "246.55 Cr",
			"Transaction_date": "\/Date(1626633000000+0530)\/",
			"companyName": 'BAJAJFINANCE'
		},
		{
			"Particular": "BILL FOR NN2021136",
			"creditAmount": "922.02 Cr",
			"debitAmount": "922.02 Cr",
			"openingBalance": "675.47 Dr",
			"closingBalance": "675.47 Dr",
			"Transaction_date": "\/Date(1626719400000+0530)\/",
			"companyName": 'BAJAJFINANCE'
		},
		{
			"Particular": "BILL FOR NN2021133",
			"creditAmount": "124.38 Cr",
			"debitAmount": "124.38 Cr",
			"openingBalance": "663.59 Cr",
			"closingBalance": "663.59 Cr",
			"Transaction_date": "\/Date(1626287400000+0530)\/",
			"companyName": 'BAJAJFINANCE'
		},
		{
			"Particular": "BILL FOR NN2021134",
			"creditAmount": "389.03 Cr",
			"debitAmount": "389.03 Cr",
			"openingBalance": "274.56 Cr",
			"closingBalance": "274.56 Cr",
			"Transaction_date": "\/Date(1626373800000+0530)\/",
			"companyName": 'BAJAJFINANCE'
		},
		{
			"Particular": "BILL FOR NN2021135",
			"creditAmount": "28.01 Cr",
			"debitAmount": "28.01 Cr",
			"openingBalance": "246.55 Cr",
			"closingBalance": "246.55 Cr",
			"Transaction_date": "\/Date(1626633000000+0530)\/",
			"companyName": 'BAJAJFINANCE'
		},
		{
			"Particular": "BILL FOR NN2021136",
			"creditAmount": "922.02 Cr",
			"debitAmount": "922.02 Cr",
			"openingBalance": "675.47 Dr",
			"closingBalance": "675.47 Dr",
			"Transaction_date": "\/Date(1626719400000+0530)\/",
			"companyName": 'BAJAJFINANCE'
		},
		{
			"Particular": "BILL FOR NN2021133",
			"creditAmount": "124.38 Cr",
			"debitAmount": "124.38 Cr",
			"openingBalance": "663.59 Cr",
			"closingBalance": "663.59 Cr",
			"Transaction_date": "\/Date(1626287400000+0530)\/",
			"companyName": 'BAJAJFINANCE'
		},
		{
			"Particular": "BILL FOR NN2021134",
			"creditAmount": "389.03 Cr",
			"debitAmount": "389.03 Cr",
			"openingBalance": "274.56 Cr",
			"closingBalance": "274.56 Cr",
			"Transaction_date": "\/Date(1626373800000+0530)\/",
			"companyName": 'BAJAJFINANCE'
		},
		{
			"Particular": "BILL FOR NN2021135",
			"creditAmount": "28.01 Cr",
			"debitAmount": "28.01 Cr",
			"openingBalance": "246.55 Cr",
			"closingBalance": "246.55 Cr",
			"Transaction_date": "\/Date(1626633000000+0530)\/",
			"companyName": 'BAJAJFINANCE'
		},
		{
			"Particular": "BILL FOR NN2021136",
			"creditAmount": "922.02 Cr",
			"debitAmount": "922.02 Cr",
			"openingBalance": "675.47 Dr",
			"closingBalance": "675.47 Dr",
			"Transaction_date": "\/Date(1626719400000+0530)\/",
			"companyName": 'BAJAJFINANCE'
		} */
	];
	tokenValue:any;
	public subscription: any;
	@Input() callFromDesktop: boolean = false;

	constructor(
		private formatNumber: FormatUnitNumberPipe,
		private storage: StorageServiceAAA,
		private toast: ToasterService,
		public commonService: CommonService,
		private serviceFile: DPTransactionService,
		private platform: Platform, private shareReportSer: ShareReportService
	) { }
	ngOnChanges(changes: SimpleChanges): void {
		if (this.platform.is('desktop')  || this.callFromDesktop) {
			// console.log(this.dpTransObj);
			this.getDataFromStorage();
		}
	}

	ngOnInit() { 
		if (!this.platform.is('desktop') && !this.callFromDesktop) {
			this.dpTransObj = this.commonService.getData();
			// console.log(this.dpTransObj);
			this.getDataFromStorage();
		}
	}

	public getDataFromStorage(optionalParams?: any) {
		this.dataLoad = true;
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.storage.get('userID').then( ID => {
						this.tokenValue = token
						this.getData(token, ID);
					})
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.storage.get('userID').then( ID => {
						this.tokenValue = token
						this.getData(token, ID);
					})
				})
			}
		})
	}

	public getData(token: any, ID: any) {
		this.subscription = new Subscription();
		
		const passObj = {
			"ClientCode": this.dpTransObj.clientCode,
			"ClientID": this.dpTransObj.dpId,
			"FromDate": this.dpTransObj.fromDate,
			"ToDate": this.dpTransObj.ToDate,
			"Product": ""
		};
		this.transactionData = [];
		this.subscription.add(
			this.serviceFile
			.getList(token, passObj)
			.subscribe( (response: any) => {
				if (+response['Head']['ErrorCode'] === 0) {
					this.dataLoad = false;

					const data = response['Body']['DPTransactionData'];
					let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
					data.forEach((element: any) => {
						const trxDate = element['TrxDate'].split('-')[0] + ' ' + months[element['TrxDate'].split('-')[1] - 1] + '  ' + element['TrxDate'].split('-')[2];
						this.transactionData.push({
							Particular: element['Particulars'],
							creditAmount: +element['Credit'],
							debitAmount: +element['Debit'],
							openingBalance: +element['OpeningBalance'],
							closingBalance: +element['ClosingBalance'],
							Transaction_date: trxDate,
							companyName: element['CompanyName'],
							convertDate: moment(element['TrxDate'].split('-')[1]+'/'+element['TrxDate'].split('-')[0]+'/'+element['TrxDate'].split('-')[2], "M/D/YYYY H:mm").valueOf()
						},)
					});
					// console.log(this.transactionData);
					/* this.partnerCode = response['Body']['PartnerLedegerCode'];
					this.partnerName = response['Body']['PartnerName']; */
				} else {
					this.dataLoad = false;
					this.transactionData = [];
					this.toast.displayToast(response['Body']['Message'] ? response['Body']['Message'] : 'No record found.')
				}
			} )
		)
	}

	splitAmountValue(transData: any){
		var transNum;
		var transUnit;
		transNum = this.formatNumber.transform(transData.split(' ')[0]);
		transUnit = transData.split(' ')[1];
		return transNum + ' '+transUnit
	}

	splitBalance(balance: any){
		var balanceNum;
		var balanceUnit;
		balanceNum = this.formatNumber.transform(balance.split(' ')[0]);
		balanceUnit = balance.split(' ')[1];
		return balanceNum + ' '+balanceUnit
	}

	goBack() {
		window.history.back();
	}

	
downloadReport(){
	this.subscription = new Subscription();
	this.dataLoad = true;	 
	let downloadObj = {
			rptId: this.isProd ? "505" : "13422",
			DPID: this.dpTransObj.dpId,
			SendEmail: 'N',
			LoginID: this.dpTransObj['clientCode'],
			FromDate: this.dpTransObj['fromDate'],
			ToDate: this.dpTransObj['ToDate'],
			CallFrom: "AAA"
		}
	this.getDownloadData(this.tokenValue, downloadObj)  
}


getDownloadData(token: any, obj: any) {
	this.subscription.add(
		this.shareReportSer
		.sharedDownloadReport(token, obj)
		.subscribe((res) => {
			this.dataLoad = false;
			this.commonService.downLoadReportFun(res)
	}))
}

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

}
