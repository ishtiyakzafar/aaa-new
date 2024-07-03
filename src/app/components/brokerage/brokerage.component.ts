import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart } from 'chart.js';
import { Subscription } from 'rxjs';
import { BrokerageService } from './brokerage.service';
import { FilterPopupComponent } from '../filter-popup/filter-popup.component';
import { PopoverController, Platform } from '@ionic/angular';
import { Subject } from 'rxjs';
import moment from 'moment';
// import { DashBoardRevampService } from '../../pages/dashboard-revamp/dashboard-revamp.service';
import { DaterangepickerDirective, NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { debounceTime, switchMap } from 'rxjs/operators';
import { MarketService } from '../../pages/markets/markets.service';
import { DashBoardService } from '../../pages/dashboard/dashboard.service';
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import dayjs from 'dayjs/esm';

@Component({
	selector: 'app-brokerage',
	providers: [BrokerageService, MarketService, DashBoardService],
	templateUrl: './brokerage.component.html',
	styleUrls: ['./brokerage.component.scss'],
})
export class BrokerageComponent implements OnInit {
	@ViewChild(DaterangepickerDirective, { static: false }) pickerDirective!: DaterangepickerDirective;
	@Input() brokerageTabData: any;
	@Input() chartData: any;
	@ViewChild('dognutChart') dognutChart: any;
	//sendObjParams: Subject<any> = new Subject();
	public placeholderInput: string = 'Type Client Code';
	start:any;
	end:any;
	isApply: boolean = false;
	public dueAmount: any = 0;
	public dueDate: any = null;
	public clientCode: any = null;
	public searchTerm: any = null;
	public equityBlockTabValue: any = localStorage.getItem('DashTabSelect') == 'Mutual Funds' ? 'mutual' : localStorage.getItem('DashTabSelect') == 'Equity' ? 'equity' : localStorage.getItem('DashTabSelect') == 'Cross-Sell' ? 'others' : 'equity';
	public dognut: any;
	NgxDaterangepickerMd! : NgxDaterangepickerMd;
	public moment: any = moment;
	public passObjVar: any;
	maxDate = dayjs();
  	minDate = dayjs('1973-01-01');
	searchHierarchyList : any;
	selectOptionArrCopy: any[] = [];
	public placeholderInputHierarchy: string = 'Search...';
	isShowCross = false;
	public selectedDate = {start: moment().startOf('month'), end: moment().endOf('month')};
	ranges: any = {
		'This Month': [moment().startOf('month'), moment().endOf('month')],
		'Previous Month': [
			moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')
		  ]
	}
	cancelBtn:boolean = true;
	public fromDateChange: any;
	public toDateChange: any;
	public isValChange = 'false';
	public equityBlock: any[] = [
		// { name: 'Equity', value: 'equity', changeValue: '(45.33%)', ytd: '45.00 L.', inception: '159 Cr.', icon: 'equity-circle-icon.svg', page: 'brokerage-equity'},
		// { name: 'Mutual Fund', value: 'mutual', changeValue: '(35.33%)', ytd: '45.00 L.', inception: '159 Cr.', icon: 'red-circle-icon.svg', page: 'brokerage-mutual-fund'},
		// { name: 'Others', value: 'others', changeValue: '(19.34%)', ytd: '45.00 L.', inception: '159 Cr.', icon: 'other-circle-icon.svg', page: 'brokerage-others'},
	];
	public clientBlockSegmentValue: string = "clientCode";
	public segmentButtonOption: any[] = [
		{ name: 'Client Code', value: 'clientCode' },
		{ name: 'Name', value: 'clientName' }
	]
	public segmentButtonOption1: any[] = [
		{ name: 'Client Code', value: 'clientCode' }
	]
	public cardSegments: any[] = [
		// { name: 'Equity (YTD)', segmentValue: 'equity', dataValue: '94.54 K' },
		// { name: 'Mutual Funds (YTD)', segmentValue: 'mutual', dataValue: '94.54 K' },
		// { name: 'Others (YTD)', segmentValue: 'others', dataValue: '94.54 K' },

	]
	// toggleStatus: boolean = true; // Toggle default value
	public toggleStatus: string = 'Summarised';
	public selectOptionArr: any[] = [
		// { checkboxValue: 'value1', isChecked: true, name: 'R. Balaji', type: 'Individual' },
		// {
		// 	checkboxValue: 'value2', isChecked: true, name: 'Prashanjeet Chakravarty', type: 'All Accounts',
		// 	innerDetail: [
		// 		{ checkboxValue: 'innerValue1', isChecked: true, name: 'Vaibhav Gupta', type: 'All Accounts', },
		// 		{ checkboxValue: 'innerValue2', isChecked: true, name: 'Shruti Nazare', type: 'All Accounts' },
		// 		{ checkboxValue: 'innerValue3', isChecked: true, name: 'Rahul Hole', type: 'All Accounts' },
		// 	]
		// },
		// {
		// 	checkboxValue: 'value3', isChecked: true, name: 'R. Balaji', type: 'All Accounts',
		// 	innerDetail: [
		// 		{ checkboxValue: 'innerValue4', isChecked: true, name: 'Abhinav Gupta', type: 'All Accounts' },
		// 		{ checkboxValue: 'innerValue5', isChecked: true, name: 'Animesh Nazare', type: 'All Accounts' },
		// 		{ checkboxValue: 'innerValue6', isChecked: true, name: 'Nimish Hole', type: 'All Accounts' },
		// 	]
		// },
		// { checkboxValue: 'value4', isChecked: true, name: 'R. Balaji', type: 'All Accounts' },
		// { checkboxValue: 'value5', isChecked: true, name: 'R. Balaji', type: 'All Accounts' },
	];
	public isDropDownVisible: boolean = false;
	public showChart = false;
	clearHeaderDetails: any;
	displayHeader: any[] = [];
	sendDataToChild: boolean = false;
	graphData: any[] = [];
	graphXAxis: any[] = [];
	graphBar: any[] = [];
	tokenValue: any;
	userIdValue: any;
	displayBarChart:boolean = false;


	hightestLabel: any = null;
	clientName: any = null;
	userID: any = null;
	partnerBrokerageValue: any = null;
	brokEqMtd:any = 0;
	brokEqInception:any = 0;
	noRecord:boolean=false;
	public dataAsOn:any = null;
	private subscription: any;
	private searchRmhierarchyTerms = new Subject<string>();
	loader:boolean = false;
	public isShow: boolean = false;
	public isDiv: boolean = false;
	barChartOptions: any = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
				position: 'bottom'
			}
		},
		scales: {
			x: {
				grid: {
					display: false
				},
				ticks: {
					// Include a dollar sign in the ticks
				},
			},
			y: {
				beginAtZero: true,
				grid: {
					//color:'blue'
				},
				ticks: {
					maxTicksLimit: 8,
					// callback: function(value, index, values) {
					// 	return  value+'L';
					// }
				},
			},
		}
	};
	barChartPlugin: any = {
		beforeInit: function (chart: any) {
			chart.data.labels.forEach(function (element: any, i: any, a: any) {
				// console.log('chart Label',chart.data.labels);
				// console.log(typeof(element))
				if (/\s/.test(element.toString())) {
					a[i] = (element).toString().split("-");
				}
			});
		}
	};
	barChartData: any = [  { data: [], borderSkipped: "left", barThickness: 15,} ];
	barChartLabel: any;
	mfYtdValue:any;
	otherValue:any;
	public bodyParam: any;
	
	toggleParam:any = 'Hierarchy';
	prodata = false;

	constructor(private router: Router,
		private route: ActivatedRoute,
		private popoverController: PopoverController,
		private storage: StorageServiceAAA,
		private serviceFile: BrokerageService,
		private commonService: CommonService,
		private marService: MarketService,
		//private dashBoardRevampService: DashBoardRevampService,
		private dashBoardService: DashBoardService,
		private platform: Platform) { }

	ngOnInit() {
		if(localStorage.getItem('toggleSwitch')){
			this.toggleParam = localStorage.getItem('toggleSwitch');
		}


		this.route.queryParams.subscribe(params => {
			if(params['Tab'] == 'MF'){
				this.equityBlockTabValue = 'mutual';
				this.segmentTabChanged('mutual');
			}
			else if(params['Tab'] == 'FD'){
				this.equityBlockTabValue = 'others';
				this.segmentTabChanged('others');
			}
			else{
				this.equityBlockTabValue = 'equity';
				this.segmentTabChanged('equity');
			}
		  }
	  );

		this.selectedDate = {start: moment().startOf('month'), end: moment().endOf('month')};
		setTimeout(() => {
			this.storage.get('empCode').then( details => {
				if(details == null){
					this.userID = localStorage.getItem('userId1');
				}
				else{
					this.userID = details;
				}
				this.clientCode = this.userID;
			});
			this.storage.get('partnerDetails').then( details => {
				// console.log(details);
				if(details){
					
					this.partnerBrokerageValue = this.commonService.numberFormatWithCommaUnit(details['objGetAAADashboardDataBody'][0]['YTDBrokerage']);
				}
			})
			this.storage.get('hierarchyList').then( list => {
				if (list) {
					this.selectOptionArr = list;
					// this.selectOptionArrCopy = list;
					let recursiveList = (listArray: any, flag?: any) => {
						listArray.forEach((element: any) => {
							// element.collapsed = arr['collapsed'];
							// element['hideChildren'] = arr['collapsed'] ? false : true;
							if (element['isChecked'] && this.userID === null ) {
								this.userID = element['EmployeeCode'];
								this.clientCode = element['EmployeeCode'];
								this.clientName = element['EmployeeName'] ? element['EmployeeName'] : element['EmployeeCode'];
								this.storage.set('empCode', element['EmployeeCode']);
							}
							if (element['innerDetail'] && element['innerDetail'].length > 0) {
								recursiveList(element['innerDetail'], flag);
							}
						});
					}
					recursiveList(this.selectOptionArr, false);
					// this.ClientName = list['EmployeeName'] ? list['EmployeeName'] : list['EmployeeCode'];
					// console.log(this.ClientName, list['EmployeeName'])
					// this.clientCode = list['EmployeeCode'];
					// this.storage.set('empCode', list['EmployeeCode']);
					setTimeout(() => {
						if (list['innerDetail'] && list['innerDetail'].length > 0) {
							recursiveList(list['innerDetail']);
						}
					});
					setTimeout(() => {
						this.getDataFromStorage(null,true);
					}, 500);
					const obj: any = {
						clientCode: this.userID,
					}
					this.commonService.setData(obj);
				} else {
					this.getDataFromStorage(this.equityBlockTabValue,true);
				}
			})
			
		}, 500);

		this.commonService.eventObservable.subscribe((obj) => {
			if (obj && obj['event'] === 'brokerageEvent') {
				// this.clientCode = obj['data']['clientCode'];
				const params: any = {
					code: obj['data']['clientCode'],
					data: obj['data']['value'],
				}
				if (obj['data']['chartData']) params['chartData'];
				this.setData(params);
			}
		})
		const event: any = {
			detail: {
				value: this.equityBlockTabValue,
				clientCode: this.clientCode
			}
		}
		this.commonService.setData(event);
		this.equityBlock = this.brokerageTabData;
		// this.getDataFromStorage();
		this.getCommHeaderDetail();
		// setTimeout(() => {
		// 	this.callBarChart(this.tokenValue,'ckv000rm');
		// }, 1000);
		

		let token = localStorage.getItem('jwt_token')
		let userType = localStorage.getItem('userType')
		let userId1 = localStorage.getItem('userId1');
		this.searchRmhierarchyTerms
		.pipe(
		  debounceTime(500),
		  switchMap((textSerach) => this.dashBoardService.fetchRMHierarchyNew(userType, userId1, token, textSerach)) // Perform the search operation
		)
		.subscribe(results => {
			this.setHierarchyList(results); 
		});

		this.storage.get('empCode').then(val => {
			this.bodyParam = {
				"LoginID": userId1,    
				"PartnerID": val ? val : userId1,
				"Role": localStorage.getItem('userChannel'),
				"DataType": "Hierarchy"
			};
		});
	}

	toggleFlag(){
        this.isShow = true;
		this.isDiv = true;
    }

	toggleclose(){
        this.isShow = false;this.isDiv = false;
	}
	
	// get Token and userID for barchart
	// getTokenId() {
	// 		this.storage.get('userType').then(type => {
	// 			if (type === 'RM' || type === 'FAN') {
	// 				this.storage.get('bToken').then(token => {
	// 					this.tokenValue = token;
	// 				})
	// 			} else {
	// 				this.storage.get('subToken').then(token => {
	// 					this.tokenValue = token;
	// 				})
	// 			}
	// 		})
	// }

	public brokerageData(token: any) {
		this.prodata = true;
		this.subscription = new Subscription();

		// this.commonService.setClevertapEvent('Dashboard_Brokerage');
		// this.storage.get('bToken').then((btoken) => {
		const body = {
			'LoginID': localStorage.getItem('userId1'),
			'PartnerID': this.clientCode !== null && this.clientCode !== undefined ? this.clientCode : this.userID,
			'Datatype': this.toggleParam,
			'Role': localStorage.getItem('userChannel'),
			'UserType': localStorage.getItem('userType')
		}
		this.subscription.add(
			this.dashBoardService
				.getBrokerageDetails(token, body)
				.subscribe((res: any) => {
					if (res['Head']['ErrorCode'] == 0) {
						// this.brokerageChartData = null;
						const response = res['Body']['objGetAAABrokeragedetailsDataBody'][0];
						this.brokEqMtd = response['EquityMTD'] ? response['EquityMTD']: 0 ;
						this.brokEqInception = response['EquityInception'] ? response['EquityInception']:0;
						// let sum = 0;
						// for (const key in response) {
						// 	if (Object.prototype.hasOwnProperty.call(response, key)) {
						// 		sum = sum + (+response[key]);
						// 	}
						// }

						// this.brokerageChartData = response;

						if (localStorage.getItem('DashTabSelect') === 'Mutual Funds' || localStorage.getItem('DashTabSelect') === 'Cross-Sell') {
							this.dashBoardService.getMFDashboard(token, this.bodyParam)
								.subscribe((res: any) => {
									this.mfYtdValue = res['Body'][0].TotalMFPayout;

									this.dashBoardService.getCrossSellDetails(token, this.bodyParam)
										.subscribe((res: any) => {
											this.otherValue = res['Body'][0].CrossSellPayout;
											const obj = [
												{ name: 'Equity (YTD)', segmentValue: 'equity', dataValue: this.commonService.numberFormatWithCommaUnit(response['EquityYTD']) },
												{ name: 'Mutual Funds (YTD)', segmentValue: 'mutual', dataValue: this.commonService.numberFormatWithCommaUnit(this.mfYtdValue) },
												{ name: 'Others (YTD)', segmentValue: 'others', dataValue: this.commonService.numberFormatWithCommaUnit(this.otherValue) },
											];
											this.cardSegments = obj;
										})
								})
						} else {
							const obj = [
								{ name: 'Equity (YTD)', segmentValue: 'equity', dataValue: this.commonService.numberFormatWithCommaUnit(response['EquityYTD']) },
								{ name: 'Mutual Funds (YTD)', segmentValue: 'mutual', dataValue: this.commonService.numberFormatWithCommaUnit(response['MFYTD']) },
								{ name: 'Others (YTD)', segmentValue: 'others', dataValue: this.commonService.numberFormatWithCommaUnit(response['OtherYTD']) },
							];
							this.cardSegments = obj;
						}
						this.prodata = false;
					} else {
						const obj = [
							{ name: 'Equity (YTD)', segmentValue: 'equity', dataValue: 0 },
							{ name: 'Mutual Funds (YTD)', segmentValue: 'mutual', dataValue: 0 },
							{ name: 'Others (YTD)', segmentValue: 'others', dataValue: 0 },
						]
						this.cardSegments = obj;
						this.brokEqMtd = 0;
						this.brokEqInception = 0;
						this.prodata = false;
					}
				})
		)
		// })
	}

	datesUpdated(event: any){
		if(event.startDate == null || event.endDate == null){
			this.isValChange = 'false';
			this.fromDateChange = this.commonService.currentMonthFirstDate();
			this.toDateChange = moment(new Date()).format('YYYYMMDD');
			localStorage.setItem('fromDateChange',this.fromDateChange);
			localStorage.setItem('toDateChange',this.toDateChange);
			localStorage.setItem('isValChange',this.isValChange);
		}
		if(event && event.startDate && event.endDate){
			this.isValChange = 'true';
			this.fromDateChange = moment(event.startDate.$d).format('YYYYMMDD');
			this.toDateChange = moment(event.endDate.$d).subtract(1, "days").format('YYYYMMDD');
			localStorage.setItem('fromDateChange',this.fromDateChange);
			localStorage.setItem('toDateChange',this.toDateChange);
			localStorage.setItem('isValChange',this.isValChange);
		}
		this.storage.get('userType').then(type => {
			let fromDateChange = localStorage.getItem('fromDateChange');
			let toDateChange = localStorage.getItem('toDateChange');
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.tokenValue = token;
					this.callBarChart(token,fromDateChange,toDateChange,this.isValChange);
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.tokenValue = token;
					this.callBarChart(token,fromDateChange,toDateChange,this.isValChange);
				})
			}
		})
	}

	openDatepicker() {
		this.pickerDirective.open();
	}

	
	// bar chart Integration fun
	callBarChart(token: any,fromDateChange?: any,toDateChange?: any,isValChange?: any) {
		this.displayBarChart = false;
		this.graphData = [];
		if(isValChange == 'true'){
			this.passObjVar = {
				"PartnerCode": this.clientCode ? this.clientCode : localStorage.getItem('userId1'),
				"FromDate" : fromDateChange,
				"ToDate" : toDateChange
			}
		}
		else{
			this.passObjVar = {
				"PartnerCode": this.clientCode ? this.clientCode : localStorage.getItem('userId1'),
				"FromDate" : this.commonService.currentMonthFirstDate(),
				"ToDate" : moment(new Date()).format('YYYYMMDD')
			}
		}
		
		this.dashBoardService.getBrokChart(token, this.passObjVar).subscribe((res: any) => {
	
	
			if (res['Head']['ErrorCode'] == 0) {
				this.graphData = res['Body']['PerformanceReportGraph'];
			
				// console.log(this.graphData)
				if (this.graphData.length > 0) {
					this.graphData.forEach(element => {
						if(element.TotalBrokerage == null || element.TotalBrokerage.toString().length == 0){
							element.TotalBrokerage = 0
						}
						else{
							element.TotalBrokerage = element.TotalBrokerage
						}
					});
					// this.graphData = this.graphData.filter(function (el) {
					// 	if(el.Date != null){
					// 		return (el.Date.toString()).length == 8
					// 	}
					// 	return;
						
					// });
					this.displayBarChart = true;
					// console.log(this.graphData);
					this.graphXAxis = [];
					this.graphBar = [];

					this.graphData.forEach(element => {
						// if (this.platform.is('desktop')) {
						if (/^\d+$/.test(element.Date)) {
							this.graphXAxis.push(moment(element.Date).format('DD MMM'));
						} else {
							this.graphXAxis.push(moment(element.Date).format('MMM YYYY'));
						}
						// }
						// else{
						// 	this.graphXAxis.push(moment(element.Date).format('DD MMM'))
						// }
						this.graphBar.push(element.TotalBrokerage)
					});
					// console.log(this.graphXAxis);

					setTimeout(() => {
						if(!document.getElementById('myChart')){
							return;
						}
						const canvas = document.getElementById('myChart') as HTMLCanvasElement;
						const ctx: any = canvas.getContext('2d');
	
						var gradient_bg = ctx.createLinearGradient(0, 0, 0, 350);
						gradient_bg.addColorStop(0, '#31BDC9')
						gradient_bg.addColorStop(1, '#CFECEF')
						
						this.barChartLabel = this.graphXAxis;
						this.barChartData[0].backgroundColor = gradient_bg;
						this.barChartData[0].data = this.graphBar;						
					
						// old code for reference
						// var myBarChart = new Chart(ctx, {
						// 	type: 'bar',
	
						// 	data: {
	
						// 		labels: this.graphXAxis,
	
						// 		datasets: [
						// 			{
						// 				// label: '# of Votes',
						// 				data: this.graphBar,
	
						// 				borderSkipped: "left",
	
						// 				barThickness: 15,
						// 				backgroundColor: gradient_bg,
						// 				// barPercentage:0.1,
						// 				// categoryPercentage:0.1
						// 				// borderColor: [
						// 				// 	'rgba(255,99,132,1)',
						// 				// 	'rgba(54, 162, 235, 1)',
						// 				// 	'rgba(255, 206, 86, 1)',
						// 				// 	'rgba(75, 192, 192, 1)',
						// 				// 	'rgba(153, 102, 255, 1)',
						// 				// 	'rgba(255, 159, 64, 1)'
						// 				// ],
						// 				//borderWidth: 20,
						// 				//borderRadius:10
	
						// 			}
						// 		],
	
						// 	},
	
						// 	options: {
						// 		responsive: true,
						// 		maintainAspectRatio: false,
						// 		legend: {
						// 			display: false,
						// 			position: 'bottom'
	
						// 		},
	
						// 		// title: {
						// 		//   display: true,
						// 		//   text: 'Chart.js Bar Chart'
						// 		// }
						// 		scales: {
	
						// 			xAxes: [{
	
						// 				gridLines: {
						// 					display: false
						// 				},
	
						// 				ticks: {
						// 					// Include a dollar sign in the ticks
						// 				},
	
						// 			}],
						// 			yAxes: [{
						// 				gridLines: {
						// 					//color:'blue'
						// 				},
						// 				ticks: {
						// 					beginAtZero: true,
						// 					maxTicksLimit: 8,
	
						// 					// callback: function(value, index, values) {
						// 					// 	return  value+'L';
						// 					// }
						// 				},
	
						// 			}],
	
						// 		}
						// 	},
	
	
						// 	plugins: [{
						// 		beforeInit: function (chart) {
						// 			chart.data.labels.forEach(function (element, i, a) {
						// 				// console.log('chart Label',chart.data.labels);
						// 				// console.log(typeof(element))
						// 				if (/\s/.test(element.toString())) {
						// 					a[i] = (element).toString().split("-");
						// 				}
						// 			});
						// 		}
	
	
	
						// 	}]
						// });
					}, 500);

				
				}
				else{
					this.graphData = [];
				}

			}
			else{
				this.graphData = [];
			}

		})





	}

	// change toggle status on change toggle
	toggleChange(event: any) {
		// console.log(this.toggleStatus);
		if(event == 'Detailed'){
			this.selectedDate = {start: moment().startOf('month'), end: moment().endOf('month')};
			this.callBarChart(this.tokenValue);
		}
	}

	// back to previous page
	back() {
		this.storage.set('hierarchyList', this.selectOptionArr);
		window.history.back();
	}

	// go to global search page
	goToAddScript() {
		//this.router.navigate(['/add-script']);
		this.router.navigate(['/dashboard-clients']);
	}

	goToDashboard() {
        this.router.navigate(['/dashboard']);
    }

	// go to notification page
	goToNotification() {
		this.router.navigate(['/notification']);
	}

	// filter popup for base on client code and name
	async filterOption(ev: any) {
		ev.stopPropagation();
		const popover = await this.popoverController.create({
			component: FilterPopupComponent,
			componentProps: { clientFilter: true, active: this.clientBlockSegmentValue },
			cssClass: "custom-popover filter-popover",
			mode: "md",
			showBackdrop: false,
			event: ev,
			//translucent: true
		});
		popover.onDidDismiss().then(data => {
			if (data["data"]) {
				const response = data['data'];
				// console.log(response['passData']);

				this.searchTerm = ''
				this.sendDataToChild = false;
				this.commonService.setData(response['passData']);
				//this.datas = this.resetData
				if (response['passData'] === null) return;

				if (response['passData'] == 'clientCode') {
					this.placeholderInput = 'Type Client Code'
					this.clientBlockSegmentValue = "clientCode";
				}
				else if (response['passData'] == 'clientName') {
					this.placeholderInput = 'Type Name';
					this.clientBlockSegmentValue = "clientName";
				}


			}
		})
		await popover.present();
	}

	// when click select
	select() {
		// console.log('select clicked');
		setTimeout(() => {
			this.isDropDownVisible = !this.isDropDownVisible;
		}, 500);
	}

	// when select and unselect child all
	selectUnselectChildAll(arr: any, ind?: any, parent?: any) {
		this.clientCode = null;
		// console.log(arr);
		let recursiveList = (list: any) => {
			list.forEach((element: any) => {
				// element.collapsed = arr['collapsed'];
				// element['hideChildren'] = arr['collapsed'] ? false : true;
				element['isChecked'] = arr['isChecked'];
				if (element['innerDetail'] && element['innerDetail'].length > 0) {
					recursiveList(element['innerDetail']);
				}
			});
		}
		setTimeout(() => {
			if (arr['innerDetail'] && arr['innerDetail'].length > 0) {
				recursiveList(arr['innerDetail']);
			}
		});

		arr.forEach((element: any) => {
			element['isChecked'] = false;
		});

		arr[ind]['isChecked'] = true;
		if (arr[ind]['innerDetail'] && arr[ind]['innerDetail'].length) {
			arr[ind]['innerDetail'].forEach((element: any) => {
				element['isChecked'] = true;
			});
		}

		// if (optionalArr) {
		// 	optionalArr.forEach(element => {
		// 		element['innerDetail']
		// 	});
		// }
	}

	// when click drop down
	dropDown() {
		this.isDropDownVisible = false;
	}

	// open and hide option
	openHide(index: any, arr: any, item: any) {
		arr.forEach((element: any, ind: any) => {
			// if ((index) === ind) {
				element['isVisible'] = element['isVisible'] ? false : true;
			// }
		});

		this.selectUnselectChildAll2(item)
		this.applyFilter()
	}


	segmentChange() {
		this.searchTerm = '';
		this.sendDataToChild = false;
		if (this.clientBlockSegmentValue === 'clientName') {
			this.placeholderInput = 'Type Name';
		} else {
			this.placeholderInput = 'Type Client Code';
		}
	}

	public setData(obj: any) {
		this.clientCode = obj['clientCode'];
		this.brokerageTabData = [];
		this.brokerageTabData = obj['data'];
		this.equityBlock = this.brokerageTabData;
		this.chartData = obj['chartData'];

		let sum = 0;
		const response = this.chartData;
		for (const key in response) {
			if (Object.prototype.hasOwnProperty.call(response, key)) {
				sum = sum + (+response[key]);
			}
		}
		if (sum !== 0) {
			this.showChart = true;
			this.dognut = new Chart(this.dognutChart.nativeElement, {
				type: 'doughnut',
				data: {
					labels: [
						'Equity',
						'Mutual Fund',
						'Others'
					],
					datasets: [{
						data: [+(((+this.chartData['EquityYTD'] + (+this.chartData['EquityInception'])) * 100) / sum).toFixed(2), +(((+this.chartData['MFYTD'] + (+this.chartData['MFInception'])) * 100) / sum).toFixed(2), +(((+this.chartData['OtherYTD'] + (+this.chartData['OtherInception'])) * 100) / sum).toFixed(2)],
						backgroundColor: ['#FCC103', '#F9327A', '#35BAE9'], // array should have same number of elements as number of dataset
						// borderColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
						borderWidth: 0
					}],

				},
				options: {
					responsive: true,
					plugins:{
						legend: {
							display: false
						}
					}
				}
			});
		}

	}

	ngOnChanges() {
		const newData = this.brokerageTabData;
		this.brokerageTabData = newData;
		const params = {
			code: this.clientCode,
			data: this.brokerageTabData,
			chartData: this.chartData
		}
		this.setData(params);
	}

	segmentTabChanged(event: any) {
		this.searchTerm = null;
		if (event == 'others') {
			const obj = [
				{ name: 'Equity', value: 'equity' },
				{ name: 'Mutual Fund', value: 'mutual' },
				{ name: 'Others', value: 'others' },
			];
			this.commonService.setEvent('othersEvent', obj);
		}

		if (event == 'equity') {
			this.callBarChart(this.tokenValue);
		}
		// else{
		// 	this.sendDataToChild = false;
		// }
		//this.sendObjParams.unsubscribe()
	}

	public searchText(isFilterApplied?: any) {

		// if (this.equityBlockTabValue == 'mutual') {
		// 	const obj = {
		// 		SearchText: this.searchTerm,
		// 		SearchBy: this.clientBlockSegmentValue,
		// 		page: 1
		// 	}
		// 	if (this.searchTerm != null) {
		// 		//this.sendObjParams.next(obj);
		// 	}
		// }

		if (isFilterApplied) {
			this.sendDataToChild = true;
		} else {
			if (this.searchTerm != null) {
				this.sendDataToChild = true;
			} else{
				this.sendDataToChild = false;
			}
		}
		
		//for other tabs
		// else{



		// else{
		// 	this.sendDataToChild = true;			
		// }
		// }


		//const eventName = this.equityBlockTabValue === 'equity' ? 'brokerageEquity' : this.equityBlockTabValue === 'others' ? 'brokerageOthers' : this.equityBlockTabValue;
		//this.commonService.setEvent(eventName+'SearchText', obj);
		// if (this.searchTerm.length > 2) {
		// 	return;
		// } else {
		// 	this.commonService.setEvent(eventName+'SearchText', obj);
		// }
	}

	public onSegmentChanged(event: any) {
		this.searchTerm = null;
		this.storage.get('empCode').then(code => {
			const obj: any = {
				clientCode: code,
				value: event['detail']['value']
			}
			this.commonService.setData(obj);
		})
	}

	public brokerageDueDetails(token: any) {

		// this.storage.get('userID').then(ID => {
			const subscription = new Subscription();
			const passObj = {
				Loginid: this.clientCode ? this.clientCode : this.userID
			}
			subscription.add(
				this.serviceFile
					.getBrokerageDue(token, passObj)
					.subscribe((res: any) => {
						if (res['Head']['ErrorCode'] === 0) {
							const response = res['Body']['objGetAAABrokerageduedetailsDataBody'][0];
							const tempDate = response['DueDate'].split('-');
							var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
							let mm = months[tempDate[1] - 1];
							this.dueAmount = this.commonService.numberFormatWithCommaUnit(response['BrokerageAmount']);
							this.dueDate = tempDate[0] + ' ' + mm + ' ' + tempDate[2];
						}
					})
			)
		// })
	}

	public getDataFromStorage(value: any,onLoad?: any, clicked?: any) {
		this.loader = true;
		/* this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.brokerageDueDetails(token);
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.brokerageDueDetails(token);
				})
			}
		}) */
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.tokenValue = token;
					this.dashBoardDetails(token);
					this.brokerageData(token);
					this.callBarChart(token);
					if (onLoad && value) {
						this.hierarchyList(token, true);
					}
					if (value === null && onLoad && !clicked) {
						// this.aumDetails(token);
						this.brokerageDueDetails(token);
						// this.callBarChart(token);
						// this.brokerageData(token);
					}
					if (clicked) {
						// this.aumDetails(token);
						this.brokerageDueDetails(token);
						const obj = {
							clientCode: this.clientCode
						}
						this.searchText(true);
					}
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.tokenValue = token;
					this.dashBoardDetails(token);
					this.brokerageData(token);
					this.callBarChart(token)
					if (onLoad && value) {
						this.hierarchyList(token, true);
					}
					if (value === null && onLoad && !clicked) {
						// this.aumDetails(token);
						this.brokerageDueDetails(token);
						// this.callBarChart(token);
					}
					if (clicked) {
						const obj = {
							clientCode: this.clientCode
						}
						this.searchText(true);
					}
				})
			}
		})
	}

	public dashBoardDetails(token: any) {
		this.subscription = new Subscription();

		this.storage.get('partnerDetails').then((value) => {
			if(value){
				this.dataAsOn = value.DataAsOn;
				this.partnerBrokerageValue = this.commonService.numberFormatWithCommaUnit(value['objGetAAADashboardDataBody'][0]['YTDBrokerage']);
				this.loader = false;
			} else {
				this.subscription.add(
					this.dashBoardService
						.dashBoardDetail(token, this.userID)
						.subscribe((res: any) => {
							let cards: any = [];
							if (res['Head']['ErrorCode'] == 0) {
								const response = res['Body']['objGetAAADashboardDataBody'][0];
								const dashboardDetails = res['Body'];
								this.dataAsOn = res['Body']['DataAsOn'];
								cards.forEach((element: any) => {
									if (element['type'] == 'aum') {
										element['value'] = this.commonService.numberFormatWithCommaUnit(response['TotalAum']);
										element['title'] = '';
										element['lowerValue'] = '';
	
									} else if (element['type'] == 'clients') {
										element['value'] = this.commonService.numberFormatWithCommaUnit(response['TotalClient']);
										element['title'] = '';
										element['lowerValue'] = '';
									} else if (element['type'] == 'brokerage') {
										element['value'] = this.commonService.numberFormatWithCommaUnit(response['YTDBrokerage']);
										element['title'] = '';
										element['lowerValue'] = '';
									} else if (element['type'] == 'afyp') {
										element['value'] = this.commonService.numberFormatWithCommaUnit(+response['MTD'] + +response['YTD']);
										element['title'] = '';
										element['lowerValue'] = '';
									} else {
										element['value'] = this.commonService.numberFormatWithCommaUnit(0);
										element['title'] = '';
										element['lowerValue'] = '';
									}
								});
								this.partnerBrokerageValue = this.commonService.numberFormatWithCommaUnit(response['YTDBrokerage']);
	
								this.storage.set('partnerDetails', dashboardDetails);
								this.loader = false;
							} else {
								cards.forEach((element: any) => {
									element['value'] = this.commonService.numberFormatWithCommaUnit(0);
									element['title'] = '';
									element['lowerValue'] = '';
								});
								this.partnerBrokerageValue = this.commonService.numberFormatWithCommaUnit(0);
								this.storage.set('partnerDetails', undefined);
								this.dataAsOn = null;
								this.loader = false;
							}
						})
						)
					}
				});
	}

	public hierarchyList(token: any, triggerClientwise?: any) {
		this.subscription = new Subscription();

		this.subscription.add(
			this.dashBoardService
				.getHierarchyList(token, this.userID)
				.subscribe((res: any) => {
					if (res['Head']['ErrorCode'] == 0) {
						const Details = res['Body']['Details'];

						const listToTree = (arr: any = []) => {
							let map: any = {}, node, res: any = [], i;
							for (i = 0; i < arr.length; i += 1) {
								map[arr[i].EmployeeCode] = i;
								// if (arr[i]['EmployeeLevel'] === '') arr[i]['EmployeeLevel'] = "1";
								arr[i]['isChecked'] = true;
								arr[i]['type'] = 'Individual';
								arr[i]['innerDetail'] = [];
							};
							for (i = 0; i < arr.length; i += 1) {
								node = arr[i];
								if (node.ManagerCode !== "" && arr.length > 1 && node.ManagerCode !== arr[map[node.ManagerCode]].ManagerCode) {
									arr[map[node.ManagerCode]].innerDetail.push(node);
									arr[map[node.ManagerCode]].innerDetail = arr[map[node.ManagerCode]].innerDetail.sort((a: any, b: any) => {
										return b.EmployeeLevel - a.EmployeeLevel;
									})
								}
								else {
									// (node['EmployeeLevel'] !== '' && node['EmployeeLevel'] !== null || arr.length === 1) ? node['isChecked'] = true : node['isChecked'] = false;
									node['isVisible'] = true;
									node['isChecked'] = true;
									res.push(node);
								};
							};
							return res;
						};

						
						let x = listToTree(Details);
						x = x.sort((a: any, b: any) => {
							return b.EmployeeLevel - a.EmployeeLevel;
						})
						this.selectOptionArr = x;
						this.selectOptionArrCopy = x;
						// this.selectOptionArr[0]['isVisible'] = true;
						// console.log(x);

						this.clientName = this.selectOptionArr[0]['EmployeeName'];
						// this.clientType = 'All Accounts';
						this.clientCode = this.selectOptionArr[0]['EmployeeCode'];
						this.storage.set('empCode', this.selectOptionArr[0]['EmployeeCode']);
						if (triggerClientwise) {
							const obj: any = {
								clientCode: this.clientCode,
							}
							this.commonService.setData(obj);
						}

					} else {
						/* if (optional === 'aum') {
							this.aumDetails(token);
						} else if (optional === 'sipBook') {
							this.sipBookDetails(token);
						} else if (optional === 'totalAfyp') {
							this.totalAFYPDetails(token);
						} else if (optional === 'totalClients') {
							this.clientDetails(token);
						} else if (optional === 'brokerage') {
							this.brokerageData(token);
						} else if (optional === 'fds') {
							this.fdsLoad = true;
							setTimeout(() => {
								this.showLoader = false;
							}, 1000);
						} */
					}
				})
		)
	}

	public applyFilter() {
		this.sendDataToChild = false;
		this.isApply = true;
		this.isDropDownVisible = !this.isDropDownVisible;
		const obj = {
			clientCode: this.clientCode
		}
		this.storage.set('empCode', this.clientCode);
		this.userID = this.clientCode;
		this.getDataFromStorage(this.equityBlockTabValue,false, true);

	}

	public overlayClicked(event: any) {
		event.preventDefault();
		this.isDropDownVisible = false;
	}

	public selectUnselectChildAll2(list: any) {
		// list['isChecked'] = !list['isChecked'];
		
		// setTimeout(() => {	
		// 	console.log(list, 'list', list['isChecked'], 'list isChecked after timeout' );
		
		
		let recursiveList = (listArray: any, flag?: any) => {
			listArray.forEach((element: any) => {
				// element.collapsed = arr['collapsed'];
				// element['hideChildren'] = arr['collapsed'] ? false : true;
				element['isChecked'] = (flag === false ? flag : list['isChecked']);
				if (element['innerDetail'] && element['innerDetail'].length > 0) {
					recursiveList(element['innerDetail'], flag);
				}
			});
		}
		recursiveList(this.selectOptionArr, false);
		this.clientName = list['EmployeeName'] ? list['EmployeeName'] : list['EmployeeCode'];
		// console.log(this.clientName, list['EmployeeName']);
		this.clientCode = list['EmployeeCode'];
		this.storage.set('empCode', list['EmployeeCode']);
		setTimeout(() => {
			if (list['innerDetail'] && list['innerDetail'].length > 0) {
				recursiveList(list['innerDetail']);
			}
		});
		// }, 100);
	}

	goToPage(page: any) {
		if (page) {
			this.router.navigate(['/' + page]);
		} else {
			return;
		}
	}

	typeSearchText(event: any) {
		this.sendDataToChild = false;
		// if(event.length == 0){

		// 	//this.clientBlockSegmentValue = null;
		// }
	}

	getCommHeaderDetail() {
		this.marService.getCommonHead().subscribe((res: any) => {
			this.displayHeader = [
				{
					"Exch": res['Data'][1].Exch,
					"ExchType": res['Data'][1].ExchType,
					"LastRate": res['Data'][1].LastRate,
					"PerChange": res['Data'][1].PerChange,
					"ScripCode": res['Data'][1].ScripCode,
					"Change": res['Data'][1].Change,
					"Symbol": res['Data'][1].Symbol
				},
				{
					"Exch": res['Data'][2].Exch,
					"ExchType": res['Data'][2].ExchType,
					"LastRate": res['Data'][2].LastRate,
					"PerChange": res['Data'][2].PerChange,
					"ScripCode": res['Data'][2].ScripCode,
					"Change": res['Data'][2].Change,
					"Symbol": res['Data'][2].Symbol
				},
				{
					"Exch": res['Data'][0].Exch,
					"ExchType": res['Data'][0].ExchType,
					"LastRate": res['Data'][0].LastRate,
					"PerChange": res['Data'][0].PerChange,
					"ScripCode": res['Data'][0].ScripCode,
					"Change": res['Data'][0].Change,
					"Symbol": res['Data'][0].Symbol,
				}

			]
		})
		clearTimeout(this.clearHeaderDetails);
		this.clearHeaderDetails = setTimeout(() => {
			this.getCommHeaderDetail();
		}, 2000);
	}
	
	
	typeHierarchyText(event: any){
		const textSerach = event.target.value;

		if (textSerach && textSerach.length > 3) {
			this.isShowCross = true;
			this.noRecord = false;
			this.searchRmhierarchyTerms.next(textSerach);
		} else {
			this.isShowCross = false;
			this.selectOptionArr = [];
			this.selectOptionArrCopy = [];
			// this.ClientName = null;
			// this.clientCode = null;
		}
		
		// this.selectOptionArrCopy = this.selectOptionArr;
		// if(event.target.value == ''){
		// 	this.isShowCross = false;
		// 	this.selectOptionArrCopy = this.selectOptionArr;
		// }
		// else{
		// 	this.isShowCross = true;
		// 	this.selectOptionArrCopy = this.selectOptionArrCopy.filter(function (el) {
		// 		return el.EmployeeName.toLowerCase().includes(event.target.value.toLowerCase()) || el.EmployeeCode.toLowerCase().includes(event.target.value.toLowerCase());
		// 	}
		// 	);
		// }
	}

	
	setHierarchyList(res: any) {
		let details = [];
		for (const item of res[0]) {
			details.push({
				EmployeeName: item.employeeName,
				EmployeeCode: item.employeeId,
				EmployeeLevel: item.level,
				ManagerCode: '',
				ManagerName: '',
			})
		}
		const listToTree = (arr: any = []) => {
			let map: any = {}, node, res: any = [], i;
			for (i = 0; i < arr.length; i += 1) {
				map[arr[i].EmployeeCode] = i;
				arr[i]['isChecked'] = true;
				arr[i]['type'] = 'Individual';
				arr[i]['innerDetail'] = [];
			};
			for (i = 0; i < arr.length; i += 1) {
				node = arr[i];
				if (node.ManagerCode !== "" && arr.length > 1 && node.ManagerCode !== arr[map[node.ManagerCode]].ManagerCode) {
					arr[map[node.ManagerCode]].innerDetail.push(node);
					arr[map[node.ManagerCode]].innerDetail = arr[map[node.ManagerCode]].innerDetail.sort((a: any, b: any) => {
						return b.EmployeeLevel - a.EmployeeLevel;
					})
				}
				else {
					node['isVisible'] = true;
					node['isChecked'] = true;
					res.push(node);
				};
			};
			return res;
		};
		let x = listToTree(details);
		x = x.sort((a: any, b: any) => {
			return b.EmployeeLevel - a.EmployeeLevel;
		});
		var result = x.filter((obj: any) => {
			return obj.EmployeeLevel !== ''
		})
		var logid = result.filter((obj: any) => {
			return obj.EmployeeCode == localStorage.getItem('userId1')
		})
		var notlogid = result.filter((obj: any) => {
			return obj.EmployeeCode != localStorage.getItem('userId1')
		})
		result = logid.concat(notlogid);
		var result1 = x.filter((obj: any) => {
			return obj.EmployeeLevel == ''
		})
		let y = result.concat(result1);
		this.selectOptionArr = y;
		this.selectOptionArrCopy = y;
		// setTimeout(() => {
		// 	this.ClientName = this.selectOptionArr[0]['EmployeeName'];
		// 	this.clientCode = this.selectOptionArr[0]['EmployeeCode'];
		// 	this.storage.set('empCode', this.selectOptionArr[0]['EmployeeCode']);
		// 	this.storage.set('hierarchyList', this.selectOptionArr);
		// }, 100);

		if (res[0].length === 0) {
			this.noRecord = true;
		}
	}
	
	dismiss(){
		this.isShowCross = false;
		this.searchHierarchyList = '';
		this.selectOptionArr = [];
		this.selectOptionArrCopy = [];
	}

	ionViewWillEnter() {
		const toggleState = localStorage.getItem('toggleSwitch');
		if (toggleState) {
			this.toggleParam = toggleState;
		}
	}

	ionViewWillLeave() {
		clearTimeout(this.clearHeaderDetails);
	}

	ngOnDestroy() {
		this.subscription = this.subscription.unsubscribe();
		// this.commonService.backbuttonUnsubscribeMethod();
	}

	toggleSwitch(val: any) {
		this.toggleParam = val;
		localStorage.setItem('toggleSwitch', val);
		this.brokerageData(this.tokenValue);
		this.sendDataToChild = true;
	}

}
