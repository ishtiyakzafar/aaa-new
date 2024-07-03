import { filter } from 'rxjs/operators';
import { Component, ElementRef, OnInit, ViewChild, Output, EventEmitter, Input, OnChanges, SimpleChanges} from '@angular/core';
import { OrderPipe } from 'ngx-order-pipe';
import { ModalController, Platform } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { PayDetailsService } from '../../pages/pay-details/pay-details.service';
import * as _ from 'lodash';
import { FormatNumberDecimalPipe } from '../../helpers/decimalNumber.pipe';
import { ToasterService } from '../../helpers/toaster.service';
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';


@Component({
	selector: 'app-pay-details-equity',
	providers: [FormatNumberDecimalPipe],
	templateUrl: './pay-details-equity.component.html',
	styleUrls: ['./pay-details-equity.component.scss'],
})
export class PayDetailsEquityComponent implements OnInit, OnChanges {
	@ViewChild('detail') detail!: ElementRef;
	@Input() PayoutMonth: any;
	@Input() function: any;
	@Output() passParentDropDown = new EventEmitter<string>();
	@Input() isMobile: any;
	@Input() clientCode: any;
	// @Input() clientID;
	order: string = 'clientName';
	reverse: boolean = false;
	ascending: boolean = true;
	tableOption: any;
	requestCode: any;
	reqBodyParams: any;
	reqType: any;
	headerTitle!: string;
	bodyObj: any;
	enableNext!: boolean;
	public wait!: boolean;
	public dataLoad: boolean = false;
	public loadFile: boolean = false;
	payDetailsEqList: any[] = [];
	tokenValue: any;
	PayoutMonthYear:any;
	placeholderText:string = 'Search by Client Code';
	
	constructor(private orderPipe: OrderPipe, private toast:ToasterService, private formatNumDecimal:FormatNumberDecimalPipe, private platform: Platform, private route: ActivatedRoute, private commonService: CommonService, private storage: StorageServiceAAA, private payDetService: PayDetailsService, private router: Router) { }
	
	ngOnChanges(changes: SimpleChanges): void {
		if(changes['PayoutMonth'] && changes['PayoutMonth'].currentValue == undefined){
			this.payDetailsEqList = [];
			this.enableNext = false;
				setTimeout(() => {
					this.dataLoad = true;
				}, 1000);
			return;
		}
		let type = localStorage.getItem('isMobile');
		this.isMobile = type ? type : this.isMobile;
		this.enableNext = false;
		this.wait = false;
		this.initEquityTab()
	}

	ngOnInit() {
		let type = localStorage.getItem('isMobile');
		this.isMobile = type ? type : this.isMobile;
		if (!this.platform.is('desktop') && this.isMobile) {
			this.initEquityTab()
		}
	}

	initEquityTab(){
		if (!this.platform.is('desktop') && this.isMobile) {
			this.route.params.subscribe(params => {
				if (params && !_.isEmpty(params) ) {
					this.tableOption = params['id'];
					// console.log(this.tableOption);

				} else {
					// this.tableOption = this.tableOption;
				}
			});

			this.route.queryParams
			.subscribe(qparams => {
			  console.log(qparams);  
			  this.clientCode = qparams['cCode'];  
			});
		}
		if(localStorage.getItem('payDetailMonth') == undefined){
			this.PayoutMonthYear = this.commonService.last12Month()[1];
		}
		   else{
			this.PayoutMonthYear = localStorage.getItem('payDetailMonth');
		}
		this.bodyObj = {
			"ClientCode": "",
			"PayoutMonth": this.conversion(this.PayoutMonthYear),
			"PageNo": parseInt("1"),
			"SortBy": "clientcode",
			"SortOrder": "asc",
			"SearchBy": "",
			"SearchText": ""
		}
		this.payDetailsEqList = [];	
		this.requestCode = "CVUpdateLead01";
		this.reqBodyParams = this.bodyObj;
		this.reqType = 'eq';
		this.headerTitle = 'Broking'
		//this.tableOption = 'equity'; 
		this.callPayDetailsList();

		// this.orderPipe.transform(this.datas, 'clientName');
	}

	public conversion(PayoutMonthYear: any){
		let str = PayoutMonthYear.split("-");
		let firstPart = str[0];
		let secondPart = str[1];
		var monthObj: any = {
			January: '01',
			February: '02',
			March: '03',
			April: '04',
			May: '05',
			June: '06',
			July: '07',
			August: '08',
			September: '09',
			October: '10',
			November: '11',
			December: '12'
		};

		return monthObj[firstPart] + '-' + secondPart;
	}
	//call the API commponly for common Tab	
	callPayDetailsList(params?: any) {
		if (params != '1') {
			this.dataLoad = false;
		}
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.passTokenID(token)
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.passTokenID(token)
				})
			}
		})
	}

	passTokenID(token: any) {
		this.storage.get('userID').then((ID) => {
			this.payDetService.getPayoutDetails(token, this.requestCode, Object.assign({"RMCode": this.clientCode}, this.reqBodyParams), this.reqType)
			.subscribe((res: any) => {
				if (res['Body'] == null) {
					this.payDetailsEqList = [];
					this.enableNext = false;
					setTimeout(() => {
						this.dataLoad = true;
					}, 1000);
				}
				else {
					this.commonService.setClevertapEvent('BrokingPayout_downloaded');
					this.checkTabData(res)
				}


			})

		})
	}

	goBack() {
		window.history.back();
	}

	loadData(event: any) {
		setTimeout(() => {
			event.target.complete();
			if (this.enableNext) {
				this.bodyObj.PageNo += 1;
				// this.getData();
				this.callPayDetailsList('1');
			} else event.target.disabled = true;
		}, 1000);
	}

	goToDescription(data: any) {
		localStorage.setItem('payout_details', JSON.stringify(data));
		this.router.navigate(['/pay-list-details', "equity"]);
	}

    goToSearch() {
        //this.router.navigate(['/add-script'])
		this.router.navigate(['/dashboard-clients']);
    }

	checkTabData(response: any) {
		if (response['Body']['GetAAAEquityPayoutData'].length > 49) {
			this.enableNext = true;
			this.wait = false;
		}
		else {
			this.enableNext = false;
			this.wait = true;
		}
		this.payDetailsEqList = [];
		response['Body']['GetAAAEquityPayoutData'].forEach((element: any) => {
			this.payDetailsEqList.push({
				ClientCode: element.ClientCode,
				ClientName: element.ClientName,
				AgentCode: element.AgentCode,
				Payout: element.Payout,
				FanShare: element.FanShare,
				TradingTurnover: element.TradingTurnover,
				CashBrokerage: element.CashBrokerage,
				FNOBrokerage: element.FNOBrokerage,
				TotalGrossBrokerage: element.TotalGrossBrokerage,
				NetBrokerage: element.NetBrokerage,
				NegativeNetworth: element.NegativeNetworth,
				BrokerageReversal: element.BrokerageReversal,
				VASAmount: element.VASAmount,
				FANVASSharingAmount: element.FANVASSharingAmount,
				AfetShare:element.AfetShare,
				AmtPayafterDedRev:element.AmtPayafterDedRev,
			})
		});
		this.enableNext = true;
		this.dataLoad = true;

		setTimeout(() => {
			this.dataLoad = true;
		}, 1000);
	}

	dropClick(index: any, arr: any) {
		arr.forEach((element: any, ind: any) => {
			if ((index) !== ind) {
				element['isVisible'] = false;
			} else {
				element['isVisible'] = element['isVisible'] ? false : true;
			}
		});
		setTimeout(() => {
			const height = this.detail?.nativeElement.offsetHeight;
			// console.log(height);
		}, 0);
	}



	// sorting function for column
	setOrder(value: string) {
		if (this.order === value) {
			this.reverse = !this.reverse;
		}
		this.order = value;
		this.bodyObj.SortBy = value;
		this.bodyObj.PageNo = 1;
		this.bodyObj.SortOrder = this.reverse ? 'asc' : 'desc';
		this.ascending = this.reverse ? true : false;
		this.enableNext = false;
		// console.log(this.bodyObj);
		this.callPayDetailsList();
		this.payDetailsEqList = [];
	}

	// pass the data of search from header component
	EnterSearchText(searchText: any) {
		if (searchText.length > 2) {
			this.bodyObj.SearchBy = "clientcode";
			this.bodyObj.SearchText = searchText;
			// console.log(this.bodyObj);
			this.bodyObj.PageNo = 1;
			this.enableNext = false;
			this.callPayDetailsList();
			this.payDetailsEqList = [];
		}
		else if (searchText.length == 0) {
			this.bodyObj.SearchBy = "";
			this.bodyObj.SearchText = "";
			this.bodyObj.PageNo = 1;
			this.enableNext = true;
			this.callPayDetailsList();
			this.payDetailsEqList = [];
		}
	}


	// pass the selected data from dropdown from header component
	dropDownList(value: any) {
		this.bodyObj.PayoutMonth = value.event;
		this.callPayDetailsList();
		this.passParentDropDown.emit(value.event);
		this.payDetailsEqList = [];
	}

	divScroll(event: any) {
		const tableHeight = event.target.offsetHeight;
		const scrollHeight = event.target.scrollHeight,
			scrollerEndPoint = scrollHeight - tableHeight,
			tableScrollTop = event.target.scrollTop;
		if (tableScrollTop >= scrollerEndPoint - 100 && this.enableNext && !this.wait) {
			this.wait = true;
			this.bodyObj.PageNo += 1;
			this.bodyObj['SearchText'] = this.bodyObj.SearchText;
			this.bodyObj['SearchBy'] = this.bodyObj.SearchBy;
			// console.log(this.bodyObj);
			this.callPayDetailsList('1');
		}
	}
	/**
     * On click of pdf/excel icon
     */
	onPdfExcelDownload() {
		this.loadFile = true;
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.downloadFile(token)
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.downloadFile(token)
				})
			}
		})
	}

	downloadFile(token: any) {
		this.reqBodyParams.PageNo = 0;
		this.payDetService.getPayoutDetails(token, this.requestCode, Object.assign({ "RMCode": this.clientCode }, this.reqBodyParams), this.reqType)
			.subscribe((res: any) => {
				if (res['Body'] == null) {
					this.toast.displayToast('No Data Found');
					this.loadFile = false;
				}
				else {
					if (res['Body'] && res['Body']['GetAAAEquityPayoutData'] && res['Body']['GetAAAEquityPayoutData'].length > 0) {
 						let info: any = [];
						let head = [["Client Code", "Client Name", "Agent Code", "Payout", "Fan Share", "Amount Pay after deduction reversal", "Afet Share", "Negative Networth", "Brokerage Reversal", "VAS Amount", "FANVAS Sharing Amount", "Trading Turnover", "Cash Brokerage", "FNO Brokerage", "Total Gross Brokerage", "Net Brokerage",]];
						res['Body']['GetAAAEquityPayoutData'].forEach((element: any) => {
							info.push([element.ClientCode, element.ClientName, element.AgentCode, this.formatNumDecimal.transform(element.Payout), this.formatNumDecimal.transform(element.FanShare), this.formatNumDecimal.transform(element.AmtPayafterDedRev), this.formatNumDecimal.transform(element.AfetShare), this.formatNumDecimal.transform(element.NegativeNetworth), this.formatNumDecimal.transform(element.BrokerageReversal), this.formatNumDecimal.transform(element.VASAmount), this.formatNumDecimal.transform(element.FANVASSharingAmount), this.formatNumDecimal.transform(element.TradingTurnover), this.formatNumDecimal.transform(element.CashBrokerage), this.formatNumDecimal.transform(element.FNOBrokerage), this.formatNumDecimal.transform(element.TotalGrossBrokerage), this.formatNumDecimal.transform(element.NetBrokerage),])
						})
						this.commonService.exportDataToExcel(head[0], info, 'Broking');
						this.loadFile = false;

					} else {
						this.toast.displayToast('No Data Found');
						this.loadFile = false;
					}
				}
			})
	}

}
