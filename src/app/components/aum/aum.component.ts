import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart } from 'chart.js';
import { FilterPopupComponent } from '../filter-popup/filter-popup.component';
import { PopoverController } from '@ionic/angular';
import { Subscription, Subject } from 'rxjs';
import { DashBoardService } from '../../pages/dashboard/dashboard.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { MarketService } from '../../pages/markets/markets.service';
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
	selector: 'app-aum',
	providers: [MarketService, DashBoardService],
	templateUrl: './aum.component.html',
	styleUrls: ['./aum.component.scss'],
})
export class AumComponent implements OnInit {
	@ViewChild('dognutChart') dognutChart: any;
	@Input() aumTabData: any;
	@Input() chartData: any;
    public placeholderInput: string = 'Type Client Code';
	public equityBlockTabValue = localStorage.getItem('DashTabSelect') == 'Mutual Funds' ? 'mutualFund' : localStorage.getItem('DashTabSelect') == 'Equity' ? 'equity' : localStorage.getItem('DashTabSelect') == 'Cross-Sell' ? 'fd' : 'equity';
	public dognut: any;
	public equityBlock: any = [];
	public clientName: any = null;
	public clientCode: any = null;	
	public userID: any = null;
	public hightestLabel: any = null;
    public searchTerm: any = null;
    public segmentButtonOption: any[] = [
        {name: 'Client Code/PAN', value: 'clientCode'},
        {name: 'Name', value: 'clientName'}
    ]
    public clientBlockSegmentValue: string = "clientCode";
    public cardSegments: any[] = [
        // {name: 'Equity', segmentValue:'equity', dataValue: '45.00 Cr', perValue: '(5.21%)'},
        // {name: 'Mutual Funds', segmentValue:'mutualFund', dataValue: '45.00 Cr', perValue: '(5.21%)'},
        // {name: 'FD/Bonds/NCD', segmentValue:'fd', dataValue: '45.00 Cr', perValue: '(5.21%)'},
        // {name: 'PMS/AIF', segmentValue:'pms', dataValue: '45.00 Cr', perValue: '(5.21%)'},
        // {name: 'MLDs/Gold', segmentValue:'mlds', dataValue: '45.00 Cr', perValue: '(5.21%)'},
        // {name: 'AFYP', segmentValue:'afyp', dataValue: '45.00 Cr', perValue: '(5.21%)'},
    ]
    mutualFundSegmentValue: string = "totalAum";   // mutual fund segment default value;
    // segment option for mutual fund
    mutualFundBlock: any[] = [
        { Name: 'Total AUM', Value: 'totalAum'},
        { Name: 'New SIP', Value: 'newSIP'},
		{ Name: 'Live SIP', Value: 'liveSIP'}
    ];
    afypSegmentValue: string = "life";   // afyp segment default value;
    // segment option for afyp
    afypBlock: any[] = [
        { Name: 'Life Insurance', Value: 'life'},
        { Name: 'Health Insurance', Value: 'health'},
        { Name: 'General Insurance', Value: 'general'},
    ];
    public selectOptionArr: any[] = [];
    public isDropDownVisible: boolean = false;
	public showChart = false;
	displayHeader:any[] = [];
	clearHeaderDetails:any;
	sendDataToChild:boolean = false;
	private subscription: any;
	totalAfypData:any[] = [];
	afypMtdValue:any;
	afypYtdValue:any;
	totalSipValue:any = 0;
	totalSips:any = 0;
	toggleParam = 'Hierarchy';

	partnerAUMValue: any = null;
	partnerDetails: any = null;
	dataAsOn:any = null;

	searchHierarchyList : any;
	selectOptionArrCopy: any[] = [];
	public placeholderInputHierarchy: string = 'Search...';
	isShowCross = false;
	noRecord:boolean=false;
	private searchRmhierarchyTerms = new Subject<string>();
	loader:boolean = false;
	public isShow: boolean = false;
	public isDiv: boolean = false;
	public toggleVal: any = 'Hierarchy';
	tokenValue: any;
	prodata = false;

	constructor(private router: Router,private route: ActivatedRoute,
        private popoverController: PopoverController,
		private commonService: CommonService,
		private storage: StorageServiceAAA, private marService: MarketService, private dashBoardService: DashBoardService) { }

	ngOnInit() {
		if(localStorage.getItem('toggleSwitch')){
			this.toggleVal = localStorage.getItem('toggleSwitch');
		}
		if(this.toggleVal == 'Hierarchy'){
			this.segmentButtonOption = [];
			this.segmentButtonOption = [
				{name: 'Client Code/PAN', value: 'clientCode'},
				{name: 'Name', value: 'clientName'},
				{name: 'Group Code', value: 'groupCode'}
			]
		}
		else{
			this.segmentButtonOption = [];
			this.segmentButtonOption = [
				{name: 'Client Code/PAN', value: 'clientCode'},
				{name: 'Name', value: 'clientName'}
			]
		}

		const toggleState = localStorage.getItem('toggleSwitch');
		if(toggleState){
			this.toggleParam = toggleState;
		}

		this.route.queryParams.subscribe(params => {
				if(params['Tab'] == 'MF'){
					this.equityBlockTabValue = 'mutualFund';
					this.segmentBlockChange('mutualFund');
					if(params['SubTab'] == 'TotalNew' || params['SubTab'] == 'NewSip'){
						this.mutualFundSegmentValue = 'newSIP';
					}
					else if(params['SubTab'] == 'TotalLive' || params['SubTab'] == 'LiveSip'){
						this.mutualFundSegmentValue = 'liveSIP';
					}
				}
				else if(params['Tab'] == 'FD'){
					this.equityBlockTabValue = 'fd';
					this.segmentBlockChange('fd');
				}
				else if(params['Tab'] == 'MLD'){
					this.equityBlockTabValue = 'mlds';
					this.segmentBlockChange('mlds');
				}
				else if(params['Tab'] == 'PMS'){
					this.equityBlockTabValue = 'pms';
					this.segmentBlockChange('pms');
				}
				else{
					this.equityBlockTabValue = 'equity';
					this.segmentBlockChange('equity');
				}
      		}
	  	);

		this.subscription = new Subscription();
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
				this.partnerDetails = details;
				if(this.partnerDetails && this.partnerDetails['objGetAAADashboardDataBody'] && this.partnerDetails['objGetAAADashboardDataBody'][0] && this.partnerDetails['objGetAAADashboardDataBody'][0]['TotalAum']){
					this.partnerAUMValue = this.commonService.numberFormatWithCommaUnit(this.partnerDetails['objGetAAADashboardDataBody'][0]['TotalAum']);
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
							if (element['isChecked'] && this.userID === null) {
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
			let sum = 0;
			const response = this.chartData;
			for (const key in response) {
				if (Object.prototype.hasOwnProperty.call(response, key)) {
					if (key !== 'OthersAUM') sum = sum + response[key];
				}
			}

			if (sum !== 0) {
				this.showChart = true;
				this.dognut = new Chart(this.dognutChart.nativeElement, {
					type: 'doughnut',
					data: {
						labels: [
							'MLDs/Gold PTC',
							'FD/Bonds/NCDs',
							'Equity',
							'PMS/AIF',
							'Mutual Fund',
							// 'Others'
						],
						datasets: [{
							data: [+(this.chartData['MLDPTCAUM'] * 100 / sum).toFixed(2), +(this.chartData['FDBondNCDAUM']* 100 / sum).toFixed(2), +(this.chartData['EquityAUM']* 100 / sum).toFixed(2), +(this.chartData['PMSAIFAUM'] * 100 / sum).toFixed(2), +(this.chartData['MFAUM'] * 100 / sum).toFixed(2), 
								// +(this.chartData['OthersAUM'] * 100 / sum).toFixed(2)
							],
								backgroundColor: ['#4164B5', '#61B23A', '#FCC103', '#41B599', '#F9327A', 
								// '#35BAE9'
							], // array should have same number of elements as number of dataset
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
			
		}, 500);
		this.equityBlock = this.aumTabData;
		this.commonService.eventObservable.subscribe((obj) => {
			if (obj && obj['event'] === 'aumEvent') {
				const params: any = {
					code: obj['data']['clientCode'],
					data: obj['data']['value'],
				}
				if (obj['data']['chartData']) params['chartData'];
				this.setData(params);
				/* this.clientCode = obj['data']['clientCode'];
				this.aumTabData = [];
				this.aumTabData = obj['data']['value']; */
				
			}
		})
		const event: any = {
			detail: {
				value: this.equityBlockTabValue,
				clientCode: this.clientCode
			}
		}
		this.commonService.setData(event);
		this.getCommHeaderDetail();

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
	}

	toggleFlag(){
        this.isShow = true;
		this.isDiv = true;
    }
	
	toggleclose(){
        this.isShow = false;this.isDiv = false;
	}
	
	public getDataFromStorage(value: any,onLoad?: any, clicked?: any) {
		this.loader = true;
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.tokenValue = token; 
					this.dashBoardDetails(token);
					if (onLoad && value) {
						this.hierarchyList(token, true);
					}
					if (value === null && onLoad && !clicked) {
						this.aumDetails(token);
					}
					if (clicked) {
						this.aumDetails(token);
						const obj = {
							clientCode: this.clientCode
						}
						this.searchText();
					}
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.tokenValue = token;
					this.dashBoardDetails(token);
					if (onLoad && value) {
						this.hierarchyList(token, true);
					}
					if (value === null && onLoad && !clicked) {
						this.aumDetails(token);
					}
					if (clicked) {
						const obj = {
							clientCode: this.clientCode
						}
						this.searchText();
					}
				})
			}
		})
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
		// this.storage.set('hierarchyList', this.selectOptionArr);
        window.history.back();
	}
	
	segmentBlockChange(event: any){
		if (event == 'equity') {
			this.commonService.setClevertapEvent('AUM_Equity', { 'Login ID': localStorage.getItem('userId1') });
		} else if (event == 'mutualFund') {
			this.commonService.setClevertapEvent('AUM_MF', { 'Login ID': localStorage.getItem('userId1') });
		} else if (event == 'fd') {
			this.commonService.setClevertapEvent('AUM_FD', { 'Login ID': localStorage.getItem('userId1') });
		} else if (event == 'pms') {
			this.commonService.setClevertapEvent('AUM_PMS', { 'Login ID': localStorage.getItem('userId1') });
		} else if (event == 'mlds') {
			this.commonService.setClevertapEvent('AUM_MLD', { 'Login ID': localStorage.getItem('userId1') });
		} else if (event == 'afyp') {
			this.commonService.setClevertapEvent('AUM_AFYP', { 'Login ID': localStorage.getItem('userId1') });
		}
		this.searchTerm = null;
		this.sendDataToChild = false;
		if(event == 'afyp'){
			this.afypSegmentValue = "life"
			this.storage.get('userID').then((userID) => {
				this.storage.get('userType').then(type => {
					if (type === 'RM' || type === 'FAN') {
						this.storage.get('bToken').then(token => {
							this.afypDetails(token, userID)
						})
					} else {
						this.storage.get('subToken').then(token => {
							this.afypDetails(token, userID)
						})
					}
				})
			})
			
		
		}
	
	}

	public dashBoardDetails(token: any) {
		this.subscription = new Subscription();

		this.storage.get('partnerDetails').then((value) => {
			if(value){
				this.dataAsOn =  value.DataAsOn;
				this.partnerAUMValue = this.commonService.numberFormatWithCommaUnit(value['objGetAAADashboardDataBody'][0]['TotalAum']);
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
								this.partnerAUMValue = this.commonService.numberFormatWithCommaUnit(response['TotalAum']);
		
								this.storage.set('partnerDetails', dashboardDetails);
								this.loader = false;
							} else {
								cards.forEach((element: any) => {
								element['value'] = this.commonService.numberFormatWithCommaUnit(0);
								element['title'] = '';
								element['lowerValue'] = '';
							});
							this.partnerAUMValue = this.commonService.numberFormatWithCommaUnit(0);
							this.storage.set('partnerDetails', undefined);
							this.dataAsOn = null;
							this.loader = false;
						}
					})
					)
					// })
				}
			});
			// this.storage.get('bToken').then((btoken) => {
	}

	public aumDetails(token: any) {
		this.prodata = true;
		this.subscription = new Subscription();

		// this.commonService.setClevertapEvent('Dashboard_AUM');
		// this.storage.get('bToken').then((btoken) => {
		const body = {
			PartnerID: this.clientCode !== null && this.clientCode !== undefined ? this.clientCode : this.userID,
		}
		this.subscription.add(
			this.dashBoardService
				.getAUMDetail(token, body)
				.subscribe((res: any) => {
					if (res['Head']['ErrorCode'] == 0) {
						this.chartData = null;
						let sum = 0;
						const response = res['Body']['objGetAAAAUMDataBody'][0];
						for (const key in response) {
							if (Object.prototype.hasOwnProperty.call(response, key)) {
								if (key !== 'OthersAUM') sum = sum + response[key];
							}
						}

						// this.aumTabData = [];

						this.chartData = response;

						const obj = [
							// {name: 'Equity', segmentValue:'equity', dataValue: '45.00 Cr', perValue: '(5.21%)'},
							{ name: 'Equity', segmentValue: 'equity', perValue: response && response['EquityAUM'] ? '(' + (+response['EquityAUM'] * 100 / sum).toFixed(2) + ' %)': '(0.00 %)', dataValue: this.commonService.numberFormatWithCommaUnit(response['EquityAUM']) },
							{ name: 'Mutual Fund', segmentValue: 'mutualFund', perValue: response && response['MFAUM'] ? '(' + (+response['MFAUM'] * 100 / sum).toFixed(2) + ' %)': '(0.00 %)', dataValue: this.commonService.numberFormatWithCommaUnit(response['MFAUM']) },
							{ name: 'FD/Bonds/NCDs', segmentValue: 'fd', perValue: response && response['FDBondNCDAUM'] ? '(' + (+response['FDBondNCDAUM'] * 100 / sum).toFixed(2) + ' %)': '(0.00 %)', dataValue: this.commonService.numberFormatWithCommaUnit(response['FDBondNCDAUM']) },
							{ name: 'PMS/AIF', segmentValue: 'pms', perValue: response && response['PMSAIFAUM'] ? '(' + (+response['PMSAIFAUM'] * 100 / sum).toFixed(2) + ' %)': '(0.00 %)', dataValue: this.commonService.numberFormatWithCommaUnit(response['PMSAIFAUM']) },
							{ name: 'MLDs/Gold', segmentValue: 'mlds', perValue: response && response['MLDPTCAUM'] ? '(' + (+response['MLDPTCAUM'] * 100 / sum).toFixed(2) + ' %)': '(0.00 %)', dataValue: this.commonService.numberFormatWithCommaUnit(response['MLDPTCAUM']) },
							// { name: 'Others', value: 'others', changeValue: '(' + (+response['OthersAUM'] * 100 / sum).toFixed(2) + ' %)', dataValue: this.commonService.numberFormatWithCommaUnit(response['OthersAUM']), icon: 'other-circle-icon.svg', page: '' }
							{name: 'AFYP', segmentValue:'afyp', dataValue: response['AFYPAUMYTD'] ? this.commonService.numberFormatWithCommaUnit(response['AFYPAUMYTD']) : 0, perValue: response['AFYPAUMYTD'] ? '(' + (+response['AFYPAUMYTD'] * 100 / sum).toFixed(2) + ' %)' : ''},
						];
						this.cardSegments = obj;
						setTimeout(() => {
							// this.showLoader = false;
						}, 1000);
						this.prodata = false;
					} else {
						const obj = [
							// {name: 'Equity', segmentValue:'equity', dataValue: '45.00 Cr', perValue: '(5.21%)'},
							{ name: 'Equity', segmentValue: 'equity', perValue: '', dataValue: this.commonService.numberFormatWithCommaUnit(0) },
							{ name: 'Mutual Fund', segmentValue: 'mutualFund', perValue: '', dataValue: this.commonService.numberFormatWithCommaUnit(0) },
							{ name: 'FD/Bonds/NCDs', segmentValue: 'fd', perValue: '', dataValue: this.commonService.numberFormatWithCommaUnit(0) },
							{ name: 'PMS/AIF', segmentValue: 'pms', perValue: '', dataValue: this.commonService.numberFormatWithCommaUnit(0) },
							{ name: 'MLDs/Gold', segmentValue: 'mlds', perValue: '', dataValue: this.commonService.numberFormatWithCommaUnit(0) },
							// { name: 'Others', value: 'others', changeValue: '(' + (+response['OthersAUM'] * 100 / sum).toFixed(2) + ' %)', dataValue: this.commonService.numberFormatWithCommaUnit(response['OthersAUM']), icon: 'other-circle-icon.svg', page: '' }
							{name: 'AFYP', segmentValue:'afyp', dataValue: '0', perValue: ''},
						];
						this.cardSegments = obj;
						setTimeout(() => {
							// this.showLoader = false;
						}, 1000);
						this.prodata = false;
					}
				})
		)
		// })
	}


	afypDetails(token: any, userId: any){
		
		this.subscription.add(
			this.dashBoardService
				.getAFYPDetail(token, userId)
				.subscribe((res: any) => {
					//this.totalAFYPChartData = null;
				
					//this.totalAFYPChartData = response;
					if (res['Head']['ErrorCode'] == 0) {
						const response = res['Body'][0];
						let sum = 0;
						for (const key in response) {
							if (Object.prototype.hasOwnProperty.call(response, key)) {
								sum = sum + parseInt(response[key]);
							}
						}
						// const obj = [
						// 	{ name: 'Life Insurance', value: 'life', changeValue: +response['LifeInsuranceYTD'] > 0 && (+response['LifeInsuranceMTD'] > 0) ? '(' + ((+response['LifeInsuranceYTD'] + (+response['LifeInsuranceMTD'])) * 100 / sum).toFixed(2) + ' %)' : '(0.00)', ytd: +response['LifeInsuranceYTD'] > 0 ? '(' + (+response['LifeInsuranceYTD'] * 100 / sum).toFixed(2) + ' %)' : '0.00', mtd: +response['LifeInsuranceMTD'] > 0 ? '(' + (+response['LifeInsuranceMTD'] * 100 / sum).toFixed(2) + ' %)' : '0.00', icon: 'equity-circle-icon.svg', page: 'afyp-life-insurance' },
						// 	{ name: 'Health Insurance', value: 'health', changeValue: +response['HealthInsuranceYTD'] > 0 && (+response['HealthInsuranceMTD'] > 0) ? '(' + ((+response['HealthInsuranceYTD'] + (+response['HealthInsuranceMTD'])) * 100 / sum).toFixed(2) + ' %)' : '(0.00)', ytd: +response['HealthInsuranceYTD'] > 0 ? '(' + (+response['HealthInsuranceYTD'] * 100 / sum).toFixed(2) + ' %)' : '0.00', mtd: +response['HealthInsuranceMTD'] > 0 ? '(' + (+response['HealthInsuranceMTD'] * 100 / sum).toFixed(2) + ' %)' : '0.00', icon: 'red-circle-icon.svg', page: 'afyp-health-insurance' },
						// 	{ name: 'General Insurance', value: 'general', changeValue: +response['GeneralInsuranceMTD'] > 0 && (+response['GeneralInsuranceYTD'] > 0) ? '(' + ((+response['GeneralInsuranceMTD'] + (+response['GeneralInsuranceYTD'])) * 100 / sum).toFixed(2) + ' %)' : '(0.00)', ytd: +response['GeneralInsuranceYTD'] > 0 ? '(' + (+response['GeneralInsuranceYTD'] * 100 / sum).toFixed(2) + ' %)' : '0.00', mtd: +response['GeneralInsuranceMTD'] > 0 ? '(' + (+response['GeneralInsuranceMTD'] * 100 / sum).toFixed(2) + ' %)' : '0.00', icon: 'other-circle-icon.svg', page: 'afyp-general-insurance' },
						// ];
						this.totalAfypData = [
							{ name: 'Life Insurance', value: 'life', changeValue: +response['LifeInsuranceYTD'] > 0 && (+response['LifeInsuranceMTD'] > 0) ? '(' + ((+response['LifeInsuranceYTD'] + (+response['LifeInsuranceMTD'])) * 100 / sum).toFixed(2) + ' %)' : '(0.00)', ytd: +response['LifeInsuranceYTD'] > 0 ? this.commonService.numberFormatWithCommaUnit(response['LifeInsuranceYTD']) : '0.00', mtd: +response['LifeInsuranceMTD'] > 0 ? response['LifeInsuranceMTD'] : '0.00', icon: 'equity-circle-icon.svg', page: 'afyp-life-insurance' },
							{ name: 'Health Insurance', value: 'health', changeValue: +response['HealthInsuranceYTD'] > 0 && (+response['HealthInsuranceMTD'] > 0) ? '(' + ((+response['HealthInsuranceYTD'] + (+response['HealthInsuranceMTD'])) * 100 / sum).toFixed(2) + ' %)' : '(0.00)', ytd: +response['HealthInsuranceYTD'] > 0 ? this.commonService.numberFormatWithCommaUnit(response['HealthInsuranceYTD']) : '0.00', mtd: +response['HealthInsuranceMTD'] > 0 ? this.commonService.numberFormatWithCommaUnit(response['HealthInsuranceMTD']) : '0.00', icon: 'red-circle-icon.svg', page: 'afyp-health-insurance' },
							{ name: 'General Insurance', value: 'general', changeValue: +response['GeneralInsuranceMTD'] > 0 && (+response['GeneralInsuranceYTD'] > 0) ? '(' + ((+response['GeneralInsuranceMTD'] + (+response['GeneralInsuranceYTD'])) * 100 / sum).toFixed(2) + ' %)' : '(0.00)', ytd: +response['GeneralInsuranceYTD'] > 0 ? this.commonService.numberFormatWithCommaUnit(response['GeneralInsuranceYTD']) : '0.00', mtd: +response['GeneralInsuranceMTD'] > 0 ? this.commonService.numberFormatWithCommaUnit(response['GeneralInsuranceMTD']) : '0.00', icon: 'other-circle-icon.svg', page: 'afyp-general-insurance' },
						];
						//this.totalAFYPTabData = obj;
					
					} else {
						this.totalAfypData = [
							{ name: 'Life Insurance', value: 'life', changeValue: '0.00', ytd: '0.00', mtd: '0', icon: 'equity-circle-icon.svg', page: 'afyp-life-insurance' },
							{ name: 'Health Insurance', value: 'health', changeValue: '0.00', ytd: '0.00', mtd: '0', icon: 'red-circle-icon.svg', page: 'afyp-health-insurance' },
							{ name: 'General Insurance', value: 'general', changeValue: '0.00', ytd: '0.00', mtd: '0', icon: 'other-circle-icon.svg', page: 'afyp-general-insurance' },
						];
					
					}
					
					this.afypMtdValue = this.totalAfypData[0].mtd
					this.afypYtdValue = this.totalAfypData[0].ytd
				})
				
		)
	}

	segmentAfypBlockChange(event: any){
		// $event.detail.value		review. removed this from html
		this.sendDataToChild = false;
		this.searchTerm = null
		if(event.detail.value == 'life'){
			this.afypMtdValue = this.totalAfypData[0].mtd
			this.afypYtdValue = this.totalAfypData[0].ytd
		}
		else if(event.detail.value == 'health'){
			this.afypMtdValue = this.totalAfypData[1].mtd
			this.afypYtdValue = this.totalAfypData[1].ytd
		}
		else{
			this.afypMtdValue = this.totalAfypData[2].mtd
			this.afypYtdValue = this.totalAfypData[2].ytd
		}
		
	}

	segmentMfBlockChange(event: any){
		this.searchTerm = '';
		this.sendDataToChild = false;
		this.totalSipValue = 0;
		this.totalSips = 0;
	}

	sipValueDisplay(event: any){
		// console.log(event);
		this.totalSipValue = event.TotalSIPValue;
		this.totalSips = event.TotalSips
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
                // console.log(response['passData']);

				this.searchTerm = ''

				this.sendDataToChild = false;
				
				this.commonService.setData(response['passData']);
                //this.datas = this.resetData
                if (response['passData'] === null) return;
                
                if(response['passData'] == 'clientCode'){
					this.placeholderInput = 'Type Client Code'
					this.clientBlockSegmentValue = "clientCode";
                }
				else if(response['passData'] == 'groupCode'){
					this.placeholderInput = 'Type Group Code';
					this.clientBlockSegmentValue = "groupCode";
				}
                else if(response['passData'] == 'clientName'){
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
		} 
		else if(this.clientBlockSegmentValue === 'groupCode'){
			this.placeholderInput = 'Type Group Code';
		} 
		else {
			this.placeholderInput = 'Type Client Code';
		}
	}

	changeSearchText(event: any){
		this.sendDataToChild = false;
	}

	public setData(obj: any) {
		this.clientCode = obj['clientCode'];
		this.aumTabData = [];
		this.aumTabData = obj['data'];
		this.equityBlock = this.aumTabData;
		this.chartData = obj['chartData'];

		let sum = 0;
			const response = this.chartData;
			for (const key in response) {
				if (Object.prototype.hasOwnProperty.call(response, key)) {
					if (key !== 'OthersAUM') sum = sum + response[key];
				}
			}
			
			if (sum !== 0) {
				this.showChart = true;
				this.dognut = new Chart(this.dognutChart.nativeElement, {
					type: 'doughnut',
					data: {
						labels: [
							'MLDs/Gold PTC',
							'FD/Bonds/NCDs',
							'Equity',
							'PMS/AIF',
							'Mutual Fund',
							// 'Others'
						],
						datasets: [{
							data: [+(this.chartData['MLDPTCAUM'] * 100 / sum).toFixed(2), +(this.chartData['FDBondNCDAUM']* 100 / sum).toFixed(2), +(this.chartData['EquityAUM']* 100 / sum).toFixed(2), +(this.chartData['PMSAIFAUM'] * 100 / sum).toFixed(2), +(this.chartData['MFAUM'] * 100 / sum).toFixed(2), 
								// +(this.chartData['OthersAUM'] * 100 / sum).toFixed(2)
							],
								backgroundColor: ['#4164B5', '#61B23A', '#FCC103', '#41B599', '#F9327A', 
								// '#35BAE9'
							], // array should have same number of elements as number of dataset
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
		// console.log('on change');
		const newData = this.aumTabData;
		this.aumTabData = newData;
		const params = {
			code: this.clientCode,
			data: this.aumTabData,
			chartData: this.chartData
		}
		this.setData(params);
	}

	public searchText() {
		this.sendDataToChild = true;
		// const obj = {
		// 	SearchText: this.searchTerm,
		// 	SearchBy: this.clientBlockSegmentValue,
		// 	page: 1
		// }
		// 	this.commonService.setEvent(this.equityBlockTabValue+'SearchText', obj);
		
		// if (this.searchTerm.length > 2) {
		// 	return;
		// } else {
		// 	this.commonService.setEvent(this.equityBlockTabValue+'SearchText', obj);
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
			/* if (event['detail']['value'] === 'equity') {
				this.commonService.setEvent('equityEvent', obj);
			} else if (event['detail']['value'] === 'mutualFund') {
				this.commonService.setEvent('mutualFundEvent', obj);
			} else if (event['detail']['value'] === 'fd') {
				this.commonService.setEvent('fdEvent', obj);
			} else if (event['detail']['value'] === 'pms') {
				this.commonService.setEvent('pmsEvent', obj);
			} else if (event['detail']['value'] === 'mlds') {
				this.commonService.setEvent('mldsEvent', obj);
			} */
		})
	}

	goToPage(page: any){
		if (page) {
			/* this.commonService.setData(obj);
			if (this.equityBlockTabValue === 'equity') {
				this.commonService.setEvent('equityEvent', obj);
			} else if (this.equityBlockTabValue === 'mutualFund') {
				this.commonService.setEvent('mutualFundEvent', obj);
			} else if (this.equityBlockTabValue === 'fd') {
				this.commonService.setEvent('fdEvent', obj);
			} else if (this.equityBlockTabValue === 'pms') {
				this.commonService.setEvent('pmsEvent', obj);
			} else if (this.equityBlockTabValue === 'mlds') {
				this.commonService.setEvent('mldsEvent', obj);
			} */
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

	ionViewWillEnter() {
		const toggleState = localStorage.getItem('toggleSwitch');
		if (toggleState) {
			this.toggleParam = toggleState;
		}
	}

	ionViewWillLeave() {
		clearTimeout(this.clearHeaderDetails);
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

	ngOnDestroy() {
		clearTimeout(this.clearHeaderDetails);
		this.subscription = this.subscription.unsubscribe();
	}

	toggleSwitch(val: any) {
		this.toggleVal = val;
		localStorage.setItem('toggleSwitch', val);
		this.aumDetails(this.tokenValue);
		this.sendDataToChild = true;
		this.clientBlockSegmentValue = "clientCode";
		this.placeholderInput = 'Type Client Code';
		this.searchTerm = '';
		if(val == 'Hierarchy'){
			this.segmentButtonOption = [];
			this.segmentButtonOption = [
				{name: 'Client Code/PAN', value: 'clientCode'},
				{name: 'Name', value: 'clientName'},
				{name: 'Group Code', value: 'groupCode'}
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
}
