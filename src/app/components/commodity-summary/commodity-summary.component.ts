import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import * as moment from 'moment';
import * as _ from 'lodash';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { CommonService } from '../../helpers/common.service';
import { ToasterService } from '../../helpers/toaster.service';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';

@Component({
	selector: 'app-commo-summary',
	providers: [],
	templateUrl: './commodity-summary.component.html',
	styleUrls: ['./commodity-summary.component.scss'],
})
export class CommoditySummaryComponent implements OnInit {
	@ViewChild('detail') detail!: ElementRef;
	public detailHeight!: number;
	public reverse: boolean = true;
	public order: string = 'ScriptName';
	public ascending: boolean = true;
	public dataLoad = false;
	public rptLoad = false;
	searchValue: any;
	public list: any[] = [];
	public moment: any = moment;
	@Input() riskText: any;
	@Input() bId: any;
	commSummaryData: any
	constructor(private platform: Platform,private storage: StorageServiceAAA, private commonService: CommonService, private toast: ToasterService, private wireReqService: WireRequestService) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		
		//Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
		//Add '${implements OnChanges}' to the class.
		if (this.riskText && this.riskText != "") {
			this.dataLoad = false;
			this.init();
		} else {
			this.toast.displayToast('Please enter valid risk');
			this.dataLoad = true;
		}
	}

	ngOnInit() {
//		this.init();
		this.commSummaryData = this.commonService.getData();
		this.riskText = this.commSummaryData.riskText;
		this.bId = this.commSummaryData.bId;
		if(!this.platform.is('desktop') || this.commSummaryData){
			this.init();
		}
	}

	init() {
		this.storage.get('userID').then((userID) => {
			this.storage.get('userType').then(type => {
				if (type === 'RM' || type === 'FAN') {
					this.storage.get('bToken').then(token => {
						this.getList(token)
					})
				} else {
					this.storage.get('subToken').then(token => {
						this.getList(token)
					})
				}
			})
		});
	}

	dropClick(uniqueID: any, arr: any) {
		arr.forEach((element: any, ind: any) => {
			if (uniqueID !== element.loginid) {
				element['isVisible'] = false;
			} else {
				element['isVisible'] = element['isVisible'] ? false : true;
				if (element['isVisible']) {
					setTimeout(() => {
						this.detailHeight = this.detail.nativeElement.offsetHeight;
					}, 100);
				}
			}
		});
	}

	dropMobileClick(uniqueID: any, arr: any) {
		arr.forEach((element: any, ind: any) => {
			if (uniqueID !== element.loginid) {
				element['isVisible'] = false;
			} else {
				element['isVisible'] = element['isVisible'] ? false : true;
				// if (element['isVisible']) {
				// 	setTimeout(() => {
				// 		this.detailHeight = this.detail.nativeElement.offsetHeight;
				// 	}, 100);
				// }
			}
		});
	}

	styleFunc(isVisible: any, height: any) {
		return isVisible ? '' + (height + 10) + 'px' : '';
	}

	getList(token: any) {
		this.list = [];
		if (this.bId) {
			if (this.riskText) {
				let data = {
					"loginid": localStorage.getItem('userId1'),
					"branch": "All",
					"rightsbranch": this.bId === 'ALL' ? 'All' : this.bId,
					"risk": this.riskText
				}
				this.wireReqService.commoditySummaryList(token, data)
					.subscribe((res: any) => {
						if (res['Head']['ErrorCode'] == 0) {
							if (res['Body'] && res['Body']['CommClientSummaryReport'].length > 0) {
								this.list = res['Body']['CommClientSummaryReport'];
								this.dataLoad = true;
							}
						} else {
							this.toast.displayToast(res['Head']['ErrorDescription']);
							this.dataLoad = true;
						}
					});
			} else {
				this.toast.displayToast('Please enter valid risk');
				this.dataLoad = true;
			}
		} else {
			this.toast.displayToast('Kindly select Branch');
			this.dataLoad = true;
		}
	}

	
	goBack() {
		window.history.back();
	}

	/**
	* On click of excel icon
	*/
	onExcelDownload() {
		if (this.list && this.list.length > 0) {
			this.dataLoad = false;
			let info: any = [];
			let head = [["Client Code", "Group Code", "ALB", "MTMPL", "Today Span", "PRESPAN", "RISKPERCENT", "Unclear chq", "R.Risk%", "PendingCMS", "SpotHolding", "SpotUndelivered", "Networth", "ClearCHq", "Bremark", "Networth1", "Equity Networth", "Tender Margin", "Clear Amt", "UnClear Amt"]];
			this.list.forEach((element: any) => {
				info.push([element.loginid, element.cm_groupcd, element.ALB, element.Mtmpl, element.todayspan, element.prespan, element.riskpercent, element.UncleaerChqe, element.r_risk, element.PendingCMS, element.SpotHolding, element.SpotUndelivered, element.Networth, element.Clear_Chq, element.Bremark, element.Networth1, element.Equity_Networth, element.tndMargin, element.clr_amt, element.unclr_amt]);
			})
			this.commonService.exportDataToExcel(head[0], info, 'Commodity Client Summary Report');
			this.dataLoad = true;
		} else {
			this.toast.displayToast('No Data Found');
		}
	}
}