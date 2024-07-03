import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { ToasterService } from '../../helpers/toaster.service';
import { CommonService } from '../../helpers/common.service';

@Component({
	selector: 'app-share-deposit-report',
	providers: [WireRequestService],
	templateUrl: './share-deposit-report.component.html',
	styleUrls: ['./share-deposit-report.component.scss'],
})
export class ShareDepositReportComponent implements OnInit {
	@Input() partnerID: any;
	public shareDepositList: any[] = [];
	totalValue: any;
	pledgedValue: any;
	gHVPledgedValue: any
	dataLoad: boolean = false;
	reportData: any;
	// public shareDepositList: any[] = [
	//   { title: 'EICHERMOT', description: 'ISIN: INE066A0121 | Category: E', Qty: '2345', LTP: '8000', Amount: '505', Haircut:'15', Pledge:'P', AdjValue:'4905782.92' },
	//   { title: 'EICHERMOT', description: 'ISIN: INE066A0121 | Category: E', Qty: '2345', LTP: '8000', Amount: '505', Haircut:'15', Pledge:'P', AdjValue:'4905782.92' },
	//   { title: 'EICHERMOT', description: 'ISIN: INE066A0121 | Category: E', Qty: '2345', LTP: '8000', Amount: '505', Haircut:'15', Pledge:'P', AdjValue:'4905782.92' },
	//   { title: 'EICHERMOT', description: 'ISIN: INE066A0121 | Category: E', Qty: '2345', LTP: '8000', Amount: '505', Haircut:'15', Pledge:'P', AdjValue:'4905782.92' },
	// ];

	constructor(private wireReqService: WireRequestService, private storage: StorageServiceAAA, public toast: ToasterService, private commonService: CommonService) { }

	ngOnChanges(changes: SimpleChanges): void {
		//Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
		//Add '${implements OnChanges}' to the class.
		this.getData();
	}

	ngOnInit() {	
	}

	getData(){
		this.dataLoad = false;
		this.storage.get('userID').then((userID) => {
			this.storage.get('userType').then(type => {
				if (type === 'RM' || type === 'FAN') {
					this.storage.get('bToken').then(token => {
						this.shareDepositData(token, userID)
					})
				} else {
					this.storage.get('subToken').then(token => {
						this.shareDepositData(token, userID)
					})
				}
			})
		})
	}

	// coming soon popup when click donwload option
	comingOption(event: any) {
		this.commonService.comingSoon(event, 'Coming Soon', 'coming')
	}

	shareDepositData(token: any, userID: any) {
		this.reportData = [];
		this.totalValue = [];
		this.pledgedValue = [];
		this.gHVPledgedValue = [];
		this.shareDepositList = [];
		this.commonService.setClevertapEvent('Partner_Share_Deposit_Details');
		this.commonService.analyticEvent('Partner_Share_Deposit_Details', 'Wire Reports');
		this.wireReqService.getShareDepositRecord(token, this.partnerID ? this.partnerID : userID).subscribe((res: any) => {
			if (res['Head']['ErrorCode'] == 0) {
				this.dataLoad = true
				this.reportData = res['Body'];
				this.totalValue = res['Body']['TotalValue'];
				this.pledgedValue = res['Body']['PledgedValue'];
				this.gHVPledgedValue = res['Body']['GHVPledgedValue'];
				this.shareDepositList = res['Body']['ScripDetails'];
				// setTimeout(() => {
				// 	// this.dataLoad = true
				// }, 400);
			}
			else {
				this.dataLoad = true
				this.toast.displayToast(res['Head']['ErrorDescription']);
				setTimeout(() => {
					this.shareDepositList = [];
					this.reportData = [];
					// this.dataLoad = true
				}, 400);
			}
		})
	}

	goBack() {
		window.history.back();
	}

	/**
	 * On click of pdf/excel icon
	 */
	onPdfExcelDownload(type: any) {
		this.commonService.setClevertapEvent('SharesDepositReport', { 'PartnerCode': localStorage.getItem('userId1') });
		if (this.reportData && this.reportData.ScripDetails.length > 0) {
			this.dataLoad = false;
			let topSectionRow = [];
			let topSectionHead = [["Partner Name", "Total Value", "Pledged Value", "GHV Pledged Value"]];
			topSectionRow.push([this.reportData.PartnerName, this.reportData.TotalValue, this.reportData.PledgedValue, this.reportData.GHVPledgedValue])
			let extra = { topSectionHead, topSectionRow };
			let info: any = [];
			let head = [["Scrip Name", "Qty", "Pledge", "ISIN", "Haircut (pct.)", "LTP", "Category", "Amount", "Adj.Value"]];
			this.reportData.ScripDetails.forEach((element: any) => {
				info.push([element.ScripName, element.Quantity, element.Pledge, element.ISIN, element.Haircut, element.ClosingPrice, element.Category, element.Amount, element.AdjustedValue])
			})
			if (type === 'pdf') {
				this.commonService.savePdfFile(head, info, extra);
				this.dataLoad = true;
			} else {
				this.commonService.exportDataToExcel(head[0], info, 'Shares Deposit Report', extra);
				this.dataLoad = true;
			}
		} else {
			this.toast.displayToast('No Data Found');
		}
	}

}
