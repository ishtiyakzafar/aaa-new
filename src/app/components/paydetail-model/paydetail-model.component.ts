import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ModalController, NavParams, Platform } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FormatUnitNumberPipe } from '../../helpers/formatnumberunit.pipe';
import { FormatNumberDecimalPipe } from '../../helpers/decimalNumber.pipe';
@Component({
	selector: 'app-paydetail-model',
	providers: [FormatUnitNumberPipe,FormatNumberDecimalPipe],
	templateUrl: './paydetail-model.component.html',
	styleUrls: ['./paydetail-model.component.scss'],
})
export class PaydetailModelComponent implements OnInit {
	detailsData: any;
	@ViewChild('detail') detail!: ElementRef;
    @ViewChild('upperPart') upperPart!: ElementRef;
	public detailHeight!: number;
    public upperHeight!: number;
	@Input() TabValue: any;
	@Input() viewDetailList: any = [];
	detailsArray: any[] = [];
	modelCode!: string;
	modelName!: string;
	modelType!: string;
	payoutValue:any;
	titleDisplayMobile:any;
	PayoutMonthYear:any;
	tableData: any[] = [
		{ name: "IIFL High Conviction FUND Series1", price: '89.2K', Month: "Jan 01, 2020", AgentCode: "Agent Code", FolioNumber: 'Folio Number', IssueDate: '20-Jul-13', Holder: 'Prashanjeet Chakravarty', HolderPan: 'Prashanjeet Chakravarty', InvestmentAmount: '89.32K', ReferralSharing: '242', FinalReferralSharing: '242' },
		{ name: "IIFL High Conviction FUND Series2", price: '89.2K', Month: "Jan 01, 2020", AgentCode: "Agent Code", FolioNumber: 'Folio Number1', IssueDate: '20-Jul-13', Holder: 'Prashanjeet Chakravarty1', HolderPan: 'Prashanjeet Chakravarty', InvestmentAmount: '89.32K', ReferralSharing: '242', FinalReferralSharing: '242' },
		{ name: "IIFL High Conviction FUND Series3", price: '89.2K', Month: "Jan 01, 2020", AgentCode: "Agent Code", FolioNumber: 'Folio Number2', IssueDate: '20-Jul-13', Holder: 'Prashanjeet Chakravarty2', HolderPan: 'Prashanjeet Chakravarty', InvestmentAmount: '89.32K', ReferralSharing: '242', FinalReferralSharing: '242' },
		{ name: "IIFL High Conviction FUND Series4", price: '89.2K', Month: "Jan 01, 2020", AgentCode: "Agent Code", FolioNumber: 'Folio Number3', IssueDate: '20-Jul-13', Holder: 'Prashanjeet Chakravarty3', HolderPan: 'Prashanjeet Chakravarty', InvestmentAmount: '89.32K', ReferralSharing: '242', FinalReferralSharing: '242' }];
	constructor(private modalController: ModalController, private router: Router, private platform: Platform, private route: ActivatedRoute,private formatUnit: FormatUnitNumberPipe, private numberDecimal: FormatNumberDecimalPipe) { }

	ngOnInit() {
		if (!this.platform.is('desktop')) {
			this.route.params.subscribe(params => {
				if (params) {
					this.TabValue = params['id'];
					// console.log(this.TabValue);
					
				}
			});
			this.viewDetailList	 = localStorage.getItem('payout_details') ? JSON.parse(localStorage.getItem('payout_details') || '{}') : "{}";
			// console.log(this.viewDetailList);
			this.payoutValue = this.viewDetailList['Payout'] ? this.viewDetailList['Payout']:'0';
			if(this.TabValue == 'mf'){
				this.payoutValue = this.viewDetailList['Trail'] ? this.viewDetailList['Trail']:'0';
			}
		}


	
		this.PayoutMonthYear = localStorage.getItem('payDetailMonth');
		
		//console.log(this.router.getCurrentNavigation().extras.state);
		
		this.detailsArray = [];
		this.modelCode = this.viewDetailList['ClientCode'];
		this.modelName = this.viewDetailList['ClientName'];
		
		// Fixed Deposit Pay Details
		if (this.TabValue == 'deposit') {
			this.modelType = 'Fixed Deposit'
			this.titleDisplayMobile = 'FD'
			this.detailsData = 13
			this.viewDetailList['PayoutDetails'].forEach((element: any) => {
				let depositObj = {
					"CompanyName": element.SchemeName,
					"payout": element.Payout, 
					"depositDetails": {
						"PAN": element.PAN,
						"Company Name": element.SchemeName,
						"Amount": this.numberDecimal.transform(element.Amount),
						"Trxn Date": element.TransactionDate,
						"Application/FDR No.": element.ApplicationFDRNo,
						"Duration": element.Duration,
						"Cheque Number": element.ChequeNumber,
						"Rebate Brokerage (%)": this.numberDecimal.transform(element.RebateBrokeragePer),
						"Operational Brokerage (%)": this.numberDecimal.transform(element.OperationalBrokPer),
						"Total Brokerage (%)": this.numberDecimal.transform(element.TotalBrokeragePer),
						"Rebate Val": this.numberDecimal.transform(element.RebateBrokerageVal),
						"Operational Val": this.numberDecimal.transform(element.OperationalBrokerageVal),
						"Total": this.numberDecimal.transform(element.TotalBrokerageVal),
					}
				}
				this.detailsArray.push(depositObj);
			});
		}
		// Bonds Details
		else if (this.TabValue == "bonds") {
			this.modelType = 'Bonds'
			this.titleDisplayMobile = 'Bonds'
			this.detailsData = 13
			this.viewDetailList['Summary'].forEach((element: any) => {
				let depositObj = {
					"CompanyName": element.SchemeName,
					"payout": element.Payout, 
					"depositDetails": {
						"PAN": element.PAN,
						"Company Name": element.SchemeName,
						"Amount": this.numberDecimal.transform(element.Amount),
						"Trxn Date": element.TrxDate,
						"Application/FDR No.": element.ApplicationNo,
						"Duration": element.Duration,
						"Cheque Number": element.ChequeNumber,
						"Rebate Brokerage (%)": this.numberDecimal.transform(element.RebateBrokeragePer) ,
						"Operational Brokerage (%)": this.numberDecimal.transform(element.OperationalBrokPer),
						"Total Brokerage (%)": this.numberDecimal.transform(element.TotalBrokeragePer),
						"Rebate Val": this.numberDecimal.transform(element.RebateBrok),
						"Operational Val": this.numberDecimal.transform(element.OperationalBrok),
						"Total": this.numberDecimal.transform(element.TotalBrokerage)
					}
				}
				this.detailsArray.push(depositObj);
			});
		}
		// PMS Details
		else if (this.TabValue == "pms") {
			this.modelType = 'PMS Plan'
			this.titleDisplayMobile = 'PMS'
			this.detailsData = 9;
			this.viewDetailList['Payoutdetails'].forEach((element: any) => {
				let depositObj = {
					"CompanyName": element.SchemeName,
					"payout": element.Payout, 
					"depositDetails": {
						"Month": element.PayoutMonth,
						"Agent Code": element.AgentCode,
						// "Folio Number": "-",
						"Issue-Date": element.TransactionDate,
						"1st Holder": this.viewDetailList['ClientName'],
						"1st Holder PAN": element.PAN,
						"Investment Amount": this.numberDecimal.transform(element.Amount),
						"Referral Sharing (IO)": this.numberDecimal.transform(element.ReferralSharing),
						"Final Referral Sharing (IO)": this.numberDecimal.transform(element.FinalReferralSharing)
					}
				}
				this.detailsArray.push(depositObj);
			});
		}
		// MLD Details
		else if (this.TabValue == "mld") {
			this.modelType = 'MLD Plan'
			this.titleDisplayMobile = 'MLD'
			this.detailsData = 8;
			this.viewDetailList['Payoutdetails'].forEach((element: any) => {
				let depositObj = {
					"CompanyName": element.SchemeName,
					"payout": element.Payout ? element.Payout : '-',
					"depositDetails": {
						"Month": element.PayoutMonth,
						"Agent Code": element.AgentCode,
						"Issue-Date": element.TransactionDate,
						"Holder Name": this.viewDetailList['ClientName'],
						"PAN": element.PAN,
						"Investment Amount": this.numberDecimal.transform(element.Amount),
						"Referral Sharing (IO)": this.numberDecimal.transform(element.ReferralSharing),
						"Final Referral Sharing (IO)": this.numberDecimal.transform(element.FinalReferralSharing)
					}
				}
				this.detailsArray.push(depositObj);
			});
		}
		// NCD Details
		else if (this.TabValue == "ncd") {
			this.modelType = 'NCD Plan'
			this.titleDisplayMobile = 'NCD'
			this.detailsData = 8;
			this.viewDetailList['Payoutdetails'].forEach((element: any) => {
				let depositObj = {
					"CompanyName": element.SchemeName,
					"payout": element.Payout ? element.Payout : '-', 
					"depositDetails": {
						"Application No.": element.ApplicationNo,
						"Category": element.Category,
						"Scheme Name": element.SchemeName,
						"Entry Date": element.EntryDate,
						"Allot Amt.": this.numberDecimal.transform(element.AllotmentAmount),
						"Brokerage Amount": this.numberDecimal.transform(element.AllotmentAmount),
						"Total Release": this.numberDecimal.transform(element.TotalRelease),
						"Brokerage Rate": this.numberDecimal.transform(element.BrokerageRate),
						"Per Appn.": this.numberDecimal.transform(element.PerApplication),
					}
				}
				this.detailsArray.push(depositObj);
			});
		}
		//AIF Details
		else if (this.TabValue == "aif") {
			this.modelType = 'AIF Plan'
			this.titleDisplayMobile = 'AIF'
			this.detailsData = 8;
			this.viewDetailList['AIFPayoutSubData'].forEach((element: any) => {
				let depositObj = {
					"CompanyName": element.SchemeName,
					"payout": element.Payout ? element.Payout : '-', 
					"depositDetails": {
						"Month.": element.PayoutMonth,
						"Agent Code": element.AgentCode,
						"Issue Date": element.TransactionDate,
						"1st Holder": this.viewDetailList['ClientName'],
						"1st Holder PAN": element.PAN,
						"Investment Amount": this.numberDecimal.transform(element.Amount),
						"Referral Sharing (IO)": this.numberDecimal.transform(element.ReferralSharing),
						"Final Referral Sharing (IO)": this.numberDecimal.transform(element.FinalReferralSharing),
					}
				}
				this.detailsArray.push(depositObj);
			});
		}
		//MF Details
		else if (this.TabValue == "mf") {
			this.modelType = 'Mutual Fund'
			this.titleDisplayMobile = 'MF'
			this.detailsData = 7;
			this.viewDetailList['MFPayoutSubData'].forEach((element: any) => {
				let depositObj = {
					"CompanyName": element.SchemeName,
					"payout": undefined, 
					"depositDetails": {
						"Folio Number": element.Folio_No,
						"PAN": this.viewDetailList['PAN'],
						"Amount": this.numberDecimal.transform(element.TransactionAmount),
						"Date": element.TransactionDate,
						// "Avg. Assets": "",
						"Payout Rate": element.Payout_Rate,
						"Trail": this.viewDetailList['Trail'],
						"Asset Type": element.AssetType
					}
				}
				this.detailsArray.push(depositObj);
			});
		}
		//Gold Ptc Details
		else if (this.TabValue == "gold") {
			this.modelType = 'Gold PTC Plan'
			this.titleDisplayMobile = 'Gold'
			this.detailsData = 8;
			this.viewDetailList['Payoutdetails'].forEach((element: any) => {
				let depositObj = {
					"CompanyName": element.SchemeName,
					"payout": element.Payout ? element.Payout : '-', 
					"depositDetails": {
						"Month": element.PayoutMonth,
						"Agent Code": element.AgentCode,
						"Issue Date": element.TransactionDate,
						"Holder Name": this.viewDetailList['ClientName'],
						"PAN": element.PAN,
						"Investment Amount": this.numberDecimal.transform(element.Amount),
						"Referral Sharing (IO)": this.numberDecimal.transform(element.ReferralSharing),
						"Final Referral Sharing (IO)":this.numberDecimal.transform(element.FinalReferralSharing),
					}
				}
				this.detailsArray.push(depositObj);
			});
		}

		//Insurance Details for mobile
		else if (this.TabValue == "insu") {
			this.titleDisplayMobile = 'Insurance'
			//this.modelType = 'Gold PTC Plan'
			this.detailsData = 9;
			this.viewDetailList['PayoutDetails'].forEach((element: any) => {
				let depositObj = {
					"CompanyName": element.ProductName,
					"payout": element.Payout ? element.Payout : '-', 
					"depositDetails": {
						"Month": element.Month,
						"Partner": element.Partner,
						"Policy Number": element.PolicyNumber,
						"Issue Date": element.IssueDate ,
						"Client Name": this.viewDetailList['ClientName'],
						"Premium": this.numberDecimal.transform(element.Premium),
						"Referral Sharing (IO)": this.numberDecimal.transform(element.ReferralSharing),
						"Recovery": this.numberDecimal.transform(element.Recovery),
						"Final Referral Sharing (IO)": this.numberDecimal.transform(element.FinalReferralSharing),
					}
				}
				this.detailsArray.push(depositObj);
			});
		}

		//equity Details for mobile
		else if (this.TabValue == "equity") {
			this.titleDisplayMobile = 'Equity'
			//this.modelType = 'Gold PTC Plan'
			this.detailsData = 10;
			// this.viewDetailList.forEach(element => {
				let depositObj = {
				 
					"depositDetails": {
						"Fan Share": this.numberDecimal.transform(this.viewDetailList['FanShare']),
						"Amount Pay after deduction reversal": this.numberDecimal.transform(this.viewDetailList['AmtPayafterDedRev']),
						"Afet Share": this.numberDecimal.transform(this.viewDetailList['AfetShare']),
						//"Trading Turnover": this.numberDecimal.transform(this.viewDetailList['TradingTurnover']) ,
						//"Cash Brkg": this.numberDecimal.transform(this.viewDetailList['CashBrokerage']) ,
						//"FnO Brkg": this.numberDecimal.transform(this.viewDetailList['FNOBrokerage']) ,
						//"Total Gross Brkg.": this.numberDecimal.transform(this.viewDetailList['TotalGrossBrokerage']),
						//"Net Brkg.": this.numberDecimal.transform(this.viewDetailList['NetBrokerage']) ,
						"Negative Networth": this.numberDecimal.transform(this.viewDetailList['NegativeNetworth']),
						"Brkg Rev": this.numberDecimal.transform(this.viewDetailList['BrokerageReversal']),
						"Vas Amt.": this.numberDecimal.transform(this.viewDetailList['VASAmount']),
						"Fan Vas Sharing Amt.": this.numberDecimal.transform(this.viewDetailList['FANVASSharingAmount']),
					}
				}
				this.detailsArray.push(depositObj);
		
		}


	}

	async dismiss() {
		await this.modalController.dismiss();
	}

	goBack() {
        window.history.back();
	}

	dropClick(index: any, arr: any) {
		// event.preventDefault();
		arr.forEach((element: any, ind: any) => {
			if ((index) !== ind) {
				element['isVisible'] = false;
			} else {
				element['isVisible'] = element['isVisible'] ? false : true;
				if (element['isVisible']) {
					setTimeout(() => {
						this.detailHeight = this.detail?.nativeElement.offsetHeight;
                        this.upperHeight = this.upperPart?.nativeElement.offsetHeight;
                        // console.log('height= ' + this.detailHeight);
					}, 100);
				}
			}
		});
		// console.log(arr);
	}

}
