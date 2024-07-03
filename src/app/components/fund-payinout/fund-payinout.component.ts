import { Component, OnInit, Input } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { OrderPipe } from 'ngx-order-pipe';
import { ClientTradesService } from '../../pages/recently-viewed-client-list/client-trades.service';
import { PayDetailsService } from '../../pages/pay-details/pay-details.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { CommonService } from '../../helpers/common.service';

@Component({
	selector: 'app-payin-payout',
	providers: [PayDetailsService],
	templateUrl: './fund-payinout.component.html',
	styleUrls: ['./fund-payinout.component.scss'],
})
export class FundPayinPayoutComponent implements OnInit {
	public filterOption: any = 'client_code';
	@Input() userID: any;
	public selectOption: any = null;
	//public mobilefilterOption: any = 'client_code';
	public order: string = 'quantity';
	public reverse: boolean = false;
	public colorFilterIcon: boolean = false;
	public orderbookFilter: any;
	public ascending: boolean = true;
	public selectedValue: any = 'Select';
	searchTerm: string = '';
	public isRefresh: boolean = true;
	SearchPlaceHolder = "Search by Client Code"
	enableNext:boolean = false;
	wait:boolean = false;
	public fundPayData: any[] = [];
	public selectData: any[] = [
		{ selectOption: 'NSE Cash', selectValue: 'nseCash'}
	];
	changeDate: any;
	fundsPayData: any[] = [];
	fundsPayinOutList: any[] = [];
	tokenValue:any;
	bodyParams:any;
	msgDisplay!:string;
	clientList:any[] = [];
	public isDropDownVisible: boolean = false;
	constructor(private popoverController: PopoverController, private modalController: ModalController, private orderPipe: OrderPipe, private storage: StorageServiceAAA, private clientService: ClientTradesService, private commonService: CommonService, private payDetService: PayDetailsService) { }


	ngOnInit() {
		this.isRefresh = false;
		this.storage.get('userType').then(type => {
			if (type == 'RM' || type == 'FAN') {
				this.storage.get('mappingDetails').then((details) => {
				this.clientList = details;
				});
			}
			else{
				this.storage.get('subBrokermapping').then((details) => {
					this.clientList = details;
				});
			}	

		})
		// this.storage.get('mappingDetails').then((details) => {
		// 	this.clientList = details;
		// });	
		this.msgDisplay = 'Please Enter the Client Code';
			this.bodyParams = 
			{
				"ClientCode": "",
				"FrmDate" : this.commonService.lastMonthDate('previous'),
				"ToDate" : this.commonService.lastMonthDate('current'),
				"PageNo": parseInt("1"),
				"SortBy": "",
				"SortOrder" : "",
				"SearchBy" : "",
				"SearchText" : ""
			}
			this.commonService.setClevertapEvent('Client&Trades_FundPayinPayout');	
	}

	showDropDown() {
		this.isDropDownVisible = true;
		this.searchTerm = '';
	}

	hideDropDown() {
		setTimeout(() => {
			this.isDropDownVisible = false;
		}, 500);
	}
 
	displayClientDetails(data: any){
		this.searchTerm = data['ClientCode'];
		this.bodyParams.ClientCode = this.searchTerm;
		this.bodyParams.PageNo = 1;
		this.fundPayData = [];
		this.initFundinTab();	
	}

	initFundinTab(params?: any){
		if(params != '1'){
			this.isRefresh = true;
		}
		
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.passTokenID(token)
					
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.tokenValue = token;
					this.passTokenID(token)
				})
			}
		})
	}

	passTokenID(token: any){
		this.storage.get('userID').then((userID) => {
			setTimeout(() => {
				// this.storage.get('bToken').then((token) => {
					 this.clientService.getPayinPayout(token, Object.assign({"RMCode": userID}, this.bodyParams)).subscribe((res: any) => {
						//console.log(res['Body']);
						if(res['Body'] == null){
							this.fundsPayinOutList = [];
							setTimeout(() => {
								this.isRefresh = false;
							}, 500);
							this.msgDisplay = 'No Records Found';
						}
						else{
							this.isRefresh = false;
							this.fundsPayinOutList = res['Body']['PIPOData'];
							if(this.fundsPayinOutList.length > 45){
								this.enableNext = true;
								this.wait = false;
							}
							else{
								this.enableNext = false;
								this.wait = true;
							}
							res['Body']['PIPOData'].forEach((element: any,index: any) => {
								this.fundPayData.push({
									ClientCode: element['ClientCode'],
									Date: element['Date'],
									Voucher: element['Voucher'],
									Amount: element['Amount'],
									srNo:index,
									Balance: element['Balance'],
									Particulars: element['Particulars']
								})
							});
						}
					
					})
				// })	
			}, 400);
			
		})
	}

	// convertDate(date) {
	// 	this.changeDate = new Date(date)
	// 	return Date.parse(this.changeDate)
	// }

	loadData(event: any) {
		setTimeout(() => {
			event.target.complete();
			if (this.enableNext) {
				this.bodyParams.PageNo += 1;
				// console.log(this.bodyParams);
				this.initFundinTab("1")
				// this.getData();
				//this.callPayDetailsList('1');
			} else event.target.disabled = true;
		}, 1000);
    }

	splitDate(dateTime: any) {
		return dateTime = dateTime.split(' ')[0];
	}


	dropClick(sr: any, arr: any) {
		arr.forEach((element: any, ind: any) => {
			if (sr !== element.srNo) {
				element['isVisible'] = false;
			} else {
				element['isVisible'] = element['isVisible'] ? false : true;
			}
		});
	}


	// sorting function for column
	setOrder(value: string) {
		// this.reverse = !this.reverse;
		// this.order = value;
		// if (this.reverse) {
		// 	this.ascending = false;
		// } else {
		// 	this.ascending = true;
		// }
		if (this.order === value) {
			this.reverse = !this.reverse;
		}
		this.order = value;
		this.bodyParams.SortBy = value;
		this.bodyParams.PageNo = 1;
		this.bodyParams.SortOrder = this.reverse ? 'asc' : 'desc';
		this.ascending = this.reverse ? true : false;
		this.enableNext = false;
		// console.log(this.bodyParams);
		this.initFundinTab();
		this.fundPayData = [];
	}
	// search By Client Code
	// searchByClientCode(event) {
	// 	console.log(event.length);
	// 	if (event.length > 2) {
	// 			this.bodyParams.ClientCode = event;
	// 			this.initFundinTab()	
	// 		// this.fundsPayinOutList = this.fundsPayinOutList.filter((item) => {
	// 		// 	return item.ClientCode.toLowerCase().includes(event.toLowerCase());
	// 		// });
	// 	}
	// 	else if(event.length < 2){
	// 		this.fundPayData = [];
	// 		this.msgDisplay = 'Please Enter the Client Code';
	// 	}

	// }
	//reset the data 
	resetData() {
		this.isRefresh = true;
		// this.fundsPayinOutList = this.fundsPayData;
		this.searchTerm = '';
		this.reverse = false;
		this.order = "srNo";
		this.fundsPayinOutList.forEach((element, ind) => {
			element['isVisible'] = false;
		});
		this.fundsPayinOutList = this.fundsPayinOutList.sort((a, b) => (a.srNo > b.srNo) ? 1 : -1);
		setTimeout(() => {
			this.isRefresh = false;
		}, 500);
	}

	divScroll(event: any){
		const tableHeight = event.target.offsetHeight;
		const scrollHeight = event.target.scrollHeight,
			scrollerEndPoint = scrollHeight - tableHeight,
			tableScrollTop = event.target.scrollTop;
			if (tableScrollTop >= scrollerEndPoint - 100 && this.enableNext && !this.wait) {
				this.wait = true;
				this.bodyParams.PageNo += 1;
				 this.initFundinTab("1")
			}
		}	




}
