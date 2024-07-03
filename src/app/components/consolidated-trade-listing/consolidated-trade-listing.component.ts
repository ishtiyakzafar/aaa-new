import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import moment from 'moment';
import { Platform } from '@ionic/angular';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { ToasterService } from '../../helpers/toaster.service';
import { CommonService } from '../../helpers/common.service';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';

@Component({
  selector: 'app-consolidated-trade-listing',
  templateUrl: './consolidated-trade-listing.component.html',
  styleUrls: ['./consolidated-trade-listing.component.scss'],
})
export class ConsolidatedTradeListingComponent implements OnInit,OnChanges {

  @Input() segment: any;
  @Input() asOnDate: any;
  datas: any=[];
  dataLoad = false;
  moment: any= moment;
  excelDownlod = false;
  userTypeValue:any;
  searchValue: any;
  clonedArr: any[] = [];
  apiDataMobile: any = {};

  constructor(private storage: StorageServiceAAA,private toast:ToasterService,private commonService: CommonService,private wireReqService: WireRequestService,
	private platform: Platform) { }

  ngOnInit() { 

	this.apiDataMobile = this.commonService.getData();
	if (!this.platform.is('desktop') || (this.apiDataMobile.reportType && this.apiDataMobile.asOnDate)) {
			
		this.segment = this.apiDataMobile.reportType;
		this.asOnDate = this.apiDataMobile.asOnDate;
		this.initTradeListing();
	}
  }

  ngOnChanges(changes: SimpleChanges): void {
	this.datas = [];
	this.clonedArr = [];
	this.initTradeListing();
  }

  initTradeListing(){
	this.storage.get('userType').then(type => {
		this.userTypeValue = type;
		if (type === 'RM' || type === 'FAN') {
			this.storage.get('bToken').then(token => {
				this.getTradingReport(token,this.segment,moment(this.asOnDate).format('YYYYMMDD'));
			})
		} else {
			this.storage.get('subToken').then(token => {
				this.getTradingReport(token,this.segment,moment(this.asOnDate).format('YYYYMMDD'));
			})
		}
	})
  }

  public searchText(txt: any) {
	if (txt) {
		this.searchValue = txt.trim();
		this.datas = this.clonedArr.filter((item) => {
			return item.ClientCode.toLowerCase().includes(this.searchValue.toLowerCase());
		});
	}
	else {
	  this.datas = this.clonedArr;
	}
  }

  getTradingReport(token: any,segment: any,date: any){
	this.dataLoad = true;
	this.wireReqService.getConsolidatedTradingReport(token, segment, date).subscribe((res: any) => {
						if (res['Head']['ErrorCode'] == 0) {
							if (res && res['Body'].length > 0) {
								this.datas = res['Body'];
								this.clonedArr = this.datas;
								this.dataLoad = false;
							}
						} else {
							this.toast.displayToast(res['Head']['ErrorDescription']);
							this.dataLoad = false;
						}
	});
  }

  onExcelDownload() {
		this.commonService.setClevertapEvent('Summaries_consolidatedtradelisitng', { 'Login ID': localStorage.getItem('userId1') });
		if (this.datas && this.datas.length > 0) {
			let info: any = [];
			let head = [["ClientCd", "Symbol", "td_date", "Buy Qty", "Buy Rate", "Sell Qty","Sell Rate", "RM Code", "RM Name", "RM Branch", "Trade Type"]];
			this.datas.forEach((element: any) => {
				info.push([element.ClientCode, element.Symbol, element.AsOnDate, element.BuyQty, element.BuyRate, element.SellQty,element.SellRate, element.RMCode, element.RMName, element.RMBranch, element.TradeType]);
			})
			
			this.commonService.exportDataToExcel(head[0], info, 'Consolidated Trade Listing');
		} else {
			this.toast.displayToast('No Data Found');
		}
	}

  goBack() {
		window.history.back();
	}

}
