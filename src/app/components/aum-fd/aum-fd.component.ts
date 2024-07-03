import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { OrderPipe } from 'ngx-order-pipe';
import { AUMService } from '../aum/aum.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { IonContent, Platform } from '@ionic/angular';
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
@Component({
	selector: 'app-aum-fd',
	providers: [AUMService],
	templateUrl: './aum-fd.component.html',
	styleUrls: ['./aum-fd.component.scss'],
})
export class AumFdComponent implements OnInit {
	@ViewChild(IonContent) content!: IonContent;
	@Input() sendDataOnSearch: any;
	@Input() searchType: any;
	@Input() searchText: any;
	@Input() toggleState: any;
    public ascending: boolean = false;
	public clientCode: any = null;
	private subscription: any;
	public userID: any = null;
	public totalClients: any = null;
	public totalAUM: any = null;
	public aumFDBondClientData: any = [];
	public aumFDBondData: any = [];
	public searchTerm: any = null;
	public dataLoad: boolean = false;
	public toggleVal: any;

	order: string = 'fdAum';
	reverse: boolean = false;
	public datas: any[] = [
	];

	filterObj: any = {
		PageNo: 1,
		SortBy: 'fdAum',
		SortOrder: 'desc',
		SearchBy: null,
		SearchText: null
	}

	public enableNext = false;

	public wait = false;
	userTypeValue:any;
	screenWidth:any;

	constructor(private orderPipe: OrderPipe,
		private commonService: CommonService,
		private storage: StorageServiceAAA,
		private serviceFile: AUMService,
		private router: Router,
		private platform: Platform
		) { }

		ngOnChanges(){
			this.toggleVal = localStorage.getItem('toggleSwitch');
			if(this.sendDataOnSearch){
				if (!this.platform.is('desktop')) {
					this.content.scrollToTop();
				}
				this.dataLoad = false;
				this.enableNext = false;
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
		this.screenWidth = window.innerWidth;
		this.storage.get('userID').then((userID) => {
			this.userID = userID;
		})
		// this.getDataFromStorage();
		/* this.commonService.eventObservable.subscribe((obj) => {
			if (obj && obj['event'] === 'fdEvent') {
				this.clientCode = obj['data']['clientCode'];
				this.getDataFromStorage();
				return;
			}
		})

		this.storage.get('empCode').then( code => {
			this.clientCode = code;
			this.getDataFromStorage();
			return;
		})
		
		this.storage.get('userID').then((userID) => {
			this.userID = userID;
			this.getDataFromStorage();
		}) */

		// this.commonService.eventObservable.subscribe((obj) => {
		// 	// if (obj && obj['event'] === 'fdEvent') {
		// 	// 	this.clientCode = obj['data']['clientCode'];
		// 	// 	this.getDataFromStorage();
		// 	// 	return;
		// 	// } else 
		// 	if (obj && obj['event'] === 'fdSearchText' && !this.wait) {
		// 		this.wait = true;
		// 		const temp = obj['data'];
		// 		this.datas = [];
		// 		this.dataLoad = false;
		// 		this.getDataFromStorage(temp);
		// 		return;
		// 	}
		// })

		// this.getDataFromStorage();

		this.storage.get('empCode').then( code => {
			this.clientCode = code;
			this.dataLoad = false;
			if (this.clientCode) this.getDataFromStorage();
		})
		
		// this.orderPipe.transform(this.datas, 'clientName');
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
		// this.dataLoad = false;

		let passObj: any = {};

		if (obj) {
			this.filterObj['SearchBy'] = (obj['SearchText'] == null || obj['SearchText'] == '' ? null : obj['SearchBy']);
			this.filterObj['SearchText'] = obj['SearchText'];
			this.filterObj['PageNo'] = obj['page'] ? obj['page'] : this.filterObj.PageNo;
			passObj = this.filterObj;
		} else passObj = this.filterObj;

		this.storage.get('empCode').then( code => {
			passObj['PartnerID'] = code !== null && code !== undefined ? code : this.userID;
			
			this.subscription.add(
				this.serviceFile
					.fdBond(token, passObj)
					.subscribe((res: any) => {
						this.wait = false;
						if (res['Head']['ErrorCode'] == 0) {

							this.aumFDBondData = res['Body']['AAAFDBondNCDTotalAUM'];
							if (res['Body']['AAAFDBondNCDClientwise'].length === 0) {
								this.enableNext = false;
								this.dataLoad = true;
							} else {
								this.aumFDBondClientData = res['Body']['AAAFDBondNCDClientwise'];
								if (this.filterObj.PageNo === 1) {
									this.datas = [];
								}
								this.aumFDBondClientData.forEach((element: any) => {
									this.datas.push({
										clientId: element['ClientCode'] ? element['ClientCode'] : '-',
										clientName: element['ClientName'] ? element['ClientName'] : '-',
										groupCode: element['GroupCode'] ? element['GroupCode'] : '-',
										fdAum: this.commonService.numberFormatWithCommaUnit(element['ClientFDAUM']),
										bondsAum: this.commonService.numberFormatWithCommaUnit(element['ClientBondAUM']),
										ncdAum: this.commonService.numberFormatWithCommaUnit(+element['ClientNCDAUM'])
									})
								});
								this.enableNext = true;
								this.dataLoad = true;
							}
							// this.totalClients = this.commonService.formatNumberComma(this.aumFDBondData['TotalClients']);
							this.totalAUM = this.commonService.numberFormatWithCommaUnit(this.aumFDBondData['TotalFDAUM'] + this.aumFDBondData['TotalBondAUM'] + this.aumFDBondData['TotalNCDAUM']);

						} else {
							this.enableNext = false;
							this.aumFDBondData = [];
							this.aumFDBondClientData = [];
							this.datas = [];
							this.dataLoad = true;
						}
					})
			)
		})
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

	//sorting function for column
	setOrder(value: string) {
		if (this.order === value) {
			this.reverse = !this.reverse;
		}
		this.order = value;
		if (!this.platform.is('desktop')) {
			this.content.scrollToTop();
		}
		this.dataLoad = false;
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
		this.getDataFromStorage();
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

	ngOnDestroy() {
		this.subscription = this.subscription.unsubscribe();
	}

	// ionViewWillLeave(){
	// 	this.commonService.clearEvent();
	// }

	// ngOnDestroy() {
	// 	this.commonService.clearEvent();
	// }
}
