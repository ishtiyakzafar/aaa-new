import { ModalController, PopoverController, Platform } from '@ionic/angular';
import { FilterPopupComponent } from '../filter-popup/filter-popup.component';
import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DashBoardService } from '../../pages/dashboard/dashboard.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { CommonService } from '../../helpers/common.service';
import { Subscription } from 'rxjs';


@Component({
	selector: 'app-business-opportunities-details',
	providers: [DashBoardService],
	templateUrl: './business-opportunities-details.component.html',
	styleUrls: ['./business-opportunities-details.component.scss'],
})
export class BusinessOpportunitiesDetailsComponent implements OnInit {
	@Input() srNo: any;
	// @Input() tableData;
	@Input() option: any;
	tableData: any;
	public cardSegmentsValue = 'totalNumber';
	public filterSegmentValue: string = "sixtyDays";
	public clientBlockSegmentValue!: string;
	public filterSegmentOption: any[] = [
		{ name: 'Expires in 30 days', value: 'thirtyDays' },
		{ name: 'Expires in 60 days', value: 'sixtyDays' },
		{ name: 'Expired', value: 'expired' },
	]
	public segmentButtonOption: any[] = [
		{ name: 'Client Code', value: 'clientCode' },
		{ name: 'Name', value: 'clientName' }
	]
	public segmentButtonOptionNew: any[] = [
		{ name: 'Client Code/Name', value: 'clientCode/clientName' },
		{ name: 'Group Code', value: 'Group_CD' }
	]
	public cardSegments: any[] = [{name: 'No. of FDs', segmentValue:'totalNumber', data: 50},{name: 'FD Value', segmentValue:'totalNumber1', data: 100}] 
	
	searchTerm: string = '';
	public placeholderInput!: string;
	public dataLoad = false;
	order: string = 'clientName';
	orderType: string = 'DOB1';
	reverse: boolean = false;
	cardData1: any;
	resetData: any;
	public datas: any[] = [];
	private subscription: any;

	Loadvalue = false;
	inputattr = false;
	public wait = false;
	changeHeader: any;
	public enableNext = false;
	public isBirthday = false;
	public val: string = 'asc';

	filterObj = {
		PageNo: 1,
		ClientCode:'',
		SortBy: 'clientName',
		SortOrder: 'asc',
		SearchBy: null,
		SearchText: null
	}
	changedClientCode:any;
	public ascending: boolean = true;
	shareReportTypeList: any[] = [
		{ value: 'Pending' },
		{ value: 'Done' },
		{ value: 'Ignore' },
	]
	tableHeader: any;
	userTypeValue:any;
	parameterObj:any;
	dataArray:any[] = [];
	filterApiCall:boolean = false;
	userIdValue:any;
	tokenValue:any 
	clientCode:any
	allArrayData:any
	sortId:any;
	mobEmailPhoneClickTooltip: string = "";
	screenWidth:any;
	// filterObj = {
	// 	PageNo: 1,
	// 	ClientCode: "",
	// 	SortBy: 'clientcode',
	// 	SortOrder: 'asc',
	// 	SearchBy: null,
	// 	SearchText: null
	// }
	constructor(private modalController: ModalController, private popoverController: PopoverController, private http: HttpClient, private dashBoardService: DashBoardService, private storage: StorageServiceAAA, private commonService: CommonService, private router: Router, private platform: Platform) { }

	ngOnInit() {
		this.screenWidth = window.innerWidth;
		if (this.option == 'P1P2Clients' || this.option == 'otherclients' || this.option == 'Last30bday') {
			this.clientBlockSegmentValue = 'clientCode/clientName';
			this.placeholderInput = 'Type Client Code/Client Name';
		} else {
			this.clientBlockSegmentValue = 'clientCode';
			this.placeholderInput = 'Type Client Code';
		}


		if (this.option == 'FAOActiveNotTraded') {
			this.changeHeader = "Cash AUM (₹)"
		}else if (this.option == 'NCDorDebtHoldings') {
			this.changeHeader = "Total Debt Holding (₹)"
			this.sortId = 'DebtHoldingValue'
		}
		else if (this.option == 'NotInvestedInSIP') {
			this.changeHeader = "Total MF AUM (₹)",
			this.sortId = 'TotalMFAUM'
			
		}
		else if (this.option == 'NotInvestedInMF') {
			this.changeHeader = "Equity AUM (₹)",
			this.sortId = 'TotalEquityAUM'
		}
		else if (this.option == 'EquityHoldingsAbove25L') {
			this.changeHeader = "Equity AUM (₹)",
			this.sortId = 'EquityAUM'
		}
		else {
			this.changeHeader = " Debt MF AUM (₹)"
			this.sortId = 'debt mf aum'
		}

		if(this.option == 'EquityMFLeadsCount' || this.option == 'FixedIncomeLeadsCount' || this.option == 'PMSAIFLeadsCount'){
			this.filterApiCall = true;
			if(this.option == 'EquityMFLeadsCount'){
				this.commonService.setClevertapEvent('BusinessOpps_EquityMFLeadsCount');
			}
			else if(this.option == 'FixedIncomeLeadsCount'){
				this.commonService.setClevertapEvent('BusinessOpps_FixedIncomeLeadsCount');
			}
			else{
				this.changeHeader = "Total AUM (₹)",
				this.sortId = 'AUM'
				this.commonService.setClevertapEvent('BusinessOpps_PMSAIFLeadsCount');
			}
		}
		//this.getButtons(this.srNo);
		this.subscription = new Subscription();
		this.storage.get('empCode').then(code => {
			this.clientCode = code;
		})
		this.storage.get('userID').then((userID) => {
			this.storage.get('userType').then(type => {
				this.userTypeValue = type
				if (type === 'RM' || type === 'FAN') {
					this.storage.get('bToken').then(token => {
						let userIdValue = this.clientCode !== null && this.clientCode !== undefined ? this.clientCode : userID;
						this.initModelContent(token, userIdValue)
					})
				} else {
					this.storage.get('subToken').then(token => {
						let userIdValue = this.clientCode !== null && this.clientCode !== undefined ? this.clientCode : userID;
						this.initModelContent(token, userIdValue)
					})
				}
			})
		})

	}

	titleBusinessOpps(key: any, nameOrIcon: string) {
		return this.commonService.displayTitleForBusinessOpps(key,nameOrIcon);
	}

	onProfitSelectionChange(event: any) {
		// console.log(event);
	}

	radioGroupChange(event: any) {
		// console.log(event);
	}

	statusSelect(event: any) {
		event.stopPropagation();
		event.preventDefault()
	}

	initModelContent(token: any, userId: any) {
		this.datas = [];
		this.userIdValue = userId;
		this.tokenValue = token
		if (this.option == 'EquityHoldingsAbove25L') {
			this.commonService.setClevertapEvent('BusinessOpps_EquityHoldingsAbove25L');
			this.filterApiCall = true;
			this.storage.get('empCode').then(code => {
				this.changedClientCode = code;
				this.dataLoad = false;
				if (this.changedClientCode) this.getDataFromStorage(token,userId)

			})
			// this.subscription.add(this.dashBoardService
			// 	.getClientHolding25(token, userId)
			// 	.subscribe((res) => {
			// 		this.dataLoad = true;
			// 		if (res['Head']['ErrorCode'] == 0) {
			// 			if (res['Body'].length > 0) {
			// 				this.tableData = res['Body'];
			// 				// this.resetData = res['Body'];
			// 				res['Body'].forEach(element => {
			// 					this.datas.push({
			// 						ClientCode: element['ClientCode'] ? element['ClientCode'] : '-',
			// 						ClientName: element['ClientName'] ? element['ClientName'] : '-',
			// 						aumSort: parseFloat(element.EquityAUM),
			// 						AUM: this.commonService.numberFormatWithCommaUnit(element.EquityAUM),
			// 						Status: element.Status
			// 					})
			// 				})
			// 				this.resetData = this.datas;
			// 			}


			// 		}
			// 	}))
		
		}
		else if (this.option == 'FAOActiveNotTraded') {
			this.commonService.setClevertapEvent('BusinessOpps_FAOActiveNotTraded');
			this.subscription.add(this.dashBoardService
				.businessFao(token, userId)
				.subscribe((res: any) => {
					this.dataLoad = true;
					if (res['Head']['ErrorCode'] == 0) {
						this.tableData = res['Body'];

						res['Body']['BusinessOpportunities_FAOlist'].forEach((element: any) => {
							this.datas.push({
								ClientCode: element['ClientCode'] ? element['ClientCode'] : '-',
								ClientName: element['ClientName'] ? element['ClientName'] : '-',
								aumSort: parseFloat(element.CashAUM),
								AUM: this.commonService.numberFormatWithCommaUnit(element.CashAUM),
								Status: element.Status
							})
						})
						this.resetData = this.datas;

						//this.resetData = res['Body'];
					}
				}))
		}

		else if (this.option == 'NotInvestedInSIP') {
			this.commonService.setClevertapEvent('BusinessOpps_NotInvestedInSIP');
			this.filterApiCall = true;
			// this.subscription.add(this.dashBoardService
			// 	.clientMfNotTraded(token, userId)
			// 	.subscribe((res) => {
			// 		this.dataLoad = true;
			// 		if (res['Head']['ErrorCode'] == 0) {
			// 			this.tableData = res['Body'];

			// 			res['Body'].forEach(element => {
			// 				this.datas.push({  
			// 					ClientCode: element['ClientCode'] ? element['ClientCode'] : '-',
			// 					ClientName: element['ClientName'] ? element['ClientName'] : '-',
			// 					aumSort: parseFloat(element.TotalMFAUM),
			// 					AUM: this.commonService.numberFormatWithCommaUnit(element.TotalMFAUM),
			// 					LedgerBalance: element.LedgerBalance,
			// 					Status: element.Status
			// 				})
			// 			})
			// 			this.resetData = this.datas;
			// 		}
			// 	}))
			this.filterApiCall = true;
			this.storage.get('empCode').then(code => {
				this.changedClientCode = code;
				this.dataLoad = false;
				if (this.changedClientCode) this.getDataFromStorage(token,userId)

			})
		}

		else if (this.option == 'NCDorDebtHoldings') {
			this.commonService.setClevertapEvent('BusinessOpps_NCDorDebtHoldings');
			this.filterApiCall = true;
			// this.subscription.add(this.dashBoardService
			// 	.getNcdMfHolding(token, userId)
			// 	.subscribe((res) => {
			// 		this.dataLoad = true;
			// 		if (res['Head']['ErrorCode'] == 0) {
			// 			this.tableData = res['Body'];
			// 			res['Body']['AAANCDorMFDEptHoldingResData'].forEach(element => {
			// 				this.datas.push({
			// 					ClientCode: element['ClientCode'] ? element['ClientCode'] : '-',
			// 					ClientName: element['ClientName'] ? element['ClientName'] : '-',
			// 					aumSort: parseFloat(element.DebtHoldingValue),
			// 					AUM: this.commonService.numberFormatWithCommaUnit(element.DebtHoldingValue),
			// 					Status: element.Status
			// 				})
			// 			})
			// 			this.resetData = this.datas;
			// 		}
			// 	}))
			this.storage.get('empCode').then(code => {
				this.changedClientCode = code;
				this.dataLoad = false;
				if (this.changedClientCode) this.getDataFromStorage(token,userId)

			})
		}
		else if (this.option == 'NotInvestedInMF') {
			this.filterApiCall = true;
			this.commonService.setClevertapEvent('BusinessOpps_NotInvestedInMF');
			this.storage.get('empCode').then(code => {
				this.changedClientCode = code;
				this.dataLoad = false;
				if (this.changedClientCode) this.getDataFromStorage(token,userId)

			})
			// this.subscription.add(this.dashBoardService
			// 	.getClientInvestedMF(token, userId)
			// 	.subscribe((res) => {
			// 		this.dataLoad = true;
			// 		if (res['Head']['ErrorCode'] == 0) {
			// 			this.tableData = res['Body'];
			// 			res['Body']['GetAAAClientNotInvestedData'].forEach(element => {
			// 				this.datas.push({
			// 					ClientCode: element['ClientCode'] ? element['ClientCode'] : '-',
			// 					ClientName: element['ClientName'] ? element['ClientName'] : '-',
			// 					aumSort: parseFloat(element.TotalEquityAUM),
			// 					AUM: this.commonService.numberFormatWithCommaUnit(element.TotalEquityAUM),
			// 					LedBal: element.LedgerBalance,
			// 					Status: element.status
			// 				})
			// 			})
			// 			this.resetData = this.datas;
			// 		}
			// 	}))
		}

		else if (this.option == 'EquityMFLeadsCount' || this.option == 'FixedIncomeLeadsCount' || this.option == 'PMSAIFLeadsCount' || this.option == 'Last30bday' || this.option == 'P1P2Clients' || this.option == 'otherclients') {
			//this.commonService.setClevertapEvent('BusinessOpps_EquityMFLeadsCount');
			// this.parameterObj = {
			// 	PageNo: 1,
			// 	ClientCode: "",
			// 	SortBy: 'clientcode',
			// 	SortOrder: 'asc',
			// 	SearchBy: null,
			// 	SearchText: null
			// }
			this.storage.get('empCode').then(code => {
				this.changedClientCode = code;
				this.dataLoad = false;
				if (this.changedClientCode) this.getDataFromStorage(token,userId)

			})
		}
		
		else {
			this.dataLoad = true;
			this.tableData = [];
			this.datas = [];
		}

	}

	public getDataFromStorage(token: any, userId: any, optionalParams?: any) {
		this.getData(token,userId, optionalParams);
	}

	public getData(token: any,userId: any, obj?: any) {
		this.subscription = new Subscription();
		// this.dataLoad = false;
		let passObj: any = {};

		if (obj) {
			this.filterObj['SearchBy'] = (obj['SearchText'] == null || obj['SearchText'] == '' ? null : obj['SearchBy']);
			this.filterObj['SearchText'] = obj['SearchText'];
			this.filterObj['ClientCode'] = this.filterObj.ClientCode;
			this.filterObj['PageNo'] = obj['page'] ? obj['page'] : this.filterObj.PageNo;
			passObj = this.filterObj;
		} else passObj = this.filterObj;
		//passObj['PartnerCode'] = userId;
		if(this.option == 'NotInvestedInMF' || this.option == 'EquityMFLeadsCount' || this.option == 'FixedIncomeLeadsCount' || this.option == 'PMSAIFLeadsCount' || this.option == 'NCDorDebtHoldings'){
			passObj['PartnerCode'] = this.changedClientCode !== null && this.changedClientCode !== undefined ? this.changedClientCode : userId;
		}
		else{
			passObj['Loginid'] = this.changedClientCode !== null && this.changedClientCode !== undefined ? this.changedClientCode : userId;
		}
  
		//passObj['Loginid'] = "C9685"
		// this.storage.get('bToken').then(token => {
			if(this.option == 'EquityMFLeadsCount'){
				this.subscription.add(
					this.dashBoardService
						.getEquityLeads(token, passObj)
						.subscribe((res) => {
							this.tableDataDisplay(res)
						})
				)
			}
			else if(this.option == 'FixedIncomeLeadsCount'){
				this.subscription.add(
					this.dashBoardService
						.getFixedIncomeLeads(token, passObj)
						.subscribe((res) => {
							this.tableDataDisplay(res)
						})
				)
			}
			else if(this.option == 'PMSAIFLeadsCount'){
				this.subscription.add(
					this.dashBoardService
						.getPmsLeads(token, passObj)
						.subscribe((res) => {
							this.tableDataDisplay(res)
						})
				)
			}
			if(this.option == 'Last30bday'){
				let login = this.changedClientCode !== null && this.changedClientCode !== undefined ? this.changedClientCode : userId;	
				this.subscription.add(
					this.dashBoardService
						.getListOfClientsBdays(token, {login})
						.subscribe((res) => {
							this.birthDayFunc(res);
						})
				)
				this.isBirthday = true;			
			}
			if (this.option == 'P1P2Clients' || this.option == 'otherclients') {
				let payload = {
					"login": this.changedClientCode !== null && this.changedClientCode !== undefined ? this.changedClientCode : userId,
					"Segment": this.option == 'P1P2Clients' ? 'P1 or P2' : "P3"
				}
				this.subscription.add(
					this.dashBoardService
						.getP1P2P3ClientList(token, payload)
						.subscribe((res) => {
							this.tableDataOfP1P2P3(res)
						})
				)
			}
			else if(this.option == 'NotInvestedInMF'){
				// console.log(passObj);
				this.subscription.add(
					this.dashBoardService
						.getClientInvestedMF(token, passObj)
						.subscribe((res: any) => {
							if (res['Head']['ErrorCode'] == 0) {
							  this.allArrayData	= res['Body']['GetAAAClientNotInvestedData'];
							  this.tableDataDisplay1(this.allArrayData)
							}
							else{
								this.enableNext = false;
								this.dataArray = [];
								this.datas = [];
								this.dataLoad = true;
							}
							
						})
				)
			}

			else if(this.option == 'NotInvestedInSIP'){
				// console.log(passObj);
				this.subscription.add(
					this.dashBoardService
						.clientMfNotTraded(token, passObj)
						.subscribe((res: any) => {
							if (res['Head']['ErrorCode'] == 0) {
							  this.allArrayData	= res['Body'];
							  this.tableDataDisplay1(this.allArrayData)
							}
							else{
								this.enableNext = false;
								this.dataArray = [];
								this.datas = [];
								this.dataLoad = true;
							}
						})
					)
				}

				else if(this.option == 'EquityHoldingsAbove25L'){
						this.subscription.add(
							this.dashBoardService
								.getClientHolding25(token, passObj)
								.subscribe((res: any) => {
									if (res['Head']['ErrorCode'] == 0) {
									  this.allArrayData	= res['Body'];
									  this.tableDataDisplay1(this.allArrayData)
									}
									else{
									this.enableNext = false;
									this.dataArray = [];
									this.datas = [];
									this.dataLoad = true;
							}
						})
					)
				}

				else if(this.option == 'NCDorDebtHoldings'){					
					this.subscription.add(
						this.dashBoardService
							.getNcdMfHolding(token, passObj)
							.subscribe((res: any) => {
								if (res['Head']['ErrorCode'] == 0) {
								  this.allArrayData	= res['Body']['AAANCDorMFDEptHoldingResData'];
								  this.tableDataDisplay1(this.allArrayData)
								}
								else{
								this.enableNext = false;
								this.dataArray = [];
								this.datas = [];
								this.dataLoad = true;
						}
					})
				)
			}
			}

	birthDayFunc(res: any) {
		this.wait = false;
		if (res.length != 0) {

			if (res.length === 0) {
				this.enableNext = false;
				this.dataLoad = true;
			} else {
				this.dataArray = res['Body'];
				if (this.filterObj.PageNo === 1) {
					this.datas = [];
				}

				this.dataArray.forEach(element => {
					this.datas.push({
						ClientCode: element['ClientID'] ? element['ClientID'] : '-',
						ClientName: element['CLientName'] ? element['CLientName'] : '-',
						Mobile: element['Mobile'] ? element['Mobile'] : '-',
						EMail: element['EMail'] ? element['EMail'] : '-',
						DOB1: element['DOB1'] ? element['DOB1'] : '-',
						Group_CD: element['Group_CD'] ? element['Group_CD'] : '-',
					})
				});
				this.resetData = this.datas;
				if (this.dataArray.length > 49) {
					this.enableNext = true;
				}
				else {
					this.enableNext = false;
				}
				this.dataLoad = true;
			}
		} else {
			this.enableNext = false;
			this.dataArray = [];
			this.datas = [];
			this.dataLoad = true;
		}
	}


	tableDataDisplay1(resArray: any){
		this.wait = false;
			if (resArray.length === 0) {
				this.enableNext = false;
				this.dataLoad = true;
			} else {
				this.dataArray = resArray;
				if (this.filterObj.PageNo === 1) {
					this.datas = [];
				}
			
				this.dataArray.forEach(element => {
					if(this.option == 'NotInvestedInMF'){
						this.datas.push({
							ClientCode: element['ClientCode'] ? element['ClientCode'] : '-',
							ClientName: element['ClientName'] ? element['ClientName'] : '-',
							AUM: this.commonService.numberFormatWithCommaUnit(element.TotalEquityAUM),
							LedBal: element.LedgerBalance,
							Status: element.status
						})
					}
					else if(this.option == 'NotInvestedInSIP'){
						this.datas.push({
							ClientCode: element['ClientCode'] ? element['ClientCode'] : '-',
							ClientName: element['ClientName'] ? element['ClientName'] : '-',
							AUM: this.commonService.numberFormatWithCommaUnit(element.TotalMFAUM),
							LedBal: element.LedgerBalance,
							Status: element.status
						})
					}
					else if(this.option == 'EquityHoldingsAbove25L'){
						this.datas.push({
							ClientCode: element['ClientCode'] ? element['ClientCode'] : '-',
							ClientName: element['ClientName'] ? element['ClientName'] : '-',
							AUM: this.commonService.numberFormatWithCommaUnit(element.EquityAUM),
							Status: element.status
						})
					}
					else if(this.option == 'NCDorDebtHoldings'){
						this.datas.push({
							ClientCode: element['ClientCode'] ? element['ClientCode'] : '-',
 							ClientName: element['ClientName'] ? element['ClientName'] : '-',
 							AUM: this.commonService.numberFormatWithCommaUnit(element.DebtHoldingValue)
						})
					}
				
				});
				if(this.dataArray.length > 49){
					this.enableNext = true;
				}
				else{
					this.enableNext = false;
				}
				this.dataLoad = true;
		}
		
	}

	tableDataDisplay(res: any){
		this.wait = false;
		if (res['Head']['ErrorCode'] == 0) {

			if (res['Body']['data'].length === 0) {
				this.enableNext = false;
				this.dataLoad = true;
			} else {
				this.dataArray = res['Body']['data'];
				//this.aumEquityClientData = res['Body']['EquityClientAUM'];
				if (this.filterObj.PageNo === 1) {
					this.datas = [];
				}
			
				 
				this.dataArray.forEach(element => {
						this.datas.push({
							ClientCode: element['ClientCode'] ? element['ClientCode'] : '-',
							ClientName: element['ClientName'] ? element['ClientName'] : '-',
							AUM: this.option == 'PMSAIFLeadsCount' ? this.commonService.numberFormatWithCommaUnit(element['ClientTotalAUM']) : this.commonService.numberFormatWithCommaUnit(element['ClientDebtMFAUM']),
							Status: element['Status']
						})
				});
				
				if(this.dataArray.length > 49){
					this.enableNext = true;
				}
				else{
					this.enableNext = false;
				}
				this.dataLoad = true;
			}
		}
		else {
			this.enableNext = false;
			this.dataArray = [];
			//this.aumEquityClientData = [];
			this.datas = [];
			this.dataLoad = true;
		}
	}

	tableDataOfP1P2P3(res: any){
		this.wait = false;
		if (res['Head']['ErrorCode'] == 0) {

			if (res['Body'].length === 0) {
				this.enableNext = false;
				this.dataLoad = true;
			} else {
				this.dataArray = res['Body'];
				//this.aumEquityClientData = res['Body']['EquityClientAUM'];
				if (this.filterObj.PageNo === 1) {
					this.datas = [];
				}
			
					this.dataArray.forEach(element => {
						this.datas.push({
							ClientCode: element['ClientID'] ? element['ClientID'] : '-',
							ClientName: element['CLientName'] ? element['CLientName'] : '-',
							LastMeetingDate: element['LastmeetingDate'] ? element['LastmeetingDate'] : '-',
							LastMeetingDate1:new Date(element['LastmeetingDate']) ? new Date(element['LastmeetingDate']) : '-',
							MeetingSubject: element['Title'] ? element['Title'] : '-',
							Mobile:element['Mobile'] ? element['Mobile'] : '-',
							EMail:element['EMail'] ? element['EMail'] : '-',
							Group_CD: element['Group_code'] ? element['Group_code'] : '-'
						});
					});
					this.resetData = this.datas;
				
				if(this.dataArray.length > 49){
					this.enableNext = true;
				}
				else{
					this.enableNext = false;
				}
				this.dataLoad = true;
			}
		}
		else {
			this.enableNext = false;
			this.dataArray = [];
			//this.aumEquityClientData = [];
			this.datas = [];
			this.dataLoad = true;
		}
	}
	public loadData(event: any) {
		setTimeout(() => {
			event.target.complete();
			// App logic to determine if all data is loaded
			// and disable the infinite scroll
			/* if (this.data.length === this.filterObj['totalRecords']) {
			  event.target.disabled = true;
			} */
			// console.log(this.filterObj.PageNo);
			if (this.enableNext) {
				this.filterObj.PageNo += 1;
				this.getDataFromStorage(this.tokenValue, this.userIdValue);
				
			} 
			else event.target.disabled = true;
		}, 1000);

	}
	//  getButtons(srNo) {
	//     console.log(this.tableData);

	//         console.log(this.cardData1);
	//        // console.log(this.cardData1['fdValue']);
	//         //   this.cardSegments = [{name: 'No. of FDs', segmentValue:'totalNumber', data: this.cardData1['totalFd']},
	//         //     {name: 'FD Value (₹)', segmentValue:'totalValue', data: this.cardData1['fdValue']}] 
	//             this.datas =  this.tableData
	//             this.resetData = this.tableData
	//             //this.dataLoad = true;
	// }

	dismiss() {
		this.modalController.dismiss();
	}

	searchType(event: any) {
		if(this.filterApiCall == false){
			this.datas = this.resetData
			if (this.option == 'P1P2Clients' || this.option == 'otherclients' || this.option == 'Last30bday') {
				if (this.clientBlockSegmentValue == 'clientCode/clientName') {
					this.datas = this.datas.filter((item) => {
						return item.ClientCode.toLowerCase().includes(event.toLowerCase()) || item.ClientName.toLowerCase().includes(event.toLowerCase());
					});
				}
				else {
					this.datas = this.datas.filter((item) => {
						return item.Group_CD.toLowerCase().includes(event.toLowerCase());
					});
				}
			} else {
				if (this.clientBlockSegmentValue == 'clientCode') {
					this.datas = this.datas.filter((item) => {
						return item.ClientCode.toLowerCase().includes(event.toLowerCase());
					});
				}
				else {
					this.datas = this.datas.filter((item) => {
						return item.ClientName.toLowerCase().includes(event.toLowerCase());
					});
				}
			}
		}
	}

	searchTypeMobile(event: any) {
		if(this.filterApiCall == false){
			this.datas = this.resetData
			if (this.placeholderInput == 'Type Client Code') {
				this.datas = this.datas.filter((item) => {
					return item.ClientCode.toLowerCase().includes(event.toLowerCase());
				});
			}
			else if (this.placeholderInput == 'Type Name') {
				this.datas = this.datas.filter((item) => {
					return item.ClientName.toLowerCase().includes(event.toLowerCase());
				});
			}
		}
	

	}

	// filter popup for base on client code and name
	async filterOption(ev: any) {
		ev.stopPropagation();
		const popover = await this.popoverController.create({
			component: FilterPopupComponent,
			componentProps: { clientFilter: true },
			cssClass: "custom-popover filter-popover",
			mode: "md",
			showBackdrop: false,
			event: ev,
			//translucent: true
		});

		popover.onDidDismiss().then((data:any) => {
			if (data["data"]) {
				const response = data['data'];
				// console.log(response['passData']);

				this.searchTerm = ''
				if(this.filterApiCall == false){
					this.datas = this.resetData
				}
				
				if (response['passData'] === null) return;

				if (response['passData'] == 'clientCode') {
					this.placeholderInput = 'Type Client Code'
				}
				else if (response['passData'] == 'clientName') {
					this.placeholderInput = 'Type Name'
				}
				
				//this.clientBlockSegmentValue = response['passData']

			}
		})


		await popover.present();
	}

	// changeFilterType(filterValue) {
	//     this.datas = this.resetData
	//     this.dataLoad = false;

	//     if(filterValue == 'thirtyDays'){
	//         this.datas = this.datas.filter(function (el) {
	// 			return el.status == "Expires in 30 days";
	// 		});
	//     }else if(filterValue == 'sixtyDays'){
	//         this.datas = this.datas.filter(function (el) {
	// 			return el.status == "Expires in 60 days";
	// 		});
	//     }else{
	//         this.datas = this.datas.filter(function (el) {
	// 			return el.status == "Expired";
	// 		});
	//     }




	//     setTimeout(() => {
	//         this.dataLoad = true;
	//     }, 100);
	// }

	segmentChange() {
		this.searchTerm = '';

		if (this.filterApiCall == true) {
			this.enableNext = false;
			this.dataLoad = false;
			this.datas = [];
			this.filterObj.PageNo = 1;
			this.filterObj.SearchBy=null;
			this.filterObj.SearchText=null;
			this.getDataFromStorage(this.tokenValue, this.userIdValue)
		} else {
			this.datas = this.resetData
		}
		
		if (this.clientBlockSegmentValue === 'clientName') {
			this.placeholderInput = 'Type Name';

		} else if (this.clientBlockSegmentValue === 'clientCode') {
			this.placeholderInput = 'Type Client Code';
		} else if (this.clientBlockSegmentValue === 'Group_CD') {
			this.placeholderInput = 'Type Group Code';
		} else if (this.clientBlockSegmentValue === 'clientCode/clientName') {
			this.placeholderInput = 'Type Client Code/Name';
		}
	}

	// sorting function for column
	setOrder(value: string) {
		
		if (this.order === value) {
			this.reverse = !this.reverse;
		}
		this.order = value;
		if (this.reverse) {
			this.ascending = false;
		} else {
			this.ascending = true;
		}
		if(this.filterApiCall == true){

			if(value == 'dynamic'){
				value = this.sortId;
			}
			
			this.dataLoad = false;
			this.enableNext = false;
			this.datas = [];
			this.filterObj.PageNo = 1;
			this.filterObj.SortBy = value;
			this.filterObj.SortOrder = this.reverse == true ? 'desc' : 'asc';
			this.getDataFromStorage(this.tokenValue, this.userIdValue);
		}
	
	
	}

	
	setOrderDOB(value: string){ 		
		if (this.orderType === value) {
			this.reverse = !this.reverse;
		}
		this.orderType = value;
		if (this.reverse) {
			this.ascending = false;
			this.val = 'desc';
		} else {
			this.ascending = true;
			this.val = 'asc';
		}
	}

	searchText() {
		if(this.filterApiCall == true){
			this.enableNext = false;
			this.dataLoad = false;
			this.datas = [];
			this.filterObj.PageNo = 1;
			let obj = {
				SearchBy: this.placeholderInput == 'Type Client Code' ? 'clientCode': 'clientName',
				SearchText: this.searchTerm
			}

			this.getDataFromStorage(this.tokenValue, this.userIdValue,obj)
		}
	 }

	async goToClientDetails(data: any) {
		// console.log(data);
		//let checkClientCode = await this.commonService.matchClientCode(data.ClientCode);
		// if (checkClientCode) {
			this.modalController.dismiss();
			if (this.platform.is('desktop') || this.screenWidth > 1360) {
				const clientDetail = { ClientCode: data.ClientCode, ClientName: data.ClientName }
				localStorage.setItem('searchKey', "true")
				localStorage.setItem('searchObj', JSON.stringify(clientDetail))
				this.router.navigate(['/client-trades', 'clients']);
			}
			else{
				if (this.userTypeValue == 'RM' || this.userTypeValue == 'FAN') {
					this.router.navigate(['/client-details', data.ClientCode, data.ClientName.split(' ').join('-')]);
					}
					else{
					this.router.navigate(['/client-details', data.ClientCode, '-']);
				}
			}
			
		// }
		// else {
		// 	this.commonService.displyPopupText()
		// }
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
				this.getDataFromStorage(this.tokenValue, this.userIdValue,this.filterObj);
			}
	}
}
