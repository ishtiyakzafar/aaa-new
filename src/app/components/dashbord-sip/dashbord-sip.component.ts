import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalController, PopoverController } from '@ionic/angular';
import moment from 'moment';
import { DashBoardService } from '../../pages/dashboard/dashboard.service';
import { CommonService } from '../../helpers/common.service';
import { ToasterService } from '../../helpers/toaster.service';
import { FilterPopupComponent } from '../filter-popup/filter-popup.component';
import { SIPBookService } from '../sip-book/sip-book.service';
import { FDSMaturingService } from '../fds-maturing/fds-maturing.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
	selector: 'app-dashbord-sip',
	providers: [SIPBookService, DashBoardService, FDSMaturingService],
	templateUrl: './dashbord-sip.component.html',
	styleUrls: ['./dashbord-sip.component.scss'],
})
export class DashbordSipComponent implements OnInit {
	@Input() srNo: any;
	// @Input() tableData;
	datePicker: any; 
	showDatePicker: boolean = false;
	date:any;
	showStartDatePicker: boolean = false;
	showEndDatePicker: boolean = false;
	@Input() option: any; //MaturingFDCount
	public ascending: boolean = true;
	public clientCode = null;
	private subscription: any;
	public bouncedCeasedSipData = [];
	// public userID = null;
	// public totalSIP = null;
	// public totalSIPValue = null;
	// public bouncedSIPClientData = [];
	// public bouncedSIPCount = [];
	public searchTerm: any = null;
	public dataLoad = false;
	currentDate: any;
	order: string = 'clientName';
	reverse: boolean = false;
	public datas: any[] = [
	];
	public fdMatureData = [];
	//public cardSegments: any[] = [];

	public segmentButtonOption: any[] = [
		{ name: 'Client Code', value: 'clientCode' },
		{ name: 'Name', value: 'clientName' }
	]
	public clientBlockSegmentValue: string = "clientCode";
	public cardSegments: any[] = [{name: 'Booked FDs', segmentValue:'1', subtitle:'MTD Performance', data: 50, totalSip:'0', sipValue:'0'},{name: 'Matured FDs', segmentValue:'2',subtitle:'MTD Performance', data: 100, totalSip:'0', sipValue:'0'}] 
	//public cardSegmentsValue = 'totalNumber';
	// filterObj = {
	// 	PageNo: 1,
	// 	SortBy: 'clientcode',
	// 	SortOrder: 'asc',
	// 	SearchBy: null,
	//   SearchText: null,
	//   Clientcode: ""
	// }
	//filterObj:any;
	public placeholderInput: string = 'Type Client Code';

	public cardSegmentsValue = '1';

	public enableNext = false;

	public wait = false;

	tokenValue: any;
	userIdValue: any;
	fromDate:any;
	toDate:any;
	bookedFdSip:any;
	bookedFdValue:any;
	maturedFdSip:any;
	maturedFdValue:any;
	disableToDate: boolean = true;
	public startDate: any = null;
    public endDate: any = null;
	passStartDate:any;
	passEndDate:any;
	fromDateReq: any
	toDateReq: any;
	filterObj: any = {
		PageNo: 1,
		SortBy: 'clientcode',
		SortOrder: 'asc',
		SearchBy: null,
		SearchText: null,
		//Clientcode: ""

	}
	myOptions: any = {
		dateFormat: 'dd/mm/yyyy',
		showMonthNumber: false,
		dayLabels: {su: 'S', mo: 'M', tu: 'T', we: 'W', th: 'T', fr: 'F', sa: 'S'},
		firstDayOfWeek: "mo",
		alignSelectorRight:true,
		stylesData: {
			styles: `
			@media screen and (min-width: 768px) {
			  .myDpSelectorAbsolute {
				top: 12px !important;
				left:-200px;
				height:140px;
			
			  } 
			  .myDpWeekDayTitle, .myDpMonthYearText{
				font-weight:700;
			}  
		}	

		@media screen and (max-width: 500px) {
			.myDpSelectorAbsolute {
				left: 0 !important;
			}
			
		}
			`
		}
		
		// disableSince: {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()},

	}


	constructor(private elementRef: ElementRef,private modalController: ModalController, private storage: StorageServiceAAA, public sipBookSer: SIPBookService, private popoverController: PopoverController, private dashBoardService: DashBoardService, private fdMatureService: FDSMaturingService, private commonService: CommonService, private toast:ToasterService) { }

	ngOnInit() {
		// console.log(this.option);
		this.currentDate = moment(new Date()).format("YYYY-MM-DD");
		this.subscription = new Subscription();
		this.storage.get('empCode').then(code => {
			this.clientCode = code;
		})
		this.storage.get('userID').then((userID) => {
			this.userIdValue = userID
			this.filterObj['RMCode'] = userID;
			this.storage.get('userType').then(type => {
				
				if (type === 'RM' || type === 'FAN') {
					this.storage.get('bToken').then(token => {
						this.tokenValue = token
						if(this.option == 'MaturingFDCount'){
							this.commonService.setClevertapEvent('BusinessOpps_MaturingFDCount');
							let fromDate = { isRange: false, singleDate: { jsDate: this.commonService.lastMonthISOConverted('previous') } };
							let toDate = { isRange: false, singleDate: { jsDate: this.commonService.lastMonthISOConverted('current') } };
							
							let obj = {
								fromDate:  moment(fromDate.singleDate.jsDate).format('MMM DD YYYY'),
								toDate: moment(toDate.singleDate.jsDate).format('MMM DD YYYY')
							}
							this.fromDate = obj.fromDate;
							this.toDate = obj.toDate;
							// console.log(this.fromDateReq)
							// console.log(this.toDateReq)
							this.fdCount(token, userID);
							this.fdsMaturingFun(token, obj);
						}
						else{
							if (this.option == "BouncedSIPs") {
								this.commonService.setClevertapEvent('BusinessOpps_BouncedSIP');
							}
							else{
								this.commonService.setClevertapEvent('BusinessOpps_CeasedSIP');
							}
							this.initSipContent(token, userID)
						}
						
					})
				} 
				else {
					this.storage.get('subToken').then(token => {
						this.tokenValue = token
						this.initSipContent(token, userID)
						if(this.option == 'MaturingFDCount'){
							let obj = {
								fromDate: this.fromDateReq,
								toDate: this.toDateReq
							}
							this.fdCount(token, userID);
							this.fdsMaturingFun(token, obj);
						}
						else{
							this.initSipContent(token, userID)
						}
					})
				}
			})
		})
	}


	// Count the data for cards no of fds and value
	fdCount(token: any,userId: any){
		this.storage.get('partnerDetails').then((value) => {
			if(value){
				this.cardSegments =	[
					{name: 'Booked FDs', segmentValue:'1', subtitle:'MTD Performance', data: 50, totalSip:value['objGetAAADashboardDataBody'][0].BookedFDCount, sipValue:value['objGetAAADashboardDataBody'][0].BookedFDValue},
					{name: 'Matured FDs', segmentValue:'2',subtitle:'MTD Performance', data: 100, totalSip:value['objGetAAADashboardDataBody'][0].MaturityFDCount, sipValue:value['objGetAAADashboardDataBody'][0].MaturityFDValue}
				]; 
			} else {
				this.subscription.add(
					this.dashBoardService
						.dashBoardDetail(token, userId)
						.subscribe((res: any) => {
						//  let res = {
						// 		"Head": {
						// 		  "ResponseCode": "DashboardDetail",
						// 		  "ErrorCode": 0,
						// 		  "ErrorDescription": ""
						// 		},
						// 		"Body": {
						// 		  "objGetAAADashboardDataBody": [
						// 			{
						// 			  "TotalAum": "342522.02",
						// 			  "MTD": "",
						// 			  "YTD": "",
						// 			  "TotalClient": "15",
						// 			  "TotalBrokerage": "7435.00",
						// 			  "YTDBrokerage": "684.90",
						// 			  "SipValuePerMonth": "1599.97",
						// 			  "ActiveSIPClient": "10",
						// 			  "BookedFDCount": "0",
						// 			  "BookedFDValue": "",
						// 			  "MaturityFDCount": "0",
						// 			  "MaturityFDValue": ""
						// 			}
						// 		  ],
						// 		  "DataAsOn": "2/14/2022 8:58:35 AM"
						// 		}
						// 	  }
						if(res['Head']['ErrorCode'] == 0){
							this.cardSegments =	[
								{name: 'Booked FDs', segmentValue:'1', subtitle:'MTD Performance', data: 50, totalSip:res['Body']['objGetAAADashboardDataBody'][0].BookedFDCount, sipValue:res['Body']['objGetAAADashboardDataBody'][0].BookedFDValue},
								{name: 'Matured FDs', segmentValue:'2',subtitle:'MTD Performance', data: 100, totalSip:res['Body']['objGetAAADashboardDataBody'][0].MaturityFDCount, sipValue:res['Body']['objGetAAADashboardDataBody'][0].MaturityFDValue}
							];
							const dashboardDetails = res['Body'];
							this.storage.set('partnerDetails', dashboardDetails);
						}
				}));
			}
		});
	}

	// Fun for Ceased nd bounced Data display
	initSipContent(token: any, userId: any) {
		if (this.option == "BouncedSIPs") {
			this.filterObj['Type'] = "bounced";
		}
		else{
			this.filterObj['Type'] = "ceased";
		}
		// console.log(this.filterObj);

		// this.subscription.add(this.sipBookSer
		//   .bouncedSIP(token, this.filterObj)
		//   .subscribe((res) => {
		//     console.log(res);
		//   }))
		this.getSipDatas(token);
		// setTimeout(() => {
		// 	this.dataLoad = true;
		// }, 1000);
	}

	segmentFdChange(value: any){
		this.searchTerm = null;
		this.fromDate = { isRange: false, singleDate: { jsDate: this.commonService.lastMonthISOConverted('previous') } };
		this.toDate = { isRange: false, singleDate: { jsDate: this.commonService.lastMonthISOConverted('current') } };
		let fromDate = { isRange: false, singleDate: { jsDate: this.commonService.lastMonthISOConverted('previous') } };
		let toDate = { isRange: false, singleDate: { jsDate: this.commonService.lastMonthISOConverted('current') } };
							
		let obj = {
			fromDate:  moment(fromDate.singleDate.jsDate).format('MMM DD YYYY'),
			toDate: moment(toDate.singleDate.jsDate).format('MMM DD YYYY')
		}
		this.fdsMaturingFun(this.tokenValue, obj)	
	}

	// Fun for Matured Fds
	fdsMaturingFun(token: any, obj: any){
		// let today = moment(new Date(), "M/D/YYYY H:mm").valueOf();
        // let previousDate = moment(new Date().setFullYear(new Date().getFullYear() - 1)).valueOf();
		// this.filterObj['FromDate'] = this.fromDate;
		// this.filterObj['ToDate'] = this.toDate;
		// console.log(this.filterObj);
		// this.subscription.add(
		// 	this.fdMatureService
		// 		.maturityDetails(token, this.filterObj)
		// 		.subscribe((res) => {
		// 			console.log(res)
		// 		}))
		this.getFdDatas(token, obj);
	}

	titleBusinessOpps(key: any, nameOrIcon: string){
		return this.commonService.displayTitleForBusinessOpps(key, nameOrIcon);
	}

	toggleStartDatePicker() {
		this.showStartDatePicker = !this.showStartDatePicker;
		// Optional: Hide end date picker if shown
		this.showEndDatePicker = false;
	  }
	
	  toggleEndDatePicker() {
		this.showEndDatePicker = !this.showEndDatePicker;
		// Optional: Hide start date picker if shown
		this.showStartDatePicker = false;
	  }
	

	  hideDatePicker( type: string, event?:any) {
		 // Update selectedDate with the changed value
		const datediv = this.elementRef.nativeElement.querySelector('ion-datetime');
		const isMonthYearDisplayed = datediv.classList.contains('show-month-and-year');
		  
		  if (!isMonthYearDisplayed) {
			if (type === 'start') {
				this.showStartDatePicker = false;
				if(event != undefined){
					this.onStartDateChanged(event);
				}
			  } else if (type === 'end') {
				this.showEndDatePicker = false;
				if(event != undefined){
					this.onEndDateChanged1(event);
				}
			  }
		  } 
	
	  }

	// Select on start date
	onStartDateChanged(event: any) {
		// console.log(event.singleDate.jsDate)
		this.disableToDate = false;
		this.startDate = event.detail.value;
		this.passStartDate = moment(new Date(event.detail.value)).format("YYYYMMDD");

		if (this.endDate !== null) {
			if (this.startDate > this.endDate) {
				console.log('Start Date Cannot be greater than End Date')
			}
		}
	}

	// Select on end date
	onEndDateChanged1(event: any) {
		this.endDate = event.detail.value;
		this.passEndDate = moment(new Date(event.detail.value)).format("YYYYMMDD");
		// console.log(this.endDate);
		
		if (this.startDate > this.endDate) {
			this.toast.displayToast('Start Date Cannot be greater than End Date');
		}
		else{
		
			let obj = {
				fromDate: moment(this.passStartDate).format('MMM DD YYYY'),
				toDate: moment(this.passEndDate).format('MMM DD YYYY')
			}
			
			this.fromDate = { isRange: false, singleDate: { jsDate: new Date(obj.fromDate) } };
			this.toDate = { isRange: false, singleDate: { jsDate: new Date(obj.toDate) } };	
			this.fdsMaturingFun(this.tokenValue, obj)
		}
		
		
	}

	// filter popup for base on client code and name
	async filterOption(ev: any) {
		ev.stopPropagation();
		const popover = await this.popoverController.create({
			component: FilterPopupComponent,
            componentProps: {clientFilter: true},
			cssClass: "custom-popover filter-popover",
			mode: "md",
			showBackdrop: false,
			event: ev,
			//translucent: true
		});

		await popover.present();
	}

	setOrder(value: string) {
		this.dataLoad = false;
		if (this.order === value) {
			this.reverse = !this.reverse;
		}
		this.order = value;
		this.enableNext = false;
		this.datas = [];
		this.filterObj.PageNo = 1;
		this.filterObj.SortBy = value;
		this.filterObj.SortOrder = this.reverse ? 'asc' : 'desc';
		if (this.reverse) {
			this.ascending = true;
		} else {
			this.ascending = false;
		}
		if (this.option == 'MaturingFDCount') {
			this.fdsMaturingFun(this.tokenValue, this.filterObj);
		} else {
			this.initSipContent(this.tokenValue, this.filterObj);
		}
	}



	dismiss() {
		this.modalController.dismiss();
	}

	public searchText() {
		// console.log(this.searchTerm);
		this.dataLoad = false;
		this.datas = [];
		if (this.option == 'MaturingFDCount') {
			this.fromDate = { isRange: false, singleDate: { jsDate: this.commonService.lastMonthISOConverted('previous') } };
			this.toDate = { isRange: false, singleDate: { jsDate: this.commonService.lastMonthISOConverted('current') } };
		}
		if (this.searchTerm != null) {
			this.filterObj.SearchText = this.searchTerm
			this.filterObj.SearchBy = this.clientBlockSegmentValue
			this.filterObj.PageNo = 1
			if (this.option == 'MaturingFDCount') {
				this.fdsMaturingFun(this.tokenValue, this.filterObj);
			} else {
				this.initSipContent(this.tokenValue, this.filterObj)
			}
		}
	}


	segmentChange() {
		this.searchTerm = '';
		//this.datas = this.resetData
		if (this.clientBlockSegmentValue === 'clientName') {
			this.placeholderInput = 'Type Name';

		} else {
			this.placeholderInput = 'Type Client Code';
		}
		if (this.option == 'MaturingFDCount') {
			this.fromDate = { isRange: false, singleDate: { jsDate: this.commonService.lastMonthISOConverted('previous') } };
			this.toDate = { isRange: false, singleDate: { jsDate: this.commonService.lastMonthISOConverted('current') } };
		}
	}

	divScroll(event: any) {
		const tableHeight = event.target.offsetHeight;
		const scrollHeight = event.target.scrollHeight,
			scrollerEndPoint = scrollHeight - tableHeight,
			tableScrollTop = event.target.scrollTop;

		if (tableScrollTop >= scrollerEndPoint - 100 && this.enableNext && !this.wait) {
			this.wait = true;
			this.filterObj.PageNo += 1;
			this.filterObj['SearchText'] = this.filterObj.SearchText;
			this.filterObj['SearchBy'] = this.filterObj.SearchBy;
			if (this.option == 'MaturingFDCount') {
				this.fdsMaturingFun(this.tokenValue, this.filterObj);
			} else {
				this.initSipContent(this.tokenValue, this.filterObj);
			}
		}
	}

	public getSipDatas(token: any, obj?: any) {
		this.subscription = new Subscription();
		let passObj: any = {};
		if (obj) {
			this.filterObj['SearchBy'] = (obj['SearchText'] == null || obj['SearchText'] == '' ? null : obj['SearchBy']);
			this.filterObj['SearchText'] = obj['SearchText'];
			this.filterObj['PageNo'] = obj['page'] ? obj['page'] : this.filterObj.PageNo;
			passObj = this.filterObj;
		} else passObj = this.filterObj;
		// passObj['RMCode'] = 'C1011';
		passObj['RMCode'] = this.clientCode !== null && this.clientCode !== undefined ? this.clientCode : this.userIdValue;
        // passObj['Clientcode'] = this.clientCode !== null && this.clientCode !== undefined ? this.clientCode : this.userID;
		passObj['Clientcode'] = '';
		//passObj['Type'] = 'bounced';
		this.subscription.add(
			this.sipBookSer
				.bouncedSIP(token, passObj)
				.subscribe((res: any) => {
					this.wait = false;
					if (res['Head']['ErrorCode'] == 0) {

						//this.bouncedSIPCount = res['Body'];

						if (res['Body']['summary'].length === 0) {
							this.enableNext = false;
							this.dataLoad = true;
						} else {
							this.bouncedCeasedSipData = res['Body']['summary'];

							if (this.filterObj.PageNo === 1) {
								this.datas = [];
							}
							this.bouncedCeasedSipData.forEach(element => {
								this.datas.push({
									clientId: element['ClientCode'] ? element['ClientCode'] : '-',
									clientName: element['ClientName'] ? element['ClientName'] : '-',
									folio: element['FolioNumber'],
									scheme: element['SchemeName'],
                                    value: this.commonService.numberFormatWithCommaUnit(element['SIPAmount']),
                                    date: element['Date']
								})
							});
							
							this.enableNext = true;
							this.dataLoad = true;
						}
						// this.totalSIP = this.commonService.formatNumberComma(this.bouncedSIPCount['TotalSIP']);
						// this.totalSIPValue = this.commonService.numberFormatWithCommaUnit(this.bouncedSIPCount['TotalSIPAmount']);

						// this.dataLoad = true;
					} else {
						this.enableNext = false;
						// this.bouncedSIPCount = [];
						// this.bouncedSIPClientData = [];
						this.datas = [];
						this.dataLoad = true;
					}
				})
		)
	}



	public getFdDatas(token: any, obj?: any) {
		this.subscription = new Subscription();

		
		// const params = {
		// 	Loginid: this.clientCode,
		// 	type: 'new'
		// }
		// this.dataLoad = false;

		let passObj: any = {};
		// this.filterObj['FromDate'] = "";
		// this.filterObj['ToDate'] = "";
		// this.filterObj['Type'] = "booked";
		if (obj) {
			this.filterObj['SearchBy'] = (obj['SearchText'] == null || obj['SearchText'] == '' ? null : obj['SearchBy']);
			this.filterObj['SearchText'] = obj['SearchText'];
			this.filterObj['PageNo'] = obj['page'] ? obj['page'] : this.filterObj.PageNo;
			this.filterObj['FromDate'] = obj['SearchText'] ? null : this.fromDate?.singleDate?.jsDate ? moment(this.fromDate.singleDate.jsDate).format('YYYY-MM-DD') : moment(this.fromDate).format('YYYY-MM-DD');
			this.filterObj['ToDate'] = obj['SearchText'] ? null : this.toDate?.singleDate?.jsDate ? moment(this.toDate.singleDate.jsDate).format('YYYY-MM-DD') : moment(this.toDate).format('YYYY-MM-DD');
			passObj = this.filterObj;
		} else passObj = this.filterObj;
		passObj['RMCode'] = this.clientCode !== null && this.clientCode !== undefined ? this.clientCode : this.userIdValue;
		// passObj['RMCode'] = 'C124632';
		passObj['ClientCode'] = '';
		passObj['type'] = this.cardSegmentsValue == '1'? 'booked' : 'matured';
		// "FromDate": "","ToDate": "","PageNo": "1","SortBy": "Clientcode","SortOrder": "asc","SearchBy": "","SearchText": ""}

		this.subscription.add(
			this.fdMatureService
				.maturityDetails(token, passObj)
				.subscribe((res: any) => {
					if (res['Head']['ErrorCode'] == 0) {
						this.wait = false;

						// this.liveSIPData = res['Body']['AAAClientwiseSIP'][0];
						if (res['Body']['Payout'].length === 0) {
							this.enableNext = false;
							this.dataLoad = true;
						} else {
							this.fdMatureData = res['Body']['Payout'];

							if (this.filterObj.PageNo === 1) {
								this.datas = [];
							}

							this.fdMatureData.forEach(element => {
								this.datas.push({
									clientId: element['ClientCode'] ? element['ClientCode'] : '-',
									clientName: element['ClientName'] ? element['ClientName'] : '-',
									folio: this.commonService.numberFormatWithCommaUnit(+element['FDCount']),
									value: this.commonService.numberFormatWithCommaUnit(+element['FDAmount'])
								})
							});

							let noOfFDBooked = 0;
							let bookedFDValue = 0;
							this.fdMatureData.forEach(element => {
								noOfFDBooked = noOfFDBooked + +element['FDCount'];
								bookedFDValue = bookedFDValue + +element['FDAmount'];
							});

							const obj = {
								noOfFD: noOfFDBooked,
								fdValue: bookedFDValue
							}

							// this.commonService.setData(obj);
							this.commonService.setEvent('bookedCountEvent', obj);

							this.enableNext = true;
							this.dataLoad = true;
						}
						// this.totalSIP = this.commonService.formatNumberComma(this.liveSIPData['TotalSips']);
						// this.totalSIPValue = this.commonService.numberFormatWithCommaUnit(this.liveSIPData['TotalSIPValue']);

						// this.dataLoad = true;
						if (res['Body']['Payout'].length < 49) {
							this.enableNext = false;
						}
					} else {
						this.wait = false;
						this.enableNext = false;
						// this.liveSIPData = [];
						this.fdMatureData = [];
						this.datas = [];
						this.dataLoad = true;
					}
				})
		)
	}

}
