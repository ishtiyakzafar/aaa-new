import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { FilterPopupComponent } from '../filter-popup/filter-popup.component';
import { PopoverController } from '@ionic/angular';
import { MarketService } from '../../pages/markets/markets.service';
import { Subscription, Subject, Observable } from 'rxjs';
import { DashBoardService } from '../../pages/dashboard/dashboard.service';
// import { DashBoardService } from 'src/app/pages/dashboard-revamp/dashboard-revamp.service';
import { PopoverComponent } from '../popover/popover.component';
import { TotalClientService } from './total-clients.service';
import { DatePipe } from '@angular/common'
import moment from 'moment';
import { ToasterService } from '../../helpers/toaster.service';
import { DaterangepickerDirective, NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { debounceTime, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-total-clients',
  providers: [MarketService,DashBoardService,NgxDaterangepickerMd],
  templateUrl: './total-clients.component.html',
  styleUrls: ['./total-clients.component.scss'],
})
export class TotalClientsComponent implements OnInit {
	@ViewChild(DaterangepickerDirective, { static: false })
	pickerDirective?: DaterangepickerDirective;
	@Input() totalClientsTabData: any;
	@Input() allClientData: any;
	@Input() toggleChange: any;
	public clientCode: any = null;
	public searchTerm: any = null;
    HoverdataLoad: boolean = false;
	dataLoad: boolean = false;
	disableToDte: boolean = true;
	excelDownlod: boolean = false;
	public startDate: any = "";
    public endDate: any = "";
	public clientBlockTabValue: any = 'newClients';
    public placeholderInput: string = 'Type Client Code';
	start:any;
  	end:any;
	public selectedDate = {start: moment().startOf('month'), end: moment().endOf('month')};
	NgxDaterangepickerMd? : NgxDaterangepickerMd;
	maxDate =  moment(new Date());
	minDate = moment(new Date('Mn Jan 1 1973 00:01:00 GMT+0200 (CEST)'));
	ranges: any = {
		'This Month': [moment().startOf('month'), moment().endOf('month')],
		'Previous Month': [
			moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')
			]
	}
	toggleParam = 'Hierarchy';
	searchHierarchyList : any;
	selectOptionArrCopy: any[] = [];
	public placeholderInputHierarchy: string = 'Search...';
	isShowCross: boolean = false;
  	cancelBtn:boolean = true;
	  currentDate: any;
	public totalClients: any[] = [
    ]
    public clientBlockSegmentValue: string = "clientCode";
    public segmentButtonOption: any[] = [
        {name: 'Client Code', value: 'clientCode'},
        {name: 'Name', value: 'clientName'}
	]
	sendDataToChild:boolean = false;
	public cardName: any;
	public errLabel: any;
	public loader: boolean = false;
	removescroll: boolean = false;
    public equityBlockTabValue: any = 'allClients';
    public cardSegments: any[] = [
        // {name: 'All Clients', segmentValue:'allClients', clients: 250},
        // // {name: 'High Risk Clients', segmentValue:'highRiskClients', clients: 250},
        // {name: 'Clients not traded', segmentValue:'clientsNotTraded', clients: 250},
        // {name: 'Dormant Clients', segmentValue:'dormatClients', clients: 250},
    ]
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
	clearHeaderDetails:any;
	showStartDatePicker: boolean = false;
	showEndDatePicker: boolean = false;
	displayHeader:any[] = [];
    public isDropDownVisible: boolean = false;
	private today = new Date();
	public myDatePickerOptions = {
		disableSince: {year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() + 1}
	 };

	 hightestLabel: any = null;
	 clientName: any = null;
	 subscription:any;
	 userID: any = null;
	 public dashTabSelect: any ;

	 public totalDashboardData: any = [];
	 public bodyParam: any;
	 public commonFilterProps: any;
	 partnerClientValue: any= 0;
	 ionStartDate: any;
	 ionEndDate: any;

	 dormantClientValue: any = 0;
	 clientsNotTradedValue: any = 0;
	 reportData: any = [];
	noRecord:boolean=false;
	public dataAsOn:any = null;
	public incorrectDate = false;
	private searchRmhierarchyTerms = new Subject<string>();
	loading:boolean = false;
	// date=new Date();
	myOptions:any = {
		dateFormat: 'dd/mm/yyyy',
		showSelectorArrow: true,
		showMonthNumber: false,
	}
	downloadExcelReport:any;
	totalVal: any;
	activeVal: any;
	dormantVal: any;
	newClientVal: any;
	public toggleVal: any;
	public isMFCSshow = false;
	public dashboardType: any; 
	prodata = false;
	
	constructor(private elementRef: ElementRef,
		private router: Router,
        private popoverController: PopoverController,
		private commonService: CommonService,
		public dashBoardService: DashBoardService,
		private toast:ToasterService,
		private storage: StorageServiceAAA,
		private marService: MarketService,
		private serviceFile:TotalClientService,
		public datepipe: DatePipe,
		private route: ActivatedRoute,
		) { }

	ngOnInit() {
		this.dashTabSelect = localStorage.getItem('DashTabSelect');

		this.toggleVal = localStorage.getItem('toggleSwitch');
		if(this.toggleVal){
			this.toggleParam = this.toggleVal;
		}
		if(this.toggleVal == 'Hierarchy'){
			this.segmentButtonOption = [];
			this.segmentButtonOption = [
				{name: 'Client Code/PAN', value: 'clientCode'},
				{name: 'Name', value: 'clientName'},
				{name: 'Group Code', value: 'partnerCode'}
			]
		}
		else{
			this.segmentButtonOption = [];
			this.segmentButtonOption = [
				{name: 'Client Code/PAN', value: 'clientCode'},
				{name: 'Name', value: 'clientName'}
			]
		}

		this.route.queryParams.subscribe(params => {
			if(params['Tab'] == 'Overall'){
				this.isMFCSshow = false;
				this.dashboardType = 'Overall';
				this.getProductwiseData(this.dashboardType);
				this.getBlockTabValue(params['SubTab']);
			}
			else if(params['Tab'] == 'Equity'){
				this.isMFCSshow = false;
				localStorage.setItem('isNewClientTab', 'NewClient');
				this.dashboardType = 'Equity';
				this.getProductwiseData(this.dashboardType);
				this.getBlockTabValue(params['SubTab']);
			}
			else if(params['Tab'] == 'MF'){
				this.isMFCSshow = true;
				this.dashboardType = 'MF';
				this.getProductwiseData(this.dashboardType);
				this.getBlockTabValue(params['SubTab']);
			}
			else if(params['Tab'] == 'CS'){
				this.isMFCSshow = true;
				this.dashboardType = 'Cross-sell';
				this.getProductwiseData(this.dashboardType);
				this.getBlockTabValue(params['SubTab']);
			}
		  })

		this.currentDate = moment(new Date()).format("YYYY-MM-DD");

		setTimeout(() => {
			this.storage.get('empCode').then(details => {
				if (details == null) {
					this.userID = localStorage.getItem('userId1');
				}
				else {
					this.userID = details;
				}
				this.clientCode = this.userID;
			});
			this.storage.get('partnerDetails').then( details => {
				if(details){
				this.partnerClientValue = this.commonService.numberFormatWithCommaUnit(details['TotalClient']) ? this.commonService.numberFormatWithCommaUnit(details['TotalClient']) : 0;
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

		this.commonService.eventObservable.subscribe((obj: any) => {
			if (obj && obj['event'] === 'totalClientEvent') {
				// this.clientCode = obj['data']['clientCode'];
				const params = {
					code: obj['data']['clientCode'],
					data: obj['data']['value'],
				}
				this.setData(params);
			}
		})
		const event: any = {
			detail: {
				value: 'newClients',
				clientCode: this.clientCode
			}
		}
		this.commonService.setData(event);
		this.totalClients = this.totalClientsTabData;
		this.getCommHeaderDetail();

		let token = localStorage.getItem('jwt_token')
		let userType = localStorage.getItem('userType')
		let userId1 = localStorage.getItem('userId1');
		this.searchRmhierarchyTerms
		.pipe(
		  debounceTime(500),
		  switchMap((textSerach) => this.dashBoardService.fetchRMHierarchyNew(userType, userId1, token, textSerach)) // Perform the search operation
		)
		.subscribe((results: any) => {
			this.setHierarchyList(results); 
		});

		let tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		this.myOptions['disableSince'] = { year: moment(tomorrow).format('YYYY'), month: moment(tomorrow).format('MM'), day: moment(tomorrow).format('DD') }
		
	}
	
	getProductwiseData(param: any, id?: any){
		this.prodata = true;
		let userId1 = localStorage.getItem('userId1');
		this.storage.get('empCode').then(val => {
		this.bodyParam = {
			"Loginid": userId1,    
			"PartnerCode": id ? id : val ? val : userId1,
			"Role": localStorage.getItem('userChannel'),
			"DataType": localStorage.getItem('toggleSwitch'),
			"DashboardType": param,
			"UserType": localStorage.getItem('userType')
		 };
		});
    
		this.storage.get('userType').then(type => {
				if (type === 'RM' || type === 'FAN') {
					this.storage.get('bToken').then(token => {
						this.initProductwiseDetails(token,this.bodyParam);
					})
				} else {
					this.storage.get('subToken').then(token => {
						this.initProductwiseDetails(token,this.bodyParam);
					})
				}
		})
	}

	initProductwiseDetails(token: any, body: any){
		this.dashBoardService
				.getProductWiseClient(token, body)
				.subscribe((response: any) => {
					if (response['Head']['ErrorCode'] == 0) {
						switch (this.dashboardType) {
							case 'MF':
								this.totalVal = response['Body'][0]['TotalClients'] ? Number(response['Body'][0]['TotalClients']).toFixed(0) : 0;
								this.activeVal = response['Body'][0]['NonBrokingClientCount'] ? Number(response['Body'][0]['NonBrokingClientCount']).toFixed(0) : 0;
								this.dormantVal = response['Body'][0]['OnlyMFClientCount'] ? Number(response['Body'][0]['OnlyMFClientCount']).toFixed(0) : 0;
								const cardSeg = [
									{ name: 'Clients', segmentValue:'allClients', clients: this.totalVal },
									{ name: 'Non-Registered Clients', segmentValue:'clientsNotTraded', clients: this.activeVal },
									{ name: 'Only MF Clients', segmentValue:'dormatClients', clients: this.dormantVal }
								];
								this.cardSegments = cardSeg;
								break;
							case 'Cross-sell':
								this.totalVal = response['Body'][0]['TotalClients'] ? Number(response['Body'][0]['TotalClients']).toFixed(0) : 0;
								const cardSgment = [
									{ name: 'Clients', segmentValue:'allClients', clients: this.totalVal }
								];
								this.cardSegments = cardSgment;
								break;
							case 'Overall':
								this.totalVal = response['Body'][0]['TotalClients'] ? Number(response['Body'][0]['TotalClients']).toFixed(0) : 0;
								this.activeVal = response['Body'][0]['ActiveClientCount'] ? Number(response['Body'][0]['ActiveClientCount']).toFixed(0) : 0;
								this.dormantVal = response['Body'][0]['DormantClientCount'] ? Number(response['Body'][0]['DormantClientCount']).toFixed(0) : 0;
								const cardSegment = [
									{ name: 'All Clients', segmentValue:'allClients', clients: this.totalVal },
									{ name: 'Active Clients', segmentValue:'clientsNotTraded', clients: this.activeVal },
									{ name: 'Dormant Clients', segmentValue:'dormatClients', clients: this.dormantVal }
								];
								this.cardSegments = cardSegment;
								break;
							case 'Equity':
								this.totalVal = response['Body'][0]['TotalClients'] ? Number(response['Body'][0]['TotalClients']).toFixed(0) : 0;
								this.activeVal = response['Body'][0]['ActiveClientCount'] ? Number(response['Body'][0]['ActiveClientCount']).toFixed(0) : 0;
								this.dormantVal = response['Body'][0]['DormantClientCount'] ? Number(response['Body'][0]['DormantClientCount']).toFixed(0) : 0;
								this.newClientVal = response['Body'][0]['NewClientCount'] ? Number(response['Body'][0]['NewClientCount']).toFixed(0) : 0;
								const cardSegments = [
									{ name: 'All Clients', segmentValue:'allClients', clients: this.totalVal },
									{ name: 'Active Clients', segmentValue:'clientsNotTraded', clients: this.activeVal },
									{ name: 'Dormant Clients', segmentValue:'dormatClients', clients: this.dormantVal },
									{ name: 'New Clients', segmentValue:'NewClient', clients: this.newClientVal },
								];
								this.cardSegments = cardSegments;
								break;
							default:
								break;
						}
						this.prodata = false;
					}
					else {
						this.prodata = false;
					}
				})
			}

	getBlockTabValue(event: any) {
		if(event == 'Dormant'){
			this.equityBlockTabValue = 'dormatClients';
		}
		else if(event == 'Active'){
			this.equityBlockTabValue = 'clientsNotTraded';
		}
		else if(event == 'NewClient'){
			this.equityBlockTabValue = 'NewClient';
		}
		else{
			this.equityBlockTabValue = 'allClients';
		}
	}

	contentHide(){
		if(this.removescroll){
			this.removescroll = false;
			return;
		}
	}

    // hoverCall(clientId, type?) {
	// 	this.HoverdataLoad = true;

	// }

	// public gettingFromdate() {
	// 	const d = new Date();
	// 	let month = d.getMonth();
	// 	let year = new Date().getFullYear();
	//     let startDate = moment([year, month ]);
	// 	let endDate = moment(startDate).endOf('month');
	
	//     return { start: startDate, end: endDate };
	// }

	openDatepicker() {
		this.pickerDirective?.open();
	}

	async openPopover(ev?: any, items?: any) {
		ev.stopPropagation();
		const popover = await this.popoverController.create({
			component: PopoverComponent,
			componentProps: { items: items },
			cssClass: "custom-popover",
			mode: "md",
			showBackdrop: false,
			event: ev
			// translucent: true
		});
        return await popover.present();
    }

	public getDataFromStorage(value: any,onLoad?: any, clicked?: any) {
		// this.loading = true;
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					// this.dashBoardDetails(token);
					if (onLoad && value) {
						this.hierarchyList(token, true);
						// this.businessOppsCards(token);
					}
					if (value === null && onLoad && !clicked) {
						// this.aumDetails(token);
						// this.clientDetails(token); //comment
					}
					if (clicked) {
						// this.aumDetails(token);
						// this.businessOppsCards(token);
						// this.clientDetails(token); //comment
						const obj = {
							clientCode: this.clientCode
						}
						this.searchText(true);
					}
				})
			} else {
				this.storage.get('subToken').then(token => {
					// this.dashBoardDetails(token);
					if (onLoad && value) {
						// this.businessOppsCards(token);
						this.hierarchyList(token, true);
					}
					if (value === null && onLoad && !clicked) {
						// this.aumDetails(token);
						// this.clientDetails(token); //comment
					}
					if (clicked) {
						// this.businessOppsCards(token);
						const obj = {
							clientCode: this.clientCode
						}
						this.searchText(true);
					}
				})
			}
		})
	}

	businessOppsCards(token: any, obj: any) {
		this.subscription.add(
			this.dashBoardService
				.getBusinessCount(token, this.clientCode ? this.clientCode : this.userID)
				.subscribe((response: any) => {
					if (response['Head']['ErrorCode'] == 0) {
						const res = response['Body']['AAADashBoardCountlist'][0];
						this.cardSegments[1]['clients'] = res['ClientsNotTradedCount'] ? +res['ClientsNotTradedCount'] : 0;
						this.cardSegments[2]['clients'] = res['DormantClientCount'] ? +res['DormantClientCount'] : 0;
						this.storage.set("businessOpportunitiesValue", res);
					}
					else {
						this.dormantClientValue = 0;
						this.clientsNotTradedValue = 0;
					}
				}));
	}

	public dashBoardDetails(token: any) {
		this.subscription = new Subscription();

		if(this.userID == null){
			return;
		}

		this.subscription.add(
			this.dashBoardService
				.dashBoardDetail(token, this.userID)
				.subscribe((res: any) => {
					let cards: any = [];
					if (res['Head']['ErrorCode'] == 0) {
						const response = res['Body']['objGetAAADashboardDataBody'][0];
						this.dataAsOn = res['Body']['DataAsOn'];
						let dashboardDetails = res['Body'];
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
						this.partnerClientValue = this.commonService.numberFormatWithCommaUnit(response['TotalClient']) ? this.commonService.numberFormatWithCommaUnit(response['TotalClient']) : 0;
						
						this.storage.set('partnerDetails', dashboardDetails);
						this.loading = false;
					} else {
						cards.forEach((element: any) => {
							element['value'] = this.commonService.numberFormatWithCommaUnit(0);
							element['title'] = '';
							element['lowerValue'] = '';
						});
						this.partnerClientValue = this.commonService.numberFormatWithCommaUnit(0) ? this.commonService.numberFormatWithCommaUnit(0) : 0;
						this.storage.set('partnerDetails', undefined);
						this.dataAsOn = null;
						this.loading = false;
					}
				})
		)
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
		this.clientCode = list['EmployeeCode'];
		this.storage.set('empCode', list['EmployeeCode']);
		setTimeout(() => {
			if (list['innerDetail'] && list['innerDetail'].length > 0) {
				recursiveList(list['innerDetail']);
			}
		});
		// }, 100);
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

    // go to notification page
    goToNotification() {
        this.router.navigate(['/notification']);
    }

	goToDashboard() {
        this.router.navigate(['/dashboard']);
    }

    // filter popup for base on client code and name
	async filterOption(ev: any) {
		ev.stopPropagation();
		//this.commonService.setData('clientCode');
		const popover = await this.popoverController.create({
			component: FilterPopupComponent,
            componentProps: {clientFilter: true, active: this.clientBlockSegmentValue},
			cssClass: "custom-popover filter-popover",
			mode: "md",
			showBackdrop: false,
			event: ev,
			//translucent: true
		});

		popover.onDidDismiss().then(data => {
            if (data["data"]) {
                const response = data['data'];

				this.searchTerm = ''

				
				
				this.commonService.setData(response['passData']);
                //this.datas = this.resetData
                if (response['passData'] === null) return;
                
                if(response['passData'] == 'clientCode'){
					this.placeholderInput = 'Type Client Code'
					this.clientBlockSegmentValue = "clientCode";
                }
				else if(response['passData'] == 'groupCode'){
					this.placeholderInput = 'Type Group Code';
					this.clientBlockSegmentValue = "partnerCode";
				}
                else if(response['passData'] == 'clientName'){
					this.placeholderInput = 'Type Name';
					this.clientBlockSegmentValue = "clientName";
                }
                   
           
            }
        })

		await popover.present();
	}

	segmentTabChanged(){
		this.searchTerm = null;
		this.startDate = "";
		this.endDate = "";
		this.sendDataToChild = false;
		// if(event == 'allClients'){
		// 	const obj = [
		// 		{ name: 'New Clients', value: 'newClients'},
		// 		{ name: 'MTD Active Clients', value: 'mtdClients'},
		// 		{ name: 'YTD Active Clients', value: 'ytdClients'},
		// 		{ name: 'View All Unique Clients', value: 'uniqueClients'}
		// 	];
		// 	this.commonService.setEvent('uniqueClientsEvent', obj);
		// }

	}
    // when click select
	select() {
		setTimeout(() => {
			this.isDropDownVisible = !this.isDropDownVisible;
		}, 500);
	}

    // when select and unselect child all
	selectUnselectChildAll(arr: any, ind?: any, parent?: any) {
		this.clientCode = null;
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

	caldcl(){
		this.removescroll = true;
	}

			toggleSwitch(val: any) {
				this.toggleVal = val;
				localStorage.setItem('toggleSwitch', val);
				this.getProductwiseData(this.dashboardType);
				this.sendDataToChild = true;
				this.clientBlockSegmentValue = "clientCode";
				this.placeholderInput = 'Type Client Code';
				this.searchTerm = '';
				if(val == 'Hierarchy'){
					this.segmentButtonOption = [];
					this.segmentButtonOption = [
						{name: 'Client Code/PAN', value: 'clientCode'},
						{name: 'Name', value: 'clientName'},
						{name: 'Group Code', value: 'partnerCode'}
					]
				}
				else{
					this.segmentButtonOption = [];
					this.segmentButtonOption = [
						{name: 'Client Code/PAN', value: 'clientCode'},
						{name: 'Name', value: 'clientName'}
					]
				}
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
		this.storage.set('empCode', item['EmployeeCode']);
		this.selectUnselectChildAll2(item)
		this.applyFilter()
		this.getProductwiseData(this.dashboardType,item['EmployeeCode']);
	}

	segmentChange() {
		this.searchTerm = '';
		this.sendDataToChild = false;
		if (this.clientBlockSegmentValue === 'clientName') {
			this.placeholderInput = 'Type Name';
		}
		else if(this.clientBlockSegmentValue === 'partnerCode'){
			this.placeholderInput = 'Type Group Code';
		}  
		else {
			this.placeholderInput = 'Type Client Code';
		}
	}

	public setData(obj: any) {
		this.clientCode = obj['clientCode'];
		this.totalClientsTabData = [];
		this.totalClientsTabData = obj['data'];
		this.totalClients = this.totalClientsTabData;
	}

	ngOnChanges() {

		this.removescroll = false;
		const newData = this.totalClientsTabData;
		this.totalClientsTabData = newData;
		const params = {
			code: this.clientCode,
			data: this.totalClientsTabData
		}
		this.setData(params);
	}

	public searchText(isFilterApplied?: any) {
		if (isFilterApplied) {
			this.sendDataToChild = true;
		} else {
			if(this.searchTerm != null){
				this.sendDataToChild = true;
			}
			else{
				this.sendDataToChild = false;
			}
		}
		
		// const obj = {
		// 	SearchText: this.searchTerm,
		// 	SearchBy: this.clientBlockSegmentValue,
		// 	page: 1
		// }
		// this.commonService.setEvent(this.clientBlockTabValue+'SearchText', obj);
		// if (this.searchTerm.length > 2) {
		// 	return;
		// } else {
		// 	this.commonService.setEvent(this.clientBlockTabValue+'SearchText', obj);
		// }
	}

	public onSegmentChanged(event: any) {
		this.searchTerm = null;
		this.storage.get('empCode').then( code => {
			const obj: any = {
				clientCode: code,
				value: event['detail']['value']
			}
			this.commonService.setData(obj);
		})
	}

	changeSearchText(){
		if (this.equityBlockTabValue === 'allClients') {
			this.sendDataToChild = this.searchTerm && this.searchTerm != null && this.searchTerm.length > 2 ? true : false;
			if(this.searchTerm == ''){
				this.sendDataToChild = true;
			}
		} 
		else {
			this.sendDataToChild = false;
		}	
		// console.log(event.length);
		// if(event.length == 0){
		// 	this.sendDataToChild = false;
		// }
	}

	goToPage(page: any) {
		if (page) {
			this.router.navigate(['/' + page]);
		} else {
			return;
		}
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

	/**
	* On click of excel button.
	* @param token 
	*/
	onExcelBtnClick() {	
		this.dataLoad = true;	
		this.commonService.setClevertapEvent('WebwireReport_Download', { 'PartnerCode': localStorage.getItem('userId1') });
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.downloadReport(token);
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.downloadReport(token);
				})
			}
		})
	}

	/**
	* To get Web Wire Dashboard Report.
	* @param token 
	*/
	downloadReport(token: any) {
		this.dashBoardService.clientWireDashboardReport(token, {PartnerCode: this.clientCode})
			.subscribe((res: any) => {
				if (res && res.Body && res.Body.length > 0) {
					this.reportData = res.Body;
					let info: any = [];
					let head = [["Login Id", "Name", "BRANCH", "Category", "Unclear Chque", "Undelivered", "ALB", "Gross", "BMFD Balance",  "AGHV", "GHV", "GHVC", "AHV", "AHVC", "ZHV", "THV", "THVC", "SPAN", "Net worth", "FD and BG", "Collateral Value", "Short Option Premium Value", "FO Value", "Currency Value", "BMFD Funded Stock", "BMFD Earmarked Stock", "DPC frequency", "MF Ledger", "Margin THV", "Margin AHV", "Margin GHV", "Cash Coll", "NonCash Coll", "ApplblNonCash", "Coll Benefit", "Cashbalanceincludingunsettledbills", "PMUL Loan Amount", "Trading Exch Selected", "IsDormant", "account open date", "Nominee", "Freeze"]];
					this.reportData.forEach((element: any) => {
						info.push([element.Loginid, element.Name, element.BRANCH, element.Category, element.UnclearChque, element.Undelivered, element.ALB, element.Gross, element.BMFDBalance,  element.AGHV, element.GHV, element.GHVC, element.AHV, element.AHVC, element.ZHV, element.THV, element.THVC,  element.SPAN, element.Networth, element.FDandBG, element.CollateralValue, element.ShortOptionPremiumValue, element.FOValue, element.CurrencyValue, element.BMFDFundedStock, element.BMFDEarmarkedStock, element.DPCfrequency, element.MFLedger, element.MarginTHV, element.MarginAHV, element.MarginGHV, element.CashColl, element.NonCashColl, element.ApplblNonCash, element.CollBenefit, element.Cashbalanceincludingunsettledbills, element.PMULLoanAmount, element.TradingExchSelected, element.IsDormant, moment(element.accountopendate).format('DD/MM/YYYY'), element.IsNominee, element.IsFreeze]);
					});
					this.commonService.exportDataToExcel(head[0], info, 'Web Wire Dashboard Report');
					this.dataLoad = false;	
				} else {
					this.toast.displayToast('No Data Found');
					this.dataLoad = false;	
				}
			});
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
		let details:any = [];
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
			let map: any = {}, node, res:any = [], i;
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
		x = x.sort((a:any, b:any) => {
			return b.EmployeeLevel - a.EmployeeLevel;
		});
		var result = x.filter((obj:any) => {
			return obj.EmployeeLevel !== ''
		})
		var logid = result.filter((obj:any) => {
			return obj.EmployeeCode == localStorage.getItem('userId1')
		})
		var notlogid = result.filter((obj:any) => {
			return obj.EmployeeCode != localStorage.getItem('userId1')
		})
		result = logid.concat(notlogid);
		var result1 = x.filter((obj:any) => {
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
		// this.subscription.unsubscribe();
		if(this.subscription){
			this.subscription = this.subscription.unsubscribe();
		}
	}


}
