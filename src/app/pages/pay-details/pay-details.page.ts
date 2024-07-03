import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// import { IonSlides } from '@ionic/angular';		review
import { Chart } from 'chart.js';
import { PayDetailsService } from './pay-details.service';
import {forkJoin, Subject, Subscription} from 'rxjs';
import { Router } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';
import { DashBoardService } from '../dashboard/dashboard.service';
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
	selector: 'app-pay-details',
	providers: [ PayDetailsService, DashBoardService ],
	templateUrl: './pay-details.page.html',
	styleUrls: ['./pay-details.page.scss'],
})
export class PayDetailsPage{
	@ViewChild('dognutChart') dognutChart: any;
	//@ViewChild('Slides', { static: false }) slider: any;	//IonSlides;		review

	@ViewChild('Slides') slider: ElementRef | undefined ;


	public dognut: any;
	public tableOption: any = null;
	sliderIndex: number  = 0;
	public customIndex: number = 0;
	fdTabList: any[] = [];
	bondsTabList: any[] = [];
	PmsTabList: any[] = [];
	mldTabList:any[] = [];
	ncdTabList:any[] = [];
	mfTabList:any[] = [];
	insuranceTabList:any[] = [];
	insuranceTabList1:any[] = [];
	aifTabList:any[] = [];
	GoldPtcTabList:any[] = [];
	monthYearDropDown:any[] = [];
	totalPayDetails:any[] = [];
	totalPayoutValue:any;
	public dataLoad:boolean = false;
	tokenValue:any;
	PayoutMonth:any;
	monthYearList:any[] = [];
	isMobile = false;
	equityBlockSegment: any[] = [
		{ changeValue: '25.33', dataValue: '42.00 L', icon: 'equity-circle-icon.svg', name: 'Broking', symbol: 'equity'},
		{ changeValue: '25.33', dataValue: '42.00 L', icon: 'insurance.svg', name: 'Insurance', symbol: 'insu'},
		{ changeValue: '25.33', dataValue: '42.00 L', icon: 'mutual_fund.svg', name: 'Mutual Fund', symbol: 'mf'},
		{ changeValue: '25.33', dataValue: '42.00 L', icon: 'pay_fixed_deposit.svg', name: 'Fixed Deposit', symbol: 'deposit'},
		{ changeValue: '25.33', dataValue: '42.00 L', icon: 'pay_bonds.svg', name: 'Bonds', symbol: 'bonds'},
		{ changeValue: '25.33', dataValue: '42.00 L', icon: 'ncd.svg', name: 'NCD', symbol: 'ncd'},
		{ changeValue: '25.33', dataValue: '42.00 L', icon: 'mld.svg', name: 'MLD', symbol: 'mld'},
		{ changeValue: '25.33', dataValue: '42.00 L', icon: 'aif.svg', name: 'AIF', symbol: 'aif'},
		{ changeValue: '25.33', dataValue: '42.00 L', icon: 'pms.svg', name: 'PMS', symbol: 'pms'},
		{ changeValue: '25.33', dataValue: '42.00 L', icon: 'gold_ptc.svg', name: 'Gold PTC', symbol: 'gold' }
	]
	slideOpts: any = {
		initialSlide: 0,
		slidesPerView: 7,
		speed: 400,
		arrow: true,
		navigation: true,
	};

	public val: string = 'asc';
	public selectOptionArr: any = [];
	public clientCode: any = null;
	public clientName: any = null;
	public clientType: any = null;
	public userID: any = null;
	public isDropDownVisible: any = false;
	public ascending: boolean = true;
	order?: string;
	public reverse: boolean = false;
	optionArrCpy: any = [];
	showDropDown = false;
	isShowCross = false;
	noRecord:boolean=false;
	private searchRmhierarchyTerms = new Subject<string>();
	public placeholderInputHierarchy: string = 'Search...';
	searchHierarchyList : any;
	newChartOptions: any = {
		responsive: true,
		plugins: {
			legend: {
				display: false
			}
		}
	}
	newChartLabels: string[] = [
		'Equity', 'Insurance', 'Mutual Fund', 'Fixed Deposit',
		'Bonds', 'NCD', 'MLD', 'AIF', 'PMS','Gold PTC'
	];
	newChartData: any[] = [
		{ data: [], backgroundColor: ['#4164B5', '#35BAE9', '#A65628', '#BEAED4', '#FF7F00', '#F781BF', '#984EA3', '#F9327A', '#61B23A', '#FCC103'], borderWidth: 0 }
	];

	constructor(private storage: StorageServiceAAA, private router: Router, private payDetService: PayDetailsService, private commonService: CommonService, private platform: Platform,
		private dashBoardService: DashBoardService) { }


	ngOnInit() {
		this.order = 'Symbol';
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

    ionViewWillEnter() {
		this.monthYearList = this.commonService.last12Month();
		this.clientName = localStorage.getItem("userName");
		if(localStorage.getItem('payDetailMonth') == undefined){
			this.PayoutMonth = this.monthYearList[1];
		}
		   else{
			this.PayoutMonth = localStorage.getItem('payDetailMonth');
		}
		this.storage.get('userID').then( ID => {
			this.clientCode = ID;
			this.getDataFromStorage(ID, true, false);
		})

		this.order = 'Symbol';

		/* this.hierarchyList(token, ID);
		this.initChartData(token,this.PayoutMonth) */
		
	}

	public getDataFromStorage(value: any, onLoad?: any, clicked?: any) {
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					// this.dashBoardDetails(token);
					if (onLoad) {
						this.initChartData(token,this.PayoutMonth, value);
						// this.hierarchyList(token, value);
					}
					if (clicked) {
						this.initChartData(token,this.PayoutMonth, value);
					}
				})
			} else {
				this.storage.get('subToken').then(token => {
					// this.dashBoardDetails(token);
					if (onLoad) {
						this.initChartData(token,this.PayoutMonth, value);
						// this.hierarchyList(token, value);
					}
					if (clicked) {
						this.initChartData(token,this.PayoutMonth, value);
					}
				})
			}
		})
	}

	public hierarchyList(token: any, userID: any) {
		this.storage.get('empCode').then(details => {
			if (details == null) {
				this.userID = localStorage.getItem('userId1');
			}
			else {
				this.userID = details;
			}
			this.clientCode = this.userID;
		});
		const subscription = new Subscription();

		subscription.add(
			this.dashBoardService
				.getHierarchyList(token, userID)
				.subscribe((res: any) => {
					if (res['Head']['ErrorCode'] == 0) {
						const Details = res['Body']['Details'];
						let highestLeveID: any = null;
						const newOBJ: any = [];
						for (var j = 0; j < Details.length; j++) {
							if (+Details[j]['EmployeeLevel'] === 5) {
								highestLeveID = +Details[j]['EmployeeLevel'];

								newOBJ.push({ checkboxValue: Details[j]['EmployeeCode'], isChecked: true, name: Details[j]['EmployeeName'], type: 'Individual' });

								this.storage.set('empCode', Details[j]['EmployeeCode']);
								this.clientCode = Details[j]['EmployeeCode'];
								this.clientName = Details[j]['EmployeeName'];
								this.clientType = 'Individual';
								break;
							} else if (+Details[j]['EmployeeLevel'] === 4) {
								highestLeveID = +Details[j]['EmployeeLevel'];
								newOBJ.push({ checkboxValue: Details[j]['EmployeeCode'], isChecked: true, name: Details[j]['EmployeeName'], type: 'Individual' });
								this.storage.set('empCode', Details[j]['EmployeeCode']);
								this.clientCode = Details[j]['EmployeeCode'];
								this.clientName = Details[j]['EmployeeName'];
								this.clientType = 'Individual';
								break;
							} else if (+Details[j]['EmployeeLevel'] === 3) {
								highestLeveID = +Details[j]['EmployeeLevel'];
								newOBJ.push({ checkboxValue: Details[j]['EmployeeCode'], isChecked: true, name: Details[j]['EmployeeName'], type: 'Individual' });
								this.storage.set('empCode', Details[j]['EmployeeCode']);
								this.clientCode = Details[j]['EmployeeCode'];
								this.clientName = Details[j]['EmployeeName'];
								this.clientType = 'Individual';
								break;
							} else if (+Details[j]['EmployeeLevel'] === 2) {
								highestLeveID = +Details[j]['EmployeeLevel'];
								newOBJ.push({ checkboxValue: Details[j]['EmployeeCode'], isChecked: true, name: Details[j]['EmployeeName'], type: 'Individual' });
								this.storage.set('empCode', Details[j]['EmployeeCode']);
								this.clientCode = Details[j]['EmployeeCode'];
								this.clientName = Details[j]['EmployeeName'];
								this.clientType = 'Individual';
								break;
							} else if (+Details[j]['EmployeeLevel'] === 1) {
								highestLeveID = +Details[j]['EmployeeLevel'];
								newOBJ.push({ checkboxValue: Details[j]['EmployeeCode'], isChecked: true, name: Details[j]['EmployeeName'], type: 'Individual' });
								this.storage.set('empCode', Details[j]['EmployeeCode']);
								this.clientCode = Details[j]['EmployeeCode'];
								this.clientName = Details[j]['EmployeeName'];
								this.clientType = 'Individual';
								break;
							}else if (Details[j]['EmployeeLevel'] === '' && Details.length == 1) {
								highestLeveID = 0;
								newOBJ.push({ checkboxValue: Details[j]['EmployeeCode'], isChecked: true, name: Details[j]['EmployeeName'], type: 'Individual' });
								this.storage.set('empCode', Details[j]['EmployeeCode']);
								this.clientCode = Details[j]['EmployeeCode'];
								this.clientName = Details[j]['EmployeeName'];
								this.clientType = 'Individual';
								break;
							}
						}

						var obj: any = [];
						Details.forEach(function (ele: any) {
							if (+ele['EmployeeLevel'] === highestLeveID - 1) {
								obj.push({
									checkboxValue: ele['EmployeeCode'], isChecked: true, name: ele['EmployeeName'] ? ele['EmployeeName'] : ele['EmployeeCode'], type: 'All Accounts',
								})

							}
							/* else if (+ele['EmployeeLevel'] === 3 && highestLeveID != 3) {
								obj.push({
									checkboxValue: ele['EmployeeCode'], isChecked: false, name: ele['EmployeeName'], type: 'All Accounts',
								})
								
							} else if (+ele['EmployeeLevel'] === 2 && highestLeveID != 2) {
								obj.push({
									checkboxValue: ele['EmployeeCode'], isChecked: false, name: ele['EmployeeName'], type: 'All Accounts',
								})
								
							} else if (+ele['EmployeeLevel'] === 1 && highestLeveID != 1) {
								obj.push({
									checkboxValue: ele['EmployeeCode'], isChecked: false, name: ele['EmployeeName'], type: 'Individual',
								})
								
							} */
						})
						if (obj.length) {
							newOBJ[0]['innerDetail'] = obj;
							let tempArray:any = [];
							newOBJ[0]["innerDetail"].forEach(function (elem: any) {
								tempArray = [];
								for (var i = 0; i < Details.length; i++) {

									if (elem['checkboxValue'] === Details[i]['ManagerCode'] && +Details[i]['EmployeeLevel'] === 3) {
										tempArray.push({
											checkboxValue: Details[i]['EmployeeCode'], isChecked: true, name: Details[i]['EmployeeName'], type: 'All Accounts',
										})
									} else if (elem['checkboxValue'] === Details[i]['ManagerCode'] && +Details[i]['EmployeeLevel'] === 2) {
										tempArray.push({
											checkboxValue: Details[i]['EmployeeCode'], isChecked: true, name: Details[i]['EmployeeName'], type: 'All Accounts',
										})
									} else if (elem['checkboxValue'] === Details[i]['ManagerCode'] && +Details[i]['EmployeeLevel'] === 1) {
										tempArray.push({
											checkboxValue: Details[i]['EmployeeCode'], isChecked: true, name: Details[i]['EmployeeName'], type: 'All Accounts',
										})
									} else if (elem['checkboxValue'] === Details[i]['ManagerCode'] && Details[i]['EmployeeLevel'] === '') {
										tempArray.push({
											checkboxValue: Details[i]['EmployeeCode'], isChecked: true, name: Details[i]['EmployeeName'], type: 'All Accounts',
										})
									}
								}

								if (tempArray.length) {
									var tempArray2:any = [];
									tempArray.forEach(function (ele: any) {
										tempArray2 = [];
										for (var j = 0; j < Details.length; j++) {

											if (ele['checkboxValue'] === Details[j]['ManagerCode'] && +Details[j]['EmployeeLevel'] === 2) {
												tempArray2.push({
													checkboxValue: Details[j]['EmployeeCode'], isChecked: true, name: Details[j]['EmployeeName'], type: 'All Accounts',
												})
											} else if (ele['checkboxValue'] === Details[j]['ManagerCode'] && +Details[j]['EmployeeLevel'] === 1) {
												tempArray2.push({
													checkboxValue: Details[j]['EmployeeCode'], isChecked: true, name: Details[j]['EmployeeName'], type: 'Individual',
												})
											} else if (ele['checkboxValue'] === Details[j]['ManagerCode'] && Details[j]['EmployeeLevel'] === '') {
												tempArray2.push({
													checkboxValue: Details[j]['EmployeeCode'], isChecked: true, name: Details[j]['EmployeeName'] ? Details[j]['EmployeeName'] : Details[j]['EmployeeCode'], type: 'Individual',
												})
											}
										}


										if (tempArray2.length) {
											var tempArray3:any = [];

											tempArray2.forEach(function (innerEle: any) {
												tempArray3 = [];
												for (var j = 0; j < Details.length; j++) {
													if (innerEle['checkboxValue'] === Details[j]['ManagerCode'] && +Details[j]['EmployeeLevel'] === 1) {
														tempArray3.push({
															checkboxValue: Details[j]['EmployeeCode'], isChecked: true, name: Details[j]['EmployeeName'],
															type: 'Individual',
														})
													} else if (innerEle['checkboxValue'] === Details[j]['ManagerCode'] && Details[j]['EmployeeLevel'] === '') {
														tempArray3.push({
															checkboxValue: Details[j]['EmployeeCode'], isChecked: true, name: Details[j]['EmployeeName'] ? Details[j]['EmployeeName'] : Details[j]['EmployeeCode'],
															type: 'Individual',
														})
													}
												}

												if (tempArray3.length) {
													innerEle['innerDetail'] = tempArray3;
												}

											})


											ele['innerDetail'] = tempArray2;
										}
									})

									elem['innerDetail'] = tempArray;
								}
							})
						}
						this.selectOptionArr = newOBJ;
					}
				})
		)
	}

	// when click select
	select() {
		console.log('select clicked');
		setTimeout(() => {
			this.isDropDownVisible = !this.isDropDownVisible;
		}, 500);
	}

	// open and hide option
	openHide(index: any, arr: any) {
		arr.forEach((element: any, ind: any) => {
			if ((index) === ind) {
				element['isVisible'] = element['isVisible'] ? false : true;
			}
		});
	}

	// when select and unselect child all
	selectUnselectChildAll(arr: any, ind?: any, parent?: any) {
		this.clientCode = null;

		if (parent) {
			parent['isChecked'] = false;
		}

		setTimeout(() => {
			// if (parent['innerDetail'][ind]['isChecked']) {
			arr.forEach((element: any, index: any) => {
				if (index !== ind) {
					element['isChecked'] = false;
					if (element['innerDetail'] && element['innerDetail'].length) {
						element['innerDetail'].forEach((innerEle: any) => {
							innerEle['isChecked'] = false;
							if (innerEle['innerDetail'] && innerEle['innerDetail'].length) {
								innerEle['innerDetail'].forEach((subEle: any) => {
									subEle['isChecked'] = false;
								});
							}
						});
					}
				}
				else element['isChecked'] = true;
			});
			// }
			arr.forEach((element: any) => {
				if (element['isChecked']) {
					this.clientCode = element['checkboxValue'];
					this.clientName = element['name'];
					this.clientType = element['type'];
					if (element['innerDetail']) {
						element['innerDetail'].forEach((elem: any, idx: any) => {
							elem['isChecked'] = true;
						});
					}
				} else {
					if (element['innerDetail']) {
						element['innerDetail'].forEach((elem: any, idx: any) => {
							elem['isChecked'] = false;
						});
					}
				}
			});
		});
	}
	
	public applyFilter() {
		this.isDropDownVisible = !this.isDropDownVisible;
		this.showDropDown = !this.showDropDown;
		const obj = {
			clientCode: this.clientCode
		}
		this.userID = this.clientCode;
		// console.log(this.userID);
		this.customIndex = 10;
		this.getDataFromStorage(this.clientCode, false, true);
		
	}

	public initChartData(tokenValue: any,month: any, ID?: any){
	this.dataLoad = false;
	ID = this.clientCode;
	this.customIndex = 0;
		setTimeout(() => {
				// this.storage.get('userID').then((ID) => {
					this.payDetService.getTotalPayoutDetails(tokenValue, ID, month).subscribe((res: any) => {

						if(res['Body'] == null){
							this.totalPayoutValue = 0;
							this.equityBlockSegment = [
								{ srNo:1,dataValue: 0,  name: 'Broking ', symbol: 'equity', icon: 'equity-circle-icon.svg'},
								{ srNo:2,dataValue: 0,  name: 'Insurance', symbol: 'insu', icon: 'insurance.svg'},
								{ srNo:3,dataValue: 0,  name: 'Mutual Fund', symbol: 'mf', icon: 'mutual_fund.svg'},
								{ srNo:4,dataValue: 0,  name: 'Fixed Deposit', symbol: 'deposit', icon: 'pay_fixed_deposit.svg'},
								{ srNo:5,dataValue: 0,  name: 'Bonds', symbol: 'bonds', icon: 'pay_bonds.svg'},
								{ srNo:6,dataValue: 0,  name: 'NCD', symbol: 'ncd', icon: 'ncd.svg'},
								{ srNo:7,dataValue: 0,  name: 'MLD', symbol: 'mld', icon: 'mld.svg'},
								{ srNo:8,dataValue: 0,  name: 'AIF', symbol: 'aif', icon: 'aif.svg'},
								{ srNo:9,dataValue: 0,  name: 'PMS', symbol: 'pms', icon: 'pms.svg'},
								{ srNo:10,dataValue: 0,  name: 'Gold PTC', symbol: 'gold', icon: 'gold_ptc.svg'}
							]
							this.dataLoad = true;
						}
						else{
							this.totalPayDetails = res['Body']['GetAAATotalPayoutData'];
							this.totalPayoutValue = this.totalPayDetails[0].TotalPayout;
							this.equityBlockSegment = [
								{ srNo:1, dataValue: this.totalPayDetails[0].EquityPayout,  name: 'Broking', symbol: 'equity', icon: 'equity-circle-icon.svg'},
								{ srNo:2, dataValue: this.totalPayDetails[0].InsurancePayout,  name: 'Insurance', symbol: 'insu', icon: 'insurance.svg'},
								{ srNo:3,dataValue: this.totalPayDetails[0].MFPayout,  name: 'Mutual Fund', symbol: 'mf', icon: 'mutual_fund.svg'},
								{ srNo:4,dataValue: this.totalPayDetails[0].FDPayout,  name: 'Fixed Deposit', symbol: 'deposit', icon: 'pay_fixed_deposit.svg'},
								{ srNo:5,dataValue: this.totalPayDetails[0].BondsPayout,  name: 'Bonds', symbol: 'bonds', icon: 'pay_bonds.svg'},
								{ srNo:6,dataValue: this.totalPayDetails[0].NCDPayout,  name: 'NCD', symbol: 'ncd', icon: 'ncd.svg'},
								{ srNo:7,dataValue: this.totalPayDetails[0].MLDPayout,  name: 'MLD', symbol: 'mld', icon: 'mld.svg'},
								{ srNo:8,dataValue: this.totalPayDetails[0].AIFPayout,  name: 'AIF', symbol: 'aif', icon: 'aif.svg'},
								{ srNo:9,dataValue: this.totalPayDetails[0].PMSPayout,  name: 'PMS', symbol: 'pms', icon: 'pms.svg'},
								{ srNo:10,dataValue: this.totalPayDetails[0].PTCPayout,  name: 'Gold PTC', symbol: 'gold', icon: 'gold_ptc.svg'}
							]
							setTimeout(() => {
								this.dataLoad = true;
							}, 500);
						}
					
						setTimeout(() => {
							let sum = 0;

							this.newChartData[0].data = [this.totalPayDetails && this.totalPayDetails[0] && this.totalPayDetails[0].EquityPayout,
											this.totalPayDetails && this.totalPayDetails[0] && this.totalPayDetails[0].InsurancePayout,
											this.totalPayDetails && this.totalPayDetails[0] && this.totalPayDetails[0].MFPayout,
											this.totalPayDetails && this.totalPayDetails[0] && this.totalPayDetails[0].FDPayout,
											this.totalPayDetails && this.totalPayDetails[0] && this.totalPayDetails[0].BondsPayout,
											this.totalPayDetails && this.totalPayDetails[0] && this.totalPayDetails[0].NCDPayout, 
											this.totalPayDetails && this.totalPayDetails[0] && this.totalPayDetails[0].MLDPayout, 
											this.totalPayDetails && this.totalPayDetails[0] && this.totalPayDetails[0].AIFPayout, 
											this.totalPayDetails && this.totalPayDetails[0] && this.totalPayDetails[0].PMSPayout,
											this.totalPayDetails && this.totalPayDetails[0] && this.totalPayDetails[0].PTCPayout]

							// this.dognut = new Chart(this.dognutChart.nativeElement, {
							// 	type: 'doughnut',
							// 	data: {
							// 		labels: [
							// 			'Equity',
							// 			'Insurance',
							// 			'Mutual Fund',
							// 			'Fixed Deposit',
							// 			'Bonds',
							// 			'NCD',
							// 			'MLD',
							// 			'AIF',
							// 			'PMS',
							// 			'Gold PTC'
							// 		],
							// 		datasets: [{
							// 			data: [
							// 			this.totalPayDetails && this.totalPayDetails[0] && this.totalPayDetails[0].EquityPayout,
							// 			this.totalPayDetails && this.totalPayDetails[0] && this.totalPayDetails[0].InsurancePayout,
							// 			this.totalPayDetails && this.totalPayDetails[0] && this.totalPayDetails[0].MFPayout,
							// 			this.totalPayDetails && this.totalPayDetails[0] && this.totalPayDetails[0].FDPayout,
							// 			this.totalPayDetails && this.totalPayDetails[0] && this.totalPayDetails[0].BondsPayout,
							// 			this.totalPayDetails && this.totalPayDetails[0] && this.totalPayDetails[0].NCDPayout, 
							// 			this.totalPayDetails && this.totalPayDetails[0] && this.totalPayDetails[0].MLDPayout, 
							// 			this.totalPayDetails && this.totalPayDetails[0] && this.totalPayDetails[0].AIFPayout, 
							// 			this.totalPayDetails && this.totalPayDetails[0] && this.totalPayDetails[0].PMSPayout,
							// 			this.totalPayDetails && this.totalPayDetails[0] && this.totalPayDetails[0].PTCPayout],
							// 			backgroundColor: ['#4164B5', '#35BAE9', '#A65628', '#BEAED4', '#FF7F00', '#F781BF', '#984EA3', '#F9327A', '#61B23A', '#FCC103'], // array should have same number of elements as number of dataset
							// 			// borderColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
							// 			borderWidth: 0
							// 		}],
	
							// 	},
							// 	options: {
							// 		responsive: true,
							// 		plugins: {
							// 			legend: {
							// 				display: false
							// 			}
							// 		}
							// 	}
							// });
						}, 1500);
					})
				// })
		}, 2500);
	}

	// empty function. never used
	// allPayoutDetails(token){
	
	// }	

	goToPage(option: any, payoutValue: any) {
		this.isMobile = true;
		localStorage.setItem('isMobile', this.isMobile.toString());
		if(option == 'equity'){
			this.router.navigate(['/equity-pay-details',payoutValue],{queryParams:{'cCode':this.clientCode}});
		}
		else if(option == 'insu'){
			this.router.navigate(['/pay-details-insurance', payoutValue],{queryParams:{'cCode':this.clientCode}});
		}
		else if(option == 'mf'){
			this.router.navigate(['/pay-details-mf', payoutValue],{queryParams:{'cCode':this.clientCode}});
		}
		else{
			this.router.navigate(['/pay-more-details', option, payoutValue],{queryParams:{'cCode':this.clientCode}});
		}
        
	}
	
	goBack() {
		window.history.back();
	}
	

	async changeSlide() {
		this.sliderIndex = await this.slider?.nativeElement.swiper.realIndex;
		// console.log(this.sliderIndex);
	}

	slideNext() {
		this.slider?.nativeElement.swiper.slideNext();
	}

	// dropDownList(event){
	// 	this.storage.get('userType').then(type => {
	// 		if (type === 'RM' || type === 'FAN') {
	// 			this.storage.get('bToken').then(token => {
	// 				this.initChartData(token,event)
	// 			})
	// 		} else {
	// 			this.storage.get('subToken').then(token => {
	// 				this.initChartData(token,event)
	// 			})
	// 		}
	// 	})
	// }

	slidePrev() {
		this.slider?.nativeElement.swiper.slidePrev();
	}

	

	changeSelectOption(event: any){
		localStorage.setItem('payDetailMonth', event)
		this.PayoutMonth = localStorage.getItem('payDetailMonth')
		this.getDataFromStorage(this.clientCode, false, true);
			/* this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					// this.initChartData(token,this.PayoutMonth);
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.initChartData(token,this.PayoutMonth);
				})
			}
		}) */
    }
	activeSlide(i: any) {
		// this.sliderIndex = i;
		this.customIndex = i;
		switch (this.customIndex) {
			case 3:
				this.tableOption = "deposit";
				break;
			case 4:
				this.tableOption = "bonds";
				break;
			case 5:
				this.tableOption = "ncd";
				break;
			case 6:
				this.tableOption = "mld";
				break;
			case 7:
				this.tableOption = "aif";
				break;
			case 8:
				this.tableOption = "pms";
				break;
			case 9:
				this.tableOption = "gold";
		}
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

	public overlayClicked(event: any) {
		event.preventDefault();
		this.showDropDown = false;
	}
	selectNew(){
		setTimeout(() => {
			this.showDropDown = !this.showDropDown;
		}, 500);
	}
	openHideNew(index: any, arr: any, item: any) {
		arr.forEach((element: any, ind: any) => {
			// if ((index) === ind) {
				element['isVisible'] = element['isVisible'] ? false : true;
			// }
		});
		this.selectUnselectChildAll2(item)
		this.applyFilter()
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
	typeHierarchyText(event: any){
		const textSerach = event.target.value;
		if (textSerach && textSerach.length > 3) {
			this.isShowCross = true;
			this.noRecord = false;
			this.searchRmhierarchyTerms.next(textSerach);
		} else {
			this.isShowCross = false;
			this.selectOptionArr = [];
			this.optionArrCpy = [];
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
			let map: any = {}, node: any, res: any = [], i;
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
		this.optionArrCpy = y;
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
		this.optionArrCpy = [];
	}

	ionViewWillLeave() {
		if (this.platform.is('desktop')) {
			localStorage.removeItem('payDetailMonth');
		}
	}
	ngOnDestroy() {
		if (this.platform.is('desktop')) {
			localStorage.removeItem('payDetailMonth');
		}
	}	

}
