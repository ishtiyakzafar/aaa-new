import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { ToasterService } from '../../helpers/toaster.service';
import { CommonService } from '../../helpers/common.service';

@Component({
  selector: 'app-real-time-margin-shortfall',
  templateUrl: './real-time-margin-shortfall.component.html',
  styleUrls: ['./real-time-margin-shortfall.component.scss'],
})
export class RealTimeMarginShortfallComponent implements OnInit {
    @Input() partnerID: any;
    public realTimeMarginShortfall: any[] = [];
    totalValue: any;
    pledgedValue: any;
    gHVPledgedValue: any
    dataLoad: boolean = false;
    reportData: any;
	allReportData: any;
  	negativeMarginReport = false;
	tabValue = 'rtms';
	tabButton: any[] = [
        { Name: 'Real Time Margin Shortfall', Value: 'rtms', active: 1 },
        { Name: 'Negative Margin Report', Value: 'nmr', active: 0 }
    ];
    public order!: string;
    reverse: boolean = false;
    public ascending!: boolean;
	public datas: any[] = [];
    public wait = false;
	searchValue: any;
	excelDownlod = false;
	public val: string = 'asc';

  constructor(private wireReqService: WireRequestService, private storage: StorageServiceAAA, public toast: ToasterService, private commonService: CommonService) { }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
	if(this.partnerID){
		this.getData();
	}
	else{
		this.toast.displayToast('Kindly select Partner Code');
	}
  }

  getData(){
		this.dataLoad = false;
		this.storage.get('userID').then((userID) => {
			this.storage.get('userType').then(type => {
				if (type === 'RM' || type === 'FAN') {
					this.storage.get('bToken').then(token => {
						this.shareRealTimeMarginShortFallData(token, userID)
					})
				} else {
					this.storage.get('subToken').then(token => {
						this.shareRealTimeMarginShortFallData(token, userID)
					})
				}
			})
		})
	}
  
	shareRealTimeMarginShortFallData(token: any, userID: any) {
		this.order = this.tabValue === 'nmr' ? 'AvailableMargin' : 'MarginAvailableforReporting';
		this.negativeMarginReport = this.tabValue === 'nmr' ? true : false;
 		this.reverse = this.tabValue === 'nmr' ? false:true;
		this.ascending = this.tabValue === 'nmr' ? true:false;
 		this.wireReqService.getRealTimeMarginShortfall(token, this.partnerID ? this.partnerID : '', this.negativeMarginReport).subscribe((res) => {
			this.wait = false;
			this.datas = [];
			if (res['Head']['ErrorCode'] == 0) {
				if (this.negativeMarginReport) {
					this.reportData = res['Body'];
					this.allReportData = this.reportData;
					this.reportData.forEach((element: any) => {
						this.datas.push({
							ClientCode: element['ClientCode'] ? element['ClientCode'] : '-',
							GroupCode: element['GroupCode'],
							MarginUtilization: +element['MarginUtilization'],
							Shortfall: +element['Shortfall'],
							AvailableMargin: +element['AvailableMargin']
						})
					});
				} else {
					this.reportData = res['Body'];
					this.allReportData = this.reportData;
					this.reportData.forEach((element: any) => {
						this.datas.push({
							Clientcode: element['Clientcode'] ? element['Clientcode'] : '-',
							WireCode:element['WireCode'],
							AvailableMargin: +element['AvailableMargin'],
							MarginAvailableforReporting: +element['MarginAvailableforReporting'],
							PeakMarginRequirement: +element['PeakMarginRequirement'],
							ActualMarginUtilization: +element['ActualMarginUtilization']
						})
					});
				}
				setTimeout(() => {
					this.dataLoad = true
				}, 400);
			}
			else {
				this.toast.displayToast(res['Head']['ErrorDescription']);
				setTimeout(() => {
					this.realTimeMarginShortfall = [];
					this.reportData = [];
					this.dataLoad = true
				}, 400);
			}
		})
	}

	goBack() {
		window.history.back();
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

  divScroll(event: any) {
		const tableHeight = event.target.offsetHeight;
		const scrollHeight = event.target.scrollHeight,
			scrollerEndPoint = scrollHeight - tableHeight,
			tableScrollTop = event.target.scrollTop;
  }

	searchInList(ev: any) {
		if (ev && ev.target && ev.target.value) {
			const text = ev.target.value.toLowerCase().trim().replace(/\s\s+/g, ' ');
			if (this.tabValue === 'nmr') {
				this.datas = this.allReportData.filter((c: any) => (c?.ClientCode?.toLowerCase().trim().indexOf(text) > -1) || (c?.GroupCode?.toLowerCase().trim().indexOf(text) > -1));
			} else {
				this.datas = this.allReportData.filter((c: any) => (c?.Clientcode?.toLowerCase().trim().indexOf(text) > -1) || (c?.WireCode?.toLowerCase().trim().indexOf(text) > -1));
			}
			this.dataLoad = true;
		} else {
			//this.reportData = []
			this.datas = this.allReportData;
		}
	}
 
	onExcelDownload() {
		this.commonService.setClevertapEvent('Summaries_realtimemarginshortfall', { 'Login ID': localStorage.getItem('userId1') });
		//this.commonService.setClevertapEvent('SharesDepositReport', { 'PartnerCode': localStorage.getItem('userId1') });
		if (this.reportData && this.reportData.length > 0) {
			this.dataLoad = false;
			let info: any = [];
			let head:any = [];
			let fileTitle = '';
			if (this.tabValue === 'rtms') {
				head = [["ActualMarginUtilization", "Actualscripvalue", "AdjustmentTotalReqMargin", "AvailableMargin", "BG", "Clientcode", " Group Code", "ClientCategory", "FD", "Fundpayoutduringtheday", "Ledgerbal", "MISZone", "MarginAvailableforReporting", "PeakMarginMaxvalue", "PeakMarginRequirement", "ScripValue", "Snapshotfileno", "TotalShortfall", "unclchq"]];
				this.reportData.forEach((element: any) => {
					info.push([element.ActualMarginUtilization, element.Actualscripvalue, element.AdjustmentTotalReqMargin, element.AvailableMargin, element.BG, element.Clientcode, element.WireCode, element.ClientCategory, element.FD, element.Fundpayoutduringtheday, element.Ledgerbal, element.MISZone, element.MarginAvailableforReporting, element.PeakMarginMaxvalue, element.PeakMarginRequirement, element.ScripValue, element.Snapshotfileno, element.TotalShortfall, element.unclchq]);
				});
				fileTitle = 'Real time Margin Shortfall';
			} else {
				head = [["Client Code", "Group Code", "Actual Margin Utilization", "Margin Shortfall", "Available Margin"]];
				this.reportData.forEach((element: any) => {
					info.push([element.ClientCode, element.GroupCode, element.MarginUtilization, element.Shortfall, element.AvailableMargin]);
				})
				fileTitle = 'Negative Margin Report';
			}
			this.commonService.exportDataToExcel(head[0], info, fileTitle);
			this.dataLoad = true;
		} else {
			this.toast.displayToast('No Data Found');
		}
	}

	tabChanged(){
 		this.reportData = [];
		this.searchValue = null;
		this.getData();
	}
}