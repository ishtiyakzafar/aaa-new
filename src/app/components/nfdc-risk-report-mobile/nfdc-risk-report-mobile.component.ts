import { Component, ElementRef, OnInit, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import { OrderPipe } from 'ngx-order-pipe';
import moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash'; 
import { CustomEncryption } from '../../../config/custom-encrypt';
import { ToasterService } from '../../helpers/toaster.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { CommonService } from '../../helpers/common.service';

@Component({
  selector: 'app-nfdc-risk-report-mobile',
  providers: [WireRequestService, CustomEncryption],
  templateUrl: './nfdc-risk-report-mobile.component.html',
  styleUrls: ['./nfdc-risk-report-mobile.component.scss'],
})
export class NfdcRiskReportMobileComponent implements OnInit, OnChanges {

	@Input() ndfcReportType: any;
	@Input() wireCodeId: any;
	@Input() isViewClick: any;
	@ViewChild('detail') detail!: ElementRef;
	public detailHeight!: number;
	reverse: boolean = false;
	ascending: boolean = true;
	moment: any= moment;
    nfdcHeader = false;
    raaHeader = false;

	public order!: string;
	riskDataList: any[] = [];
	reportData: any[] = [];
	dataLoad!: boolean;
	searchClientCode: any = '';

	constructor(private platform: Platform,private toast:ToasterService, private storage: StorageServiceAAA,public route: ActivatedRoute, private wireReqService: WireRequestService, private orderPipe: OrderPipe, private commonService: CommonService, private ciphetText: CustomEncryption) {

	}
	ngOnChanges(changes: SimpleChanges): void {
		if (this.platform.is('mobile')) {
			this.riskDataList = [];
			this.reportData = [];
			console.log('isViewClick', this.isViewClick);
			if(this.isViewClick){
				this.initNfdcListMobile();
			}
		}

	}

    // coming soon popup when click donwload option
    comingOption(event: any) {
        this.commonService.comingSoon(event, 'Coming Soon', 'coming')
    }

	ngOnInit() {
		if (!this.platform.is('desktop') || this.platform.is('mobile')) {
				this.ndfcReportType = this.commonService.getData();
				this.initNfdcListMobile();
		}
		// if (this.platform.is('desktop')) {
		// 	if(this.isViewClick){
		// 		this.initNfdcList();
		// 	}
		// }

	}

	dropClick(id: any, arr: any) {
		arr.forEach((element: any, ind: any) => {
			if (id !== element.Loginid) {
				element['isVisible'] = false;
			} else {
				element['isVisible'] = element['isVisible'] ? false : true;
		
			}
		});
	}

	initNfdcListMobile(){

		if(this.route.snapshot.queryParams['reportType'] != undefined || this.route.snapshot.queryParams['wireCode'] != undefined){
			localStorage.setItem('reportType', JSON.stringify(this.route.snapshot.queryParams['reportType']));
			localStorage.setItem('wireCode', JSON.stringify(this.route.snapshot.queryParams['wireCode']));
		}
		else if(this.route.snapshot.queryParams['reportType'] == undefined || this.route.snapshot.queryParams['wireCode'] == undefined){
			this.route.snapshot.queryParams['reportType'] = JSON.parse(localStorage.getItem("reportType") || "{}");
			this.route.snapshot.queryParams['wireCode'] = JSON.parse(localStorage.getItem("wireCode") || "{}");
		}
		this.ndfcReportType = parseInt(this.route.snapshot.queryParams['reportType']);
		this.dataLoad = false;
        if(this.route.snapshot.queryParams['reportType'] == 5 || this.route.snapshot.queryParams['reportType'] == 6){
			this.commonService.setClevertapEvent('NFDC_Risk');
			this.commonService.analyticEvent('NFDC_Risk', 'Wire Reports');
            this.nfdcHeader = true;
			this.raaHeader = false;
			this.order = "";//null;
           
        }
        else{
			this.commonService.setClevertapEvent('RAA_Debit_Client');
			this.commonService.analyticEvent('RAA_Debit_Client', 'Wire Reports');
            this.nfdcHeader = false;
			this.raaHeader = true;
			this.order = "";// null;
		}
		const wireCode = this.route.snapshot.queryParams['wireCode'];
			this.storage.get('userType').then(type => {
				if (type === 'RM' || type === 'FAN') {
					this.storage.get('bToken').then(token => {
						this.nfdcListMobile(token, wireCode)
					})
				} else {
					this.storage.get('subToken').then(token => {
						this.nfdcListMobile(token, wireCode)
					})
				}

			})
	}

	initNfdcList() {
        this.dataLoad = false;
        if(this.ndfcReportType == 5 || this.ndfcReportType == 6){
			this.commonService.setClevertapEvent('NFDC_Risk');
			this.commonService.analyticEvent('NFDC_Risk', 'Wire Reports');
            this.nfdcHeader = true;
			this.raaHeader = false;
			this.order = "";//null;
           
        }
        else{
			this.commonService.setClevertapEvent('RAA_Debit_Client');
			this.commonService.analyticEvent('RAA_Debit_Client', 'Wire Reports');
            this.nfdcHeader = false;
			this.raaHeader = true;
			this.order = "";// null;
		}
		const wireCode = this.wireCodeId;
			this.storage.get('userType').then(type => {
				if (type === 'RM' || type === 'FAN') {
					this.storage.get('bToken').then(token => {
						this.nfdcList(token, wireCode)
					})
				} else {
					this.storage.get('subToken').then(token => {
						this.nfdcList(token, wireCode)
					})
				}

			})
	}

	nfdcListMobile(token: any, userID: any){
		let nfdcObj: any = {
			reportType: this.route.snapshot.queryParams['reportType'],
			requestCode: "NFDCRiskReport",
			Email: "N",
			encrpLogInId:this.ciphetText.aesEncrypt(userID)
		}

		
		if (this.route.snapshot.queryParams['reportType'] == 5 || this.route.snapshot.queryParams['reportType'] == 6) {

			
			this.wireReqService.getNfdcReport(token, nfdcObj, userID).subscribe((res: any) => {
				setTimeout(() => {
					this.dataLoad = true;
				}, 400);
				if (res['Head']['ErrorCode'] == 0) {
					this.reportData = res['Body']['NFDCDet'];
					res['Body']['NFDCDet'].forEach((element: any) => {
						this.riskDataList.push({
							Loginid: element.Loginid,
							LedBalance: parseFloat((element.LedBalance).replace(/,/g, '')),
							Branch: element.Branch,
							BuyVal: parseFloat((element.BuyVal).replace(/,/g, '')),
							GHV: parseFloat((element.GHV).replace(/,/g, '')),
							SpanExp: element.SpanExp,
							THV: parseFloat((element.THV).replace(/,/g, '')),
							NewLB: parseFloat((element.NewLB).replace(/,/g, '')),
							Networth: parseFloat((element.Networth).replace(/,/g, '')),
							Status: element.Status,
						})
						this.riskDataList = _.uniqBy(this.riskDataList, 'Loginid');
					});
				}
				else {

				}
			
			})
		}
		else {
			let raaObj = {
				ReportType: this.route.snapshot.queryParams['reportType'],
				encrpLogInId:this.ciphetText.aesEncrypt(userID)
			}
			this.wireReqService.getRaaDebitReport(token, raaObj, userID).subscribe((res) => {
				setTimeout(() => {
					this.dataLoad = true;
				}, 400);
				if (res['Head']['ErrorCode'] == 0) {
					this.reportData = res['Body']['RAADet'];
					res['Body']['RAADet'].forEach((element: any) => {
						this.riskDataList.push({
							Loginid: element.Loginid,
							Branch: element.Branch,
							ALB: parseFloat((element.ALB).replace(/,/g, '')),
							SPAN: element.SPAN,
							GHV: parseFloat((element.GHV).replace(/,/g, '')),
							THV: parseFloat((element.THV).replace(/,/g, '')),
							Networth: parseFloat((element.Networth).replace(/,/g, '')),
							Mkrdt: element.Mkrdt,
						})
					});
				}
			})
		}
	}

	nfdcList(token: any, userID: any) {
		let nfdcObj = {
			reportType: this.ndfcReportType,
			requestCode: "NFDCRiskReport",
			Email: "N",
			encrpLogInId:this.ciphetText.aesEncrypt(userID)
		}

		
		if (this.ndfcReportType == 5 || this.ndfcReportType == 6) {

			
			this.wireReqService.getNfdcReport(token, nfdcObj, userID).subscribe((res: any) => {
				setTimeout(() => {
					this.dataLoad = true;
				}, 400);
				if (res['Head']['ErrorCode'] == 0) {
					
					this.reportData = res['Body']['NFDCDet'];
					res['Body']['NFDCDet'].forEach((element: any) => {
						this.riskDataList.push({
							Loginid: element.Loginid,
							LedBalance: parseFloat((element.LedBalance).replace(/,/g, '')),
							Branch: element.Branch,
							BuyVal: parseFloat((element.BuyVal).replace(/,/g, '')),
							GHV: parseFloat((element.GHV).replace(/,/g, '')),
							SpanExp: element.SpanExp,
							THV: parseFloat((element.THV).replace(/,/g, '')),
							NewLB: parseFloat((element.NewLB).replace(/,/g, '')),
							Networth: parseFloat((element.Networth).replace(/,/g, '')),
							Status: element.Status
						})
						this.riskDataList = _.uniqBy(this.riskDataList, 'Loginid');
					});
				}
			})
		}
		else {
			let raaObj = {
				ReportType: this.ndfcReportType,
				encrpLogInId:this.ciphetText.aesEncrypt(userID)
			}
			this.wireReqService.getRaaDebitReport(token, raaObj, userID).subscribe((res) => {
				setTimeout(() => {
					this.dataLoad = true;
				}, 400);
				if (res['Head']['ErrorCode'] == 0) {
					this.reportData = res['Body']['RAADet'];
					res['Body']['RAADet'].forEach((element: any) => {
						this.riskDataList.push({
							Loginid: element.Loginid,
							Branch: element.Branch,
							ALB: parseFloat((element.ALB).replace(/,/g, '')),
							SPAN: element.SPAN,
							GHV: parseFloat((element.GHV).replace(/,/g, '')),
							THV: parseFloat((element.THV).replace(/,/g, '')),
							Networth: parseFloat((element.Networth).replace(/,/g, '')),
							Mkrdt: element.Mkrdt,
						})
					});
				}
			})
		}
	}


	setOrder(value: string) {
		this.reverse = !this.reverse;
		this.order = value;
		if (this.reverse) {
			this.ascending = false;
		} else {
			this.ascending = true;
		}
	}
	
	goBack() {
		window.history.back();
	}
	
	/**
	 * On click of pdf/excel icon
	 */
	onPdfExcelDownload(type: any) {
		this.commonService.setClevertapEvent(`Riskreport_T${this.ndfcReportType}`, { 'PartnerCode': localStorage.getItem('userId1') });
		if (this.reportData && this.reportData.length > 0) {
			this.dataLoad = false;
			let head: any;
			let info: any = []
			switch (this.ndfcReportType) {
				case 5:
				case 6:
					head = [["Client Code ", "Ledger Bal. (Rs)", "Buy Value (Rs)", "SPAN Exposure", "OD Amount (Rs) ", "GHV", "THV", "Net Worth", "Status","Branch","Brokerage","Collval","FAOBill","Gr_MisArea","Gr_MisZone","Intradayamt","JVDebit","Mkrdt","SPAN","TYP","Unclrchq"]]
					this.reportData.forEach((element) => {
						info.push([element.Loginid, element.LedBalance, element.BuyVal, element.SpanExp, element.NewLB, element.GHV, element.THV, element.Networth, element.Status,element.Branch,element.Brokerage,element.Collval,element.FAOBill,element.Gr_MisArea,element.Gr_MisZone,element.Intradayamt,element.JVDebit,moment(element.Mkrdt).format('DD/MM/YYYY'),element.SPAN,element.TYP,element.Unclrchq])
					})
					break;
				case 30:
				case 90:
					head = [["Client Code ", "Branch code", "SPAN", "Adj. Led Bal", "GHV", "THV", "Net Worth","Brokerage","Collval","FAOBill","GHVC", "Intradayamt","JVDebit","Mkrid","Status","Type","Unclrchq","Maker Date"]]
					this.reportData.forEach((element) => {
						info.push([element.Loginid, element.Branch, element.SPAN, element.ALB, element.GHV, element.THV, element.Networth,element.Brokerage,element.Collval,element.FAOBill,element.GHVC,element.Intradayamt,element.JVDebit,element.Mkrid,element.Status,element.Type,element.Unclrchq, moment(element.Mkrdt).format('DD/MM/YYYY')])
					})
					break;
				default:
					break;
			}
			if (type === 'pdf') {
				this.commonService.savePdfFile(head, info);
				this.dataLoad = true;
			} else {
				this.commonService.exportDataToExcel(head[0], info, 'Risk Report');
				this.dataLoad = true;
			}
		} else {
			this.toast.displayToast('No Data Found');
		}
	}

}
