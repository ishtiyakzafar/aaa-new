import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { OrderPipe } from 'ngx-order-pipe';
import { Subscription } from 'rxjs';
import { TotalAFYPService } from '../total-afyp/total-afyp.service';
import {IonContent, Platform } from '@ionic/angular';
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
	selector: 'app-afyp-general-insurance',
	providers: [TotalAFYPService],
	templateUrl: './afyp-general-insurance.component.html',
	styleUrls: ['./afyp-general-insurance.component.scss'],
})
export class AfypGeneralInsuranceComponent implements OnInit {
	@ViewChild(IonContent) content!: IonContent;
	@Input() sendDataOnSearch: any;
	@Input() searchType: any;
	@Input() searchText: any;
	@Input() toggleState: any;
	public ascending: boolean = true;
	public clientCode: any = null;
	private subscription: any;
	public userID: any = null;
	public totalSIP: any = null;
	public totalSIPValue: any = null;
	public ayfpLifeData: any = [];
	// public liveSIPData = [];
	public searchTerm: any = null;
	public dataLoad: boolean = false;
	public toggleVal: any;

	order: string = 'clientName';
	reverse: boolean = false;

	public datas: any[] = [
		// { clientId: 'PC1234567', clientName: 'Prashanjeet Chakravarty', ytd: '64.35 L', mtd: '64.35 K' },
		// { clientId: 'PC1234567', clientName: 'Abhijeet Chakravarty', ytd: '64.35 L', mtd: '54.35 K' },
		// { clientId: 'PC1234567', clientName: 'Rohit Chakravarty', ytd: '64.35 L', mtd: '94.35 K' },
		// { clientId: 'PC1234567', clientName: 'Niraj Chakravarty', ytd: '64.35 L', mtd: '34.35 K' },
	];

	filterObj: any = {
		PageNo: 1,
		SortBy: 'clientname',
		SortOrder: 'asc',
		SearchBy: '',
		SearchText: ''
	}

	public enableNext = false;

	public wait = false;

	constructor(private orderPipe: OrderPipe,
		private commonService: CommonService,
		private storage: StorageServiceAAA,
		private serviceFile: TotalAFYPService,
		private platform: Platform) { }

	ngOnChanges(){
		this.toggleVal = localStorage.getItem('toggleSwitch');
		this.storage.get('empCode').then(code => {
			this.clientCode = code;
		})
		if(this.sendDataOnSearch){
			if (!this.platform.is('desktop')) {
				this.content.scrollToTop();
			}
			this.enableNext = false;
			this.dataLoad = false;
			this.datas = [];
			this.filterObj.PageNo = 1;
			let obj = {
				SearchBy: this.searchType,
				SearchText: this.searchText
			}
			this.getDataFromStorage(obj)
		}	
	}

	ngOnInit() {
		this.toggleVal = localStorage.getItem('toggleSwitch');
		this.storage.get('userID').then((userID) => {
			this.userID = userID;
		})
		// this.getDataFromStorage();
		// this.orderPipe.transform(this.datas, 'clientName');
		// this.commonService.eventObservable.subscribe((obj) => {
		// 	console.log(obj);
			
		// 	if (obj && obj['event'] === 'totalAfypGeneralEvent') {
		// 		this.clientCode = obj['data']['clientCode'];
		// 		this.getDataFromStorage();
		// 		return;
		// 	} else if (obj && obj['event'] === 'generalSearchText' && !this.wait) {
		// 		this.wait = true;
		// 		const temp = obj['data'];
		// 		this.datas = [];
		// 		this.dataLoad = false;
		// 		this.getDataFromStorage(temp);
		// 		return;
		// 	}
		// })

		this.storage.get('empCode').then(code => {
			this.clientCode = code;
			this.dataLoad = false;
			if (this.clientCode) this.getDataFromStorage();
		})
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
			this.getDataFromStorage(this.filterObj);
		}
	}

	public getData(token: any, obj?: any) {
		this.subscription = new Subscription();
		// const params = {
		// 	Loginid: this.clientCode,
		// 	type: 'new'
		// }
		// this.dataLoad = false;

		let passObj: any = {};

		if (obj) {
			this.filterObj['SearchBy'] = (obj['SearchText'] == null || obj['SearchText'] == '' ? null : obj['SearchBy']);
			this.filterObj['SearchText'] = obj['SearchText'];
			this.filterObj['PageNo'] = obj['page'] ? obj['page'] : this.filterObj.PageNo;
			passObj = this.filterObj;
		} else passObj = this.filterObj;
		passObj['RMCode'] = this.clientCode !== null && this.clientCode !== undefined ? this.clientCode : this.userID;
		// passObj['RMCode'] = 'C1011';
		passObj['type'] = 'general';

		this.storage.get('empCode').then( code => {
		passObj['PartnerID'] = code !== null && code !== undefined ? code : this.userID;

		this.subscription.add(
			this.serviceFile
				.lifeInsurance(token, passObj)
				.subscribe((res: any) => {
					if (res['Head']['ErrorCode'] == 0) {

						this.wait = false;

						// this.liveSIPData = res['Body']['AAAClientwiseSIP'][0];
						if (res['Body']['GetAAAInsuranceDetailsData'].length === 0) {
							this.enableNext = false;
							this.dataLoad = true;
						} else {
							this.ayfpLifeData = res['Body']['GetAAAInsuranceDetailsData'];

							if (this.filterObj.PageNo === 1) {
								this.datas = [];
							}

							this.ayfpLifeData.forEach((element: any) => {
								this.datas.push({
									clientId: element['PolicyNo'] ? element['PolicyNo'] : '-',
									clientName: element['ClientName'] ? element['ClientName'] : '-',
									groupCode: element['GroupCode'] ? element['GroupCode'] : '-',
									mtd: element['MTDPremium'] ? this.commonService.numberFormatWithCommaUnit(+element['MTDPremium']) : '-',
									ytd: element['YTDPremium'] ? this.commonService.numberFormatWithCommaUnit(+element['YTDPremium']) : '-'
								})
							});

							this.enableNext = true;
							this.dataLoad = true;
						}
						if (res['Body']['GetAAAInsuranceDetailsData'].length < 49) {
							this.enableNext = false;
						}
						// this.totalSIP = this.commonService.formatNumberComma(this.liveSIPData['TotalSips']);
						// this.totalSIPValue = this.commonService.numberFormatWithCommaUnit(this.liveSIPData['TotalSIPValue']);

						// this.dataLoad = true;
					} else {
						this.wait = false;
						this.enableNext = false;
						// this.liveSIPData = [];
						this.ayfpLifeData = [];
						this.datas = [];
						this.dataLoad = true;
					}
				})
		)
	})
	}

	public getDataFromStorage(optionalParams?: any) {
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.getData(token, optionalParams);
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.getData(token, optionalParams);
				})
			}
		})
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
				this.getDataFromStorage();
				
			} 
			else event.target.disabled = true;
		}, 1000);

	}

	// sorting function for column
	setOrder(value: string) {
		
		if (this.order === value) {
			this.reverse = !this.reverse;
		}
		this.order = value;
		if (!this.platform.is('desktop')) {
			this.content.scrollToTop();
		}
		this.enableNext = false;
		this.dataLoad = false;
		this.datas = [];
		this.filterObj.PageNo = 1;
		this.filterObj.SortBy = value;
		this.filterObj.SortOrder = this.reverse ? 'asc' : 'desc';
		if (this.reverse) {
			this.ascending = true;
		} else {
			this.ascending = false;
		}
		this.getDataFromStorage();
	}

}
