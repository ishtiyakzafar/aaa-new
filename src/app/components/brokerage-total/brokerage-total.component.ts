import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DetailsComponent } from '../details/details.component';
import { Subscription } from 'rxjs';
import { OrderPipe } from 'ngx-order-pipe';
import { DashBoardService } from '../../pages/dashboard/dashboard.service';
import moment from 'moment';
import { DaterangepickerDirective, NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { ToasterService } from '../../helpers/toaster.service';

@Component({
	selector: 'app-brokerage-total',
	providers: [DashBoardService],
	templateUrl: './brokerage-total.component.html',
	styleUrls: ['./brokerage-total.component.scss'],
})
export class BrokerageTotalComponent implements OnInit {
	@ViewChild(DaterangepickerDirective, { static: true }) picker!: DaterangepickerDirective;
	@Input() searchText: any;
	@Input() searchType: any;
	@Input() cliCode: any;
	@Input() fromDate: any;
	@Input() toDate: any;
	@Input() isApply: any;
	excelDownlod = false;
	public ascending: boolean = true;
	public clientCode: any;
	private subscription: any;
	public userID : any;
	public totalClients : any;
	public totalAUMValue : any;
	public brokerageListData = [];
	public totalBrokerageData = [];
	public searchTerm : any;
	public dataLoad = true;
	public cashTotal = 0;
	public futureTotal = 0;
	public optionTotal = 0;
	public currencyTotal = 0;
	public commodityTotal = 0;
	public brokerageTotal = 0;
	radioType = 'amc1';
	customSt: any;
	customEnd: any;
	currentMonthStart: any;
	prevMonthFirstDate: any;
	prevMonthLastDate: any;
	clientDetails: any;
	maxDate: any;
	public val: string = 'asc';

	order: string = 'clientName';
	reverse: boolean = false;
	rptLoad = false;
	reportData: any;
	resetData: any[] = [];
	public datas: any[] = [
		{ clientId: 'PC1234567', date: '11/22/2021', cash: '4519.25', future: '0.00', options: '0.00', currency: '0.00', commodity: '0.00', total: '4519.25' },
		{ clientId: 'PC1234567', date: '11/22/2021', cash: '4519.25', future: '0.00', options: '0.00', currency: '0.00', commodity: '0.00', total: '4519.25' },
		{ clientId: 'PC1234567', date: '11/22/2021', cash: '4519.25', future: '0.00', options: '0.00', currency: '0.00', commodity: '0.00', total: '4519.25' },
		{ clientId: 'PC1234567', date: '11/22/2021', cash: '4519.25', future: '0.00', options: '0.00', currency: '0.00', commodity: '0.00', total: '4519.25' },
		{ clientId: 'PC1234567', date: '11/22/2021', cash: '4519.25', future: '0.00', options: '0.00', currency: '0.00', commodity: '0.00', total: '4519.25' }
	];

	filterObj: any = {
		PageNo: 1,
		SortBy: 'clientcode',
		SortOrder: 'asc',
		SearchBy: null,
		SearchText: null
	}

	constructor(private modalController: ModalController,private commonService: CommonService, private storage: StorageServiceAAA, private dashBoardService: DashBoardService, public toast: ToasterService) { }

	ngOnChanges() {
		this.storage.get('empCode').then(code => {
			this.clientCode = code;
		})
		if (this.searchText != null) {
			this.changeSearchText(this.searchText);
		}
		if(this.isApply){
			this.getData();
		}
		//this.changeSearchType(this.searchType)
	}

	ngAfterContentChecked(): void {
		let getVarChange = localStorage.getItem('isValChange');
		if(getVarChange == 'true'){
			localStorage.setItem('isValChange','false');
		this.storage.get('empCode').then(code => {
			let fromDateChange = localStorage.getItem('fromDateChange');
			let toDateChange = localStorage.getItem('toDateChange');
			if(code == null){
				this.clientCode = localStorage.getItem('userId1');
			}
			else{
				this.clientCode = code;
			}
			this.dataLoad = false;
			if (this.clientCode) {
				this.getDataFromStorage(this.clientCode,fromDateChange,toDateChange);
			}
		})
		}
	}

	ngOnInit() {
		this.datas = [];
		//this.searchText = ''
		this.maxDate = moment(new Date());
		this.clientDetails = JSON.parse(localStorage.getItem('select_client') || "{}");
		// this.selectedReportType = this.reportTypeData[0]['value'];
		this.subscription = new Subscription();

		this.storage.get('userID').then((userID) => {
			this.userID = userID;
			/* this.storage.get('userType').then(type => {
				if (type === 'RM' || type === 'FAN') {
					this.storage.get('bToken').then(token => {
					   this.initClientDormat(token, userID)
					})
				} else {
					this.storage.get('subToken').then(token => {
						this.initClientDormat(token, userID)
					})
				}
			}) */
		})
		this.getData();

		/* this.storage.get('userID').then((userID) => {
			this.storage.get('userType').then(type => {
				if (type === 'RM' || type === 'FAN') {
					this.storage.get('bToken').then(token => {
						this.initBrokTable(token, userID)
					})
				} else {
					this.storage.get('subToken').then(token => {
						this.initBrokTable(token, userID)
					})
				}
			})
		}) */
	}

	getData() {
		this.storage.get('empCode').then(code => {
			let fromDateChange = this.commonService.currentMonthFirstDate();
			let toDateChange = moment(new Date()).format('YYYYMMDD');
			if (code == null) {
				this.clientCode = localStorage.getItem('userId1');
			}
			else {
				this.clientCode = code;
			}
			this.dataLoad = false;
			if (this.clientCode) {
				this.getDataFromStorage(this.clientCode, fromDateChange, toDateChange);
			}
		})
	}

	public getDataFromStorage(userID: any,fromDateChange?: any,toDateChange?: any) {
		this.dataLoad = false;
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.initBrokTable(token, userID,fromDateChange,toDateChange)
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.initBrokTable(token, userID,fromDateChange,toDateChange)
				})
			}
		})
	}


	changeSearchText(event: any) {
		this.datas = this.resetData
		if (this.searchType == 'clientCode') {
			this.datas = this.datas.filter((item) => {
				return item.ClientCode.toLowerCase().includes(event.toLowerCase());
			});
 		}
		// else{
		// 	this.datas = this.datas.filter((item) => {
		// 		return item.ClientName.toLowerCase().includes(event.toLowerCase());
		// 	  });
		// }

		// console.log(event);
	}

	dateChange(ev: any) {
		if (ev && ev.startDate != undefined || ev.startDate != null || ev.endDate != undefined || ev.endDate != null) {
			this.customSt = this.commonService.getToday(new Date(ev.startDate));
			this.customEnd = this.commonService.getToday(new Date(ev.endDate));
		}
	}

	onItemChange(val: any) {
		// this.showError = undefined;
		this.radioType = val;
	}

	initBrokTable(token: any, userId: any,fromDateChange?: any,toDateChange?: any) {
		this.dataLoad = false;
		//this.datas = [];
		this.cashTotal = 0;
		this.futureTotal = 0;
		this.optionTotal = 0;
		this.currencyTotal = 0;
		this.commodityTotal = 0;
		this.brokerageTotal = 0;
		this.subscription.add(this.dashBoardService
			.getBrokMtdEquity(token, userId ? userId : this.userID,this.fromDate,this.toDate)
			.subscribe((res: any) => {
				this.dataLoad = true;
				if (res['Head']['ErrorCode'] == 0) {
					this.datas = [];
					
					//this.datas = res['Body']['AAAClientNotTradedData'];
					res['Body']['PerformanceReport'].forEach((element: any) => {
						this.datas.push({
							ClientCode: element.ClientCode,
							Date: moment(element.Date).format('DD/MM/YYYY'),
							WireCode: element.PartnerWireCode,
							Cash: element.Cash,
							Futures: element.Futures,
							Options: element.Options,
							Currency: element.Currency,
							Commodity: element.Commodity,
							TotalBrokerage: element.TotalBrokerage
						})
					})
					this.resetData = this.datas;
					for (let i=0;i<this.datas.length;i++){
						this.cashTotal += parseFloat(this.datas[i]['Cash']); 
						this.futureTotal += parseFloat(this.datas[i]['Futures']); 
						this.optionTotal += parseFloat(this.datas[i]['Options']); 
						this.currencyTotal += parseFloat(this.datas[i]['Currency']); 
						this.commodityTotal += parseFloat(this.datas[i]['Commodity']); 
						this.brokerageTotal += parseFloat(this.datas[i]['TotalBrokerage']); 
				}
				}
				else{
					this.datas = [];
				}

			}))

	}


	// detail popup
	async details(dataObj: any) {
		const datas = [
			{ type: 'Client ID', value: dataObj['ClientCode'] },
			{ type: 'Date', value: dataObj['Date']},
			{ type: 'Wire Code', value: dataObj['PartnerWireCode']},
			{ type: 'Cash', value: dataObj['Cash'] },
			{ type: 'Future', value: dataObj['Futures'] },
			{ type: 'Options', value: dataObj['Options'] },
			{ type: 'Currency', value: dataObj['Currency'] },
			{ type: 'Commodity', value: dataObj['Commodity'] },
			{ type: 'Total Brokerage (₹)', value: dataObj['TotalBrokerage'] }
		]
		const modal = await this.modalController.create({
			component: DetailsComponent,
			componentProps: { datas: datas },
			cssClass: 'brokerage-total superstars details-modal'
		});
		return await modal.present();
	}

	// sorting function for column
	// setOrder(value: string) {
	// 	this.dataLoad = false;
	// 	if (this.order === value) {
	// 		this.reverse = !this.reverse;
	// 	}
	// 	this.order = value;

	// 	this.datas = [];
	// 	this.filterObj.PageNo = 1;
	// 	this.filterObj.SortBy = value;
	// 	this.filterObj.SortOrder = this.reverse ? 'asc' : 'desc';
	// 	if (this.reverse) {
	// 		this.ascending = true;
	// 	} else {
	// 		this.ascending = false;
	// 	}
	// }

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

	ngOnDestroy() {
		this.subscription = this.subscription.unsubscribe();
	}

	/**
	 * To download Detailed report.
	 */
	onExcelDownloadClick() {
		this.rptLoad = true;
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.getReport(token)
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.getReport(token)
				})
			}
		})
	}

	getReport(token: any) {
		let code = this.cliCode ? this.cliCode : localStorage.getItem('userId1');
		this.subscription.add(this.dashBoardService
			.getBrokMtdEquity(token, code, this.fromDate, this.toDate)
			.subscribe((res: any) => {
				if (res['Head']['ErrorCode'] == 0) {
					if (res['Body'] && res['Body']['PerformanceReport'] && res['Body']['PerformanceReport'].length > 0) {
						let info: any = [];
						let head = [["Client Code", "WireCode", "Date", "Cash", "Commodity", "Currency", "Futures", "Options", "Total Brokerage"]];
						res['Body']['PerformanceReport'].forEach((element: any) => {
							info.push([element.ClientCode, element.PartnerWireCode, moment(element.Date).format('DD/MM/YYYY'), element.Cash, element.Commodity, element.Currency, element.Futures, element.Options, element.TotalBrokerage]);
						});
						this.commonService.exportDataToExcel(head[0], info, 'Performance Report - Detailed');
						this.rptLoad = false;
					} else {
						this.toast.displayToast('No Data Found');
						this.rptLoad = false;
					}
				}
				else {
					this.toast.displayToast(res['Head']['ErrorDescription']);
					this.rptLoad = false;
				}
			}))
	}
}
