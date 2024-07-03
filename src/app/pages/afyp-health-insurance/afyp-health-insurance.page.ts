import { Component, OnInit } from '@angular/core';
import { OrderPipe } from 'ngx-order-pipe';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { TotalAFYPService } from '../../components/total-afyp/total-afyp.service';
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
	selector: 'app-afyp-health-insurance',
	providers: [TotalAFYPService],
	templateUrl: './afyp-health-insurance.page.html',
	styleUrls: ['./afyp-health-insurance.page.scss'],
})
export class AfypHealthInsurancePage implements OnInit {
	/* public ascending: boolean = true;
	order: string = '';
	reverse: boolean = false;
	public datas: any[] = [
		{ clientId: 'PC1234567', clientName: 'Prashanjeet Chakravarty', ytd: '64.35 L', mtd: '64.35 K' },
		{ clientId: 'PC1234567', clientName: 'Abhijeet Chakravarty', ytd: '64.35 L', mtd: '54.35 K' },
		{ clientId: 'PC1234567', clientName: 'Rohit Chakravarty', ytd: '64.35 L', mtd: '94.35 K' },
		{ clientId: 'PC1234567', clientName: 'Niraj Chakravarty', ytd: '64.35 L', mtd: '34.35 K' },
	];
	public placeholderInput: string = 'Type Client Code / PAN';
	public isSearchVisible: boolean = false;
	public clientBlockSegmentValue: string = "client";
	public segmentButtonOption: any[] = [
		{name: 'Client Code / PAN', value: 'client'},
		{name: 'Name', value: 'name'}
	] */

	public ascending: boolean = true;
	public clientCode: any = null;
	private subscription: any;
	public userID: any = null;
	public totalSIP: any = 0;
	public totalSIPValue: any = 0;
	public ayfpLifeData: any = [];
	public searchTerm: any = null;
	public dataLoad: boolean = false;
	public placeholderInput: string = 'Type Client Name';
	order: string = '';
	reverse: boolean = false;
	public datas: any[] = [
	];

	public clientBlockSegmentValue: string = "clientName";
	public segmentButtonOption: any[] = [
		// { name: 'Client Code / PAN', value: 'clientCode' },
		{ name: 'Name', value: 'clientName' }
	]

	filterObj: any = {
		PageNo: 1,
		SortBy: 'clientName',
		SortOrder: 'asc',
		SearchBy: null,
		SearchText: null
	}

	public searchValue = null;

	public wait = false;

	public enableNext = false;

	constructor(private orderPipe: OrderPipe,
		private commonService: CommonService,
		private storage: StorageServiceAAA,
		private serviceFile: TotalAFYPService,
		private router: Router) { }

	ngOnInit() {
		// this.orderPipe.transform(this.datas, 'clientName');
		this.storage.get('empCode').then(code => {
			this.clientCode = code;
			if (code) this.getDataFromStorage();
			else {
				this.storage.get('userID').then((userID) => {
					this.userID = userID;
					this.getDataFromStorage();
				})
			}
		})
	}

	segmentChange() {
		if (this.clientBlockSegmentValue === 'name') {
			this.placeholderInput = 'Type Name';
		} else {
			this.placeholderInput = 'Type Client Code / PAN';
		}
	}

	// toggle search block on click search icon
	// toggleSearch() {
	//     this.isSearchVisible = !this.isSearchVisible;
	// }

	public getData(token: any) {
		this.subscription = new Subscription();
		// const params = {
		// 	Loginid: this.clientCode !== null && this.clientCode !== undefined ? this.clientCode : this.userID,
		// 	type: 'new'
		// }
		// this.dataLoad = false;
		let passObj: any = {};

		passObj = this.filterObj;
		passObj['RMCode'] = this.clientCode !== null && this.clientCode !== undefined ? this.clientCode : this.userID;
        // passObj['Clientcode'] = this.clientCode !== null && this.clientCode !== undefined ? this.clientCode : this.userID;
		// passObj['Clientcode'] = '';
		passObj['Type'] = 'health';
		// passObj['Loginid'] = this.clientCode !== null && this.clientCode !== undefined ? this.clientCode : this.userID;
		this.subscription.add(
			this.serviceFile
				.lifeInsurance(token, passObj)
				.subscribe((res: any) => {
					if (res['Head']['ErrorCode'] == 0) {
						this.wait = false;
						// const count = res['Body'];

						if (res['Body']['GetAAAInsuranceDetailsData'].length === 0) {
							this.enableNext = false;
							this.dataLoad = true;
							// this.datas = [];
						} else {
							this.ayfpLifeData = res['Body']['GetAAAInsuranceDetailsData'];

							if (this.filterObj.PageNo === 1) {
								this.datas = [];
							}
							this.ayfpLifeData.forEach((element: any) => {
								this.datas.push({
									clientId: element['PolicyNo'] ? element['PolicyNo'] : '-',
									clientName: element['ClientName'] ? element['ClientName'] : '-',
									mtd: element['MTDPremium'] ? this.commonService.numberFormatWithCommaUnit(+element['MTDPremium']) : '-',
									ytd: element['YTDPremium'] ? this.commonService.numberFormatWithCommaUnit(+element['YTDPremium']) : '-'
								})
							});
							
							this.enableNext = true;
							this.dataLoad = true;
						}
						// this.totalSIP = this.commonService.formatNumberComma(count['TotalSIP']);
						// this.totalSIPValue = this.commonService.numberFormatWithCommaUnit(count['TotalSIPAmount']);

						// this.dataLoad = true;
					} else {
						this.enableNext = false;
						// this.bouncedSIPCount = [];
						this.ayfpLifeData = [];
						this.datas = [];
						this.dataLoad = true;
					}
				})
		)
	}

	public getDataFromStorage() {
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.getData(token);
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.getData(token);
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
			if (this.enableNext) {
				this.filterObj.PageNo += 1;
				// this.getData();
				this.getDataFromStorage();
			} else event.target.disabled = true;
		}, 1000);

	}

	public searchFilter() {
		if (this.searchValue === null || this.searchValue === '' || this.searchValue === undefined) {
			this.filterObj = {
				PageNo: 1,
				SortBy: 'clientName',
				SortOrder: 'asc',
				SearchBy: null,
				SearchText: null
			}
			this.dataLoad = false;
			this.datas = [];
			this.enableNext = false;
			this.getDataFromStorage();
		} else {
			this.filterObj['SearchText'] = this.searchValue;
			this.filterObj['SearchBy'] = this.clientBlockSegmentValue;
			this.filterObj['PageNo'] = 1;
			this.dataLoad = false;
			this.datas = [];
			this.enableNext = false;
			this.getDataFromStorage();
		}
	}

	// sorting function for column
	setOrder(value: string) {
		if (this.datas.length) {
			this.dataLoad = false;
			if (this.order === value) {
				this.reverse = !this.reverse;
			}
			this.order = value;
			
			this.datas = [];
			this.filterObj.PageNo = 1;
			this.filterObj.SortBy = value;
			this.filterObj.SortOrder = this.reverse ? 'asc' : 'desc';
            if (this.reverse) {
                this.ascending = true;
            } else {
                this.ascending = false;
            }
			if (!this.wait) {
				this.wait = true;			
				this.getDataFromStorage();
			}
		} else return;
	}

	public goBack() {
		window.history.back();
	}

}
