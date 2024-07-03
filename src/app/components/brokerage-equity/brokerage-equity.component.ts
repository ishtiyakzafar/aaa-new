import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { OrderPipe } from 'ngx-order-pipe';
import { Subscription } from 'rxjs';
import { BrokerageService } from '../brokerage/brokerage.service';
import { Router } from '@angular/router';
import {IonContent, Platform } from '@ionic/angular';
import { CommonService } from '../../helpers/common.service';
import { DashBoardService } from '../../pages/dashboard/dashboard.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { ToasterService } from '../../helpers/toaster.service';

@Component({
  selector: 'app-brokerage-equity',
  providers: [ BrokerageService ],
  templateUrl: './brokerage-equity.component.html',
  styleUrls: ['./brokerage-equity.component.scss'],
})
export class BrokerageEquityComponent implements OnInit {
	@ViewChild(IonContent) content!: IonContent;
	@Input() sendDataOnSearch: any;
	@Input() searchType: any;
	@Input() searchText: any;
	@Input() toggleState: any;
    public ascending: boolean = true;
	public clientCode: any = null;
    private subscription: any;
	public userID: any = null;
	public totalClients: any = null;
	public totalAUMValue: any = null;
	public brokerageListData: any = [];
	public totalBrokerageData: any = [];
	public searchTerm: any = null;
	public dataLoad = false;
	public rptLoad = false;
	public dashboardDetailsData: any;
	order: string = 'clientName';
	reverse: boolean = false;
	public datas: any[] = [
	];

	filterObj = {
		PageNo: 1,
		SortBy: 'clientcode',
		SortOrder: 'asc',
		SearchBy: null,
		SearchText: null,
		Product: "equity"
	}

	public enableNext = false;

	public wait = false;
	
	userTypeValue:any;
	screenWidth:any;


	constructor(private orderPipe: OrderPipe,
		public commonService: CommonService,
		private storage: StorageServiceAAA,
		private serviceFile: BrokerageService,
		private dashBoardService: DashBoardService,
		private router: Router,
		public toast: ToasterService,
		private platform: Platform) { }

		ngOnChanges(){
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
		this.screenWidth = window.innerWidth;
		this.storage.get('userID').then((userID) => {
			this.userID = userID;
		})

		// this.getDataFromStorage()
		/* this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.getData(token);
				})
			} else {
				this.storage.get('sToken').then(token => {
					this.getData(token);
				})
			}
		}) */

		//this.getDataFromStorage();

		// this.commonService.eventObservable.subscribe((obj) => {
		// 	if (obj && obj['event'] === 'brokerageEquityEvent') {
		// 		this.clientCode = obj['data']['clientCode'];
		// 		this.getDataFromStorage();
		// 		return;
		// 	} else if (obj && obj['event'] === 'brokerageEquitySearchText' && !this.wait) {
		// 		this.wait = true;
		// 		const temp = obj['data'];
		// 		this.datas = [];
		// 		this.dataLoad = false;
		// 		this.getDataFromStorage(temp);
		// 		return;
		// 	}
		// })
		this.storage.get('empCode').then( code => {
			if(code == null){
				this.clientCode = localStorage.getItem('userId1');
			}
			else{
				this.clientCode = code;
			}
			
			if (this.clientCode) {
				this.getDataFromStorage();
			}
		})
		// this.orderPipe.transform(this.datas, 'clientName');
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
		if (!this.searchText) {
			const body = {
				'LoginID' : localStorage.getItem('userId1'),
				'PartnerID' : this.clientCode !== null && this.clientCode !== undefined ? this.clientCode : this.userID,
				'Datatype' : this.toggleState,
				'Role' : localStorage.getItem('userChannel'),
				'UserType' : localStorage.getItem('userType')
			}
			this.dashBoardService.getBrokerageDetails(token, body).subscribe((res: any) => {
				let cards = [];
				if (res['Head']['ErrorCode'] == 0) {
					this.dashboardDetailsData = res['Body']['objGetAAABrokeragedetailsDataBody'][0];
				}
			});

	
		}
		const params = {
			Loginid: this.clientCode !== null && this.clientCode !== undefined ? this.clientCode : this.userID,
			Product: 'equity'
		}
		this.dataLoad = false;
		let passObj: any = {};

		if (obj) {
			this.filterObj['SearchBy'] = (obj['SearchText'] == null || obj['SearchText'] == '' ? null : obj['SearchBy']);
			this.filterObj['SearchText'] = obj['SearchText'];
			this.filterObj['PageNo'] = obj['page'] ? obj['page'] : this.filterObj.PageNo;
			passObj = this.filterObj;
		} else passObj = this.filterObj;
		//passObj['Loginid'] = "C9685"	
		passObj['Product'] = 'equity';
		passObj['Loginid'] = localStorage.getItem('userId1'),
		passObj['PartnerID'] = this.clientCode !== null && this.clientCode !== undefined ? this.clientCode : this.userID;
		passObj['Datatype'] = this.toggleState;
		passObj['Role'] = localStorage.getItem('userChannel')
		passObj['UserType'] = localStorage.getItem('userType')
		this.subscription.add(
			this.serviceFile
				.getBrokerageDetails(token, passObj)
				.subscribe((res: any) => {
					if (res['Head']['ErrorCode'] == 0) {
						// if(res && res['Body'] && res['Body']['objGetAAABrokeragedetailsDataBody'] && res['Body']['objGetAAABrokeragedetailsDataBody'][0]){
						// 	this.dashboardDetailsData = res['Body']['objGetAAABrokeragedetailsDataBody'][0];
						// }
						this.wait = false;
						this.totalBrokerageData = res['Body']['Clientwisebrokerage'][0];

						if (res['Body']['ClientwisebrokerageList'].length === 0) {
							this.enableNext = false;
							this.dataLoad = true;
						} else {
							this.brokerageListData = res['Body']['ClientwisebrokerageList'];

							if (this.filterObj.PageNo === 1) {
								this.datas = [];
							}

							this.brokerageListData.forEach((element: any) => {
								this.datas.push({
									clientId: element['ClientCode'] ? element['ClientCode'] : '-',
									clientName: element['ClientName'] ? element['ClientName'] : '-',
									mtd: this.commonService.numberFormatWithCommaUnit(element['MTDBrokerage']),
									ytd: this.commonService.numberFormatWithCommaUnit(element['YTDBrokerage']),
									inception: this.commonService.numberFormatWithCommaUnit(element['SinceInceptionBrokerage'])
								})
							});
							this.enableNext = true;
							this.dataLoad = true;
						}
						this.totalClients = this.commonService.formatNumberComma(this.totalBrokerageData['TotalClients']);
						this.totalAUMValue = this.commonService.numberFormatWithCommaUnit(this.totalBrokerageData['TotalBrokerage']);

					} else {
						this.enableNext = false;
						this.totalBrokerageData = [];
						this.brokerageListData = [];
						this.datas = [];
						this.dataLoad = true;
					}
				})
		)
	}

	public getDataFromStorage(optionalParams?: any) {
		this.storage.get('userType').then(type => {
			this.userTypeValue = type;
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

	async goToClientDetails(data: any){
		//let checkClientCode = await this.commonService.matchClientCode(data.clientId);
		// if(checkClientCode){
			if (this.platform.is('desktop') || this.screenWidth > 1360) {
				const clientDetail = {ClientCode: data.clientId, ClientName: data.clientName}
				localStorage.setItem('searchKey',"true")
				localStorage.setItem('searchObj', JSON.stringify(clientDetail))
				this.router.navigate(['/client-trades', 'clients']);
			}
			else {
				if (this.userTypeValue == 'RM' || this.userTypeValue == 'FAN') {
				this.router.navigate(['/client-details', data.clientId, data.clientName.split(' ').join('-')]);
				}
				else{
				this.router.navigate(['/client-details', data.clientId, '-']);
				}
			}
		// }
		// else{
		// 	this.commonService.displyPopupText()
		// }
	}
}
